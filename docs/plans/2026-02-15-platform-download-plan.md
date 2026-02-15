# Platform-Aware Download Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add platform-aware download buttons to the submersion.app website and download badges to the README, using the GitHub Releases API to always link to the latest release.

**Architecture:** Client-side JS fetches the GitHub Releases API on page load, detects the visitor's OS via `navigator.userAgent`, and renders a primary download button for their platform plus secondary buttons for all others. The HTML provides a static fallback that works without JS. The README gets shields.io badges linking to the releases page.

**Tech Stack:** Vanilla HTML/CSS/JS (no build step, no dependencies). GitHub REST API (public, unauthenticated). shields.io for README badges.

**Design doc:** `website/docs/plans/2026-02-15-platform-download-design.md`

---

### Task 1: Add download section HTML to index.html

**Files:**
- Modify: `website/index.html:41-51` (nav links - add Download link)
- Modify: `website/index.html:243-275` (replace `#get` section with `#download`)

**Step 1: Add "Download" to the nav links**

In `website/index.html`, find the nav links div (line 41). Add a Download link before the GitHub button:

```html
        <div class="nav__links">
          <a href="#why">Why</a>
          <a href="#features">Features</a>
          <a href="#screens">Screens</a>
          <a href="#support">Support</a>
          <a href="#download">Download</a>
          <a class="btn btn--small" href="https://github.com/submersion-app/submersion" target="_blank" rel="noreferrer">
```

**Step 2: Replace the `#get` CTA section with `#download`**

Replace the entire `<section class="section section--cta" id="get">` block (lines 243-275) with:

```html
      <section class="section section--cta" id="download">
        <div class="container">
          <div class="download">
            <div class="section__head">
              <h2>Download Submersion</h2>
              <p>
                Open-source and privacy-focused. Your data stays on your device. No accounts required.
              </p>
            </div>

            <a
              id="download-primary"
              class="download__primary btn"
              href="https://github.com/submersion-app/submersion/releases"
              target="_blank"
              rel="noreferrer"
            >
              <span id="download-primary-icon"></span>
              <span>
                <span id="download-primary-label">Download</span>
                <small id="download-primary-meta" class="download__version"></small>
              </span>
            </a>

            <div class="download__secondary" id="download-secondary">
              <p class="download__secondary-label">All platforms:</p>
              <div class="download__platforms" id="download-platforms"></div>
            </div>

            <div class="download__fallback">
              <a href="https://github.com/submersion-app/submersion" target="_blank" rel="noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
              <a href="https://github.com/submersion-app/submersion#quick-start" target="_blank" rel="noreferrer">
                Build Instructions
              </a>
            </div>
          </div>

          <footer class="footer">
            <p>
              &copy; <span data-year></span> Submersion. Open-source software licensed under GPL&#8209;3.0.
            </p>
          </footer>
        </div>
      </section>
```

Key details:
- `id="download-primary"` is the main button, its `href` defaults to releases page (JS-free fallback)
- `id="download-primary-icon"` is an empty span that JS fills with the platform SVG icon
- `id="download-primary-label"` defaults to "Download" and JS updates to "Download for macOS"
- `id="download-primary-meta"` is empty by default, JS fills with "v1.0.0-beta.31 - 49 MB"
- `id="download-platforms"` is empty, JS populates with platform buttons
- The fallback links (GitHub + Build Instructions) are always visible

**Step 3: Verify the page loads without JS errors**

Open `website/index.html` in a browser. The download section should show with:
- "Download" as the primary button text (no platform detected without JS)
- Empty secondary row (JS not run yet)
- GitHub and Build Instructions links visible

**Step 4: Commit**

```bash
cd /Users/ericgriffin/repos/submersion-app/website
git add index.html
git commit -m "feat: add download section HTML with static fallback"
```

---

### Task 2: Add download section CSS to styles.css

**Files:**
- Modify: `website/styles.css` (add new rules before the responsive media queries at line 484)

**Step 1: Add the download section styles**

Insert the following CSS before the `/* Responsive */` comment (line 484) in `website/styles.css`:

