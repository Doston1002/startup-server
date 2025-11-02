#!/bin/bash

###############################################################################
# MongoDB Autentifikatsiya Sozlash Scripti (Ubuntu Server)
# 
# Bu script MongoDB ma'lumotlar bazasiga autentifikatsiya qo'shadi
# 
# Muallif: Uyda Talim Team
# Versiya: 1.0
###############################################################################

set -euo pipefail

echo "🔐 MongoDB Autentifikatsiya Sozlash"
echo "===================================="
echo ""

# Ranglar
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# MongoDB Service Tekshirish
echo "📋 MongoDB service tekshirilmoqda..."
if ! systemctl is-active --quiet mongod; then
    echo -e "${RED}❌ MongoDB service ishlamayapti!${NC}"
    echo "MongoDB ni ishga tushiring: sudo systemctl start mongod"
    exit 1
fi
echo -e "${GREEN}✅ MongoDB service ishlayapti${NC}"
echo ""

# Ma'lumotlar So'ralmoqda
read -p "Database nomi (default: zzzzz): " db_name
db_name=${db_name:-zzzzz}

read -p "MongoDB foydalanuvchi nomi (default: admin): " db_user
db_user=${db_user:-admin}

read -sp "Parol kiriting: " db_password
echo ""
read -sp "Parolni tasdiqlang: " db_password_confirm
echo ""

if [ "$db_password" != "$db_password_confirm" ]; then
    echo -e "${RED}❌ Parollar mos kelmaydi!${NC}"
    exit 1
fi

if [ -z "$db_password" ]; then
    echo -e "${RED}❌ Parol bo'sh bo'lishi mumkin emas!${NC}"
    exit 1
fi

read -p "MongoDB host (default: localhost): " db_host
db_host=${db_host:-localhost}

read -p "MongoDB port (default: 27017): " db_port
db_port=${db_port:-27017}

echo ""
echo "📝 Kiritilgan ma'lumotlar:"
echo "   Database: $db_name"
echo "   Foydalanuvchi: $db_user"
echo "   Host: $db_host"
echo "   Port: $db_port"
echo ""

read -p "Davom etish? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Bekor qilindi."
    exit 0
fi

echo ""
echo "⏳ MongoDB foydalanuvchisi yaratilmoqda..."

# MongoDB foydalanuvchisini yaratish uchun JavaScript fayl
TEMP_SCRIPT=$(mktemp)
cat > "$TEMP_SCRIPT" << EOF
// Admin databasega o'tish va foydalanuvchi yaratish
try {
    use('$db_name');
    
    // Agar foydalanuvchi allaqachon mavjud bo'lsa, o'chirish
    try {
        db.dropUser('$db_user');
        print('⚠️  Eski foydalanuvchi o\'chirildi');
    } catch (e) {
        // Foydalanuvchi yo'q, davom etish
    }
    
    // Yangi foydalanuvchi yaratish
    db.createUser({
        user: '$db_user',
        pwd: '$db_password',
        roles: [
            { role: 'readWrite', db: '$db_name' }
        ]
    });
    
    print('✅ Foydalanuvchi muvaffaqiyatli yaratildi!');
} catch (e) {
    print('❌ Xatolik: ' + e);
    quit(1);
}
EOF

# MongoDB Shell orqali foydalanuvchi yaratish
if mongosh --quiet "$TEMP_SCRIPT" 2>/dev/null; then
    echo -e "${GREEN}✅ MongoDB foydalanuvchisi yaratildi${NC}"
else
    # Agar mongosh ishlamasa, mongo ni sinab ko'rish
    if mongo --quiet "$TEMP_SCRIPT" 2>/dev/null; then
        echo -e "${GREEN}✅ MongoDB foydalanuvchisi yaratildi${NC}"
    else
        echo -e "${RED}❌ MongoDB foydalanuvchisini yaratishda xatolik${NC}"
        echo "Qo'lda yaratish uchun quyidagi komandani bajaring:"
        echo ""
        echo "mongosh"
        echo "use $db_name"
        echo "db.createUser({"
        echo "  user: '$db_user',"
        echo "  pwd: '$db_password',"
        echo "  roles: [{ role: 'readWrite', db: '$db_name' }]"
        echo "})"
        rm -f "$TEMP_SCRIPT"
        exit 1
    fi
