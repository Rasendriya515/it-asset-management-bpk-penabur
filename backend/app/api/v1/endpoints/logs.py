from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.update_log import UpdateLog
from app.schemas.update_log import LogResponse

router = APIRouter()

@router.get("/", response_model=List[LogResponse])
def read_logs(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(UpdateLog)
    
    if search:
        query = query.filter(UpdateLog.asset_barcode.ilike(f"%{search}%"))
        
    logs = query.order_by(UpdateLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs