#!/bin/bash

###############################################################################
# Cron Job Qo'shish Script
# Bu script mongodb-backup uchun cron job qo'shadi
###############################################################################

echo "📅 MongoDB Backup Cron Job Qo'shish"
echo ""

# Script joylashuvini topish
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Agar hozirgi papkada topilmasa
if [ ! -f "${SCRIPT_DIR}/mongodb-backup.sh" ]; then
    for path in "$HOME/startup-server/scripts" "$HOME/uyda-talim/back/scripts" "."; do
        if [ -f "${path}/mongodb-backup.sh" ]; then
            SCRIPT_DIR="$(cd "$path" && pwd)"
            break
        fi
    done
fi

BACKUP_SCRIPT="${SCRIPT_DIR}/mongodb-backup.sh"
LOG_FILE="$HOME/logs/mongodb-backup.log"

# Script mavjudligini tekshirish
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "❌ Backup script topilmadi: $BACKUP_SCRIPT"
    exit 1
fi

echo "Backup script: $BACKUP_SCRIPT"
echo "Log fayl: $LOG_FILE"
echo ""

# Cron vaqtini so'rash
echo "Backup vaqtini tanlang:"
echo "  1) Har kuni soat 2:00 (tavsiya)"
echo "  2) Har kuni soat 3:00"
echo "  3) Har 6 soatda"
echo "  4) Har 12 soatda"
echo "  5) Boshqa (manual)"
echo ""
read -p "Tanlov (1-5, default: 1): " cron_choice
cron_choice=${cron_choice:-1}

case $cron_choice in
    1) CRON_TIME="0 2 * * *"; CRON_DESC="Har kuni soat 2:00" ;;
    2) CRON_TIME="0 3 * * *"; CRON_DESC="Har kuni soat 3:00" ;;
    3) CRON_TIME="0 */6 * * *"; CRON_DESC="Har 6 soatda" ;;
    4) CRON_TIME="0 */12 * * *"; CRON_DESC="Har 12 soatda" ;;
    5)
        read -p "Cron format (misol: 0 2 * * *): " CRON_TIME
        CRON_DESC="Custom: $CRON_TIME"
        ;;
    *)
        CRON_TIME="0 2 * * *"
        CRON_DESC="Har kuni soat 2:00"
        ;;
esac

# Cron job entry
CRON_ENTRY="$CRON_TIME cd $SCRIPT_DIR && bash mongodb-backup.sh >> $LOG_FILE 2>&1"

echo ""
echo "Cron job entry:"
echo "$CRON_ENTRY"
echo ""

# Eski cron job'ni tekshirish
if crontab -l 2>/dev/null | grep -q "mongodb-backup.sh"; then
    echo "⚠️  Eski cron job topildi!"
    echo ""
    crontab -l | grep "mongodb-backup"
    echo ""
    read -p "Yangilamoqchimisiz? (y/n): " update
    if [ "$update" = "y" ] || [ "$update" = "Y" ]; then
        # Eski cron job'ni o'chirish
        crontab -l 2>/dev/null | grep -v "mongodb-backup.sh" | crontab -
        # Yangi cron job qo'shish
        (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
        echo "✅ Cron job yangilandi"
    else
        echo "ℹ️  O'zgartirilmadi"
        exit 0
    fi
else
    # Yangi cron job qo'shish
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "✅ Cron job qo'shildi: $CRON_DESC"
fi

echo ""
echo "📋 Tekshirish:"
echo "   crontab -l | grep mongodb"
echo ""

