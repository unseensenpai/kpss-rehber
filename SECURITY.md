# Security

**English** · [Türkçe](SECURITY.tr.md)

KPSS Rehber is a fully static site: there is no server, account system, cookies or analytics. A student's progress is kept only in their own browser (localStorage) and is never sent anywhere.

## Reporting a vulnerability

If you find a security issue, please **do not open a public issue**. Report it privately through the repository's **Security → Report a vulnerability** link instead. Please include:

- A short description of the issue and its impact
- Steps to reproduce (page address, browser)
- A suggested fix, if you have one

Reports get a reply within 7 days. Please keep the details private until a fix is published.

## Scope

- The site itself (`https://unseensenpai.github.io/kpss-rehber/`) and the code in this repository
- In particular: running scripts past the CSP, XSS through prompt cards or a backup file, leaking user data

Linked external sites such as ChatGPT, Claude and ÖSYM are out of scope.