```css
/* Download section */
.download {
  text-align: center;
  padding: 20px 0;
}

.download .section__head {
  margin-bottom: 24px;
}

.download__primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  font-size: 17px;
  border-radius: 16px;
}

.download__primary svg {
  flex-shrink: 0;
}

.download__version {
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
  margin-top: 2px;
}

.download__secondary {
  margin-top: 20px;
}

.download__secondary-label {
  color: var(--faint);
  font-size: 13px;
  margin: 0 0 10px;
}

.download__platforms {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.download__platform {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}

.download__platform:hover {
  background: var(--card2);
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--text);
  text-decoration: none;
}

.download__platform svg {
  flex-shrink: 0;
}

.download__platform--active {
  border-color: rgba(50, 160, 170, 0.4);
  background: rgba(50, 160, 170, 0.08);
  color: var(--text);
}

.download__fallback {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  color: var(--faint);
  font-size: 13px;
}

.download__fallback a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.download__fallback a:hover {
  color: var(--text);
}
```

**Step 2: Add responsive rules for download section**

Add these rules inside the existing `@media (max-width: 560px)` block (around line 508):

```css
  .download__primary {
    width: 100%;
  }

  .download__platforms {
    justify-content: center;
  }
```

**Step 3: Verify styling**

Open `website/index.html` in a browser. The download section should:
- Be centered with the primary button prominent
- Show fallback links below
- On mobile width (<560px), the primary button should be full-width

**Step 4: Commit**

```bash
cd /Users/ericgriffin/repos/submersion-app/website
git add styles.css
git commit -m "feat: add download section CSS with responsive layout"
```

---

### Task 3: Implement JavaScript - platform detection and GitHub API

**Files:**
- Modify: `website/script.js` (rewrite with download logic, preserve year logic)

**Step 1: Write the complete script.js**

Replace the entire contents of `website/script.js` with the implementation below.

SECURITY NOTE: The SVG icons in this script are hardcoded string constants defined by us (not from user input or API responses). They are safe to insert via DOM methods. The API response data (tag name, file size) is inserted using `textContent` only, never as HTML. Platform button labels come from our hardcoded PLATFORMS config, not from external data.

