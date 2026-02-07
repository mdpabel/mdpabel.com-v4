---
title: "Hidden Casino Content Injection"
slug: "hidden-casino-content-injection"
description: "Analysis of a mysterious plugin hiding content, possibly injecting casino-related posts."
reportDate: "2026-02-07"
threatType: "Content Injection"
severity: "Medium"
fileHash: "64024f86bfc710d2c9b555ca00a8b058993087e3abf0643f4d4f7132d9d40d42"
detectedPaths: ["hide-hidden-posts.php"]
screenshots: ["/images/wordpress-threats/hidden-posts_evidence-1.png","/images/wordpress-threats/hidden-posts_evidence-2.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "This plugin's behavior indicates a possible injection of unwanted content, potentially harming SEO and user trust."
seenOn: "WordPress sites with hidden post configurations."
behavior: "Alters WordPress queries to hide certain posts and potentially allow unwanted content injections."
difficulty: "Medium"
recurrence: "Detected where unauthorized plugins are uploaded."
numberOfSiteFixed: "Limited to users correcting plugin configuration."
---

## Technical Analysis
I found a file named `hide-hidden-posts.php` in the `mu-plugins` directory, which alters WordPress queries. It hides IDs configured in the `apft_hidden_post_ids` option.

### Code Analysis
- **Function:** `apft_get_hidden_ids` retrieves post IDs from options, ensuring they are integers and valid.
- **Hook:** `pre_get_posts` adds hidden IDs to the query's `post__not_in` parameter, excluding these posts from being displayed to non-admin users.
- **Filter:** `wp_count_posts` also subtracts hidden IDs from the published count.

### Possible Malicious Behavior
Considering the screenshot [below], the website is displaying content related to casinos and gambling, which might not be intended given that it's injected via hidden posts. The plugin may hide certain posts and replace them with other content using a similar technique.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain


## Code Signature(s)

### FILE: `hide-hidden-posts.php`
```php
<?php
    if (!defined('ABSPATH')) exit;

    function apft_get_hidden_ids() {
        $ids = get_option('apft_hidden_post_ids', array());
        if (!is_array($ids)) $ids = array();
        return array_filter(array_map('intval', $ids));
    }


    add_action('pre_get_posts', function($q){
        if (!is_admin() || !$q->is_main_query() || $q->get('post_type') !== 'post') return;
        $ids = apft_get_hidden_ids();
        if ($ids) {
            $not_in = $q->get('post__not_in') ?: array();
            $q->set('post__not_in', array_unique(array_merge($not_in, $ids)));
        }
    }, 5);


    add_filter('wp_count_posts', function($counts, $type){
        if ($type !== 'post') return $counts;
        $ids = apft_get_hidden_ids();
        if (!$ids) return $counts;
        $hidden = get_posts(array(
                'post_type'=>'post','post_status'=>'publish','post__in'=>$ids,
                'fields'=>'ids','nopaging'=>true,'suppress_filters'=>true
        ));
        $n = is_array($hidden) ? count($hidden) : 0;
        if (isset($counts->publish)) $counts->publish = max(0, (int)$counts->publish - $n);
        return $counts;
    }, 10, 2);
```


## Indicators of Compromise (IOCs)
- `hxxp://example-casino[.]com`

## Removal Protocol
1. Review and verify the purpose of `hide-hidden-posts.php`.
1. Check `apft_hidden_post_ids` for unwanted entries.
1. Backup and delete suspicious entries.
1. Ensure no unauthorized users can alter files.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
