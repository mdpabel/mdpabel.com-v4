---
title: "woocommerce_inputs Hidden Plugin: Malware Research"
h1: "woocommerce_inputs Plugin with Redirect and Concealment Hooks"
slug: "woocommerce-inputs-hidden-plugin"
description: "Forensic analysis of the woocommerce_inputs fake plugin artifact, including its redirect hook, visitor-address collection, scheduling, and concealment hooks."
status: "published"
reportDate: "2026-01-17"
lastReviewed: "2026-07-22"
threatCategory: "Fake plugin with conditional redirect logic"
affectedComponents:
  - "WordPress plugin loading"
  - "Frontend template_redirect processing"
  - "WordPress plugin inventory and scheduled events"
observedLocations:
  - "wp-content/plugins/woocommerce_inputs/"
  - "Supplied files named woocommerce_inputs.php and woocommerce-load.php"
confirmedBehaviors:
  - "Registers an early template_redirect callback"
  - "Registers visitor-address collection callbacks on wp_head and admin_init"
  - "Registers scheduling and update-check callbacks"
  - "Registers an all_plugins filter and a filter for its deactivate link"
  - "The supplied companion file contains HTTP retrieval through cURL with a file_get_contents fallback"
confidence: "High"
severity: "Medium"
severityRationale: "The supplied code registers redirect, address-collection, scheduling, and self-concealment hooks, plus a companion network fetcher. The truncated sample and directory-only screenshot do not confirm a destination, successful redirect, or remote response."
evidenceSource: "Anonymized WordPress client investigation with one retained file-manager screenshot and two supplied truncated PHP samples"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/woocommerce_input-hidden-plugin_evidence-1.png"
    alt: "Hosting file manager showing the woocommerce_inputs directory under WordPress plugins"
    caption: "The file manager confirms a woocommerce_inputs folder under wp-content/plugins. The account identifier is permanently redacted; file contents are not visible."
    supports: "The woocommerce_inputs directory existed in the observed WordPress plugin path"
    width: 1919
    height: 792
    privacyReviewed: true
indicators:
  - value: "woocommerce_inputs"
    type: "directory-name"
    confidence: "higher"
  - value: "Woocommerce custom inputs"
    type: "plugin-name"
    confidence: "higher"
  - value: "woocommerce_inputs.php"
    type: "filename"
    confidence: "higher"
  - value: "woocommerce-load.php"
    type: "companion-filename"
    confidence: "higher"
  - value: "WCInputs\\WC_Plugin"
    type: "class-name"
    confidence: "higher"
  - value: "template_redirect, collect_ip_address, all_plugins, and _cron_hook in one plugin constructor"
    type: "hook-combination"
    confidence: "higher"
  - value: "template_redirect"
    type: "wordpress-hook"
    confidence: "contextual"
  - value: "curl_exec() or file_get_contents()"
    type: "php-function"
    confidence: "contextual"
limitations:
  - "The screenshot confirms the directory only; it does not show the supplied files or dashboard concealment."
  - "Both PHP samples end before the complete redirect and concealment methods."
  - "No redirect response, destination, request log, or visitor outcome was retained."
  - "The available evidence does not identify how the plugin was introduced."
relatedResearch:
  - "hello-aili-remote-php-loader"
  - "php-footer-remote-content-loader"
  - "wp-security-helper-plugin-concealment"
relatedGuides:
  - title: "Known fake and malicious WordPress plugins"
    href: "/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/"
  - title: "WordPress redirect malware detection and removal"
    href: "/blog/fix-wordpress-redirects-to-spam-site-on-mobile-only-solved/"
relatedCaseStudies:
  - title: "Access-log investigation of a WordPress mobile redirect"
    href: "/case-studies/how-i-found-and-fixed-a-wordpress-mobile-redirect-hack-using-access-logs/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "redirects-popups"
  searchDescription: "A woocommerce_inputs folder exists but is missing from WordPress Plugins? See concealment filters and conditional redirect code from one investigation."
  summary: "This entry is relevant when an unfamiliar woocommerce_inputs directory appears in hosting files, the plugin is absent from wp-admin, or redirects seem conditional. The code filtered plugin views and contained a redirect branch."
  observed:
    - "The supplied plugin code filtered its plugin-list presence and included conditional redirect logic."
  possible:
    - "The folder can exist on disk while the plugin is hidden from the standard Plugins screen."
    - "Some requests may be redirected while routine administrator browsing appears normal."
  questions:
    - "Why is woocommerce_inputs on my server but missing from the Plugins screen?"
    - "Can a hidden WordPress plugin redirect only selected visitors?"
  evidenceNote: "The concealment and redirect structures are present in code; no complete request log was retained."
canonical: "https://www.mdpabel.com/malware-research/woocommerce-inputs-hidden-plugin/"
index: true
---

## Summary

This research entry documents a plugin directory named `woocommerce_inputs` and supplied PHP samples for **Woocommerce custom inputs**. The main sample registers an early redirect callback, visitor-address collection, recurring-event logic, plugin-list filtering, and removal of its deactivate link. A companion sample implements outbound HTTP retrieval.

Those structures justify focused review of the artifact. The retained screenshot shows only the directory, while both code samples are truncated before the complete behavior. This page therefore documents the hooks and network-fetch structure without claiming that a redirect succeeded or naming an unverified destination.

## Investigation context

The directory was observed among ordinary plugins during one anonymized investigation. Its name differs from the legitimate `woocommerce` directory also visible in the file manager. Similar naming is useful for triage but is not proof by itself.

The broad [fake and malicious plugin guide](/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/) covers general plugin verification. This entry provides the narrower code-level fingerprint for `woocommerce_inputs`.

