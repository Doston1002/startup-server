#!/bin/bash

# MongoDB Backup Setup Script
# Bu script backup scriptini o'rnatadi va cron job qo'shadi

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"
CRON_LOG="/var/log/mongodb-backup.log"

echo "🚀 MongoDB Backup Setup boshlandi..."
echo ""

# 1. Backup scriptiga execute huquq berish
chmod +x "$BACKUP_SCRIPT"
echo "✅ Backup scriptiga execute huquq berildi"

# 2. Backup papkasini yaratish
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mongodb}"
mkdir -p "$BACKUP_DIR"
echo "✅ Backup papkasi yaratildi: $BACKUP_DIR"

# 3. Log fayl uchun papka
mkdir -p "$(dirname "$CRON_LOG")"
touch "$CRON_LOG"
chmod 644 "$CRON_LOG"
echo "✅ Log fayl yaratildi: $CRON_LOG"

# 4. Environment variables faylini yaratish (ixtiyoriy)
ENV_FILE="$SCRIPT_DIR/.backup.env"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << EOF
# MongoDB Backup Configuration
MONGODB_URI="mongodb://localhost:27017/uyda-talim"
BACKUP_DIR="$BACKUP_DIR"
KEEP_DAYS=7
DB_NAME="uyda-talim"
COMPRESS=true
LOG_FILE="$CRON_LOG"
EOF
    echo "✅ Environment fayl yaratildi: $ENV_FILE"
    echo "⚠️  Iltimos, .backup.env faylida MONGODB_URI ni to'g'ri sozlang!"
else
    echo "ℹ️  Environment fayl allaqachon mavjud: $ENV_FILE"
fi

# 5. Cron job qo'shish
CRON_ENTRY="0 2 * * * source $ENV_FILE && $BACKUP_SCRIPT >> $CRON_LOG 2>&1"

# Cron job mavjudligini tekshirish
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo "ℹ️  Cron job allaqachon qo'shilgan"
else
    # Cron job qo'shish
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "✅ Cron job qo'shildi (Har kuni soat 2:00)"
    echo "   O'zgartirish uchun: crontab -e"
fi

echo ""
echo "✨ Setup yakunlandi!"
echo ""
echo "📋 Foydalanish:"
echo "   1. Manual backup: $BACKUP_SCRIPT"
echo "   2. Cron job ko'rish: crontab -l"
echo "   3. Log'lar: tail -f $CRON_LOG"
echo "   4. Konfiguratsiya: $ENV_FILE"
echo ""
echo "⏰ Cron job vaqtini o'zgartirish:"
echo "   crontab -e"
echo ""
echo "   Misollar:"
echo "   0 2 * * *    - Har kuni soat 2:00"
echo "   0 */6 * * *  - Har 6 soatda"
echo "   0 0 * * 0    - Har hafta yakshanba"

