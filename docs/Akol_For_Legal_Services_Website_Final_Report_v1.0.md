# Akol For Legal Services Website Completion and Technical Handover Report

**Client:** Akol For Legal Services  
**Prepared by:** Sky High Tech  
**Production domain:** https://www.akolforlegalservices.com  
**Version:** v1.0  
**Date:** July 15, 2026

## Table of Contents

- 2. Executive Summary
- 3. Project Background
- 4. Website Scope
- 5. Website Structure and Pages
- 6. Functional Features
- 7. Contact Form Architecture
- 8. Technology Stack
- 9. System Architecture
- 10. Domain and Hosting Configuration
- 11. SEO Implementation
- 12. Accessibility and User Experience
- 13. Security Measures
- 14. Testing and Quality Assurance
- 15. Deployment Process
- 16. Environment and Configuration Guide
- 17. Administration and Maintenance Guide
- 18. Backup and Recovery
- 19. Known Limitations and Remaining Actions
- 20. Future Enhancement Recommendations
- 21. Final Readiness Assessment
- 22. Final Verdict
- 23. Handover Checklist
- 24. Appendices

## 1. Cover Page

Project name: Akol For Legal Services Website

Client name: Akol For Legal Services

Developed by: Sky High Tech

Production domain: https://www.akolforlegalservices.com

Document title: Website Completion and Technical Handover Report

Version: v1.0

Date: July 15, 2026

Confidentiality and intended use: This report is prepared for Akol For Legal Services and Sky High Tech for project handover, operational reference, deployment readiness, and future maintenance planning. It should not be used to disclose credentials, private tokens, or account access details.

## 2. Executive Summary

The website provides Akol For Legal Services with a professional public presence for presenting the firm, explaining practice areas, sharing contact details, and collecting enquiries through a secure contact form.

The business value is a clearer digital first impression, easier client contact, and a public channel for potential clients to understand the firm's services before initiating a legal consultation.

Current completion status: the implemented codebase is production-ready from a frontend, validation, build, and serverless-contact architecture perspective. External email and domain configuration still require human setup and confirmation.

Major implemented features include responsive pages, header and footer navigation, a mobile menu, clickable phone and email links, a validated contact form, a Vercel serverless contact endpoint, Resend email delivery integration, SEO metadata, robots.txt, sitemap.xml, security headers, linting, tests, and a production build.

Production-readiness verdict: ready after external email configuration and final production contact-form testing.

## 3. Project Background

The website was developed to give Akol For Legal Services a polished and accessible online presence that communicates credibility, core services, and contact options.

The intended audience includes individuals, businesses, institutions, and prospective clients seeking legal advice or representation in South Sudan.

The main communication objectives are to introduce the firm, explain legal service areas, provide direct contact methods, and encourage qualified enquiries.

The website strengthens the firm's professional presence by presenting consistent branding, structured service information, and a secure enquiry pathway through the contact form.

## 4. Website Scope

| Category | Scope |
| --- | --- |
| Included features | Public informational pages, custom frontend routing, responsive layout, header/footer navigation, mobile menu, CTA links, phone and email links, contact form, serverless contact API, Resend integration, SEO files, security headers, lint/test/build scripts. |
| Not included | Online booking, payments, client portal, CMS, blog publishing system, analytics dashboard, multilingual content, legal document upload workflow, live chat, WhatsApp integration, case management, authentication, database storage. |
| Current boundaries | Static public website plus serverless email submission. Contact submissions are emailed and not stored in a database. |
| Future options | Booking, WhatsApp, blog/legal updates, analytics, CMS, testimonials, multilingual support, privacy/cookie controls, advanced anti-spam controls, and enquiry dashboard. |

## 5. Website Structure and Pages

| Route or area | Purpose | Main content | Primary calls to action |
| --- | --- | --- | --- |
| / | Homepage and first impression. | Firm positioning, service preview, values, contact summary, firm logo. | Request Consultation; View Services. |
| /about | Introduce the firm and working style. | Background, client commitment, values. | Encourages confidence and later contact. |
| /services | Present implemented practice areas. | Corporate and Commercial Law, Dispute Resolution, Regulatory and Compliance, Real Estate and Land, Employment and Immigration, Private Client Services. | Start a Matter. |
| /team | Present current team and capability structure. | Legal Counsel, Corporate Advisory Desk, Dispute Resolution Desk. | Supports trust before contact. |
| /contact | Collect enquiries and show direct contact methods. | Contact details, hours, validated contact form. | Send Message. |
| Fallback page | Handle unknown routes. | 404 message and homepage link. | Go Home. |
| Header/footer | Site-wide navigation and contact access. | Logo, nav links, mobile menu, footer links, phone, email, address. | Navigate to pages; call or email the firm. |

