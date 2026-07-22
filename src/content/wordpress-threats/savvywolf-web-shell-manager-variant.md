---
title: "SavvyWolf MANAGER PHP Web Shell: WordPress Malware Research"
h1: "SavvyWolf MANAGER PHP Web-Shell Variant"
slug: "savvywolf-manager-php-web-shell"
description: "Forensic analysis of a SavvyWolf MANAGER PHP shell interface and code that searched for a WordPress root before copying itself to three paths."
status: "published"
reportDate: "2026-01-31"
lastReviewed: "2026-07-22"
threatCategory: "PHP web shell"
affectedComponents:
  - "WordPress filesystem"
  - "PHP runtime"
observedLocations:
  - "wp-content/edit-wolf.php"
  - "Code-defined target: wp-admin/admin-wolf.php"
  - "Code-defined target: wp-includes/widgets/class-wp-wolf-widget.php"
confirmedBehaviors:
  - "Displays a SavvyWolf MANAGER directory interface"
  - "Searches parent paths for WordPress directory markers"
  - "Defines copy targets under wp-admin, wp-content, and wp-includes/widgets"
  - "Attempts to copy its current file to each available target directory"
confidence: "High"
severity: "High"
severityRationale: "The retained interface exposes the WordPress content directory and the supplied code attempts to create additional copies. The evidence does not establish root-level server privileges or the original access route."
evidenceSource: "Anonymized WordPress client investigation with a privacy-redacted interface screenshot and supplied PHP source"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/savvywolf-php-web-shell_evidence-1.png"
    alt: "SavvyWolf MANAGER interface listing folders and files under a WordPress wp-content directory"
    caption: "The retained interface identifies itself as SavvyWolf MANAGER and lists the investigated wp-content directory. The client-specific home path is irreversibly redacted."
    supports: "A SavvyWolf-branded PHP manager interface was present in the WordPress filesystem"
    width: 1452
    height: 815
    privacyReviewed: true
indicators:
  - value: "SavvyWolf - MANAGER"
    type: "interface-marker"
    confidence: "higher"
  - value: "edit-wolf.php"
    type: "filename"
    confidence: "higher"
  - value: "admin-wolf.php"
    type: "filename"
    confidence: "higher"
  - value: "class-wp-wolf-widget.php"
    type: "filename"
    confidence: "higher"
  - value: "wp-includes/widgets"
    type: "directory"
    confidence: "contextual"
  - value: "copy()"
    type: "php-function"
    confidence: "contextual"
limitations:
  - "The supplied excerpt does not establish every function available through the interface."
  - "The screenshot does not prove which file operations were performed."
  - "The initial compromise method and access credentials were not confirmed."
  - "No vulnerable WordPress component or affected version was identified."
relatedResearch:
  - "http-header-gated-php-loader"
  - "wp-config-xor-temporary-file-loader"
  - "functions-php-credential-logger-fake-png"
relatedGuides:
  - title: "File types used to disguise WordPress malware"
    href: "/blog/file-types-that-hide-malware-on-wordpress/"
  - title: "Hidden backdoor investigation in wp-content"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
relatedCaseStudies:
  - title: "Tiny File Manager backdoor found during a SiteGround suspension"
    href: "/case-studies/siteground-malware-detected-suspension-tiny-file-manager-backdoor/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "suspicious-files-code"
    - "recurring-malware"
  searchDescription: "Found a SavvyWolf PHP file manager or unknown shell interface on WordPress? Review its file-management UI and self-copy behavior."
  summary: "This entry is relevant when a scanner finds a SavvyWolf-named PHP file or a browser request exposes an unfamiliar server file-manager interface. The retained sample included filesystem controls and attempts to create additional copies."
  observed:
    - "The retained sample rendered a SavvyWolf file-management interface and contained self-copy attempts."
  possible:
    - "Directly opening the artifact may display an unfamiliar file-manager page outside WordPress administration."
    - "Removing one file may leave another copy if a copy attempt completed successfully."
  questions:
    - "What is a SavvyWolf file manager found on my WordPress server?"
    - "Why do unknown PHP shell files appear in more than one location?"
  evidenceNote: "The interface and copy logic are confirmed; the evidence does not establish who accessed it or which operations were performed."
canonical: "https://www.mdpabel.com/malware-research/savvywolf-manager-php-web-shell/"
index: true
---

## Summary

This entry documents a PHP artifact whose rendered interface identifies itself as **SavvyWolf - MANAGER**. A retained screenshot shows that interface listing directories and files under an anonymized WordPress `wp-content` path. The supplied PHP source also searches upward for WordPress directory markers and attempts to copy its current file to three WordPress-related locations.

The evidence supports a SavvyWolf web-shell classification and a self-copy attempt. It does not establish root-level operating-system access, the original deployment method, or every capability that may have existed in a longer sample.

## Investigation context

The artifact was observed during one anonymized WordPress client investigation. The privacy-safe screenshot preserves the manager branding, directory context, and file list while irreversibly obscuring the hosting account path.

