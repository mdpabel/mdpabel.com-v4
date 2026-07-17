---
lessonNumber: 2
slug: secure-wordpress-login
title: How to Secure WordPress Login and User Accounts
shortTitle: Secure logins and users
description: Protect WordPress users and the connected accounts that can reset passwords, change DNS, or restore the site.
socialDescription: A practical login and user-security checklist for WordPress administrators and the accounts around them.
readingTime: 8
previousLesson:
  slug: how-wordpress-sites-get-hacked
  label: How WordPress sites get hacked
nextLesson:
  slug: plugins-themes-and-updates
  label: Choose plugins, themes, and updates safely
objectives:
  - Set a practical password and two-factor authentication policy.
  - Review administrator accounts and eliminate shared access.
  - Protect hosting, email, registrar, CDN, and backup logins.
  - Respond safely when an unknown administrator appears.
action:
  title: Run a privileged-account review
  introduction: Work from the most powerful accounts outward. Record changes before making them so legitimate users are not unexpectedly locked out.
  steps:
    - List every WordPress administrator and confirm the owner and business need.
    - Enable two-factor authentication for administrators and recovery email accounts.
    - Replace shared access with individual accounts and remove expired access.
    - Review application passwords and connected hosting, registrar, DNS, and backup users.
commonMistakes:
  - Changing only the WordPress password after a broader account compromise.
  - Sharing one administrator login among staff and contractors.
  - Leaving old users or application passwords active just in case.
  - Believing a hidden login URL or rate limit stops every type of unauthorized access.
checklist:
  - Important accounts use unique passwords stored in a password manager.
  - Administrators and recovery accounts use two-factor authentication.
  - Every privileged user is known, current, and individually accountable.
  - Application passwords and connected-service accounts have been reviewed.
furtherReading:
  - href: /guides/how-to-secure-wordpress-login/
    label: Secure the WordPress login
    description: A step-by-step guide to stronger login controls and authentication.
  - href: /guides/application-passwords-have-been-disabled-by-wordfence/
    label: Manage WordPress application passwords safely
    description: How application passwords work and how to troubleshoot them.
  - href: /blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/
    label: Investigate hidden administrator users
    description: A deeper look at unauthorized users in a compromised site.
  - href: /case-studies/how-a-former-developer-hijacked-a-wordpress-site/
    label: Case study on incomplete offboarding
    description: Why removing access must cover more than WordPress users.
---

Login security is less about hiding the login page and more about controlling who has access, how each person proves their identity, and what happens when access changes. Start with the accounts that can do the most damage.

## Use unique passwords and a password manager

Every important account needs a unique password. Reuse turns a breach at an unrelated service into a possible WordPress breach. A password manager creates and stores long random passwords so people do not need to invent memorable variations. Protect the password manager itself with a strong master password and two-factor authentication.

Do not send administrator passwords through shared documents or long email threads. Give each person an individual account instead. Individual accounts make it possible to remove one person, inspect activity, and change responsibilities without disrupting everyone else.

This policy should cover more than WordPress. The primary email inbox, hosting panel, registrar, DNS or CDN, backup provider, and password manager may each provide a path to reset access or change what visitors see.

## Add two-factor authentication where it matters most

Two-factor authentication asks for a second proof, commonly a code from an authenticator app or a hardware security key. Enable it for WordPress administrators and for the email, hosting, registrar, DNS/CDN, backup, and password-manager accounts that can affect the site. Recovery codes should be stored securely away from the device used for login.

Two-factor authentication reduces the usefulness of a stolen password, but it does not excuse password reuse or unsafe devices. Attackers may still abuse an active session, a compromised email account, or a malicious browser extension. Treat it as a strong layer, not a complete solution.

## Keep roles and administrator access small

Review **Users** in WordPress and confirm the identity, role, and continuing need for every account. Editors do not normally need plugin installation rights, and a temporary developer does not need permanent administrator access. Downgrade or remove accounts when the work ends, following your organization's content-ownership and record requirements.

Avoid shared administrator logins. Shared accounts hide who performed a change and make offboarding risky because the password must be changed everywhere. Also review accounts at the hosting provider and other connected services; removing a WordPress user does not remove a separate hosting or Cloudflare login.

When someone leaves, revoke their sessions, application passwords, API keys, SSH or SFTP access, hosting account, shared vault access, and recovery methods. Transfer ownership of scheduled jobs and backups instead of simply deleting the person and discovering later that automation depended on their account.

## Understand application passwords and login limiting

WordPress application passwords let approved tools use the WordPress API without receiving the user's normal password. Give them descriptive names, create them only for required integrations, and revoke them when the integration ends or a device is lost. They should use HTTPS and belong to an individual user with the least privilege the integration supports.

Login rate limiting can reduce repeated automated guesses and noisy traffic. It does not stop credential reuse, a stolen session, an application-password leak, or access through another provider. Configure it carefully so real users have a recovery route, and do not interpret fewer login attempts as proof that all access is safe.

Changing the login URL may reduce automated noise, but it is not a substitute for strong authentication. The address can be discovered through links, source code, browser history, or someone who already has access.

## What to do when an unknown administrator appears

Treat an unknown administrator as a possible incident, not just a housekeeping error. Record the username, email, role, and anything you can confirm about when it appeared before changing it. From a clean device, protect the main email, hosting, registrar, and WordPress accounts, and preserve useful logs if available.

Removing the user may stop immediate access, but it does not explain how the account appeared or whether another access method remains. Check plugins, themes, must-use plugins, scheduled tasks, application passwords, database changes, and recent file activity, or get qualified help.

The original entry point must be addressed to reduce reinfection. If the unknown user returns, files reappear, or settings change back, move to the incident-response process in lesson seven rather than repeating the same deletion.
