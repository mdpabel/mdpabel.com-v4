---
title: 'Recursive .htaccess PHP Execution Lockout'
slug: 'recursive-htaccess-php-denial'
metaDescription: 'Technical analysis of the recursive .htaccess PHP lockout. Learn how hackers use mixed-case PHP regex to cause 403 Forbidden errors and how to clean a mass infection.'
reportDate: '2026-01-27'
threatType: 'Configuration Hijacking / Denial of Service'
severity: 'Critical'
fileHash: 'htaccess-recursive-lockout-v2'
detectedPaths: ['All Site Directories (Recursive Injection)']
screenshots: ['/images/wordpress-threats/htaccess-php-lockout_evidence-1.png']
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: '0/60 (Configuration File - Often Undetected)'
impact: 'Complete Denial of Service (DoS). The site returns 403 Forbidden on all pages. The WordPress Dashboard (wp-admin) returns 500 Internal Server Error or 403 Forbidden because core scripts (admin-ajax.php, load-scripts.php) are blocked.'
seenOn: 'Bluehost, HostGator environments (Mass Infection)'
behavior: 'Recursively drops malicious .htaccess files into every writable directory to enforce a global PHP lockout.'
difficulty: 'Hard (Due to volume of files)'
recurrence: 'High (If the dropper script is not removed)'
numberOfSiteFixed: '15'
---

## Technical Analysis

This malware operates as a **"Scorched Earth"** denial mechanism. Unlike standard backdoors that try to stay hidden, this infection aggressively modifies the server's Access Control Lists (ACLs).

It places a malicious `.htaccess` file in **every single directory** of the WordPress installation (wp-content, wp-includes, uploads, individual plugin folders).

**Key Evasion Techniques:**

1.  **Case-Insensitive Regex:** The code `<FilesMatch '.(...|PHP|Php|PHp|...)$'>` targets every possible capitalization of the `.php` extension. This allows it to persist even if the server has security rules that only check for lowercase `.php` files.
2.  **The "Suspected" Marker:** The inclusion of the `suspected` extension in the deny list suggests the attacker may rename their own dropped files to `.suspected` to hide them from standard scans while simultaneously protecting them from external access.
3.  **Index Funneling:** By allowing _only_ `index.php`, the malware forces all traffic to hit the root index. If the `index.php` is also compromised (commonly seen with this infection), it ensures the malware payload executes on every page load.

## Attack Chain

1.  **Breach:** Attacker uploads a "Dropper" script (often named `ai.php`, `about.php`, or a random string).
2.  **Traversal:** The dropper executes and loops through every folder in the hosting account.
3.  **Injection:** It writes the restrictive `.htaccess` code into thousands of directories instantly.
4.  **Lockout:** The site immediately goes offline with 403 errors; the owner is locked out of wp-admin.

## Code Signature(s)

### FILE: `.htaccess` (Malicious Pattern)

```apache
<FilesMatch '.(py|exe|phtml|php|PHP|Php|PHp|pHp|pHP|pHP7|php7|phP|PhP|php5|php8|suspected)$'>
Order allow,deny
Deny from all
</FilesMatch>
<FilesMatch '^(index.php)$'>
Order allow,deny
Allow from all
</FilesMatch>

## Indicators of Compromise (IOCs)

- `<FilesMatch '.(py|exe|phtml|php|PHP|Php|PHp|pHp|pHP|pHP7|php7|phP|PhP|php5|php8|suspected)$'>`
- Mass File Changes: Timestamps on thousands of folders update simultaneously.
- 403 Forbidden: Accessing any direct PHP file (e.g., wp-login.php, license.txt) results in a 403 error.
- Unique Regex: Presence of mixed-case PHP extensions (PHp, pHP) or the .suspected extension in .htaccess.

## Removal Protocol

1. Perform a recursive scan to identify all .htaccess files.
1. Delete all malicious .htaccess files.
1. Regenerate a clean, standard WordPress .htaccess in the root directory.

> **Status:** Active Threat.
> **Verification:** Verified by MD Pabel.
```