## 6. Functional Features

| Feature | Actual implementation |
| --- | --- |
| Navigation | Custom lightweight router using browser history, popstate, and an app:navigate event. No external routing package is currently used. |
| Responsive design | CSS grid/flex layouts with media queries for desktop, tablet, and mobile. |
| Mobile menu | Header menu button toggles nav visibility and updates aria-expanded. |
| Contact links | Phone links use tel:+211923433113. Email links use mailto:info2026akollegalservices@gmail.com. WhatsApp links use https://wa.me/211912374000 with a default enquiry message. |
| Calls to action | Homepage and services CTA links route to contact or services pages. |
| Contact form | React controlled form with name, email, phone, subject, message, and hidden honeypot company field. |
| Validation | Shared frontend/server validation covers required fields, email format, phone format, message minimum length, and input length limits. |
| Feedback states | The form shows loading text, success messages, error messages, and field-level validation errors. |
| Duplicate prevention | The submit handler returns early while sending and disables form fields/button during submission. |
| Spam protection | Honeypot field plus basic in-memory IP rate limiting in the serverless function. |

## 7. Contact Form Architecture

Submission flow: Website visitor -> React contact form -> frontend validation -> POST /api/contact -> Vercel serverless function -> server-side validation -> honeypot/rate-limit checks -> Resend email API -> law firm recipient inbox.

The frontend validates the form before sending and displays errors without contacting the API when required fields or formats are invalid.

The API route validates the same fields server-side, rejects invalid JSON, rejects unsupported methods, checks the hidden honeypot field, and applies a basic request limit by client IP for a 15-minute window.

If validation passes, the API reads RESEND_API_KEY, CONTACT_RECIPIENT_EMAIL, and CONTACT_FROM_EMAIL from server-side environment variables. It uses the visitor's email as reply_to and sends both text and safely escaped HTML email content through Resend.

Success is returned only when Resend accepts the request. If Resend rejects the request, the API returns a provider failure message instead of claiming success.

| Environment variable | Purpose |
| --- | --- |
| RESEND_API_KEY | Secret API key used by the serverless function to authenticate with Resend. |
| CONTACT_RECIPIENT_EMAIL | Recipient inbox for website enquiry emails. |
| CONTACT_FROM_EMAIL | Verified Resend sender address used in outbound emails. |

Secrets are not stored in frontend code and are not committed to Git. .env and .env.* are ignored, while .env.example is committed as a template.

## 8. Technology Stack

| Technology | Actual use | Suitability |
| --- | --- | --- |
| React 19 | Frontend UI components and stateful contact form. | Appropriate for a modern responsive marketing and enquiry website. |
| Vite 8 | Development server and production bundling. | Fast builds and simple static deployment output. |
| JavaScript | Application, validation, and serverless API code. | Keeps the project compact and consistent across frontend and API. |
| CSS | Custom responsive styling, layout, focus states, and brand presentation. | Avoids unnecessary UI framework weight for a small site. |
| Custom router | Lightweight client-side routing in src/router and src/utils/router.js. | Removes need for a routing dependency for the current route set. |
| Vercel | Intended hosting platform for frontend and serverless function. | Matches the serverless /api/contact implementation and static frontend deployment. |
| Vercel serverless functions | api/contact.js handles secure email submission. | Protects secrets on the server side. |
| Resend | Email delivery provider for contact submissions. | Modern transactional email API suitable for website forms. |
| ESLint | Code quality check via npm run lint. | Catches syntax and common JavaScript/React issues before deployment. |
| Node test runner | Tests contact validation and safe email rendering. | No extra dependency required for current unit tests. |
| Git and GitHub | Expected source control and remote backup process. | Recommended for deployment traceability; the inspected local folder was not recognized as a Git repository, so repository status requires manual confirmation. |
| Other dev dependencies | @vitejs/plugin-react, @rolldown/plugin-babel, Babel React Compiler preset, React type packages, React Hooks/Refresh ESLint plugins, globals. | Support development, build, linting, and React compiler behavior. |

## 9. System Architecture

Text architecture diagram:

Website visitor -> React frontend -> Vercel hosting/CDN -> Vercel serverless contact endpoint -> Resend -> Law firm email inbox

