---
title: "wp_helper_uid WordPress Admin Backdoor Research"
h1: "wp_helper_uid Malware Forging WordPress Administrator Sessions"
slug: "wp-helper-uid-wordpress-admin-session-backdoor"
description: "Static analysis of paired admin-helper.php and MU-plugin backdoors that mint persistent WordPress administrator sessions without passwords."
status: "published"
reportDate: "2026-08-30"
lastReviewed: "2026-08-30"
threatCategory: "Passwordless WordPress administrator-session backdoor"
affectedComponents:
  - "WordPress wp-content directory"
  - "WordPress MU plugins"
  - "WordPress options table"
  - "WordPress users and usermeta"
  - "WordPress authentication cookies and sessions"
observedLocations:
  - "wp-content/admin-helper.php"
  - "wp-content/mu-plugins/boot-loader.php"
  - "WordPress option wp_helper_uid"
  - "Site-prefixed administrator capability metadata for user ID 10"
confirmedBehaviors:
  - "Exposes two separate secret-gated routes to mint a WordPress administrator session without validating a password"
  - "Queries administrator accounts by ascending ID and prefers the first administrator other than the ID stored in wp_helper_uid"
  - "Falls back to the wp_helper_uid account when no different administrator is available"
  - "Creates persistent authentication cookies and a WordPress session token before redirecting to wp-admin"
  - "Uses an automatically loaded MU-plugin as a redundant access path"
  - "Returns or displays innocuous behavior when the correct request secret is absent"
confidence: "High"
severity: "Critical"
severityRationale: "Both recovered files directly bypass password authentication and can grant an unauthenticated requester the privileges of an existing WordPress administrator."
evidenceSource: "Static, non-executing analysis of two recovered PHP files, cryptographic hashes, Plesk filesystem screenshots, and privacy-reviewed phpMyAdmin query results from an anonymized incident"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-researches/wp-helper-admin-helper-file_evidence-1.png"
    alt: "Plesk wp-content listing showing the suspicious admin-helper.php file"
    caption: "The wp-content listing shows admin-helper.php at 2.4 KB with mode 0644. Client ownership details are redacted."
    supports: "The recovered site contained admin-helper.php directly beneath wp-content"
    width: 1836
    height: 856
    privacyReviewed: true
  - src: "/wordpress-researches/wp-helper-mu-boot-loader_evidence-2.png"
    alt: "Plesk MU-plugin listing showing the suspicious boot-loader.php file"
    caption: "The MU-plugin directory contains boot-loader.php at 2.1 KB with mode 0644. Client ownership details are redacted."
    supports: "A second backdoor occupied WordPress's automatically loaded MU-plugin directory"
    width: 1984
    height: 793
    privacyReviewed: true
  - src: "/wordpress-researches/wp-helper-option-record_evidence-3.png"
    alt: "phpMyAdmin result showing the wp_helper_uid WordPress option with value 10"
    caption: "The read-only query returned one wp_helper_uid row with value 10, autoload disabled, and a two-byte value."
    supports: "The database contained the exact coordination option read by both backdoors"
    width: 1836
    height: 856
    privacyReviewed: true
  - src: "/wordpress-researches/wp-helper-admin-capability_evidence-4.png"
    alt: "phpMyAdmin usermeta results showing administrator capability for user ID 10"
    caption: "The privacy-reviewed metadata shows user ID 10 with an administrator capability and user level 10; the site-specific table prefix and nickname are redacted."
    supports: "The ID stored in wp_helper_uid belonged to an administrator-capable account in the captured database"
    width: 1448
    height: 1086
    privacyReviewed: true
