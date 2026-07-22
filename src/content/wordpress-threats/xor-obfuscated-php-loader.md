---
title: "wp-config.php XOR Temporary-File Loader: Malware Research"
h1: "XOR-Decoding Temporary-File Loader in wp-config.php"
slug: "wp-config-xor-temporary-file-loader"
description: "Forensic analysis of a wp-config.php loader that hex-decodes request data, applies single-byte XOR, and includes a temporary .desc file."
status: "published"
reportDate: "2026-01-24"
lastReviewed: "2026-07-22"
threatCategory: "Request-gated PHP loader"
affectedComponents:
  - "WordPress wp-config.php"
  - "Writable PHP temporary directories"
observedLocations:
  - "Top of wp-config.php"
  - "Code-defined temporary filename: .desc"
confirmedBehaviors:
  - "Checks for an obfuscated mrk request key"
  - "Hex-decodes the supplied value"
  - "Applies a single-byte XOR transformation"
  - "Searches several candidate temporary directories for a writable location"
  - "Writes, includes, and then attempts to delete a .desc file"
confidence: "High"
severity: "High"
severityRationale: "The supplied code transforms request data, writes the result to a temporary PHP-readable file, and includes that file. The evidence does not include a triggering request or establish the source of the injection."
evidenceSource: "Anonymized WordPress client investigation with a retained wp-config.php screenshot and supplied PHP source"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/wp-config-xor-backdoor-mrk-parameter_evidence-1.png"
    alt: "wp-config.php editor showing a compact request-gated XOR loader before normal WordPress configuration"
    caption: "The injected first line reads a request value, transforms it, and tries writable temporary directories before normal wp-config.php content begins."
    supports: "A request-gated temporary-file loader was inserted at the top of wp-config.php"
    width: 1398
    height: 837
    privacyReviewed: true
indicators:
  - value: "mr\\x6B"
    type: "request-key-string"
    confidence: "higher"
  - value: ".desc"
    type: "temporary-filename"
    confidence: "higher"
  - value: "hex2bin followed by a byte-wise XOR with 66"
    type: "code-structure"
    confidence: "higher"
  - value: "write, include, unlink sequence across temporary-directory candidates"
    type: "code-structure"
    confidence: "higher"
  - value: "wp-config.php"
    type: "filename"
    confidence: "contextual"
  - value: "file_put_contents() and include"
    type: "php-functions"
    confidence: "contextual"
limitations:
  - "No triggering request or transformed payload was retained in the public evidence."
  - "The screenshot does not prove that a temporary write or include succeeded."
  - "The initial compromise method was not confirmed."
  - "No vulnerable component or affected version was identified."
  - "The lifespan and recurrence of the injected line are not established."
relatedResearch:
  - "http-header-gated-php-loader"
  - "savvywolf-manager-php-web-shell"
  - "php-footer-remote-content-loader"
relatedGuides:
  - title: "How to recognize obfuscated PHP malware in WordPress"
    href: "/blog/wordpress-obfuscated-php-malware-detection/"
  - title: "Hidden backdoor investigation in wp-content"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "suspicious-files-code"
    - "recurring-malware"
  searchDescription: "Found XOR-obfuscated PHP at the top of wp-config.php? Review a temporary-file loader pattern and why the site may still look normal."
  summary: "This entry is relevant when wp-config.php contains unreadable PHP before the normal WordPress configuration. The supplied code decoded data, wrote a temporary PHP file, included it, and attempted cleanup; the decoded payload was not retained."
  observed:
    - "The supplied wp-config.php modification used XOR-style decoding and a write-include-delete temporary-file sequence."
  possible:
    - "The site may continue to load normally while the injected block runs before WordPress initialization."
    - "A scanner may repeatedly flag wp-config.php even when the temporary file is no longer present."
  questions:
    - "Why is there XOR-obfuscated PHP in wp-config.php?"
    - "Can a temporary PHP loader delete its dropped file after inclusion?"
  evidenceNote: "The loader sequence is confirmed; the decoded payload, execution trace, and original entry point are unavailable."
canonical: "https://www.mdpabel.com/malware-research/wp-config-xor-temporary-file-loader/"
index: true
---

## Summary

This entry examines a compact PHP loader observed before the normal configuration statements in `wp-config.php`. The supplied code checks for an obfuscated request key that resolves to `mrk`, hex-decodes the associated value, applies a byte-wise XOR transformation, and searches several temporary directories for a writable location.

When a write succeeds, the code includes a file named `.desc`, attempts to delete it, and exits. The evidence directly supports that control flow. It does not include a triggering request or payload and therefore does not establish what code, if any, executed during the investigated incident.

## Investigation context

The artifact was retained during one anonymized WordPress client investigation. The screenshot shows the entire injected line at the top of `wp-config.php`, immediately before a normal `WP_CACHE` definition and the standard WordPress configuration comments.

The broad [obfuscated PHP malware guide](/blog/wordpress-obfuscated-php-malware-detection/) explains how to inspect encoded PHP safely. This research entry focuses on one distinctive request-to-temporary-file flow and does not reproduce a working handler.