| Layer | Description |
| --- | --- |
| Frontend layer | React/Vite static site rendered in the browser with custom routing and responsive CSS. |
| API layer | Vercel serverless function at /api/contact that validates and sends messages. |
| Email-delivery layer | Resend API accepts outbound email requests from the serverless function. |
| DNS and domain layer | Production domain is www.akolforlegalservices.com. DNS values require confirmation in Bluehost and Vercel. |
| Deployment layer | Vercel build should run npm run build and serve the generated dist output plus /api serverless functions. |

## 10. Domain and Hosting Configuration

| Item | Status |
| --- | --- |
| Primary domain | https://www.akolforlegalservices.com is used in canonical, Open Graph, robots.txt, and sitemap.xml. |
| Root-domain redirect | Requires manual confirmation in Vercel and DNS. The codebase does not prove the live redirect behavior. |
| Vercel project domain | Requires manual confirmation from the Vercel dashboard. |
| Bluehost DNS management | Referenced as required infrastructure but not verifiable from the codebase. |
| Root A record | Requires manual confirmation. Configure according to current Vercel instructions if using apex/root domain. |
| www CNAME record | Requires manual confirmation. Typically points www to the Vercel-assigned target. |
| HTTPS/SSL | Expected to be handled by Vercel once the domain is connected and verified; must be confirmed after deployment. |
| DNS propagation | May take minutes to 48 hours depending on registrar/TTL behavior. |

## 11. SEO Implementation

| SEO item | Implementation |
| --- | --- |
| Page title | Akol For Legal Services \| South Sudan Law Firm. |
| Meta description | Present in index.html and describes the legal services offering. |
| Canonical URL | https://www.akolforlegalservices.com/. |
| Open Graph metadata | og:type, og:url, og:title, og:description, and og:image are present. |
| Twitter metadata | summary card, title, and description are present. |
| Favicon | Official Akol logo favicon.ico, favicon-32x32.png, favicon-16x16.png, and apple-touch-icon.png. |
| robots.txt | Allows indexing and references the sitemap. |
| sitemap.xml | Lists /, /about, /services, /team, and /contact. |
| Semantic HTML | Uses header, nav, main, section, article, aside, footer, address, headings, labels, and buttons. |
| Image alt text | Implemented for the firm logo images. |
| Indexing readiness | Ready at code level; live indexing depends on deployment, domain resolution, and search-engine crawl timing. |

## 12. Accessibility and User Experience

| Area | Implementation or limitation |
| --- | --- |
| Responsive layouts | Verified at mobile, tablet, laptop, and large viewport widths with no horizontal overflow in browser checks. |
| Keyboard navigation | Native links, buttons, inputs, and visible focus styles are implemented through CSS focus-visible. |
| Form labels | All visible form inputs and textarea have associated labels. |
| Contrast | Dark slate background with white/silver text and amber accents. No automated contrast audit was run, but visual contrast is intentionally high. |
| Loading states | Submit button changes to Sending... and form controls are disabled while submitting. |
| Error messages | Field-level errors and form-level alert/status messages are present. |
| Mobile usability | Mobile menu, responsive grids, and full-width mobile buttons are implemented. |
| Clickable contacts | Phone and email links are clickable in content and footer. |
| Limitations | No formal WCAG audit with assistive technology was completed. No automated axe or screen-reader test is included. |

## 13. Security Measures

| Implemented control | Details |
| --- | --- |
| Server-side environment variables | Resend and recipient configuration are read from process.env in api/contact.js. |
| No exposed API keys | The frontend posts to /api/contact and does not contain RESEND_API_KEY. |
| Input validation | Frontend and server validate required fields, email, phone, minimum message length, and max lengths. |
| Message-length limits | Name 80, email 254, phone 32, subject 120, message 2500 characters. |
| Honeypot | Hidden company field triggers accepted no-op behavior for likely bot submissions. |
| Rate limiting | Basic in-memory IP limit of 5 requests per 15 minutes per function instance. |
| Safe rendering | HTML email content escapes user-submitted values. |
| HTTP headers | Vercel config sets nosniff, referrer policy, frame deny, permissions policy, and HSTS. |
| Git ignore | .env and .env.* are ignored; .env.example remains trackable. |

Recommended future improvements: durable rate limiting backed by external storage, CAPTCHA or managed bot protection if spam increases, monitoring/alerting for email failures, dependency update cadence, formal security review, and privacy/cookie notices if analytics or tracking are added.

## 14. Testing and Quality Assurance

