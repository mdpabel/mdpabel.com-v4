---
title: "Contain Self-Healing WordPress Malware While Sites Stay Live"
h1: "SC403 Live Containment: Stop WordPress Malware Rebuilding Files"
slug: "sc403-live-containment-guard"
description: "Learn how an SC403 Bash guard finds and quarantines self-healing WordPress malware while affected cPanel websites must remain online."
status: "published"
reportDate: "2026-09-11"
lastReviewed: "2026-09-11"
threatCategory: "Live containment of self-healing WordPress persistence"
affectedComponents:
  - "Shared-hosting WordPress installations"
  - "WordPress MU plugins and ordinary plugins"
  - "WordPress drop-ins"
  - "WordPress theme functions.php files"
  - "PHP per-directory configuration"
  - "WordPress configuration"
  - "ZIP recovery archives"
observedLocations:
  - "wp-content/mu-plugins/<attacker-alias>.php"
  - "wp-content/plugins/<attacker-alias>/"
  - "wp-content/advanced-cache.php"
  - "wp-content/object-cache.php"
  - "wp-content/db.php"
  - "wp-content/themes/*/functions.php"
  - "wp-content/uploads/YYYY/MM/<eight-hex>.zip"
  - "wp-content/themes/*/<eight-hex>.zip"
confirmedBehaviors:
  - "Discovers WordPress roots without bootstrapping WordPress or executing PHP"
  - "Reports high-confidence family indicators in read-only scan mode"
  - "Moves confirmed payloads outside the web root while preserving relative paths"
  - "Removes only marker-bounded theme injections and confirmed malicious configuration lines"
  - "Retains bounded first and latest copies when a monitored artifact is regenerated"
confidence: "High"
severity: "Critical"
severityRationale: "The guard was created for a critical multi-site compromise whose redundant persistence could execute before normal WordPress plugins and recreate removed payloads during public requests."
evidenceSource: "Static analysis of recovered SC 4.0.3 and 4.5.3 artifacts, anonymized shared-hosting scans, access-log correlation, and controlled filesystem tests of the containment script"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/sc403-live-guard-zero-findings_evidence-1.png"
    alt: "Privacy-redacted cPanel Terminal showing repeated zero-finding SC403 guard passes"
    caption: "The foreground guard repeatedly reports zero known filesystem indicators after discovering 24 WordPress roots. Account identifiers are redacted."
    supports: "The deployed guard completed repeated targeted passes without reporting a known filesystem IOC during the captured interval."
    width: 1730
    height: 909
    privacyReviewed: true
indicators:
  - value: "SC_ADV_BEGIN"
    type: "Code marker"
    confidence: "higher"
  - value: "SC_DB_BEGIN"
    type: "Code marker"
    confidence: "higher"
  - value: "SC_TH_BEGIN"
    type: "Code marker"
    confidence: "higher"
  - value: "SCOCV:"
    type: "Object-cache marker"
    confidence: "higher"
  - value: "__scf_"
    type: "Distinctive symbol prefix"
    confidence: "higher"
  - value: "SC_WC"
    type: "WordPress configuration marker"
    confidence: "higher"
  - value: "auto_prepend_file"
    type: "PHP configuration directive"
    confidence: "contextual"
  - value: "wp-content/uploads/YYYY/MM/<eight-hex>.zip"
    type: "Recovery archive pattern"
    confidence: "contextual"
limitations:
  - "The guard is temporary containment and does not prove that an affected site is safe."
  - "It does not remove database payloads, users, sessions, cron state, PHP shared memory, OPcache state, or browser service workers."
  - "A malicious process running as the same Unix account can modify or terminate the guard."
  - "A regenerated payload can execute before the next polling pass."
  - "Exact eight-hex filenames are contextual until their location and neighboring evidence support classification."
relatedResearch:
  - "sc-403-self-healing-wordpress-malware"
  - "system-control-hidden-backup-restoration"
  - "statemesh-mu-plugin-self-copy"
relatedGuides:
  - title: "Why WordPress malware keeps returning"
    href: "/blog/why-wordpress-malware-keeps-coming-back-and-how-to-stop-it-forever/"
  - title: "WordPress malware removal guide"
    href: "/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/"
