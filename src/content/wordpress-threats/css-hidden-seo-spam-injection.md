---
title: "CSS Hidden SEO Spam Injection"
slug: "css-hidden-seo-spam-injection"
reportDate: "2026-01-24"
threatType: "SEO Spam"
severity: "Medium"
fileHash: "db-spam-malware"
detectedPaths: ["New Text Document.txt"]
screenshots: ["/images/wordpress-threats/db-spam-malware_evidence-1.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "Deceives search engines by manipulating SEO ratings, potentially penalizing the website's search ranking."
seenOn: "Theme or Plugin PHP files"
behavior: "Injects hidden links to improve the SEO of external sites illicitly."
difficulty: "Easy"
recurrence: "Medium"
numberOfSiteFixed: "Not specified"
---

## Technical Analysis
The malware injects hidden SEO spam links into WordPress by using a combination of HTML, JavaScript, and CSS. The HTML creates a div with an anchor tag that links to an external site exploiting SEO. The JavaScript then dynamically inserts CSS into the page header, using the 'style' element to hide this div by moving it off-screen. This matches the user context description of SEO spam hidden with CSS.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain
1. 1. Malware code creates a div with an anchor link and specific IDs.
2. 2. JavaScript function appends CSS to the page header.
3. 3. CSS moves the div off-screen, making it invisible to users but still accessible to search engines.

## Code Signature(s)

### FILE: `New Text Document.txt`
```txt
<div id="M6bMm64IekltUmnGh3vrm9"><p><a href="https://andrikofarmakeio.com/">κοιτάξτε εδώ</a></p></div><script type="text/javascript">function oeYR5CtKOu7Yvb(){var mbO=document.getElementsByTagName('hea'+'d')[0];var JRm='#M6bMm64IekltUmnGh3vrm9{margin:0px 20px;position:fixed;overflow:hidden;top:-152413851px;display:block;z-index:412406018;}';var Ika8H=document.createElement('st'+'yl'+'e');Ika8H.type='text/css';if(Ika8H.styleSheet){Ika8H.styleSheet.cssText=JRm}else{Ika8H.appendChild(document.createTextNode(JRm))}mbO.appendChild(Ika8H)}oeYR5CtKOu7Yvb();</script>
```


## Indicators of Compromise (IOCs)
- `andrikofarmakeio.com`
- `M6bMm64IekltUmnGh3vrm9`
- `oeYR5CtKOu7Yvb`

## Removal Protocol
1. 1. Identify and open all files modified recently, especially those in plugins and themes.
1. 2. Remove the block of HTML, JavaScript, and CSS code related to the injected div.
1. 3. Scan for any other instances of similar code across the site.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
