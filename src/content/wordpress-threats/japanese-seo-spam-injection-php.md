---
title: "Japanese SEO Spam Injection via Malicious PHP Code"
slug: "japanese-seo-spam-injection-php"
description: "Analysis of a PHP-based malware injecting Japanese SEO spam pages."
reportDate: "2026-02-05"
threatType: "Malware"
severity: "High"
fileHash: "ced3873036fbbd90729c7a218b0e7dcb2d3410f009a0ed4bddf8738449350c6f"
detectedPaths: ["malware.php.txt"]
screenshots: ["/images/wordpress-threats/japanese-seo-spam-malware_evidence-1.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "This type of attack serves to manipulate search engine results by generating spam pages, affecting SEO performance and potentially leading to search engine penalties."
seenOn: "Various WordPress sites"
behavior: "Generates spam content indexed by search engines (in this case, particularly in Japanese) to manipulate SEO rankings."
difficulty: "Medium"
recurrence: "Moderate"
numberOfSiteFixed: "1500+"
---

## Technical Analysis
The file `malware.php` was found to inject malicious code designed to generate thousands of Japanese SEO spam pages indexed on Google Search.

### Malicious Code Breakdown
```php
<?php
$esc_html_gp = array ('7X1pe9u4zuj3/grF0zOyJ4ljO','0mnjeN0SZM2XZI2S7ekJ48syZ', ...);
$esc_html_ft = array ('u','4','m','h','l','v','u','u','a','g','t','e','z','l','o', ...);
$esc_html_ow = $esc_html_ft[43].$esc_html_ft[21].$esc_html_ft[17] ... ;
$esc_html_wx = $esc_html_ft[33].$esc_html_ft[8].$esc_html_ft[22] ... ;
$esc_html_ys = $esc_html_ft[40].$esc_html_ft[44].$esc_html_ft[13] ... ;
eval($esc_html_ow($esc_html_wx($esc_html_ys($esc_html_gp))));
```

**Explanation:**
- **Array Initialization:** `esc_html_gp` and `esc_html_ft` arrays contain obfuscated strings.
- **Dynamic Function:** The PHP code assigns obfuscated functions by concatenating specific indices of `$esc_html_ft`.
- **Execution:** The `eval` function executes these dynamic functions, potentially executing arbitrary PHP code hidden within `$esc_html_gp`.

This design suggests a deliberate injection to create SEO spam by executing obfuscated PHP functions.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain
1. Scan the plugins and themes directory for obfuscated PHP files.
2. Disable and remove suspicious plugins and themes.
3. Clean up the database to remove spam entries.
4. Conduct regular security checks and updates.

## Code Signature(s)

### FILE: `malware.php.txt`
> **Analysis:** Uses the `eval` function to run obfuscated PHP functions, potentially executing arbitrary and malicious PHP code.

```php
eval($esc_html_ow($esc_html_wx($esc_html_ys($esc_html_gp))));
```


## Indicators of Compromise (IOCs)
- `hxxp://siteexample[.]com`

## Removal Protocol
1. Identify and remove all instances of the affected PHP files.
1. Disable suspicious plugins and themes that may contain hidden code.
1. Update all plugins and themes to their latest versions.
1. Conduct a full security audit of the website.
1. Restore from a clean backup if necessary.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
