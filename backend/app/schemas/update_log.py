from pydantic import BaseModel
from datetime import datetime

class LogResponse(BaseModel):
    id: int
    asset_barcode: str
    asset_name: str
    action: str
    details: str
    actor: str
    created_at: datetime

    class Config:
        from_attributes = True