indicators:
  - value: "4bbeaed0845bcd965c92902a1dfb314d4afd79e48029dc22bf5fa7597a0d93cb"
    type: "SHA-256"
    confidence: "higher"
  - value: "0cbe6a757abcfe7c8968ae169929164d978f120847c05ca91f5e09c44293c4f3"
    type: "SHA-256"
    confidence: "higher"
  - value: "wp_helper_uid"
    type: "WordPress option name"
    confidence: "higher"
  - value: "Widget cache bootstrap, ver b2ccbcd25e"
    type: "Code marker"
    confidence: "higher"
  - value: "Runtime dependencies bootstrap 9b66554fd3"
    type: "Code marker"
    confidence: "higher"
  - value: "wp_179e4b plus wp_4bb239 plus wp_4960ab"
    type: "Combined code probes"
    confidence: "higher"
  - value: "admin-helper.php"
    type: "Observed filename"
    confidence: "contextual"
  - value: "boot-loader.php"
    type: "Observed filename"
    confidence: "contextual"
  - value: "s and cron request parameters"
    type: "Request-gate names"
    confidence: "contextual"
limitations:
  - "Neither recovered file contains the routine that created wp_helper_uid, created or modified user ID 10, or wrote the two PHP files."
  - "No access, Plesk, FTP, SSH, deployment, WAF, or database-audit log was supplied, so initial access and successful use of either gate remain unconfirmed."
  - "The captured metadata proves that user ID 10 had administrator capability; it does not prove whether that account was attacker-created or previously legitimate."
  - "The matching displayed file timestamps support coordinated placement only contextually and cannot establish the true installation time."
  - "The two files provide redundant access, but neither restores the other; these samples do not prove self-healing behavior."
relatedResearch:
  - "wp-user-query-hidden-admin-filter"
  - "functions-php-hidden-admin-query-backdoor"
  - "wp-compatibility-patch-hidden-admin"
relatedGuides:
  - title: "How to find hidden WordPress administrators"
    href: "/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/"
  - title: "How to investigate a hidden WordPress backdoor"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
  - title: "WordPress malware removal guide"
    href: "/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/"
relatedCaseStudies:
  - title: "MU-plugin hidden-user case study"
    href: "/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/"
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "unknown-plugins"
    - "hidden-users"
    - "login-credential-risk"
  searchDescription: "Found admin-helper.php, boot-loader.php, or wp_helper_uid? This research explains a dual WordPress backdoor that creates administrator sessions."
  summary: "Use this report when an unfamiliar admin-helper.php file appears in wp-content, a boot-loader.php file appears under mu-plugins, or the database contains wp_helper_uid. The recovered pair can log a requester in as an existing administrator without a password."
  observed:
    - "Two PHP files used the same database option and nearly identical administrator-selection and cookie-creation logic."
    - "The database option stored user ID 10, whose captured metadata included administrator capability and user level 10."
  possible:
    - "An attacker may enter wp-admin as an existing administrator without knowing that account's password."
    - "Deleting only one file may leave the second passwordless access path available."
    - "A missing installer or sibling-site implant may recreate the files unless the broader hosting account is investigated."
  questions:
    - "Why are admin-helper.php and boot-loader.php in my WordPress installation?"
    - "Can WordPress malware create an administrator login cookie without a password?"
    - "How do I remove wp_helper_uid malware and revoke every forged session?"
  evidenceNote: "The file pair and database records prove passwordless administrator-session capability, but logs or a missing installer are required to identify initial access or confirmed operator use."
canonical: "https://www.mdpabel.com/malware-research/wp-helper-uid-wordpress-admin-session-backdoor/"
index: true
---

I recovered two small WordPress backdoors that do not steal or crack an administrator password. Instead, they ask WordPress itself to create a valid authenticated session for an existing administrator.

The first file, `wp-content/admin-helper.php`, is a directly reachable PHP endpoint. The second, `wp-content/mu-plugins/boot-loader.php`, is loaded automatically by WordPress. Both use the same database option, `wp_helper_uid`, and almost identical account-selection and cookie-generation logic. Each accepts a different hard-coded request secret, remains quiet when that secret is absent, and redirects a successful requester into `wp-admin`.

**Assessment:** Critical compromise. An operator who knows either embedded secret can obtain the selected administrator's WordPress privileges without presenting that user's password or completing the normal login flow.

The public evidence deliberately withholds both live request secrets. Publishing them would turn defensive research into an access recipe for any site where the samples remain installed. Their hashes, stable code markers, file hashes, option name, and normalized control flow are sufficient for identification.

