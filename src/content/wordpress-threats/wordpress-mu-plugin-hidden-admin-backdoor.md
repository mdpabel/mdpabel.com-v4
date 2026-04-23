---
title: "WordPress MU-Plugin Backdoor Hiding an Admin User"
slug: "wordpress-mu-plugin-hidden-admin-backdoor"
description: "Evidence-based WordPress threat pattern: malicious files in wp-content/mu-plugins, a gated PHP backdoor, and code that hides an admin user from the Users screen."
reportDate: "2026-04-23"
reportType: "Threat Pattern"
threatType: "Backdoor / Persistence / Hidden Admin"
severity: "Critical"
sampleScope: "Screenshots and visible code fragments appear to be representative samples from a larger infected WordPress site, not a complete file set."
fileHash: "N/A"
detectedPaths: []
screenshots: ["/images/wordpress-threats/mu-plugins-malware_evidence-1.png","/images/wordpress-threats/mu-plugins-malware_evidence-2.png","/images/wordpress-threats/mu-plugins-malware_evidence-3.png","/images/wordpress-threats/mu-plugins-malware_evidence-4.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Not found / unique sample"
affectedComponents: ["wp-content/mu-plugins/","wp-content/mu-plugins/loader-optimization.php","wp-content/mu-plugins/wp-user-query.php","Potential related file: wp-content/mu-plugins/session-manager.php","WordPress admin Users screen","WordPress user query hooks and user count views","Potential attacker-controlled WordPress user account"]
entryPoints: ["Password-gated HTTP access to the mu-plugin backdoor via a request containing GET parameter _wph and supporting POST data.","Existing hidden or unauthorized administrator account reused for dashboard access, if present.","Dashboard file editing through WP File Manager, as visible in the screenshots, may provide a re-entry mechanism if attacker access remains."]
persistencePoints: ["wp-content/mu-plugins/ auto-loaded malicious PHP files","Hidden administrator account concealed from wp-admin user listings","Possible additional mu-plugin component session-manager.php referenced by the loader","Potential stored WordPress option _pre_user_id used to identify the hidden user"]
---

## Quick Answer
If you found suspicious files in wp-content/mu-plugins such as loader-optimization.php or wp-user-query.php, and your Users screen has inconsistent counts or seems to be missing an admin account, treat it as a critical backdoor and persistence infection. Remove the malicious MU-plugin set from a clean known-good source, check the database option _pre_user_id, and audit all administrator accounts directly in the database because wp-admin may be lying to you.

## What This Threat Pattern Is
This is a multi-part WordPress backdoor and concealment pattern placed in the must-use plugins directory, wp-content/mu-plugins. MU plugins load automatically and do not require normal plugin activation, which makes them attractive for attackers who want code to keep running even if themes are changed or standard plugins are disabled. In the representative samples, one component acts as a gated remote code execution backdoor, while another interferes with WordPress user queries to hide a chosen account from the administrator interface.

## What Visitors May See
- No obvious frontend defacement at all, because this pattern is mainly built for persistence and hidden access.
- Administrators may notice user count mismatches in wp-admin, such as totals that do not add up correctly across user views.
- An attacker-controlled administrator may exist in the database but not appear in the normal Users screen.
- Suspicious PHP files may appear in wp-content/mu-plugins with bland names such as loader-optimization.php, wp-user-query.php, health-check.php, or a referenced session-manager.php.

## Screenshot-Based Symptoms
The screenshots show a WordPress dashboard with a file manager open inside wp-content/mu-plugins and code loaded from two suspicious files. One screenshot shows wp-user-query.php using WordPress user-query hooks and an option named _pre_user_id to exclude a selected user from admin listings. Another shows loader-optimization.php checking a special request parameter named _wph and containing logic that can write POSTed PHP to a temporary file and execute it, then return JSON output. A separate Users screen screenshot shows mismatched counts like “All (4)” and “2FA Inactive (5),” which is a visible admin-side symptom of user-list tampering. The directory listing also shows multiple MU-plugin files together, which supports a multi-part persistence setup rather than a one-off stray file.

### Screenshot Findings
- **WordPress file manager editing wp-user-query.php in wp-content/mu-plugins. The code header says 'WP User Query Filter v3' and shows hooks pre_get_users, pre_user_query, and views_users using option _pre_user_id to exclude a user from admin listings.** — This screenshot shows a mu-plugin specifically modifying WordPress user queries so one selected account is hidden from the Users screen and related counts.
- **WordPress file manager listing wp-content/mu-plugins with files health-check.php, loader-optimization.php, and wp-user-query.php.** — This screenshot identifies the persistence location and the suspicious filenames present in the must-use plugins directory.
- **WordPress file manager editing loader-optimization.php. The code header says 'MU Plugin Loader Optimizer', checks GET parameter _wph against a secret token, can write POSTed PHP to a temporary file and execute it, returns JSON, and references wp-content/mu-plugins/session-manager.php.** — This screenshot shows a gated remote code execution backdoor embedded as an MU plugin and hints at an additional related component named session-manager.php.
- **WordPress Users screen with red arrows pointing to user counts, including 'All (4)' and '2FA Inactive (5)', indicating inconsistent totals.** — This screenshot shows the visible admin-side symptom of user-query tampering: inconsistent counts that can happen when a malicious plugin filters or hides accounts from the user list.

## Why This Usually Means the Site Is Compromised
This WordPress infection pattern uses the must-use plugins directory to stay loaded on every request, while also hiding at least one user account from normal admin review. In the representative samples here, one MU plugin accepts a special request parameter and can execute attacker-supplied PHP, and another MU plugin alters WordPress user queries so a selected account is removed from the Users screen and related counts.

## Likely Root Cause
The initial entry point is not proven by the screenshots alone. A prior stolen admin credential, vulnerable plugin, reused dashboard access, or some other file-write path could have been used to place the MU-plugin files. The screenshots do show the WP File Manager plugin in the environment, which means dashboard-based file editing was available, but that alone does not prove it was the original intrusion path.

## Why It Keeps Coming Back
This pattern survives because MU plugins autoload on every request and do not depend on standard activation status. It can also preserve attacker access by hiding a privileged account from normal admin review. If only one file is deleted, another related file, hidden user, or database setting may restore access. The observed code also references an additional mu-plugin component, session-manager.php, suggesting the visible samples may be only part of a larger persistence set.

## Files and Directories to Check
- wp-content/mu-plugins/
- wp-content/mu-plugins/loader-optimization.php
- wp-content/mu-plugins/wp-user-query.php
- wp-content/mu-plugins/health-check.php
- wp-content/mu-plugins/session-manager.php
- wp-admin/users.php behavior versus direct database results
- wp_options entry for _pre_user_id
- wp_users and wp_usermeta for unauthorized administrator accounts
- wp-config.php
- active theme functions.php
- other writable locations such as uploads or temporary PHP drop locations

## Removal Targets Inferred From The Samples
- **directory:** `wp-content/mu-plugins/` — The screenshots show multiple suspicious mu-plugin files acting together as an auto-loaded persistence set. In a representative-sample case, remove and rebuild the malicious mu-plugin component rather than deleting only one file.
- **file:** `wp-content/mu-plugins/loader-optimization.php` — Observed password-gated backdoor enabling execution of attacker-supplied PHP.
- **file:** `wp-content/mu-plugins/wp-user-query.php` — Observed code hides a selected user from wp-admin user listings and tampers with counts.
- **file:** `wp-content/mu-plugins/session-manager.php` — Referenced by the backdoor as a related mu-plugin component and should be checked for existence and removed if present.
- **database option:** `_pre_user_id` — Observed in code as the persisted value controlling which user account is hidden.
- **wordpress user:** `Any unauthorized administrator or suspicious privileged account linked to the hidden user ID` — The malware appears designed to conceal at least one account from normal admin review.
- **plugin:** `WP File Manager plugin access path` — Visible file-manager access inside wp-admin should be reviewed, disabled, or removed if not strictly required because it provides easy post-compromise file modification.

## Technical Analysis
The representative code fragments support two distinct malicious behaviors. First, the file shown as wp-user-query.php is labeled like a harmless filter but uses core WordPress hooks including pre_get_users, pre_user_query, and views_users. The visible logic reads a stored option named _pre_user_id and excludes that user from user queries and list views. That means the malware is not just creating an account; it is actively manipulating the admin interface so a chosen account is less likely to be noticed. The Users screen screenshot showing inconsistent counts is consistent with this kind of tampering. Second, the file shown as loader-optimization.php behaves like a gated backdoor. The visible code checks for a special GET parameter named _wph and compares it against a hardcoded token value. When the expected request is supplied, the code can accept POSTed PHP, write it to a temporary file, execute it, and return JSON output. It also attempts to load WordPress through wp-load.php and references the global $wpdb object, which shows the backdoor is designed to operate inside the WordPress runtime rather than as a simple standalone shell. The same file references wp-content/mu-plugins/session-manager.php, which strongly suggests another related persistence component may exist or may have existed elsewhere in the larger infected site. Together, these observed behaviors support a high-confidence finding of MU-plugin-based persistence plus concealed administrator access. The exact original intrusion path remains unproven from screenshots alone, but the persistence and malicious purpose of the shown code are clear from the visible functions and hooks.

## Attack Chain
1. Attacker gains some prior write access to the WordPress site or dashboard.
2. Malicious PHP is placed in wp-content/mu-plugins so it auto-loads on every request.
3. A user-hiding MU plugin stores or reads a target user ID from the _pre_user_id option.
4. WordPress admin user queries are filtered so the chosen account is omitted from user lists and counts.
5. A separate MU plugin waits for a specially crafted request using the _wph parameter.
6. If the gate matches, the backdoor accepts attacker-supplied PHP, executes it, and returns output, enabling continued remote access.
7. Additional related MU-plugin components such as session-manager.php may extend or restore persistence.

## Evidence Notes
- Observed directory listing shows suspicious files under wp-content/mu-plugins: health-check.php, loader-optimization.php, and wp-user-query.php.
- Observed code header in wp-user-query.php reads like a benign utility but uses pre_get_users, pre_user_query, and views_users to manipulate admin-side user visibility.
- Observed code reads the option _pre_user_id, indicating database-persisted selection of the hidden account.
- Observed code in loader-optimization.php checks a request parameter named _wph and only runs protected logic when the token matches.
- Observed backdoor behavior includes writing POSTed PHP to a temporary file for execution and returning JSON output.
- Observed reference to wp-content/mu-plugins/session-manager.php indicates a likely related component beyond the visible samples.
- Observed Users screen shows count mismatch, which is consistent with user-list tampering rather than a normal admin state.
- Because the evidence is based on screenshots and representative samples, the full infection set may be larger than what is shown.

## Representative Malware Samples
### FILE: `wp-content/mu-plugins/wp-user-query.php`
**Why it matters:** This mu-plugin hooks WordPress user query filters and excludes one stored user ID from admin listings and counts, concealing a likely attacker-controlled account.

```php
/* WP User Query Filter v3 */
add_action('pre_get_users', function($query){
  $id = get_option('_pre_user_id');
  if (!$id) return;
  $exclude = $query->get('exclude');
  // add stored user ID to exclusions
  $query->set('exclude', $exclude);
});
add_action('pre_user_query', function($q){
  $id = get_option('_pre_user_id');
  if (!$id) return;
  // append SQL condition so selected user is omitted
});
```

### FILE: `wp-content/mu-plugins/loader-optimization.php`
**Why it matters:** This file behaves like a gated backdoor. It checks for a special request parameter, then can write attacker-supplied PHP to a temporary file, execute it, and return JSON output.

```php
/** MU Plugin Loader Optimizer */
if (!defined('ABSPATH') && !isset($_GET['_wph'])) { return; }
if (isset($_GET['_wph']) && $_GET['_wph'] === '[redacted-token]') {
  header('Content-Type: application/json');
  $m = isset($_GET['m']) ? $_GET['m'] : '';
  if ($m === 'p' && isset($_POST['c'])) {
    // write supplied PHP to temp file and execute it
    echo json_encode(['ok' => true]);
    exit;
  }
  // additional WordPress/database-aware logic follows
}
```

## Indicators of Compromise (Public-Safe)
- `wp-content/mu-plugins/loader-optimization[.]php`
- `wp-content/mu-plugins/wp-user-query[.]php`
- `wp-content/mu-plugins/health-check[.]php`
- `wp-content/mu-plugins/session-manager[.]php`
- `_wph`
- `_pre_user_id`

## Removal Strategy
Do not treat this like a simple plugin cleanup. The evidence supports a persistent WordPress backdoor with hidden-account concealment. The safe approach is to remove the malicious MU-plugin set, validate WordPress users directly in the database, and then review the rest of the site for other loaders or reinfection points.

## Manual Removal Protocol
1. Take a full filesystem and database backup before changes so you can preserve evidence and recover if needed.
2. Put the site in maintenance mode if possible and block further admin access from unknown sessions.
3. Inspect wp-content/mu-plugins/ and compare every file there against a known-good baseline. In a representative-sample case like this, do not assume only one shown file is malicious.
4. Remove malicious files such as representative samples loader-optimization.php and wp-user-query.php, and check whether health-check.php or session-manager.php are legitimate or part of the same set.
5. Rebuild the entire wp-content/mu-plugins directory from a known-good source if the site should not have custom MU plugins, rather than selectively trusting suspicious leftovers.
6. Search the database for the option _pre_user_id and identify which user ID it points to. Remove the option if it is only being used by the malware.
7. Audit users directly in the database, not just in wp-admin. Check wp_users and wp_usermeta for unauthorized administrator-level accounts, including accounts missing from the Users screen.
8. Reset passwords for all administrators, hosting control panel users, SFTP/SSH users, and database users as appropriate.
9. Review active sessions, application passwords, API keys, and any persistent login mechanisms and revoke anything suspicious.
10. Scan other common persistence locations including wp-config.php, active and inactive themes, plugins, uploads, cron tasks, and autoloaded options.
11. Remove or disable dashboard file-editing paths you do not absolutely need, including file-manager style plugins, until the cleanup is complete.
12. Update WordPress core, themes, and plugins only after the malicious persistence is removed, so you do not leave a working backdoor behind on an otherwise updated site.
13. Review logs if available for requests involving the special parameter _wph or suspicious POST activity to MU-plugin files and related paths.

## Hardening Checklist
- Keep wp-content/mu-plugins under change control and investigate any unexpected file there immediately.
- Disable or remove file manager plugins unless there is a strong operational need for them.
- Limit administrator accounts and review them regularly from both wp-admin and direct database queries during incident response.
- Use strong unique passwords and enable MFA where possible for WordPress, hosting, and email accounts.
- Restrict PHP execution in writable directories where possible and monitor for new PHP files.
- Use file integrity monitoring for wp-content/mu-plugins, wp-config.php, themes, and plugins.
- Review autoloaded WordPress options for suspicious names or unexpected serialized payloads.
- Maintain off-site backups and a clean known-good deployment path so compromised files can be replaced quickly.
- Harden dashboard access with least privilege, IP controls where appropriate, and removal of unused plugins and themes.

## FAQ
### What is an MU plugin in WordPress, and why do attackers use it?
MU stands for must-use. Files in wp-content/mu-plugins load automatically on every request and do not need normal activation in the Plugins screen. That makes them useful for attackers who want persistent code that survives routine admin actions.

### Why would a hidden admin user not appear in the Users screen?
Because code can hook WordPress user-query functions and deliberately exclude a chosen user ID from listings and counts. In the representative sample, the option _pre_user_id is used to identify which account should be hidden.

### Are inconsistent user counts a reliable malware sign?
Not by themselves. Some plugins can affect counts. But when inconsistent counts appear alongside MU-plugin files that alter pre_get_users, pre_user_query, and views_users, the combination is strong evidence of malicious tampering.

### If I delete only loader-optimization.php, is that enough?
Usually no. The evidence suggests a multi-part infection. You should review the full mu-plugins directory, related database options like _pre_user_id, and all administrator accounts directly in the database.

### Is wp-user-query.php always malicious?
No filename is inherently malicious. The concern here comes from the observed code behavior: it hides a selected user from admin listings and manipulates counts. That behavior is not normal site maintenance.

### Was WP File Manager definitely the original cause?
Not proven from the screenshots alone. It is visible in the environment and should be reviewed because it provides convenient file access inside wp-admin, but the initial intrusion vector remains unknown based on the provided evidence.

### What should I check in the database?
Check the wp_options table for _pre_user_id, and review wp_users and wp_usermeta for unauthorized administrator accounts or unusual capabilities. Do not rely only on what wp-admin shows you.

### Could there be more malware than the files shown here?
Yes. The samples are representative, not necessarily complete. The reference to session-manager.php and the nature of WordPress reinfection cases both suggest the visible MU-plugin files may be only part of a larger compromise.

> **Proof statement:** Based on representative malware samples and screenshots collected during real WordPress cleanup work by MD Pabel, this pattern is evidenced by malicious code in wp-content/mu-plugins that both enables gated remote PHP execution and hides a selected WordPress user from admin listings. The exact first intrusion path is not proven from the screenshots alone, but the persistence and concealment behavior are strongly supported by the observed code and admin UI symptoms.
>
> **Confidence:** Root cause low, persistence high, screenshot read high, IOCs high.
