export interface ServicePageData {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  intro: string;
  promise: string;
  symptomsTitle: string;
  symptoms: string[];
  includesTitle: string;
  includesIntro: string;
  includes: Array<{ title: string; description: string }>;
  process: Array<{ title: string; description: string }>;
  outcomes: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ label: string; href: string; description: string }>;
}

export const malwareRemovalService: ServicePageData = {
  slug: '/wordpress-malware-removal/',
  name: 'WordPress Malware Removal',
  seoTitle: 'WordPress Malware Removal Service | Manual Cleanup — MD Pabel',
  metaDescription:
    'Manual WordPress malware removal for hacked sites, redirects, backdoors, SEO spam, fake plugins, and reinfections. 4,500+ cleanups since 2018.',
  eyebrow: 'Manual hacked-site recovery',
  headline: 'WordPress malware removal that finds more than the obvious infection.',
  intro:
    'I manually investigate hacked WordPress websites, remove malicious code and persistence mechanisms, preserve legitimate content, and harden the site against the same compromise happening again.',
  promise:
    'The goal is not a green scanner result. It is a clean, working website with the likely access point understood and the hidden reinfection paths checked.',
  symptomsTitle: 'Signs your WordPress website may be infected',
  symptoms: [
    'Visitors are redirected to gambling, spam, adult, or unfamiliar websites',
    'Google displays Japanese, pharmaceutical, casino, or unrelated search results',
    'A fake CAPTCHA or fake Cloudflare verification page appears',
    'Your host suspended the website or reported malicious files',
    'Unknown administrators, plugins, scheduled tasks, or PHP files keep appearing',
    'The infection returns after a plugin or automated scanner claimed to clean it',
    'The website is slow, defaced, inaccessible, or triggering antivirus warnings',
    'Search Console reports hacked content, social engineering, or harmful downloads',
  ],
  includesTitle: 'What a complete malware cleanup covers',
  includesIntro:
    'Every incident is different, so the investigation follows the evidence rather than a one-click checklist.',
  includes: [
    { title: 'Files and WordPress core', description: 'Review modified core files, uploads, themes, plugins, root files, and obfuscated PHP or JavaScript.' },
    { title: 'Backdoors and persistence', description: 'Check fake plugins, must-use plugins, scheduled tasks, hidden users, shell files, and self-restoring malware.' },
    { title: 'Database investigation', description: 'Inspect options, posts, widgets, users, and injected scripts or spam stored outside the file system.' },
    { title: 'Redirect and server rules', description: 'Review .htaccess, index files, configuration, DNS symptoms, and conditional mobile or search redirects.' },
    { title: 'Access and vulnerability review', description: 'Look for outdated software, stolen credentials, exposed accounts, and the likely route of compromise.' },
    { title: 'Post-cleanup hardening', description: 'Update, remove, restrict, and configure the practical controls that reduce immediate reinfection risk.' },
  ],
  process: [
    { title: 'Triage the symptoms', description: 'You share the URL, alerts, and what changed. I identify the likely incident type and access needed.' },
    { title: 'Investigate the whole site', description: 'I examine files, database content, users, scheduled tasks, plugins, redirects, and server rules.' },
    { title: 'Clean and verify', description: 'Malicious artifacts are removed carefully, legitimate content is preserved, and the original symptoms are retested.' },
    { title: 'Harden and explain', description: 'I secure the practical weak points and provide a clear summary of the findings and next steps.' },
  ],
  outcomes: ['Malicious files and injected code removed', 'Hidden persistence paths checked', 'Website and admin access verified', 'Practical hardening completed', 'Clear cleanup summary provided'],
  faqs: [
    { question: 'How long does WordPress malware removal take?', answer: 'Many standard incidents can be handled the same day. Large SEO-spam infections, damaged databases, multiple websites, hosting suspensions, or persistent reinfections can take longer because each affected layer must be verified.' },
    { question: 'Will I lose my website content?', answer: 'The cleanup is designed to preserve legitimate pages, products, orders, users, and media. A backup is created or confirmed before material changes whenever the hosting environment allows it.' },
    { question: 'Why did the malware return after a previous cleanup?', answer: 'Reinfection usually means a backdoor, scheduled task, vulnerable component, compromised credential, hidden administrator, database injection, or another infected website in the same account was missed.' },
    { question: 'Do you rely only on a malware scanner?', answer: 'No. Scanners are useful signals, but they routinely miss database payloads, unfamiliar persistence, conditional redirects, modified server rules, and code designed to resemble legitimate WordPress files.' },
    { question: 'Can you clean WooCommerce and agency-managed websites?', answer: 'Yes. I work with WooCommerce stores, business websites, content sites, and agency portfolios. The investigation is adapted to the site so legitimate custom code and business data are not removed blindly.' },
  ],
  related: [
    { label: 'Fake CAPTCHA cleanup', href: '/fake-captcha-malware-removal/', description: 'Remove fake verification pages and malicious JavaScript.' },
    { label: 'Japanese SEO spam', href: '/remove-japanese-seo-spam/', description: 'Clean spam pages and search-index pollution.' },
    { label: 'Blacklist recovery', href: '/blacklist-removal/', description: 'Restore reputation after the site is clean.' },
  ],
};