## Summary

- `admin-helper.php` loads WordPress from a nearby `wp-load.php`, checks a secret request parameter, and displays a fake 404 response to ordinary visitors.
- `boot-loader.php` is a must-use plugin. It checks a second secret-gated parameter before registering a priority-1 `plugins_loaded` callback.
- Both read `wp_helper_uid`, enumerate administrator accounts in ascending ID order, and prefer the first administrator whose ID differs from the stored value.
- If no different administrator exists, both fall back to the stored helper ID.
- Both call `wp_set_current_user()` and `wp_set_auth_cookie()` without calling the password-authentication flow.
- Both request a persistent login and redirect to `wp-admin`.
- The database contained `wp_helper_uid = 10`; captured usermeta showed that user ID 10 had the site's administrator capability and user level 10.
- Neither sample creates the option, creates the user, writes the other file, or reveals the original compromise route. A third component or an interactive attacker action remains missing.

## Scope and methodology

This report is based on the two recovered PHP files, their exact byte-level hashes, two Plesk directory captures, and read-only phpMyAdmin results. I normalized split strings and misleading identifiers, removed dead assignments, and traced the WordPress functions and hook order. PHP syntax was checked with `php -l`; the samples were not executed as applications, WordPress was not loaded during analysis, and no request was made to either gated route.

Exact searches for the two file hashes, embedded secrets, and distinctive header comments produced no useful public matches on 30 August 2026. Search-engine absence is not proof that the cluster is unique or previously unknown.

The cluster is provisionally described here as the **wp_helper_uid dual WordPress administrator-session backdoor**. That is a functional label, not attribution to a person, company, or established malware family.

## Recovered filesystem evidence

The first sample appeared directly beneath `wp-content` rather than inside a normal plugin directory.

![Plesk wp-content listing showing the suspicious admin-helper.php file](/wordpress-researches/wp-helper-admin-helper-file_evidence-1.png "The wp-content listing shows admin-helper.php at 2.4 KB with mode 0644. Client ownership details are redacted.")

*Figure 1 — `admin-helper.php` is displayed at 2.4 KB with permission mode 0644. Its displayed modification time is 30 July 2026 at 12:21, but that value alone cannot establish when the compromise occurred.*

The companion occupied the root of `wp-content/mu-plugins`.

![Plesk MU-plugin listing showing the suspicious boot-loader.php file](/wordpress-researches/wp-helper-mu-boot-loader_evidence-2.png "The MU-plugin directory contains boot-loader.php at 2.1 KB with mode 0644. Client ownership details are redacted.")

*Figure 2 — `boot-loader.php` is displayed at 2.1 KB, also with mode 0644 and the same displayed modification time. The shared timestamp is consistent with coordinated placement or timestamp copying, but is not a reliable infection timeline.*

