import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.database import init_db, seed_demo_data

print("Seeding database...")
init_db()
seed_demo_data()
print("Seeding finished!")

