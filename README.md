# Cure Academy

In collaboration with NY Bioforce, Cure Academy connects selected students to hands-on, paid biomedical research experiences.

---

## 🛠️ Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Python + FastAPI
- Dev Environment: Docker + Docker Compose
- Secrets: `.env` files

---

## 🚀 Getting Started

> **Command Line Notes:**
> 
> The terminal commands in this README assume you're using a **Unix-like shell** (e.g., macOS Terminal, Linux, or Git Bash / WSL on Windows).

> If you're using **Windows Command Prompt** or **PowerShell**, some commands (like `cp` or `rm -rf`) may not work as-is. We recommend:
>
> - Installing [Git Bash](https://gitforwindows.org/)
> - Or using [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/)

### 1. Clone the Repo
Make sure you have [Git](https://git-scm.com/downloads) installed. You can check with: `git --version`

If you have git installed, you can run the following code in your terminal to clone the repository into your local computer:

```bash
git clone link
cd name
```

### 2. Set Up Environment Variables

**Never commit real .env files.** Use .env.example for reference for how to set up .env files.

Copy `.env.example` to `.env` in both `frontend/` and `backend/` folders, then fill in your own API keys.  

You can do this in the terminal:
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```
You do not have to fill out any API keys for the initial setup. Ask your associates for the API keys.

### 3. Set Up Docker Environment
Make sure you have Docker Desktop installed. You can check with: `docker --version` and `docker compose version`

To run the app locally:
```
docker-compose build --no-cache
docker-compose up
```
Frontend: http://localhost:5173

Backend (API): http://localhost:8000

FastAPI Docs: http://localhost:8000/docs

### 4. Testing the Frontend

Once the frontend container is running (via docker-compose up), you can test that everything is working as expected by:
1. Visit the following link in your browser. You should see the default React+Vite homepage: http://localhost:5173

2. Confirm Tailwind is working (there should be text on the screen that appears bolded and blue).

### 5. Test the Backend

You can test that the backend is working with a simple health check on the command line:
```
curl http://localhost:8000/ping
```
You should get back: `{"message":"pong"}`
> You can also use [Thunder Client](https://www.thunderclient.com/) (VS Code extension) or Postman if you don't have `curl`.

Or, you can open the following link in the browser: http://localhost:8000/docs

---

### Development Notes

Node modules are isolated in Docker via a named volume (node_modules_frontend)

Don’t manually install dependencies on your host machine

If something breaks, try:
```
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```