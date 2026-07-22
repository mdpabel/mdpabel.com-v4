---
title: "wp-user-query.php Hidden Administrator Filter Research"
h1: "wp-user-query.php MU-Plugin Concealing a Stored User ID"
slug: "wp-user-query-hidden-admin-filter"
description: "Forensic analysis of an MU-plugin using _pre_user_id with pre_get_users, pre_user_query, and views_users to conceal an account."
status: "published"
reportDate: "2026-04-23"
lastReviewed: "2026-07-22"
threatCategory: "MU-plugin hidden-user concealment"
affectedComponents:
  - "WordPress MU plugins"
  - "Administrator user queries"
  - "User count views"
observedLocations:
  - "wp-content/mu-plugins/wp-user-query.php"
  - "wp-content/mu-plugins/loader-optimization.php"
  - "WordPress option _pre_user_id"
confirmedBehaviors:
  - "Excludes a stored user ID through pre_get_users"
  - "Appends a user-ID exclusion through pre_user_query"
  - "Adjusts user-view counts"
  - "Coexists with a separate request-gated MU-plugin loader"
confidence: "High"
severity: "Critical"
severityRationale: "The visible wp-user-query.php code directly conceals a stored ID. A separate screenshot exposes a live gate token and is excluded; only its non-operational structure is summarized."
evidenceSource: "Anonymized investigation with four screenshots and representative wp-user-query.php plus loader-optimization.php excerpts"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/mu-plugins-malware_evidence-1.png"
    alt: "WordPress file editor showing wp-user-query.php excluding _pre_user_id from user queries"
    caption: "The visible MU-plugin reads _pre_user_id and applies user-query exclusions. This is direct evidence of concealment logic."
    supports: "wp-user-query.php concealed the stored user ID"
    width: 1681
    height: 716
    privacyReviewed: true
  - src: "/wordpress-threats/mu-plugins-malware_evidence-2.png"
    alt: "WordPress file manager showing three suspicious files in mu-plugins"
    caption: "The directory lists health-check.php, loader-optimization.php, and wp-user-query.php together under mu-plugins. Co-location does not by itself prove every file's behavior."
    supports: "Multiple suspicious MU-plugin artifacts were present"
    width: 1557
    height: 738
    privacyReviewed: true
  - src: "/wordpress-threats/mu-plugins-malware_evidence-4.png"
    alt: "WordPress Users screen showing inconsistent All and 2FA Inactive counts"
    caption: "The visible counts are inconsistent. This is contextual corroboration only; the code provides the direct evidence of account filtering."
    supports: "The administrator interface displayed a count mismatch consistent with filtering"
    width: 1586
    height: 680
    privacyReviewed: true
indicators:
  - value: "wp-user-query.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "WP User Query Filter v3"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "_pre_user_id"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "pre_get_users plus pre_user_query plus views_users"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "mu-plugins"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "User-count mismatch"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "loader-optimization.php"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "health-check.php"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The retained evidence does not identify how the files were introduced."
  - "No vulnerable component or affected version was confirmed."
  - "The excluded loader screenshot contains a live hard-coded token."
  - "No request log proves the gated loader was used."
relatedResearch:
  - "functions-php-hidden-admin-query-backdoor"
  - "wp-compatibility-patch-hidden-admin"
  - "statemesh-mu-plugin-self-copy"
relatedGuides:
  - title: "How to find hidden WordPress administrators"
    href: "/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/"
  - title: "Hidden WordPress backdoor investigation"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
relatedCaseStudies:
  - title: "MU-plugin hidden-user case study"
    href: "/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "hidden-users"
    - "login-credential-risk"
  searchDescription: "WordPress shows more users than appear in the Users table? Review a must-use plugin that hid one stored account from queries and counts."
  summary: "This entry is relevant when the user total and visible rows do not match, especially when no ordinary plugin explains the change. The supplied must-use plugin altered user queries and count data for one stored user ID."
  observed:
    - "The retained code excluded one stored user ID from administrative queries and adjusted displayed user counts."
  possible:
    - "The Users screen may report more accounts than the administrator can see."
    - "A concealed account may remain available even though it is absent from routine user review."
  questions:
    - "Why does WordPress show a different user count from the visible user list?"
    - "Can a must-use plugin hide an administrator from wp-admin?"
  evidenceNote: "A count mismatch is contextual evidence only; confirm it against database records, capabilities, and the relevant plugin code."
