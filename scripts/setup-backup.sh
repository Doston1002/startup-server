#!/bin/bash

###############################################################################
# MongoDB Backup Setup Script (Ubuntu Server)
# 
# Bu script backup scriptini o'rnatadi va cron job sozlaydi
###############################################################################

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 MongoDB Backup Setup boshlandi..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Script papkasi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Avtomatik topish - bir nechta mumkin bo'lgan joylarni tekshirish
if [ ! -f "${SCRIPT_DIR}/mongodb-backup.sh" ]; then
    # Boshqa joylarni qidirish
    for path in "$HOME/startup-server/scripts" "$HOME/uyda-talim/back/scripts" "."; do
        if [ -f "${path}/mongodb-backup.sh" ]; then
            SCRIPT_DIR="$(cd "$path" && pwd)"
            break
        fi
    done
fi
BACKUP_SCRIPT="${SCRIPT_DIR}/mongodb-backup.sh"
CONFIG_FILE="${SCRIPT_DIR}/.backup.env"

# 1. Backup scriptini tekshirish
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "❌ Backup script topilmadi: $BACKUP_SCRIPT"
    exit 1
fi

# 2. Execute huquq berish
chmod +x "$BACKUP_SCRIPT"
echo "✅ Backup scriptiga execute huquq berildi"

# 3. Backup papkasini yaratish (home papkasida)
BACKUP_DIR="$HOME/backups/mongodb"
mkdir -p "$BACKUP_DIR"
echo "✅ Backup papkasi yaratildi: $BACKUP_DIR"

# 4. Log papkasini yaratish
LOG_DIR="$HOME/logs"
LOG_FILE="$LOG_DIR/mongodb-backup.log"
mkdir -p "$LOG_DIR"
touch "$LOG_FILE"
echo "✅ Log papkasi yaratildi: $LOG_DIR"

# 5. MongoDB Tools tekshirish
if ! command -v mongodump &> /dev/null; then
    echo ""
    echo "⚠️  MongoDB Tools topilmadi!"
    echo ""
    echo "O'rnatish uchun quyidagi buyruqlarni bajaring:"
    echo ""
    echo "  # Ubuntu/Debian"
    echo "  wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -"
    echo "  echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y mongodb-database-tools"
    echo ""
    read -p "Hozir o'rnatmoqchimisiz? (y/n): " install_tools
    if [ "$install_tools" = "y" ] || [ "$install_tools" = "Y" ]; then
        wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-database-tools
        echo "✅ MongoDB Tools o'rnatildi"
    fi
else
    echo "✅ MongoDB Tools mavjud"
fi