| Check | Result |
| --- | --- |
| npm run lint | Passed on July 15, 2026. |
| npm test | Passed 3 tests on July 15, 2026. |
| npm run build | Passed on July 15, 2026. Production bundle generated successfully. |
| Browser-width checks | Previously verified at 390, 768, 1366, and 1920 widths with no horizontal overflow. |
| Mobile-menu verification | Previously verified menu opens and aria-expanded updates. |
| Console error checks | Previously verified no browser console errors/warnings during local checks. |
| Contact API mocked acceptance | Previously verified mocked Resend OK response returns success. |
| Invalid payload rejection | Previously verified invalid payload returns 400 with field errors. |

Test scope: static build, linting, validation tests, safe HTML escaping test, local browser responsiveness, menu behavior, and contact API logic with mocked email provider.

Test limitations: no live production deployment test, no real Resend delivery test, no DNS/SSL verification, no formal accessibility audit, no end-to-end test suite connected to a real Vercel deployment.

Recommended final production tests: submit a real contact form after Vercel environment variables are configured, confirm inbox delivery and reply-to behavior, test root-domain redirect and HTTPS, test mobile devices, and check spam/junk folder placement.

## 15. Deployment Process

Recommended process:

1. Commit the current codebase to Git.

2. Push the repository to GitHub or the configured remote source.

3. Connect the repository to Vercel if not already connected.

4. Configure RESEND_API_KEY, CONTACT_RECIPIENT_EMAIL, and CONTACT_FROM_EMAIL in Vercel.

5. Redeploy the production site after environment variables are added.

6. Connect and verify the custom domain in Vercel.

7. Confirm DNS records in Bluehost or the active DNS provider.

8. Verify HTTPS/SSL and root-to-www redirect behavior.

9. Submit a real contact form and confirm delivery to the recipient inbox.

## 16. Environment and Configuration Guide

| Variable | Purpose | Example format | Secret | Configure in |
| --- | --- | --- | --- | --- |
| RESEND_API_KEY | Authenticates serverless function with Resend. | re_xxxxxxxxxxxxx | Yes | Vercel Environment Variables |
| CONTACT_RECIPIENT_EMAIL | Inbox receiving contact submissions. | office@example.com | No, but operationally sensitive | Vercel Environment Variables |
| CONTACT_FROM_EMAIL | Verified sender address for Resend. | Akol For Legal Services <website@example.com> | No | Vercel Environment Variables |

Do not place real API keys in .env.example, frontend files, screenshots, documents, or Git commits.

## 17. Administration and Maintenance Guide

| Task | Where to update |
| --- | --- |
| Update page content | Edit the relevant files in src/pages/. |
| Change phone/email/address | Edit src/data/siteData.js. |
| Update team members | Edit the team array in src/data/siteData.js. |
| Add or revise services | Edit the services array in src/data/siteData.js. |
| Update SEO metadata | Edit index.html, public/robots.txt, and public/sitemap.xml as needed. |
| Replace images | Replace or add files in src/assets or public and update imports/links. |
| Review deployments | Use the Vercel dashboard for build logs, deployment history, and domain status. |
| Rotate Resend API key | Create a new key in Resend, update RESEND_API_KEY in Vercel, redeploy, and revoke the old key. |
| Change recipient inbox | Update CONTACT_RECIPIENT_EMAIL in Vercel and redeploy if required. |
| Renew domain | Use the registrar/DNS provider account. Bluehost was named in the requested handover scope but must be manually confirmed. |
| Monitor form delivery | Check Resend activity logs, recipient inbox, spam folder, and Vercel function logs. |

## 18. Backup and Recovery

The recommended source backup is a GitHub repository containing the website source code. The current inspected local folder was not recognized as a Git repository, so source-control status must be confirmed.

Vercel deployment history can serve as an operational rollback point after the project is connected and deployed.

Environment variables should be documented securely outside the repository. Do not store real secrets in this report or in Git.

DNS and domain settings should be recorded by the account owner, including registrar, DNS provider, root record, www record, Resend DNS records, and renewal dates.

Recovery after a failed deployment: revert to the last known good Git commit or Vercel deployment, confirm environment variables, redeploy, verify the site loads, and run the production contact-form test.

## 19. Known Limitations and Remaining Actions

| Item | Status |
| --- | --- |
| Resend account setup | Requires human confirmation. |
| Resend sending-domain verification | Required before using a production sender domain. |
| Bluehost DNS records for Resend | Requires manual setup/confirmation if Bluehost is the active DNS provider. |
| Creation of Resend API key | Requires human action in Resend. |
| Vercel environment variables | Must be entered in Vercel before production form delivery works. |
| Real production contact-form test | Still required after deployment and environment configuration. |
| Email delivery/spam-folder confirmation | Still required with the recipient inbox. |
| Git/GitHub status | Local folder was not recognized as a Git repository during inspection; repository status requires confirmation. |
| Rate limiting | Implemented in memory only; for high traffic, use durable storage or a managed edge/bot-protection service. |
| Accessibility | Good baseline implementation, but no formal WCAG audit or screen-reader test has been completed. |