canonical: "https://www.mdpabel.com/malware-research/wp-user-query-hidden-admin-filter/"
index: true
---

## Summary

This WordPress malware research entry documents mu-plugin hidden-user concealment evidence observed during one anonymized client investigation. The narrow topic is **wp-user-query.php MU-Plugin Concealing a Stored User ID**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The code is designed to conceal one stored user ID from administrator review. The count mismatch is consistent with that behavior but would not be sufficient evidence on its own.

## Investigation context

Anonymized investigation with four screenshots and representative wp-user-query.php plus loader-optimization.php excerpts. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

wp-user-query.php concealed the stored user ID.

![WordPress file editor showing wp-user-query.php excluding _pre_user_id from user queries](/wordpress-threats/mu-plugins-malware_evidence-1.png "The visible MU-plugin reads _pre_user_id and applies user-query exclusions. This is direct evidence of concealment logic.")

Multiple suspicious MU-plugin artifacts were present.

![WordPress file manager showing three suspicious files in mu-plugins](/wordpress-threats/mu-plugins-malware_evidence-2.png "The directory lists health-check.php, loader-optimization.php, and wp-user-query.php together under mu-plugins. Co-location does not by itself prove every file's behavior.")

The administrator interface displayed a count mismatch consistent with filtering.

![WordPress Users screen showing inconsistent All and 2FA Inactive counts](/wordpress-threats/mu-plugins-malware_evidence-4.png "The visible counts are inconsistent. This is contextual corroboration only; the code provides the direct evidence of account filtering.")

## Confirmed findings

- wp-user-query.php reads _pre_user_id.
- It hooks pre_get_users, pre_user_query, and views_users.
- The code excludes the stored ID from listings and adjusts counts.
- A separate loader-optimization.php file was present in the same MU-plugin directory.

## Technical analysis

### How _pre_user_id moves through three user-view hooks

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
$id = get_option('_pre_user_id');
add_action('pre_get_users', function ($query) use ($id) {
    $query->set('exclude', /* existing exclusions plus $id */);
});
add_action('pre_user_query', /* SQL exclusion shortened */);
add_filter('views_users', /* count adjustment shortened */);
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The code is designed to conceal one stored user ID from administrator review. The count mismatch is consistent with that behavior but would not be sufficient evidence on its own.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `wp-user-query.php`
- `WP User Query Filter v3`
- `_pre_user_id`
- `pre_get_users plus pre_user_query plus views_users`

### Contextual indicators

- `mu-plugins`
- `User-count mismatch`
- `loader-optimization.php`
- `health-check.php`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The retained evidence does not identify how the files were introduced.
- No vulnerable component or affected version was confirmed.
- The excluded loader screenshot contains a live hard-coded token.
- No request log proves the gated loader was used.

## Artifact-specific remediation

- Preserve the MU-plugin directory and database option.
- Remove the concealment and loader files after confirming they are not authorized.
- Audit wp_users and wp_usermeta directly rather than trusting the filtered interface.
- Remove unauthorized accounts, invalidate sessions, and rotate credentials.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm wp-admin and direct database user inventories agree.
- Monitor mu-plugins and _pre_user_id for recreation.
- Review logs for requests to the removed loader path where available.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [Hidden Administrator Query Hooks Found in functions.php](/malware-research/functions-php-hidden-admin-query-backdoor/)
- [WP Compatibility Patch Plugin Creating and Hiding an Administrator](/malware-research/wp-compatibility-patch-hidden-admin/)
- [StateMesh MU-Plugin Self-Copy and Plugin-List Concealment](/malware-research/statemesh-mu-plugin-self-copy/)

## Related guides and case studies

- [How to find hidden WordPress administrators](/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/)
- [Hidden WordPress backdoor investigation](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)
- [MU-plugin hidden-user case study](/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
