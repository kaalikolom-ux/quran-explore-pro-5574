# Database & System Restore Guide (রিস্টোর নির্দেশিকা)

**Project**: Quran Explore Pro (wooniche.com)  
**Backup Snapshot Date**: 2026-08-31T15:36:46.592Z  

---

## ১. ডাটাবেজ স্কিমা রিস্টোর করার নিয়ম (Supabase Schema Restore)
যদি Supabase-এ কোনো টেবিল বা স্কিমায় সমস্যা হয়:
1. Supabase Dashboard -> **SQL Editor**-এ যান।
2. `backups/supabase_master_schema_backup_20260831.sql` ফাইলের কোড সম্পূর্ণ কপি করে পেস্ট করুন।
3. **Run** বাটনে চাপুন। এটি সমস্ত টেবিল, রিলেশন, RLS পলিসি এবং ফাংশন পুনরায় প্রস্তুত করে দেবে।

---

## ২. কুরআন ডাটা রিস্টোর করার নিয়ম (Quran Content Restore)
যদি কোনো সূরার অনুবাদ বা মেটা ডাটা ক্ষতিগ্রস্ত হয়:
- সম্পূর্ণ ১–১১৪ সূরার অরিজিনাল ব্যাকআপ সংরক্ষিত আছে `backups/quran_data_snapshot_20260831.json` ফাইলে।
- `public/data/quran/surahs/*.json` ফোল্ডারে প্রতিটি সূরার ফাইল অক্ষত রয়েছে।

---

## ৩. ফাইল তালিকা (Backup Manifest)
- `supabase_master_schema_backup_20260831.sql`: সমস্ত Supabase SQL মাইগ্রেশনের সমন্বিত ব্যাকআপ।
- `quran_data_snapshot_20260831.json`: ১–১১৪ সূরার সমস্ত আয়াত, আরবি, উচ্চারণ, আধুনিক বাংলা/ইংরেজি অনুবাদ ও মেটা ডাটার স্ন্যাপশট।