```js
(() => {
  // Year display
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  // Platform configuration
  const REPO = 'submersion-app/submersion';
  const RELEASES_URL = 'https://github.com/' + REPO + '/releases';
  const API_URL = 'https://api.github.com/repos/' + REPO + '/releases';

  const PLATFORMS = {
    macos:   { suffix: '-macOS.dmg',    label: 'macOS',   icon: 'apple' },
    windows: { suffix: '-Windows.zip',  label: 'Windows', icon: 'windows' },
    linux:   { suffix: '-Linux.tar.gz', label: 'Linux',   icon: 'linux' },
    android: { suffix: '-Android.apk',  label: 'Android', icon: 'android' },
    ios:     { suffix: '-iOS.ipa',      label: 'iOS',     icon: 'apple' },
  };

  // Hardcoded SVG icon strings (trusted, not from external input)
  var ICONS = {};
  ICONS.apple = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
  ICONS.windows = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>';
  ICONS.linux = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.868.074 1.741-.136 2.393-.523.654-.4 1.086-.926 1.178-1.602.066-.534.054-1.134-.073-1.69.097-.1.178-.264.23-.396.285-.795-.049-1.597-.285-2.095-.149-.266-.397-.467-.574-.734-.201-.266-.432-.332-.66-.554-.118-.133-.211-.2-.295-.4-.09-.201-.07-.401-.07-.601 0-.268-.009-.469-.036-.669-.046-.399-.091-.731-.02-1.136.07-.405.209-.748.23-1.468.02-1.535-.658-3.168-1.628-4.382-1.476-1.884-1.457-2.252-1.457-4.148 0-2.1-.937-3.602-3.117-3.734a3.432 3.432 0 00-.372-.013"/></svg>';
  ICONS.android = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341a1 1 0 01-.996-.996 1 1 0 01.996-.996 1 1 0 01.997.996 1 1 0 01-.997.996m-11.046 0a1 1 0 01-.997-.996 1 1 0 01.997-.996 1 1 0 01.996.996 1 1 0 01-.996.996m11.405-6.02l1.99-3.44a.416.416 0 00-.152-.567.416.416 0 00-.568.152L17.12 8.95c-1.546-.7-3.273-1.09-5.12-1.09-1.848 0-3.575.39-5.12 1.09L4.847 5.466a.416.416 0 00-.567-.152.416.416 0 00-.153.567l1.99 3.44C2.688 11.186.343 14.681 0 18.761h24c-.344-4.08-2.688-7.575-6.118-9.44"/></svg>';
  ICONS.download = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

  function detectPlatform() {
    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';
    if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) || /Mac OS X/i.test(ua)) return 'macos';
    if (/Win32|Win64|Windows|WinCE/i.test(platform) || /Windows/i.test(ua)) return 'windows';
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    if (/Linux/i.test(platform)) return 'linux';
    return null;
  }

  function formatSize(bytes) {
    var mb = bytes / (1024 * 1024);
    return mb >= 1000 ? (mb / 1024).toFixed(1) + ' GB' : Math.round(mb) + ' MB';
  }

  function matchAssets(assets) {
    var matched = {};
    var keys = Object.keys(PLATFORMS);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var config = PLATFORMS[key];
      for (var j = 0; j < assets.length; j++) {
        if (assets[j].name.endsWith(config.suffix)) {
          matched[key] = {
            url: assets[j].browser_download_url,
            size: assets[j].size,
            name: assets[j].name,
          };
          break;
        }
      }
    }
    return matched;
  }

  // Creates an SVG element from a trusted hardcoded icon string.
  // SECURITY: Only called with values from the ICONS object above (developer-controlled constants).
  // Never called with external/user/API data.
  function createIconElement(iconKey) {
    var template = document.createElement('template');
    template.innerHTML = ICONS[iconKey] || '';
    return template.content.firstChild;
  }

  function renderDownloads(tag, assetMap, detectedPlatform) {
    var primaryBtn = document.getElementById('download-primary');
    var primaryIcon = document.getElementById('download-primary-icon');
    var primaryLabel = document.getElementById('download-primary-label');
    var primaryMeta = document.getElementById('download-primary-meta');
    var platformsContainer = document.getElementById('download-platforms');

    if (!primaryBtn || !platformsContainer) return;

    // Primary button: use detected platform if available
    if (detectedPlatform && assetMap[detectedPlatform]) {
      var config = PLATFORMS[detectedPlatform];
      var asset = assetMap[detectedPlatform];
      primaryBtn.href = asset.url;
      primaryBtn.removeAttribute('target');
      primaryBtn.removeAttribute('rel');
      var dlIcon = createIconElement('download');
      if (dlIcon) {
        primaryIcon.textContent = '';
        primaryIcon.appendChild(dlIcon);
      }
      primaryLabel.textContent = 'Download for ' + config.label;
      primaryMeta.textContent = tag + ' \u00B7 ' + formatSize(asset.size);
    } else {
      var dlIcon2 = createIconElement('download');
      if (dlIcon2) {
        primaryIcon.textContent = '';
        primaryIcon.appendChild(dlIcon2);
      }
      primaryLabel.textContent = 'Download';
      primaryMeta.textContent = tag;
    }

    // Secondary platform buttons
    var fragment = document.createDocumentFragment();
    var keys = Object.keys(PLATFORMS);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var pConfig = PLATFORMS[key];
      var pAsset = assetMap[key];
      var a = document.createElement('a');
      a.className = 'download__platform' + (key === detectedPlatform ? ' download__platform--active' : '');
      a.href = pAsset ? pAsset.url : RELEASES_URL;
      if (!pAsset) {
        a.target = '_blank';
        a.rel = 'noreferrer';
      }
      var icon = createIconElement(pConfig.icon);
      if (icon) a.appendChild(icon);
      a.appendChild(document.createTextNode(' ' + pConfig.label));
      if (pAsset) {
        a.title = pAsset.name + ' (' + formatSize(pAsset.size) + ')';
      }
      fragment.appendChild(a);
    }
    platformsContainer.appendChild(fragment);
  }

  async function fetchLatestRelease() {
    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 5000);

    try {
      var res = await fetch(API_URL, {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error('GitHub API ' + res.status);

      var releases = await res.json();
      var release = null;
      for (var i = 0; i < releases.length; i++) {
        if (!releases[i].draft) { release = releases[i]; break; }
      }
      if (!release) throw new Error('No published release found');

      return { tag: release.tag_name, assets: release.assets };
    } catch (err) {
      clearTimeout(timeout);
      console.error('Failed to fetch releases:', err);
      return null;
    }
  }

  async function init() {
    var detectedPlatform = detectPlatform();
    var release = await fetchLatestRelease();

    if (release) {
      var assetMap = matchAssets(release.assets);
      renderDownloads(release.tag, assetMap, detectedPlatform);
    } else {
      renderDownloads('', {}, detectedPlatform);
    }
  }

  init();
})();
```

