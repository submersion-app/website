# Platform-Aware Download Feature

## Summary

Add a download section to the submersion.app website that auto-detects the visitor's OS and presents the correct GitHub Release asset as a primary download button. All other platforms shown as secondary options. README gets shields.io download badges.

## Approach

Client-side GitHub API fetch (Approach A). The website's `script.js` calls the GitHub Releases API on page load, finds the latest non-draft release, and populates download links dynamically. No infrastructure, no build step, no CI changes for the website.

## Website Download UX

### Location

Replace the current "Get Started" CTA section (`#get`) in `index.html`. This becomes `#download` and serves as the primary conversion point.

### Layout

```
Download Submersion
Open-source and privacy-focused...

[ Download for macOS ]        <- primary, detected OS
  v1.0.0-beta.31 - 49 MB

Also available for:
[Windows] [Linux] [Android] [iOS]   <- secondary row

View on GitHub - Build Instructions  <- tertiary links preserved
```

### Platform detection

`navigator.userAgent` maps to:
- macOS -> .dmg
- Windows -> .zip
- Linux -> .tar.gz
- Android -> .apk
- iOS -> .ipa
- Unknown -> no primary highlight, show full grid equally

### API integration

1. Fetch `https://api.github.com/repos/submersion-app/submersion/releases`
2. Find first release where `draft === false` (includes pre-releases)
3. Match asset filenames by platform suffix
4. Populate download links with version and file size
5. Fallback: if API fails, link to releases page on GitHub

### Nav update

Add "Download" link to nav bar anchoring to `#download`.

## README Download Badges

Add shields.io badges below existing CI badges in `submersion/README.md`:

```
[![Download macOS](https://img.shields.io/badge/Download-macOS-blue?logo=apple)](releases-url)
[![Download Windows](https://img.shields.io/badge/Download-Windows-blue?logo=windows)](releases-url)
[![Download Linux](https://img.shields.io/badge/Download-Linux-blue?logo=linux)](releases-url)
[![Download Android](https://img.shields.io/badge/Download-Android-blue?logo=android)](releases-url)
[![Download iOS](https://img.shields.io/badge/Download-iOS-blue?logo=apple)](releases-url)
```

Badges link to `/releases` (full listing) since current releases are pre-releases and `/releases/latest` only resolves for non-prerelease tags.

## JavaScript Implementation

### File: website/script.js

Module structure:
- `detectPlatform()` -> returns platform key or null
- `fetchLatestRelease()` -> calls GitHub API, returns release data
- `matchAssets(assets)` -> maps platform keys to { url, size, name }
- `renderDownloads(...)` -> populates DOM elements

### Platform-to-asset mapping

```js
const PLATFORMS = {
  macos:   { suffix: '-macOS.dmg',    label: 'macOS',   icon: 'apple'   },
  windows: { suffix: '-Windows.zip',  label: 'Windows', icon: 'windows' },
  linux:   { suffix: '-Linux.tar.gz', label: 'Linux',   icon: 'linux'   },
  android: { suffix: '-Android.apk',  label: 'Android', icon: 'android' },
  ios:     { suffix: '-iOS.ipa',      label: 'iOS',     icon: 'apple'   },
}
```

### Loading states

1. Initial: placeholder links to /releases
2. After API: direct download URLs with version and size
3. API failure: fallback links to /releases

### Error handling

- fetch wrapped in try/catch
- 5-second timeout via AbortController
- Graceful degradation if JS fails

### No external dependencies

Platform icons as inline SVGs, same as existing GitHub icon approach.

## CSS Styling

### File: website/styles.css

New classes:
- `.download` - container
- `.download__primary` - large prominent button
- `.download__version` - version + size text
- `.download__secondary` - platform button row
- `.download__platform` - individual platform button
- `.download__platform--active` - detected platform highlight
- `.download__fallback` - tertiary links

### Responsive

- Desktop (>980px): centered primary, horizontal secondary strip
- Tablet (560-980px): same, wrapping as needed
- Mobile (<560px): full-width primary, secondary wraps to 2-3 columns

## Files Modified

1. `website/index.html` - replace #get section with #download, add nav link
2. `website/script.js` - GitHub API fetch, platform detection, DOM rendering
3. `website/styles.css` - download section styles
4. `submersion/README.md` - add download badges
