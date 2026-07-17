---
lessonNumber: 5
slug: wordpress-hardening
title: How to Harden WordPress Without Breaking Your Site
shortTitle: Practical WordPress hardening
description: Apply beginner-friendly WordPress hardening in a controlled order, with backups, tests, and a rollback path.
socialDescription: Reduce unnecessary WordPress risk with supported software, HTTPS, safer permissions, and reversible changes.
readingTime: 8
previousLesson:
  slug: wordpress-backups-and-recovery
  label: Build a backup and recovery plan
nextLesson:
  slug: detect-a-hacked-wordpress-site
  label: Monitor for early warning signs
objectives:
  - Prioritize high-value hardening steps for a typical WordPress site.
  - Understand HTTPS, permissions, configuration protection, and file editing controls.
  - Use security plugins and hosting features with realistic expectations.
  - Apply changes through a documented, reversible process.
action:
  title: Complete a safe hardening pass
  introduction: Choose changes with clear value and low disruption. Stop if the site behaves differently and use your rollback notes.
  steps:
    - Confirm HTTPS works and no important page loads insecure resources.
    - Remove one unused account, plugin, or theme after checking dependencies.
    - Confirm PHP, WordPress core, plugins, and themes are supported and scheduled for updates.
    - Review dashboard file editing, permissions, and security-plugin alerts with your host's guidance.
commonMistakes:
  - Applying generic file permissions without checking the hosting environment.
  - Pasting hardening snippets that cannot be explained or reversed.
  - Running several overlapping security plugins and ignoring their alerts.
  - Changing many settings at once without testing business-critical workflows.
checklist:
  - The full site and login use HTTPS without mixed-content warnings.
  - Core, PHP, plugins, and themes are supported and maintained.
  - Sensitive configuration and file editing follow the host's safe guidance.
  - Every hardening change has a backup, test, owner, and rollback note.
furtherReading:
  - href: /guides/how-to-fix-wordpress-file-and-folder-permissions-using-a-simple-php-script-no-ssh-required/
    label: Understand WordPress file and folder permissions
    description: Technical context for permissions, with cautions before changing them.
  - href: /blog/secure-wordpress-without-security-plugins/
    label: Secure WordPress beyond security plugins
    description: A focused explanation of foundational hardening controls.
  - href: /blog/how-to-secure-a-wordpress-site/
    label: A broader WordPress hardening guide
    description: Put HTTPS, access, updates, and configuration into one plan.
  - href: /blog/the-ultimate-guide-to-removing-htaccess-malware-from-wordpress/
    label: Understand the role of .htaccess
    description: Learn why server rules deserve careful review and backups.
---

Hardening means reducing unnecessary ways to change or abuse the website. The safest hardening plan starts with supported software and controlled access, then adds technical settings one tested change at a time.

## Begin with supported foundations

Keep WordPress core, PHP, plugins, and themes on supported versions. Unsupported software stops receiving normal security fixes and becomes harder to combine safely with current components. Remove unused accounts and software, and choose hosting that provides maintained server software, isolation, backups, HTTPS, and useful logs.

These basics usually provide more value than a long list of copied code snippets. Hardening is not a contest to change the most settings. It is a way to remove unnecessary capability while preserving the functions the site actually needs.

Ask the host how sites are isolated if several websites share one account. An infection in one site may affect siblings when they share writable directories or credentials. Each production site should have a clear owner, backup, update path, and access list.

## Use HTTPS everywhere

HTTPS encrypts traffic between the visitor and the site, including login credentials and session cookies. Use a valid certificate, redirect HTTP requests to HTTPS, and update the WordPress Address and Site Address carefully. Check for mixed content so pages do not load scripts or images over insecure HTTP.

HTTPS does not remove malware or prove that a website is trustworthy. A hacked site can still have a valid certificate. Its role is to protect data in transit and prevent some forms of tampering between the browser and the server.

After enabling or changing HTTPS, test the public site, WordPress login, forms, checkout, API integrations, webhooks, and scheduled tasks. Avoid broad database replacements unless you understand serialized WordPress data and have a rollback copy.

## Protect files, directories, and configuration

File permissions decide which server users and processes can read, write, or execute content. Use the hosting provider's recommended WordPress permissions because server configurations differ. Permissions that are too open can expose changes; permissions that are too restrictive can break uploads, updates, caching, or the site itself.

Protect `wp-config.php` and other sensitive configuration according to the host's environment. Disable dashboard theme and plugin file editing when it is not needed, so a stolen administrator session has one fewer convenient way to alter code. This does not prevent changes through the filesystem, hosting panel, or a vulnerable plugin, but it reduces an unnecessary route.

Never apply a recursive permission command or unknown “security fix” directly to production without confirming the target path, expected owner, and rollback process. One incorrect change can expose secrets or make the site unavailable.

## Use security plugins as monitored tools

A well-supported security plugin can add login controls, alerts, known-malware signatures, and file-change visibility. Configure only features you understand, keep the plugin updated, and decide who will receive and review alerts. Two overlapping firewalls or multiple scanners can create noise, performance issues, or lockouts without adding meaningful protection.

Combine the plugin with host-level controls and human review. If an alert reports a changed file, unknown administrator, or suspicious request, investigate the context instead of automatically deleting everything. Detection is most useful when it leads to a calm response process.

Review allowlists and disabled alerts. Temporary exceptions added during troubleshooting are easy to forget, and an inbox full of low-value notifications trains people to ignore the warning that matters.

## Make one reversible change at a time

Before a permission, configuration, PHP, caching, or security-rule change, take a recoverable backup and record the original value. Use staging for higher-risk work. Test login, editing, forms, checkout, uploads, scheduled jobs, and key public pages after each group of changes.

Avoid snippets copied from unknown sources, especially those that promise complete security or use broad permission changes. A rule suitable for one host can fail on another. If you cannot explain what a change restricts, how to test it, and how to reverse it, pause and ask the host or a qualified professional.

Keep a small change log with the date, owner, reason, files or settings affected, tests, and rollback instructions. That record makes future troubleshooting faster and distinguishes approved hardening from an unexpected change.