export const maintenanceService: ServicePageData = {
  slug: '/wordpress-maintenance/',
  name: 'WordPress Maintenance',
  seoTitle: 'WordPress Maintenance Service | Security, Updates & Support',
  metaDescription:
    'Reliable WordPress maintenance for updates, backups, security checks, uptime, performance, and technical support from an experienced WordPress specialist.',
  eyebrow: 'Ongoing WordPress care',
  headline: 'WordPress maintenance that prevents small problems becoming expensive emergencies.',
  intro:
    'I keep business WordPress websites updated, backed up, monitored, and technically healthy—with direct specialist support when something changes or breaks.',
  promise:
    'Maintenance should protect the website without creating update surprises. Changes are checked, backups are verified, and issues are handled by someone who understands both WordPress development and security.',
  symptomsTitle: 'When ongoing maintenance makes sense',
  symptoms: [
    'Plugin, theme, and WordPress core updates are repeatedly postponed',
    'Nobody checks whether automated backups can actually be restored',
    'The website becomes slower or less reliable over time',
    'Forms, checkout, scheduled jobs, or integrations fail without warning',
    'Several administrators or agencies have changed the site over the years',
    'Security alerts appear but there is no clear person responsible',
    'Your team needs small content or technical changes each month',
    'The site is important to revenue but is maintained reactively',
  ],
  includesTitle: 'A practical WordPress care plan',
  includesIntro:
    'The exact routine depends on the website, hosting stack, update risk, and business importance.',
  includes: [
    { title: 'Safe software updates', description: 'WordPress core, themes, and plugins updated with compatibility and critical functionality checked.' },
    { title: 'Backup verification', description: 'Confirm scheduled backups, retention, storage location, and a usable recovery path.' },
    { title: 'Security checks', description: 'Review suspicious changes, users, vulnerable components, alerts, and obvious signs of compromise.' },
    { title: 'Uptime and form checks', description: 'Monitor availability and check important forms or business flows before failures go unnoticed.' },
    { title: 'Performance care', description: 'Identify growing database, image, caching, plugin, or hosting issues that degrade speed.' },
    { title: 'Direct technical support', description: 'Small fixes, troubleshooting, and clear advice without passing the issue through a generic support queue.' },
  ],
  process: [
    { title: 'Baseline audit', description: 'I document the current stack, access, backups, update state, security concerns, and important user flows.' },
    { title: 'Stabilize the website', description: 'Urgent update, backup, performance, and configuration risks are addressed before routine care begins.' },
    { title: 'Maintain and monitor', description: 'The agreed checks and updates are completed on a consistent schedule, with changes verified.' },
    { title: 'Report what matters', description: 'You receive a concise summary of completed work, issues found, and recommendations that need a decision.' },
  ],
  outcomes: ['Updates managed consistently', 'Recovery path kept available', 'Security symptoms reviewed', 'Important website functions checked', 'A specialist available when needed'],
  faqs: [
    { question: 'How often should a WordPress website be maintained?', answer: 'Business websites should be checked at least monthly, while high-traffic, WooCommerce, membership, or frequently changing sites often need weekly monitoring and a faster update response.' },
    { question: 'Does maintenance include malware removal?', answer: 'Routine security checks are included, but a site that is already compromised needs a separate incident cleanup before it can enter normal maintenance.' },
    { question: 'Can you maintain a custom theme or custom plugins?', answer: 'Yes, after a baseline review. Custom code is documented and treated more carefully than standard components because updates and compatibility may need development work.' },
    { question: 'Do you provide hosting?', answer: 'I can work with your existing host and recommend changes when the environment is part of the problem. Hosting itself is not bundled unless explicitly agreed.' },
    { question: 'Can agencies use the maintenance service?', answer: 'Yes. I can support agency-managed WordPress websites as a technical and security partner while communication remains aligned with the agency workflow.' },
  ],
  related: [
    { label: 'Malware removal', href: '/wordpress-malware-removal/', description: 'Recover an already compromised website first.' },
    { label: 'WordPress development', href: '/website-development/wordpress-development/', description: 'Improve or extend an existing website.' },
    { label: 'Error fixing', href: '/wordpress-error-fixing/', description: 'Diagnose a specific WordPress failure.' },
  ],
};

