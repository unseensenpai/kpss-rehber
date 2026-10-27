#!/usr/bin/env node
// Weekly source check: compares ÖSYM documents with data/sources.json.
//
//   node tools/source-check.mjs                 print findings (dry run)
//   node tools/source-check.mjs --issues        open GitHub issues for new findings (needs GITHUB_TOKEN, GITHUB_REPOSITORY)
//   node tools/source-check.mjs --accept <id>   record the current hash of a reviewed source
//
// Content is never changed automatically; --accept only updates sha256 and checkedAt after a human review.

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import {
  LABEL, USER_AGENT, announcementLinks, checkSource, documentLinks, extractLinks, findingKey,
  groupFindings, groupKeys, isBlockPage, isBookletPage, issueFor, newDocuments, silencedKeys,
} from './lib/source-check.js';

const SOURCES = new URL('../data/sources.json', import.meta.url);
const WATCH = new URL('../data/source-watch.json', import.meta.url);
const TIMEOUT_MS = 60_000;
const PAUSE_MS = 1_000;

const pause = () => new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));
const today = () => new Date().toISOString().slice(0, 10);

async function request(url, attempts = 2) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': USER_AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') ?? '';
    const blocked = contentType.includes('html') && isBlockPage(body.toString('utf8'));
    return { status: response.status, contentType, body, blocked };
  } catch (error) {
    // Large PDFs occasionally drop mid-download; one retry avoids false alarms.
    if (attempts > 1) { await pause(); return request(url, attempts - 1); }
    const cause = error.cause?.code ?? error.cause?.message;
    return { error: error.name === 'TimeoutError' ? 'timeout' : [error.message, cause].filter(Boolean).join(': ') };
  }
}

async function fetchSource(url) {
  const response = await request(url);
  if (response.body) response.sha256 = createHash('sha256').update(response.body).digest('hex');
  return response;
}

async function fetchPage(url) {
  const response = await request(url);
  if (response.error) return { error: response.error };
  if (response.blocked) return { error: 'block page' };
  if (response.status !== 200) return { error: `HTTP ${response.status}` };
  return { html: response.body.toString('utf8') };
}

async function findings() {
  const sources = await readJson(SOURCES);
  const watch = await readJson(WATCH);
  const minYear = Math.max(...sources.map((s) => s.year));
  const result = [];

  for (const source of sources) {
    const finding = checkSource(source, await fetchSource(source.url));
    if (finding) result.push(finding);
    await pause();
  }

  const found = [];
  for (const page of watch.pages) {
    const group = await fetchPage(page);
    await pause();
    if (group.error) { result.push({ kind: 'blocked', url: page, reason: group.error }); continue; }
    const groupLinks = extractLinks(group.html, page);
    found.push(...documentLinks(groupLinks, { minYear }).map((link) => ({ ...link, page })));
    const site = new URL(page).origin;
    for (const announcement of announcementLinks(groupLinks, { site, minYear })) {
      const detail = await fetchPage(announcement.url);
      await pause();
      if (detail.error) { result.push({ kind: 'blocked', url: announcement.url, reason: detail.error }); continue; }
      const links = extractLinks(detail.html, announcement.url);
      const all = isBookletPage(announcement.url);
      found.push(...documentLinks(links, { minYear, all }).map((link) => ({ ...link, page: announcement.url })));
    }
  }
  result.push(...newDocuments(found, sources, watch.ignore));
  return result;
}

async function github(path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}${path}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'x-github-api-version': '2022-11-28',
      ...(options.body ? { 'content-type': 'application/json' } : {}),
    },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`GitHub ${options.method ?? 'GET'} ${path}: ${response.status} ${await response.text()}`);
  }
  return response;
}

async function existingIssues() {
  const issues = [];
  for (let page = 1; ; page++) {
    const batch = await (await github(`/issues?labels=${LABEL}&state=all&per_page=100&page=${page}`)).json();
    issues.push(...batch);
    if (batch.length < 100) return issues;
  }
}

async function ensureLabel() {
  const response = await github(`/labels/${LABEL}`);
  if (response.status !== 404) return;
  await github('/labels', {
    method: 'POST',
    body: JSON.stringify({ name: LABEL, color: '1d76db', description: 'Yeni ya da değişen ÖSYM belgesi / New or changed ÖSYM document' }),
  });
}

async function openIssues(list) {
  await ensureLabel();
  const silenced = silencedKeys(await existingIssues());
  const fresh = list.filter((finding) => {
    const key = findingKey(finding);
    if (silenced.has(key)) console.log(`skip (already reported): ${key}`);
    return !silenced.has(key);
  });
  for (const group of groupFindings(fresh)) {
    const response = await github('/issues', { method: 'POST', body: JSON.stringify({ ...issueFor(group), labels: [LABEL] }) });
    console.log(`opened ${(await response.json()).html_url}: ${groupKeys(group).join(', ')}`);
  }
}

async function accept(id) {
  const sources = await readJson(SOURCES);
  const source = sources.find((s) => s.id === id);
  if (!source) throw new Error(`Unknown source id: ${id}`);
  const response = await fetchSource(source.url);
  const finding = checkSource({ ...source, sha256: response.sha256 }, response);
  if (finding) throw new Error(`Cannot accept ${id}: ${finding.kind} (${finding.reason ?? finding.status})`);
  source.sha256 = response.sha256;
  source.checkedAt = today();
  await writeFile(SOURCES, `${JSON.stringify(sources, null, 2)}\n`);
  console.log(`${id}: sha256 ${response.sha256}, checkedAt ${source.checkedAt}`);
}

function print(list) {
  if (!list.length) { console.log('No findings: every source matches and no new documents were found.'); return; }
  const groups = groupFindings(list);
  for (const group of groups) {
    const { title, body } = issueFor(group);
    console.log(`\n# ${title}\n${body.split('\n---')[0].trim()}`);
  }
  console.log(`\n${list.length} finding(s) in ${groups.length} issue(s).`);
}

const args = process.argv.slice(2);
try {
  if (args[0] === '--accept') {
    if (!args[1]) throw new Error('Usage: --accept <source id>');
    await accept(args[1]);
  } else {
    if (args.includes('--issues') && (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPOSITORY)) {
      throw new Error('--issues needs GITHUB_TOKEN and GITHUB_REPOSITORY');
    }
    const list = await findings();
    print(list);
    if (args.includes('--issues')) await openIssues(list);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
