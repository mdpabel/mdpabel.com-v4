---
lessonNumber: 4
slug: wordpress-backups-and-recovery
title: WordPress Backups and Recovery Planning for Site Owners
shortTitle: Backups and recovery
description: Build a WordPress backup plan that covers files, the database, off-site storage, retention, and tested restoration.
socialDescription: Turn WordPress backups into a recovery plan that still works when hosting, files, or recent restore points cannot be trusted.
readingTime: 8
previousLesson:
  slug: plugins-themes-and-updates
  label: Choose plugins, themes, and updates safely
nextLesson:
  slug: wordpress-hardening
  label: Apply practical WordPress hardening
objectives:
  - Explain the difference between WordPress files and the database.
  - Choose backup frequency and retention based on site activity.
  - Keep protected copies outside the main hosting account.
  - Test restoration and prepare a recovery information sheet.
action:
  title: Verify one complete restore point
  introduction: Do not change production today. Confirm that a recent backup exists and that you could obtain everything needed for a restore.
  steps:
    - Check that the backup includes both files and the database.
    - Confirm a copy exists outside the main hosting account.
    - Download or otherwise verify access to the archive and recovery instructions.
    - Schedule an isolated restore test and record who will validate the result.
commonMistakes:
  - Backing up only files or only the database without understanding the gap.
  - Keeping every backup inside the same hosting account.
  - Overwriting the only known-good restore point with the newest copy.
  - Assuming a completed backup job means restoration has been tested.
checklist:
  - Backups include WordPress files and the database.
  - The schedule matches how often important site data changes.
  - At least one protected copy is stored off-site with multiple restore points.
  - A restoration test and recovery information sheet are current.
furtherReading:
  - href: /blog/how-to-back-up-your-wordpress-site-with-updraftplus-step-by-step-guide-2025/
    label: Create WordPress backups with UpdraftPlus
    description: A practical walkthrough of one common backup tool.
  - href: /guides/how-to-use-all-in-one-wp-migration-to-back-up-and-migrate-your-wordpress-site-2025-guide/
    label: Back up and migrate with All-in-One WP Migration
    description: Another local workflow for creating a portable site copy.
  - href: /case-studies/wordpress-hacked-how-i-restored-a-client-site-after-everything-was-deleted/
    label: Case study on restoring after destructive damage
    description: See why recoverable copies and a careful recovery process matter.
  - href: /blog/hosting-account-suspended-malware-recovery/
    label: Recover when the hosting account is suspended
    description: Understand why a copy outside the affected host matters.
---

A backup is useful only when it contains what you need, survives the incident, and can actually be restored. Recovery planning turns “we have backups” into a process a site owner can rely on under pressure.

## Back up both files and the database

WordPress files include core files, plugins, themes, uploads, and configuration. The database contains posts, pages, users, settings, orders, form data, and other structured content. A files-only copy may preserve images but miss recent orders; a database-only copy may lack the theme, plugins, or uploads needed to rebuild the site.

Know what your backup tool includes and whether it covers anything outside the normal WordPress directory. Some sites store downloads, logs, or configuration elsewhere. Also record the PHP and server requirements that may be needed to restore an older copy in a different environment.

Managed hosts may provide snapshots, while a WordPress plugin may create portable archives. These can complement each other. Understand who controls each copy, how it can be downloaded, and whether access depends on the same account that might be unavailable during an incident.

## Match frequency to the cost of lost changes

A mostly static brochure site may tolerate a daily or weekly content backup. A busy store, membership site, or publication may need more frequent database backups because orders, accounts, and posts change throughout the day. Ask how much activity the business could afford to recreate, then choose a schedule that keeps potential loss within that window.

Automation reduces the chance that a busy week interrupts the routine, but automated jobs still fail. Review success reports, storage limits, and the date of the most recent complete backup. A green plugin screen is not enough if the remote destination stopped accepting uploads last month.

Backups also consume server resources. Schedule large file archives away from known traffic peaks when possible, and confirm that a failed job creates a visible alert instead of quietly retrying forever.

## Use off-site storage and sensible retention

A backup stored only in the same hosting account can disappear during an account suspension, server failure, destructive compromise, or billing problem. Keep at least one copy in a separate provider or location protected by its own strong password and two-factor authentication. Limit who can delete or overwrite those copies.

Retention means keeping multiple restore points rather than only the newest backup. Malware or a damaging change may go unnoticed for days, so the latest copy can already contain the problem. Keep a mixture of recent and older restore points appropriate to the site, available storage, legal obligations, and the sensitivity of stored data.

Protect backup data as carefully as the live site. Archives may contain customer information, password hashes, API keys, and configuration. Use encryption where the provider supports it, remove public download links, and revoke access when a staff member or supplier leaves.

## Test restoration before an emergency

A restoration test confirms that the archive can be downloaded, decrypted, imported, and used. Test in a staging or isolated environment so production is not overwritten. Check key pages, media, login, forms, orders or membership functions, scheduled jobs, and links. Record the time and any manual steps.

A successful restore does not prove the backup is clean. If you are recovering from malware, choose a restore point carefully and investigate the original entry point. Otherwise an infected backup or unchanged vulnerable plugin can return the site to the same condition.

Make restoration a quarterly task for important sites and repeat it after major changes to the host, backup tool, encryption method, or site architecture. The test should be possible without relying on one person's memory.

## Create a recovery information sheet

Keep a protected record of the domain registrar, DNS/CDN, host, backup provider, account owners, support contacts, normal server details, backup schedule, retention, and the date of the last restore test. Include the order in which services should be recovered and who can authorize a production restore.

Do not place live passwords in an unprotected document. Store credentials in a password manager and let the sheet identify where access is held. Give a second trusted person enough information to begin recovery if the usual site owner is unavailable.

Review the sheet when providers, staff, or developers change. A recovery plan that points to a former employee's email or a closed storage account is only a plan on paper.
