from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models.service_history import ServiceHistory
from app.models.update_log import UpdateLog
from app.models.asset import Asset
from app.models.location import School, Area
from app.models.user import User
from app.schemas.service_history import ServiceCreate, ServiceResponse, ServicePaginatedResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def create_service_log(db: Session, service_obj: ServiceHistory, action_type: str, details: str, actor: str = "Admin"):
    school_name = "Unknown School"
    area_name = "Unknown Area"
    
    asset = db.query(Asset).options(joinedload(Asset.school).joinedload(School.area))\
        .filter(Asset.barcode == service_obj.sn_or_barcode).first()
    
    if not asset:
        asset = db.query(Asset).options(joinedload(Asset.school).joinedload(School.area))\
            .filter(Asset.serial_number == service_obj.sn_or_barcode).first()

    if asset and asset.school:
        school_name = asset.school.name
        if asset.school.area:
            area_name = asset.school.area.name

    log = UpdateLog(
        asset_barcode=service_obj.sn_or_barcode,
        asset_name=service_obj.asset_name or "Service Item",
        action=action_type,
        details=details,
        actor=actor,
        school_name=school_name,
        area_name=area_name
    )
    db.add(log)

@router.get("/", response_model=ServicePaginatedResponse)
def read_services(
    page: int = 1,
    size: int = 10,
    search: Optional[str] = None,
    sort_by: Optional[str] = "service_date",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(ServiceHistory)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (ServiceHistory.sn_or_barcode.ilike(search_fmt)) | 
            (ServiceHistory.ticket_no.ilike(search_fmt))
        )
        
    total = query.count()

    sort_fields = {
        "ticket_no": ServiceHistory.ticket_no,
        "service_date": ServiceHistory.service_date,
        "asset_name": ServiceHistory.asset_name,
        "status": ServiceHistory.status,
        "vendor": ServiceHistory.vendor
    }
    
    db_sort_field = sort_fields.get(sort_by, ServiceHistory.service_date)
    
    if sort_order == "asc":
        query = query.order_by(db_sort_field.asc())
    else:
        query = query.order_by(db_sort_field.desc())

    skip = (page - 1) * size
    services = query.offset(skip).limit(size).all()
    
    return {
        "items": services,
        "total": total,
        "page": page,
        "size": size
    }

@router.post("/", response_model=ServiceResponse)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_service = ServiceHistory(**service_in.dict())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    actor_name = current_user.full_name if current_user.full_name else current_user.email

    create_service_log(
        db, 
        new_service, 
        "SERVICE CREATE", 
        f"Mencatat service baru: {new_service.issue_description}",
        actor=actor_name
    )
    db.commit()

    return new_service

@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = db.query(ServiceHistory).filter(ServiceHistory.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Data service tidak ditemukan")

    old_status = service.status
    update_data = service_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(service, field, value)

    db.add(service)
    db.commit()
    db.refresh(service)

    actor_name = current_user.full_name if current_user.full_name else current_user.email

    details = f"Update data service. Status: {old_status} -> {service.status}"
    create_service_log(db, service, "SERVICE UPDATE", details, actor=actor_name)
    db.commit()

    return service