export const criticalErrorService: ServicePageData = {
  slug: '/wordpress-critical-error-fix-service/',
  name: 'WordPress Critical Error Fix',
  seoTitle: 'WordPress Critical Error Fix Service | Expert Diagnosis',
  metaDescription: 'Fix “There has been a critical error on this website,” white screens, PHP fatal errors, plugin conflicts, and broken WordPress admin access.',
  eyebrow: 'WordPress fatal error recovery',
  headline: 'Fix the WordPress critical error without guessing which plugin to delete.',
  intro: 'I diagnose the PHP, plugin, theme, update, memory, or server failure behind the WordPress critical error and restore the site without blindly removing important functionality.',
  promise: 'A critical error is a generic symptom. The useful answer comes from the PHP error details, recent changes, recovery-mode email, logs, and a controlled isolation process.',
  symptomsTitle: 'Critical error symptoms I can diagnose',
  symptoms: ['“There has been a critical error on this website” message', 'Blank white screen on the frontend or wp-admin', 'WordPress recovery-mode email with a failed plugin or theme', 'Fatal PHP error after an update or migration', 'Admin works but the public site fails, or the reverse', 'Memory exhausted or maximum execution time messages', 'A page builder, checkout, or API request triggers the failure', 'The error returns whenever a specific feature is used'],
  includesTitle: 'What the critical-error repair covers',
  includesIntro: 'The failed request and its logs determine the repair path.',
  includes: [
    { title: 'PHP error diagnosis', description: 'Read the actual fatal error, stack context, affected file, PHP version, and triggering request.' },
    { title: 'Plugin conflict isolation', description: 'Identify the responsible plugin or interaction without leaving the website unnecessarily disabled.' },
    { title: 'Theme and custom-code review', description: 'Repair syntax, compatibility, hooks, missing functions, or outdated customizations where possible.' },
    { title: 'Update recovery', description: 'Resolve incomplete core, plugin, theme, or database updates and remove a stuck maintenance state.' },
    { title: 'Resource and server checks', description: 'Review memory, execution limits, extensions, file permissions, and hosting-level failures connected to the error.' },
    { title: 'Functional verification', description: 'Retest the affected page, wp-admin, forms, checkout, scheduled work, and other relevant flows.' },
  ],
  process: [
    { title: 'Capture the failure', description: 'Reproduce the exact request and collect the recovery email or server/PHP error details.' },
    { title: 'Isolate the cause', description: 'Separate plugin, theme, custom code, PHP, update, and hosting causes in a controlled way.' },
    { title: 'Repair safely', description: 'Apply the narrowest durable fix and preserve a rollback path before changing working code.' },
    { title: 'Retest the site', description: 'Verify the original symptom and the nearby business-critical functionality.' },
  ],
  outcomes: ['Fatal error source identified', 'Website access restored', 'Important functionality preserved', 'Affected flow retested', 'Cause and next step explained'],
  faqs: [
    { question: 'What causes the WordPress critical error?', answer: 'Common causes include plugin or theme conflicts, incompatible PHP versions, syntax errors, failed updates, missing functions or classes, exhausted memory, corrupted files, and custom code that fails on a specific request.' },
    { question: 'Can you fix the critical error if wp-admin is inaccessible?', answer: 'Yes. Hosting, file manager, SFTP, database, and server logs can be used to diagnose and repair the issue without WordPress admin access.' },
    { question: 'Will disabling the plugin permanently fix it?', answer: 'Disabling a plugin may restore access, but it does not always solve the business problem. The next step is to determine whether it should be updated, reconfigured, repaired, replaced, or made compatible with another component.' },
  ],
  related: [
    { label: 'All WordPress errors', href: '/wordpress-error-fixing/', description: 'Browse the complete error diagnosis hub.' },
    { label: 'HTTP 500 repair', href: '/wordpress-500-internal-server-error-fix/', description: 'Fix server errors without a visible PHP message.' },
    { label: 'WordPress maintenance', href: '/wordpress-maintenance/', description: 'Reduce preventable update and compatibility failures.' },
  ],
};

