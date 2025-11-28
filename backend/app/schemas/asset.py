from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import re

from app.models.asset import AssetStatus, AssetPlacement

class AssetBase(BaseModel):
    city_code: str
    school_id: int
    type_code: str
    category_code: Optional[str] = None
    subcategory_code: Optional[str] = None
    procurement_month: str
    procurement_year: str
    floor: str
    sequence_number: str

    placement: Optional[AssetPlacement] = None
    brand: Optional[str] = None
    room: Optional[str] = None
    model_series: Optional[str] = None

    ip_address: Optional[str] = None
    mac_address: Optional[str] = None

    serial_number: str
    ram: Optional[str] = None
    processor: Optional[str] = None
    gpu: Optional[str] = None
    storage: Optional[str] = None
    os: Optional[str] = None

    connect_to: Optional[str] = None
    channel: Optional[str] = None

    username: Optional[str] = None
    password: Optional[str] = None
    assigned_to: Optional[str] = None

    status: AssetStatus = AssetStatus.BERFUNGSI
    
    @field_validator('ip_address')
    def validate_ip(cls, v):
        if v:
            pattern = r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            if not re.match(pattern, v):
                raise ValueError('Format IP Address salah! Contoh: 192.168.1.1')
        return v

    @field_validator('mac_address')
    def validate_mac(cls, v):
        if v:
            pattern = r"^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
            if not re.match(pattern, v):
                raise ValueError('Format MAC Address salah! Contoh: 00:1A:2B:3C:4D:5E')
        return v

class AssetCreate(AssetBase):
    barcode: str 

class AssetUpdate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    barcode: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True