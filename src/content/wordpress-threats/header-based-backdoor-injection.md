---
title: "HTTP-Header-Gated PHP Loader: WordPress Malware Research"
h1: "HTTP-Header-Gated PHP Loader Found in a Plugin File"
slug: "http-header-gated-php-loader"
description: "Forensic analysis of a PHP loader that used three HTTP header values for dynamic callable composition inside a WordPress plugin file."
status: "published"
reportDate: "2026-01-24"
lastReviewed: "2026-07-22"
threatCategory: "Header-gated PHP loader"
affectedComponents:
  - "PHP file loaded within a WordPress plugin directory"
  - "PHP request-header handling"
observedLocations:
  - "Plugin file named buddyboss_legacy.php"
confirmedBehaviors:
  - "Reads request headers through getallheaders()"
  - "Checks for the X-Dns-Prefetch-Control header"
  - "Uses three header values as callable names or callable input"
  - "Invokes the callable returned by the first dynamic operation"
confidence: "High"
severity: "High"
severityRationale: "The supplied code dynamically composes and invokes PHP callables from request-header values. The screenshot does not establish whether a triggering request was received or what payload was supplied."
evidenceSource: "Anonymized WordPress client investigation with one retained code screenshot and a supplied PHP snippet"
schemaType: "TechArticle"
screenshots:
  - src: "/wordpress-threats/php-header-execution-backdoor-x-dns-prefetch_evidence-1.png"
    alt: "WordPress file editor showing a one-line request-header loader at the top of buddyboss_legacy.php"
    caption: "A one-line loader appears before the legitimate plugin-file code and reads three named HTTP headers. The image confirms the local injection, not a triggering request."
    supports: "A header-gated loader was inserted into buddyboss_legacy.php"
    width: 1607
    height: 745
    privacyReviewed: true
indicators:
  - value: "X-Dns-Prefetch-Control"
    type: "header-name"
    confidence: "higher"
  - value: "If-Unmodified-Since"
    type: "header-name"
    confidence: "higher"
  - value: "Feature-Policy"
    type: "header-name"
    confidence: "higher"
  - value: "getallheaders() followed by nested dynamic callable invocation"
    type: "code-structure"
    confidence: "higher"
  - value: "buddyboss_legacy.php"
    type: "filename"
    confidence: "contextual"
limitations:
  - "The retained evidence does not include a triggering HTTP request or its values."
  - "The initial compromise method was not confirmed."
  - "No vulnerable component or affected version was identified."
  - "The screenshot does not demonstrate which callable names or payload were supplied at runtime."
relatedResearch:
  - "wp-config-xor-temporary-file-loader"
  - "savvywolf-manager-php-web-shell"
  - "php-footer-remote-content-loader"
relatedGuides:
  - title: "How to recognize obfuscated PHP malware in WordPress"
    href: "/blog/wordpress-obfuscated-php-malware-detection/"
  - title: "Hidden backdoor investigation in wp-content"
    href: "/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/"
relatedCaseStudies: []
relatedService:
  title: "WordPress malware removal"
  href: "/wordpress-malware-removal/"
siteOwner:
  symptomGroups:
    - "suspicious-files-code"
  searchDescription: "Found PHP that reads an unusual HTTP header in a WordPress plugin file? Review this request-gated loader and the limits of the retained evidence."
  summary: "This research helps evaluate a short injected PHP block that selected an HTTP header before passing derived data into a loader path. It may leave the public site looking normal until a matching request is made."
  observed:
    - "The supplied plugin-file code inspected an HTTP request header and used the resulting value in a concealed loading sequence."
  possible:
    - "Normal visitors may see no visible symptom because the suspicious branch depends on request data."
    - "A scanner or manual code review may be the first sign of the modification."
  questions:
    - "Why is a WordPress plugin reading an unfamiliar HTTP header?"
    - "Could request-gated PHP malware remain invisible during normal browsing?"
  evidenceNote: "The code shows a request gate, but the retained evidence does not include a triggering request or execution trace."
canonical: "https://www.mdpabel.com/malware-research/http-header-gated-php-loader/"
index: true
---

## Summary

This entry examines a one-line PHP loader observed at the beginning of a plugin file named `buddyboss_legacy.php`. The supplied code reads all request headers, checks for `X-Dns-Prefetch-Control`, and then uses values from three headers in nested dynamic callable operations.

The code structure supports classifying the line as a header-gated loader. The retained evidence does not include a triggering request, so this page does not claim that a particular payload executed. It also does not identify a vulnerable WordPress component or explain how the line was inserted.

## Investigation context

The screenshot was retained during one anonymized WordPress investigation. It shows the injected line above code that otherwise identifies itself as a BuddyBoss legacy icon-picker file. A malicious line inside a plugin path does not, by itself, show that the plugin was the original access point.

