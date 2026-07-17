---
lessonNumber: 7
slug: wordpress-hacked-response-plan
title: "WordPress Hacked? A Safe Response and Recovery Plan"
shortTitle: Hacked-site response plan
description: Follow a calm defensive response plan that preserves evidence, protects accounts, removes persistence, and validates recovery.
socialDescription: A defensive WordPress incident-response plan for documenting symptoms, cleaning safely, closing the entry point, and monitoring recovery.
readingTime: 10
previousLesson:
  slug: detect-a-hacked-wordpress-site
  label: Monitor for early warning signs
nextLesson:
  slug: monthly-wordpress-security-checklist
  label: Build a monthly security routine
objectives:
  - Document symptoms and preserve useful evidence before cleanup.
  - Protect important accounts from a clean device.
  - Address malicious changes, persistence, and the original entry point.
  - Validate recovery and monitor for reinfection.
action:
  title: Prepare an incident worksheet before you need it
  introduction: Create a protected document with prompts that keep the first hour calm and repeatable.
  steps:
    - Add fields for affected URLs, symptoms, times, devices, recent changes, and screenshots.
    - List the owner and recovery route for email, hosting, registrar, DNS/CDN, WordPress, and backups.
    - Record where logs, snapshots, clean software sources, and restore instructions are available.
    - Add validation checks and the rule that external reviews happen only after cleanup.
commonMistakes:
  - Deleting every suspicious file before preserving evidence or a snapshot.
  - Resetting only WordPress while compromised email or hosting access remains active.
  - Removing the visible symptom without finding persistence or the original entry point.
  - Requesting blacklist reviews before the site has been cleaned and checked from multiple views.
checklist:
  - Symptoms, recent changes, and useful logs are recorded.
  - A labeled snapshot exists and important credentials were reset from a clean device.
  - Malicious files, database content, users, tasks, persistence, and the entry point were addressed.
  - The site was validated broadly before review requests and ongoing monitoring began.
furtherReading:
  - href: /blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/
    label: A deeper WordPress malware recovery guide
    description: More technical context around a complete cleanup.
  - href: /blog/what-to-do-after-fixing-a-hacked-wordpress-site-checklist-from-real-cleanups/
    label: Post-cleanup validation checklist
    description: Review the steps that reduce the chance of an immediate repeat.
  - href: /case-studies/failed-google-blacklist-request-how-to-find-hidden-database-malware/
    label: Case study on a failed blacklist review
    description: Understand why cleanup should come before a review request.
  - href: /case-studies/wordpress-hacked-how-i-restored-a-client-site-after-everything-was-deleted/
    label: Case study on recovery after files were deleted
    description: A reminder to protect evidence and usable restore points.
---

A suspected compromise creates pressure to delete anything unfamiliar. A better response protects visitors, preserves useful evidence, closes the original opening, and validates the site before asking browsers or security vendors to review it.

## 1. Confirm, document, and contain

Record the affected URLs, redirects, warning text, screenshots, times, devices, recent changes, and who first noticed the issue. Check whether the behavior affects visitors, administrators, search traffic, or specific devices. Avoid browsing unsafe pages more than necessary.

If visitors face a harmful download, credential prompt, or payment risk, ask the host how to contain the site safely while preserving access for investigation. Depending on the business, containment may mean a maintenance page, restricted access, pausing checkout, or isolating one site from others. The priority is to reduce harm without destroying the material needed to understand what happened.

Do not randomly delete files or restore the newest backup immediately. Deletion can remove timestamps, logs, or code that reveals the entry point, while a recent backup may already contain the infection. Preserve hosting access logs, error logs, security alerts, file-change records, and available snapshots for the relevant period.

## 2. Create a safe snapshot and protect accounts

Create a separate snapshot or backup of the current state when it can be done safely. Label it as potentially compromised and protect it from public access. This is not automatically a restore point; it is a reference that may preserve evidence and business data needed during recovery.

From a clean, updated device, secure the primary email, hosting, registrar, DNS/CDN, WordPress administrator, backup, and database credentials. Use unique passwords, enable two-factor authentication, revoke unknown sessions and application passwords, and coordinate changes so investigators are not locked out unexpectedly.

If a workstation may be compromised, do not use it to set new credentials. Review whether credentials were stored in browser profiles, deployment tools, password vaults, or configuration files that other people or systems could access.

## 3. Identify the infection and the entry point

Investigate suspicious files, database content, users, plugins, themes, must-use plugins, scheduled tasks, configuration, and server rules. Compare WordPress core and official components with known-good packages. Review logs and the vulnerability history of installed software around the earliest known symptom.

The visible redirect or spam page may be only one payload. Persistence can recreate deleted files through a cron job, hidden administrator, backdoor, compromised external account, database injection, or another infected site in the same hosting account.

Cleanup is incomplete until you have a reasonable explanation for how unauthorized changes happened and how continuing access was removed. Sometimes the exact first request cannot be proven because logs expired, but the response should still address every credible access route found during the investigation.

## 4. Remove, replace, update, and harden

Remove confirmed malicious files, database content, users, scheduled tasks, and persistence using a documented process. Replace modified core, plugin, and theme files with clean copies from trusted sources when appropriate. Delete abandoned or nulled software, update vulnerable components, and address compromised sibling sites or accounts in the same environment.

Take care with business data and custom code. Broad deletion or a clean reinstall can lose orders, uploads, configuration, or legitimate modifications while leaving database or account persistence untouched. Keep before-and-after records so changes can be reviewed and reversed when a legitimate item is removed by mistake.

If the scope is unclear, the site handles sensitive data, several services are affected, or you do not have safe access to logs and backups, use qualified incident-response or malware-removal help. This course intentionally does not provide malware payloads or offensive exploitation steps.

## 5. Validate the cleanup from several views

Test while logged out, on different devices and networks, and through the traffic paths that originally triggered the issue. Check administrators, plugins, scheduled tasks, files, database symptoms, forms, checkout, email, Search Console, and hosting warnings. Confirm that credentials, backups, updates, and logs are working in the recovered state.

Scan results can support validation, but no single scanner covers every file, database entry, conditional redirect, or external account. Compare the repaired site with the inventory and baseline created earlier in the course.

Create a new known-good backup only after the recovered site has been reviewed. Keep the compromised snapshot separate according to the site's legal and privacy requirements.

## 6. Request reviews and monitor for reinfection

Request Google, browser, hosting, or blacklist reviews only after cleanup and validation. Include the precise affected URLs and the corrective actions the service asks for. Repeated review requests against an infected site can slow recovery and provide no substitute for fixing the cause.

Keep a record of what changed and continue monitoring file activity, users, scheduled tasks, traffic, and search results. If symptoms return, preserve the new evidence and revisit the entry point rather than repeating the same deletion.

After the incident, update the access list, backup plan, software register, and response worksheet. A calm review of what worked and what was missing turns the event into a stronger preventive system.