relatedCaseStudies:
  - title: "Regenerating system-control malware case study"
    href: "/case-studies/regenerating-wordpress-malware-system-control-case-study/"
relatedService:
  title: "WordPress malware removal service"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "recurring-malware"
    - "suspicious-files-code"
    - "unknown-plugins"
  searchDescription: "Learn how an SC403 live containment guard helps stop self-healing WordPress malware from rebuilding files while cPanel sites stay online."
  summary: "This entry can help when known SC403 files return during normal visits and you cannot take every website in the hosting account offline at the same time."
  observed:
    - "Known persistence files can return after deletion when another recovery component receives a PHP or WordPress request."
    - "Site-specific eight-hex ZIP archives can appear in consecutive upload month directories and writable theme roots."
  possible:
    - "A short-lived guard may reduce repeated filesystem persistence while each site is rebuilt."
    - "A remaining database, memory, browser, or sibling-site source can continue the compromise outside the guard's scope."
  questions:
    - "Can I contain self-healing WordPress malware without taking every website offline?"
    - "How does the SC403 live-containment Bash script decide what to quarantine?"
    - "What must still be cleaned after the containment scan reports zero findings?"
  evidenceNote: "The implementation and tests support the stated filesystem behavior; they do not establish complete eradication or identify the original entry method."
canonical: "https://www.mdpabel.com/malware-research/sc403-live-containment-guard/"
index: true
---

## Summary

I built `sc403-live-containment.sh` because SC403 malware kept coming back on a shared-hosting account. Many WordPress sites used the same cPanel account, and they could not all be taken offline at once.

Deleting one visible file did not solve the problem. Another infected file could restore it when a visitor opened a page. The restore source could be an MU plugin, a WordPress drop-in, an infected theme, a PHP setting, a database copy, a memory copy, or a ZIP backup.

The guard is a Bash script that runs outside WordPress. It finds WordPress installations and checks the places where this malware was known to hide. It can report files, move them to quarantine, or keep watching for files that return. It never loads WordPress and never runs a PHP sample.

**This script is not a complete malware cleaner. A result of `found=0` does not prove that a website is clean.** It is a short-term safety tool to use while the full cleanup continues.

The underlying malware is documented in [SC 4.0.3 Self-Healing WordPress Malware That Rebuilds Itself](/malware-research/sc-403-self-healing-wordpress-malware/). This companion article explains the live guard without publishing its full private rule set or the complete source code.

## Why I built a shell guard instead of another WordPress plugin

Installing another WordPress plugin was not enough. Some parts of this malware can run before a normal plugin:

- `.user.ini` can use `auto_prepend_file` to run malware before the requested PHP file.
- WordPress loads `advanced-cache.php`, `object-cache.php`, and `db.php` very early.
- MU plugins load automatically and can conceal themselves from normal plugin-management screens.
- One infected site can write into another site when both use the same hosting user.

A shell script stored outside `public_html` does not need WordPress to work. It can check every WordPress site under the account, even when wp-admin is broken or hiding the malicious plugin.

This is still not a strong security wall. PHP and the guard run as the same hosting user. Malware with enough control could change or stop the script. The goal is simply to slow or interrupt file recovery while each site is cleaned.

## The live-site constraints

The affected account contained about two dozen WordPress installations. Public traffic could not be stopped for all of them at the same time. I gave the guard these rules:

1. Never run a recovered PHP file.
2. Make the first scan read-only.
3. Do not scan every account file every five seconds.
4. Act only on strong malware signs.
5. Save the first copy outside the public website folder.
6. Stop repeated files from filling the hosting disk.
7. Keep good code around a clearly marked infection.
8. Show every match and action in the terminal.

These rules shaped the whole script.

## How the guard works

The guard follows a small and clear process:

```text
resolve and validate the selected web root
                |
                v
find each wp-config.php and record the site root
                |
                v
inspect targeted persistence locations for each site
                |
        +-------+----------------+
        |                        |
     scan mode            quarantine/guard mode
        |                        |
   report only          quarantine or sanitize
                                 |
                                 v
                    wait a few seconds, then repeat
```

### Three operating modes

