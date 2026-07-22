---
title: "Hello Aili Remote PHP Loader: WordPress Malware Research"
h1: "Hello Aili Plugin Fetching and Evaluating Remote PHP"
slug: "hello-aili-remote-php-loader"
description: "Forensic analysis of the Hello Aili plugin artifact, whose open_hello function decodes remote hosts, fetches responses, and evaluates successful bodies."
status: "published"
reportDate: "2026-01-27"
lastReviewed: "2026-07-22"
threatCategory: "Fake plugin remote PHP loader"
affectedComponents:
  - "WordPress plugin loading"
  - "WordPress HTTP API"
  - "PHP runtime evaluation"
observedLocations:
  - "wp-content/plugins/hellos/hellos.php"
confirmedBehaviors:
  - "Uses the plugin name Hello Aili while copying Hello Dolly metadata"
  - "Registers open_hello on admin_init and calls it directly outside administrator requests"
  - "Hex-decodes a list of remote hostnames"
  - "Sends a WordPress HTTP GET request to each decoded hostname"
  - "Evaluates the response body after a successful HTTP response"
confidence: "High"
severity: "High"
severityRationale: "The supplied code evaluates PHP received from remote hosts in both administrator and frontend request contexts. The evidence does not show which response, if any, was received during the investigation or what a remote body contained."
evidenceSource: "Anonymized WordPress client investigation with two retained screenshots and a complete supplied loader sample"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/fake-hellos-seo-spam-injector_evidence-1.png"
    alt: "Hosting file manager showing hellos.php inside the WordPress plugins hellos directory"
    caption: "The file manager confirms wp-content/plugins/hellos/hellos.php and displays a size of 1.18 KiB. No client identifier is visible in the crop."
    supports: "The hellos directory and hellos.php file were observed under WordPress plugins"
    width: 1328
    height: 730
    privacyReviewed: true
  - src: "/wordpress-researches/fake-hellos-seo-spam-injector_evidence-2.png"
    alt: "Code view showing the Hello Aili plugin header and beginning of the open_hello function"
    caption: "The code view shows Hello Aili reusing Hello Dolly metadata, registering open_hello, and beginning an HTTP-request argument array."
    supports: "The observed file used a deceptive plugin header and registered the open_hello loader"
    width: 1405
    height: 796
    privacyReviewed: true
indicators:
  - value: "Hello Aili"
    type: "plugin-name"
    confidence: "higher"
  - value: "Hello_Joy"
    type: "package-name"
    confidence: "higher"
  - value: "wp-content/plugins/hellos/hellos.php"
    type: "file-path"
    confidence: "higher"
  - value: "open_hello"
    type: "function-name"
    confidence: "higher"
  - value: "v1.salesbuy[.]ru, v1.dicsale[.]ru, v1.aabcd[.]ru, akbvvidsse[.]shop"
    type: "defanged-host-set"
    confidence: "higher"
  - value: "wp_remote_get()"
    type: "wordpress-function"
    confidence: "contextual"
  - value: "eval()"
    type: "php-function"
    confidence: "contextual"
limitations:
  - "No retained network response shows that a listed host returned a payload during the investigation."
  - "The content and effect of any remote response were not captured."
  - "The evidence does not show spam pages, redirects, or another visible payload outcome."
  - "The initial compromise method and installation path were not confirmed."
relatedResearch:
  - "woocommerce-inputs-hidden-plugin"
  - "php-footer-remote-content-loader"
  - "menu-queue-bit-compact-extension-vox"
relatedGuides:
  - title: "Known fake and malicious WordPress plugins"
    href: "/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/"
  - title: "How to recognize obfuscated PHP malware"
    href: "/blog/wordpress-obfuscated-php-malware-detection/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "spam-unwanted-content"
    - "suspicious-files-code"
  searchDescription: "Found a Hello Aili plugin or unfamiliar code beside Hello Dolly? This entry examines a remote PHP loader observed in a WordPress plugin file."
  summary: "This entry is relevant when an owner finds a Hello Aili plugin they did not install, or a familiar-looking plugin file contains remote loading code. The retained artifact fetched and evaluated a response, but that response was not preserved."
  observed:
    - "The supplied plugin file identified itself as Hello Aili and contained a remote-response evaluation path."
  possible:
    - "An unfamiliar plugin may appear among otherwise legitimate WordPress plugins."
    - "The website may show no stable symptom because the missing remote response determined the next behavior."
  questions:
    - "What is the Hello Aili plugin in my WordPress installation?"
    - "Why does a plugin file fetch and evaluate remote PHP?"
  evidenceNote: "The loader is confirmed; the evidence does not establish the content or effect of the remote response."
canonical: "https://www.mdpabel.com/malware-research/hello-aili-remote-php-loader/"
index: true
---

## Summary

This entry analyzes `hellos.php`, a small plugin file observed under `wp-content/plugins/hellos/`. The file calls itself **Hello Aili** while copying identifying text from WordPress's Hello Dolly plugin. Its `open_hello()` function decodes four hostnames, requests each host through the WordPress HTTP API, and evaluates the first body returned with a successful status.

That code supports classifying Hello Aili as a remote PHP loader. The retained evidence does not show that a host responded during the investigation, what any response contained, or whether the loader produced spam, redirects, or another outcome.

## Investigation context

