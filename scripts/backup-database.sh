#!/bin/bash

# MongoDB Database Backup Script (Server tomonidan ishlatish uchun)
# 
# Bu script serverda cron job orqali ishlatiladi
# 
# Cron job qo'shish:
#   crontab -e
#   Har kuni soat 2:00 da backup qilish:
#     0 2 * * * /path/to/backup-database.sh >> /var/log/mongodb-backup.log 2>&1
#
# Yoki har soat:
#   0 * * * * /path/to/backup-database.sh >> /var/log/mongodb-backup.log 2>&1

# ============================================
# KONFIGURATSIYA
# ============================================

# MongoDB URI (yoki alohida parametrlar)
MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/uyda-talim}"

# Backup papkasi
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mongodb}"

# Backup saqlash muddati (kunlar)
KEEP_DAYS="${KEEP_DAYS:-7}"

# Database nomi
DB_NAME="${DB_NAME:-uyda-talim}"

# Compress (true/false)
COMPRESS="${COMPRESS:-true}"

# Log fayl
LOG_FILE="${LOG_FILE:-/var/log/mongodb-backup.log}"

# ============================================
# FUNKTSIYALAR
# ============================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error() {
    log "❌ XATOLIK: $1" >&2
    exit 1
}

# ============================================
# TEKSHIRISHLAR
# ============================================

# mongodump mavjudligini tekshirish
if ! command -v mongodump &> /dev/null; then
    error "mongodump topilmadi! MongoDB Tools o'rnatilganligini tekshiring."
fi

# Backup papkasini yaratish
mkdir -p "$BACKUP_DIR" || error "Backup papkasini yaratib bo'lmadi: $BACKUP_DIR"

# ============================================
# BACKUP JARAYONI
# ============================================

log "📦 MongoDB Backup boshlandi..."
log "Database: $DB_NAME"
log "Backup joylashuvi: $BACKUP_DIR"

# Timestamp
TIMESTAMP=$(date +'%Y-%m-%d_%H-%M-%S')
BACKUP_NAME="${DB_NAME}_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Backup qilish
if [ "$COMPRESS" = "true" ]; then
    log "⏳ Backup jarayoni (compress bilan)..."
    mongodump --uri="$MONGODB_URI" --out="$BACKUP_PATH" --gzip
    
    # Compress qilingan backup'ni arxivlash
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
    rm -rf "$BACKUP_NAME"
    BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
else
    log "⏳ Backup jarayoni..."
    mongodump --uri="$MONGODB_URI" --out="$BACKUP_PATH"
fi

# Backup muvaffaqiyatini tekshirish
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log "✅ Backup muvaffaqiyatli yakunlandi!"
    log "📁 Backup: $BACKUP_PATH"
    log "💾 Hajm: $BACKUP_SIZE"
else
    error "Backup jarayonida xatolik yuz berdi!"
fi

# ============================================
# ESKI BACKUP'LARNI O'CHIRISH
# ============================================

log "🧹 Eski backup'larni tekshirish (${KEEP_DAYS} kun)..."
DELETED=$(find "$BACKUP_DIR" -name "${DB_NAME}_*" -type f -mtime +$KEEP_DAYS -delete -print | wc -l)

if [ "$DELETED" -gt 0 ]; then
    log "🗑️  $DELETED ta eski backup o'chirildi"
else
    log "ℹ️  O'chiriladigan eski backup'lar topilmadi"
fi

# ============================================
# YAKUN
# ============================================

log "✨ Backup jarayoni yakunlandi!"

# Email xabar yuborish (ixtiyoriy)
# echo "MongoDB Backup muvaffaqiyatli yakunlandi. Backup hajmi: $BACKUP_SIZE" | \
#     mail -s "MongoDB Backup - $(date +'%Y-%m-%d')" admin@example.com

exit 0

