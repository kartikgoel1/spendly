# Spec: Login and Logout

## Overview
Make sign-in and sign-out work. `/login` currently only renders the form, and `/logout` returns the placeholder string `"Logout — coming in Step 3"`. This step adds POST handling to `/login`: look up the user by email, check the password with werkzeug's `check_password_hash`, and store the user in Flask's signed session cookie. `/logout` clears the session. The navbar changes based on whether someone is signed in. This is the first step that uses sessions, so the app also needs a `secret_key`. Later steps (profile, expense CRUD) depend on knowing who is signed in.

## Depends on
- Step 1: Database setup (`get_db()`, `users` table, seeded `demo@spendly.com` / `demo123` user)
- Step 2: Registration (users created with werkzeug-hashed passwords)

## Routes
- `GET /login`: render the sign-in form (public). Already exists. If someone is already signed in, redirect to `/profile`.
- `POST /login`: check the credentials. On success, set `session["user_id"]` and `session["user_name"]` and redirect to `/profile`. On failure, re-render `login.html` with `error` and the submitted email (public).
- `GET /logout`: clear the session and redirect to `/` (public; safe to hit while signed out). This replaces the placeholder.
- `GET /register`: unchanged, except that a signed-in user is redirected to `/profile`.

`/profile` stays a placeholder until Step 4. Showing its placeholder string after login is expected for now.

## Database changes
No database changes. The `users` table in `database/db.py` already has `id`, `name`, `email` (UNIQUE), and `password_hash`.

## Templates
- **Create:** none
- **Modify:**
  - `templates/login.html`: use `url_for('login')` for the form action. Keep the submitted email in the input after an error (`value="{{ email or '' }}"`). Never put the password back.
  - `templates/base.html`: in `.nav-links`, if `session.user_id` is set, show the user's name and a "Sign out" link (`url_for('logout')`). Otherwise show the existing "Sign in" / "Get started" links.

## Files to change
- `app.py`:
  - import `session` from flask and `check_password_hash` from `werkzeug.security`
  - set `app.secret_key` from the `SPENDLY_SECRET_KEY` env var, with a dev-only fallback string
  - `login()` accepts `methods=["GET", "POST"]`
  - move `logout()` out of the placeholder section and implement it
  - redirect signed-in users away from `register()` GET/POST
- `templates/login.html`
- `templates/base.html`

## Files to create
- `.claude/specs/03-login-logout.md` (this spec)

## New dependencies
No new dependencies. Flask's built-in `session` is enough. Don't add Flask-Login.

## Rules for implementation
- No SQLAlchemy or ORMs. Use `get_db()` from `database/db.py`
- Parameterised queries only
- Passwords hashed with werkzeug. Check them with `check_password_hash`, and never log or store the plain text
- Use CSS variables. Never hardcode hex values (reuse the existing `.auth-error`, `.form-input`, and nav classes; any new nav style goes in `static/css/style.css` and uses variables)
- All templates extend `base.html`
- Trim and lowercase `email` before the lookup, matching how Step 2 stores it
- Validation, in order:
  - Empty email or password → "Email and password are required."
  - Unknown email or wrong password → the same generic message for both: "Invalid email or password." (don't reveal which accounts exist)
- Don't apply the 8-character password rule at login (the seeded demo password is `demo123`)
- Call `session.clear()` before setting the session keys on login, and on logout
- Store only `user_id` and `user_name` in the session. Never store the password hash
- Always close the DB connection (try/finally)

## Definition of done
- [ ] `GET /login` still renders the form when signed out
- [ ] Signing in as `demo@spendly.com` / `demo123` redirects to `/profile`
- [ ] Signing in with the email in different case or with surrounding spaces (e.g. `  Demo@Spendly.com `) works
- [ ] A wrong password and an unknown email both show "Invalid email or password."
- [ ] Empty fields show "Email and password are required."
- [ ] After an error, the email field stays filled and the password field is empty
- [ ] While signed in, the navbar shows the user's name and "Sign out", not "Sign in" / "Get started"
- [ ] While signed in, visiting `/login` or `/register` redirects to `/profile`
- [ ] Clicking "Sign out" lands on `/` and the navbar shows "Sign in" / "Get started" again
- [ ] Visiting `/logout` while signed out redirects to `/` without an error
- [ ] A user registered through `/register` can then sign in with their password
- [ ] The app starts without errors and the other pages are unaffected
