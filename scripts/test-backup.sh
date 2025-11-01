#!/bin/bash

###############################################################################
# MongoDB Backup Test Script
# Bu script backup tizimini to'liq test qiladi
###############################################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 MongoDB Backup Test Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0
WARNINGS=0

# Ranglar
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ERRORS=$((ERRORS + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

echo "1️⃣  MongoDB Tools Tekshiruvi"
echo "──────────────────────────────────────────────────"
if command -v mongodump &> /dev/null; then
    MONGODUMP_VERSION=$(mongodump --version | head -1)
    check_pass "MongoDB Tools o'rnatilgan: $MONGODUMP_VERSION"
else
    check_fail "MongoDB Tools topilmadi!"
    echo "   O'rnatish: sudo apt-get install -y mongodb-database-tools"
fi
echo ""

echo "2️⃣  Script Fayllari Tekshiruvi"
echo "──────────────────────────────────────────────────"
# Script joylashuvini topish (avtomatik)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/mongodb-backup.sh"

# Agar hozirgi papkada topilmasa, boshqa joylarni qidirish
if [ ! -f "$BACKUP_SCRIPT" ]; then
    # Bir nechta mumkin bo'lgan joylarni tekshirish
    POSSIBLE_PATHS=(
        "$HOME/startup-server/scripts/mongodb-backup.sh"
        "$HOME/uyda-talim/back/scripts/mongodb-backup.sh"
        "./mongodb-backup.sh"
        "mongodb-backup.sh"
    )
    
    for path in "${POSSIBLE_PATHS[@]}"; do
        if [ -f "$path" ]; then
            BACKUP_SCRIPT="$path"
            SCRIPT_DIR="$(cd "$(dirname "$BACKUP_SCRIPT")" && pwd)"
            BACKUP_SCRIPT="${SCRIPT_DIR}/mongodb-backup.sh"
            break
        fi
    done
fi

if [ -f "$BACKUP_SCRIPT" ]; then
    check_pass "Backup script mavjud: $BACKUP_SCRIPT"
    if [ -x "$BACKUP_SCRIPT" ]; then
        check_pass "Script execute huquqiga ega"
    else
        check_warn "Script'ga execute huquq berish kerak: chmod +x $BACKUP_SCRIPT"
    fi
else
    check_fail "Backup script topilmadi! Quyidagi joylarda qidirildi:"
    echo "   - $SCRIPT_DIR/mongodb-backup.sh"
    echo "   - $HOME/startup-server/scripts/mongodb-backup.sh"
    echo "   - $HOME/uyda-talim/back/scripts/mongodb-backup.sh"
    echo "   Hozirgi papka: $(pwd)"
fi
echo ""

echo "3️⃣  Konfiguratsiya Fayli Tekshiruvi"
echo "──────────────────────────────────────────────────"
CONFIG_FILE="${SCRIPT_DIR}/.backup.env"

# Agar hozirgi papkada topilmasa, boshqa joylarni qidirish
if [ ! -f "$CONFIG_FILE" ]; then
    POSSIBLE_CONFIGS=(
        "$HOME/startup-server/scripts/.backup.env"
        "$HOME/uyda-talim/back/scripts/.backup.env"
        "./.backup.env"
    )
    
    for path in "${POSSIBLE_CONFIGS[@]}"; do
        if [ -f "$path" ]; then
            CONFIG_FILE="$path"
            break
        fi
    done
fi

if [ -f "$CONFIG_FILE" ]; then
    check_pass "Konfiguratsiya fayli mavjud: $CONFIG_FILE"
    source "$CONFIG_FILE" 2>/dev/null || true
    if [ -n "${MONGODB_URI:-}" ]; then
        check_pass "MONGODB_URI: $MONGODB_URI"
    else
        check_warn "MONGODB_URI topilmadi"
    fi
    if [ -n "${DB_NAME:-}" ]; then
        check_pass "DB_NAME: $DB_NAME"
    else
        check_warn "DB_NAME topilmadi"
    fi
else
    check_warn "Konfiguratsiya fayli topilmadi: $CONFIG_FILE"
    echo "   Setup scriptni ishga tushiring: ./setup-backup.sh"
fi
echo ""

echo "4️⃣  MongoDB Ulanishi Tekshiruvi"
echo "──────────────────────────────────────────────────"
MONGODB_URI_TEST="${MONGODB_URI:-mongodb://0.0.0.0:27017/zzzzz}"
if mongosh "$MONGODB_URI_TEST" --eval "db.adminCommand('ping')" --quiet &>/dev/null; then
    check_pass "MongoDB server bilan ulanish muvaffaqiyatli"
    # Database mavjudligini tekshirish
    DB_EXISTS=$(mongosh "$MONGODB_URI_TEST" --eval "db.getName()" --quiet 2>/dev/null | tr -d '\n\r ' || echo "")
    if [ -n "$DB_EXISTS" ]; then
        check_pass "Database mavjud: $DB_EXISTS"
    fi
else
    check_fail "MongoDB server bilan ulanish xatosi!"
    echo "   URI: $MONGODB_URI_TEST"
fi
echo ""

echo "5️⃣  Backup Papkasi Tekshiruvi"
echo "──────────────────────────────────────────────────"
BACKUP_DIR_TEST="${BACKUP_DIR:-$HOME/backups/mongodb}"
if [ -d "$BACKUP_DIR_TEST" ]; then
    check_pass "Backup papkasi mavjud: $BACKUP_DIR_TEST"
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR_TEST" 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt 0 ]; then
        check_pass "Backup'lar mavjud: $BACKUP_COUNT ta"
        LATEST_BACKUP=$(ls -t "$BACKUP_DIR_TEST" 2>/dev/null | head -1)
        if [ -n "$LATEST_BACKUP" ]; then
            BACKUP_DATE=$(stat -c %y "$BACKUP_DIR_TEST/$LATEST_BACKUP" 2>/dev/null | cut -d' ' -f1)
            check_pass "So'nggi backup: $LATEST_BACKUP ($BACKUP_DATE)"
        fi
        BACKUP_SIZE=$(du -sh "$BACKUP_DIR_TEST" 2>/dev/null | cut -f1)
        check_pass "Backup papkasi hajmi: $BACKUP_SIZE"
    else
        check_warn "Backup'lar topilmadi. Birinchi backup qilinmagan!"
    fi
else
    check_warn "Backup papkasi topilmadi: $BACKUP_DIR_TEST"
    echo "   Avtomatik yaratiladi backup vaqtida"
fi
echo ""

echo "6️⃣  Log Fayli Tekshiruvi"
echo "──────────────────────────────────────────────────"
LOG_FILE_TEST="${LOG_FILE:-$HOME/logs/mongodb-backup.log}"
if [ -f "$LOG_FILE_TEST" ]; then
    check_pass "Log fayli mavjud: $LOG_FILE_TEST"
    LOG_SIZE=$(stat -c %s "$LOG_FILE_TEST" 2>/dev/null || echo "0")
    if [ "$LOG_SIZE" -gt 0 ]; then
        check_pass "Log fayl hajmi: $LOG_SIZE bytes"
        LAST_LOG=$(tail -n 1 "$LOG_FILE_TEST" 2>/dev/null)
        if [ -n "$LAST_LOG" ]; then
            echo "   So'nggi log: $LAST_LOG"
        fi
        # So'nggi muvaffaqiyatli backup'ni topish
        SUCCESS_LOG=$(grep "muvaffaqiyatli yakunlandi" "$LOG_FILE_TEST" 2>/dev/null | tail -1)
        if [ -n "$SUCCESS_LOG" ]; then
            check_pass "So'nggi muvaffaqiyatli backup topildi"
            echo "   $SUCCESS_LOG"
        fi
        # Xatoliklarni tekshirish
        ERROR_COUNT=$(grep -i "xatolik\|error" "$LOG_FILE_TEST" 2>/dev/null | wc -l)
        if [ "$ERROR_COUNT" -gt 0 ]; then
            check_warn "Log'da $ERROR_COUNT ta xatolik topildi"
        fi
    else
        check_warn "Log fayl bo'sh"
    fi
else
    check_warn "Log fayli topilmadi. Birinchi backup qilinganda yaratiladi"
fi
echo ""

echo "7️⃣  Cron Job Tekshiruvi"
echo "──────────────────────────────────────────────────"
CRON_JOBS=$(crontab -l 2>/dev/null | grep -i "mongodb-backup\|backup-database" || echo "")
if [ -n "$CRON_JOBS" ]; then
    check_pass "Cron job topildi:"
    echo "$CRON_JOBS" | while read -r line; do
        echo "   $line"
    done
    # Cron job vaqtini aniqlash
    CRON_TIME=$(echo "$CRON_JOBS" | head -1 | awk '{print $1, $2, $3, $4, $5}')
    if [ -n "$CRON_TIME" ]; then
        echo "   Vaqt: $CRON_TIME"
    fi
else
    check_fail "Cron job topilmadi!"
    echo "   Setup scriptni ishga tushiring: ./setup-backup.sh"
fi
echo ""

echo "8️⃣  Manual Backup Test"
echo "──────────────────────────────────────────────────"
read -p "Manual backup qilmoqchimisiz? (y/n, default: n): " RUN_TEST
if [ "$RUN_TEST" = "y" ] || [ "$RUN_TEST" = "Y" ]; then
    echo ""
    echo "⏳ Backup jarayoni boshlandi..."
    if [ -f "$BACKUP_SCRIPT" ]; then
        bash "$BACKUP_SCRIPT"
        if [ $? -eq 0 ]; then
            check_pass "Manual backup muvaffaqiyatli!"
            # Yangi backup'ni ko'rsatish
            LATEST_BACKUP=$(ls -t "$BACKUP_DIR_TEST" 2>/dev/null | head -1)
            if [ -n "$LATEST_BACKUP" ]; then
                echo "   Yangi backup: $LATEST_BACKUP"
            fi
        else
            check_fail "Manual backup xatosi!"
        fi
    else
        check_fail "Backup script topilmadi!"
    fi
else
    echo "   Manual backup o'tkazib yuborildi"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Natijalari"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo -e "${GREEN}✅ Barcha testlar muvaffaqiyatli!${NC}"
    echo ""
    echo "Backup tizimi to'liq sozlangan va ishlab turgan!"
elif [ "$ERRORS" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Testlar muvaffaqiyatli, lekin $WARNINGS ta ogohlantirish bor${NC}"
    echo ""
    echo "Backup tizimi ishlab turgan, lekin ba'zi sozlamalarni yaxshilash mumkin"
else
    echo -e "${RED}❌ $ERRORS ta xatolik topildi!${NC}"
    echo ""
    echo "Quyidagi qadamlar bilan tuzatish:"
    echo "  1. MongoDB Tools o'rnatish"
    echo "  2. Setup scriptni ishga tushirish: ./setup-backup.sh"
    echo "  3. Log'larni tekshirish: tail -f ~/logs/mongodb-backup.log"
fi

echo ""
echo "📋 Keyingi qadamlar:"
echo "  - Backup'lar: ls -lh ~/backups/mongodb/"
echo "  - Log'lar: tail -f ~/logs/mongodb-backup.log"
echo "  - Cron job: crontab -l"
echo ""

exit $ERRORS