| Mode | Behavior | Intended use |
|---|---|---|
| `scan` | Reports possible matches and changes nothing | First review |
| `quarantine` | Runs one reversible containment pass | Controlled cleanup |
| `guard` | Keeps checking at a chosen interval | Temporary live protection |

The default guard interval is five seconds. A shorter interval may catch a returning file sooner, but it also uses more server resources.

### WordPress-root discovery

The script searches for `wp-config.php`. Each folder containing that file is treated as a WordPress site. This allows one scan to cover the main site and other WordPress sites under the same cPanel account.

Compare the reported site count with the domain list in cPanel. Some domains may share a folder, may not use WordPress, or may sit outside the selected path.

### Exact eight-hex matching

Some SC403 recovery files use a name made from exactly eight hexadecimal characters. Hexadecimal means the characters can be `0-9` and `a-f`; they are not always eight numbers. The guard validates the complete name instead of matching any filename that happens to contain eight characters.

The filename alone is not enough. The guard also checks where the file appears and whether other SC403 evidence is nearby. In this incident, matching ZIP files appeared in repeated upload-month folders and in a writable theme folder.

This limited approach helps avoid selecting ordinary ZIP files created by legitimate plugins.

### Content markers for ambiguous WordPress filenames

Files such as `advanced-cache.php`, `object-cache.php`, and `db.php` can be legitimate. The guard does not remove them only because of their names. It checks their contents for known SC403 code markers first.

Only a few public examples are shown in this article. The full marker list stays private so this post does not become a guide for avoiding the checks.

The same idea is used for suspicious MU-plugin files because the malware can change its plugin name. The guard checks a small set of important locations, which keeps the repeated scan lighter on shared hosting.

### Private rules and changing malware names

The malware used more than one fake plugin name and several hidden recovery paths. A fixed filename list would miss changed versions. The guard combines selected names, exact filename shapes, content markers, and expected locations.

I am not publishing the complete alias list, rule set, or source code here. Those details stay with the private incident notes and can be updated as the malware changes.

## Reversible quarantine

Before making a change, the script checks the selected path and refuses unsafe, overly broad locations. Every matched file must remain inside the selected website folder.

The first confirmed file is moved to a dated quarantine folder outside `public_html`. The original folder structure is kept, which makes later review and recovery easier. For example, a malicious file under:

```text
<web-root>/<site>/wp-content/mu-plugins/<alias>.php
```

is retained under:

```text
<account-home>/sc403-quarantine/<run-id>/<site>/wp-content/mu-plugins/<alias>.php
```

The quarantine folder uses account-only permissions. This keeps an evidence copy while removing it from the public website path.

An early version saved every returning copy. That could quickly fill the disk. The revised version keeps the first copy and the newest copy for each path. This gives useful evidence without allowing one returning file to create endless backups.

## Cleaning only known bad lines

Some infected files also contain good website code. The guard has three limited cleaners for these cases.

### Theme `functions.php`

The script changes a theme file only when it finds one clear start marker and one clear end marker. It saves the full infected copy first, removes only the marked block, and keeps the rest of the theme code.

If the markers are missing, incomplete, or repeated, the script stops and asks for manual review. It does not guess where the infection ends.

### PHP configuration

A `.user.ini`, `php.ini`, or `.htaccess` file may contain valid settings. The guard removes an `auto_prepend_file` line only when it also matches known incident evidence. Other settings are left in place.

PHP may keep an old setting in memory for a short time. On shared hosting, the change may not take effect until that cache expires or the host restarts the PHP workers.

### `wp-config.php`

The recovered malware added marked cache and temporary-folder lines to `wp-config.php`. The guard removes only the confirmed malicious lines and keeps the normal `ABSPATH` block. A complete backup is saved first.

A legitimate cache setting can be restored later from the trusted cache plugin configuration.

## Defensive code structure

This pseudocode shows the safety idea without publishing the full detector rules or working source.

**Redacted defensive excerpt**

```text
validate the selected website root
discover WordPress sites
check only known high-value locations

if a path is an exact known indicator:
    quarantine it

if a filename can also be legitimate:
    require a matching code marker before acting

if clear start and end markers surround injected code:
    back up the file and remove only that block

if the evidence is incomplete:
    report it and require manual review
```

