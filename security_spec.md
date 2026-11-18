# Security Specification — NIEL. Firestore Rules

## 1. Data Invariants
1. Public visitors can read portfolio `projects`, `learning_resources`, `public_profile` settings, and published `blog_posts` (`published == true`).
2. Unpublished draft `blog_posts` and `site_settings/ai_config` are readable exclusively by verified administrators.
3. Visitor `contact_messages` can be created by anyone if and only if strict field types, lengths, email format, and `createdAt == request.time` pass; reading, listing, updating, or deleting `contact_messages` is strictly restricted to admins (PII protection).
4. All portfolio mutations (`projects`, `blog_posts`, `learning_resources`, `site_settings`) require an authenticated admin with `request.auth.token.email_verified == true`.
5. No user can escalate privileges by writing to `/admins/{uid}`.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. Unauthenticated write to `/projects/hack-1`.
2. Signed-in non-admin user updating `/blog_posts/post-1`.
3. Unverified email admin token (`email_verified: false`) writing to `/site_settings/public_profile`.
4. Visitor reading `/contact_messages/msg-1` or listing `/contact_messages`.
5. Contact submission with ghost field `isAdmin: true` (blocked by `keys().hasOnly`).
6. Contact submission with 10,000-character message (blocked by `.size() <= 4000`).
7. Contact submission with spoofed past `createdAt` timestamp (blocked by `request.time`).
8. Unauthenticated user reading draft blog post where `published == false`.
9. Non-admin reading `/site_settings/ai_config`.
10. Non-admin creating `/admins/{uid}` self-elevation document.
11. Poisoned 500-char project ID (blocked by `isValidId`).
12. Unlisted/unknown collection `/secret_dump/doc1` access (blocked by default deny `/{document=**}`).
