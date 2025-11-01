#!/bin/bash

###############################################################################
# MongoDB Database Backup Script (Ubuntu Server)
# 
# Bu script MongoDB ma'lumotlar bazasini avtomatik backup qiladi
# 
# Muallif: Uyda Talim Team
# Versiya: 1.0
###############################################################################

set -euo pipefail

# ============================================
# KONFIGURATSIYA (Environment fayldan yuklanadi)
# ============================================

# Script joylashuvi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/.backup.env"

# Agar config fayl mavjud bo'lsa, yuklash
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

# Default sozlamalar
MONGODB_URI="${MONGODB_URI:-mongodb://0.0.0.0:27017/zzzzz}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/mongodb}"
KEEP_DAYS="${KEEP_DAYS:-7}"
DB_NAME="${DB_NAME:-zzzzz}"
COMPRESS="${COMPRESS:-true}"
LOG_FILE="${LOG_FILE:-$HOME/logs/mongodb-backup.log}"
EMAIL_NOTIFICATION="${EMAIL_NOTIFICATION:-false}"
EMAIL_TO="${EMAIL_TO:-admin@uydatalim.uz}"

# ============================================
# FUNKTSIYALAR
# ============================================

# Log yozish
log() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo "$message" | tee -a "$LOG_FILE"
}

# Xatolik va chiqish
error_exit() {
    log "❌ XATOLIK: $1" >&2
    send_notification "Backup Xatolik" "MongoDB backup jarayonida xatolik: $1"
    exit 1
}

# Email xabar yuborish
send_notification() {
    if [ "$EMAIL_NOTIFICATION" = "true" ] && command -v mail &> /dev/null; then
        local subject="$1"
        local body="$2"
        echo "$body" | mail -s "$subject" "$EMAIL_TO" 2>/dev/null || true
    fi
}

# Database nomini URI dan ajratish
extract_db_name() {
    local uri="$1"
    if [[ "$uri" =~ /([^/?]+)(\?|$) ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        echo "zzzzz"
    fi
}

# ============================================
# TEKSHIRISHLAR
# ============================================

log "🚀 MongoDB Backup jarayoni boshlandi..."

# mongodump mavjudligini tekshirish
if ! command -v mongodump &> /dev/null; then
    error_exit "mongodump topilmadi! MongoDB Tools o'rnatilganligini tekshiring:
    sudo apt-get update
    sudo apt-get install -y mongodb-database-tools"
fi

# MongoDB ulanishini tekshirish
if ! mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')" --quiet &>/dev/null; then
    log "⚠️  MongoDB server bilan ulanishda muammo. Lekin davom etamiz..."
fi

# Backup va log papkalarini yaratish
mkdir -p "$BACKUP_DIR" || error_exit "Backup papkasini yaratib bo'lmadi: $BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")" || error_exit "Log papkasini yaratib bo'lmadi: $(dirname "$LOG_FILE")"
touch "$LOG_FILE" || error_exit "Log faylini yaratib bo'lmadi: $LOG_FILE"

# Database nomini aniqlash
if [ -z "$DB_NAME" ] || [ "$DB_NAME" = "auto" ]; then
    DB_NAME=$(extract_db_name "$MONGODB_URI")
fi

log "📋 Backup sozlamalari:"
log "   Database: $DB_NAME"
log "   Backup joylashuvi: $BACKUP_DIR"
log "   Saqlash muddati: $KEEP_DAYS kun"
log "   Compress: $COMPRESS"

# ============================================
# BACKUP JARAYONI
# ============================================

TIMESTAMP=$(date +'%Y-%m-%d_%H-%M-%S')
BACKUP_NAME="${DB_NAME}_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

log ""
log "⏳ Backup jarayoni boshlandi..."

# Backup qilish
BACKUP_START_TIME=$(date +%s)

if [ "$COMPRESS" = "true" ]; then
    log "   Compress bilan backup qilinmoqda..."
    
    # Gzip bilan backup
    if mongodump --uri="$MONGODB_URI" --out="$BACKUP_PATH" --gzip 2>>"$LOG_FILE"; then
        log "   ✅ Backup muvaffaqiyatli yakunlandi"
        
        # Backup'ni tar.gz bilan qo'shimcha arxivlash
        cd "$BACKUP_DIR" || error_exit "Backup papkasiga o'tib bo'lmadi"
        tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME" 2>>"$LOG_FILE" || {
            log "   ⚠️  Tar arxivlashda xatolik, lekin backup mavjud"
        }
        
        # Asl papkani o'chirish (faqat .tar.gz qoladi)
        if [ -f "${BACKUP_NAME}.tar.gz" ]; then
            rm -rf "$BACKUP_NAME"
            BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
        fi
    else
        error_exit "Backup jarayonida xatolik yuz berdi!"
    fi