export const internalServerErrorService: ServicePageData = {
  slug: '/wordpress-500-internal-server-error-fix/',
  name: 'WordPress 500 Internal Server Error Fix',
  seoTitle: 'Fix WordPress 500 Internal Server Error | Expert Service',
  metaDescription: 'Diagnose and fix WordPress 500 Internal Server Errors caused by .htaccess, PHP, plugins, themes, memory, permissions, updates, or server configuration.',
  eyebrow: 'HTTP 500 diagnosis and repair',
  headline: 'Fix the WordPress 500 error by finding the server-side failure behind it.',
  intro: 'I diagnose Internal Server Errors across WordPress, PHP, .htaccess, plugins, themes, permissions, resource limits, and hosting configuration, then verify the request that originally failed.',
  promise: 'HTTP 500 only means the server could not complete the request. Logs and controlled testing are needed to separate a WordPress problem from PHP, web-server, permission, and hosting failures.',
  symptomsTitle: 'Where a WordPress 500 error can appear',
  symptoms: ['The entire website returns “500 Internal Server Error”', 'Only wp-admin or wp-login.php returns HTTP 500', 'Saving a page, form, menu, or settings triggers the error', 'Uploading media or importing content fails with status 500', 'WooCommerce checkout or an API callback fails', 'The error started after editing .htaccess or permalinks', 'A plugin or theme update caused the server error', 'The website fails intermittently under traffic or resource load'],
  includesTitle: 'Layers checked during a 500-error diagnosis',
  includesIntro: 'The investigation starts with the failing URL and follows the server evidence.',
  includes: [
    { title: 'Server and PHP logs', description: 'Identify fatal errors, permission failures, timeouts, resource exhaustion, and configuration problems.' },
    { title: '.htaccess and rewrite rules', description: 'Repair malformed directives, unsupported options, redirect loops, and conflicting security rules.' },
    { title: 'Plugins and themes', description: 'Isolate code that fails only on a particular admin, frontend, AJAX, REST, or checkout request.' },
    { title: 'PHP limits and compatibility', description: 'Review memory, execution time, extensions, handlers, and version compatibility.' },
    { title: 'Files and permissions', description: 'Check corrupted core files, missing dependencies, ownership, and file or directory permissions.' },
    { title: 'Request verification', description: 'Retest the exact URL or action and confirm the server returns a successful response.' },
  ],
  process: [
    { title: 'Identify the failing request', description: 'Determine whether the error affects every request or only an action, URL, user, or traffic condition.' },
    { title: 'Correlate the logs', description: 'Match the request time with web-server, PHP, WordPress, proxy, and hosting evidence.' },
    { title: 'Repair the failed layer', description: 'Correct the code, rule, permission, limit, file, or configuration causing the request to abort.' },
    { title: 'Verify response and function', description: 'Confirm the HTTP response and the user-facing workflow that depends on it.' },
  ],
  outcomes: ['Failing request identified', 'HTTP 500 cause repaired', 'Frontend and admin checked', 'Important actions retested', 'Recovery notes provided'],
  faqs: [
    { question: 'Is a WordPress 500 error always caused by a plugin?', answer: 'No. Plugins are common causes, but .htaccess rules, PHP compatibility, memory, permissions, corrupted files, web-server configuration, reverse proxies, and hosting resource limits can produce the same status.' },
    { question: 'Why does only wp-admin show a 500 error?', answer: 'Admin-only errors often involve an admin hook, plugin screen, PHP memory demand, security rule, AJAX request, or code that runs only for logged-in users.' },
    { question: 'Can the site be fixed without reinstalling WordPress?', answer: 'Usually, yes. Reinstalling does not fix configuration, database, plugin, theme, permission, or server causes and can make diagnosis harder if done before logs are checked.' },
  ],
  related: [
    { label: 'Critical error repair', href: '/wordpress-critical-error-fix-service/', description: 'Diagnose a visible WordPress fatal-error message.' },
    { label: 'All WordPress errors', href: '/wordpress-error-fixing/', description: 'Find related server and application failures.' },
    { label: 'WordPress maintenance', href: '/wordpress-maintenance/', description: 'Keep updates, backups, and compatibility under control.' },
  ],
};

