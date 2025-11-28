import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class UserUpdate(BaseModel):
    full_name: str

@router.get("/me")
def read_user_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "avatar": current_user.avatar,
        "role": "Admin" 
    }

@router.put("/me")
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.full_name = user_in.full_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    UPLOAD_DIR = "uploads/avatars"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_location = f"{UPLOAD_DIR}/{current_user.id}_{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    current_user.avatar = f"/{file_location}" 
    db.add(current_user)
    db.commit()
    
    return {"avatar": current_user.avatar}