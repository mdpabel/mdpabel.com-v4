# WordPress Threats Initial Optimization Report

Date: 2026-07-22

## Scope and checkpoint

This implementation keeps every source file in `src/content/wordpress-threats/` and keeps one content type: **WordPress Malware Research Entry**. No entry was moved, merged, archived, converted to another collection, or assigned an old `/wordpress-malware-threats/` route.

The complete collection, referenced screenshots, root sitemap, relevant built/local public content, and site implementation were reviewed during the audit and selection phase. This initial implementation then fully processed five entries and their eight referenced screenshots.

Before editing, an isolated Git checkpoint was created without moving the branch or changing the normal index:

- Ref: `refs/codex/checkpoints/malware-research-initial-batch-20260722`
- Commit: `79da937543289f17575489b24a71275c3dc886c5`

The checkpoint contains the five original drafts and the pre-existing compatibility schema file. Tracked implementation files remain recoverable from the parent commit.

## Files reviewed

- All 39 Markdown files in `src/content/wordpress-threats/` were included in the audit and batch-selection review.
- All 85 collection screenshots were visually inspected during the audit. The five selected files reference eight of those screenshots; all eight were reopened for this implementation.
- Root `sitemap.xml` and corresponding local/built versions of overlapping blog posts, case studies, guides, services, malware logs, and fake-plugin pages were reviewed.
- The content schemas, `NewLayout.astro`, WordPress article template, fake-plugin templates, route generation, canonical handling, JSON-LD, sitemap generation, navigation, and existing related-content behavior were reviewed.

## Files optimized

| File                                                | Old title                                                                    | New SEO title                                                | Old slug                                         | New public slug                            | Primary artifact-level topic                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `fetch-based-url-injection.md`                      | Fetch-Based URL Injection                                                    | PHP Footer Remote-Content Loader: WordPress Malware Research | `fetch-based-url-injection`                      | `php-footer-remote-content-loader`         | PHP footer loader that retrieves and prints remote hidden-link markup                    |
| `header-based-backdoor-injection.md`                | Header-Based Backdoor Malware                                                | HTTP-Header-Gated PHP Loader: WordPress Malware Research     | `header-based-backdoor-injection`                | `http-header-gated-php-loader`             | Three-header PHP callable-composition loader in a plugin file                            |
| `savvywolf-web-shell-manager-variant.md`            | SavvyWolf Web Shell - Manager Variant                                        | SavvyWolf MANAGER PHP Web Shell: WordPress Malware Research  | `savvywolf-web-shell-manager-variant`            | `savvywolf-manager-php-web-shell`          | SavvyWolf MANAGER interface and WordPress-path self-copy attempts                        |
| `wp-theme-functions-credential-stealer-fake-png.md` | WordPress functions.php Credential Stealer Malware Saving Logins as Fake PNG | Functions.php Credential Logger Using a Fake PNG File        | `wp-theme-functions-credential-stealer-fake-png` | `functions-php-credential-logger-fake-png` | Authentication hook that appends submitted login values to a local fake-PNG-named file   |
| `xor-obfuscated-php-loader.md`                      | XOR-Obfuscated PHP Dropper                                                   | wp-config.php XOR Temporary-File Loader: Malware Research    | `xor-obfuscated-php-loader`                      | `wp-config-xor-temporary-file-loader`      | Request-gated hex/XOR loader that writes, includes, and removes a temporary `.desc` file |

All five use `/malware-research/{slug}/` canonicals and remain in the `wordpress-threats` collection.

## Entry-level changes

### 1. PHP footer remote-content loader