export const fakeCaptchaService: ServicePageData = {
  slug: '/fake-captcha-malware-removal/',
  name: 'Fake CAPTCHA Malware Removal',
  seoTitle: 'Fake CAPTCHA Malware Removal | WordPress Cleanup Service',
  metaDescription: 'Remove fake CAPTCHA, fake Cloudflare verification, ClickFix scripts, redirects, and hidden WordPress reinfection mechanisms with a manual cleanup.',
  eyebrow: 'Fake verification and ClickFix cleanup',
  headline: 'Remove fake CAPTCHA malware—and the code that keeps bringing it back.',
  intro: 'I clean fake “I’m not a robot,” fake Cloudflare verification, and ClickFix-style malware from WordPress files, database content, injected scripts, plugins, and persistence mechanisms.',
  promise: 'The visible popup is only the delivery layer. Cleanup must also find where the script is injected, how it is restored, and whether visitors or search engines receive different content.',
  symptomsTitle: 'Common fake CAPTCHA infection symptoms',
  symptoms: ['Visitors see a fake Cloudflare or reCAPTCHA screen', 'The page asks users to press Windows+R or paste a command', 'Only some visitors, devices, or referrers see the popup', 'The browser redirects after clicking “Verify” or “Allow”', 'Unknown JavaScript is injected into every page', 'The infection disappears temporarily after clearing cache', 'Security scanners report social engineering or phishing', 'The script returns after a theme or database cleanup'],
  includesTitle: 'What fake CAPTCHA cleanup investigates',
  includesIntro: 'These campaigns commonly use layered injection and conditional display.',
  includes: [
    { title: 'Injected JavaScript', description: 'Trace encoded, remote, conditional, and dynamically created scripts in files and rendered pages.' },
    { title: 'Database payloads', description: 'Inspect options, widgets, page content, templates, and plugin records that can inject the overlay.' },
    { title: 'Theme and plugin files', description: 'Check modified templates, fake plugins, mu-plugins, loaders, and compromised third-party code.' },
    { title: 'Persistence mechanisms', description: 'Review scheduled tasks, admin users, backdoors, remote includes, and code that restores the injection.' },
    { title: 'Caching and edge layers', description: 'Purge and verify WordPress, server, CDN, and browser caches after the malicious source is removed.' },
    { title: 'Warning recovery', description: 'Confirm visible symptoms are gone before handling Safe Browsing or vendor review steps.' },
  ],
  process: [
    { title: 'Reproduce the conditional page', description: 'Test devices, referrers, logged-out sessions, and rendered source to capture the malicious behavior.' },
    { title: 'Trace the injection source', description: 'Follow the script back through files, database, plugin hooks, remote loaders, and persistence.' },
    { title: 'Remove and harden', description: 'Clean the full chain, close the access point where possible, and purge affected caches.' },
    { title: 'Retest and review warnings', description: 'Verify clean rendering before submitting any external security review.' },
  ],
  outcomes: ['Fake verification removed', 'Injection source traced', 'Persistence checked', 'Caches purged and verified', 'Review-ready website'],
  faqs: [
    { question: 'Is fake CAPTCHA malware dangerous to visitors?', answer: 'Yes. Some variants redirect users, request notification permission, steal credentials, or persuade Windows users to run malicious commands through ClickFix-style instructions.' },
    { question: 'Why can I not see the fake CAPTCHA myself?', answer: 'Campaigns often target only logged-out visitors, mobile users, search traffic, certain countries, first visits, or uncached sessions to avoid detection by the site owner.' },
    { question: 'Can a security plugin remove it completely?', answer: 'A plugin may identify a known script, but the injection can also live in database content, custom code, fake plugins, scheduled tasks, remote loaders, or another compromised site in the account.' },
  ],
  related: [
    { label: 'Malware removal', href: '/wordpress-malware-removal/', description: 'Full hacked WordPress investigation and cleanup.' },
    { label: 'Google blacklist recovery', href: '/google-blacklist-removal-service/', description: 'Clear deceptive-site warnings after cleanup.' },
    { label: 'Malware case studies', href: '/case-studies/', description: 'See first-hand recovery evidence.' },
  ],
};

