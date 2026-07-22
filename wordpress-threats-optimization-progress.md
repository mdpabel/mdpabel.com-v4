# WordPress Threats Optimization Progress

Progress date: 2026-07-22

## Outcome

The remaining 29 files in `src/content/wordpress-threats/` were optimized as **WordPress Malware Research Entry** pages. Together with the two earlier batches, all 39 entries are now published under `/malware-research/{slug}/`. No entry was merged, moved, archived, converted, or deleted. The old `/wordpress-malware-threats/` URL family remains inactive and no redirects were added.

The pre-edit state of this final batch is preserved at Git checkpoint `d739eeac2cf8746be79c9d3cd7a09f7258c15256` under `refs/codex/checkpoints/malware-research-final-batch-20260722`.

## Entries selected and why

The user explicitly expanded the final batch from five entries to all 29 remaining entries. Each still received an artifact-level position based on retained evidence.

| File                                                               | Selection reason and narrow evidence focus                                                                                                         | Main overlap checked                                           |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `admin-backdoor-user-creation.md`                                  | Supplied `functions.php` hooks directly show one stored-ID user-query concealment pattern.                                                         | Hidden-administrator guide                                     |
| `cookie-based-php-execution-malware.md`                            | The sample contains a distinctive cookie-indexed include chain in an `.htaccess`-named PHP file.                                                   | Obfuscated-PHP and broad cleanup guides                        |
| `drive-by-script-injection.md`                                     | A retained incident notice and source evidence identify the exact `hexagoncontrail-js` script element.                                             | Drive-by case study and JavaScript redirect guide              |
| `fake-plugin-advanced-linkflow-control.md`                         | Plugin source supports a specific fake identity, concealment hooks, and visitor-context remote requests.                                           | Fake-plugin directory and guide                                |
| `goto-obfuscated-dropper.md`                                       | The sample exposes a `goto`-scrambled `index.php` loader with several retrieval fallbacks.                                                         | Obfuscated-PHP guide                                           |
| `hidden-casino-content-injection.md`                               | The `hide-hidden-posts.php` MU-plugin and retained post IDs support a narrow content-concealment entry.                                            | Database-malware and spam guides                               |
| `hidden-plugin-backdoor.md`                                        | A security-themed fake plugin contains a compact decode-and-evaluate wrapper.                                                                      | Fake-plugin guide                                              |
| `htaccess-injection-fake-index-php-dropper.md`                     | The screenshot and retained rules show broad PHP denial with a distinctive allowlist.                                                              | `.htaccess` malware guide                                      |
| `infected-functions-php-stealing-logins-fake-plugin.md`            | The supplied `functions.php` code writes and activates `wp-perf-analytics`; unsupported credential-theft language could be removed cleanly.        | Backdoor and cleanup guides                                    |
| `japanese-seo-spam-injection-php.md`                               | The evidence supports indexed array assembly and an `eval` boundary, not the legacy Japanese-SEO claim.                                            | Obfuscated-PHP guide                                           |
| `javascript-credit-card-stealer.md`                                | The visible JavaScript supports hostname-keyed XOR decoding and `new Function`, not the legacy card-stealer label.                                 | JavaScript and skimmer guides                                  |
| `javascript-fetch-based-spam-injection.md`                         | A database screenshot and code show three remote `fetch()` chains stored in content.                                                               | Database-malware and hidden-backlink guides                    |
| `javascript-obfuscation-ajax-malfunction.md`                       | The exact `c-i[.]icu` click listener and redirect branch provide a distinct artifact intent.                                                       | JavaScript redirect guide                                      |
| `javascript-redirection-injection.md`                              | The `wpinfo-pst1` script ID and packed redirect stored in `post_content` are distinctive.                                                          | Database and redirect guides                                   |
| `malicious-php-script-detected-index-php.md`                       | The screenshot identifies a PrivDayz-branded obfuscated `index.php` in an unusual directory.                                                       | Obfuscated-PHP guide                                           |
| `malicious-redirection-posts-injection.md`                         | One database record contains both meta-refresh and JavaScript redirects to `ushort[.]company`.                                                     | Database and redirect guides                                   |
| `malicious-wordpress-core-plugin.md`                               | The fake `WordPressCore` identity and cURL-to-evaluate loader files support a plugin-specific entry.                                               | Fake-plugin guide                                              |
| `malware-analysis-statemesh-wordpress.md`                          | The supplied MU-plugin code shows self-copy and plugin-list concealment under the StateMesh identity.                                              | MU-plugin case study                                           |
| `obfuscated-javascript-malware-theme-plugins.md`                   | Investigation evidence records the same `_0x3023` structure across 17 files.                                                                       | JavaScript malware guide                                       |
| `php-cron-job-malware.md`                                          | The cPanel evidence confirms an hourly PHP command wrapping an encoded `eval` payload.                                                             | WordPress cron-malware guide                                   |
| `php-malware-index.md`                                             | The `TokensDeGuards` identifiers, message check, inflation, and evaluation flow are distinctive.                                                   | Obfuscated-PHP guide                                           |
| `php-shell-ultimate-backdoor.md`                                   | Directory and code evidence support documenting a PHP Shell Ultimate artifact without publishing the shell.                                        | Web-shell and file-type guidance                               |
| `recursive-php-htaccess-denial.md`                                 | The retained rule uses mixed-case PHP matching and an `index.php` exception; unsupported recursive claims were removed.                            | `.htaccess` malware guide                                      |
| `seo-spam-anchor-css-injection.md`                                 | The `M6bMm64` function constructs an external anchor and off-screen CSS in `post_content`.                                                         | Hidden-link and database guides                                |
| `wordpress-backdoor-exploit.md`                                    | `xdiff.php` contains an XOR decoder and writable temporary-file selection logic.                                                                   | Obfuscated-PHP and backdoor guides                             |
| `wordpress-fake-system-control-plugin-mu-plugin-backdoor.md`       | The code supports a concrete `.sc-backup` restoration and plugin-reactivation chain.                                                               | Malware-recurrence guide and system-control case study         |
| `wordpress-mu-plugin-hidden-admin-backdoor.md`                     | `wp-user-query.php` reads `_pre_user_id` and filters three administrator-user views.                                                               | Hidden-admin guide and MU-plugin case study                    |
| `wordpress-plugin-keeps-getting-removed-or-deactivated-malware.md` | The `media-patcher-lab.php` MU-plugin path and plugin-management structure support an artifact entry without attributing unrelated plugin removal. | Malware-recurrence guide                                       |
| `wp-compatibility-patch-backdoor.md`                               | Supplied code shows administrator creation, stored identifiers, and user-query concealment under one fake plugin identity.                         | Existing WP Compatibility Patch article and hidden-admin guide |

