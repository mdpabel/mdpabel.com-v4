---
title: "hide-hidden-posts.php MU-Plugin Concealment Research"
h1: "hide-hidden-posts.php MU-Plugin and Concealed Post IDs"
slug: "hide-hidden-posts-mu-plugin"
description: "Forensic review of an MU-plugin that read apft_hidden_post_ids and removed selected posts from queries and published counts."
status: "published"
reportDate: "2026-02-07"
lastReviewed: "2026-07-22"
threatCategory: "Post-concealment MU plugin"
affectedComponents:
  - "WordPress MU plugins"
  - "Post queries"
  - "Published post counts"
observedLocations:
  - "wp-content/mu-plugins/hide-hidden-posts.php"
  - "WordPress option apft_hidden_post_ids"
confirmedBehaviors:
  - "Reads post IDs from apft_hidden_post_ids"
  - "Adds selected IDs to post__not_in"
  - "Subtracts selected published posts from counts"
confidence: "High"
severity: "Medium"
severityRationale: "The code directly supports post concealment. Casino content was visible during the same investigation, but the evidence does not prove this file created that content."
evidenceSource: "Anonymized investigation with an MU-plugin directory screenshot, a visible casino post screenshot, and retained hide-hidden-posts.php code"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/hidden-posts_evidence-2.png"
    alt: "WordPress file manager showing hide-hidden-posts.php inside the mu-plugins directory"
    caption: "The file manager confirms hide-hidden-posts.php beside db.php and mu-helper.php in mu-plugins. It does not identify which component created any spam post."
    supports: "hide-hidden-posts.php existed in the MU-plugin directory"
    width: 1366
    height: 687
    privacyReviewed: true
  - src: "/wordpress-threats/hidden-posts_evidence-1.png"
    alt: "Rendered WordPress post displaying Italian casino-related text"
    caption: "A casino-related post was visible during the same anonymized investigation. The screenshot confirms the content symptom, not that hide-hidden-posts.php created it."
    supports: "Casino-related content was visible during the investigation"
    width: 654
    height: 554
    privacyReviewed: true
indicators:
  - value: "hide-hidden-posts.php"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "apft_hidden_post_ids"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "apft_get_hidden_ids"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "post__not_in plus wp_count_posts adjustment"
    type: "distinctive artifact"
    confidence: "higher"
  - value: "mu-plugins"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "pre_get_posts"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "wp_count_posts"
    type: "contextual indicator"
    confidence: "contextual"
  - value: "casino-related post"
    type: "contextual indicator"
    confidence: "contextual"
limitations:
  - "The evidence does not show which code created the casino post."
  - "The relationship between db.php, mu-helper.php, and hide-hidden-posts.php was not established."
  - "The initial compromise method and selected option values were not retained."
relatedResearch:
  - "wp-user-query-hidden-admin-filter"
  - "m6bmm64-hidden-anchor-injection"
  - "ushort-company-post-content-redirect"
relatedGuides:
  - title: "WordPress database malware guide"
    href: "/blog/wordpress-database-malware-complete-guide/"
  - title: "How to stop WordPress spam"
    href: "/blog/how-to-stop-wordpress-spam/"
relatedCaseStudies:
  - title: "SEO spam traffic-spike case study"
    href: "/case-studies/unrelated-keyword-traffic-spike-wordpress-seo-spam/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "spam-unwanted-content"
    - "hidden-users"
  searchDescription: "Casino or foreign-language posts appeared on WordPress but are missing from the Posts screen? See evidence of hidden post IDs and altered admin counts."
  summary: "This investigation is relevant when spam posts are publicly reachable or appear in search results but cannot be found normally in wp-admin. A must-use plugin filtered selected post IDs and adjusted administrative post counts."
  observed:
    - "The investigation retained a public casino-themed post and code that excluded selected post IDs from administrative queries and counts."
  possible:
    - "Spam posts can be visible publicly or in search results while missing from the normal Posts list."
    - "The post count shown in wp-admin may not match the rows an administrator can see."
  questions:
    - "Why are casino posts on my WordPress site but not in the Posts screen?"
    - "Can a must-use plugin hide spam posts from WordPress administrators?"
  evidenceNote: "The retained code supports administrative concealment; it does not identify how the spam records were first created."
