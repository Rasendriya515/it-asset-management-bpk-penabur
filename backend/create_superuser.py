from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    
    email = "admin@bpkpenabur.id"
    password = "admin123"
    
    user = db.query(User).filter(User.email == email).first()
    if user:
        print(f"User {email} sudah ada!")
        return

    new_user = User(
        email=email,
        full_name="Super Admin IT",
        hashed_password=get_password_hash(password),
        role=UserRole.ADMIN,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    print("------------------------------------------------")
    print(f"✅ SUKSES! Admin Created.")
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print("------------------------------------------------")
    
    db.close()

if __name__ == "__main__":
    create_admin()