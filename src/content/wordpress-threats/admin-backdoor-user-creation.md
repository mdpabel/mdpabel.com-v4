---
title: "functions.php Hidden-Admin Query Backdoor Research"
h1: "Hidden Administrator Query Hooks Found in functions.php"
slug: "functions-php-hidden-admin-query-backdoor"
description: "Forensic analysis of functions.php hooks that stored an administrator ID, excluded that user from queries, and changed user counts."
status: "published"
reportDate: "2026-02-01"
lastReviewed: "2026-07-22"
threatCategory: "Hidden administrator backdoor"
affectedComponents:
  - "Active theme functions.php"
  - "WordPress user queries"
  - "WordPress user-count views"
observedLocations:
  - "Theme functions.php"
  - "WordPress option _pre_user_id"
confirmedBehaviors:
  - "Reads a stored user ID from _pre_user_id"
  - "Excludes that ID from administrator user queries"
  - "Reduces displayed user counts"
  - "Blocks profile access and deletion for the stored ID"
confidence: "High"
severity: "Critical"
severityRationale: "The supplied code contains administrator creation logic and multiple hooks that conceal and protect the stored account. Publication omits the hard-coded password."
evidenceSource: "Anonymized investigation with retained PHP code and four screenshots; one privacy-safe code screenshot is published"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/hidden-wordpress-admin-users-functions.php-malware_evidence-1.png"
    alt: "PHP editor showing functions.php hooks that alter WordPress user queries and user counts"
    caption: "The visible functions.php block registers pre_user_query and views_users handlers and reads the _pre_user_id option. It confirms concealment logic, not how the code was introduced."
    supports: "functions.php contained user-query and count-manipulation hooks"
    width: 1360
    height: 782
    privacyReviewed: true
indicators:
  - value: "wp_admin_users_protect_user_query"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "protect_user_count"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "_pre_user_id"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "protect_user_from_deleting"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "functions.php"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "pre_user_query"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "wp_insert_user()"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "administrator role"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The initial compromise method was not confirmed."
  - "No vulnerable plugin, theme, or affected version was identified."
  - "The evidence does not establish whether the account was used for a successful login."
  - "The hard-coded credential is not published."
relatedResearch:
  - "wp-user-query-hidden-admin-filter"
  - "wp-compatibility-patch-hidden-admin"
  - "system-control-hidden-backup-restoration"
relatedGuides:
  - title: "How to find hidden WordPress administrators"
    href: "/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/"
  - title: "Hidden WordPress backdoor investigation"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "hidden-users"
    - "login-credential-risk"
  searchDescription: "WordPress user count does not match the visible accounts? Review code evidence showing a functions.php backdoor that creates and hides one administrator."
  summary: "This entry is relevant when the WordPress Users screen shows fewer accounts than its count, or an unfamiliar administrator cannot be accounted for. The retained code targeted one stored user ID and altered normal user-list behavior."
  observed:
    - "The supplied functions.php code created or updated an administrator account, stored its user ID, and filtered that account from normal user queries."
  possible:
    - "The Users screen can show a count that does not match the accounts visible in the list."
    - "An unauthorized administrator can remain usable while being concealed from routine review."
  questions:
    - "Why does my WordPress user count not match the visible users?"
    - "Can theme code hide an administrator account from the Users screen?"
  evidenceNote: "A count mismatch is a reason to investigate; it is not proof of a hidden administrator by itself."
canonical: "https://www.mdpabel.com/malware-research/functions-php-hidden-admin-query-backdoor/"
index: true
---

## Summary

This WordPress malware research entry documents hidden administrator backdoor evidence observed during one anonymized client investigation. The narrow topic is **Hidden Administrator Query Hooks Found in functions.php**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The combined account-creation, query-exclusion, count-adjustment, and deletion-blocking logic is consistent with a hidden administrator backdoor. A mismatched count alone would not prove this finding; the code provides the stronger evidence.

## Investigation context

Anonymized investigation with retained PHP code and four screenshots; one privacy-safe code screenshot is published. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

functions.php contained user-query and count-manipulation hooks.

![PHP editor showing functions.php hooks that alter WordPress user queries and user counts](/wordpress-threats/hidden-wordpress-admin-users-functions.php-malware_evidence-1.png "The visible functions.php block registers pre_user_query and views_users handlers and reads the _pre_user_id option. It confirms concealment logic, not how the code was introduced.")

## Confirmed findings

- The code registers pre_user_query, views_users, load-user-edit.php, and admin_menu handlers.
- The identifier _pre_user_id is used to retrieve the account ID being concealed.
- The supplied continuation contains wp_insert_user with an administrator role.
- The retained database screenshot showed the named account, but it is excluded because adjacent account data is sensitive.

## Technical analysis

### How the hooks conceal the stored administrator ID

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
add_action('pre_user_query', 'wp_admin_users_protect_user_query');
add_filter('views_users', 'protect_user_count');
$id = get_option('_pre_user_id');
// SQL exclusion, credential, and account-creation details redacted
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The combined account-creation, query-exclusion, count-adjustment, and deletion-blocking logic is consistent with a hidden administrator backdoor. A mismatched count alone would not prove this finding; the code provides the stronger evidence.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `wp_admin_users_protect_user_query`
- `protect_user_count`
- `_pre_user_id`
- `protect_user_from_deleting`

### Contextual indicators

- `functions.php`
- `pre_user_query`
- `wp_insert_user()`
- `administrator role`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The initial compromise method was not confirmed.
- No vulnerable plugin, theme, or affected version was identified.
- The evidence does not establish whether the account was used for a successful login.
- The hard-coded credential is not published.

## Artifact-specific remediation

- Preserve the infected theme file and user records before changing them.
- Replace the affected theme with a trusted clean copy and remove the unauthorized account through a trustworthy database or CLI path.
- Remove the malicious option only after recording which account ID it referenced.
- Rotate administrator and hosting credentials and invalidate active sessions.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Compare the restored theme directory with a trusted distribution.
- Confirm direct database results and wp-admin user counts agree.
- Monitor functions.php and _pre_user_id for recreation.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [wp-user-query.php MU-Plugin Concealing a Stored User ID](/malware-research/wp-user-query-hidden-admin-filter/)
- [WP Compatibility Patch Plugin Creating and Hiding an Administrator](/malware-research/wp-compatibility-patch-hidden-admin/)
- [system-control Plugin Restored from wp-content/.sc-backup](/malware-research/system-control-hidden-backup-restoration/)

## Related guides and case studies

- [How to find hidden WordPress administrators](/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/)
- [Hidden WordPress backdoor investigation](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