else
    log "   Oddiy backup qilinmoqda..."
    
    if mongodump --uri="$MONGODB_URI" --out="$BACKUP_PATH" 2>>"$LOG_FILE"; then
        log "   ✅ Backup muvaffaqiyatli yakunlandi"
    else
        error_exit "Backup jarayonida xatolik yuz berdi!"
    fi
fi

BACKUP_END_TIME=$(date +%s)
BACKUP_DURATION=$((BACKUP_END_TIME - BACKUP_START_TIME))

# Backup hajmini hisoblash
if [ -d "$BACKUP_PATH" ]; then
    BACKUP_SIZE=$(du -sh "$BACKUP_PATH" 2>/dev/null | cut -f1)
else
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" 2>/dev/null | cut -f1)
fi

log ""
log "✅ Backup muvaffaqiyatli yakunlandi!"
log "   📁 Backup: $BACKUP_PATH"
log "   💾 Hajm: $BACKUP_SIZE"
log "   ⏱️  Vaqt: ${BACKUP_DURATION} soniya"

# ============================================
# ESKI BACKUP'LARNI TOZALASH
# ============================================

log ""
log "🧹 Eski backup'larni tekshirish (${KEEP_DAYS} kundan eski...)"

DELETED_COUNT=0
if [ "$KEEP_DAYS" -gt 0 ]; then
    while IFS= read -r -d '' file; do
        if [ -f "$file" ] || [ -d "$file" ]; then
            rm -rf "$file"
            DELETED_COUNT=$((DELETED_COUNT + 1))
            log "   🗑️  O'chirildi: $(basename "$file")"
        fi
    done < <(find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*" -type f -mtime +$KEEP_DAYS -print0 2>/dev/null || true)
    
    # Folder'larni ham o'chirish
    while IFS= read -r -d '' dir; do
        if [ -d "$dir" ]; then
            rm -rf "$dir"
            DELETED_COUNT=$((DELETED_COUNT + 1))
            log "   🗑️  O'chirildi: $(basename "$dir")"
        fi
    done < <(find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*" -type d -mtime +$KEEP_DAYS -print0 2>/dev/null || true)
fi

if [ "$DELETED_COUNT" -gt 0 ]; then
    log "   ✅ Jami $DELETED_COUNT ta eski backup o'chirildi"
else
    log "   ℹ️  O'chiriladigan eski backup'lar topilmadi"
fi

# ============================================
# STATISTIKA
# ============================================

TOTAL_BACKUPS=$(find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*" \( -type f -o -type d \) | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

log ""
log "📊 Backup statistikasi:"
log "   Jami backup'lar: $TOTAL_BACKUPS"
log "   Jami hajm: $TOTAL_SIZE"

# ============================================
# YAKUN
# ============================================

log ""
log "✨ Backup jarayoni muvaffaqiyatli yakunlandi!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Email xabar yuborish
send_notification "MongoDB Backup Muvaffaqiyatli" \
    "MongoDB backup muvaffaqiyatli yakunlandi.
    
Database: $DB_NAME
Backup: $BACKUP_PATH
Hajm: $BACKUP_SIZE
Vaqt: ${BACKUP_DURATION} soniya
Jami backup'lar: $TOTAL_BACKUPS"

exit 0

