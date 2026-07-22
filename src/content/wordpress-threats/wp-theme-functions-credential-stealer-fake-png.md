---
title: "Functions.php Credential Logger Using a Fake PNG File"
h1: "WordPress functions.php Credential Logger Writing to a Fake PNG Filename"
slug: "functions-php-credential-logger-fake-png"
description: "Forensic analysis of a functions.php authentication hook that appends submitted WordPress login values to a local fake-PNG-named file."
status: "published"
reportDate: "2026-04-25"
lastReviewed: "2026-07-22"
threatCategory: "Credential logging"
affectedComponents:
  - "Loaded WordPress theme functions.php"
  - "WordPress authenticate filter"
  - "Local wp-content/uploads storage"
observedLocations:
  - "Loaded theme functions.php"
  - "Code-defined destination: wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png"
confirmedBehaviors:
  - "Registers an anonymous callback on the WordPress authenticate filter at priority 999"
  - "Checks for a non-error authentication result and non-empty login and password values"
  - "Appends the supplied login and password values to a local path"
  - "Returns the original authentication result after the write attempt"
confidence: "High"
severity: "High"
severityRationale: "The supplied code attempts to record WordPress login values in local storage under an image-like filename. The evidence does not show how many writes succeeded or whether the file was retrieved."
evidenceSource: "Anonymized WordPress client investigation with a retained functions.php screenshot and supplied code"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/function.php-malware_evidence-1.png"
    alt: "Theme functions.php editor showing an authenticate hook and local file write beneath a session analytics comment"
    caption: "The highlighted theme code registers an authenticate callback and calls file_put_contents with an encoded destination. The theme name is irreversibly redacted."
    supports: "A credential-logging hook was present in a loaded theme functions.php file"
    width: 1282
    height: 585
    privacyReviewed: true
indicators:
  - value: "WordPress session analytics"
    type: "comment-marker"
    confidence: "higher"
  - value: "wp-content/uploads/2024/06/Stained_Heart_Red-600x500[.]png"
    type: "file-path"
    confidence: "higher"
  - value: "authenticate filter at priority 999 followed by an append write"
    type: "code-structure"
    confidence: "higher"
  - value: "functions.php"
    type: "filename"
    confidence: "contextual"
  - value: "file_put_contents()"
    type: "php-function"
    confidence: "contextual"
limitations:
  - "The retained evidence does not show the contents of the destination file."
  - "No network transfer or retrieval of recorded values was observed."
  - "The evidence does not establish how the theme file was modified."
  - "No vulnerable component or affected version was identified."
  - "The period during which the code was present is not established."
relatedResearch:
  - "savvywolf-manager-php-web-shell"
  - "http-header-gated-php-loader"
  - "wp-config-xor-temporary-file-loader"
relatedGuides:
  - title: "File types used to disguise WordPress malware"
    href: "/blog/file-types-that-hide-malware-on-wordpress/"
  - title: "How to detect WordPress malware"
    href: "/blog/how-to-detect-wordpress-malware/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "login-credential-risk"
    - "suspicious-files-code"
  searchDescription: "WordPress logins work normally but theme code writes passwords to a fake PNG? Review an authenticate-filter credential logger found in functions.php."
  summary: "This entry matters when a security review finds login-hook code in a theme even though users have not noticed a broken login form. The supplied code appended submitted credentials to a local file disguised with a PNG extension."
  observed:
    - "The retained functions.php code hooked WordPress authentication and appended submitted usernames and passwords to a local fake-PNG file."
  possible:
    - "Logins may continue to appear normal because the code recorded input without intentionally blocking authentication."
    - "A file with an image-like extension may contain text credential records rather than image data."
  questions:
    - "Can WordPress theme code record passwords while login still works?"
    - "Why does a PNG file contain usernames or password-like text?"
  evidenceNote: "Local credential logging is confirmed in code; network exfiltration and use of any recorded credential were not established."
canonical: "https://www.mdpabel.com/malware-research/functions-php-credential-logger-fake-png/"
index: true
---

## Summary

This research entry documents a short credential-logging routine observed in a loaded WordPress theme's `functions.php`. The supplied code attaches an anonymous callback to the `authenticate` filter at priority `999`. When that callback receives a non-error result plus non-empty login and password values, it attempts to append those values to a local file whose name ends in `.png`.

The code supports a high-confidence credential-logging assessment. The retained evidence does not show the destination file's contents, confirm a successful write, or show that recorded values were transferred over a network.

## Investigation context

The screenshot and supplied code came from one anonymized WordPress client investigation. The theme name is irreversibly redacted in the public image. The highlighted block appears after a comment reading `WordPress session analytics`, which is not a normal reason for a theme to record login values.