export const japaneseSpamService: ServicePageData = {
  slug: '/remove-japanese-seo-spam/',
  name: 'Japanese SEO Spam Removal',
  seoTitle: 'Japanese Keyword Hack Removal | WordPress SEO Spam Cleanup',
  metaDescription: 'Remove Japanese keyword hack pages, casino or pharma SEO spam, cloaking, database injections, backdoors, and polluted Google results from WordPress.',
  eyebrow: 'Search-spam incident recovery',
  headline: 'Remove the Japanese keyword hack from WordPress and start cleaning the search damage.',
  intro: 'I remove the files, database injections, cloaked pages, backdoors, fake sitemaps, and persistence behind Japanese, casino, pharma, and other WordPress SEO spam attacks.',
  promise: 'Deleting spam URLs from Google does not remove the hack. The site must stop generating or serving the content first, then search recovery can begin with clean signals and accurate indexing.',
  symptomsTitle: 'Signs of a WordPress SEO spam infection',
  symptoms: ['Japanese titles and descriptions appear in Google', 'Thousands or millions of unfamiliar URLs are indexed', 'Casino, betting, pharmaceutical, or replica-product pages appear', 'Search visitors see different content or redirects', 'Unknown sitemaps or Search Console users appear', 'Spam pages return 200 while looking missing to the site owner', 'Google reports hacked content or unusual crawl growth', 'Deleted URLs return because a generator or backdoor remains'],
  includesTitle: 'What a search-spam cleanup covers',
  includesIntro: 'SEO spam can exist across WordPress, the database, server rules, and generated search responses.',
  includes: [
    { title: 'Spam generation source', description: 'Find templates, PHP loaders, database content, rewrite rules, and code generating large URL sets.' },
    { title: 'Cloaking and redirects', description: 'Test search referrers, user agents, devices, and conditional responses that hide the infection.' },
    { title: 'Backdoors and access', description: 'Remove the persistence responsible for regenerating spam after visible files are deleted.' },
    { title: 'Sitemaps and index signals', description: 'Remove malicious sitemaps and restore accurate canonical, robots, status, and sitemap behavior.' },
    { title: 'Search Console review', description: 'Check security issues, ownership, index symptoms, and the appropriate post-cleanup actions.' },
    { title: 'Deindexing strategy', description: 'Use correct 404/410 responses, sitemap cleanup, and selective removal tools without blocking recrawling blindly.' },
  ],
  process: [
    { title: 'Measure the infection', description: 'Identify spam patterns, indexed URL scale, cloaking behavior, malicious sitemaps, and affected site layers.' },
    { title: 'Stop content generation', description: 'Remove the injected code, database payload, routes, redirects, backdoors, and persistence.' },
    { title: 'Restore clean index signals', description: 'Return accurate status codes, canonicals, sitemaps, internal links, and clean rendered content.' },
    { title: 'Support search recovery', description: 'Handle security review needs and prioritize recrawl or removal actions based on the actual index state.' },
  ],
  outcomes: ['Spam generator removed', 'Backdoors and cloaking checked', 'Malicious sitemaps removed', 'Clean status signals restored', 'Search recovery plan provided'],
  faqs: [
    { question: 'How long does Japanese keyword hack recovery take?', answer: 'The malware cleanup may be completed quickly, but search engines need time to recrawl the site and remove old spam URLs. The index recovery period depends on the number of URLs, crawl rate, response codes, and how long the infection existed.' },
    { question: 'Should I block all spam URLs in robots.txt?', answer: 'Usually not as the first step. Blocking can prevent search engines from seeing that spam URLs now return 404 or 410, which may slow removal. The correct response depends on how the malicious URLs are generated.' },
    { question: 'Why do spam pages remain in Google after the site is clean?', answer: 'Google retains indexed URLs until they are recrawled and reprocessed. Cleanup stops the source; accurate status codes, clean sitemaps, removal tools where appropriate, and time complete the search recovery.' },
  ],
  related: [
    { label: 'Malware removal', href: '/wordpress-malware-removal/', description: 'Investigate the complete compromised site.' },
    { label: 'Google blacklist recovery', href: '/google-blacklist-removal-service/', description: 'Handle security warnings after cleanup.' },
    { label: 'SEO spam case studies', href: '/case-studies/', description: 'See large-scale search recovery work.' },
  ],
};

export const googleBlacklistService: ServicePageData = {
  slug: '/google-blacklist-removal-service/',
  name: 'Google Blacklist Removal',
  seoTitle: 'Google Blacklist Removal | Fix Deceptive Site Ahead Warning',
  metaDescription: 'Remove malware and resolve Google Safe Browsing warnings, hacked content, phishing, harmful downloads, and “Deceptive site ahead” security issues.',
  eyebrow: 'Google Safe Browsing recovery',
  headline: 'Clear the “Deceptive site ahead” warning the right way: cleanup first, review second.',
  intro: 'I investigate and clean the issue behind Google Safe Browsing and Search Console security warnings, verify the site, and prepare or submit the appropriate review after the harmful behavior is gone.',
  promise: 'Google review is not a substitute for cleanup. A successful recovery needs the hacked content, deceptive page, redirect, malware, or harmful download removed before a review is requested.',
  symptomsTitle: 'Google security warnings this service covers',
  symptoms: ['“Deceptive site ahead” red warning page', '“This site may harm your computer” in search results', 'Search Console reports hacked content', 'Search Console reports social engineering or phishing', 'Google reports malware or harmful downloads', 'Chrome blocks the website or a download', 'Google Ads reports a compromised site after an infection', 'The warning remains after a previous cleanup attempt'],
  includesTitle: 'Google blacklist recovery scope',
  includesIntro: 'The security issue type determines what must be cleaned and what evidence Google needs to re-evaluate.',
  includes: [
    { title: 'Security issue verification', description: 'Confirm Search Console examples, Safe Browsing status, affected URLs, rendered behavior, and warning type.' },
    { title: 'Malware and phishing cleanup', description: 'Remove malicious files, deceptive pages, redirects, injected scripts, downloads, and database content.' },
    { title: 'Backdoor investigation', description: 'Check how the harmful content was placed and what could restore it after review.' },
    { title: 'External response testing', description: 'Verify clean behavior for logged-out visitors, search referrers, devices, and affected URLs.' },
    { title: 'Search Console review', description: 'Document the cleanup accurately and request a security review from the verified property.' },
    { title: 'Post-review monitoring', description: 'Track the warning, examples, site behavior, and related vendor classifications after submission.' },
  ],
  process: [
    { title: 'Confirm Google’s finding', description: 'Identify the exact security issue category and capture the affected examples.' },
    { title: 'Clean the website', description: 'Remove the harmful behavior and the access or persistence that enabled it.' },
    { title: 'Verify from outside', description: 'Retest affected pages and conditions so the site is genuinely review-ready.' },
    { title: 'Request and monitor review', description: 'Submit a concise, truthful review request and monitor the result.' },
  ],
  outcomes: ['Google issue type confirmed', 'Harmful content removed', 'Reinfection paths checked', 'Review-ready site verified', 'Search Console review supported'],
  faqs: [
    { question: 'How long does Google blacklist removal take?', answer: 'Cleanup timing depends on the infection. After a valid review request, Google states that security reviews can take from a few days to a few weeks, and warning updates can take additional time to propagate.' },
    { question: 'Can you remove the warning without Search Console?', answer: 'The website can be cleaned without Search Console, but a verified Search Console property is normally the correct place to inspect examples and request review for Google security issues.' },
    { question: 'Why did Google reject the review?', answer: 'Common reasons include remaining malicious behavior, a hidden conditional page, another compromised site or subdomain, an inaccurate explanation, or requesting review before all affected URLs and persistence were checked.' },
  ],
  related: [
    { label: 'Blacklist removal hub', href: '/blacklist-removal/', description: 'Check other browser and antivirus vendors.' },
    { label: 'Malware removal', href: '/wordpress-malware-removal/', description: 'Clean the hacked WordPress website first.' },
    { label: 'Fake CAPTCHA cleanup', href: '/fake-captcha-malware-removal/', description: 'Remove common social-engineering infections.' },
  ],
};

