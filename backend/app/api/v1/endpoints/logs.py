from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.update_log import UpdateLog
from app.schemas.update_log import LogResponse, LogPaginatedResponse

router = APIRouter()

@router.get("/", response_model=LogPaginatedResponse)
def read_logs(
    page: int = 1,
    size: int = 10,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(UpdateLog)
    
    if search:
        query = query.filter(UpdateLog.asset_barcode.ilike(f"%{search}%"))
    
    total = query.count()

    sort_fields = {
        "created_at": UpdateLog.created_at,
        "asset_barcode": UpdateLog.asset_barcode,
        "action": UpdateLog.action,
        "actor": UpdateLog.actor
    }
    
    db_sort_field = sort_fields.get(sort_by, UpdateLog.created_at)

    if sort_order == "asc":
        query = query.order_by(db_sort_field.asc())
    else:
        query = query.order_by(db_sort_field.desc())
        
    skip = (page - 1) * size
    logs = query.offset(skip).limit(size).all()
    
    return {
        "items": logs,
        "total": total,
        "page": page,
        "size": size
    }