---
title: "Recurring wk Directories and a Hex PHP Loader: Research"
h1: "Recurring wk Directories with a Hex-Fragment PHP Loader"
slug: "wk-directory-hex-loader"
description: "Forensic analysis of recurring wk directories across wp-content and an associated PHP sample that reconstructs code from hex fragments before evaluation."
status: "published"
reportDate: "2026-02-05"
lastReviewed: "2026-07-22"
threatCategory: "Distributed PHP loader artifacts"
affectedComponents:
  - "WordPress plugin, theme, uploads, and content directories"
  - "PHP runtime evaluation"
observedLocations:
  - "wp-content/wk/"
  - "wp-content/mu-plugins/wk/"
  - "wp-content/themes/wk/"
  - "wp-content/uploads/wk/"
  - "Supplied PHP file named index.php"
confirmedBehaviors:
  - "Uses the distinctive class name nigwqgqwtqwtqwt"
  - "Stores a large payload as pipe-separated hexadecimal fragments"
  - "Builds decoder-related function names indirectly"
  - "Passes reconstructed content to PHP evaluation"
confidence: "High"
severity: "High"
severityRationale: "The supplied PHP reconstructs and evaluates encoded content, while screenshots show same-named wk directories in several executable or web-accessible WordPress paths. The evidence does not prove that every directory contained the same file or that the sample executed."
evidenceSource: "Anonymized WordPress client investigation with six retained screenshots, of which five support this page, and a supplied encoded PHP sample"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/wk_evidence-1.png"
    alt: "File manager showing a wk directory directly under wp-content"
    caption: "A wk directory is visible directly under wp-content. The screenshot establishes the path only; it does not display the directory contents."
    supports: "A wk directory existed at the top level of wp-content"
    width: 972
    height: 657
    privacyReviewed: true
  - src: "/wordpress-researches/wk_evidence-2.png"
    alt: "File manager showing a wk directory inside wp-content mu-plugins"
    caption: "The mu-plugins view contains a wk directory and two sibling PHP files. The sibling files were not analyzed for this entry."
    supports: "A second wk directory existed under the WordPress mu-plugins path"
    width: 863
    height: 476
    privacyReviewed: true
  - src: "/wordpress-researches/wk_evidence-4.png"
    alt: "File manager showing a wk directory among installed WordPress themes"
    caption: "A directory named wk appears under wp-content/themes. The image does not show whether WordPress recognized it as an active theme."
    supports: "A wk directory existed in the themes path"
    width: 1204
    height: 599
    privacyReviewed: true
  - src: "/wordpress-researches/wk_evidence-5.png"
    alt: "File manager showing a wk directory inside WordPress uploads"
    caption: "A wk directory appears under wp-content/uploads alongside year and plugin-created folders. Its contents are not visible."
    supports: "A wk directory existed in the uploads path"
    width: 1094
    height: 607
    privacyReviewed: true
  - src: "/wordpress-researches/wk_evidence-3.png"
    alt: "Code editor showing a PHP class with pipe-separated hex fragments and an evaluation call"
    caption: "The retained code view shows class nigwqgqwtqwtqwt, a long hexadecimal fragment list, indirect decoder construction, and evaluation. The encoded payload is not published."
    supports: "The supplied PHP sample reconstructs and evaluates an encoded payload"
    width: 1840
    height: 566
    privacyReviewed: true
indicators:
  - value: "nigwqgqwtqwtqwt"
    type: "class-name"
    confidence: "higher"
  - value: "nigwqgqwtqwtqwti"
    type: "method-name"
    confidence: "higher"
  - value: "Pipe-separated hexadecimal fragments followed by indirect base64 decoder construction and eval"
    type: "code-structure"
    confidence: "higher"
  - value: "wk directories repeated across wp-content, mu-plugins, themes, and uploads"
    type: "path-pattern"
    confidence: "higher"
  - value: "wk"
    type: "directory-name"
    confidence: "contextual"
  - value: "index.php"
    type: "filename"
    confidence: "contextual"
  - value: "eval() and base64 decoding"
    type: "php-function-set"
    confidence: "contextual"
limitations:
  - "The screenshots do not show the contents of the wk directories."
  - "The public evidence does not prove that every wk directory contained the supplied index.php sample."
  - "The encoded payload was not decoded or executed during this task."
  - "A separate permissions screenshot does not establish that malware changed permissions and is excluded."
  - "The initial compromise route and any recreation mechanism were not confirmed."