export const mcafeeBlacklistService: ServicePageData = {
  slug: '/mcafee-blacklist-removal/',
  name: 'McAfee Blacklist Removal',
  seoTitle: 'McAfee Blacklist Removal | WebAdvisor Warning Recovery',
  metaDescription: 'Diagnose and resolve McAfee WebAdvisor website warnings after malware cleanup, with reputation verification, evidence, review, and follow-up support.',
  eyebrow: 'McAfee WebAdvisor reputation recovery',
  headline: 'Resolve a McAfee website warning with a clean site and a credible review case.',
  intro: 'I investigate why McAfee WebAdvisor is blocking or warning about a website, clean any underlying compromise, verify the domain externally, and support the vendor review or dispute process.',
  promise: 'McAfee owns the final rating. My role is to make the website review-ready, document the evidence, use the appropriate channel, and follow the classification until it changes or McAfee provides new findings.',
  symptomsTitle: 'McAfee reputation symptoms',
  symptoms: ['McAfee WebAdvisor labels the site risky or dangerous', 'Visitors see a red McAfee warning or blocked page', 'The warning remains after Google Safe Browsing is clear', 'McAfee reports phishing, malware, or suspicious behavior', 'A recently cleaned domain still has an old reputation', 'Only users with McAfee products report the problem', 'The domain was previously parked, expired, or compromised', 'A review was submitted but the classification did not change'],
  includesTitle: 'McAfee warning recovery scope',
  includesIntro: 'The work separates a current security problem from a stale, inherited, or disputed reputation classification.',
  includes: [
    { title: 'Classification verification', description: 'Confirm the exact domain, URL, category, warning, and current WebAdvisor behavior.' },
    { title: 'Security investigation', description: 'Check malware, redirects, phishing content, downloads, subdomains, and visible external behavior.' },
    { title: 'Website cleanup', description: 'Remove current malicious content and persistence before any claim that the domain is clean.' },
    { title: 'Cross-vendor evidence', description: 'Collect relevant clean results and ownership evidence without treating third-party scans as proof by themselves.' },
    { title: 'Review or dispute support', description: 'Use the relevant McAfee/TrustedSource process and provide a concise evidence-based request.' },
    { title: 'Status follow-up', description: 'Monitor classification changes and respond if the vendor supplies additional findings.' },
  ],
  process: [
    { title: 'Confirm the McAfee warning', description: 'Capture the current classification and the products or URLs where it appears.' },
    { title: 'Investigate and clean', description: 'Resolve any present compromise, unsafe behavior, or suspicious domain configuration.' },
    { title: 'Prepare evidence', description: 'Verify ownership, clean behavior, relevant scan results, and the remediation completed.' },
    { title: 'Submit and follow up', description: 'Use the proper review route and track the classification response.' },
  ],
  outcomes: ['McAfee rating confirmed', 'Website security checked', 'Current threats removed', 'Evidence prepared', 'Review and follow-up supported'],
  faqs: [
    { question: 'Why does McAfee block my site when Google does not?', answer: 'McAfee and Google use different reputation data, products, update schedules, and classifications. A clean result from one provider does not automatically update another.' },
    { question: 'Can you guarantee McAfee will change the rating?', answer: 'No. The vendor controls its classification. I can ensure the site is investigated, cleaned where necessary, documented accurately, and submitted through the correct review process.' },
    { question: 'Can an old domain history cause a McAfee warning?', answer: 'Yes. Previous compromise, expired-domain use, parked content, phishing history, unsafe subdomains, or stale reputation data can contribute even when the current website is new.' },
  ],
  related: [
    { label: 'Blacklist removal hub', href: '/blacklist-removal/', description: 'Review other reputation vendors.' },
    { label: 'Google blacklist recovery', href: '/google-blacklist-removal-service/', description: 'Resolve Safe Browsing security issues.' },
    { label: 'Malware removal', href: '/wordpress-malware-removal/', description: 'Clean a compromised WordPress site.' },
  ],
};

