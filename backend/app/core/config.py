import os

class Settings:
    PROJECT_NAME: str = "IT Asset Management"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "rahasia_super_aman_bpk_penabur_2025_ganti_ini_biar_aman"
    
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # Token berlaku 8 hari
    
    UPLOAD_DIR: str = "uploads"

settings = Settings()