## Old and new metadata

The legacy files did not define separate H1 values, so each old title was also the effective old H1.

| File                                                               | Old title / H1                                                              | New SEO title                                             | New H1                                                              | Old slug                                                        | New slug                                    |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| `admin-backdoor-user-creation.md`                                  | Admin Backdoor User Creation                                                | functions.php Hidden-Admin Query Backdoor Research        | Hidden Administrator Query Hooks Found in functions.php             | `admin-backdoor-user-creation`                                  | `functions-php-hidden-admin-query-backdoor` |
| `cookie-based-php-execution-malware.md`                            | Cookie-Based PHP Execution Malware                                          | Cookie-Indexed PHP Loader in an .htaccess-Named File      | Cookie-Indexed PHP Loader Found in an .htaccess-Named File          | `cookie-based-php-execution-malware`                            | `cookie-indexed-php-loader-htaccess-file`   |
| `drive-by-script-injection.md`                                     | Drive-By Script Injection                                                   | hexagoncontrail-js External Script Injection Research     | hexagoncontrail-js External Script Injection in WordPress HTML      | `drive-by-script-injection`                                     | `hexagoncontrail-external-script-injection` |
| `fake-plugin-advanced-linkflow-control.md`                         | Fake Plugin - Advanced LinkFlow Control                                     | Advanced LinkFlow Control Hidden Plugin Research          | Advanced LinkFlow Control Plugin Concealment and Remote Fetching    | `fake-plugin-advanced-linkflow-control`                         | `advanced-linkflow-control-hidden-plugin`   |
| `goto-obfuscated-dropper.md`                                       | Goto Obfuscated Dropper                                                     | goto-Obfuscated index.php Remote Loader Research          | goto-Obfuscated Remote Loader Found in index.php                    | `goto-obfuscated-dropper`                                       | `goto-obfuscated-index-php-loader`          |
| `hidden-casino-content-injection.md`                               | Hidden Casino Content Injection                                             | hide-hidden-posts.php MU-Plugin Concealment Research      | hide-hidden-posts.php MU-Plugin and Concealed Post IDs              | `hidden-casino-content-injection`                               | `hide-hidden-posts-mu-plugin`               |
| `hidden-plugin-backdoor.md`                                        | Hidden Plugin Backdoor                                                      | WP-Security Fake Plugin eval Loader Research              | WP-Security Fake Plugin with an eval Decode Wrapper                 | `hidden-plugin-backdoor`                                        | `wp-security-fake-plugin-eval-loader`       |
| `htaccess-injection-fake-index-php-dropper.md`                     | Malicious .htaccess Injection and Fake Index.php Dropper                    | Selective PHP Allowlist .htaccess Injection Research      | Selective PHP Allowlist Rules Found in a Malicious .htaccess        | `htaccess-injection-fake-index-php-dropper`                     | `htaccess-php-allowlist-injection`          |
| `infected-functions-php-stealing-logins-fake-plugin.md`            | Infected WordPress functions.php stealing logins and dropping a fake plugin | functions.php wp-perf-analytics Plugin Deployer Research  | wp-perf-analytics Plugin Deployer Embedded in functions.php         | `infected-functions-php-stealing-logins-fake-plugin`            | `functions-php-wp-perf-analytics-deployer`  |
| `japanese-seo-spam-injection-php.md`                               | Japanese SEO Spam Injection via Malicious PHP Code                          | esc_html Array-Assembly PHP eval Loader Research          | esc_html Array-Assembly eval Loader Found in PHP                    | `japanese-seo-spam-injection-php`                               | `esc-html-array-php-eval-loader`            |
| `javascript-credit-card-stealer.md`                                | Obfuscated JavaScript Credit Card Stealer                                   | Hostname-Keyed XOR JavaScript Loader Research             | Hostname-Keyed XOR JavaScript Loader with new Function              | `javascript-credit-card-stealer`                                | `hostname-keyed-xor-javascript-loader`      |
| `javascript-fetch-based-spam-injection.md`                         | JavaScript Fetch-Based Spam Injection                                       | Database-Stored JavaScript Fetch Spam Injection Research  | Database-Stored fetch() Calls Injecting Remote Spam Content         | `javascript-fetch-based-spam-injection`                         | `database-fetch-spam-injection`             |
| `javascript-obfuscation-ajax-malfunction.md`                       | JavaScript Obfuscation Causing AJAX Malfunction                             | c-i.icu Click-Triggered JavaScript Redirect Research      | c-i.icu Click-Triggered Redirect Script in index.php                | `javascript-obfuscation-ajax-malfunction`                       | `c-i-icu-click-redirect-script`             |
| `javascript-redirection-injection.md`                              | JavaScript Redirection Injection                                            | wpinfo-pst1 Database Redirect Script Research             | wpinfo-pst1 Obfuscated Redirect Stored in post_content              | `javascript-redirection-injection`                              | `wpinfo-pst1-database-redirect`             |
| `malicious-php-script-detected-index-php.md`                       | Malicious PHP Script Detected in index.php                                  | PrivDayz Obfuscated index.php Artifact Research           | PrivDayz-Branded Obfuscated index.php in a Random Directory         | `malicious-php-script-detected-index-php`                       | `privdayz-obfuscated-index-php`             |
| `malicious-redirection-posts-injection.md`                         | Malicious Redirection via _posts Table Injection                            | ushort.company Redirect in WordPress post_content         | ushort.company Meta-Refresh and JavaScript Redirect in post_content | `malicious-redirection-posts-injection`                         | `ushort-company-post-content-redirect`      |
| `malicious-wordpress-core-plugin.md`                               | Investigation into Malicious WordPress Core Plugin                          | WordPressCore Fake Plugin Remote Loader Research          | WordPressCore Fake Plugin with cURL-to-eval Loader Files            | `malicious-wordpress-core-plugin`                               | `wordpresscore-fake-plugin-remote-loader`   |
| `malware-analysis-statemesh-wordpress.md`                          | Malware Analysis of StateMesh in WordPress MU-Plugin Directory              | StateMesh MU-Plugin Self-Copy and Concealment Research    | StateMesh MU-Plugin Self-Copy and Plugin-List Concealment           | `malware-analysis-statemesh-wordpress`                          | `statemesh-mu-plugin-self-copy`             |
| `obfuscated-javascript-malware-theme-plugins.md`                   | Obfuscated JavaScript Malware in Theme Plugins                              | Repeated _0x3023 JavaScript Injection Across 17 Files     | Repeated _0x3023 Obfuscated JavaScript Found Across 17 Files        | `obfuscated-javascript-malware-theme-plugins`                   | `repeated-0x3023-javascript-injection`      |
| `php-cron-job-malware.md`                                          | PHP Cron Job Malware                                                        | cPanel PHP Cron eval Wrapper Persistence Research         | Hourly cPanel PHP Cron Job Running an Encoded eval Wrapper          | `php-cron-job-malware`                                          | `cpanel-php-cron-eval-wrapper`              |
| `php-malware-index.md`                                             | PHP Malware in index.php                                                    | TokensDeGuards index.php Inflated eval Loader Research    | TokensDeGuards Payload Verification and eval in index.php           | `php-malware-index`                                             | `tokensdeguards-index-php-loader`           |
| `php-shell-ultimate-backdoor.md`                                   | PHP Shell Ultimate Backdoor                                                 | PHP Shell Ultimate Artifact and Installer Claims Research | PHP Shell Ultimate Artifact Found Among Upload-Like Folders         | `php-shell-ultimate-backdoor`                                   | `php-shell-ultimate-artifact`               |
| `recursive-php-htaccess-denial.md`                                 | Recursive .htaccess PHP Execution Lockout                                   | Mixed-Case PHP .htaccess Deny Rule Research               | Mixed-Case PHP Deny Rule with an index.php Exception                | `recursive-htaccess-php-denial`                                 | `mixed-case-php-htaccess-deny-rule`         |
| `seo-spam-anchor-css-injection.md`                                 | SEO Spam Malware Injection                                                  | M6bMm64 Hidden Anchor CSS Injection Research              | M6bMm64 Hidden Anchor and Off-Screen CSS in post_content            | `seo-spam-anchor-css-injection`                                 | `m6bmm64-hidden-anchor-injection`           |
| `wordpress-backdoor-exploit.md`                                    | WordPress Backdoor Exploit                                                  | xdiff.php XOR Temporary-File Loader Research              | xdiff.php XOR Loader Using Writable Temporary Directories           | `wordpress-backdoor-exploit`                                    | `xdiff-temporary-file-php-loader`           |
| `wordpress-fake-system-control-plugin-mu-plugin-backdoor.md`       | WordPress fake system-control plugin and MU-plugin backdoor                 | system-control Hidden-Backup Restoration Research         | system-control Plugin Restored from wp-content/.sc-backup           | `wordpress-fake-system-control-plugin-mu-plugin-backdoor`       | `system-control-hidden-backup-restoration`  |
| `wordpress-mu-plugin-hidden-admin-backdoor.md`                     | WordPress MU-Plugin Backdoor Hiding an Admin User                           | wp-user-query.php Hidden Administrator Filter Research    | wp-user-query.php MU-Plugin Concealing a Stored User ID             | `wordpress-mu-plugin-hidden-admin-backdoor`                     | `wp-user-query-hidden-admin-filter`         |
| `wordpress-plugin-keeps-getting-removed-or-deactivated-malware.md` | WordPress Plugin Keeps Getting Removed or Deactivated Malware               | media-patcher-lab.php MU-Plugin Persistence Research      | media-patcher-lab.php Found in WordPress mu-plugins                 | `wordpress-plugin-keeps-getting-removed-or-deactivated-malware` | `media-patcher-lab-mu-plugin`               |
| `wp-compatibility-patch-backdoor.md`                               | WP Compatibility Patch Backdoor                                             | WP Compatibility Patch Hidden-Admin Plugin Research       | WP Compatibility Patch Plugin Creating and Hiding an Administrator  | `wp-compatibility-patch-backdoor`                               | `wp-compatibility-patch-hidden-admin`       |