## 20. Future Enhancement Recommendations

| Priority | Recommendations |
| --- | --- |
| Immediate | Complete Resend verification, Vercel environment setup, production contact-form test, DNS/SSL verification, and client approval review. |
| Medium-term | Add analytics, privacy/cookie controls if tracking is introduced, CMS integration for easier content updates, testimonials, blog/legal updates, and enhanced anti-spam protection. |
| Optional long-term | Legal consultation booking, WhatsApp integration, client enquiry dashboard, multilingual support, case-study content, client portal, and richer performance monitoring. |

These recommendations are not currently implemented and should be scoped separately.

## 21. Final Readiness Assessment

| Area | Status | Notes |
| --- | --- | --- |
| Design | Complete | Professional responsive visual identity is implemented. |
| Responsiveness | Complete | Browser checks found no overflow at tested widths. |
| Functionality | Complete | Navigation, CTAs, contact links, and form behavior are implemented. |
| Contact form | Complete pending external configuration | Code is complete; Resend/Vercel production variables and real delivery test remain. |
| SEO | Complete | Core metadata, sitemap, robots, favicon, and canonical domain are implemented. |
| Accessibility | Partially complete | Baseline semantics and labels are implemented; formal WCAG audit remains. |
| Security | Complete with recommended future improvements | Secrets server-side, validation, escaping, honeypot, rate limiting, and headers are implemented. |
| Testing | Complete for local scope | Lint, tests, build, local browser checks, and mocked API checks passed. |
| Deployment | Complete pending external configuration | Vercel-ready code exists; actual deployment/domain/email setup requires confirmation. |
| Documentation | Complete | This handover report plus README and .env.example are present. |

## 22. Final Verdict

The website is ready after external email configuration.

The codebase is ready for public production use on Vercel once the Resend sending domain, Resend API key, Vercel environment variables, DNS/domain setup, HTTPS, and real production contact-form delivery are confirmed.

It should not be considered fully operational for client enquiries until the production contact form has been tested with the real recipient inbox.

## 23. Handover Checklist

- [ ] Code committed

- [ ] GitHub updated

- [ ] Vercel deployment complete

- [ ] Custom domain verified

- [ ] SSL active

- [ ] Resend domain verified

- [ ] Environment variables configured

- [ ] Contact form production-tested

- [ ] Recipient confirmed

- [ ] Client approval received

- [ ] Maintenance responsibility confirmed

## 24. Appendices

| Key directory or file | Purpose |
| --- | --- |
| src/pages/ | Page-level React components. |
| src/components/ | Reusable layout and common components. |
| src/data/siteData.js | Contact details, nav links, services, values, and team data. |
| src/utils/contactValidation.js | Shared contact-form validation rules. |
| src/utils/router.js | Lightweight client-side navigation helpers. |
| api/contact.js | Vercel serverless contact endpoint. |
| public/robots.txt | Search crawler instruction file. |
| public/sitemap.xml | Search-engine sitemap. |
| vercel.json | SPA rewrite and security headers. |
| .env.example | Environment variable template. |
| test/contactValidation.test.js | Node tests for validation and safe email rendering. |

| Command | Purpose |
| --- | --- |
| npm install | Install dependencies. |
| npm run dev | Start local development server. |
| npm run lint | Run ESLint. |
| npm test | Run Node tests. |
| npm run build | Create production build. |
| npm run preview | Preview production build locally. |

Environment-variable template: RESEND_API_KEY=, CONTACT_RECIPIENT_EMAIL=, CONTACT_FROM_EMAIL=.

Manual test checklist: visit every page, open/close mobile menu, click phone/email links, submit empty contact form, submit valid contact form after environment setup, confirm email delivery, confirm reply-to, verify HTTPS, verify root/www domain behavior, check mobile and desktop layouts.

Contact-form data flow: visitor input -> frontend validation -> /api/contact -> server validation -> spam checks -> Resend -> recipient inbox -> user-facing success or error response.

Glossary: Vercel is the hosting/deployment platform; serverless function is backend code that runs on demand; Resend is the email delivery provider; environment variable is a private deployment setting; DNS connects a domain name to hosting/email services; SSL/HTTPS encrypts website traffic; sitemap helps search engines find pages.

_Prepared by Sky High Tech - Technology Made Simple_