The [file-disguise guide](/blog/file-types-that-hide-malware-on-wordpress/) explains the broader problem of non-image content stored under image-like filenames. This page is limited to the authentication hook, write path, and evidence boundaries of this specific sample.

## Observed artifact in functions.php

The retained editor view shows the callback, its priority, the error/value checks, an error-suppressed `file_put_contents()` call, and a Base64-encoded path. A folder name in the theme tree was already redacted before publication.

![Theme functions.php editor showing an authenticate hook and local file write beneath a session analytics comment](/wordpress-researches/function.php-malware_evidence-1.png "The highlighted theme code registers an authenticate callback and calls file_put_contents with an encoded destination. The theme name is irreversibly redacted.")

## Confirmed findings

- The supplied code registers a callback on WordPress's `authenticate` filter with priority `999` and three accepted arguments.
- It checks that the authentication result is not a `WP_Error` and that the login and password variables are non-empty.
- It calls `file_put_contents()` with append mode and suppresses write warnings.
- It returns the original authentication result after the write attempt, allowing the normal authentication flow to continue.
- Static review of the supplied encoded string resolves to `wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png`.

## Technical analysis of the credential logger

WordPress passes the submitted login and password through authentication filters. By using a late priority and checking for a non-error result, this callback is structured to record values associated with an accepted authentication result. The output is appended rather than overwritten, so multiple successful write attempts could accumulate in the same file.

The `.png` suffix does not make the written data an image. The supplied write expression concatenates text values and a line ending. The image-like name and uploads location can make the file less conspicuous during a casual directory review.

```text
Redacted defensive excerpt

on WordPress authentication(result, submitted_login, submitted_password):
    if result is not an error and both submitted values are present:
        append the two submitted values to a local image-named path

    return the original authentication result
```

The full destination encoding, executable PHP, and credential-record format are not reproduced. This summary preserves the detection-relevant control flow without providing a complete credential logger.

## Analyst assessment

The hook, late priority, value checks, append operation, and disguised destination are consistent with deliberate credential collection. Because the code returns the original authentication result, a visitor could experience a normal login flow while the local write is attempted.

That assessment does not establish that any particular user's credentials were recorded. Confirmation would require the preserved destination file, reliable timestamps, or other incident evidence that is not included in this public entry.

## Indicators of compromise

### Higher-confidence indicators

- Comment marker: `WordPress session analytics`
- Defanged destination: `wp-content/uploads/2024/06/Stained_Heart_Red-600x500[.]png`
- An `authenticate` filter at priority `999` combined with an append write of the submitted values
- The sequence of non-error authentication check, local write, and unchanged result return

### Contextual indicators

- Modified `functions.php`
- `file_put_contents()`
- `base64_decode()`
- A `.png` file under `wp-content/uploads`

Those generic functions, files, and extensions are common in legitimate code. They should be investigated in combination with the distinctive marker, destination, and authentication-hook structure.

## What this evidence does not establish

- It does not show the contents of the fake-PNG-named file.
- It does not prove that a local write succeeded.
- No network exfiltration or later retrieval was observed.
- The number or identity of potentially recorded accounts is not known.
- The initial compromise method was not confirmed.
- No vulnerable plugin, theme, or affected version was identified.
- The evidence does not establish how long the code remained in the theme.

## Artifact-specific remediation

Limit administrator logins while preserving the affected theme file, the code-defined destination, and relevant logs when incident reconstruction matters. Replace the compromised theme with a verified clean copy. Inspect the destination as evidence before removing it; never expose or reproduce any credentials it may contain.

Search other loaded and inactive themes for the marker and authentication/write structure. Review administrator accounts and authentication logs, invalidate active sessions where appropriate, and rotate WordPress and hosting credentials within the potential exposure scope. The broader [WordPress malware detection guide](/blog/how-to-detect-wordpress-malware/) and [malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) cover full-site response.

## Recurrence verification

- Compare the restored theme with its trusted source.
- Search all PHP code for the marker and the authentication/write combination.
- Confirm the fake-PNG-named destination does not reappear after controlled login tests.
- Review logs for unexpected access to the destination path, if historical logging exists.
- Monitor the theme file through scheduled tasks, deployments, and administrator activity.

## Related malware research

- [SavvyWolf MANAGER PHP web-shell variant](/malware-research/savvywolf-manager-php-web-shell/)
- [HTTP-header-gated PHP loader](/malware-research/http-header-gated-php-loader/)
- [wp-config.php XOR temporary-file loader](/malware-research/wp-config-xor-temporary-file-loader/)

## Methodology and privacy note

This entry is based on one privacy-reviewed screenshot and a supplied PHP sample from an anonymized investigation. The public screenshot contains an irreversible theme-name redaction. No captured credentials or complete operational logger are published. The static code findings are separated from conclusions that would require destination-file or network evidence.
