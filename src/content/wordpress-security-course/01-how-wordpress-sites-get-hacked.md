---
lessonNumber: 1
slug: how-wordpress-sites-get-hacked
title: "How WordPress Sites Get Hacked: A Guide for Site Owners"
shortTitle: How WordPress sites get hacked
description: Understand the common ways WordPress sites are compromised and how to reduce the attack surface without relying on a single plugin.
socialDescription: Learn where WordPress risk really comes from and make a practical inventory of the accounts, software, and services around your site.
readingTime: 8
previousLesson: null
nextLesson:
  slug: secure-wordpress-login
  label: Secure logins and user accounts
objectives:
  - Explain an attack surface in plain language.
  - Recognize the most common preventable WordPress risks.
  - Understand why security extends beyond the WordPress dashboard.
  - Build an inventory of the people, software, and accounts that can affect your site.
action:
  title: Map your attack surface in 15 minutes
  introduction: Open a note and create a simple inventory. You do not need technical details yet; the aim is to know what exists and who controls it.
  steps:
    - List WordPress administrators and anyone who can install or edit software.
    - List the hosting, domain registrar, DNS/CDN, email, and backup providers.
    - Record where plugins and themes come from and who approves updates.
    - Mark unknown, shared, unused, or unsupported items for review.
commonMistakes:
  - Assuming a small or low-traffic website is too unimportant to be attacked.
  - Keeping unused plugins and themes because they are deactivated.
  - Treating hosting, email, registrar, and backup accounts as separate from website security.
  - Installing several security plugins without fixing basic access and maintenance problems.
checklist:
  - I can name every service and account that can change my website.
  - Every installed plugin and theme has a known, trusted source.
  - Unused software and unnecessary administrator accounts are scheduled for removal.
  - I understand that security reduces risk but cannot remove it completely.
furtherReading:
  - href: /guides/are-wordpress-websites-secure/
    label: Are WordPress websites secure?
    description: A broader guide to WordPress risks and preventive controls.
  - href: /blog/nulled-wordpress-plugins-themes-security-risks/
    label: Why nulled plugins and themes are a security risk
    description: Understand the trust and update problems created by pirated software.
  - href: /blog/ive-fixed-4500-hacked-sites-heres-what-most-website-owners-miss/
    label: What website owners often miss
    description: Lessons drawn from MD Pabel's documented cleanup experience.
  - href: /blog/wordpress-supply-chain-attack-plugin-backdoor-cleanup/
    label: How supply-chain compromise reaches WordPress
    description: See how a trusted software path can become part of an incident.
---

A hacked website is rarely the result of one dramatic event. More often, an attacker finds one neglected opening among the site, its accounts, or the services around it. This lesson gives you a practical way to see those openings before they become an incident.

## Think in layers, not in absolutes

No responsible person can describe a public website as completely unhackable. WordPress sits inside a larger system: a hosting account, a database, a domain registrar, DNS or CDN services, email accounts, backups, plugins, themes, and people with access. A failure in any one layer can affect the whole site.

Your **attack surface** is simply the collection of places where someone could try to get in or make an unauthorized change. A brochure site with one administrator and ten maintained plugins has a smaller surface than a store with many staff accounts, old integrations, several developers, and abandoned extensions.

The goal is not to make the surface disappear. It is to know what it contains, remove what is unnecessary, and maintain what remains. That is also why a claim such as “100% secure” should make you cautious: it ignores the people and services outside the WordPress installation.

## Vulnerable, abandoned, and pirated software

Plugins and themes add code that runs with your website. If a component has a security flaw, is no longer maintained, or is left outdated after a fix becomes available, it can create an opening. Inactive software can still matter when its files remain on the server, so deactivating something is not the same as removing it.

Nulled plugins and themes are especially risky. They are unofficial copies of paid products and may be modified before you download them. Even if a copy appears to work, you cannot reliably know what was added, and it usually has no trustworthy update path.

A familiar plugin name or polished dashboard label also does not prove the files are genuine. Attackers sometimes imitate legitimate plugins, hide code from the normal plugin list, or use the must-use plugin folder. Those areas have valid uses, but every item should still have a known purpose, owner, and source.

## Credentials and connected accounts

Weak or reused passwords allow one breach to spread. If the same password protects email and WordPress, access to the email account may let an attacker reset the WordPress password. A compromised administrator, hosting panel, registrar, backup account, or Cloudflare account can all provide ways to alter the site or keep control after a visible cleanup.

Access should match the work a person actually needs to do. Too many administrators, shared logins, forgotten contractor accounts, and old application passwords make accountability difficult. Each extra privileged account is another key that must be protected, reviewed, and removed when it is no longer needed.

## Supply chains and trusted relationships

Sometimes the software owner, update server, developer account, or hosting provider is compromised. That is a **supply-chain problem**: the harmful change arrives through something you normally trust. You cannot personally audit every line of every update, but you can reduce exposure by choosing actively maintained products, keeping recoverable backups, limiting privileged access, and watching for unusual changes after updates.

The surrounding business accounts matter too. A hijacked domain or DNS account can redirect visitors without changing WordPress. A compromised developer laptop can expose stored credentials. A breached email inbox can be used for password resets. WordPress security therefore includes how your team handles devices, passwords, email, hosting, and change approvals.

## Why one security plugin is not a security plan

A reputable security plugin can help with alerts, login controls, file-change monitoring, and known-malware detection. It cannot make abandoned software safe, protect a reused hosting password, verify that every administrator is authorized, or guarantee that backups can be restored. It also may not recognize a new or carefully hidden infection.

Use security tools as one layer. Pair them with supported software, unique credentials, two-factor authentication, tested off-site backups, access reviews, and routine monitoring. When those basics are clear, a plugin becomes useful evidence and support instead of a false sense of certainty.

The rest of this course works through those layers in a practical order. You will start with access, then software, backups, hardening, monitoring, incident response, and a repeatable maintenance routine.
