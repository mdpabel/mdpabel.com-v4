---
lessonNumber: 3
slug: plugins-themes-and-updates
title: How to Choose Secure WordPress Plugins and Themes
shortTitle: Plugins, themes, and updates
description: Choose maintained WordPress software, spot warning signs, and update with a backup and rollback plan.
socialDescription: Learn how to evaluate WordPress plugins and themes, remove unsafe software, and make updates with less risk.
readingTime: 8
previousLesson:
  slug: secure-wordpress-login
  label: Secure logins and user accounts
nextLesson:
  slug: wordpress-backups-and-recovery
  label: Build a backup and recovery plan
objectives:
  - Evaluate whether software has a trustworthy source and maintenance history.
  - Recognize abandoned, nulled, fake, hidden, and must-use software risks.
  - Remove unused software instead of merely deactivating it.
  - Use backups, staging, and rollback notes for safer updates.
action:
  title: Create a software register
  introduction: A simple table is enough. For each plugin and theme, record the information needed to decide whether it stays.
  steps:
    - Record the name, purpose, source, owner, installed version, and last update.
    - Flag inactive, duplicate, unsupported, or unknown items.
    - Remove one unnecessary item after taking a recoverable backup.
    - Schedule the remaining updates and define the pages or workflows to test.
commonMistakes:
  - Downloading premium software from unofficial free mirrors.
  - Judging safety only by the plugin name or dashboard icon.
  - Leaving deactivated software installed indefinitely.
  - Updating a critical site without a usable backup or a basic test plan.
checklist:
  - Every installed component has a known purpose, source, and owner.
  - No nulled plugin or theme is installed.
  - Unused components are removed after a backup and dependency check.
  - Important updates have a rollback and functional-testing plan.
furtherReading:
  - href: /blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/
    label: Known fake and malicious WordPress plugins
    description: Examples of names and behaviors that deserve investigation.
  - href: /blog/wp-compat-plugin-the-hidden-backdoor-in-your-wordpress-site/
    label: Inside a fake compatibility plugin
    description: A local analysis showing why a plausible name is not enough.
  - href: /case-studies/wpcode-plugin-malware-hidden-redirect-removal/
    label: Case study on malicious code hidden behind a familiar plugin
    description: See why the dashboard label alone cannot establish that files are safe.
  - href: /guides/best-wordpress-security-plugins/
    label: Evaluate WordPress security plugins
    description: Compare tools while keeping realistic expectations about their role.
---

Plugins and themes are not just visual add-ons. They are executable parts of the website, and each one becomes a maintenance decision. A short selection and update process prevents many avoidable problems.

## Start with a trusted source and a clear need

Install software from the official WordPress directories, the verified developer, or a reputable marketplace. Check the publisher's real domain rather than trusting a search advertisement or download mirror. Avoid nulled copies: you lose a trustworthy update channel and cannot know whether the package was changed before download.

Before adding anything, write down the feature it must provide. If an existing tool already covers that need, another plugin adds code, settings, and future updates without clear value. Fewer well-chosen components are easier to inventory, test, and remove when they are no longer supported.

Do not choose only by install count, star rating, or a recommendation made years ago. Those signals can help, but they do not replace checking the current developer, maintenance record, compatibility, and whether the product still solves your exact need.

## Look for signs of active maintenance

Review the last update, changelog, compatibility information, support activity, and public security notices. A quiet support forum alone does not prove abandonment, but a long period without releases, unanswered reports, outdated compatibility, and no clear owner together are warning signs. For paid software, confirm that the license still provides updates.

Ownership changes deserve attention because update practices, data handling, and product direction can change. Read significant release notes and confirm that the product still comes from the developer you expect. If a component has no credible maintenance path, plan a replacement before it becomes urgent.

A replacement may require content migration or configuration changes, so do not wait for the old component to fail. Identify a maintained alternative, test it away from production, and keep a record of any data that must be exported before removal.

## Inactive, fake, hidden, and must-use plugins

A deactivated plugin normally leaves its files on the server. If the files contain a directly reachable flaw, deactivation may not remove the risk. Delete software that is no longer needed after confirming it is not storing data or providing a required function. Keep a record so it can be reinstalled from the correct source if necessary.

Attackers sometimes create fake plugins with plausible names, hide a plugin from the normal list, or place persistence in the must-use plugin directory. The must-use area is legitimate and used by hosts and developers, so its presence is not automatically suspicious. What matters is whether every item has a known owner, purpose, and source.

A familiar label in the dashboard is not proof that the underlying files match the official product. Compare questionable components with a clean package from the real publisher and investigate unexpected code, users, scheduled tasks, or files instead of relying on the display name.

## Prepare before updating

Updates close known vulnerabilities and should not be postponed indefinitely. At the same time, a major plugin, theme, PHP, or WooCommerce change can affect compatibility. Take a current backup that can be restored, review important release notes, and use a staging site for high-risk or revenue-critical changes when available.

Define what you will test: login, forms, checkout, scheduled jobs, caching, email delivery, and key pages. Record the previous versions and the person making the change. If something fails, a clear rollback plan is safer than randomly disabling multiple components until the site appears to work.

Automatic updates can be suitable for low-risk, well-maintained components when backups and monitoring are reliable. Critical systems may need a controlled window. The right policy depends on how quickly the site can detect failure, restore service, and absorb lost transactions or content.

## Respond to a vulnerability notice

Confirm the affected product and versions using the developer's advisory or another reliable source. If a fixed version exists, back up and update promptly. If no fix exists, follow the vendor's mitigation advice or disable and remove the component if the site can operate without it. Test the site after the change.

Do not assume an update repairs a site that was already compromised. If the vulnerable version was exposed and you see unknown users, files, redirects, or other warning signs, investigate for intrusion. Updating closes an opening; it does not automatically remove changes made through that opening.

Record the notice, decision, update time, and checks performed. That small audit trail helps the next reviewer understand whether the risk was accepted, mitigated, or fully removed.