For broad methods to review unreadable or dynamically invoked PHP, see [how to recognize obfuscated PHP malware in WordPress](/blog/wordpress-obfuscated-php-malware-detection/). This research page focuses only on the distinctive header names and callable structure in the supplied artifact.

## Observed artifact

The suspicious line appears immediately after the opening PHP tag and before the file's normal documentation block. It is visually separate from the surrounding implementation and uses a compact variable name, `getallheaders()`, a conditional header check, nested calls, and a final invocation of the returned value.

![WordPress file editor showing a one-line request-header loader at the top of buddyboss_legacy.php](/wordpress-threats/php-header-execution-backdoor-x-dns-prefetch_evidence-1.png "A one-line loader appears before the legitimate plugin-file code and reads three named HTTP headers. The image confirms the local injection, not a triggering request.")

## Confirmed findings

- A PHP line was present at the top of the observed `buddyboss_legacy.php` file.
- The line calls `getallheaders()` and checks for `X-Dns-Prefetch-Control`.
- It references `If-Unmodified-Since` and `Feature-Policy` from the same header collection.
- Values from the headers are used in nested dynamic calls.
- The value returned by the outer call is invoked again as a callable.

## Technical analysis of the header-gated loader

The three header names are legitimate HTTP concepts, but this PHP file does not use them for their normal web semantics. Instead, their values participate in callable selection and input transformation. That combined structure is the useful detection pivot.

### Dynamic callable flow

```text
Redacted defensive excerpt

headers = read_request_headers()

if a distinctive control header exists:
    transformed_value = call_function_named_by_header(
        empty_argument,
        call_second_function_named_by_header(third_header_value)
    )
    invoke(transformed_value)
```

This pseudocode deliberately omits an operational request format, header values, and a runnable PHP implementation. It describes only the control flow needed for defensive recognition.

### Why the local file matters

The earlier draft described execution without local traces. The screenshot contradicts that wording: the one-line loader is visibly stored in a local PHP file. A later payload might be supplied at request time, but the gating logic itself is a persistent file modification that can be found through integrity comparison or code search.

## Analyst assessment

This is consistent with a request-gated backdoor loader because untrusted header values determine callable operations and a returned callable is invoked. One plausible use would be to supply a decoder and a function-producing value through the headers. The repository does not retain the request needed to confirm that runtime sequence, so it remains analyst assessment rather than an observed execution claim.

## Indicators of compromise

### Higher-confidence indicators

- The combined header-name set `X-Dns-Prefetch-Control`, `If-Unmodified-Since`, and `Feature-Policy` inside PHP application code
- `getallheaders()` followed by nested dynamic callable use and a final invocation
- A compact injected line appearing before the legitimate body of a plugin file

### Contextual indicators

- `buddyboss_legacy.php`
- `getallheaders()`
- A PHP statement placed directly after an opening tag

The filename and `getallheaders()` are not malicious by themselves. Investigators should compare the file with a trusted copy and search for the full structural combination.

## What this evidence does not establish

- No triggering HTTP request was retained.
- The screenshot does not prove that the line executed.
- The specific runtime callables and payload were not observed.
- The initial compromise method was not confirmed.
- No plugin vulnerability or affected version was identified.
- The evidence does not establish campaign attribution, prevalence, or effects beyond this artifact.

## Artifact-specific remediation

Preserve the affected file and relevant access logs before replacement when investigation history matters. Replace the modified plugin component with a verified clean copy from its trusted source rather than editing only the one line. Search PHP files for the three-header combination and for the same nested callable shape.

Review recently modified plugins, themes, must-use plugins, administrator accounts, scheduled tasks, and server access. Rotate credentials relevant to the confirmed compromise scope. For the complete response process, use the broader [hidden backdoor investigation guide](/blog/i-found-a-hidden-backdoor-in-a-clients-wordpress-site/) or the [WordPress malware removal guide](/blog/wordpress-malware-removal-expert-guide-to-clean-hacked-wordpress-site/).

## Recurrence verification

- Compare the restored plugin directory with a trusted distribution.
- Repeat the structural code search after normal traffic and scheduled tasks.
- Review access logs for requests carrying the distinctive three-header combination, where logs retain header data.
- Confirm that the injected line does not reappear after cache clears, deployments, or administrator actions.

## Related malware research

- [wp-config.php XOR temporary-file loader](/malware-research/wp-config-xor-temporary-file-loader/)
- [SavvyWolf MANAGER PHP web-shell variant](/malware-research/savvywolf-manager-php-web-shell/)
- [PHP footer remote-content loader](/malware-research/php-footer-remote-content-loader/)

## Methodology and privacy note

This analysis uses one privacy-reviewed screenshot and the supplied line of PHP from an anonymized client investigation. The public excerpt is non-operational and does not reproduce a working request. Findings labeled confirmed are visible in that evidence; runtime behavior without a retained request is explicitly limited to analyst assessment.