relatedResearch:
  - "menu-queue-bit-compact-extension-vox"
  - "wp-config-xor-temporary-file-loader"
  - "http-header-gated-php-loader"
relatedGuides:
  - title: "How to recognize obfuscated PHP malware"
    href: "/blog/wordpress-obfuscated-php-malware-detection/"
  - title: "File types that hide WordPress malware"
    href: "/blog/file-types-that-hide-malware-on-wordpress/"
relatedCaseStudies:
  - title: "Hidden executable files after a hosting suspension"
    href: "/case-studies/siteground-malware-detected-suspension-tiny-file-manager-backdoor/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "recurring-malware"
    - "suspicious-files-code"
  searchDescription: "Unknown wk-style directories appear in several WordPress locations? Review evidence of repeated suspicious folders and a hexadecimal loader artifact."
  summary: "This research helps an owner investigate repeated unfamiliar directories found across a WordPress installation. The retained evidence shows the locations and a hexadecimal loading structure, but it does not establish a complete persistence chain."
  observed:
    - "Similarly named suspicious directories were retained from several WordPress locations, together with a hexadecimal PHP loader artifact."
  possible:
    - "Security scans may report related files in more than one directory."
    - "Removing only one copy may leave another related artifact available, although automatic restoration was not demonstrated."
  questions:
    - "Why do similar unknown directories appear in several WordPress folders?"
    - "Does finding repeated malware files prove that the site has an automatic reinfection mechanism?"
  evidenceNote: "Multiple artifacts were observed in one investigation, but automatic copying and their direct operational relationship were not confirmed."
canonical: "https://www.mdpabel.com/malware-research/wk-directory-hex-loader/"
index: true
---

## Summary

This entry records directories named `wk` observed in four WordPress content paths and a supplied `index.php` sample built around the distinctive class `nigwqgqwtqwtqwt`. The sample stores code as a long list of hexadecimal fragments, reconstructs decoder names indirectly, and passes the reconstructed layer to `eval()`.

The screenshots establish that same-named directories existed in multiple locations. They do not show their contents or prove that each contained the supplied sample. The relationship is retained investigation context and is stated with that limitation.

## Investigation context

During one anonymized investigation, `wk` directories were documented directly under `wp-content` and within `mu-plugins`, `themes`, and `uploads`. A code screenshot and retained sample documented an encoded PHP file named `index.php`.

The broad [obfuscated PHP malware guide](/blog/wordpress-obfuscated-php-malware-detection/) explains general pattern recognition. This page focuses on the recurring directory name, the distinctive class and method, and the pipe-separated hex-fragment loader structure.

## Observed wk directory pattern

The first screenshot shows `wk` directly under `wp-content`. A directory name this short is not definitive evidence, so the finding is meaningful primarily when correlated with the other paths and code sample.

![File manager showing a wk directory directly under wp-content](/wordpress-researches/wk_evidence-1.png "A wk directory is visible directly under wp-content. The screenshot establishes the path only; it does not display the directory contents.")

The same name also appears under `mu-plugins`. Two sibling PHP filenames are visible, but their contents are not supplied here and they are not classified by this page.

![File manager showing a wk directory inside wp-content mu-plugins](/wordpress-researches/wk_evidence-2.png "The mu-plugins view contains a wk directory and two sibling PHP files. The sibling files were not analyzed for this entry.")

Separate views record `wk` under both themes and uploads.

![File manager showing a wk directory among installed WordPress themes](/wordpress-researches/wk_evidence-4.png "A directory named wk appears under wp-content/themes. The image does not show whether WordPress recognized it as an active theme.")

![File manager showing a wk directory inside WordPress uploads](/wordpress-researches/wk_evidence-5.png "A wk directory appears under wp-content/uploads alongside year and plugin-created folders. Its contents are not visible.")

## Confirmed findings

- Screenshots show `wk` directories under `wp-content`, `wp-content/mu-plugins`, `wp-content/themes`, and `wp-content/uploads`.
- The supplied PHP sample declares class `nigwqgqwtqwtqwt` and method `nigwqgqwtqwtqwti`.
- A long string contains many pipe-separated hexadecimal fragments.
- The visible code constructs function names indirectly, including a base64-decoding operation.
- The reconstructed layer is supplied to `eval()`.