- **Factual corrections:** removed VirusTotal, “zero-day,” “fully undetected,” active-threat, site-count, generic vulnerability, and unsupported scanner-evasion claims. The page now confirms the hard-coded endpoint, PHP retrieval fallbacks, output call, and visible endpoint response. Initial access, vulnerable components, response consistency, duration, attribution, and prevalence are explicitly not established.
- **Screenshots:** retained evidence 1 after the endpoint-response finding, evidence 3 after the footer control-flow analysis, and evidence 4 as secondary scanner corroboration. Evidence 2 was excluded because it repeats the same link-list content without adding a distinct finding. Existing client values in evidence 4 were already irreversibly redacted; no new derivative was needed.
- **Code:** replaced the runnable PHP fetcher with a `Redacted defensive excerpt` showing only the stream/cURL fallback and output flow. The remote endpoint is defanged.
- **Internal links:** added the broad hidden-links guide, database fetch-injection guide, failed-blacklist database case study, broad malware-removal guide/service, and two related research entries.
- **Overlap:** substantial overlap exists with `/blog/hidden-links-malware-the-simple-guide-to-seo-spam-detection-cleanup-and-prevention/`. The research entry no longer attempts to own removal-guide intent; it focuses on this endpoint, footer location, retrieval structure, and screenshot chain.

### 2. HTTP-header-gated PHP loader

- **Factual corrections:** removed VirusTotal, “zero-day,” generic arbitrary-code outcome, WordPress vulnerability language, and the claim that the malware left no local file trace. The screenshot visibly shows the loader stored in `buddyboss_legacy.php`. Runtime execution remains unconfirmed because no triggering request was retained.
- **Screenshots:** the single code screenshot now appears immediately after the observed-file paragraph. Its alt text and caption distinguish the local injection from an unobserved triggering request. No identifying client value required a new derivative.
- **Code:** replaced the working one-liner with non-operational pseudocode describing nested callable selection. Header values and a runnable request format are not published.
- **Internal links:** added the obfuscated-PHP guide, hidden-backdoor investigation, malware-removal guide/service, and three related research entries.
- **Overlap:** the existing guides own broad PHP-malware detection and cleanup intent. This entry is limited to the combined `X-Dns-Prefetch-Control`, `If-Unmodified-Since`, and `Feature-Policy` header set plus its nested callable structure.

### 3. SavvyWolf MANAGER PHP web shell

- **Factual corrections:** removed VirusTotal, “zero-day,” assumed exploitation route, compromised-credential claim, root-access claim, and unsupported statements about every interface capability. Confirmed findings are limited to the branded interface, visible `wp-content` listing, WordPress-root search, target filenames, and code-defined copy attempts.
- **Screenshots:** retained the single MANAGER interface screenshot after the observed-interface section. The hosting home path was already irreversibly redacted in the supplied image. The caption states that the image does not show an edit, upload, deletion, or execution action.
- **Code:** removed the executable PHP and interface implementation. The public `Redacted defensive excerpt` retains only abstract root-location and copy-target logic.
- **Internal links:** added the file-disguise guide, hidden-backdoor investigation, Tiny File Manager case study, malware-removal service, and three related research entries.
- **Overlap:** the Tiny File Manager case study owns a complete recovery story and a different artifact. This entry focuses on SavvyWolf branding, filenames, and copy structure.

### 4. functions.php credential logger using a fake PNG filename

- **Factual corrections:** changed the primary terminology from a proven credential “stealer” to a code-supported credential logger. Removed VirusTotal, unverified hash publication, assumed successful writes, assumed affected users, public-accessibility claims, and network-exfiltration claims. The page states that the code attempts a local append and that no destination contents or network retrieval were retained.
- **Screenshots:** retained the single `functions.php` editor screenshot directly after the observed-artifact paragraph. The theme name was already irreversibly redacted. The caption describes only the visible hook and write call.
- **Code:** removed the complete callback, Base64 destination, and credential-record implementation. The public excerpt is inert pseudocode and does not reproduce a working logger.
- **Internal links:** added the file-disguise guide, WordPress malware detection guide, broad malware-removal guide/service, and three related research entries. No unrelated case study was forced into the page.
- **Overlap:** the broad file-disguise and detection articles explain general investigation. This entry owns the specific comment marker, late `authenticate` hook, append structure, and fake-PNG-named destination.

### 5. wp-config.php XOR temporary-file loader

