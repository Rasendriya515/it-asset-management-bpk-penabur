import logging
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.location import Area, School

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session):
    data_bpk = {
        "Barat": [
            "PENABUR Junior College Tanjung Duren",
            "PENABUR Intercultural School Secondary Tanjung Duren",
            "SDK 11 - Sunrise Garden",
            "SMAK 1 - Tanjung Duren",
            "SMAK 4 - Sunrise Garden",
            "SMPK 7 - Sunrise Garden",
            "TKK 11 - Sunrise Garden"
        ],
        "Pusat": [
            "SDK 1 - Samanhudi",
            "SDK 2 - Pembangunan",
            "SDK 3 - Gunung Sahari",
            "SMAK 2 - Pintu Air",
            "SMAK 3 - Gunung Sahari",
            "SMK Farmasi BPK Penabur Jakarta",
            "SMPK 1 - Pintu Air",
            "SMPK 2 - Pembangunan",
            "SMPK 3 - Gunung Sahari",
            "TKK 1 - Samanhudi",
            "TKK 2 - Pembangunan",
            "TKK 7 - Gunung Sahari"
        ],
        "Utara": [
            "PENABUR Intercultural School Primary Kelapa Gading",
            "PENABUR Intercultural School Secondary Kelapa Gading",
            "PENABUR Junior College Kelapa Gading",
            "SDK 10 - Pantai Indah Kapuk",
            "SDK 6 - Kelapa Gading",
            "SMAK 5 - Kelapa Gading",
            "SMAK 6 - Muara Karang",
            "SMPK 4 - Kelapa Gading",
            "SMPK 6 - Muara Karang",
            "TKK 10 - Pantai Indah Kapuk",
            "TKK 6 - Kelapa Gading"
        ],
        "Timur": [
            "SDK 4 - Cipinang Indah",
            "SDK 8 - Cawang",
            "SMAK 7 - Cipinang Indah",
            "SMPK 5 - Cipinang Indah",
            "TKK 3 - Cipinang Indah",
            "TKK 5 - Taman Mini",
            "TKK 8 - Cawang"
        ],
        "Selatan": [
            "SDK 9 - Setiabudi",
            "SDK TirtaMarta - Pondok Indah",
            "SMAK Tirtamarta - Pondok Indah",
            "SMPK TirtaMarta - Pondok Indah",
            "TKK 9 - Setiabudi",
            "TKK TirtaMarta - Pondok Indah"
        ],
        "Tangerang": [
            "SDK Bintaro Jaya",
            "SDK Gading Serpong",
            "SDK Kota Modern",
            "SMAK Bintaro Jaya",
            "SMAK Gading Serpong",
            "SMAK Kota Tangerang",
            "SMPK Bintaro Jaya",
            "SMPK Gading Serpong",
            "SMPK Kota Modern",
            "TKK Bintaro Jaya",
            "TKK Gading Serpong",
            "TKK Kota Modern"
        ],
        "Bekasi": [
            "SDK Agus Salim",
            "SDK Harapan Indah",
            "SDK Kota Jababeka",
            "SDK Summarecon Bekasi",
            "SMAK Harapan Indah",
            "SMAK Kota Jababeka",
            "SMAK Summarecon Bekasi",
            "SMPK Harapan Indah",
            "SMPK Kota Jababeka",
            "SMPK Summarecon Bekasi",
            "TKK Agus Salim",
            "TKK Harapan Indah",
            "TKK Kota Jababeka",
            "TKK Summarecon Bekasi"
        ],
        "Cibubur": [
            "SDK Kota Wisata",
            "SMAK Kota Wisata",
            "SMPK Kota Wisata",
            "TKK Kota Wisata"
        ],
        "Depok": [
            "SDK Depok",
            "SDK TirtaMarta - Cinere",
            "SMPK Depok",
            "SMPK TirtaMarta - Cinere",
            "TKK Depok",
            "TKK TirtaMarta - Cinere"
        ]
    }

    logger.info("Mulai mengisi database...")

    for area_name, schools_list in data_bpk.items():
        existing_area = db.query(Area).filter(Area.name == area_name).first()
        
        if not existing_area:
            slug_name = area_name.lower().replace(" ", "-")
            
            new_area = Area(name=area_name, slug=slug_name)
            db.add(new_area)
            db.commit()
            db.refresh(new_area)
            area_id = new_area.id
            logger.info(f"✅ Area dibuat: {area_name}")
        else:
            area_id = existing_area.id
            logger.info(f"ℹ️ Area sudah ada: {area_name}")

        for school_name in schools_list:
            existing_school = db.query(School).filter(School.name == school_name).first()
            
            if not existing_school:
                new_school = School(name=school_name, area_id=area_id)
                db.add(new_school)
                logger.info(f"   -> Sekolah ditambahkan: {school_name}")
            else:
                pass

        db.commit()

    logger.info("🎉 SELESAI! Database BPK PENABUR berhasil diisi.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()