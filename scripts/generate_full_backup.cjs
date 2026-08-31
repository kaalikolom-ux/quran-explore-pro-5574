const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const backupsDir = path.join(rootDir, 'backups');
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
const surahsDir = path.join(rootDir, 'public', 'data', 'quran', 'surahs');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const dateStr = '20260831';

console.log('--- Starting Full Database & System Backup ---');

// 1. Compile Master SQL Migration
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

let masterSql = `-- ==============================================================================
-- MASTER SUPABASE DATABASE SCHEMA BACKUP
-- Project: Quran Explore Pro (kaalikolom-ux / wooniche.com)
-- Backup Date: ${new Date().toISOString()}
-- Total Source Migrations: ${migrationFiles.length}
-- ==============================================================================

`;

migrationFiles.forEach((file) => {
  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  masterSql += `\n-- ------------------------------------------------------------------------------\n`;
  masterSql += `-- Migration: ${file}\n`;
  masterSql += `-- ------------------------------------------------------------------------------\n`;
  masterSql += content.trim() + `\n`;
});

const masterSqlPath = path.join(backupsDir, `supabase_master_schema_backup_${dateStr}.sql`);
fs.writeFileSync(masterSqlPath, masterSql, 'utf8');
console.log(`✅ Master SQL Schema Backup created: ${masterSqlPath} (${(masterSql.length / 1024).toFixed(2)} KB)`);

// 2. Compile Quran Master Data Snapshot
const surahFiles = fs.readdirSync(surahsDir)
  .filter(f => f.endsWith('.json'))
  .sort((a, b) => parseInt(a) - parseInt(b));

const quranSnapshot = {
  backup_date: new Date().toISOString(),
  total_surahs: surahFiles.length,
  surahs: {}
};

surahFiles.forEach(file => {
  const surahId = path.basename(file, '.json');
  const filePath = path.join(surahsDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    quranSnapshot.surahs[surahId] = data;
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
  }
});

const quranSnapshotPath = path.join(backupsDir, `quran_data_snapshot_${dateStr}.json`);
fs.writeFileSync(quranSnapshotPath, JSON.stringify(quranSnapshot, null, 2), 'utf8');
console.log(`✅ Quran Data Snapshot created: ${quranSnapshotPath} (${(fs.statSync(quranSnapshotPath).size / (1024 * 1024)).toFixed(2)} MB)`);

// 3. Create Restoration Guide
const restoreGuide = `# Database & System Restore Guide (রিস্টোর নির্দেশিকা)

**Project**: Quran Explore Pro (wooniche.com)  
**Backup Snapshot Date**: ${new Date().toISOString()}  

---

## ১. ডাটাবেজ স্কিমা রিস্টোর করার নিয়ম (Supabase Schema Restore)
যদি Supabase-এ কোনো টেবিল বা স্কিমায় সমস্যা হয়:
1. Supabase Dashboard -> **SQL Editor**-এ যান।
2. \`backups/supabase_master_schema_backup_${dateStr}.sql\` ফাইলের কোড সম্পূর্ণ কপি করে পেস্ট করুন।
3. **Run** বাটনে চাপুন। এটি সমস্ত টেবিল, রিলেশন, RLS পলিসি এবং ফাংশন পুনরায় প্রস্তুত করে দেবে।

---

## ২. কুরআন ডাটা রিস্টোর করার নিয়ম (Quran Content Restore)
যদি কোনো সূরার অনুবাদ বা মেটা ডাটা ক্ষতিগ্রস্ত হয়:
- সম্পূর্ণ ১–১১৪ সূরার অরিজিনাল ব্যাকআপ সংরক্ষিত আছে \`backups/quran_data_snapshot_${dateStr}.json\` ফাইলে।
- \`public/data/quran/surahs/*.json\` ফোল্ডারে প্রতিটি সূরার ফাইল অক্ষত রয়েছে।

---

## ৩. ফাইল তালিকা (Backup Manifest)
- \`supabase_master_schema_backup_${dateStr}.sql\`: সমস্ত Supabase SQL মাইগ্রেশনের সমন্বিত ব্যাকআপ।
- \`quran_data_snapshot_${dateStr}.json\`: ১–১১৪ সূরার সমস্ত আয়াত, আরবি, উচ্চারণ, আধুনিক বাংলা/ইংরেজি অনুবাদ ও মেটা ডাটার স্ন্যাপশট।
`;

const restoreGuidePath = path.join(backupsDir, 'README_RESTORE_GUIDE.md');
fs.writeFileSync(restoreGuidePath, restoreGuide, 'utf8');
console.log(`✅ Restoration Guide created: ${restoreGuidePath}`);

console.log('--- Backup Completed Successfully! ---');