- **Factual corrections:** removed VirusTotal, “zero-day,” generic RCE outcome, WordPress vulnerability language, and the inaccurate claim that the loader avoids disk changes. The code explicitly writes `.desc` before including it; later deletion does not negate the write and is not guaranteed to succeed.
- **Screenshots:** retained the single `wp-config.php` screenshot immediately after the observed-artifact paragraph. It contains no visible client identity requiring a new derivative.
- **Code:** replaced the runnable request handler with non-operational pseudocode. The distinctive `mr\x6B`, `.desc`, hex/XOR, and write/include/unlink structure remain as defensive indicators without a payload or replay instructions.
- **Internal links:** added the obfuscated-PHP guide, hidden-backdoor investigation, broad malware-removal guide/service, and three related research entries.
- **Overlap:** broad obfuscated-PHP detection remains with the existing guide. This entry is narrowed to one request-to-temporary-file flow inside `wp-config.php`.

## Shared content improvements

Every optimized entry now contains:

- Separate SEO title, H1, narrow slug, meta description, report date, and last-reviewed date
- A focused summary and investigation context
- Observed artifact and confirmed findings
- Technical analysis and a labeled `Redacted defensive excerpt`
- A distinct analyst-assessment section
- Higher-confidence and contextual indicators
- A “What this evidence does not establish” section
- Concise artifact-specific remediation and recurrence verification
- Related research plus only relevant guides/case studies/service links
- A methodology and privacy note

The content avoids broad removal-guide targeting and does not promise rankings or indexing outcomes.

## Schema changes

`src/content.config.ts` now defines a strict research record with:

- SEO title, H1, description, status, report date, and last-reviewed date
- Threat category, affected components, observed locations, confirmed behaviors, confidence, severity, and visible rationale
- Evidence source and `TechArticle`/`Article` selection
- Screenshot objects requiring source, alt text, caption, supported finding, intrinsic dimensions, and privacy-review state
- Higher-confidence/contextual indicator objects
- Limitations, related research, guides, case studies, service, canonical, and index controls

The schema no longer defines or exposes `vtLink`, `vtScore`, free-form hashes, site-count fields, impact marketing copy, or other legacy threat fields. Status-bearing research records are strict, and publication checks require reviewed dates, confirmed behaviors, malware-research canonicals, and privacy-reviewed screenshots. Only `published` records may be indexable.

The 34 unoptimized legacy files stay in the same collection. Until each receives the new frontmatter, the loader normalizes it to a non-indexable `draft` record and deliberately does not carry prohibited or unreviewed legacy fields into the typed content data. The compatibility file `src/content/config.ts` now re-exports the active schema instead of maintaining a second VirusTotal-aware definition.

## Route and template changes

- Added `/malware-research/` as a `CollectionPage`/`ItemList` hub with a visible evidence-method explanation.
- Added `/malware-research/[slug]/` static routes for records whose status is `published`.
- Added a dedicated research template with breadcrumbs, evidence classification, report/review dates, visible severity rationale, body content, related research, guide/case-study links, and one restrained service link.
- Added `TechArticle` or `Article`, `WebPage`, and `BreadcrumbList` JSON-LD. The five technical entries use `TechArticle` because their visible pages include code-level analysis. No hidden behavior, affected-version, hash, prevalence, or FAQ claims are injected into structured data.
- Publication date is intentionally omitted from JSON-LD until an actual deployment/publication date is known. The visible investigation report date is not misrepresented as the web publication date.
- Canonicals resolve exclusively to the new `/malware-research/` URLs.
- No routes or redirects were added for `/wordpress-malware-threats/`.
- Navigation and footer resource lists now link to the malware-research hub.

## Related-entry matching

The new route selects up to three related published research entries. Explicit `relatedResearch` slugs receive the highest weight, followed by matching threat category and affected components. The current entry is excluded. Draft, review, archived, and unpublished records are not eligible.

## Screenshot rendering changes