**Step 2: Verify in browser**

Open `website/index.html` in a browser. The download section should:
- Show "Download for macOS" (or your OS) as the primary button
- Display the version and file size below
- Show all 5 platform buttons in the secondary row
- The detected platform button should have a subtle highlight
- Clicking the primary button should start downloading the correct asset

**Step 3: Verify fallback behavior**

Open browser dev tools, go to Network tab, block `api.github.com`. Reload. The page should:
- Show "Download" as primary text (no platform suffix)
- All buttons should link to the releases page
- No JS console errors (just a warning about failed fetch)

**Step 4: Commit**

```bash
cd /Users/ericgriffin/repos/submersion-app/website
git add script.js
git commit -m "feat: add platform detection and GitHub Releases API integration"
```

---

### Task 4: Add download badges to README

**Files:**
- Modify: `submersion/README.md:13-14` (add badge row after CI badges)

**Step 1: Add the download badges**

In `submersion/README.md`, after line 13 (the last CI badge, `Build iOS`) and before the blank line on line 14, insert a new line with the download badges:

```markdown
[![Download macOS](https://img.shields.io/badge/Download-macOS-2ea44f?logo=apple)](https://github.com/submersion-app/submersion/releases) [![Download Windows](https://img.shields.io/badge/Download-Windows-2ea44f?logo=windows)](https://github.com/submersion-app/submersion/releases) [![Download Linux](https://img.shields.io/badge/Download-Linux-2ea44f?logo=linux)](https://github.com/submersion-app/submersion/releases) [![Download Android](https://img.shields.io/badge/Download-Android-2ea44f?logo=android)](https://github.com/submersion-app/submersion/releases) [![Download iOS](https://img.shields.io/badge/Download-iOS-2ea44f?logo=apple)](https://github.com/submersion-app/submersion/releases)
```

Note: Using green (`2ea44f`) instead of blue to visually distinguish download badges from build-status badges.

**Step 2: Verify badges render**

Preview the README on GitHub or in a markdown viewer. The download badges should:
- Appear on a new line below the CI badges
- Each be green with a platform icon
- Link to the releases page when clicked

**Step 3: Commit**

```bash
cd /Users/ericgriffin/repos/submersion-app/submersion
git add README.md
git commit -m "feat: add platform download badges to README"
```

---

### Task 5: Manual smoke test

**Files:** None (testing only)

**Step 1: Test desktop detection**

Open `website/index.html` in a desktop browser:
- Primary button should say "Download for macOS" (or Windows/Linux depending on your OS)
- Version and size should appear below
- All 5 platforms should appear in secondary row
- Your detected platform should be highlighted in secondary row
- Click primary button: should start downloading the .dmg (or platform equivalent)
- Click a secondary button: should download that platform's asset

**Step 2: Test mobile detection**

Open browser dev tools, toggle device toolbar to iPhone:
- Primary button should say "Download for iOS"
- Primary button should be full-width
- Secondary platform buttons should wrap nicely

Toggle to Android device:
- Primary button should say "Download for Android"

**Step 3: Test unknown platform**

Override user agent to an unrecognized string:
- Primary button should say "Download" (no platform)
- No platform highlighted in secondary row
- All links should still work (pointing to releases page)

**Step 4: Test API failure**

Block `api.github.com` in dev tools Network tab, reload:
- Primary button should say "Download"
- Secondary row should have platform buttons linking to releases page
- No console errors (only a warning)

**Step 5: Test light mode**

Toggle `prefers-color-scheme: light` in dev tools:
- Download section should use light theme colors
- Buttons, borders, text should all be legible

No commit for this task (testing only).