The guard uses normal shell tools available on many cPanel servers. It does not load WordPress, connect to the database, or run PHP samples.

## How we built and tested it

I built the guard with Codex while I reviewed the evidence and controlled the cPanel deployment. We started with the recovered SC403 files and updated the checks when later variants showed new recovery locations.

The first version was tested in a safe sample folder containing:

- a test WordPress site;
- a malicious-looking MU plugin and drop-in;
- good theme code around a marked injected block;
- a bad PHP setting next to a good setting; and
- a file that returned after quarantine.

The tests confirmed that scan mode made no changes, quarantine moved only selected files, good theme and PHP settings remained, and repeated files did not create unlimited backups.

The first live read-only scan found remaining configuration markers and a full recovery set on one site. A separate uploads review found matching eight-hex ZIP files across several sites. We then improved the guard to recognize the exact filename shape only in verified locations and to ignore normal archives.

This matters because a useful malware guard must follow confirmed behavior, not one filename from one website.

The SHA-256 of the reviewed script snapshot on the report date was:

```text
c3ae104b14427557fe7205d10a366879fe89c8c9bb7294e15c868255b2ebbaba
```

Future versions will have a different hash. A checksum confirms the file version; it does not prove that the tool is right for every infection.

## Safe operating sequence

The script should be stored outside `public_html` and reviewed before use. Always run the read-only scan first:

```bash
chmod 700 /home/<account>/sc403-live-containment.sh
/home/<account>/sc403-live-containment.sh scan /home/<account>/public_html
```

Review every result. Only then run one quarantine pass or start the temporary guard:

```bash
/home/<account>/sc403-live-containment.sh quarantine /home/<account>/public_html
SC403_INTERVAL=5 /home/<account>/sc403-live-containment.sh guard /home/<account>/public_html
```

Guard mode keeps the terminal busy. A normal pass with no known matches looks like:

```text
[SUMMARY] found=0 moved=0 sanitized=0
```

![Privacy-redacted cPanel Terminal showing repeated zero-finding SC403 guard passes](/wordpress-researches/sc403-live-guard-zero-findings_evidence-1.png "The foreground guard repeatedly reports zero known filesystem indicators after discovering 24 WordPress roots. Account identifiers are redacted.")

*Figure 1 — The live guard completed repeated checks and found no known file indicators at those moments. This is not proof that the account was fully clean.*

An `[IOC]`, `[MOVED]`, `[CLEANED]`, or `[ROTATE]` line shows a match or action. If a site develops an error, stop the guard with `Ctrl+C` and review the related quarantine copy.

Use guard mode only for a short, monitored cleanup period. A longer interval reduces server load, but a bad file may run before the next check.

## Confirmed findings

- The shell guard can check known SC403 file locations without loading WordPress or running PHP.
- Scan mode reports matches without changing files.
- The limited cleaners preserved good theme code and unrelated settings in our tests.
- Keeping the first and newest copy stopped one returning path from filling the quarantine folder.
- Exact eight-hex checks reduced false matches, but location and other evidence were still important.
- One account-wide scan found persistence that was not visible from a single wp-admin screen.

## Indicators of compromise

### Higher-confidence indicators

- `SC_ADV_BEGIN`, `SC_DB_BEGIN`, or `SC_TH_BEGIN` inside the related WordPress file
- `SC_WC` on a malware-added cache line in `wp-config.php`
- the same confirmed fake-plugin code in plugin and MU-plugin locations

These are selected public examples, not the complete private detector list.

### Contextual indicators

- `auto_prepend_file`, which can be legitimate but is suspicious when it points to an unknown loader
- exact eight-hex PHP or ZIP names in known recovery locations
- the same site-specific ZIP name in more than one upload-month folder
- an unfamiliar cache or database drop-in that did not come from a trusted plugin

Contextual indicators are clues that need more proof. Review the scan result, file contents, location, and nearby evidence before making changes.

## Analyst assessment

The guard is useful when WordPress malware keeps coming back but all sites cannot be suspended at once. It gives a limited and reversible control while the sites are cleaned one by one.

