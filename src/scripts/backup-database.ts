import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from 'dotenv';

// Load environment variables
config();

const execAsync = promisify(exec);
const appRoot = require('app-root-path').path;

interface BackupOptions {
  outputDir?: string;
  compress?: boolean;
  keepDays?: number; // Eski backup'larni saqlash muddati (kunlar)
}

/**
 * MongoDB Database Backup Script
 * 
 * Bu script MongoDB ma'lumotlar bazasini backup qiladi
 * 
 * Ishlatish:
 *   npm run backup-db
 *   yoki
 *   npm run backup-db -- --compress --keepDays=7
 */
async function backupDatabase(options: BackupOptions = {}) {
  const {
    outputDir = path.join(appRoot, 'backups'),
    compress = true,
    keepDays = 7,
  } = options;

  try {
    // Environment variables
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable topilmadi!');
    }

    // MongoDB URI dan database nomini olish
    const dbName = extractDatabaseName(mongoUri);
    
    if (!dbName) {
      throw new Error('Database nomi topilmadi!');
    }

    // Backup papkasini yaratish
    await fs.ensureDir(outputDir);

    // Backup nomi: database-name_YYYY-MM-DD_HH-mm-ss
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupName = `${dbName}_${timestamp}`;
    const backupPath = path.join(outputDir, backupName);

    console.log('📦 MongoDB Backup boshlandi...');
    console.log(`Database: ${dbName}`);
    console.log(`Output: ${backupPath}`);

    // mongodump komandasi
    let command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;

    // Agar compress kerak bo'lsa
    let finalBackupPath = backupPath;
    if (compress) {
      command += ' --gzip';
      finalBackupPath = `${backupPath}.gz`;
    }

    // Backup qilish
    console.log('\n⏳ Backup jarayoni...');
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('writing')) {
      console.error('⚠️  Xatolik:', stderr);
    }

    console.log('✅ Backup muvaffaqiyatli yakunlandi!');
    console.log(`📁 Backup joylashuvi: ${finalBackupPath}`);

    // Eski backup'larni o'chirish
    await cleanupOldBackups(outputDir, keepDays, dbName);

    // Backup hajmini ko'rsatish
    const stats = await fs.stat(finalBackupPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`💾 Backup hajmi: ${sizeInMB} MB`);

    return {
      success: true,
      backupPath: finalBackupPath,
      size: stats.size,
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    console.error('❌ Backup xatosi:', error.message);
    
    if (error.message.includes('mongodump')) {
      console.error('\n💡 Mongodump topilmadi! MongoDB Tools o\'rnatilganligini tekshiring:');
      console.error('   https://www.mongodb.com/try/download/database-tools');
    }
    
    throw error;
  }
}

/**
 * MongoDB URI dan database nomini olish
 */
function extractDatabaseName(uri: string): string | null {
  try {
    // mongodb://user:pass@host:port/database?options
    // yoki
    // mongodb+srv://user:pass@cluster/database?options
    
    const match = uri.match(/\/([^\/\?]+)(\?|$)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Eski backup'larni o'chirish
 */
async function cleanupOldBackups(backupDir: string, keepDays: number, dbName: string) {
  try {
    const files = await fs.readdir(backupDir);
    const now = Date.now();
    const maxAge = keepDays * 24 * 60 * 60 * 1000; // milliseconds

    let deletedCount = 0;
    
    for (const file of files) {
      // Faqat shu database uchun backup'larni tekshirish
      if (!file.startsWith(dbName)) continue;

      const filePath = path.join(backupDir, file);
      const stats = await fs.stat(filePath);
      const fileAge = now - stats.mtimeMs;

      if (fileAge > maxAge) {
        await fs.remove(filePath);
        deletedCount++;
        console.log(`🗑️  Eski backup o'chirildi: ${file}`);
      }
    }

    if (deletedCount > 0) {
      console.log(`\n🧹 ${deletedCount} ta eski backup o'chirildi`);
    }
  } catch (error: any) {
    console.warn('⚠️  Eski backuplarini o\'chirishda xatolik:', error.message);
  }
}

// Command line arguments
function parseArguments(): BackupOptions {
  const args = process.argv.slice(2);
  const options: BackupOptions = {};

  args.forEach(arg => {
    if (arg === '--compress') {
      options.compress = true;
    } else if (arg.startsWith('--keepDays=')) {
      options.keepDays = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--outputDir=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg === '--no-compress') {
      options.compress = false;
    }
  });

  return options;
}

// Script ishga tushirish
if (require.main === module) {
  const options = parseArguments();
  
  backupDatabase(options)
    .then(result => {
      console.log('\n✨ Backup muvaffaqiyatli yakunlandi!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Backup xatosi:', error);
      process.exit(1);
    });
}

export { backupDatabase, BackupOptions };

