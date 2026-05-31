# Cure Academy — Backend

A lightweight FastAPI backend that powers the Cure Academy listserv (email subscriber list).

---

## What It Does

When a visitor enters their email on the Apply page and clicks **Subscribe**, it gets saved to a local SQLite database (`listserv.db`). You can view all subscribers and unsubscribe people at any time — all through the FastAPI docs UI.

---

## Running the Backend

### With Docker (recommended)

```bash
docker-compose up
```

Backend runs at `http://localhost:8000`. Frontend runs at `http://localhost:5173`.

### Without Docker

```bash
pip3 install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```
ADMIN_KEY=yourchosenpassword
```

No quotes around the value. This password protects the subscriber list and unsubscribe endpoints.

---

## API Endpoints

| Method | Endpoint | Auth required | What it does |
|--------|----------|---------------|--------------|
| `GET` | `/ping` | No | Health check |
| `POST` | `/listserv/subscribe` | No | Add a new email subscriber |
| `GET` | `/listserv/subscribers` | Yes | View all active subscribers |
| `DELETE` | `/listserv/unsubscribe/{email}` | Yes | Deactivate a subscriber |

---

## How to Use the Docs UI

Everything can be done at:

```
http://localhost:8000/docs
```

### 1. Authorize (do this first)

Click the **🔒 Authorize** button at the top right, enter your `ADMIN_KEY` value, and click Authorize. This unlocks the protected endpoints for your session.

### 2. Check the backend is running

Open `GET /ping` → **Try it out** → **Execute**. You should get:
```json
"pong"
```

### 3. View subscribers

Open `GET /listserv/subscribers` → **Try it out** → **Execute**. The full subscriber list appears in the Response body. Click **Download** to save it as a `.json` file.

### 4. Export subscribers

**As CSV (recommended — opens directly in Excel/Google Sheets):**
Open `GET /listserv/subscribers/csv` → **Try it out** → **Execute** → **Download**.

**As JSON:**
Open `GET /listserv/subscribers` → **Try it out** → **Execute** → **Download**.

### 5. Subscribe a test email

Open `POST /listserv/subscribe` → **Try it out**. Replace `user@example.com` in the request body with any email → **Execute**. A `200` response means it worked.

### 6. Unsubscribe someone

Open `DELETE /listserv/unsubscribe/{email}` → **Try it out**. Type the email in the field (plain `name@example.com`, Swagger handles the `@` encoding) → **Execute**. You'll get:
```json
{ "message": "Unsubscribed successfully" }
```

This sets the subscriber to inactive — they won't appear in the list but the record is kept in the database.

---

## File Structure

```
backend/
├── app/
│   ├── main.py          # App entry point, registers all routes
│   ├── db.py            # Database setup and connection
│   └── routes/
│       ├── ping.py      # Health check route (/ping)
│       └── listserv.py  # All subscriber routes
├── .env                 # Your ADMIN_KEY (never commit this)
├── listserv.db          # SQLite database (auto-created on first run)
├── requirements.txt     # Python dependencies
└── Dockerfile
```

---

## Rebuilding After Changes

Any time you change Python files or `requirements.txt`:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```