WordPress automatically enables PHP files placed directly in `wp-content/mu-plugins`, loads them before ordinary plugins, and does not offer the normal deactivation control for them. WordPress documents that removal from the MU-plugin directory is required to disable such a file. See the official [must-use plugin documentation](https://developer.wordpress.org/advanced-administration/plugins/mu-plugins/).

## Confirmed findings

### Two routes lead to the same administrator-session outcome

The samples differ in how the operator reaches them:

| Component | Loading path | Wrong or missing secret | Successful path |
|---|---|---|---|
| `wp-content/admin-helper.php` | Direct HTTP request to the PHP file | Returns a fake, non-cacheable 404 page | Loads WordPress, mints the selected administrator session, redirects to `wp-admin` |
| `wp-content/mu-plugins/boot-loader.php` | Automatically loaded during an ordinary WordPress request | Returns from the MU-plugin and lets WordPress continue | Runs during `plugins_loaded`, mints the selected administrator session, redirects to `wp-admin` |

The MU-plugin declines AJAX and REST contexts. This appears designed to reduce breakage and avoid revealing the redirect during API traffic. Its request parameter is named like a scheduler, but the file contains no scheduling logic; the name is camouflage.

### The string splitting is camouflage, not encryption

Neither sample contains a compressed or encrypted second stage. The apparent complexity comes from:

- split strings assembled with `implode`;
- unrelated hexadecimal comments;
- overwritten variables;
- unused arrays and integers;
- random word-salad identifiers;
- meaningless `function_exists` probes; and
- one impossible comparison in `admin-helper.php`.

After removing this noise, the operational code is short and direct.

### The backdoor selects an administrator strategically

Both samples follow the same selection algorithm:

1. Read `wp_helper_uid` as an integer.
2. Query users with the `administrator` role.
3. Sort by ascending user ID.
4. Select the first administrator whose ID does not equal `wp_helper_uid`.
5. If none exists, fall back to the stored ID.
6. If no usable ID exists, stop or return 404.

This means the option is not required for the attack to work. If the option is absent and evaluates to zero, the query still chooses the first administrator. Deleting only `wp_helper_uid` does **not** neutralize either file.

The preference for a different administrator is important. One plausible interpretation is that the stored ID identifies a helper or planted account, while the operator prefers to impersonate a legitimate low-ID administrator. That motive remains an inference because the missing installer and user-creation history were not recovered.

### WordPress creates a real persistent session

The decisive call in both samples is structurally equivalent to:

```php
wp_set_current_user($target_user_id);
wp_set_auth_cookie($target_user_id, true, is_ssl());
do_action('wp_login', $target_user->user_login, $target_user);
```

No password validation occurs before these calls. The `true` argument requests a remembered session. WordPress documents a default 14-day duration, subject to the site's `auth_cookie_expiration` filter. When no session token is supplied, WordPress creates one through its session-token manager and then generates the authentication and logged-in cookies. See [`wp_set_auth_cookie()`](https://developer.wordpress.org/reference/functions/wp_set_auth_cookie/).

Calling `do_action('wp_login', ...)` can also invoke ordinary login-monitoring, auditing, or security-plugin callbacks. It makes the event look more like a normal WordPress login to code that watches the hook, even though the password-authentication process was bypassed.

### Database evidence links the option to an administrator-capable account

The supplied read-only query returned exactly one `wp_helper_uid` option. Its captured value was `10`, the value length was two bytes, and autoload was disabled.

![phpMyAdmin result showing the wp_helper_uid WordPress option with value 10](/wordpress-researches/wp-helper-option-record_evidence-3.png "The read-only query returned one wp_helper_uid row with value 10, autoload disabled, and a two-byte value.")

*Figure 3 — Both PHP samples read this exact option. `autoload = off` does not protect the site because each backdoor retrieves the option explicitly with `get_option()`.*

The corresponding metadata capture showed user ID 10 with the site-prefixed capabilities value `a:1:{s:13:"administrator";b:1;}` and user level `10`.

![phpMyAdmin usermeta results showing administrator capability for user ID 10](/wordpress-researches/wp-helper-admin-capability_evidence-4.png "The privacy-reviewed metadata shows user ID 10 with an administrator capability and user level 10; the site-specific table prefix and nickname are redacted.")

*Figure 4 — The database supports the narrow conclusion that the stored ID was administrator-capable. It does not establish whether the account was created by the attacker or was an existing legitimate administrator.*

Query-only screenshots and empty results were excluded. In particular, a generic `wp_capabilities` lookup did not use the captured site's actual capability-meta prefix, so its empty result cannot support a negative finding.

## Technical analysis

### `admin-helper.php`: direct endpoint with a fake 404

The file tries three relative paths until it finds `wp-load.php`. From the observed `wp-content` location, the final candidate normally resolves to the WordPress root. If WordPress cannot be loaded, the script returns 404.

It then reconstructs a hard-coded secret and compares it with request parameter `s` using `hash_equals()`. A missing or incorrect value receives a deliberately ordinary 404 document plus no-cache headers. This conceals the endpoint from casual browsing and scanners that do not know the secret.

**Redacted defensive excerpt**

```php
$wordpress_candidates = [
    __DIR__ . '/../../../wp-load.php',
    __DIR__ . '/../../wp-load.php',
    __DIR__ . '/../wp-load.php',
];

// Exact embedded value withheld from publication.
$request_secret = '[REDACTED]';

if (!isset($_GET['s']) || !hash_equals($request_secret, (string) $_GET['s'])) {
    status_header(404);
    nocache_headers();
    echo '<!DOCTYPE html><title>404 Not Found</title><h1>Not Found</h1>';
    exit;
}
```

The gate secret's SHA-256 is published below for private-sample comparison without disclosing the usable value.

### `boot-loader.php`: automatically loaded alternate gate

The MU-plugin reconstructs a different secret and checks a parameter named `cron`. Unless it matches, the file returns immediately. It also returns for AJAX or REST requests. Only a correctly gated ordinary request reaches the registered callback.

```php
// Exact embedded value withheld from publication.
$request_secret = '[REDACTED]';

if (!isset($_GET['cron']) || !hash_equals($request_secret, (string) $_GET['cron'])) {
    return;
}

if ((defined('DOING_AJAX') && DOING_AJAX)
    || (defined('REST_REQUEST') && REST_REQUEST)) {
    return;
}

add_action('plugins_loaded', function () {
    // Shared administrator selection and cookie creation summarized below.
}, 1);
```

This file does not create a WordPress cron event. The parameter name should not be mistaken for evidence of scheduled execution.

### Shared normalized control flow

The following pseudocode preserves the defensively useful logic without providing either operational secret:

```text
helper_id = integer(get_option("wp_helper_uid"))
target_id = 0

for each administrator ordered by ascending ID:
    if administrator.ID is not helper_id:
        target_id = administrator.ID
        stop searching

if target_id is empty and helper_id is nonzero:
    target_id = helper_id

if target_id is valid:
    set target as current WordPress user
    create persistent WordPress authentication cookies
    fire the wp_login hook
    redirect to wp-admin
```

### Dead code and clustering markers

The comments `Widget cache bootstrap, ver b2ccbcd25e` and `Runtime dependencies bootstrap 9b66554fd3` do not describe the true behavior. They are valuable content-search markers because they appear alongside the backdoor logic.

`admin-helper.php` also probes three nonexistent-looking function names but never uses the results. These markers, the shared option, and the identical query/cookie sequence provide a stronger signature than either generic filename.

## Analyst assessment

This is not a credential checker and not a conventional command-execution shell. It is a narrowly designed authentication bypass implanted on the server. The operator supplies a secret known to the malware, and the malware uses trusted WordPress internals to create a valid session for an administrator chosen from the victim database.

The dual placement matters operationally. Removing the directly visible `admin-helper.php` leaves the automatically loaded MU-plugin. Removing only the MU-plugin leaves the direct endpoint. The pair therefore provides redundant persistence of **access**, although the recovered code does not regenerate files and should not be described as self-healing.

Because a forged session receives the target account's capabilities, the impact can include plugin/theme installation, code editing where enabled, user manipulation, content changes, data access, and further persistence. Multi-factor authentication implemented only in the normal login flow may not protect against a server-side function that creates the cookie after bypassing that flow.

The closest ATT&CK concepts are [T1505.003, Web Shell](https://attack.mitre.org/techniques/T1505/003/), for a server-side web backdoor providing persistent access, and [T1550.004, Web Session Cookie](https://attack.mitre.org/techniques/T1550/004/), for authenticated access through session material rather than a password. These are approximate defensive mappings; this sample generates a WordPress session cookie instead of stealing an already issued cookie.

## How the malware may have been injected

The recovered files do not contain their installer. Ownership and permission mode only show that the artifacts existed under the hosting subscription's Unix identity. They do not distinguish among:

- exploitation of a vulnerable plugin, theme, or public upload handler;
- a stolen WordPress administrator session or password followed by plugin/theme editing;
- compromised Plesk File Manager credentials;
- FTP, SFTP, SSH, or deployment credential abuse;
- restoration of an already infected backup;
- a malicious or compromised package; or
- a write from another compromised site running as the same operating-system user.

To establish initial access, preserve current and rotated web logs, Plesk panel history, FTP/SFTP/SSH authentication and transfer logs, WAF records, database audit/binlog evidence, security-plugin alerts, deployment history, and the nearest clean and infected backups. Start at least 72 hours before the earliest trustworthy sighting and correlate source IP, user agent, authenticated account, request route, response status, and file creation evidence.

High-value sequences include an unfamiliar login followed by a code upload, an unauthenticated POST to a component endpoint followed by the first request for a new PHP file, a Plesk/FTP authentication immediately before placement, or the same hashes appearing earlier on a sibling site.

The identical displayed timestamps on the two files are contextual, not conclusive. They can result from one deployment action, a preserved archive timestamp, manual copying, or deliberate timestamp manipulation. No recovered line implements timestomping.

## Detection and hunting

### Read-only filesystem hunt

Search every document root owned by the same hosting account. `rg` is preferred when available:

```bash
rg -n -I --hidden \
  -g '*.php' -g '*.phtml' -g '*.inc' -g '.user.ini' -g '.htaccess' \
  'wp_helper_uid|Widget cache bootstrap, ver b2ccbcd25e|Runtime dependencies bootstrap 9b66554fd3|wp_179e4b|wp_4bb239|wp_4960ab' \
  /var/www/vhosts/EXAMPLE.COM/httpdocs
```

Also find the observed filenames, but treat them as candidates until content or hashes match:

```bash
find /var/www/vhosts/EXAMPLE.COM/httpdocs -xdev -type f \
  \( -name 'admin-helper.php' -o -name 'boot-loader.php' \) -print
```

Inspect PHP in uploads, cache, upgrade, temporary, and backup directories. Review `.user.ini`, `.htaccess`, `wp-config.php`, all MU plugins, WordPress drop-ins, active and inactive themes, ordinary plugins, and sibling installations.

### Read-only database hunt

Replace `<prefix>_` with the exact prefix from `wp-config.php`:

```sql
SELECT
    option_id,
    option_name,
    option_value,
    autoload,
    LENGTH(option_value) AS value_bytes,
    SHA2(option_value, 256) AS value_sha256
FROM <prefix>_options
WHERE option_name = 'wp_helper_uid';
```

Then validate the referenced ID directly rather than trusting the WordPress Users screen:

```sql
SELECT u.ID, u.user_login, u.user_email, u.user_registered,
       um.meta_key, um.meta_value
FROM <prefix>_users AS u
JOIN <prefix>_usermeta AS um ON um.user_id = u.ID
WHERE u.ID = CAST((
    SELECT option_value
    FROM <prefix>_options
    WHERE option_name = 'wp_helper_uid'
    LIMIT 1
) AS UNSIGNED)
ORDER BY um.umeta_id;
```

For multisite or a nonstandard installation, confirm the correct capabilities key and table layout before drawing conclusions.

### Log hunt

Search current and rotated domain logs for the direct filename. Keep full query strings private because they may disclose a usable gate value:

```bash
zgrep -Hn -E 'admin-helper\.php' \
  /var/www/vhosts/system/EXAMPLE.COM/logs/*
```

A request match is evidence of access to the path, not automatically successful authentication. Preserve timestamp, status, response size, source/forwarded IP, user agent, referrer, and surrounding lines.

## Indicators of compromise

[Download the privacy-safe IOC CSV](/wordpress-researches/wp-helper-uid-iocs.csv). The operational gate values are withheld; only their SHA-256 hashes are included.

### Higher-confidence indicators

| Indicator | Type | Context |
|---|---|---|
| `4bbeaed0845bcd965c92902a1dfb314d4afd79e48029dc22bf5fa7597a0d93cb` | SHA-256 | Exact recovered `admin-helper.php` |
| `0cbe6a757abcfe7c8968ae169929164d978f120847c05ca91f5e09c44293c4f3` | SHA-256 | Exact recovered `boot-loader.php` |
| `wp_helper_uid` | WordPress option | Shared by both files and confirmed in the database |
| `Widget cache bootstrap, ver b2ccbcd25e` | Code marker | Fake header in `admin-helper.php` |
| `Runtime dependencies bootstrap 9b66554fd3` | Code marker | Fake header in `boot-loader.php` |
| `wp_179e4b`, `wp_4bb239`, and `wp_4960ab` together | Code probes | Inert clustering markers in the direct endpoint |
| `8e753f173a5c428fe6c44646cddb0da04952628bcd098400d6fe9fcd3f3bb435` | Secret SHA-256 | Hash of the withheld direct-endpoint gate value |
| `b6efe58fb91fb0bb9d11fce3b6eb42bcc1b8822deacc39facc657d17cffb1bf5` | Secret SHA-256 | Hash of the withheld MU-plugin gate value |

### Contextual indicators

- `wp-content/admin-helper.php`
- `wp-content/mu-plugins/boot-loader.php`
- small PHP files using split strings, `WP_User_Query`, `wp_set_auth_cookie`, `wp_login`, and `admin_url()` together;
- `s` or `cron` request parameters, which are generic and unsafe as standalone detections; and
- matching displayed timestamps or file ownership, which require content or log corroboration.

Filenames and generic request parameters are not sufficient diagnoses. A legitimate developer can choose either filename, and many unrelated applications use a `cron` parameter.

## What this evidence does not establish

- The installer or file-write mechanism was not recovered.
- Initial access is unknown.
- No log proves that an operator successfully used either gate.
- User ID 10 was administrator-capable, but the retained evidence does not establish whether it was maliciously created.
- Empty phpMyAdmin results produced with a generic capability-meta key are not valid evidence that administrators were absent.
- The sample pair contains no C2 address, remote download, command execution, password capture, cron scheduling, file restoration, or sibling-site scanning logic.
- No attribution can be made from attacker-controlled comments, filenames, or variable names.

## Artifact-specific remediation

Do not begin by testing either backdoor URL. A successful test creates another valid administrator session and changes the evidence you need to preserve.

### 1. Preserve evidence and contain execution

1. Create filesystem, database, and log snapshots outside the compromised document root.
2. Put the virtual host behind a static maintenance response or restrict it at the web-server/firewall layer. A WordPress maintenance plugin is insufficient because the MU-plugin loads during WordPress bootstrap.
3. Preserve both samples, metadata, hashes, the `wp_helper_uid` row, referenced user/user-meta rows, all session-token rows, and current/rotated access logs.
4. Identify every WordPress installation writable by the same operating-system owner.

### 2. Remove both known access paths

After preservation, remove or quarantine these exact confirmed artifacts together:

```text
wp-content/admin-helper.php
wp-content/mu-plugins/boot-loader.php
```

Do not delete every file with those names automatically. Verify content or hashes first. Search the entire account for the stable markers and hashes, then remove every confirmed copy.

Inspect the rest of `mu-plugins` manually. WordPress states that MU-plugin files cannot be disabled through the normal plugin control; the file itself must be removed from the MU-plugin directory.

### 3. Remove the coordination option

Export the row first. Then, while the site is contained and after confirming the table prefix, remove only the exact option:

```sql
DELETE FROM <prefix>_options
WHERE option_name = 'wp_helper_uid';
```

Deleting the option without removing both PHP files is not a fix: the code can select the first administrator when the option is absent.

### 4. Audit users before deleting any account

Verify user ID 10 with the site owner. Review its username, email, registration date, authored content, password-change history where available, application passwords, session metadata, and surrounding audit logs.

- If unauthorized, remove it through a clean administrative process and explicitly decide how to reassign any legitimate content.
- If legitimate, retain the account but rotate its password and revoke all sessions.
- Review every other administrator because the backdoors intentionally prefer an administrator different from the stored helper ID.

Do not infer that only user ID 10 was exposed.

### 5. Destroy sessions and rotate authentication material

After the malicious PHP is gone and WordPress core is trusted, destroy all sessions for all users. WordPress documents `wp user session destroy <user> --all`, and its CLI documentation provides an all-user example. See [`wp user session destroy`](https://developer.wordpress.org/cli/commands/user/session/destroy/).

Rotate all eight WordPress authentication keys and salts in `wp-config.php`; WordPress documents that changing them invalidates existing cookies. See the [WordPress security-key documentation](https://developer.wordpress.org/apis/wp-config-php/#security-keys).

Then rotate:

- every WordPress administrator password;
- Plesk/control-panel credentials and MFA recovery methods;
- FTP, SFTP, SSH, deployment, and repository credentials;
- the database password;
- API, SMTP, payment, backup, and integration secrets accessible to the site.

Use a clean administrator device for the rotations.

### 6. Rebuild trusted code and investigate the entry route

Replace WordPress core with the exact trusted release and reinstall plugins/themes from verified vendor packages. Diff and separately restore only reviewed custom code and uploads. Do not copy the compromised installation wholesale into the rebuilt site.

Search for PHP in normally non-executable locations and inspect:

- all MU plugins and ordinary plugins;
- active and inactive themes;
- `wp-config.php`, `.user.ini`, `.htaccess`, and PHP-FPM/vhost configuration;
- `advanced-cache.php`, `db.php`, `object-cache.php`, and `sunrise.php`;
- uploads, cache, upgrade, `upgrade-temp-backup`, temporary, and backup directories; and
- every sibling site under the same hosting identity.

Correlate logs and backups to identify the initial access route. Patch or remove the vulnerable component, compromised account, poisoned deployment, or sibling-site source before returning the site to service.

## Recurrence verification

After cleanup:

- confirm both file hashes and all stable markers are absent account-wide;
- confirm `wp_helper_uid` is absent from the correct options table;
- compare the database-level administrator list with the site owner's approved inventory;
- confirm all old WordPress sessions are invalid;
- verify the MU-plugin directory contains only documented, trusted files;
- monitor requests for `admin-helper.php` without responding through WordPress;
- alert on recreation of either path or option;
- monitor new administrator capability assignments, plugin/theme writes, and PHP created in uploads/cache; and
- repeat the hunt after PHP/web-service restart and again after normal site traffic resumes.

If either file or option returns, stop request processing again and search for the missing writer. The current samples do not self-repair, so recurrence would be evidence of another surviving component, stolen access, scheduled deployment, infected backup, or compromised sibling site.

## Related malware research

[Browse the WordPress malware research hub](/malware-research/).

- [wp-user-query.php MU-Plugin Concealing a Stored User ID](/malware-research/wp-user-query-hidden-admin-filter/)
- [Hidden Administrator Query Hooks Found in functions.php](/malware-research/functions-php-hidden-admin-query-backdoor/)
- [WP Compatibility Patch Plugin Creating and Hiding an Administrator](/malware-research/wp-compatibility-patch-hidden-admin/)

## Related guides and case studies

- [How to find hidden WordPress administrators](/blog/how-to-find-and-remove-hidden-admin-users-in-wordpress-malware-analysis/)
- [How to investigate a hidden WordPress backdoor](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/)
- [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/)
- [MU-plugin hidden-user case study](/case-studies/bitdefender-blocked-wordpress-no-users-found-mu-plugin-malware/)

## Methodology and privacy note

The samples were handled as text and were never invoked through WordPress. File hashes were calculated locally, and PHP linting validated syntax without executing application logic. Official WordPress documentation was used to verify MU-plugin loading, cookie duration, session-token creation, session destruction, and salt rotation.

Public screenshots are privacy-reviewed derivatives. Client account-owner values, the database name/table prefix, and the user nickname were removed. Query-only and empty-result screenshots were excluded because they added no reliable finding; one empty capability query used a generic meta-key prefix and was not suitable for interpretation.

Both hard-coded gate values are withheld. The report publishes only their SHA-256 hashes, exact sample hashes, non-operational code markers, and redacted defensive excerpts. Confirmed behavior is separated from inference, and the report does not claim an entry vulnerability, successful operator use, self-healing, campaign prevalence, or attribution without supporting evidence.