export const avastBlacklistService: ServicePageData = {
  slug: '/avast-blacklist-removal/',
  name: 'Avast Blacklist Removal',
  seoTitle: 'Avast Blacklist Removal | Fix Website URL Warning',
  metaDescription: 'Resolve Avast or AVG website threat warnings after security cleanup with URL verification, malware investigation, false-positive review, and follow-up support.',
  eyebrow: 'Avast and AVG URL warning recovery',
  headline: 'Fix an Avast website warning by separating a real infection from a false positive.',
  intro: 'I verify the Avast or AVG alert, investigate the website and affected URLs, clean any real security issue, and prepare the site for the appropriate false-positive or reputation review.',
  promise: 'A review should only claim false detection after the site, redirects, downloads, DNS, subdomains, and externally rendered behavior have been checked carefully.',
  symptomsTitle: 'Avast and AVG warning symptoms',
  symptoms: ['Avast Web Shield blocks the domain or a page', 'AVG reports a URL, phishing, or malware threat', 'Only visitors using Avast or AVG see the warning', 'The domain is blocked after a previous infection was cleaned', 'A download or script triggers the alert', 'The warning is limited to one subdomain or URL path', 'Other vendors show clean results but Avast does not', 'A false-positive request was submitted without a change'],
  includesTitle: 'Avast warning recovery scope',
  includesIntro: 'The detection name and affected URL help determine whether the problem is active content, reputation, or a likely false positive.',
  includes: [
    { title: 'Alert capture', description: 'Confirm the exact Avast or AVG product, detection name, URL, and behavior.' },
    { title: 'External website testing', description: 'Check redirects, scripts, downloads, frames, DNS, SSL, subdomains, and conditional content.' },
    { title: 'Malware investigation', description: 'Inspect WordPress files, database, users, plugins, server rules, and persistence if compromise is suspected.' },
    { title: 'Cleanup and verification', description: 'Remove threats and retest the affected URL before contacting the vendor.' },
    { title: 'False-positive submission', description: 'Prepare an accurate report with the useful technical context and ownership details.' },
    { title: 'Follow-up monitoring', description: 'Recheck the affected product and investigate any new detection details.' },
  ],
  process: [
    { title: 'Record the detection', description: 'Capture the product, URL, threat name, time, and whether the block is repeatable.' },
    { title: 'Inspect the affected website', description: 'Determine whether the warning reflects current malware, unsafe content, or likely reputation residue.' },
    { title: 'Clean or validate', description: 'Remove confirmed threats or assemble the evidence supporting a false-positive report.' },
    { title: 'Submit and retest', description: 'Use the appropriate Avast process and verify the warning after the vendor updates.' },
  ],
  outcomes: ['Exact Avast warning captured', 'Affected URL investigated', 'Confirmed threats removed', 'False-positive evidence prepared', 'Vendor status monitored'],
  faqs: [
    { question: 'Is Avast website blocking the same as Google blacklisting?', answer: 'No. Avast and AVG use their own web-protection and reputation systems. The site may be clear in Google Safe Browsing while a separate Avast classification remains.' },
    { question: 'What information is useful for an Avast false-positive report?', answer: 'The exact URL, detection name, Avast product and version, time of detection, ownership context, cleanup details, and reproducible evidence are more useful than a generic request to unblock the domain.' },
    { question: 'Does reinstalling SSL remove the Avast warning?', answer: 'Usually not. SSL proves encrypted transport; it does not prove that the website, scripts, downloads, or destination URLs are safe.' },
  ],
  related: [
    { label: 'Blacklist removal hub', href: '/blacklist-removal/', description: 'Check other browser and antivirus vendors.' },
    { label: 'McAfee warning recovery', href: '/mcafee-blacklist-removal/', description: 'Resolve WebAdvisor reputation issues.' },
    { label: 'Malware removal', href: '/wordpress-malware-removal/', description: 'Clean a compromised WordPress site.' },
  ],
};
