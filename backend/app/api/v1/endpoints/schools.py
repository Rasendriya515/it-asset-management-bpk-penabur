from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.location import School
from app.schemas.location import School as SchoolSchema

router = APIRouter()

@router.get("/{school_id}", response_model=SchoolSchema)
def read_school(school_id: int, db: Session = Depends(get_db)):
    """
    Mengambil detail satu sekolah (Nama, Area ID, dll)
    """
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="Sekolah tidak ditemukan")
    return school