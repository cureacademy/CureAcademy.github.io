import io
import os
import csv
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from app.db import get_db
from fastapi import APIRouter, HTTPException, Security
from fastapi.security import APIKeyQuery
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/listserv", tags=["listserv"])

load_dotenv()
ADMIN_KEY = os.getenv("ADMIN_KEY", "")

api_key_query = APIKeyQuery(name="key", auto_error=False)

class SubscribeRequest(BaseModel):
    email: EmailStr

@router.get("/subscribers")
def list_subscribers(key: str = Security(api_key_query)):
    if not ADMIN_KEY or key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    conn = get_db()
    rows = conn.execute(
        "SELECT email, subscribed_at FROM subscribers WHERE active = 1 ORDER BY subscribed_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/subscribers/csv")
def export_subscribers_csv(key: str = Security(api_key_query)):
    if not ADMIN_KEY or key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    conn = get_db()
    rows = conn.execute(
        "SELECT email, subscribed_at FROM subscribers WHERE active = 1 ORDER BY subscribed_at DESC"
    ).fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["email", "subscribed_at"])
    writer.writerows([(r["email"], r["subscribed_at"]) for r in rows])
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=subscribers.csv"}
    )

@router.post("/subscribe")
def subscribe(req: SubscribeRequest):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO subscribers (email) VALUES (?)", (req.email,)
        )
        conn.commit()
        return {"message": "Subscribed successfully", "email": req.email}
    except Exception:
        row = conn.execute(
            "SELECT active FROM subscribers WHERE email = ?", (req.email,)
        ).fetchone()
        if row and row["active"] == 0:
            conn.execute(
                "UPDATE subscribers SET active = 1 WHERE email = ?", (req.email,)
            )
            conn.commit()
            return {"message": "Subscribed successfully", "email": req.email}
        raise HTTPException(status_code=409, detail="This email is already subscribed.")
    finally:
        conn.close()
@router.delete("/unsubscribe/{email}")
def unsubscribe(email: str, key: str = Security(api_key_query)):
    if not ADMIN_KEY or key != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    conn = get_db()
    conn.execute("UPDATE subscribers SET active = 0 WHERE email = ?", (email,))
    conn.commit()
    conn.close()
    return {"message": "Unsubscribed successfully"}