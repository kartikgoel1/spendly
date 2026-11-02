# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

"Spendly" is a Flask expense-tracker built as a step-by-step learning project. Many pieces are intentionally unimplemented placeholders (e.g. `database/db.py` is just a docstring-style comment describing what to build; several routes in `app.py` return literal strings like `"Logout — coming in Step 3"`). Before implementing a feature, check whether it's marked as a future "Step" and confirm with the user whether they want it built now or want to do it themselves as a learning exercise.

## Commands

```bash
source venv/bin/activate        # virtualenv already exists at ./venv
pip install -r requirements.txt
python app.py                   # runs the dev server on http://localhost:5001 (debug=True)
pytest                          # run tests (pytest-flask is installed; no tests exist yet)
```

There is no lint/format tooling configured in this repo.

## Architecture

- **`app.py`** — single-file Flask app. All routes are defined directly on `app` (no blueprints). Currently only GET routes for `landing`, `register`, `login`, `terms`, `privacy` are implemented; `logout`, `profile`, and the `/expenses/...` CRUD routes are placeholders to be built in later steps.
- **`database/db.py`** — intended to hold `get_db()` (SQLite connection, row_factory + foreign keys enabled), `init_db()` (idempotent `CREATE TABLE IF NOT EXISTS`), and `seed_db()` (sample dev data). Not yet implemented. The SQLite file itself (`expense_tracker.db`) is gitignored and created at runtime, not committed.
- **`templates/`** — Jinja2 templates, all extending `templates/base.html`, which defines the shared nav/footer and `{% block title/head/content/scripts %}` blocks. Static assets are referenced via `url_for('static', filename=...)`.
- **`static/css/style.css`** — single global stylesheet (~700 lines) shared by all pages; no per-page CSS files or a build step.
- **`static/js/main.js`** — small vanilla JS file, no framework/bundler.

No JS/CSS build pipeline, no ORM — everything is plain Flask + Jinja2 + raw SQLite (once `db.py` is implemented).
