---
title: "WP Security Helper Plugin Concealment: Malware Research"
h1: "WP Security Helper Plugin and User-List Concealment"
slug: "wp-security-helper-plugin-concealment"
description: "Forensic analysis of the WP Security Helper artifact, whose PHP hooks alter WordPress plugin visibility, user queries, and displayed user counts."
status: "published"
reportDate: "2026-03-03"
lastReviewed: "2026-07-22"
threatCategory: "Fake plugin with administrative concealment"
affectedComponents:
  - "WordPress plugin inventory"
  - "WordPress administrator user list and counts"
observedLocations:
  - "wp-content/plugins/wp-security-helper/"
  - "Plugin main file named wp-security-helper.php in the supplied sample"
confirmedBehaviors:
  - "Registers a filter for the WordPress all_plugins inventory"
  - "Registers hooks that alter administrator user queries, results, and counts"
  - "Constrains the Users screen query to the currently authenticated user"
  - "Sets the displayed total user count to one when the expected count key is present"
confidence: "High"
severity: "Medium"
severityRationale: "The supplied PHP shows deliberate manipulation of plugin and user administration views, which can obstruct review. It does not show account creation, credential theft, or the original access method."
evidenceSource: "Anonymized WordPress client investigation with one retained file-manager screenshot and a supplied truncated PHP sample"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/wp-security-helper-fake-hidden-plugin_evidence-1.png"
    alt: "Hosting file manager showing the wp-security-helper directory among WordPress plugin folders"
    caption: "The file manager confirms a wp-security-helper directory under wp-content/plugins. It does not show whether the plugin appeared in the WordPress dashboard."
    supports: "The wp-security-helper plugin directory existed in the observed plugin path"
    width: 1563
    height: 684
    privacyReviewed: true
indicators:
  - value: "WP Security Helper"
    type: "plugin-name"
    confidence: "higher"
  - value: "wp-security-helper.php"
    type: "filename"
    confidence: "higher"
  - value: "WP_Security_Helper"
    type: "class-name"
    confidence: "higher"
  - value: "filter_user_query, modify_user_table_args, adjust_user_count, filter_user_results"
    type: "function-set"
    confidence: "higher"
  - value: "all_plugins"
    type: "wordpress-hook"
    confidence: "contextual"
  - value: "pre_get_users and wp_count_users"
    type: "wordpress-hook-set"
    confidence: "contextual"
limitations:
  - "The screenshot confirms the directory but not dashboard concealment."
  - "The supplied PHP sample is truncated before the complete plugin-concealment method."
  - "The evidence does not show that an administrator account was created or modified."
  - "The initial compromise method and any vulnerable component were not identified."
relatedResearch:
  - "http-header-gated-php-loader"
  - "functions-php-credential-logger-fake-png"
  - "menu-queue-bit-compact-extension-vox"
relatedGuides:
  - title: "Known fake and malicious WordPress plugins"
    href: "/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/"
  - title: "How to find hidden administrator users"
    href: "/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/"
relatedCaseStudies:
  - title: "MU-plugin malware and missing users investigation"
    href: "/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "hidden-users"
  searchDescription: "Is WP Security Helper missing from the Plugins screen or changing user visibility? This entry documents plugin and user-query concealment hooks."
  summary: "This research is relevant when a WP Security Helper directory exists on the server but routine wp-admin views do not account for it, or user listings appear incomplete. The code altered both plugin-list and user-query behavior."
  observed:
    - "The supplied plugin code filtered plugin metadata and changed user-query behavior inside WordPress administration."
  possible:
    - "The plugin may be absent from the normal Plugins screen despite existing on disk."
    - "An administrator may see an incomplete or selectively altered user list."
  questions:
    - "Why is WP Security Helper present in hosting files but missing from WordPress?"
    - "Can one plugin hide both itself and selected users from wp-admin?"
  evidenceNote: "Unexpected list behavior warrants investigation, but comparison with filesystem and database evidence is still required."
canonical: "https://www.mdpabel.com/malware-research/wp-security-helper-plugin-concealment/"
index: true
---

## Summary

This entry documents a plugin artifact identified as **WP Security Helper** during one anonymized WordPress investigation. A file-manager screenshot confirms the `wp-security-helper` directory. The supplied PHP registers WordPress hooks that alter the plugin inventory and the administrator user list, including its query, returned results, and displayed count.

The useful research topic is the artifact's concealment structure, not a general claim that every similarly named security plugin is malicious. The screenshot alone does not prove hiding behavior; that conclusion comes from the supplied code.

## Investigation context

The directory appeared among normal plugin folders in `wp-content/plugins`. The supplied main file used a WordPress-style plugin header and the class name `WP_Security_Helper`, then registered several obfuscated hook and method names.

This page narrows its scope to those administrative-view changes. Broader advice about evaluating suspicious plugins belongs in the [known fake and malicious WordPress plugins guide](/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/).

## Observed artifact