All 29 retain their original draft `reportDate`, use `lastReviewed: 2026-07-22`, have self-referencing canonicals, and are marked `published` with `index: true`.

## Factual corrections and evidence boundaries

- Removed all VirusTotal fields, links, scanner sections, score-based claims, “fully undetected” language, and scanner-based zero-day labels.
- Removed unsupported vulnerability, exploit, initial-access, affected-version, prevalence, campaign, client-outcome, persistence, and exfiltration claims.
- Reframed the legacy Japanese-SEO, credit-card-stealer, AJAX-failure, recursive-`.htaccess`, credential-theft, dropper, and bypass claims around behavior actually visible in the supplied evidence.
- Added separate **Confirmed findings**, **Analyst assessment**, and **What this evidence does not establish** sections to every entry.
- Separated artifacts merely found during the same investigation from artifacts with a demonstrated operational relationship.
- Treated ordinary filenames and functions such as `index.php`, `functions.php`, `eval()`, `include()`, `base64_decode()`, and `$_COOKIE` as contextual rather than conclusive indicators.

## Malicious code handling

Recognizable code evidence was deliberately retained to improve evidentiary credibility. Every optimized entry contains at least one section labelled **Redacted defensive excerpt**. The excerpts preserve distinctive names, hooks, option keys, paths, and control-flow structure while removing or defanging operational payloads, credentials, tokens, complete shells, encoded bodies, live request formats, and attacker-controlled destinations. No sample was executed, repaired, completed, or made more reliable.

