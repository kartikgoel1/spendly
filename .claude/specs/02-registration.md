# Spec: Registration

## Overview
Make the existing "Create account" page work. `/register` currently only renders the form. This step adds POST handling: validate the input, reject duplicate emails, hash the password with werkzeug, insert the user into the `users` table built in Step 1, and send the user to the login page. Login/logout and sessions come in Step 3, so registration does not log the user in.

## Depends on
- Step 1: Database setup (`get_db()`, `users` table with a UNIQUE email)

## Routes
- `GET /register`: render the registration form (public). Already exists.
- `POST /register`: validate the input and create the user. On success, redirect to `/login`. On failure, re-render `register.html` with `error` and the submitted name/email (public).

## Database changes
No database changes. The `users` table in `database/db.py` already has `name`, `email` (UNIQUE NOT NULL), `password_hash`, and `created_at`.

## Templates
- **Create:** none
- **Modify:** `templates/register.html`. Keep the submitted `name` and `email` in the inputs after an error (`value="{{ name or '' }}"`). Never put the password back. Use `url_for('register')` for the form action.

## Files to change
- `app.py`: `register()` accepts `methods=["GET", "POST"]`; import `request`, `redirect`, and `url_for` from flask, and `generate_password_hash` from `werkzeug.security`
- `templates/register.html`

## Files to create
- None (besides this spec)

## New dependencies
No new dependencies.

## Rules for implementation
- No SQLAlchemy or ORMs. Use `get_db()` from `database/db.py`
- Parameterised queries only
- Passwords hashed with werkzeug (`generate_password_hash`). Never store or log the plain text
- Use CSS variables. Never hardcode hex values (reuse the existing `.auth-error` and `.form-input` classes)
- All templates extend `base.html`
- Trim `name` and `email`, and lowercase `email` before validating or storing
- Validation, checked server-side in this order, stopping at the first error:
  - All fields required → "All fields are required."
  - Email must contain `@` and a `.` after it → "Please enter a valid email address."
  - Password must be at least 8 characters → "Password must be at least 8 characters."
- Duplicate email: catch `sqlite3.IntegrityError` on INSERT → "An account with that email already exists."
- Always close the DB connection (try/finally)

## Definition of done
- [ ] `GET /register` still renders the form
- [ ] Submitting valid data creates a row in `users` with a hashed `password_hash` (starts with `scrypt:` or `pbkdf2:`, not the plain password)
- [ ] After a successful registration the browser lands on `/login`
- [ ] Registering `demo@spendly.com` (or the same email in different case) shows "An account with that email already exists." and creates no row
- [ ] Empty fields, an invalid email, or a password under 8 characters show the matching error on the form
- [ ] After an error, the name and email fields stay filled and the password field is empty
- [ ] The app starts without errors and the other pages are unaffected
