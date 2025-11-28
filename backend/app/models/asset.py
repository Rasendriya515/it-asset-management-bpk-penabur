from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.sql.sqltypes import DateTime
from app.db.base_class import Base
import enum

class AssetStatus(str, enum.Enum):
    BERFUNGSI = "Berfungsi"
    TERKENDALA = "Terkendala"
    PERBAIKAN = "Perbaikan"
    RUSAK = "Rusak"
    DIHAPUSKAN = "Dihapuskan"

class AssetPlacement(str, enum.Enum):
    INDOOR = "Indoor"
    OUTDOOR = "Outdoor"

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String, unique=True, index=True, nullable=False)
    city_code = Column(String(2), nullable=False) 
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    type_code = Column(String(2), nullable=False)       
    category_code = Column(String(3), nullable=True)    
    subcategory_code = Column(String(3), nullable=True)
    procurement_month = Column(String(2), nullable=False) 
    procurement_year = Column(String(2), nullable=False)  
    floor = Column(String(3), nullable=False)            
    sequence_number = Column(String(3), nullable=False)  
    placement = Column(Enum(AssetPlacement), nullable=True) 
    brand = Column(String, nullable=True)                   
    room = Column(String, nullable=True)                    
    model_series = Column(String, nullable=True)            
    ip_address = Column(String, nullable=True) 
    mac_address = Column(String, nullable=True)
    serial_number = Column(String(25), nullable=False, index=True)
    ram = Column(String, nullable=True)        
    processor = Column(String, nullable=True)  
    gpu = Column(String, nullable=True)        
    storage = Column(String, nullable=True)    
    os = Column(String, nullable=True)       
    connect_to = Column(String, nullable=True) 
    channel = Column(String, nullable=True)   
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)   
    assigned_to = Column(String, nullable=True)
    status = Column(Enum(AssetStatus), default=AssetStatus.BERFUNGSI, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    school = relationship("School", backref="assets")