## Technical analysis of the hex-fragment PHP loader

The code divides a long encoded program into many hexadecimal pieces separated by `|`. This makes common readable strings less obvious in the original file. A second layer dynamically reconstructs decoder-related function names and then evaluates the resulting content.

![Code editor showing a PHP class with pipe-separated hex fragments and an evaluation call](/wordpress-researches/wk_evidence-3.png "The retained code view shows class nigwqgqwtqwtqwt, a long hexadecimal fragment list, indirect decoder construction, and evaluation. The encoded payload is not published.")

```text
Redacted defensive excerpt

class distinctive_random_name:
    encoded_fragments = "<pipe-separated hexadecimal data omitted>"

    decoded_layer = reconstruct_with_indirect_decoder_names(encoded_fragments)
    evaluate(decoded_layer)  # payload omitted
```

No encoded fragments, callable-construction details, request parameters, or payload implementation are reproduced publicly.

## Relationship between the observed artifacts

The directory screenshots and PHP sample were retained as part of the same investigation record. That supports examining them together, but it does not prove that identical copies existed in all four directories. A defensible recurrence hunt should compare file contents, class names, and code structure rather than treating the name `wk` as sufficient.

## Analyst assessment

The code structure is consistent with an obfuscated PHP loader because it hides a substantial program behind hexadecimal fragments and runtime reconstruction before evaluation. That finding does not require executing or decoding the payload.

The repeated directory name may represent distributed copies or staging locations, but the screenshots do not establish copying, automatic restoration, or execution from each path. Those remain hypotheses to test with file hashes, content comparison, timestamps from reliable records, and logs.

## Indicators of compromise

### Higher-confidence indicators

- Class `nigwqgqwtqwtqwt`
- Method `nigwqgqwtqwtqwti`
- A long pipe-separated hexadecimal fragment string
- Indirect decoder-name construction followed by `eval()`
- The combined recurrence of `wk` directories across several WordPress content paths during one investigation

### Contextual indicators

- Directory name `wk`
- Filename `index.php`
- `wp-content/uploads`
- `wp-content/themes`
- `wp-content/mu-plugins`
- `eval()` or base64 decoding

None of these contextual values establishes infection alone. Use the class, method, fragment format, and surrounding control flow for confirmation.

## What this evidence does not establish

- Directory listings do not reveal the files inside the four `wk` folders.
- The evidence does not prove that the supplied `index.php` existed in every observed directory.
- The encoded payload was not decoded, so its specific capabilities are not claimed.
- The screenshots do not prove execution or a recreation chain.
- The excluded permissions image shows a `0555` directory setting but does not connect that setting to this artifact or prove who changed it.
- No initial access method, vulnerable component, affected version, duration, or client outcome was confirmed.

## Artifact-specific remediation

Preserve each `wk` directory and its metadata before changing it. Inventory contents and compare files by cryptographic hash in the private investigation record. Search for the distinctive class, method, and pipe-separated fragment structure across the hosting account.

Remove confirmed unauthorized standalone files and replace modified legitimate components with trusted copies. Review executable files under uploads, top-level MU-plugins, scheduled tasks, administrator accounts, and database options for independently confirmed persistence. The [file-types guide](/blog/file-types-that-hide-malware-on-wordpress/) provides broader hunting context.

## Recurrence verification

- Monitor all four documented paths for recreation of `wk`.
- Repeat the class, method, and structural code search after normal traffic and scheduled events.
- Compare any returning file with the preserved evidence rather than relying only on its path.
- Confirm that legitimate plugins, themes, uploads, and MU-plugins continue to function after removal.

## Related malware research

- [Compact Extension Vox MU-plugin artifact](/malware-research/menu-queue-bit-compact-extension-vox/)
- [wp-config.php XOR temporary-file loader](/malware-research/wp-config-xor-temporary-file-loader/)
- [HTTP-header-gated PHP loader](/malware-research/http-header-gated-php-loader/)

## Methodology and privacy note

This analysis uses five privacy-reviewed screenshots and one supplied encoded PHP sample from an anonymized investigation. A sixth permissions screenshot was excluded because it does not establish causation. The encoded payload remains private and was neither decoded nor executed during this work.
