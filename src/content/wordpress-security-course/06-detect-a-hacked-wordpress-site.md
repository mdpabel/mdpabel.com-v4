---
lessonNumber: 6
slug: detect-a-hacked-wordpress-site
title: How to Tell if a WordPress Site Is Hacked
shortTitle: Monitoring and early detection
description: Recognize WordPress malware warning signs, check the site as a visitor, and collect useful evidence before making changes.
socialDescription: Learn the visible, account, file, database, search, and hosting signals that deserve a calm WordPress security investigation.
readingTime: 9
previousLesson:
  slug: wordpress-hardening
  label: Apply practical WordPress hardening
nextLesson:
  slug: wordpress-hacked-response-plan
  label: Follow a safe hacked-site response plan
objectives:
  - Recognize visible, account-level, file, database, and resource warning signs.
  - Check the site while logged out and from more than one device.
  - Use Search Console, hosting notices, and access logs as evidence.
  - Separate an observation from a diagnosis before changing the site.
action:
  title: Run a five-view detection check
  introduction: Record observations before changing anything. If a page is unsafe to visit, stop and use hosting or specialist support.
  steps:
    - Check the home page and a key conversion page while logged out on desktop.
    - Repeat on a phone or a different network and note any redirect or popup.
    - Review administrators, installed plugins, and recent Search Console messages.
    - Check hosting alerts, resource graphs, and available file-change or access information.
commonMistakes:
  - Checking only while logged in and assuming visitors see the same result.
  - Treating one scanner's clean result as proof that files and the database are safe.
  - Deleting unfamiliar files or scheduled tasks before recording them.
  - Requesting a blacklist or browser review before cleanup and validation are complete.
checklist:
  - I have checked the site logged out and from more than one device or network.
  - Administrators, plugins, and must-use plugins match an approved inventory.
  - Search Console, hosting notices, files, database symptoms, and resources are reviewed.
  - Suspicious observations are documented with URLs and times before changes.
furtherReading:
  - href: /blog/how-to-detect-wordpress-malware/
    label: A detailed WordPress malware detection guide
    description: Use this when a symptom needs more specific context.
  - href: /blog/fix-wordpress-redirects-to-spam-site-on-mobile-only-solved/
    label: Why redirects may appear only on mobile
    description: A deeper example of conditional visitor behavior.
  - href: /blog/how-i-caught-and-removed-a-hidden-malware-hijacking-google-traffic/
    label: Detect malware aimed at search traffic
    description: See how referral-dependent symptoms can hide from owners.
  - href: /blog/wordpress-database-malware-complete-guide/
    label: Understand WordPress database malware
    description: Technical reading for symptoms that do not appear in files.
  - href: /blog/hidden-links-malware-the-simple-guide-to-seo-spam-detection-cleanup-and-prevention/
    label: Find hidden links and SEO spam
    description: Connect search changes with injected content and prevention.
---

Early detection begins with knowing what normal looks like. You do not need to become a forensic analyst, but you should recognize changes that deserve investigation and know how to document them without destroying useful evidence.

## Look at the site like a real visitor

Unexpected redirects, fake browser checks, pop-ups, unfamiliar downloads, or content from another site are clear warning signs. Some malware shows only to mobile visitors, search-engine referrals, particular locations, or people who are logged out. An administrator may see a normal page while customers are redirected.

Check important pages in a private window while logged out, then use another device or network if symptoms are inconsistent. Do not repeatedly visit a page that tries to download files or asks you to enable notifications. Record the page, time, device, browser, referral source, and destination shown.

Ask a trusted person to describe what they saw instead of forwarding a suspicious download. A screenshot or screen recording can preserve useful context without spreading the file.

## Watch search and reputation signals

Strange search keywords, sudden unrelated traffic, spam pages in Google, or a large increase in indexed URLs can indicate injected or generated content. Search Console can reveal unfamiliar pages, manual actions, security issues, and changes in search queries. A hosting provider, browser, antivirus vendor, or blacklist service may also warn about malicious behavior.

A warning is evidence to investigate, not a complete diagnosis. It may refer to a specific URL, an old cached result, a third-party script, or a broader compromise. Record the exact message and affected URL. Do not request a review until the site is clean and the cause has been addressed.

Search for your domain with a few unusual words shown in reports, but avoid opening unsafe results. Compare the number and type of indexed pages with what the site should publish.

## Review users, plugins, and scheduled behavior

Unknown administrators, unexpected password-reset emails, or new application passwords require prompt attention. So do unfamiliar plugins, hidden or must-use plugin files without a known owner, and settings that change back after correction. Compare the current inventory with your approved software and access records.

WordPress scheduled events and server cron jobs perform legitimate maintenance, publishing, and plugin tasks. Suspicious behavior includes unknown tasks, unusual schedules, encoded or remote-looking instructions, or files that reappear at regular intervals. Do not delete unfamiliar tasks blindly; document them and confirm their purpose first.

Review recent changes with developers and staff. A new plugin or administrator may be legitimate but poorly documented. The answer should still include a clear owner, reason, source, and expected duration.

## Notice file, database, and resource changes

Unexpected changes to core files, theme files, JavaScript, `wp-config.php`, or `.htaccess` can be significant. A sudden increase in file count, storage, CPU, outgoing traffic, or PHP errors can also signal malicious activity, though each has legitimate explanations. Compare timestamps and checksums with known-good sources when possible.

Malware may live in the database as injected scripts, spam posts, altered options, hidden users, or content loaded from another domain. That is why a clean file scan does not always mean a clean site. Database investigation should preserve a backup and avoid broad search-and-replace operations that can damage serialized data.

Hosting dashboards often provide useful trends even when you cannot inspect server internals. Record when resource use changed and whether it aligns with a campaign, update, import, or other approved event.

## Use logs and a normal-state baseline

Access logs show requests to the server and can help connect a symptom with an IP address, path, user agent, or time. Error logs and hosting activity records may show file edits, login events, or resource spikes. Site owners do not need to interpret every line; preserving the relevant period can give a host or specialist the evidence needed to identify an entry point.

Create a lightweight baseline: approved administrators, installed software, normal file count and storage range, backup schedule, usual traffic sources, and key scheduled tasks. Monthly comparisons make unfamiliar changes easier to see than a one-time scan with no context.

When something differs, write “observed” rather than “hacked” until the evidence supports that conclusion. That habit keeps the response focused and prevents a legitimate change from being destroyed during a rushed cleanup.