The artifact was retained during one anonymized client investigation. Its directory and filename resemble a lightweight novelty plugin, while the visible metadata reuses the Hello Dolly description, author, version, repository URL, and author URL.

The mismatch is an artifact-level identification clue. This page does not suggest that the legitimate Hello Dolly plugin or its author supplied the code.

## Observed artifact

The file manager shows one 1.18 KiB PHP file named `hellos.php` inside the `hellos` plugin directory.

![Hosting file manager showing hellos.php inside the WordPress plugins hellos directory](/wordpress-researches/fake-hellos-seo-spam-injector_evidence-1.png "The file manager confirms wp-content/plugins/hellos/hellos.php and displays a size of 1.18 KiB. No client identifier is visible in the crop.")

The code screenshot shows the deceptive identity and the beginning of the loader. It captures the `admin_init` registration, the direct frontend call, and the start of `open_hello()`.

![Code view showing the Hello Aili plugin header and beginning of the open_hello function](/wordpress-researches/fake-hellos-seo-spam-injector_evidence-2.png "The code view shows Hello Aili reusing Hello Dolly metadata, registering open_hello, and beginning an HTTP-request argument array.")

## Confirmed findings

- The observed path is `wp-content/plugins/hellos/hellos.php`.
- The header uses `Plugin Name: Hello Aili` and `@package Hello_Joy` while copying Hello Dolly metadata.
- `open_hello` is registered on `admin_init`.
- The file also calls `open_hello()` when `is_admin()` is false.
- Four hexadecimal strings are converted to hostnames with `hex2bin()`.
- The function issues `wp_remote_get()` requests with server data serialized into a request header.
- When a response is not an error and has status `200`, its body is passed to `eval()`.

## How the Hello Aili loader selects remote code

The loop tries the encoded destinations in sequence. It returns after evaluating the first successful response body, so later destinations are not reached in that request once one succeeds. The code contains no embedded spam page or redirect template; its eventual behavior depends on a remote response not present in the repository evidence.

```text
Redacted defensive excerpt

register loader on administrator initialization
also call loader during non-administrator requests

for each encoded hostname:
    decode hostname
    request remote content with server context in a header
    if the response succeeds:
        evaluate response body  # operational body omitted
        stop trying destinations
```

The public excerpt omits encoded strings, live protocols, request details, and executable PHP.

## Analyst assessment

The copied Hello Dolly metadata is consistent with an attempt to look familiar during a quick plugin review. The `Hello Aili` name, `Hello_Joy` package value, and `hellos` path distinguish this artifact from the legitimate plugin.

Evaluating a network response gives the remote body the ability to determine runtime behavior within the PHP process. That capability is directly visible in code. A particular payload, successful network exchange, or resulting site symptom is not visible and is not claimed.

## Indicators of compromise

### Higher-confidence indicators

- `wp-content/plugins/hellos/hellos.php`
- Plugin name `Hello Aili`
- Package value `Hello_Joy`
- Function name `open_hello`
- The sequence `hex2bin()` → `wp_remote_get()` → status check → response-body evaluation
- Defanged host set: `v1.salesbuy[.]ru`, `v1.dicsale[.]ru`, `v1.aabcd[.]ru`, and `akbvvidsse[.]shop`

### Contextual indicators

- `admin_init`
- `is_admin()`
- `wp_remote_get()`
- `hex2bin()`
- `eval()`
- A plugin copying metadata from a familiar WordPress plugin

Each contextual item can appear in other code. The complete identity, path, host set, and control-flow sequence are more specific.

## What this evidence does not establish

- No network log or captured response proves that a listed host answered.
- No remote response body was retained, so its content and effect are unknown.
- The screenshots do not demonstrate execution.
- The evidence does not show SEO spam, generated pages, redirects, or server-load impact.
- No vulnerable plugin, affected version, installation route, or initial compromise method was identified.
- The evidence does not support campaign size, attribution, or duration claims.

## Artifact-specific remediation

Preserve `hellos.php`, HTTP logs, and outbound connection records before removal when investigation history matters. If the directory is not part of the approved deployment, remove the complete `hellos` plugin and search for `Hello Aili`, `Hello_Joy`, `open_hello`, and the defanged hostnames in files and database content.

Review logs for attempted connections to the four hosts and inspect other PHP files for the same decode-fetch-evaluate sequence. Rotate credentials appropriate to the confirmed compromise scope, then follow the broader [fake-plugin investigation guide](/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/) for site-wide review.

## Recurrence verification

- Confirm that the `hellos` directory and `hellos.php` do not return.
- Repeat searches for the plugin identity, function, encoded hosts, and decoded hostnames.
- Monitor outbound requests for the defanged host set.
- Investigate recreation separately rather than assuming the loader itself contains persistence logic.

## Related malware research

- [woocommerce_inputs hidden plugin](/malware-research/woocommerce-inputs-hidden-plugin/)
- [PHP footer remote-content loader](/malware-research/php-footer-remote-content-loader/)
- [Compact Extension Vox MU-plugin artifact](/malware-research/menu-queue-bit-compact-extension-vox/)

## Methodology and privacy note

This analysis uses two privacy-reviewed screenshots and the supplied `hellos.php` sample from one anonymized investigation. The original loader is not reproduced publicly. Hostnames are defanged, and the code section is an inert control-flow summary that cannot fetch or execute a payload.