## Observed artifact

The screenshot confirms the folder `wp-content/plugins/woocommerce_inputs/`. The red block in the breadcrumb is an irreversible redaction already present in the public derivative. Neighboring directories are context only and are not classified by this evidence.

![Hosting file manager showing the woocommerce_inputs directory under WordPress plugins](/wordpress-researches/woocommerce_input-hidden-plugin_evidence-1.png "The file manager confirms a woocommerce_inputs folder under wp-content/plugins. The account identifier is permanently redacted; file contents are not visible.")

## Confirmed findings

- A `woocommerce_inputs` directory existed under `wp-content/plugins`.
- The supplied `woocommerce_inputs.php` sample identifies itself as `Woocommerce custom inputs` and uses the namespace `WCInputs`.
- Its constructor registers `custom_redirect_function` on `template_redirect` with priority `1`.
- It registers `collect_ip_address` on both `wp_head` and `admin_init`.
- It registers custom scheduling, update-check, plugin-list, and action-link callbacks.
- Its `GetIP` method examines forwarded-address headers and `REMOTE_ADDR`, then validates public addresses.
- The supplied `woocommerce-load.php` sample constructs an HTTPS target and retrieves it with cURL or `file_get_contents()`.

## Technical analysis of the woocommerce_inputs plugin

### Redirect and visitor-address hooks

`template_redirect` runs before WordPress renders the selected template. Registering at priority `1` gives the callback an early opportunity to alter response flow. The address collector is also attached to both frontend head rendering and administrator initialization.

The method bodies that decide when or where to redirect are not complete in the retained sample. Their names and registrations are confirmed; search-engine cloaking, successful redirection, address transmission, and destination selection are not.

### Scheduling and concealment hooks

The constructor registers a custom cron schedule, an event hook, an `all_plugins` filter, and a filter for the current plugin's action links. This is a distinctive combination because it joins recurring behavior with two administrator-interface controls.

The public excerpt does not reproduce identifiers, tokens, target construction, or the missing method implementations.

```text
Redacted defensive excerpt

on plugin construction:
    register early template redirect handler
    register visitor-address collection in frontend and administrator contexts
    register recurring schedule and update callbacks
    register plugin-inventory filter
    register filter for this plugin's deactivate link

companion fetcher:
    build an HTTPS target from omitted data
    retrieve a response through one of two PHP HTTP methods
```

## Analyst assessment

The combined callbacks are consistent with a fake plugin designed to make conditional response changes while reducing its visibility in ordinary plugin administration. The companion fetcher could supply data used by another method, but the truncated evidence does not establish that relationship at runtime.

The earlier draft described a complete search-referrer redirect chain. That level of detail is not supported by the retained portion of the samples, so it has been removed. A redirect should be treated as confirmed only when the complete method, logs, or observed response establishes it.

## Indicators of compromise

### Higher-confidence indicators

- Directory `wp-content/plugins/woocommerce_inputs/`
- Plugin identity `Woocommerce custom inputs`
- Files `woocommerce_inputs.php` and `woocommerce-load.php`
- Namespace and class combination `WCInputs\\WC_Plugin`
- The constructor-level combination of `template_redirect`, `collect_ip_address`, `_cron_hook`, `all_plugins`, and current-plugin action-link filtering

### Contextual indicators

- `template_redirect`
- `wp_head`
- `admin_init`
- `REMOTE_ADDR` and forwarded-address headers
- `curl_exec()`
- `file_get_contents()`

These hooks and functions have legitimate uses. The directory, claimed identity, filenames, class, and combined hook pattern are the more useful pivots.

## What this evidence does not establish

- The screenshot does not show the main or companion PHP files.
- The samples do not retain complete redirect, hide-plugin, deactivate-link, scheduling, or update methods.
- No successful redirect, target response, address transmission, or visitor impact was observed in the supplied evidence.
- No persistence after deletion was demonstrated.
- The initial access route and any vulnerable component or version are unknown.
- The evidence does not establish prevalence, campaign attribution, or a relationship to similarly named folders elsewhere.

## Artifact-specific remediation

Preserve the plugin directory, relevant access logs, and scheduled-event data before removal where evidence retention matters. Verify `woocommerce_inputs` against the approved plugin inventory. If it is unauthorized, remove the complete folder and separately search for `woocommerce-load.php`, `WCInputs`, and the distinctive callback combination.

Review WordPress cron events and database options for identifiers tied to the plugin, but do not delete unrelated scheduled events based only on generic hook names. Compare network and access logs for behavior attributed to the artifact. Use the broader [redirect malware guide](/blog/fix-wordpress-redirects-to-spam-site-on-mobile-only-solved/) for complete incident response.

## Recurrence verification

- Confirm that the `woocommerce_inputs` directory does not return after scheduled events and normal traffic.
- Recheck the Plugins screen and direct filesystem inventory.
- Search for the two filenames, namespace, class, and callback combination across the account.
- Review logs for repeat response changes only after establishing a defensible artifact-to-request correlation.

## Related malware research

- [Hello Aili remote PHP loader](/malware-research/hello-aili-remote-php-loader/)
- [PHP footer remote-content loader](/malware-research/php-footer-remote-content-loader/)
- [WP Security Helper plugin concealment](/malware-research/wp-security-helper-plugin-concealment/)

## Methodology and privacy note

This analysis uses one privacy-reviewed screenshot and two truncated PHP samples from an anonymized investigation. The screenshot supports the directory finding only. The code summary omits site identifiers, numeric configuration values, target construction, and incomplete operational methods.