## Observed artifact in wp-config.php

The screenshot confirms the location and overall structure: request-key check, `hex2bin()`, an XOR loop, an array of candidate temporary directories, a write to `.desc`, `include`, and cleanup with `unlink()`.

![wp-config.php editor showing a compact request-gated XOR loader before normal WordPress configuration](/wordpress-researches/wp-config-xor-backdoor-mrk-parameter_evidence-1.png "The injected first line reads a request value, transforms it, and tries writable temporary directories before normal wp-config.php content begins.")

## Confirmed findings

- The injected code was located before the normal WordPress configuration body.
- It checks the request collection for the string represented as `mr\x6B`, which resolves to `mrk`.
- It passes the supplied value through `hex2bin()`.
- It transforms the decoded bytes with a repeated XOR operation using decimal `66`.
- It enumerates environment, session, upload, working, and system temporary-directory candidates.
- On a successful write, it includes `.desc`, attempts to unlink the file, and exits.

## Technical analysis of the XOR temporary-file loader

The sample separates transport from execution. Request data is not included directly. It is first converted from hexadecimal text into bytes and then transformed one byte at a time. The result is assigned to a buffer that the code attempts to write to a hidden-looking filename in the first usable temporary location.

### Defensive control-flow summary

```text
Redacted defensive excerpt

if a distinctive request marker is present:
    bytes = hex_decode(the supplied value)
    transformed = apply_a_fixed_single_byte_xor(bytes)

    for each candidate temporary directory:
        if the directory is writable:
            write transformed bytes to a hidden .desc file
            include that temporary file
            attempt to delete it
            stop processing
```

The public excerpt deliberately omits runnable PHP, the complete request handler, and an operational payload format. The exact static tokens remain listed as defensive indicators.

### Disk activity and cleanup

The previous draft said the loader avoided direct disk alteration. That was inaccurate. The supplied code explicitly calls `file_put_contents()` before `include`. The later `unlink()` attempt may shorten the file's lifetime, but it does not mean no file was created, and deletion is not guaranteed to succeed.

## Analyst assessment

The request gate, reversible transformation, transient write, include, and delete sequence are consistent with a loader intended to execute a supplied PHP stage while reducing how long that stage remains on disk. That intent is an analyst assessment based on the visible code structure. Actual payload execution would require evidence of a triggering request and a successful write/include path, neither of which is retained here.

## Indicators of compromise

### Higher-confidence indicators

- Request-key representation: `mr\x6B`
- Hidden temporary filename: `.desc`
- `hex2bin()` followed by a byte-wise XOR using decimal `66`
- The sequence of candidate-directory search, write, include, unlink, and exit
- This compact sequence placed before normal `wp-config.php` content

### Contextual indicators

- Modified `wp-config.php`
- `$_REQUEST`
- `file_put_contents()`
- `include`
- `unlink()`
- References to `/tmp`, `/var/tmp`, `/dev/shm`, or `sys_get_temp_dir()`

Those filenames, variables, functions, and directories have legitimate uses. They become meaningful when they occur in the distinctive combined flow.

## What this evidence does not establish

- No triggering HTTP request was retained.
- No transformed payload is published or analyzed here.
- The screenshot does not prove that a temporary write, include, or delete succeeded.
- The initial compromise method was not confirmed.
- No vulnerable plugin, theme, core version, or server component was identified.
- The evidence does not establish attribution, prevalence, duration, or client outcome.

## Artifact-specific remediation

Preserve the affected `wp-config.php`, relevant timestamps, and access logs before replacement when investigation history matters. Compare the file with a known-good configuration, remove the confirmed injected line, and preserve legitimate salts and configuration values during restoration.

Search the account for the distinctive marker and full transformation/write/include structure. Inspect temporary directories and other bootstrap files, review administrator and hosting access, and rotate credentials appropriate to the confirmed exposure scope. For full incident response, use the [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/).

## Recurrence verification

- Recompare `wp-config.php` after normal requests and scheduled tasks.
- Repeat the structural search across PHP files and writable temporary locations.
- Review access logs for suspicious requests to the site entry points; do not replay a suspected payload.
- Monitor file creation for `.desc` in relevant temporary directories where operationally safe.
- Confirm that the injected line does not return after deployments or administrator logins.

## Related malware research

- [HTTP-header-gated PHP loader](/malware-research/http-header-gated-php-loader/)
- [SavvyWolf MANAGER PHP web-shell variant](/malware-research/savvywolf-manager-php-web-shell/)
- [PHP footer remote-content loader](/malware-research/php-footer-remote-content-loader/)

## Methodology and privacy note

This page is based on one privacy-reviewed screenshot and supplied PHP source from an anonymized investigation. The code was reviewed statically and was not executed. The complete request handler and any payload remain outside the public page; the excerpt is an inert defensive summary. Confirmed code operations are separated from the unobserved runtime outcome.
