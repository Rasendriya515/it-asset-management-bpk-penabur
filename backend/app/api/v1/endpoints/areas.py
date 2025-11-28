from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.location import Area, School
from app.schemas.location import Area as AreaSchema
from app.schemas.location import School as SchoolSchema

router = APIRouter()

@router.get("/", response_model=List[AreaSchema])
def read_areas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Mengambil daftar semua Area (Pusat, Barat, Timur, dll).
    """
    areas = db.query(Area).offset(skip).limit(limit).all()
    return areas

@router.get("/{area_id}", response_model=AreaSchema)
def read_area(area_id: int, db: Session = Depends(get_db)):
    """
    Mengambil info satu Area spesifik.
    """
    area = db.query(Area).filter(Area.id == area_id).first()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area

@router.get("/{area_id}/schools", response_model=List[SchoolSchema])
def read_schools_by_area(area_id: int, db: Session = Depends(get_db)):
    """
    Mengambil daftar sekolah berdasarkan Area ID.
    Contoh: Jika Area ID = 2 (Pusat), akan muncul SDK 1, SMAK 1, dll.
    """
    area = db.query(Area).filter(Area.id == area_id).first()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
        
    schools = db.query(School).filter(School.area_id == area_id).all()
    return schools