It does not make an infected account safe. A bad file may run before the next five-second scan. All sites under the same hosting user also share a weak security boundary. A `found=0` result covers only the rules and locations known to that script version.

This is not a permanent security plugin or a complete malware scanner. It is a temporary containment tool used between evidence collection and trusted rebuilds.

## What this evidence does not establish

- It does not identify the original vulnerable plugin, credential, or entry path.
- It does not prove that all SC variants use the same aliases, names, or locations.
- It does not prove a site is clean when `found=0` is displayed.
- It does not inspect or remove database payloads, malicious users, login sessions, cron data, memory, OPcache, or browser service workers.
- It does not prevent a payload from executing during the polling interval.
- It does not separate sites owned by the same cPanel user.
- It does not establish that every eight-hex PHP or ZIP filename is malicious outside the observed location and evidence pattern.

## Artifact-specific remediation

1. Save the logs, quarantine files, database export, and hosting evidence outside the infected account.
2. Rebuild WordPress core, plugins, themes, and MU plugins from trusted downloads or reviewed backups.
3. Remove confirmed malicious database options, transients, stored payloads, and cron hooks.
4. Review all users and permissions. Remove unknown access, rotate passwords and WordPress salts, and force every user to log in again.
5. Ask the host to restart the affected PHP workers after the file and database cleanup.
6. Clean the site data and service workers in administrator browsers before they sign in again.
7. Move unrelated sites to separate hosting users or accounts when possible.
8. Stop and remove the guard after the rebuild and monitoring period are complete.

## Recurrence verification

- Keep the guard visible while normal visitors reach the sites during cleanup.
- Investigate every file that returns. Its path and return time may point to a surviving backdoor.
- Run a separate full-account malware search because this guard checks only selected locations.
- Compare WordPress core, plugins, and themes with trusted packages.
- Recheck the database, cron jobs, users, active sessions, PHP settings, and administrator browsers.
- Compare the number of discovered WordPress sites with the document roots shown in cPanel.
- Stop the guard and continue monitoring. If files return only after it stops, a recovery source is still active.

## Frequently asked questions

### Can I keep WordPress online while cleaning malware?

Sometimes, but it carries risk. This guard was built for a case where many live sites could not be stopped together. It can interrupt known file recovery while sites are cleaned one by one, but a malicious file may still run between checks.

### Does `found=0` mean the website is clean?

No. It means the current pass found none of the known file indicators covered by that version. The database, PHP memory, cron jobs, users, browser service workers, or an unknown backdoor may still be infected.

### Why not use only an MU plugin?

MU plugins run inside WordPress. This malware could load through PHP settings or WordPress drop-ins before an MU plugin. A shell guard runs outside WordPress and can check several sites under one cPanel account.

### Can I use this guard on every WordPress malware infection?

No. It was made for the SC403 family and the evidence found in this incident. Running it against unrelated malware without reviewing the rules could miss files or select the wrong ones.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [SC 4.0.3 Self-Healing WordPress Malware That Rebuilds Itself](/malware-research/sc-403-self-healing-wordpress-malware/)
- [system-control Plugin Restored from wp-content/.sc-backup](/malware-research/system-control-hidden-backup-restoration/)
- [StateMesh MU-Plugin Self-Copy and Plugin-List Concealment](/malware-research/statemesh-mu-plugin-self-copy/)

## Related guides and case studies

- [Why WordPress malware keeps returning](/blog/why-wordpress-malware-keeps-coming-back-and-how-to-stop-it-forever/)
- [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/)
- [Regenerating system-control malware case study](/case-studies/regenerating-wordpress-malware-system-control-case-study/)
- [WordPress malware removal service](/wordpress-malware-removal/)

## Methodology and privacy note

This entry is based on static analysis of retained SC family artifacts, read-only shell output, access-log correlation, and controlled filesystem tests. Recovered PHP was treated as text and was not executed. No command-and-control or public RPC endpoint was contacted while developing the guard.

Client domains, usernames, credentials, document-root identifiers, and quarantine identifiers are omitted or generalized. Counts are included only where they explain the engineering constraint. The excerpts are defensive and incomplete; they document validation and containment logic rather than republishing a complete incident payload.