- Corrected the public path convention from `/images/wordpress-threats/...` to `/wordpress-threats/...` for the five optimized entries.
- Added a targeted Markdown evidence-image pipeline that operates only on `/wordpress-threats/` image URLs.
- Evidence images are rendered as linked `<figure>` elements with intrinsic width/height, responsive sizing, lazy loading, accurate alt text, and visible captions.
- Images remain next to the finding they support rather than in a gallery.
- All seven published screenshot URLs resolve in `public/wordpress-threats/`. One redundant screenshot was excluded.
- The existing privacy-safe pixels were preserved without generative editing. No new AI-generated or AI-inpainted evidence derivative was created.

## Sitemap changes

- Added the `/malware-research/` hub to the generated sitemap.
- Added research entry URLs only when both `status === "published"` and `index === true`.
- The generated sitemap contains exactly the five optimized entry URLs plus the hub.
- Draft legacy records are excluded.
- No old 410 URL family was reactivated and no redirects were created.

## Validation commands and results

| Command or check                        | Result                                                                                                                                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm.cmd run validate:research`         | Passed. Validated exactly five published entries, prohibited terms, canonical URLs, required evidence sections, redacted-excerpt labels, public image existence, screenshot placement, and internal-link inventory.               |
| `npm.cmd run astro -- sync`             | Passed. All 39 files load through the collection; only the five reviewed entries have published/indexable records.                                                                                                                |
| `npm.cmd run astro -- check`            | Passed with 0 errors. The project reports pre-existing diagnostic hints in unrelated files; the initial research implementation adds no blocking type errors.                                                                     |
| `npm.cmd run build`                     | Passed. Static build completed with 130 pages, including the hub and five research routes. Existing Critters/Tailwind selector-skip notices remain unrelated to this implementation.                                              |
| Rendered-HTML inspection with Cheerio   | Passed. Confirmed all five titles, H1s, canonicals, TechArticle/WebPage/Breadcrumb graphs, seven evidence figures, captions, intrinsic dimensions, lazy loading, corrected image paths, and absence of prohibited/old-route text. |
| Generated `dist/sitemap.xml` inspection | Passed. Contains the hub and exactly five published/indexable research entry URLs.                                                                                                                                                |
| In-app browser visual pass              | Not available in this session; browser discovery returned no available browser binding. No unrelated browser controller was substituted.                                                                                          |

## Build result

The production build succeeds. The output includes:

- `/malware-research/`
- `/malware-research/php-footer-remote-content-loader/`
- `/malware-research/http-header-gated-php-loader/`
- `/malware-research/savvywolf-manager-php-web-shell/`
- `/malware-research/functions-php-credential-logger-fake-png/`
- `/malware-research/wp-config-xor-temporary-file-loader/`

Successful generation does not guarantee crawling, indexing, rankings, or traffic.

## Unresolved manual-review items

1. **Interactive visual QA:** perform a desktop and mobile browser pass when an in-app browser is available. Rendered HTML and build checks passed, but an interactive layout inspection remains outstanding.
2. **Remaining 34 drafts:** their source Markdown still contains legacy AI wording and, in many cases, VirusTotal sections or fields. They are normalized to non-indexable drafts and cannot appear in the research route or sitemap. Remove those values from each source during its own evidence-led optimization batch.
3. **Date provenance:** the five existing `reportDate` values were retained from their original draft notes. Confirm against private investigation records before deployment if those dates are meant to represent an observation/report date. They are not emitted as `datePublished`.
4. **Screenshot provenance:** selected screenshots appear to contain baked-in irreversible redactions where needed. Confirm the retained public files are the approved derivatives and that originals remain in private evidence storage.
5. **Endpoint and file indicators:** recheck that every public indicator remains safe to disclose under the relevant client agreement. Domains are defanged in text; screenshots are non-clickable images but visually preserve evidence.
6. **Publication control:** the five entries are marked `published` and `index: true` for this initial implementation. If editorial/legal review must occur before deployment, change their status to `review` or set `index: false`; the route and sitemap filters will respond accordingly.
7. **Git state:** the threat collection and screenshot directory were already untracked in the working tree. Ensure the intended source files and public evidence derivatives are deliberately added to version control when this batch is approved.
