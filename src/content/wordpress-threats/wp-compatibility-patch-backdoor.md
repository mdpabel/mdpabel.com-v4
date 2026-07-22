---
title: "WP Compatibility Patch Hidden-Admin Plugin Research"
h1: "WP Compatibility Patch Plugin Creating and Hiding an Administrator"
slug: "wp-compatibility-patch-hidden-admin"
description: "Forensic analysis of a fake WP Compatibility Patch plugin using _pre_user_id to create, conceal, and protect an administrator account."
status: "published"
reportDate: "2026-01-14"
lastReviewed: "2026-07-22"
threatCategory: "Fake plugin hidden administrator"
affectedComponents:
  - "WordPress plugin loader"
  - "Administrator accounts"
  - "User-query filters"
observedLocations:
  - "wp-content/plugins/wp-compatibility-patch/"
  - "WordPress option _pre_user_id"
confirmedBehaviors:
  - "Creates or resets a named administrator"
  - "Stores the user ID in _pre_user_id"
  - "Excludes the user from admin queries"
  - "Hides or protects the plugin and account through WordPress hooks"
confidence: "High"
severity: "Critical"
severityRationale: "The supplied code directly shows account creation, password reset, role assignment, stored-ID concealment, and a deceptive plugin identity. Credentials are redacted."
evidenceSource: "Anonymized investigation with a retained WP Compatibility Patch sample and no publishable screenshot"
schemaType: "TechArticle"
screenshots: []
indicators:
  - value: "WP Compatibility Patch"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "wpc_patch_bootstrap"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "adminbackup"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "_pre_user_id"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "Plugin identity plus create-and-hide flow"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "wp_insert_user()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "pre_user_query"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "administrator role"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "Compatibility-themed plugin name"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The hard-coded password and email are not published."
  - "The evidence does not establish how the plugin was installed."
  - "No vulnerable component, affected version, prevalence, or successful attacker login was confirmed."
relatedResearch:
  - "functions-php-hidden-admin-query-backdoor"
  - "wp-user-query-hidden-admin-filter"
  - "system-control-hidden-backup-restoration"
relatedGuides:
  - title: "WP compatibility backdoor guide"
    href: "/blog/wp-compat-plugin-the-hidden-backdoor-in-your-wordpress-site/"
  - title: "How to find hidden WordPress administrators"
    href: "/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "hidden-users"
    - "login-credential-risk"
  searchDescription: "Found a WP Compatibility Patch plugin and a hidden user-count mismatch? Review code that concealed and protected one administrator account."
  summary: "This page is relevant when a compatibility-themed plugin appears alongside unexplained user-count differences or an unfamiliar administrator. The supplied code hid one selected account from queries and interfered with ordinary account-management actions."
  observed:
    - "The retained WP Compatibility Patch code filtered a selected user from administrative views and protected that account from normal management paths."
  possible:
    - "The Users screen may omit an account while its total suggests another user exists."
    - "Attempts to inspect or remove the selected account through routine wp-admin paths may not behave normally."
  questions:
    - "Why is WP Compatibility Patch hiding a WordPress administrator?"
    - "Why does my WordPress user count not match the accounts I can manage?"
  evidenceNote: "The concealment code is confirmed; the evidence does not identify the original access method or a vulnerable component."
canonical: "https://www.mdpabel.com/malware-research/wp-compatibility-patch-hidden-admin/"
index: true
---

## Summary

This WordPress malware research entry documents fake plugin hidden administrator evidence observed during one anonymized client investigation. The narrow topic is **WP Compatibility Patch Plugin Creating and Hiding an Administrator**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The artifact is a fake compatibility plugin implementing persistent hidden administrator access. It overlaps a broad existing article, so this research entry is limited to exact plugin identifiers and code behavior.

## Investigation context

Anonymized investigation with a retained WP Compatibility Patch sample and no publishable screenshot. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

The public entry does not use a screenshot because the retained images either exposed sensitive values, showed a complete encoded payload, or did not add reliable evidence beyond the supplied code.

## Confirmed findings

- The plugin header identifies WP Compatibility Patch.
- The bootstrap function uses wp_insert_user or updates an existing named account.
- The role is administrator and the ID is stored under _pre_user_id.
- pre_user_query excludes that ID from administrator listings.

## Technical analysis

### How the plugin ties account creation to concealment

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
/** Plugin Name: WP Compatibility Patch */
$params = ['user_login' => 'adminbackup', 'role' => 'administrator'];
// credential and email removed
$id = wp_insert_user($params);
update_option('_pre_user_id', $id);
// query exclusion and plugin-hiding details shortened
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The artifact is a fake compatibility plugin implementing persistent hidden administrator access. It overlaps a broad existing article, so this research entry is limited to exact plugin identifiers and code behavior.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `WP Compatibility Patch`
- `wpc_patch_bootstrap`
- `adminbackup`
- `_pre_user_id`
- `Plugin identity plus create-and-hide flow`

### Contextual indicators

- `wp_insert_user()`
- `pre_user_query`
- `administrator role`
- `Compatibility-themed plugin name`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The hard-coded password and email are not published.
- The evidence does not establish how the plugin was installed.
- No vulnerable component, affected version, prevalence, or successful attacker login was confirmed.

## Artifact-specific remediation

- Preserve the plugin directory and account records.
- Remove the fake plugin and inspect users directly in the database or CLI.
- Remove unauthorized accounts and the malicious option after recording their relationship.
- Rotate credentials and invalidate sessions.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm the directory, account, and _pre_user_id do not return.
- Compare direct database and wp-admin user inventories.
- Monitor plugin creation and user-role changes.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Hidden Administrator Query Hooks Found in functions.php](/malware-research/functions-php-hidden-admin-query-backdoor/)
- [wp-user-query.php MU-Plugin Concealing a Stored User ID](/malware-research/wp-user-query-hidden-admin-filter/)
- [system-control Plugin Restored from wp-content/.sc-backup](/malware-research/system-control-hidden-backup-restoration/)

## Related guides and case studies

- [WP compatibility backdoor guide](/blog/wp-compat-plugin-the-hidden-backdoor-in-your-wordpress-site/)
- [How to find hidden WordPress administrators](/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
