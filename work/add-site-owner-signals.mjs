import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src/content/wordpress-threats");

const signals = {
  "admin-backdoor-user-creation.md": {
    groups: ["hidden-users", "login-credential-risk"],
    searchDescription:
      "WordPress user count does not match the visible accounts? Review code evidence showing a functions.php backdoor that creates and hides one administrator.",
    summary:
      "This entry is relevant when the WordPress Users screen shows fewer accounts than its count, or an unfamiliar administrator cannot be accounted for. The retained code targeted one stored user ID and altered normal user-list behavior.",
    observed: [
      "The supplied functions.php code created or updated an administrator account, stored its user ID, and filtered that account from normal user queries.",
    ],
    possible: [
      "The Users screen can show a count that does not match the accounts visible in the list.",
      "An unauthorized administrator can remain usable while being concealed from routine review.",
    ],
    questions: [
      "Why does my WordPress user count not match the visible users?",
      "Can theme code hide an administrator account from the Users screen?",
    ],
    note: "A count mismatch is a reason to investigate; it is not proof of a hidden administrator by itself.",
  },
  "cookie-based-php-execution-malware.md": {
    groups: ["suspicious-files-code"],
    searchDescription:
      "Found PHP code inside an .htaccess-named file in WordPress? This research explains a cookie-indexed loader observed in an anonymized plugin directory.",
    summary:
      "This entry helps owners and responders assess an unusually small PHP file named like .htaccess inside a plugin directory. The artifact selected cookie data and passed it to an include operation, but no visible front-end symptom was retained.",
    observed: [
      "A 308-byte PHP program was retained from an .htaccess-named file inside a WordPress plugin directory.",
    ],
    possible: [
      "The website may show no obvious visible change while the file remains present.",
      "A malware scanner or file review may report unexpected PHP code in a file normally used for server directives.",
    ],
    questions: [
      "Why is there PHP code inside an .htaccess file?",
      "Can a WordPress backdoor exist without changing the visible website?",
    ],
    note: "The supplied artifact shows a loader structure; it does not establish what input was supplied or whether it executed.",
  },
  "drive-by-script-injection.md": {
    groups: ["redirects-popups", "access-errors-warnings"],
    searchDescription:
      "WordPress visitors report redirects, pop-ups, or browser warnings? See evidence of an injected external script whose remote behavior was not retained.",
    summary:
      "This research is useful when a page contains an unfamiliar third-party script and visitors report unexpected browser behavior. The retained evidence confirms the script reference, while the response served by that external host was not captured.",
    observed: [
      "An analyst notice and retained markup identified an external JavaScript reference on the investigated site.",
    ],
    possible: [
      "Visitors may report redirects, pop-ups, or security warnings if the remote script serves harmful behavior.",
      "The page may appear normal when the external host is inactive or responds differently.",
    ],
    questions: [
      "Why does my WordPress site load JavaScript from an unfamiliar domain?",
      "Could an injected script explain intermittent redirects or browser warnings?",
    ],
    note: "The external response was not retained, so the exact visitor-side behavior cannot be confirmed from this evidence alone.",
  },
  "fake-plugin-advanced-linkflow-control.md": {
    groups: ["unknown-plugins", "redirects-popups"],
    searchDescription:
      "Found an Advanced LinkFlow Control folder that is missing from WordPress Plugins? Review evidence of plugin-list concealment and remote code loading.",
    summary:
      "This entry is relevant when hosting files contain an unfamiliar plugin directory that does not appear normally in wp-admin. The supplied code used plugin-list filters and a remote response path; the remote response itself was not retained.",
    observed: [
      "The investigated filesystem contained an Advanced LinkFlow Control plugin directory with code that filtered plugin-list data.",
    ],
    possible: [
      "The plugin folder can be visible in hosting tools while the plugin is absent from the normal Plugins screen.",
      "Visitor-facing behavior may change if the remote response path is active, although that response was not captured.",
    ],
    questions: [
      "Why is a plugin folder present on the server but missing from WordPress?",
      "Is Advanced LinkFlow Control a legitimate plugin on my site?",
    ],
    note: "A missing plugin-list row is not proof by itself; compare the filesystem, active plugin data, and supplied code.",
  },
  "fetch-based-url-injection.md": {
    groups: [
      "spam-unwanted-content",
      "redirects-popups",
      "access-errors-warnings",
    ],
    searchDescription:
      "Seeing hidden spam links, unfamiliar keywords, or redirect warnings on WordPress? This case traces a remote footer-content loader and its returned markup.",
    summary:
      "This investigation connects a WordPress footer hook to remotely supplied markup containing concealed outbound links. It is most relevant when owners see unfamiliar search-result keywords, hidden links, or a security service reporting a redirect from a page.",
    observed: [
      "The retained response contained hidden outbound link markup, and a separate investigation screenshot showed a redirect warning for the affected page.",
    ],
    possible: [
      "Search results or page-source reviews may expose spam keywords that are not obvious in the visible design.",
      "Visitors or scanners may encounter a redirect while the site owner sees a different or normal-looking page.",
    ],
    questions: [
      "Why are hidden spam links appearing in my WordPress footer?",
      "What can cause a redirect warning when my page looks normal?",
    ],
    note: "The retained artifacts support remote footer injection; they do not identify the original compromise method.",
  },
  "goto-obfuscated-dropper.md": {
    groups: ["suspicious-files-code"],
    searchDescription:
      "Found goto-heavy obfuscated PHP in a WordPress index.php file? This analysis documents the loader structure without publishing an operational payload.",
    summary:
      "This entry is intended for an owner whose host, developer, or security scanner found heavily obfuscated PHP in an unexpected index.php file. The code structure is documented, but the evidence does not establish a visitor-facing symptom.",
    observed: [
      "The supplied index.php artifact used goto-driven control flow and concealed strings inconsistent with a normal directory placeholder.",
    ],
    possible: [
      "The website can continue to look normal while the suspicious file remains on disk.",
      "File-integrity or malware scans may repeatedly flag the index.php artifact.",
    ],
    questions: [
      "Why is my WordPress index.php full of goto statements and unreadable strings?",
      "Can an obfuscated PHP loader exist without an obvious site symptom?",
    ],
    note: "Obfuscation raises concern but does not, by itself, reveal how the file arrived or what every hidden payload did.",
  },
  "header-based-backdoor-injection.md": {
    groups: ["suspicious-files-code"],
    searchDescription:
      "Found PHP that reads an unusual HTTP header in a WordPress plugin file? Review this request-gated loader and the limits of the retained evidence.",
    summary:
      "This research helps evaluate a short injected PHP block that selected an HTTP header before passing derived data into a loader path. It may leave the public site looking normal until a matching request is made.",
    observed: [
      "The supplied plugin-file code inspected an HTTP request header and used the resulting value in a concealed loading sequence.",
    ],
    possible: [
      "Normal visitors may see no visible symptom because the suspicious branch depends on request data.",
      "A scanner or manual code review may be the first sign of the modification.",
    ],
    questions: [
      "Why is a WordPress plugin reading an unfamiliar HTTP header?",
      "Could request-gated PHP malware remain invisible during normal browsing?",
    ],
    note: "The code shows a request gate, but the retained evidence does not include a triggering request or execution trace.",
  },
  "hello-aili-plugin-spam-injector.md": {
    groups: [
      "unknown-plugins",
      "spam-unwanted-content",
      "suspicious-files-code",
    ],
    searchDescription:
      "Found a Hello Aili plugin or unfamiliar code beside Hello Dolly? This entry examines a remote PHP loader observed in a WordPress plugin file.",
    summary:
      "This entry is relevant when an owner finds a Hello Aili plugin they did not install, or a familiar-looking plugin file contains remote loading code. The retained artifact fetched and evaluated a response, but that response was not preserved.",
    observed: [
      "The supplied plugin file identified itself as Hello Aili and contained a remote-response evaluation path.",
    ],
    possible: [
      "An unfamiliar plugin may appear among otherwise legitimate WordPress plugins.",
      "The website may show no stable symptom because the missing remote response determined the next behavior.",
    ],
    questions: [
      "What is the Hello Aili plugin in my WordPress installation?",
      "Why does a plugin file fetch and evaluate remote PHP?",
    ],
    note: "The loader is confirmed; the evidence does not establish the content or effect of the remote response.",
  },
  "hidden-casino-content-injection.md": {
    groups: ["spam-unwanted-content", "hidden-users"],
    searchDescription:
      "Casino or foreign-language posts appeared on WordPress but are missing from the Posts screen? See evidence of hidden post IDs and altered admin counts.",
    summary:
      "This investigation is relevant when spam posts are publicly reachable or appear in search results but cannot be found normally in wp-admin. A must-use plugin filtered selected post IDs and adjusted administrative post counts.",
    observed: [
      "The investigation retained a public casino-themed post and code that excluded selected post IDs from administrative queries and counts.",
    ],
    possible: [
      "Spam posts can be visible publicly or in search results while missing from the normal Posts list.",
      "The post count shown in wp-admin may not match the rows an administrator can see.",
    ],
    questions: [
      "Why are casino posts on my WordPress site but not in the Posts screen?",
      "Can a must-use plugin hide spam posts from WordPress administrators?",
    ],
    note: "The retained code supports administrative concealment; it does not identify how the spam records were first created.",
  },
  "hidden-plugin-backdoor.md": {
    groups: ["unknown-plugins", "suspicious-files-code"],
    searchDescription:
      "Found an unfamiliar plugin folder with encoded PHP but no matching wp-admin entry? Review the retained wrapper and safe investigation checks.",
    summary:
      "This entry helps owners assess a plugin directory discovered through hosting or file-manager access when the code is encoded or absent from routine plugin review. The available wrapper is suspicious, but its decoded payload was not retained.",
    observed: [
      "The investigation found an unfamiliar plugin directory containing an encoded PHP wrapper.",
    ],
    possible: [
      "The folder may be visible on disk even when its purpose is unclear from the Plugins screen.",
      "A security scanner may flag the encoded file while the public website continues to load normally.",
    ],
    questions: [
      "Why is there an unknown encoded plugin folder in wp-content/plugins?",
      "How should I investigate an encoded PHP plugin without running it?",
    ],
    note: "The wrapper and location are confirmed; behavior hidden inside the unavailable decoded payload is not.",
  },
  "hidden-wordpress-plugin-wp-security-helper.md": {
    groups: ["unknown-plugins", "hidden-users"],
    searchDescription:
      "Is WP Security Helper missing from the Plugins screen or changing user visibility? This entry documents plugin and user-query concealment hooks.",
    summary:
      "This research is relevant when a WP Security Helper directory exists on the server but routine wp-admin views do not account for it, or user listings appear incomplete. The code altered both plugin-list and user-query behavior.",
    observed: [
      "The supplied plugin code filtered plugin metadata and changed user-query behavior inside WordPress administration.",
    ],
    possible: [
      "The plugin may be absent from the normal Plugins screen despite existing on disk.",
      "An administrator may see an incomplete or selectively altered user list.",
    ],
    questions: [
      "Why is WP Security Helper present in hosting files but missing from WordPress?",
      "Can one plugin hide both itself and selected users from wp-admin?",
    ],
    note: "Unexpected list behavior warrants investigation, but comparison with filesystem and database evidence is still required.",
  },
  "htaccess-injection-fake-index-php-dropper.md": {
    groups: ["access-errors-warnings", "suspicious-files-code"],
    searchDescription:
      "WordPress PHP pages return 403 errors after unfamiliar .htaccess changes? Review an allowlist rule paired with an unexpected about.php artifact.",
    summary:
      "This entry is useful when most PHP files become inaccessible or return 403 responses while a small allowlist remains reachable. The investigation found restrictive .htaccess rules beside an unexpected about.php file, but no server log was retained.",
    observed: [
      "The retained .htaccess rules denied general PHP access while allowing named files, and an unexpected about.php artifact was present nearby.",
    ],
    possible: [
      "Visitors or administrators may encounter 403 errors on PHP endpoints not included in the allowlist.",
      "Selected PHP files may remain reachable while neighboring files are blocked.",
    ],
    questions: [
      "Why did WordPress start returning 403 errors after an .htaccess change?",
      "Why does .htaccess allow only a few unfamiliar PHP filenames?",
    ],
    note: "The rules can produce access denial, but the investigation did not retain a request log tying a particular error page to this file.",
  },
  "infected-functions-php-stealing-logins-fake-plugin.md": {
    groups: ["unknown-plugins", "recurring-malware", "suspicious-files-code"],
    searchDescription:
      "An unknown wp-perf-analytics plugin keeps appearing on WordPress? See functions.php code that deployed the plugin and removed its own installer block.",
    summary:
      "This research is relevant when an unfamiliar wp-perf-analytics plugin appears and the obvious installer code is hard to find afterward. The supplied theme code wrote the plugin and then removed the marked deployment block from functions.php.",
    observed: [
      "The supplied functions.php block decoded and wrote a wp-perf-analytics plugin before removing its marked installer section.",
    ],
    possible: [
      "The unfamiliar plugin can appear even when no administrator remembers installing it.",
      "A later theme-file review may miss the original deployment block because the code attempted to remove itself.",
    ],
    questions: [
      "Why did a wp-perf-analytics plugin appear without being installed?",
      "Can infected functions.php code deploy a plugin and then erase its installer?",
    ],
    note: "The deployment path is present in the supplied code; the initial source of the functions.php modification is unknown.",
  },
  "japanese-seo-spam-injection-php.md": {
    groups: ["spam-unwanted-content", "suspicious-files-code"],
    searchDescription:
      "Japanese or other unfamiliar search terms appear for a WordPress site? Review a small PHP loader observed in a plugin file and its evidence limits.",
    summary:
      "This page supports investigation of unfamiliar search-result language or spam alongside a suspicious PHP modification in a plugin file. The retained code shows a compact loading path, but it does not preserve the loaded content or prove the search symptom by itself.",
    observed: [
      "The supplied plugin-file artifact contained a compact PHP loader using an unexpected text-processing callback.",
    ],
    possible: [
      "Search results may show unfamiliar language or spam if a related payload generated indexable content.",
      "The public site may look normal while the suspicious file is only found through code review.",
    ],
    questions: [
      "Why does Google show unfamiliar language for my WordPress pages?",
      "Is unexpected esc_html-related PHP in a plugin file evidence of a loader?",
    ],
    note: "The artifact is confirmed, but the retained evidence does not directly connect it to a particular search-result change.",
  },
  "javascript-credit-card-stealer.md": {
    groups: ["login-credential-risk", "suspicious-files-code"],
    searchDescription:
      "Found heavily obfuscated JavaScript that changes behavior by hostname? This evidence review explains what is visible and why theft is not proven.",
    summary:
      "This entry is relevant when a checkout or site audit uncovers hostname-dependent, obfuscated JavaScript. The code structure warrants investigation, but the supplied fragment does not show collection or transmission of payment-card data.",
    observed: [
      "The supplied JavaScript used obfuscated strings and hostname-dependent branching.",
    ],
    possible: [
      "The script may behave differently across domains or environments.",
      "The page can appear normal while the obfuscated branch remains difficult to review.",
    ],
    questions: [
      "Why does this obfuscated JavaScript check my website hostname?",
      "Does suspicious checkout JavaScript prove that card details were stolen?",
    ],
    note: "The evidence does not establish card-data collection, exfiltration, or a completed checkout skimmer workflow.",
  },
  "javascript-fetch-based-spam-injection.md": {
    groups: ["spam-unwanted-content", "suspicious-files-code"],
    searchDescription:
      "Unexpected content appears inside WordPress pages from database scripts? See a stored fetch-based injection that inserted remote responses into page elements.",
    summary:
      "This entry is relevant when unexpected blocks, links, or spam appear in rendered pages and the source is not found in theme files. The retained database script made remote requests and inserted returned text into selected page elements.",
    observed: [
      "A retained database record contained JavaScript with three fetch requests and DOM insertion targets.",
    ],
    possible: [
      "Visitors may see unexpected remote content inside otherwise legitimate page sections.",
      "The symptom may change or disappear when the remote endpoints stop responding.",
    ],
    questions: [
      "Why is remote content appearing on WordPress pages from a database record?",
      "Can injected JavaScript use fetch to place spam inside existing page elements?",
    ],
    note: "The insertion mechanism is confirmed; the remote responses were not retained, so their exact content is unknown.",
  },
  "javascript-obfuscation-ajax-malfunction.md": {
    groups: ["redirects-popups", "suspicious-files-code"],
    searchDescription:
      "WordPress clicks open an unfamiliar tab or redirect unexpectedly? Review injected JavaScript that attached a click handler to page interactions.",
    summary:
      "This research is useful when visitors report that clicking the site opens an unrelated page or new window. The supplied code attached a document-level click listener and constructed an external destination, although no browser trace was retained.",
    observed: [
      "The supplied JavaScript registered a broad click listener and attempted to open an external destination.",
    ],
    possible: [
      "A visitor click may open a new tab or unexpected page.",
      "The behavior may appear intermittent if browser controls block the new window or the destination changes.",
    ],
    questions: [
      "Why does clicking anywhere on my WordPress site open another page?",
      "Can injected JavaScript cause intermittent pop-ups without changing the page design?",
    ],
    note: "The code is consistent with click-triggered navigation, but the investigation did not retain a browser execution trace.",
  },
  "javascript-redirection-injection.md": {
    groups: ["redirects-popups", "suspicious-files-code"],
    searchDescription:
      "Found an unfamiliar external script in a WordPress database record? This entry examines a wpinfo-style injection linked to redirect concerns.",
    summary:
      "This entry is relevant when owners see intermittent redirects or discover an external script stored in page or database content. The retained record confirms the injected script reference; it does not preserve what the external server returned.",
    observed: [
      "The investigation retained a database-stored script reference to an unfamiliar external host.",
    ],
    possible: [
      "Visitors may encounter redirects or other changing browser behavior if the external script supplies it.",
      "The page may look normal when the external host is unavailable or responds selectively.",
    ],
    questions: [
      "Why is an unfamiliar script stored in my WordPress database?",
      "Could a database-injected script explain redirects that do not happen every time?",
    ],
    note: "The external script reference is confirmed; its response and resulting runtime behavior were not retained.",
  },
  "malicious-php-code-injection-wordpress.md": {
    groups: ["recurring-malware", "suspicious-files-code"],
    searchDescription:
      "Unknown wk-style directories appear in several WordPress locations? Review evidence of repeated suspicious folders and a hexadecimal loader artifact.",
    summary:
      "This research helps an owner investigate repeated unfamiliar directories found across a WordPress installation. The retained evidence shows the locations and a hexadecimal loading structure, but it does not establish a complete persistence chain.",
    observed: [
      "Similarly named suspicious directories were retained from several WordPress locations, together with a hexadecimal PHP loader artifact.",
    ],
    possible: [
      "Security scans may report related files in more than one directory.",
      "Removing only one copy may leave another related artifact available, although automatic restoration was not demonstrated.",
    ],
    questions: [
      "Why do similar unknown directories appear in several WordPress folders?",
      "Does finding repeated malware files prove that the site has an automatic reinfection mechanism?",
    ],
    note: "Multiple artifacts were observed in one investigation, but automatic copying and their direct operational relationship were not confirmed.",
  },
  "malicious-php-script-detected-index-php.md": {
    groups: ["suspicious-files-code"],
    searchDescription:
      "A scanner found PrivDayz or unexpected PHP in a random WordPress index.php path? Review the retained filename, location, and safe evidence limits.",
    summary:
      "This page is for owners who receive a malware alert for an unfamiliar index.php in a randomly named directory. The location and PrivDayz identifier are useful investigation leads, but the retained evidence does not prove that the file executed.",
    observed: [
      "The investigation retained an index.php artifact with a PrivDayz identifier inside an unexpected directory.",
    ],
    possible: [
      "A scanner or file-integrity check may be the only visible sign.",
      "The public website may continue to operate normally while the artifact remains on disk.",
    ],
    questions: [
      "What is a PrivDayz file found in my WordPress hosting account?",
      "Why is there an index.php inside a randomly named directory?",
    ],
    note: "The file and identifier are confirmed; execution, access, and any subsequent action were not demonstrated.",
  },
  "malicious-redirect-hidden-plugin.md": {
    groups: ["unknown-plugins", "redirects-popups"],
    searchDescription:
      "A woocommerce_inputs folder exists but is missing from WordPress Plugins? See concealment filters and conditional redirect code from one investigation.",
    summary:
      "This entry is relevant when an unfamiliar woocommerce_inputs directory appears in hosting files, the plugin is absent from wp-admin, or redirects seem conditional. The code filtered plugin views and contained a redirect branch.",
    observed: [
      "The supplied plugin code filtered its plugin-list presence and included conditional redirect logic.",
    ],
    possible: [
      "The folder can exist on disk while the plugin is hidden from the standard Plugins screen.",
      "Some requests may be redirected while routine administrator browsing appears normal.",
    ],
    questions: [
      "Why is woocommerce_inputs on my server but missing from the Plugins screen?",
      "Can a hidden WordPress plugin redirect only selected visitors?",
    ],
    note: "The concealment and redirect structures are present in code; no complete request log was retained.",
  },
  "malicious-redirection-posts-injection.md": {
    groups: ["redirects-popups", "spam-unwanted-content"],
    searchDescription:
      "A WordPress post redirects immediately when opened? See database evidence of a zero-delay meta refresh paired with JavaScript navigation.",
    summary:
      "This investigation is directly relevant when opening a particular post or page immediately sends visitors elsewhere. The retained database content contained both a zero-delay meta refresh and JavaScript navigation to the same destination.",
    observed: [
      "The affected post_content record contained two immediate navigation mechanisms pointing to the same external destination.",
    ],
    possible: [
      "Opening the affected content can send a visitor away before the legitimate page is readable.",
      "The redirect may remain after theme files are replaced because the markup is stored in the database.",
    ],
    questions: [
      "Why does one WordPress post redirect immediately to another website?",
      "Can a malicious redirect be stored in post_content instead of theme files?",
    ],
    note: "The stored redirect is confirmed; the evidence does not establish who inserted it or how access was obtained.",
  },
  "malicious-wordpress-core-plugin.md": {
    groups: ["unknown-plugins", "suspicious-files-code"],
    searchDescription:
      "Found a WordPressCore plugin that fetches and evaluates remote PHP? Review the loader evidence and why the name does not make it a core component.",
    summary:
      "This entry helps owners investigate a plugin named WordPressCore that may be mistaken for a legitimate platform component. The retained files contained a remote PHP loading path; the response and resulting behavior were not preserved.",
    observed: [
      "The supplied WordPressCore plugin files contained code that retrieved and evaluated a remote response.",
    ],
    possible: [
      "The plugin name may make the directory look like a normal WordPress component during a quick review.",
      "The site may show no consistent symptom because the absent remote response controlled further behavior.",
    ],
    questions: [
      "Is WordPressCore a legitimate WordPress core plugin?",
      "Why would a plugin fetch and evaluate PHP from another server?",
    ],
    note: "The loader is confirmed, but the remote payload, initial access path, and runtime result are not available.",
  },
  "malware-analysis-statemesh-wordpress.md": {
    groups: ["unknown-plugins", "recurring-malware"],
    searchDescription:
      "A StateMesh plugin is hidden or returns after deletion? This research documents plugin-list concealment and self-copy behavior in supplied PHP code.",
    summary:
      "This page is relevant when an unfamiliar StateMesh plugin is found on disk, does not appear normally in wp-admin, or seems to return after incomplete removal. The supplied code included both concealment filters and self-copy logic.",
    observed: [
      "The supplied StateMesh code filtered plugin-list data and attempted to copy itself to another plugin location.",
    ],
    possible: [
      "The plugin can be absent from the normal Plugins screen while its files remain on disk.",
      "Deleting only one copy may not be sufficient if the alternate copy path has already been populated.",
    ],
    questions: [
      "Why is StateMesh missing from my WordPress Plugins screen?",
      "How can an unknown plugin return after I delete one copy?",
    ],
    note: "The self-copy logic is visible in code; the retained evidence does not prove how many copies executed on the site.",
  },
  "obfuscated-javascript-malware-theme-plugins.md": {
    groups: ["redirects-popups", "recurring-malware", "suspicious-files-code"],
    searchDescription:
      "The same obfuscated JavaScript appears in many WordPress files? Review a 17-file injection pattern and its possible click-driven browser effects.",
    summary:
      "This entry is relevant when a scanner or developer finds the same unreadable JavaScript across themes and plugins. The investigation retained the repeated marker in 17 files; visitor-side execution was not captured.",
    observed: [
      "A distinctive _0x3023-style JavaScript structure was retained from 17 WordPress files in one investigation.",
    ],
    possible: [
      "Visitors may report intermittent new tabs, pop-ups, or redirects if the injected event handlers execute.",
      "Cleaning only one file may leave the same injected block in other themes or plugins.",
    ],
    questions: [
      "Why is the same obfuscated JavaScript in many WordPress files?",
      "Could a repeated script injection explain intermittent redirects or pop-ups?",
    ],
    note: "The repeated injection is confirmed; a browser trace and a complete original entry path were not retained.",
  },
  "php-cron-job-malware.md": {
    groups: ["recurring-malware", "suspicious-files-code"],
    searchDescription:
      "WordPress malware returns on an hourly schedule? See evidence of a server cron entry that decoded and invoked PHP outside normal WP-Cron handling.",
    summary:
      "This entry helps owners investigate recurring suspicious files or behavior when a hosting-level cron task survives normal WordPress cleanup. The retained cron command ran hourly and invoked decoded PHP, although its complete payload effect is unknown.",
    observed: [
      "The retained server cron entry ran hourly and invoked an encoded PHP command outside the normal WordPress scheduler.",
    ],
    possible: [
      "A removed artifact may return on an hourly cycle if the cron command recreates or reloads it.",
      "Cleaning WordPress files alone may leave the hosting-level scheduled task untouched.",
    ],
    questions: [
      "Why does WordPress malware return every hour after cleanup?",
      "Can a server cron job reinfect a site outside WP-Cron?",
    ],
    note: "The schedule and encoded invocation are confirmed; the retained evidence does not show the full payload outcome.",
  },
  "php-malware-index.md": {
    groups: ["suspicious-files-code"],
    searchDescription:
      "Found a TokensDeGuards identifier or suspicious PHP in a WordPress index.php? Review the structural evidence without executing the sample.",
    summary:
      "This entry is for owners whose scanner or developer finds a TokensDeGuards-style index.php artifact. The file’s identifier and structure support further investigation, but no request log or execution trace was retained.",
    observed: [
      "The supplied index.php artifact contained the distinctive TokensDeGuards identifier and nonstandard PHP structure.",
    ],
    possible: [
      "A file scan may be the only sign while normal pages continue to load.",
      "The artifact may sit in an unexpected directory whose index.php would normally be minimal or inert.",
    ],
    questions: [
      "What is TokensDeGuards in a WordPress index.php file?",
      "Does a suspicious index.php prove that malware executed?",
    ],
    note: "The artifact is confirmed; execution, access, and any resulting site change are not established.",
  },
  "php-shell-ultimate-backdoor.md": {
    groups: ["suspicious-files-code", "login-credential-risk"],
    searchDescription:
      "Found PHP Shell Ultimate files in an upload-like WordPress directory? This entry explains the web-shell indicators and evidence limitations.",
    summary:
      "This research helps owners assess PHP files discovered where media or static uploads are expected. The retained names and shell-style structure are higher-confidence investigation leads, but the evidence does not show who accessed the files.",
    observed: [
      "The investigation retained PHP Shell Ultimate artifacts from upload-like WordPress paths.",
    ],
    possible: [
      "A scanner may flag executable PHP inside a directory normally associated with uploaded media.",
      "The public website may look unchanged even though a directly addressable shell file is present.",
    ],
    questions: [
      "Why are PHP files present inside my WordPress uploads area?",
      "What does PHP Shell Ultimate found by a malware scanner mean?",
    ],
    note: "File presence is confirmed; successful access, commands issued, and the initial upload path were not retained.",
  },
  "recursive-php-htaccess-denial.md": {
    groups: ["access-errors-warnings", "suspicious-files-code"],
    searchDescription:
      "WordPress PHP files suddenly return 403 errors in several folders? Review recursive .htaccess denial rules and their investigation context.",
    summary:
      "This entry is useful when PHP endpoints fail across multiple nested directories after unexpected .htaccess files appear. The retained directives deny PHP access recursively, although no server request log linked them to a specific visitor report.",
    observed: [
      "The investigation retained repeated .htaccess directives designed to deny access to PHP files across nested directories.",
    ],
    possible: [
      "Visitors or administrators may receive 403 responses when requesting affected PHP endpoints.",
      "Legitimate scripts in child directories may stop working until the directives are reviewed.",
    ],
    questions: [
      "Why are PHP files returning 403 errors across several WordPress folders?",
      "Can one .htaccess rule affect nested directories recursively?",
    ],
    note: "The access-control effect follows from the directives; a specific failed request was not retained in the evidence set.",
  },
  "savvywolf-web-shell-manager-variant.md": {
    groups: ["suspicious-files-code", "recurring-malware"],
    searchDescription:
      "Found a SavvyWolf PHP file manager or unknown shell interface on WordPress? Review its file-management UI and self-copy behavior.",
    summary:
      "This entry is relevant when a scanner finds a SavvyWolf-named PHP file or a browser request exposes an unfamiliar server file-manager interface. The retained sample included filesystem controls and attempts to create additional copies.",
    observed: [
      "The retained sample rendered a SavvyWolf file-management interface and contained self-copy attempts.",
    ],
    possible: [
      "Directly opening the artifact may display an unfamiliar file-manager page outside WordPress administration.",
      "Removing one file may leave another copy if a copy attempt completed successfully.",
    ],
    questions: [
      "What is a SavvyWolf file manager found on my WordPress server?",
      "Why do unknown PHP shell files appear in more than one location?",
    ],
    note: "The interface and copy logic are confirmed; the evidence does not establish who accessed it or which operations were performed.",
  },
  "seo-spam-anchor-css-injection.md": {
    groups: ["spam-unwanted-content", "suspicious-files-code"],
    searchDescription:
      "WordPress page source contains a hidden outbound link that visitors cannot see? Review a CSS-positioned SEO spam anchor from one investigation.",
    summary:
      "This page helps owners investigate unfamiliar links found in page source or SEO audits even though the visible design looks normal. The retained markup moved an outbound anchor far outside the viewport with inline CSS.",
    observed: [
      "The supplied markup contained an outbound anchor positioned far outside the visible page area with a large negative offset.",
    ],
    possible: [
      "Visitors may not notice the link during normal browsing even though it remains in the HTML.",
      "Search or backlink tools may surface unfamiliar anchor text, although no ranking effect was measured here.",
    ],
    questions: [
      "Why is there a hidden outbound link in my WordPress page source?",
      "Can SEO spam exist even when the page looks normal?",
    ],
    note: "The concealed link is confirmed; changes to rankings, traffic, or search-engine treatment were not measured.",
  },
  "wordpress-backdoor-exploit.md": {
    groups: ["suspicious-files-code"],
    searchDescription:
      "Found xdiff_string_patch calls or unusual patch data in WordPress PHP? Review the backdoor-like code pattern and what the evidence cannot prove.",
    summary:
      "This entry is for owners or developers who find unfamiliar xdiff-based patching code during a WordPress file review. The structure is unusual and security-relevant, but no triggering request or patched output was retained.",
    observed: [
      "The supplied PHP artifact used xdiff_string_patch with nonstandard embedded data in a WordPress context.",
    ],
    possible: [
      "The public website may show no obvious symptom until a matching code path runs.",
      "A scanner or manual source review may be the first indication of the artifact.",
    ],
    questions: [
      "Why is xdiff_string_patch used in my WordPress PHP files?",
      "Does unusual patching code prove that a WordPress vulnerability was exploited?",
    ],
    note: "The code pattern is confirmed; no vulnerable component, affected version, or exploitation path was identified.",
  },
  "wordpress-fake-system-control-plugin-mu-plugin-backdoor.md": {
    groups: ["unknown-plugins", "recurring-malware"],
    searchDescription:
      "An unknown System Control plugin returns after deletion? See direct evidence of a backup copy restoring its must-use plugin loader.",
    summary:
      "This research is directly relevant when an unfamiliar System Control must-use plugin reappears after its visible loader is removed. The supplied code checked a backup file and rewrote the destination when it was missing or changed.",
    observed: [
      "The retained System Control code compared its loader with a .sc-backup file and restored the destination copy when needed.",
    ],
    possible: [
      "The unknown must-use plugin can return after only the destination file is deleted.",
      "The plugin may not appear in the same way as an ordinary plugin because it uses the must-use plugin directory.",
    ],
    questions: [
      "Why does an unknown WordPress plugin return after I delete it?",
      "What is a .sc-backup file inside a must-use plugin?",
    ],
    note: "Self-restoration is confirmed in the supplied code; other symptoms observed on the same site are not attributed to it without direct evidence.",
  },
  "wordpress-mu-plugin-hidden-admin-backdoor.md": {
    groups: ["hidden-users", "login-credential-risk"],
    searchDescription:
      "WordPress shows more users than appear in the Users table? Review a must-use plugin that hid one stored account from queries and counts.",
    summary:
      "This entry is relevant when the user total and visible rows do not match, especially when no ordinary plugin explains the change. The supplied must-use plugin altered user queries and count data for one stored user ID.",
    observed: [
      "The retained code excluded one stored user ID from administrative queries and adjusted displayed user counts.",
    ],
    possible: [
      "The Users screen may report more accounts than the administrator can see.",
      "A concealed account may remain available even though it is absent from routine user review.",
    ],
    questions: [
      "Why does WordPress show a different user count from the visible user list?",
      "Can a must-use plugin hide an administrator from wp-admin?",
    ],
    note: "A count mismatch is contextual evidence only; confirm it against database records, capabilities, and the relevant plugin code.",
  },
  "wordpress-plugin-keeps-getting-removed-or-deactivated-malware.md": {
    groups: ["unknown-plugins", "recurring-malware"],
    searchDescription:
      "A legitimate WordPress plugin disappears or deactivates unexpectedly? Review a suspicious MU-plugin media patcher found during one investigation.",
    summary:
      "This entry is relevant when a plugin repeatedly disappears or deactivates and an unfamiliar media-named PHP file is present in mu-plugins. The two observations occurred in one investigation, but the retained evidence does not prove causation.",
    observed: [
      "The investigation retained a suspicious media-named file in the must-use plugin directory alongside reports of a plugin disappearing or deactivating.",
    ],
    possible: [
      "An affected plugin may appear to deactivate or disappear again after being restored.",
      "The suspicious MU-plugin file may not be obvious in the ordinary Plugins list.",
    ],
    questions: [
      "Why does a WordPress plugin keep disappearing or deactivating?",
      "Could an unfamiliar MU-plugin file be related to recurring plugin changes?",
    ],
    note: "The artifacts shared an investigation context, but a direct mechanism linking the MU-plugin file to the reported plugin symptom was not confirmed.",
  },
  "wordpress-suspicious-mu-plugin-malware-menu-queue-bit-compact-extension-vox.md":
    {
      groups: ["unknown-plugins", "suspicious-files-code"],
      searchDescription:
        "Found a 93 KB menu-queue-bit-compact-extension-vox.php MU-plugin? Review why the file is unusual and what remains unverified.",
      summary:
        "This entry helps owners investigate a large, unfamiliar PHP file in wp-content/mu-plugins that is not explained by their normal plugin inventory. The retained filename, size, and location are distinctive; execution was not demonstrated.",
      observed: [
        "The investigation retained a 93 KB file named menu-queue-bit-compact-extension-vox.php in the must-use plugin directory.",
      ],
      possible: [
        "The file may not appear as an ordinary installable plugin in the standard Plugins workflow.",
        "The site may show no obvious front-end change while the file is present.",
      ],
      questions: [
        "What is menu-queue-bit-compact-extension-vox.php in mu-plugins?",
        "Why is an unknown large PHP file loaded as a WordPress must-use plugin?",
      ],
      note: "The file identity, size, and location are confirmed; the retained evidence does not prove execution or a specific visitor-facing behavior.",
    },
  "wp-compatibility-patch-backdoor.md": {
    groups: ["hidden-users", "login-credential-risk"],
    searchDescription:
      "Found a WP Compatibility Patch plugin and a hidden user-count mismatch? Review code that concealed and protected one administrator account.",
    summary:
      "This page is relevant when a compatibility-themed plugin appears alongside unexplained user-count differences or an unfamiliar administrator. The supplied code hid one selected account from queries and interfered with ordinary account-management actions.",
    observed: [
      "The retained WP Compatibility Patch code filtered a selected user from administrative views and protected that account from normal management paths.",
    ],
    possible: [
      "The Users screen may omit an account while its total suggests another user exists.",
      "Attempts to inspect or remove the selected account through routine wp-admin paths may not behave normally.",
    ],
    questions: [
      "Why is WP Compatibility Patch hiding a WordPress administrator?",
      "Why does my WordPress user count not match the accounts I can manage?",
    ],
    note: "The concealment code is confirmed; the evidence does not identify the original access method or a vulnerable component.",
  },
  "wp-theme-functions-credential-stealer-fake-png.md": {
    groups: ["login-credential-risk", "suspicious-files-code"],
    searchDescription:
      "WordPress logins work normally but theme code writes passwords to a fake PNG? Review an authenticate-filter credential logger found in functions.php.",
    summary:
      "This entry matters when a security review finds login-hook code in a theme even though users have not noticed a broken login form. The supplied code appended submitted credentials to a local file disguised with a PNG extension.",
    observed: [
      "The retained functions.php code hooked WordPress authentication and appended submitted usernames and passwords to a local fake-PNG file.",
    ],
    possible: [
      "Logins may continue to appear normal because the code recorded input without intentionally blocking authentication.",
      "A file with an image-like extension may contain text credential records rather than image data.",
    ],
    questions: [
      "Can WordPress theme code record passwords while login still works?",
      "Why does a PNG file contain usernames or password-like text?",
    ],
    note: "Local credential logging is confirmed in code; network exfiltration and use of any recorded credential were not established.",
  },
  "xor-obfuscated-php-loader.md": {
    groups: ["suspicious-files-code", "recurring-malware"],
    searchDescription:
      "Found XOR-obfuscated PHP at the top of wp-config.php? Review a temporary-file loader pattern and why the site may still look normal.",
    summary:
      "This entry is relevant when wp-config.php contains unreadable PHP before the normal WordPress configuration. The supplied code decoded data, wrote a temporary PHP file, included it, and attempted cleanup; the decoded payload was not retained.",
    observed: [
      "The supplied wp-config.php modification used XOR-style decoding and a write-include-delete temporary-file sequence.",
    ],
    possible: [
      "The site may continue to load normally while the injected block runs before WordPress initialization.",
      "A scanner may repeatedly flag wp-config.php even when the temporary file is no longer present.",
    ],
    questions: [
      "Why is there XOR-obfuscated PHP in wp-config.php?",
      "Can a temporary PHP loader delete its dropped file after inclusion?",
    ],
    note: "The loader sequence is confirmed; the decoded payload, execution trace, and original entry point are unavailable.",
  },
};

