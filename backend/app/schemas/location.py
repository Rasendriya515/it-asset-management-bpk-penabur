from pydantic import BaseModel
from typing import List, Optional

class AreaBase(BaseModel):
    name: str
    slug: str

class AreaCreate(AreaBase):
    pass

class AreaUpdate(AreaBase):
    pass

class Area(AreaBase):
    id: int
    class Config:
        from_attributes = True

class SchoolBase(BaseModel):
    name: str
    address: Optional[str] = None
    area_id: int

class SchoolCreate(SchoolBase):
    pass

class School(SchoolBase):
    id: int
    area: Optional[Area] = None

    class Config:
        from_attributes = True