canonical: "https://www.mdpabel.com/malware-research/hide-hidden-posts-mu-plugin/"
index: true
---

## Summary

This WordPress malware research entry documents post-concealment mu plugin evidence observed during one anonymized client investigation. The narrow topic is **hide-hidden-posts.php MU-Plugin and Concealed Post IDs**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

The code is designed to conceal selected posts from administrative queries and counts. It could hide unwanted content, but creation of the visible casino post is not shown in this sample.

## Investigation context

Anonymized investigation with an MU-plugin directory screenshot, a visible casino post screenshot, and retained hide-hidden-posts.php code. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

hide-hidden-posts.php existed in the MU-plugin directory.

![WordPress file manager showing hide-hidden-posts.php inside the mu-plugins directory](/wordpress-threats/hidden-posts_evidence-2.png "The file manager confirms hide-hidden-posts.php beside db.php and mu-helper.php in mu-plugins. It does not identify which component created any spam post.")

Casino-related content was visible during the investigation.

![Rendered WordPress post displaying Italian casino-related text](/wordpress-threats/hidden-posts_evidence-1.png "A casino-related post was visible during the same anonymized investigation. The screenshot confirms the content symptom, not that hide-hidden-posts.php created it.")

## Confirmed findings

- The file was present under wp-content/mu-plugins.
- apft_get_hidden_ids reads apft_hidden_post_ids and converts values to integers.
- pre_get_posts adds those IDs to post__not_in under the coded conditions.
- wp_count_posts reduces the published count for matching IDs.

## Technical analysis

### How apft_hidden_post_ids changes post visibility

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

```php
$ids = get_option('apft_hidden_post_ids', []);
// validated IDs are merged into post__not_in
$query->set('post__not_in', $ids);
// count-adjustment query details shortened
```

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

The code is designed to conceal selected posts from administrative queries and counts. It could hide unwanted content, but creation of the visible casino post is not shown in this sample.

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

- `hide-hidden-posts.php`
- `apft_hidden_post_ids`
- `apft_get_hidden_ids`
- `post__not_in plus wp_count_posts adjustment`

### Contextual indicators

- `mu-plugins`
- `pre_get_posts`
- `wp_count_posts`
- `casino-related post`

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

- The evidence does not show which code created the casino post.
- The relationship between db.php, mu-helper.php, and hide-hidden-posts.php was not established.
- The initial compromise method and selected option values were not retained.

## Artifact-specific remediation

- Preserve the MU-plugin and option value before changes.
- Remove the untrusted file and review every neighboring MU-plugin against a known baseline.
- Identify the selected post IDs directly in the database and review their authors, content, and status.
- Remove unauthorized content only after preserving needed evidence.

For a complete response sequence, use the [broader malware-removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/) or the [WordPress malware-removal service](/wordpress-malware-removal/) when hands-on incident response is appropriate.

## Recurrence verification

- Confirm apft_hidden_post_ids does not return.
- Compare direct database post counts with wp-admin counts.
- Monitor mu-plugins and post records for recreation.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [wp-user-query.php MU-Plugin Concealing a Stored User ID](/malware-research/wp-user-query-hidden-admin-filter/)
- [M6bMm64 Hidden Anchor and Off-Screen CSS in post_content](/malware-research/m6bmm64-hidden-anchor-injection/)
- [ushort.company Meta-Refresh and JavaScript Redirect in post_content](/malware-research/ushort-company-post-content-redirect/)

## Related guides and case studies

- [WordPress database malware guide](/blog/wordpress-database-malware-complete-guide/)
- [How to stop WordPress spam](/blog/how-to-stop-wordpress-spam/)
- [SEO spam traffic-spike case study](/case-studies/unrelated-keyword-traffic-spike-wordpress-seo-spam/)

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
