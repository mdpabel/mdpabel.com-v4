---
title: "Malicious mu-plugins backdoor with hidden admin user"
slug: "malicious-mu-plugins-hidden-admin-user-filter"
description: "Evidence-based WordPress threat pattern: malicious files in wp-content/mu-plugins acting as a backdoor and hiding an administrator account from Users. Learn what to check and how to remove it."
reportDate: "2026-04-23"
reportType: "Threat Pattern"
threatType: "Backdoor with admin-user hiding persistence"
severity: "Critical"
sampleScope: "Screenshots show representative samples from a larger infected WordPress site, specifically malicious files placed in wp-content/mu-plugins and evidence of concealed administrator activity in the Users screen."
fileHash: "N/A"
detectedPaths: []
screenshots: ["/images/wordpress-threats/mu-plugins-malware_evidence-1.png","/images/wordpress-threats/mu-plugins-malware_evidence-2.png","/images/wordpress-threats/mu-plugins-malware_evidence-3.png","/images/wordpress-threats/mu-plugins-malware_evidence-4.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Not found / unique sample"
affectedComponents: ["wp-content/mu-plugins","WordPress user administration (/wp-admin/users.php)","WordPress user query hooks","Potential hidden administrator account","Potential additional mu-plugin file session-manager.php","Possibly WordPress database options storing hidden user identifiers"]
entryPoints: ["Hidden HTTP request parameter _wph handled by loader-optimization.php","POST parameter c processed by loader-optimization.php for code execution","Concealed WordPress administrator account retained through wp-user-query.php"]
persistencePoints: ["wp-content/mu-plugins/loader-optimization.php","wp-content/mu-plugins/wp-user-query.php","wp-content/mu-plugins/health-check.php","Potential wp-content/mu-plugins/session-manager.php referenced by the loader","Database option _pre_user_id used to identify the hidden account","Any hidden attacker-created administrator user in wp_users/wp_usermeta"]
---

## Quick Answer
If you found suspicious files such as loader-optimization.php or wp-user-query.php in wp-content/mu-plugins, along with mismatched user counts in WordPress Users, treat the site as critically compromised. This pattern is consistent with a multi-part WordPress backdoor and hidden-admin persistence infection. Check the entire mu-plugins directory, inspect the _pre_user_id option, identify and remove any unauthorized administrator account, and perform a full file and database review because the shown files are likely only part of a larger infection.

## What This Threat Pattern Is
This is a WordPress must-use plugin malware pattern. One component acts as a request-triggered backdoor inside wp-content/mu-plugins, and another component alters WordPress user queries so a selected user account is hidden from user administration screens. Because must-use plugins are auto-loaded by WordPress, the attacker does not need the normal Plugins screen to keep the malware active. That makes this more persistent than a typical malicious plugin dropped into the standard plugins directory.

## What Visitors May See
- No obvious frontend defacement at all; the infection can remain mostly invisible to visitors while giving the attacker remote code execution.
- Admin-side symptoms such as inconsistent user totals, role counts, or security-plugin user counters that do not match the visible Users list.
- An attacker account that exists in WordPress but does not appear in /wp-admin/users.php for normal administrators.
- Ongoing reinfection or unexplained malicious changes after normal plugin cleanup, because must-use plugins load automatically and survive ordinary deactivation.

## Screenshot-Based Symptoms
The screenshots show two strong visible signs of this infection. First, the wp-content/mu-plugins directory contains suspicious PHP files with benign-sounding names such as health-check.php, loader-optimization.php, and wp-user-query.php. Second, the WordPress Users screen shows inconsistent counts: for example, All (4) and Administrator (3) while a separate user-related counter shows 2FA Inactive (5). That mismatch is consistent with code that hides one selected account from the normal Users list while other parts of WordPress or other plugins still count it. In practical terms, a site owner may notice that an extra administrator seems to exist somewhere, but it does not appear in the visible user table.

### Screenshot Findings
- **File editor open on wp-user-query.php inside wp-content/mu-plugins. Visible code says "WP User Query Filter v3" and comments about hiding hidden admin from /wp-admin/users.php.** — This screenshot directly shows a malicious mu-plugin designed to hide a selected WordPress user from the admin Users list.
- **WP File Manager showing wp-content/mu-plugins with files health-check.php, loader-optimization.php, and wp-user-query.php.** — This screenshot identifies the suspicious must-use plugin directory and the representative malicious file set to inspect or remove.
- **File editor open on loader-optimization.php in wp-content/mu-plugins. Visible code checks GET parameter _wph, uses a hardcoded token, accepts POST c, writes a temporary PHP file, executes it, and outputs JSON.** — This screenshot shows a request-triggered code execution backdoor disguised as a must-use plugin loader or optimizer.
- **WordPress Users screen with inconsistent counts such as All (4), Administrator (3), and 2FA Inactive (5). Red arrows highlight the mismatch.** — The mismatch supports the hidden-user behavior shown in the mu-plugin code and is a practical symptom site owners may notice during cleanup.

## Why This Usually Means the Site Is Compromised
This WordPress infection pattern uses malicious must-use plugins in wp-content/mu-plugins to do two things at once: give the attacker server-side code execution and conceal a WordPress administrator account from normal admin views. The evidence here shows a representative hidden-user filter and a representative mu-plugin backdoor sample from a larger infected site. Even if the original entry point is still unknown, the persistence behavior is clear: these files auto-load on every request, do not rely on normal plugin activation, and are designed to keep attacker access in place while making cleanup harder.

## Likely Root Cause
The original intrusion vector is not proven by the screenshots alone. The compromise may have started through stolen admin or hosting credentials, a vulnerable plugin or theme, a file manager abuse path, or another server-side weakness. What the evidence does prove is that the attacker obtained write access to the site and planted malicious code in the mu-plugins directory, then added concealment logic for a WordPress user account.

## Why It Keeps Coming Back
This infection persists because the malicious files are placed in wp-content/mu-plugins, which WordPress loads automatically on every request. A representative mu-plugin backdoor sample shows hidden request handling through a secret parameter gate and code execution behavior, while a representative infected user-filter sample hides a selected account by hooking core user-query logic. If the hidden account remains in place, if the _pre_user_id option remains set, or if companion files exist elsewhere on disk, the attacker can regain access or replant malware after partial cleanup.

## Files and Directories to Check
- wp-content/mu-plugins/
- wp-content/mu-plugins/loader-optimization.php
- wp-content/mu-plugins/wp-user-query.php
- wp-content/mu-plugins/health-check.php
- wp-content/mu-plugins/session-manager.php
- wp-content/plugins/
- wp-content/themes/
- wp-content/uploads/
- wp-config.php
- database option: _pre_user_id
- wp_users and wp_usermeta entries for unauthorized administrator accounts

## Removal Targets Inferred From The Samples
- **directory:** `wp-content/mu-plugins` — The screenshots show multiple suspicious must-use plugin files in this directory, including a backdoor and a hidden-user filter. In a representative-sample cleanup, remove the malicious mu-plugin component as a whole after verifying no legitimate custom mu-plugins are needed.
- **file:** `wp-content/mu-plugins/loader-optimization.php` — Observed request-triggered backdoor with hidden token and POST-based PHP execution.
- **file:** `wp-content/mu-plugins/wp-user-query.php` — Observed code that hides a selected user account from WordPress admin user listings.
- **file:** `wp-content/mu-plugins/health-check.php` — Located alongside confirmed malicious mu-plugins and likely part of the same persistence set; benign-sounding deceptive filename in malicious directory context.
- **file:** `wp-content/mu-plugins/session-manager.php` — Explicitly referenced by the loader as a companion file and should be checked for existence and removed if present.
- **database_option:** `_pre_user_id` — Used by the hiding logic to identify which account to conceal from user queries.
- **wordpress_user:** `Hidden administrator account referenced by _pre_user_id` — The malware is designed to conceal an attacker-controlled or unauthorized WordPress user account.

## Technical Analysis
The evidence supports a two-part malicious design. In the representative mu-plugin backdoor sample, loader-optimization.php contains hidden request-triggered behavior gated by a GET parameter named _wph and a hardcoded token. The visible code can accept POST parameter c, write supplied PHP to a temporary file, execute it with output buffering, delete the temporary file, and return JSON such as ok => true. That is backdoor behavior, not normal optimization logic. In the representative hidden-user sample, wp-user-query.php includes the marker text "WP User Query Filter v3" and hooks into pre_get_users, pre_user_query, and views_users. The visible code reads the _pre_user_id option and excludes that selected user ID from admin user queries and user list views. The Users-screen mismatch shown in the screenshots supports that concealment logic in practice. The files are stored in wp-content/mu-plugins, which means WordPress auto-loads them without standard plugin activation. A reference inside the backdoor to wp-content/mu-plugins/session-manager.php suggests the shown files may be part of a broader modular infection, not the entire set.

## Attack Chain
1. Attacker gains write access to the WordPress site through an unknown initial vector.
2. Malicious PHP files are planted in wp-content/mu-plugins so they auto-load on every request.
3. A backdoor component waits for a specially crafted request using _wph and a matching hidden token.
4. When triggered, the backdoor accepts POST-supplied code, writes it to a temporary PHP file, executes it, captures output, and removes the temp file.
5. A second mu-plugin reads _pre_user_id from the database and alters WordPress user queries to hide a chosen account from /wp-admin/users.php.
6. The attacker retains WordPress access through the concealed administrator account while also keeping server-side execution ability for follow-up actions or reinfection.

## Evidence Notes
- Screenshot evidence shows wp-content/mu-plugins containing health-check.php, loader-optimization.php, and wp-user-query.php.
- Representative wp-user-query.php code includes the text "WP User Query Filter v3" and hooks pre_get_users, pre_user_query, and views_users.
- Representative wp-user-query.php code reads the WordPress option _pre_user_id and excludes that user from listings.
- Representative loader-optimization.php code includes the text "MU Plugin Loader Optimizer".
- Representative loader-optimization.php code checks GET parameter _wph and compares it to a hardcoded token before continuing.
- Representative loader-optimization.php code accepts POST parameter c, writes temporary PHP, executes it, and returns JSON output.
- The backdoor code references wp-content/mu-plugins/session-manager.php as an additional component to check.
- The WordPress Users screen in the screenshots shows inconsistent counts, supporting hidden-user behavior rather than a harmless customization.
- The screenshots were taken from within WordPress admin, confirming the malicious files were present on disk and visible to an administrator at the time.

## Representative Malware Samples
### FILE: `wp-content/mu-plugins/wp-user-query.php`
**Why it matters:** This mu-plugin alters WordPress user queries to exclude a stored user ID from admin listings and views, which is consistent with hidden-admin persistence.

```php
<?php
/* WP User Query Filter v3 */
if (!defined('ABSPATH')) exit;

add_action('pre_get_users', function($query) {
    $id = get_option('_pre_user_id');
    if (!$id) return;
    // Exclude stored user ID from listings
});

add_action('pre_user_query', function($q) {
    $id = get_option('_pre_user_id');
    if (!$id) return;
    global $wpdb;
    // Append condition to hide selected user ID
});

add_filter('views_users', function($views) {
    // Adjust displayed user views/counts
    return $views;
});
```

### FILE: `wp-content/mu-plugins/loader-optimization.php`
**Why it matters:** This mu-plugin contains a gated backdoor that processes hidden requests, can write POST-supplied PHP to a temporary file, execute it, and return JSON output.

```php
<?php
/** MU Plugin Loader Optimizer */
if (!defined('ABSPATH') && !isset($_GET['_wph'])) { return; }
if (isset($_GET['_wph']) && $_GET['_wph'] === '[redacted-token]') {
    header('Content-Type: application/json');
    $m = isset($_GET['m']) ? $_GET['m'] : '';
    if ($m === 'p' && isset($_POST['c'])) {
        // Write supplied PHP to temp file, execute, capture output, delete temp file
        echo json_encode(['ok' => true]);
        exit;
    }
    // Additional logic references wp-content/mu-plugins/session-manager.php
}
```

## Indicators of Compromise (Public-Safe)
- `wp-content/mu-plugins/loader-optimization[.]php`
- `wp-content/mu-plugins/wp-user-query[.]php`
- `wp-content/mu-plugins/health-check[.]php`
- `wp-content/mu-plugins/session-manager[.]php`
- `_wph`
- `c`
- `_pre_user_id`
- `WP User Query Filter v3`
- `MU Plugin Loader Optimizer`

## Removal Strategy
Remove this as a full compromise, not as a single bad file. The representative samples show both remote code execution behavior and admin-user concealment, so cleanup should cover files, database state, users, and credentials. Preserve forensic copies first if you need them, then remove the active persistence components and verify there is no second-stage malware elsewhere.

## Manual Removal Protocol
1. Put the site into maintenance mode or otherwise limit public access while preserving a backup or forensic copy of the current files and database.
2. Inspect wp-content/mu-plugins and identify every file present. If the directory is not supposed to contain custom business-critical mu-plugins, remove the malicious set. At minimum, the representative infected files to review and remove are loader-optimization.php and wp-user-query.php.
3. Review health-check.php in the same directory and treat it as suspicious unless you can verify it against a known-good source. Also check whether session-manager.php exists, because the backdoor code references it as a companion file.
4. Search the database for the option _pre_user_id and map its stored value to the corresponding WordPress user ID. Determine whether that account is unauthorized or attacker-controlled.
5. Remove any unauthorized administrator account and also remove related sessions, application passwords, API tokens, and stale authentication artifacts tied to that user.
6. Recheck /wp-admin/users.php after cleanup and compare visible users, role counts, and security-plugin counters to confirm the hidden-user behavior is gone.
7. Scan the rest of the site for additional persistence: suspicious PHP in plugins, themes, uploads, temporary directories, wp-config.php, cron-related code, and any custom include paths.
8. Replace compromised core, plugin, and theme files from clean official or known-good sources instead of trusting files left on disk.
9. Rotate all WordPress admin passwords, hosting control panel passwords, SFTP/SSH credentials, database credentials, and any secrets that may have been exposed on the server.
10. Update WordPress core, plugins, themes, and the server stack, then review logs if available to investigate how file write access was obtained in the first place.

## Hardening Checklist
- Disable or remove file manager plugins unless there is a strong operational need for them.
- Restrict write access so the web server user cannot modify sensitive application paths unless absolutely necessary.
- Audit administrator accounts regularly and enable strong MFA for every privileged user.
- Monitor wp-content/mu-plugins specifically; many owners forget this directory exists because it is outside normal plugin management workflows.
- Use file integrity monitoring for mu-plugins, wp-config.php, and writable content directories.
- Review installed plugins and themes for abandoned or high-risk components and remove anything unnecessary.
- Limit PHP execution in locations that should only store uploads or static assets.
- Keep offsite backups and test restoration so you can recover cleanly if reinfection is found later.
- Log administrative changes, new user creation, plugin installation, and file modifications where your hosting environment allows it.

## FAQ
### What is a mu-plugin in WordPress?
A mu-plugin is a must-use plugin stored in wp-content/mu-plugins. WordPress loads these files automatically, and they do not behave like normal plugins in the standard Plugins screen. Attackers abuse this location because many site owners do not monitor it closely.

### Why does this infection hide an administrator account?
The hidden-user component is designed to preserve attacker access while reducing the chance that a legitimate admin will notice and delete the account. In the representative sample, user-query hooks exclude a stored user ID from the normal admin Users list and related views.

### Are mismatched user counts strong evidence of compromise?
They are a strong warning sign when combined with suspicious mu-plugin code. A count mismatch alone can have benign causes, but here the screenshots also show code specifically designed to hide a selected user from user queries, which makes the mismatch meaningful evidence.

### Can I just delete loader-optimization.php and be done?
Not safely. The shown files are representative samples from a larger infected site. You should assume there may be more malware in mu-plugins, normal plugins, themes, uploads, database options, or hidden users. Partial cleanup often leaves persistence behind.

### What should I do with the _pre_user_id option?
Inspect it privately, map it to the corresponding WordPress user, and determine whether that account is authorized. If the account is unauthorized, remove the account and clean up the option and any related persistence. Do not leave the hidden-user mapping in place.

### Could health-check.php be legitimate?
Possibly, but not by context alone. In this representative case it appears in the same malicious mu-plugins set as confirmed harmful files, so it should be treated as suspicious until reviewed against a known-good source or fully inspected.

### Why is the backdoor behavior considered serious even if no defacement is visible?
Because the representative loader can execute attacker-supplied PHP on the server. That capability allows file changes, database access, reinfection, credential theft, and follow-up malware deployment without any obvious public symptom.

> **Proof statement:** Based on representative malware samples and screenshots collected during real WordPress cleanup work by MD Pabel, this pattern is supported by direct evidence of malicious must-use plugin files, hidden request-triggered code execution behavior, and WordPress user-query manipulation used to conceal an administrator account.
>
> **Confidence:** Root cause low, persistence high, screenshot read high, IOCs high.
