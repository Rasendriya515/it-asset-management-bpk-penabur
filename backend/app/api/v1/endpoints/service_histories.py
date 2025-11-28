from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.service_history import ServiceHistory
from app.schemas.service_history import ServiceCreate, ServiceResponse

router = APIRouter()

@router.get("/", response_model=List[ServiceResponse])
def read_services(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ServiceHistory)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (ServiceHistory.sn_or_barcode.ilike(search_fmt)) | 
            (ServiceHistory.ticket_no.ilike(search_fmt))
        )
        
    services = query.order_by(ServiceHistory.service_date.desc()).offset(skip).limit(limit).all()
    return services

@router.post("/", response_model=ServiceResponse)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db)
):
    new_service = ServiceHistory(**service_in.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service