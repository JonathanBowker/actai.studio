# Phase 2 Completion Report

Date: 5 October 2026

## Delivery status

The integrated review branch is `review/phase-2-integration`. The staging app is running the branch on DigitalOcean App Platform as a Node.js service.

| Item | Status | Result |
| --- | --- | --- |
| J1-J4 | Complete | The overlay is retired. Calls to action route to `/contact` and read `Request a 30-minute call`. The hero now includes the same action. |
| J5 | Complete on staging | The form sends through Amazon SES. It uses a honeypot and server-side rate limit, stores no submissions, and confirms success only after SES returns a MessageId. |
| J6 | Complete | `/meeting` returns a permanent redirect to `/contact`. Pack links use `/contact`. |
| C1-C5 | Complete | The approved offer, navigation, governance and value copy is in place. Unsourced results are hidden in production and marked on staging. |
| C6 | Held | The sector list is unchanged until the final sectors are confirmed. |
| C7-C8 | Complete | Director lines are updated. Practice cards and the FAQ link to agent diagnostics. |
| T1-T5 | Complete | Canonicals, staging noindex, page metadata, privacy disclosures, naming and carousel accessibility are in place. |
| T6 | Complete | Lighthouse was rerun against staging and the production build. Results are below. |
| T7 | Reported | Event plumbing exists, but no analytics provider or analytics script is installed. |
| T8 | Closed by decision | Company number, registered office and place-of-registration lines were removed from every footer. |

## Contact delivery test

A real staging request was sent through:

`POST https://actai-studio-6muso.ondigitalocean.app/api/contact`

Result:

```text
HTTP/2 200
{"ok":true,"message":"Thank you. Your note has been sent."}
```

The endpoint can return success only after Amazon SES supplies a MessageId. The message used `results@advancedanalytica.co.uk` as the verified sender and `jonathan@advancedanalytica.co.uk` as the destination.

## Lighthouse

| Target | Mode | Performance | Accessibility | Best practices | SEO | LCP |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Staging | Mobile | 82 | 100 | 96 | 69 | 4.3 s |
| Staging | Desktop | 95 | 100 | 96 | 69 | 0.5 s |
| Production build | Mobile | 69 | 100 | 96 | 100 | 18.8 s |
| Production build | Desktop | 78 | 100 | 96 | 100 | 3.0 s |

Staging SEO is lower by design because the deployment contains `noindex,nofollow`. The production build contains `index,follow`. Large hero media remains the main production-build performance constraint.

## Staging edge inspection

The public staging response included:

```text
server: cloudflare
cf-cache-status: BYPASS
cf-ray: a459f58f4af08560-LHR
x-do-orig-status: 200
```

Cloudflare sets the essential `__cf_bm` bot-management cookie and injects its email-address obfuscation script at `/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js`. No Cloudflare analytics beacon or third-party analytics script was found.

## Email DNS

The current verified SES sender is `advancedanalytica.co.uk`. Its required records are already present:

- SPF for the custom MAIL FROM domain: `mail.advancedanalytica.co.uk TXT "v=spf1 include:amazonses.com ~all"`
- MAIL FROM MX: `mail.advancedanalytica.co.uk MX 10 feedback-smtp.eu-west-2.amazonses.com`
- DKIM CNAME: `tmiu5w25wmbp7vg3eoap2thcazkmo3fn._domainkey` to `tmiu5w25wmbp7vg3eoap2thcazkmo3fn.dkim.amazonses.com`
- DKIM CNAME: `5zakss5g3s3roghb7thhqvlxleuducdq._domainkey` to `5zakss5g3s3roghb7thhqvlxleuducdq.dkim.amazonses.com`
- DKIM CNAME: `nushebphytsprqromhys2yl5mygbcjoj._domainkey` to `nushebphytsprqromhys2yl5mygbcjoj.dkim.amazonses.com`

Amazon SES reports production access enabled, sending enabled, DKIM successful and the custom MAIL FROM domain successful in `eu-west-2`.

## Domain

DigitalOcean now treats `actai.studio` as the app's primary domain. Route 53 change `C08916871699DMDYPSE1Y` is live with the DigitalOcean App Platform A and AAAA records. DNS resolves correctly and the managed HTTPS certificate is active. The Node server selects production or staging behaviour from the request hostname, so `actai.studio` hides review placeholders and permits indexing while the DigitalOcean hostname shows placeholders and emits `noindex,nofollow`.

## Remaining inputs

- Confirm the final C6 sectors.
- Supply sources, a client quote and a case study before C4 can appear in production.