The retained file-manager view shows a directory named `wp-security-helper`. Other installed plugin names are visible only as path context and are not implicated by this finding.

![Hosting file manager showing the wp-security-helper directory among WordPress plugin folders](/wordpress-threats/wp-security-helper-fake-hidden-plugin_evidence-1.png "The file manager confirms a wp-security-helper directory under wp-content/plugins. It does not show whether the plugin appeared in the WordPress dashboard.")

## Confirmed findings

- The supplied plugin code declares the class `WP_Security_Helper`.
- Its constructor registers `pre_get_users`, `users_list_table_query_args`, `wp_count_users`, `get_users`, and `all_plugins` callbacks.
- On the administrator Users screen, the visible query logic restricts results to the current user's ID.
- The `adjust_user_count` method replaces `total_users` with `1` when that count exists.
- The supplied concealment excerpt removes the current plugin basename from the plugin array under a request condition.

## Technical analysis of the WP Security Helper hooks

### User-list manipulation

Several different hooks target the same administrator surface. Query arguments are restricted, returned user objects are filtered, and the count is changed separately. Using all three layers can make the Users screen present a narrower view than the underlying database actually contains.

The code does not create a user in the retained sample. It changes visibility. That distinction matters: a discrepancy should prompt database and capability review, but it is not proof that this artifact created any account.

### Plugin-list concealment

The `all_plugins` callback receives WordPress's plugin inventory and removes the current file's basename when its gate is satisfied. The exact request key is represented by malformed or escaped characters in the supplied draft, so this public analysis does not reconstruct or normalize it.

```text
Redacted defensive excerpt

register callbacks for:
    administrator user query
    user-table query arguments
    displayed user count
    returned user results
    plugin inventory

on the Users screen:
    restrict visible results to the current user
    replace the displayed total with one

under a request condition:
    remove this plugin basename from the plugin inventory
```

This is an inert control-flow summary. It omits the operational request condition and the truncated portion of the original sample.

## Analyst assessment

The combined hook set is consistent with deliberate administrative concealment. A legitimate plugin may filter users or the plugin list for a documented product reason, but the simultaneous use of obfuscated strings, self-removal, user-query restriction, result filtering, and count manipulation is not explained by the visible plugin metadata.

The available evidence supports describing the artifact as a fake or unauthorized plugin found during the investigation. It does not establish who installed it, how long it was present, or whether another component used the hidden view to protect a separate account.

## Indicators of compromise

### Higher-confidence indicators

- Plugin identity `WP Security Helper`
- Directory `wp-content/plugins/wp-security-helper/`
- Main filename `wp-security-helper.php`
- Class name `WP_Security_Helper`
- The combined method set `filter_user_query`, `modify_user_table_args`, `adjust_user_count`, and `filter_user_results`
- An `all_plugins` callback that removes its own plugin basename

### Contextual indicators

- `pre_get_users`
- `wp_count_users`
- `get_users`
- `all_plugins`
- A mismatch between visible users and a direct database or trusted command-line query

These hooks are legitimate WordPress extension points and are not proof of malware by themselves. The distinctive identity and combined behavior provide the stronger signal.

## What this evidence does not establish

- The screenshot does not show the WordPress Plugins screen or prove that the directory was hidden there.
- The sample does not show administrator creation, password changes, or credential collection.
- The truncated code prevents a complete review of every branch.
- No vulnerable plugin, affected version, or initial compromise route was confirmed.
- No campaign attribution, prevalence, or client outcome is supported by the retained evidence.

## Artifact-specific remediation

Preserve the directory and relevant logs before modification when investigation history is required. Verify the plugin against the site's approved deployment inventory. If it is unauthorized, remove the complete directory rather than only changing the visible hook registrations.

Review users through a path that does not rely solely on the potentially filtered dashboard: compare the database, a trusted command-line query, and administrator capabilities. Search for the class and method set across plugins, themes, and must-use plugins. Then use the broader [hidden-administrator investigation guide](/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/) for account review without assuming this sample created an account.

## Recurrence verification

- Confirm that `wp-content/plugins/wp-security-helper/` does not return after normal traffic and scheduled tasks.
- Recheck the Plugins and Users screens after the artifact is removed.
- Compare dashboard user counts with a trusted database or command-line count.
- Monitor file changes and plugin activation records for the same directory, class, and method names.

## Related malware research

- [HTTP-header-gated PHP loader](/malware-research/http-header-gated-php-loader/)
- [Functions.php credential logger using a fake PNG file](/malware-research/functions-php-credential-logger-fake-png/)
- [Compact Extension Vox MU-plugin artifact](/malware-research/menu-queue-bit-compact-extension-vox/)

## Methodology and privacy note

This analysis uses one privacy-reviewed screenshot and a truncated PHP sample from an anonymized investigation. The screenshot supports the path finding only. Code-supported behavior is separated from analyst assessment, and the public excerpt omits the request gate and incomplete malicious implementation.