const yamlString = (value) => JSON.stringify(value);
const renderList = (values) =>
  values.map((value) => `    - ${yamlString(value)}`).join("\n");

const files = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".md"))
  .sort();
const mappedFiles = Object.keys(signals).sort();
if (JSON.stringify(files) !== JSON.stringify(mappedFiles)) {
  const missing = files.filter((file) => !signals[file]);
  const extra = mappedFiles.filter((file) => !files.includes(file));
  throw new Error(
    `Signal map mismatch. Missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}`,
  );
}

for (const file of files) {
  const filePath = path.join(root, file);
  const source = fs.readFileSync(filePath, "utf8");
  if (/^siteOwner:/m.test(source))
    throw new Error(`${file} already contains siteOwner frontmatter`);
  if (!/^canonical:/m.test(source))
    throw new Error(`${file} has no canonical insertion point`);

  const item = signals[file];
  const block = [
    "siteOwner:",
    "  symptomGroups:",
    renderList(item.groups),
    `  searchDescription: ${yamlString(item.searchDescription)}`,
    `  summary: ${yamlString(item.summary)}`,
    "  observed:",
    renderList(item.observed),
    "  possible:",
    renderList(item.possible),
    "  questions:",
    renderList(item.questions),
    `  evidenceNote: ${yamlString(item.note)}`,
  ].join("\n");

  fs.writeFileSync(
    filePath,
    source.replace(/^canonical:/m, `${block}\ncanonical:`),
    "utf8",
  );
}

console.log(
  `Added evidence-qualified site-owner discovery data to ${files.length} entries.`,
);
