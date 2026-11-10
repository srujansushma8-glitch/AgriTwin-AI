import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "agritwin.db")
con = sqlite3.connect(db_path)
cur = con.cursor()

# Check users columns
user_cols = [c[1] for c in cur.execute("PRAGMA table_info(users)").fetchall()]
print("Current user columns:", user_cols)

if "email" not in user_cols:
    cur.execute("ALTER TABLE users ADD COLUMN email TEXT")
if "password_hash" not in user_cols:
    cur.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
if "mobile" not in user_cols:
    cur.execute("ALTER TABLE users ADD COLUMN mobile TEXT")
if "is_active" not in user_cols:
    cur.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1")
if "last_login" not in user_cols:
    cur.execute("ALTER TABLE users ADD COLUMN last_login TIMESTAMP")

# Check fields columns
field_cols = [c[1] for c in cur.execute("PRAGMA table_info(fields)").fetchall()]
print("Current field columns:", field_cols)

if "state" not in field_cols:
    cur.execute("ALTER TABLE fields ADD COLUMN state TEXT DEFAULT 'Karnataka'")
if "district" not in field_cols:
    cur.execute("ALTER TABLE fields ADD COLUMN district TEXT DEFAULT 'Mandya'")
if "village" not in field_cols:
    cur.execute("ALTER TABLE fields ADD COLUMN village TEXT DEFAULT 'Srirangapatna'")
if "boundary_geojson" not in field_cols:
    cur.execute("ALTER TABLE fields ADD COLUMN boundary_geojson TEXT")
if "elevation_m" not in field_cols:
    cur.execute("ALTER TABLE fields ADD COLUMN elevation_m REAL DEFAULT 670.0")

con.commit()
con.close()
print("Migration completed!")