# 6. Environment faylini yaratish
if [ ! -f "$CONFIG_FILE" ]; then
    echo ""
    echo "⚙️  Konfiguratsiya fayli yaratilmoqda..."
    
    # MongoDB URI ni so'rash
    read -p "MongoDB URI (default: mongodb://0.0.0.0:27017/zzzzz): " mongo_uri
    mongo_uri=${mongo_uri:-mongodb://0.0.0.0:27017/zzzzz}
    
    # Database nomini so'rash
    read -p "Database nomi (default: zzzzz): " db_name
    db_name=${db_name:-zzzzz}
    
    # Backup saqlash muddati
    read -p "Backup saqlash muddati (kunlar, default: 7): " keep_days
    keep_days=${keep_days:-7}
    
    # Compress
    read -p "Compress qilish? (y/n, default: y): " compress
    compress=${compress:-y}
    if [ "$compress" = "y" ] || [ "$compress" = "Y" ]; then
        compress="true"
    else
        compress="false"
    fi
    
    # Email notification
    read -p "Email xabarnoma yuborish? (y/n, default: n): " email_notif
    email_notif=${email_notif:-n}
    if [ "$email_notif" = "y" ] || [ "$email_notif" = "Y" ]; then
        read -p "Email manzili: " email_to
        email_to=${email_to:-admin@uydatalim.uz}
        email_notif="true"
    else
        email_notif="false"
        email_to="admin@uydatalim.uz"
    fi
    
    # Config fayl yaratish
    cat > "$CONFIG_FILE" << EOF
# MongoDB Backup Configuration
# Bu fayl avtomatik yaratilgan: $(date)

# MongoDB Connection URI
MONGODB_URI="$mongo_uri"

# Database nomi (yoki "auto" - URI dan olinadi)
DB_NAME="$db_name"

# Backup papkasi
BACKUP_DIR="$BACKUP_DIR"

# Backup saqlash muddati (kunlar)
KEEP_DAYS=$keep_days

# Compress qilish (true/false)
COMPRESS=$compress

# Log fayl
LOG_FILE="$LOG_FILE"

# Email xabarnoma (true/false)
EMAIL_NOTIFICATION=$email_notif
EMAIL_TO="$email_to"
EOF
    
    chmod 600 "$CONFIG_FILE"
    echo "✅ Konfiguratsiya fayli yaratildi: $CONFIG_FILE"
    echo ""
    echo "⚠️  Iltimos, .backup.env faylida MONGODB_URI ni to'g'ri sozlang!"
else
    echo "ℹ️  Konfiguratsiya fayli allaqachon mavjud: $CONFIG_FILE"
fi

# 7. Cron job qo'shish
echo ""
echo "📅 Cron job sozlash..."
echo ""

# Backup vaqtini so'rash
echo "Backup vaqtini tanlang:"
echo "  1) Har kuni soat 2:00 (tavsiya etiladi)"
echo "  2) Har kuni soat 3:00"
echo "  3) Har 6 soatda"
echo "  4) Har 12 soatda"
echo "  5) Boshqa (manual kiriting)"
echo ""
read -p "Tanlov (1-5, default: 1): " cron_choice
cron_choice=${cron_choice:-1}

case $cron_choice in
    1)
        CRON_TIME="0 2 * * *"
        CRON_DESC="Har kuni soat 2:00"
        ;;
    2)
        CRON_TIME="0 3 * * *"
        CRON_DESC="Har kuni soat 3:00"
        ;;
    3)
        CRON_TIME="0 */6 * * *"
        CRON_DESC="Har 6 soatda"
        ;;
    4)
        CRON_TIME="0 */12 * * *"
        CRON_DESC="Har 12 soatda"
        ;;
    5)
        read -p "Cron formatini kiriting (misol: 0 2 * * *): " CRON_TIME
        CRON_DESC="Custom: $CRON_TIME"
        ;;
    *)
        CRON_TIME="0 2 * * *"
        CRON_DESC="Har kuni soat 2:00"
        ;;
esac

# Cron job entry
CRON_ENTRY="$CRON_TIME cd $SCRIPT_DIR && bash $BACKUP_SCRIPT >> $LOG_FILE 2>&1"

# Cron job mavjudligini tekshirish
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo ""
    echo "⚠️  Cron job allaqachon mavjud!"
    read -p "Yangilamoqchimisiz? (y/n): " update_cron
    if [ "$update_cron" = "y" ] || [ "$update_cron" = "Y" ]; then
        # Eski cron job'ni o'chirish
        crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT" | crontab -
        # Yangi cron job qo'shish
        (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
        echo "✅ Cron job yangilandi"
    else
        echo "ℹ️  Cron job o'zgartirilmadi"
    fi
else
    # Yangi cron job qo'shish
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "✅ Cron job qo'shildi: $CRON_DESC"
fi

# 8. Test backup
echo ""
read -p "Test backup qilmoqchimisiz? (y/n): " test_backup
if [ "$test_backup" = "y" ] || [ "$test_backup" = "Y" ]; then
    echo ""
    echo "🧪 Test backup boshlandi..."
    bash "$BACKUP_SCRIPT"
    echo ""
    if [ $? -eq 0 ]; then
        echo "✅ Test backup muvaffaqiyatli!"
    else
        echo "❌ Test backup'da xatolik yuz berdi. Log'larni tekshiring: $LOG_FILE"
    fi
fi

# 9. Yakun
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup muvaffaqiyatli yakunlandi!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Foydalanish:"
echo "   Manual backup:  bash $BACKUP_SCRIPT"
echo "   Log ko'rish:    tail -f $LOG_FILE"
echo "   Cron ko'rish:   crontab -l"
echo "   Konfiguratsiya: $CONFIG_FILE"
echo ""
echo "📁 Backup joylashuvi: $BACKUP_DIR"
echo ""
echo "⏰ Cron job vaqtini o'zgartirish:"
echo "   crontab -e"
echo ""
echo "📝 Konfiguratsiyani o'zgartirish:"
echo "   nano $CONFIG_FILE"
echo ""

