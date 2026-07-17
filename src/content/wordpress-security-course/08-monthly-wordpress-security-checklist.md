---
lessonNumber: 8
slug: monthly-wordpress-security-checklist
title: Monthly WordPress Security Checklist for Site Owners
shortTitle: Monthly security checklist
description: Use a realistic weekly, monthly, quarterly, and event-based WordPress security maintenance routine.
socialDescription: Finish the course with a practical WordPress security schedule you can assign, record, print, and repeat.
readingTime: 8
previousLesson:
  slug: wordpress-hacked-response-plan
  label: Follow a safe hacked-site response plan
nextLesson: null
objectives:
  - Create weekly, monthly, and quarterly maintenance rhythms.
  - Respond consistently to vulnerability, staffing, migration, and cleanup events.
  - Assign owners and record evidence instead of relying on memory.
  - Finish the course with a printable operating checklist.
action:
  title: Book the next three security reviews
  introduction: Put the routine on a real calendar now so it survives a busy month.
  steps:
    - Assign a person to the weekly review and schedule the next four checks.
    - Schedule the next monthly user, software, monitoring, and backup review.
    - Schedule a quarterly restoration test and access review.
    - Save or print the final checklist and record where evidence will be kept.
commonMistakes:
  - Making a checklist so large that nobody can complete it consistently.
  - Installing updates without checking backups and key site functions.
  - Removing a WordPress user but forgetting their hosting, email, DNS, or backup access.
  - Returning to the normal schedule immediately after cleanup without watching for reinfection.
checklist:
  - Weekly, monthly, and quarterly tasks have named owners and calendar dates.
  - Event-based procedures cover vulnerabilities, offboarding, migrations, and cleanup.
  - Review evidence and exceptions are stored in a consistent place.
  - The printable final checklist has been saved and adapted to the site.
furtherReading:
  - href: /blog/why-wordpress-malware-keeps-coming-back-and-how-to-stop-it-forever/
    label: Why WordPress malware returns
    description: Connect reinfection with missed access, vulnerabilities, and persistence.
  - href: /blog/wordpress-cron-job-malware/
    label: How scheduled persistence can recreate malware
    description: A focused example of why recurring tasks belong in monitoring.
  - href: /case-studies/regenerating-wordpress-malware-system-control-case-study/
    label: Case study on regenerating WordPress malware
    description: See why post-cleanup monitoring needs to catch recurring files and tasks.
  - href: /case-studies/how-i-stopped-wp-blog-header-php-regenerate-malware-in-wordpress/
    label: Stop a recurring WordPress infection
    description: A practical example of investigating persistence instead of deleting symptoms.
---

Security improves when small checks happen on a schedule. This final lesson turns the course into a routine that a site owner can assign, record, and repeat without pretending a checklist can guarantee perfect protection.

## Weekly: look for urgent change

Confirm recent automated backups completed and reached off-site storage. Review critical update or vulnerability notices, hosting alerts, security warnings, and unexpected administrator changes. Check the site while logged out on desktop and mobile, focusing on the home page, login, forms, checkout, and other important paths.

A weekly check should be short enough to complete consistently. Record the date, reviewer, exceptions, and follow-up owner. If a warning needs investigation, open a separate incident or maintenance task rather than turning the routine check into undocumented emergency work.

For an active store or membership site, include a quick check that transactions, account creation, and email notifications still work. These failures are not always security incidents, but they can reveal a damaging update or resource problem early.

## Monthly: review the whole operating surface

Review WordPress administrators, application passwords, installed plugins and themes, must-use plugins, supported versions, updates, and license status. Remove access and software that are no longer needed. Check Search Console, indexing patterns, hosting resource graphs, file-change information, scheduled tasks, and any security-plugin alerts that were not already resolved.

Verify that a complete files-and-database backup exists off-site and that retention includes more than the newest copy. Test key forms and business flows after updates. Review the recovery information sheet so provider names, account owners, and support routes remain accurate.

Compare the current state with last month's software and access inventory. A small, explained difference is normal. An unknown administrator, plugin, task, or sudden file-count increase needs an owner and an investigation.

## Quarterly: test recovery and permissions

Restore a backup into an isolated environment and test key pages, login, media, forms, checkout, scheduled tasks, and integrations. Review who has access to WordPress, hosting, email, registrar, DNS/CDN, backups, analytics, and Search Console. Confirm two-factor authentication and recovery methods still work.

Review whether each plugin and theme remains necessary and maintained. Check supported PHP and server versions with the host. Revisit the incident-response worksheet and run a short tabletop exercise: if the site redirected visitors today, who would contain it, protect accounts, preserve logs, clean it, approve restoration, and request reviews?

Use the exercise to find gaps, not to test people. Update contact details, access methods, and steps while the situation is calm.

## After a plugin vulnerability notice

Confirm the affected product and versions through the developer or another reliable advisory. Back up the site, update to a fixed version, or remove the component if no safe version exists and the site can operate without it. Test important workflows and record the decision.

If the site ran an affected version while the vulnerability was being exploited publicly, review users, files, database symptoms, logs, and scheduled tasks. An update closes the known opening but does not remove changes already made through it.

## After a staff member or developer loses access

Remove or downgrade their WordPress account and revoke application passwords, active sessions, hosting users, SFTP or SSH keys, registrar access, DNS/CDN access, backup access, shared vault permissions, deployment tokens, and recovery email or phone methods.

Rotate shared secrets that cannot be tied to one person. Transfer ownership of scheduled jobs, licenses, analytics, Search Console, and backups. Record who completed the offboarding and who confirmed that business functions still work.

## After migration or hosting changes

Verify DNS, HTTPS, WordPress URLs, backups, off-site storage, file permissions, PHP versions, scheduled jobs, caching, forms, email delivery, monitoring, and log access. Confirm that the old host no longer receives traffic and that unneeded old accounts, databases, and copies have an approved retention or deletion plan.

Create a fresh recovery information sheet and perform a restoration test using the new environment. A migration changes several security assumptions at once, so it should not be treated as complete just because the home page loads.

## After malware cleanup

Keep enhanced monitoring, confirm the entry point was addressed, review every privileged account, create a known-good backup, and watch for recurring files, tasks, redirects, resource spikes, or search spam. Validate while logged out and from the devices or referrals that originally showed the problem.

Review Search Console, browser warnings, hosting notices, and blacklist status only after the cleanup. Preserve the incident record and update the inventory so future reviewers know which files, users, software, and tasks belong.

## Make the routine sustainable

Every task should have an owner, due date, and simple evidence such as a backup timestamp, update record, screenshot, or ticket. A ten-minute check completed every week is more useful than an elaborate document nobody opens. Adjust frequency for the site's activity, sensitivity, and business impact.

Completion means you have a repeatable process, not that the site is guaranteed safe. Keep recoverable backups, test changes, and revise the routine when the site gains new users, software, services, or business functions. Use the printable checklist on the course hub as a starting point and adapt it to your site.