A broader [hidden backdoor investigation in wp-content](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/) explains how unknown PHP files should be triaged. This page is narrower: it records the SavvyWolf interface marker, its defined filenames, and the copy flow present in the supplied code.

## Observed SavvyWolf MANAGER interface

The screenshot displays the heading `SavvyWolf - MANAGER`, an anonymized directory ending in `/wp-content`, common WordPress content folders, and files including `edit-wolf.php`. This is direct visual evidence of the branded interface and its filesystem context. It does not show a file being edited, uploaded, deleted, or executed.

![SavvyWolf MANAGER interface listing folders and files under a WordPress wp-content directory](/wordpress-researches/savvywolf-php-web-shell_evidence-1.png "The retained interface identifies itself as SavvyWolf MANAGER and lists the investigated wp-content directory. The client-specific home path is irreversibly redacted.")

## Confirmed findings

- The rendered page used the `SavvyWolf - MANAGER` label.
- The interface listed a WordPress `wp-content` directory and an `edit-wolf.php` file.
- The supplied source searches parent paths for `wp-content`, `wp-admin`, and `wp-includes/widgets` directories.
- It defines three target names: `admin-wolf.php`, `edit-wolf.php`, and `class-wp-wolf-widget.php`.
- It calls PHP's `copy()` function for each available target directory.

## Technical analysis of the self-copy logic

The source first tries to derive a likely site root from the current directory. If the current path contains `public_html`, it uses that boundary. Otherwise, it walks toward parent directories until it finds the three expected WordPress paths.

After locating a candidate root, the code checks each target directory and attempts to copy the current PHP file to a wolf-themed filename. The visible source records successful copy targets in an array, but the retained evidence does not independently confirm that all three writes succeeded in the investigated environment.

```text
Redacted defensive excerpt

candidate_root = locate_parent_with_wordpress_directories()

copy_targets = [
    "wp-admin/[wolf-themed filename]",
    "wp-content/[wolf-themed filename]",
    "wp-includes/widgets/[wolf-themed filename]"
]

for each existing target directory:
    attempt to copy the current file to the defined target
```

The public excerpt omits the operational interface and executable PHP implementation. It retains only the directory markers and copy pattern needed for defensive searches.

## Analyst assessment

The code's copy attempts are consistent with redundancy or persistence: removing one copy would not necessarily remove another successfully written copy. That purpose is an analyst assessment based on the source structure. The repository evidence does not show a later request to each target or prove that every copy remained executable.

## Indicators of compromise

### Higher-confidence indicators

- Interface marker: `SavvyWolf - MANAGER`
- `edit-wolf.php`
- `admin-wolf.php`
- `class-wp-wolf-widget.php`
- The three-file combination across `wp-content`, `wp-admin`, and `wp-includes/widgets`

### Contextual indicators

- A PHP file under `wp-content`
- References to `public_html`
- Directory walking with `dirname()`
- Use of `copy()`

These generic paths and functions require the distinctive branding, filenames, or code relationship before they should be treated as meaningful evidence.

## What this evidence does not establish

- The screenshot does not show which manager actions were available or used.
- The supplied excerpt does not prove root or administrator privileges on the server.
- It does not show that all three copy operations succeeded.
- The original deployment method was not confirmed.
- No vulnerable plugin, theme, or affected version was identified.
- No campaign attribution, prevalence, or client outcome is claimed.

## Artifact-specific remediation

Preserve the files, timestamps, and relevant access logs before removal when investigation history matters. Identify every copy by comparing content and verified hashes from the retained private evidence—not by deleting every file containing “wolf.” Remove confirmed malicious copies and replace affected WordPress core or third-party directories from trusted sources.

Review access logs for requests to the confirmed filenames, inspect other writable paths and persistence mechanisms, rotate credentials within the confirmed exposure scope, and verify administrator accounts. The [Tiny File Manager backdoor case study](/case-studies/siteground-malware-detected-suspension-tiny-file-manager-backdoor/) provides a separate full recovery narrative; it is not evidence that SavvyWolf entered the same way.

## Recurrence verification

- Search again for the three distinctive filenames after cleanup.
- Compare `wp-admin` and `wp-includes` with clean WordPress packages.
- Monitor file creation in the three code-defined target directories.
- Review requests to removed filenames and investigate any continuing source.
- Confirm that no copy reappears after scheduled tasks, deployments, or administrator logins.

## Related malware research

- [HTTP-header-gated PHP loader](/malware-research/http-header-gated-php-loader/)
- [wp-config.php XOR temporary-file loader](/malware-research/wp-config-xor-temporary-file-loader/)
- [functions.php credential logger using a fake PNG filename](/malware-research/functions-php-credential-logger-fake-png/)

## Methodology and privacy note

This entry uses one privacy-reviewed screenshot and a supplied PHP source excerpt retained from an anonymized investigation. Client-specific filesystem values are irreversibly redacted in the public image. The complete shell is not reproduced; the public code section is an inert defensive summary of the observed directory and copy logic.
