from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.location import School
from app.models.asset import Asset, AssetStatus, AssetPlacement

def seed_assets():
    db = SessionLocal()
    
    school = db.query(School).filter(School.name == "SMAK 1 - Tanjung Duren").first()
    
    if not school:
        print("❌ Sekolah SMAK 1 tidak ditemukan! Pastikan sudah run initial_data.py")
        return

    print(f"Mengisi aset untuk sekolah: {school.name} (ID: {school.id})")

    dummy_assets = [
        Asset(
            barcode=f"01-A01-HW-LTP-001",
            city_code="01", school_id=school.id,
            type_code="HW", category_code="LTP", subcategory_code=None,
            procurement_month="01", procurement_year="24", 
            floor="03",
            sequence_number="001",
            placement=AssetPlacement.INDOOR, brand="Lenovo", model_series="Thinkpad E14", room="Ruang Guru",
            serial_number="LNV-2024-001", ram="16 GB", processor="Intel i5 Gen 12", storage="SSD 512GB", os="Windows 11",
            status=AssetStatus.BERFUNGSI, username="Guru A",
        ),
        Asset(
            barcode=f"01-A01-IT-CTV-IPI-002",
            city_code="01", school_id=school.id,
            type_code="IT", category_code="CTV", subcategory_code="IPI",
            procurement_month="02", procurement_year="24", 
            floor="01", 
            sequence_number="002",
            placement=AssetPlacement.INDOOR, brand="Hikvision", model_series="Dome Camera 4K", room="Lobby Utama",
            serial_number="HIK-CCTV-002", ip_address="192.168.10.55", mac_address="00:1B:44:11:3A:B7",
            connect_to="NVR-01", channel="CH-01",
            status=AssetStatus.BERFUNGSI
        ),
        Asset(
            barcode=f"01-A01-SD-PHS-003",
            city_code="01", school_id=school.id,
            type_code="SD", category_code="PHS", subcategory_code=None,
            procurement_month="03", procurement_year="23", 
            floor="01", 
            sequence_number="003",
            placement=AssetPlacement.INDOOR, brand="Dell", model_series="PowerEdge R750", room="Ruang Server", 
            serial_number="DEL-SVR-003", ram="64 GB", processor="Xeon Silver", storage="HDD 4TB RAID",
            ip_address="10.0.0.5", status=AssetStatus.TERKENDALA
        ),
         Asset(
            barcode=f"01-A01-HW-CPU-004",
            city_code="01", school_id=school.id,
            type_code="HW", category_code="CPU", subcategory_code=None,
            procurement_month="01", procurement_year="24", 
            floor="02",
            sequence_number="004",
            placement=AssetPlacement.INDOOR, brand="HP", model_series="ProDesk", room="Lab Komputer",
            serial_number="HP-PC-004", ram="8 GB", processor="Intel i3", storage="SSD 256GB", os="Windows 10",
            status=AssetStatus.RUSAK
        ),
    ]

    for asset in dummy_assets:
        exists = db.query(Asset).filter(Asset.barcode == asset.barcode).first()
        if not exists:
            db.add(asset)
            print(f"✅ Aset ditambahkan: {asset.barcode} ({asset.brand})")
        else:
            print(f"ℹ️ Aset sudah ada: {asset.barcode}")

    db.commit()
    db.close()
    print("🎉 Selesai seeding aset!")

if __name__ == "__main__":
    seed_assets()