## Screenshot work and privacy

- Visually reviewed every screenshot referenced by the 29 source drafts.
- Published 32 evidence screenshots across the 29 entries, positioned immediately after the finding each image supports rather than grouped in galleries.
- Rewrote all published alt text and captions to describe only visible evidence and its limitations.
- Created two deterministic privacy-safe crops, without generative editing or inpainting:
  - `public/wordpress-threats/malware-index.php_evidence-safe.png`
  - `public/wordpress-threats/db-spam-malware_evidence-safe.png`
- Moved 13 sensitive originals out of the public tree to `.private-evidence/wordpress-threats/final-batch-sensitive-originals/`. They contain client domains, email/user information, hosting paths or IDs, database identifiers, hard-coded secrets, or operational payload detail.
- Excluded other redundant, generic, or weak screenshots when they did not independently support a finding. Scanner output is not used as behavior proof.

## Indicators and remediation

Each entry now separates **Higher-confidence indicators** from **Contextual indicators**. Remediation is limited to the observed artifact: preserve evidence, remove or replace confirmed files/records, inspect related paths and persistence locations, rotate relevant credentials, verify recurrence, and follow the broader cleanup guide where needed. The pages do not repeat a full malware-removal tutorial.

## Internal links and overlap differentiation

Every optimized entry links to the research hub, closely related research, and contextually relevant guides or case studies. Commercial service links are included only where appropriate.