fi

rm -f "$TEMP_SCRIPT"

echo ""
echo "🔧 MongoDB konfiguratsiyasi yangilanmoqda..."

# mongod.conf faylini yangilash
MONGOD_CONF="/etc/mongod.conf"
if [ -f "$MONGOD_CONF" ]; then
    # Security bo'limi mavjudligini tekshirish
    if grep -q "^security:" "$MONGOD_CONF"; then
        # security bo'limi bor, faqat authorization qatorini yangilash
        if grep -q "authorization:" "$MONGOD_CONF"; then
            # authorization allaqachon bor
            sed -i 's/^  authorization:.*/  authorization: enabled/' "$MONGOD_CONF"
        else
            # authorization qo'shish
            sed -i '/^security:/a\  authorization: enabled' "$MONGOD_CONF"
        fi
    else
        # security bo'limini qo'shish
        echo "" >> "$MONGOD_CONF"
        echo "security:" >> "$MONGOD_CONF"
        echo "  authorization: enabled" >> "$MONGOD_CONF"
    fi
    
    echo -e "${GREEN}✅ MongoDB konfiguratsiyasi yangilandi${NC}"
else
    echo -e "${YELLOW}⚠️  $MONGOD_CONF topilmadi. Qo'lda sozlang${NC}"
fi

echo ""
echo "🔄 MongoDB service qayta ishga tushirilmoqda..."
if sudo systemctl restart mongod; then
    echo -e "${GREEN}✅ MongoDB qayta ishga tushirildi${NC}"
else
    echo -e "${RED}❌ MongoDB qayta ishga tushirishda xatolik${NC}"
    exit 1
fi

echo ""
echo "📝 Connection String:"
echo "===================="

# URL encoding uchun funksiya
urlencode() {
    local string="${1}"
    local strlen=${#string}
    local encoded=""
    local pos c o

    for (( pos=0 ; pos<strlen ; pos++ )); do
        c=${string:$pos:1}
        case "$c" in
            [-_.~a-zA-Z0-9] ) o="${c}" ;;
            * ) printf -v o '%%%02x' "'$c"
        esac
        encoded+="${o}"
    done
    echo "${encoded}"
}

encoded_password=$(urlencode "$db_password")

CONNECTION_STRING="mongodb://${db_user}:${encoded_password}@${db_host}:${db_port}/${db_name}"

echo -e "${GREEN}${CONNECTION_STRING}${NC}"
echo ""

# .env faylini yangilash
read -p ".env faylini yangilash? (y/n): " update_env
if [ "$update_env" = "y" ] || [ "$update_env" = "Y" ]; then
    read -p ".env fayl joylashuvi (default: ./back/.env): " env_file
    env_file=${env_file:-./back/.env}
    
    if [ -f "$env_file" ]; then
        # MONGODB_URI ni yangilash yoki qo'shish
        if grep -q "^MONGODB_URI=" "$env_file"; then
            sed -i "s|^MONGODB_URI=.*|MONGODB_URI=\"${CONNECTION_STRING}\"|" "$env_file"
            echo -e "${GREEN}✅ $env_file faylida MONGODB_URI yangilandi${NC}"
        else
            echo "MONGODB_URI=\"${CONNECTION_STRING}\"" >> "$env_file"
            echo -e "${GREEN}✅ $env_file fayliga MONGODB_URI qo'shildi${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  $env_file topilmadi. Qo'lda qo'shing:${NC}"
        echo "MONGODB_URI=\"${CONNECTION_STRING}\""
    fi
fi

echo ""
echo "✅ Autentifikatsiya muvaffaqiyatli sozlandi!"
echo ""
echo "📋 Keyingi qadamlar:"
echo "1. Backend .env faylida MONGODB_URI ni yangilang"
echo "2. Backup scriptlarida ham connection stringni yangilang"
echo "3. Backend ni qayta ishga tushiring"
echo ""
echo "🧪 Test qilish:"
echo "mongosh \"${CONNECTION_STRING}\""

