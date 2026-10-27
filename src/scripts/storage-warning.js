import { storageAvailable } from './profile-store.js';

// Without storage the site works but progress is not saved; say so on every page.
if (!storageAvailable()) {
  for (const el of document.querySelectorAll('[data-storage-warning]')) el.hidden = false;
}