`src/components/new/ArticlePage.astro` now supplies reciprocal research links from relevant existing content, including the fake-plugin guide, obfuscated-PHP guide, recurrence guide, database-malware guide, hidden-admin guide, cron-malware guide, `.htaccess` guide, the SimpleCopseHolding article, the system-control case study, and the MU-plugin hidden-user case study. These links position the research entries as code- and artifact-level evidence rather than competing broad cleanup pages.

## Shared implementation changes

- `src/components/new/ArticlePage.astro`: added reciprocal links from relevant broad pages and case studies to final-batch research entries.
- `scripts/validate-malware-research.mjs`: now validates the complete 39-entry published inventory instead of a fixed ten-entry subset.
- `scripts/validate-rendered-malware-research.mjs`: now validates all 39 rendered entries, reciprocal-link mappings, privacy exclusions, and sitemap membership.
- `work/generate-final-threats.mjs`: reproducible structured rewrite source for the 29 final entries.
- `work/create-final-privacy-crops.mjs`: deterministic crop generation from private originals.

The strict content schema, route, research template, breadcrumb logic, canonical handling, structured-data implementation, responsive evidence component, draft/index filtering, and `/malware-research/` hub established in the first batch remain in use. VirusTotal fields remain rejected by the strict schema. No route or schema relaxation was introduced.

