# YENETA

## Email notifications

The server sends emails for:
- Enrollment confirmed (after successful enrollment creation, including Stripe webhook)
- Course completed (includes a PDF certificate attachment)

### Required server env vars

- EMAIL_USER (e.g. your Gmail address)
- EMAIL_PASSWORD (Gmail App Password)

### Optional server env vars

- EMAIL_SERVICE (default: gmail)
- EMAIL_FROM (default: EMAIL_USER)
- APP_NAME (default: Yeneta)
- FRONTEND_URL (used for buttons/links in emails)
- CERT_VERIFY_URL (printed on the PDF certificate)