## Sitemap changes

No manual sitemap list was added. The existing sitemap generator now discovers all 39 published and indexable research entries from the collection. Rendered validation confirms the hub and every eligible research URL are present, while old `/wordpress-malware-threats/` URLs remain absent.

## Validation and build

Commands run:

```text
npx.cmd prettier --write <29 entry files and changed scripts>
npm.cmd run validate:research
npx.cmd astro check
npm.cmd run build
npm.cmd run validate:research:rendered
HTTP preview check for all 29 final-batch routes
```

Results:

- Source validation: passed for 39 published entries.
- Formatting: Markdown and JavaScript files formatted successfully; the repository does not configure a Prettier parser for `.astro`, so `ArticlePage.astro` was instead verified by Astro check and the production build.
- Astro check: 0 errors, 0 warnings, 23 pre-existing hints in unrelated site files.
- Production build: passed after fetching 46 posts, 26 case studies, 9 guides, and 7 malware-log entries from the CMS. A clean cache build removed stale duplicate-content warnings.
- Rendered validation: passed for 39 entries and 50 evidence figures, including canonicals, metadata, indexability, structured data, internal links, reciprocal links, public assets, privacy exclusions, and sitemap membership.
- Local preview: all 29 final-batch URLs returned HTTP 200 and contained the expected self-referencing canonical.
- Interactive browser connection was unavailable in this environment, so visual page QA used the built HTML, rendered validators, direct HTTP checks, and the separately completed visual inspection of every source screenshot.

## Unresolved manual-review items

- The decoded bodies of the hostname-keyed XOR JavaScript, `esc_html` array loader, PrivDayz artifact, encoded cron wrapper, and TokensDeGuards payload were not retained or safely established; their runtime effects remain intentionally unstated.
- The exact introduction path and vulnerable component/version remain unknown for the final-batch artifacts unless explicitly stated in an entry.
- Several investigations retained multiple artifacts or symptoms. The entries now state when provenance does not prove a direct relationship, but original case notes could strengthen those relationships later.
- The PHP Shell Ultimate labels and installer claims are documented as visible strings, not proof that any named bypass succeeded.
- `media-patcher-lab.php` was observed in the same investigation as plugin-management symptoms, but the evidence does not establish that it removed or deactivated the named legitimate plugin.
- The `xdiff.php` evidence supports its loader structure, but the exact original public path was not retained.

## Entries still unoptimized

None. All 39 files in `src/content/wordpress-threats/` now use the strict WordPress Malware Research Entry schema and the `/malware-research/{slug}/` URL family.

This implementation does not guarantee rankings, traffic, indexing, or search-engine treatment.

## Site-owner discovery and conversion layer — 2026-07-22

The complete 39-entry research collection now supports two audiences without changing the underlying page type or technical positioning:

- Site owners can begin with the problem they are seeing and understand why an entry may be relevant.
- Developers and security professionals can continue into the existing artifact-level code, path, screenshot, indicator, limitation, and remediation evidence.

### Per-entry discovery data

Every Markdown file now has a required strict `siteOwner` object containing:

- one to three controlled symptom groups;
- a unique owner-facing search description used in visible introductory copy, meta description, and structured data;
- a symptom-oriented summary;
- findings observed in the investigation;
- carefully qualified possible warning signs;
- natural-language questions a site owner may search;
- an explicit evidence-boundary note.

The eight discovery groups are redirects and pop-ups, spam and unwanted content, hidden users, unknown plugins, recurring malware, suspicious files and code, login and credential risk, and access errors or warnings.

The wording reflects the retained samples and screenshots. Entries with direct symptoms identify them. Loader, shell, and obfuscated-file entries that have no retained front-end trace state that the site may look normal and focus on scanner, file-manager, filename, or code-review discovery instead. Possible symptoms are labelled as investigation leads rather than proof.

### Research-page conversion path

`src/components/research/ResearchPage.astro` now renders a prominent section before the technical article:

- “Could this match the problem on your WordPress site?”
- observed investigation findings;
- qualified possible warning signs;
- owner questions;
- the entry-specific evidence boundary;
- a primary `/hire-me/` CTA to request an investigation;
- a secondary link to the malware-removal service explanation.

The original technical description remains visible as the research focus. Existing Markdown analysis, evidence screenshots, and redacted defensive code excerpts were not removed or rewritten by this change. Duplicate sidebar service promotion was removed so each page has one clear conversion block rather than repeated commercial interruptions.

### Research-hub discovery

`src/pages/malware-research/index.astro` now lets visitors:

- search by symptom, filename, plugin name, location, indicator, or owner question;
- filter the 39 entries by the eight controlled symptom groups;
- see an owner-facing summary and question on every result card;
- understand that a match is an investigation lead, not an automatic diagnosis;
- move from matching research to a direct `/hire-me/` investigation CTA.

The filtering uses progressively enhanced client-side JavaScript. All research links and content remain present in the server-rendered HTML when JavaScript is unavailable.

### Schema and validation changes

- `src/content.config.ts` now requires the strict nested `siteOwner` schema and rejects unknown discovery fields or symptom groups.
- `scripts/validate-malware-research.mjs` verifies all 39 entries have valid, unique discovery data.
- `scripts/validate-rendered-malware-research.mjs` verifies owner sections, qualified signal blocks, questions, CTA links, owner-facing metadata and structured data, hub search, nine filter controls, and all 39 result cards.
- `work/add-site-owner-signals.mjs` records the deterministic per-entry mapping used for this implementation.
- The root `sitemap.xml` was resynchronized with the generated `dist/sitemap.xml`; no URL was added, removed, redirected, or reactivated.

### Validation result

Commands run for this layer:

```text
node work/add-site-owner-signals.mjs
npm.cmd run validate:research
npx.cmd astro check
npx.cmd prettier --write <changed schema, scripts, helper, and 39 Markdown files>
npm.cmd run build
npm.cmd run validate:research:rendered
```

Results:

- Strict content and source validation: passed for 39 entries.
- Astro check: 0 errors; unrelated pre-existing hints remain elsewhere in the site.
- Production build: passed after fetching 46 posts, 26 case studies, 9 guides, and 7 malware-log entries.
- Rendered validation: passed for 39 research pages and 50 evidence figures, including owner discovery, conversion links, metadata, structured data, internal links, privacy exclusions, and sitemap membership.
- Root and generated sitemap files: identical after synchronization.
- The repository has no configured Prettier parser for `.astro`; the Astro files were validated through Astro check, production compilation, and rendered-HTML checks.
- The in-app browser was unavailable and its local recovery document was absent, so no new interactive visual-browser claim is made for this layer.

No ranking, traffic, enquiry, indexing, or hiring outcome is guaranteed. The implementation creates a factual path from a site owner’s symptom to relevant evidence and then to a clear way to request help.
