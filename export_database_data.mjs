import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const backupDir = "C:\\Users\\Alam M\\Site_Backups";

function jsonToSqlInserts(tableName, rows) {
  if (!rows || rows.length === 0) return "-- No rows for " + tableName + "\n";
  const columns = Object.keys(rows[0]);
  const sqlLines = [];
  
  for (const row of rows) {
    const vals = columns.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return "NULL";
      if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
      if (typeof val === "number") return val;
      if (typeof val === "object") return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
      return "'" + String(val).replace(/'/g, "''") + "'";
    });
    sqlLines.push(`INSERT INTO public.${tableName} (${columns.join(", ")}) VALUES (${vals.join(", ")}) ON CONFLICT DO NOTHING;`);
  }
  return `-- Data for ${tableName} (${rows.length} rows)\n` + sqlLines.join("\n") + "\n\n";
}

async function exportProject(name, url, key, tables) {
  console.log(`Starting export for ${name}...`);
  const client = createClient(url, key);
  const dataExport = {};
  let fullSqlData = `-- ==============================================================================\n-- 📦 Data Backup for ${name}\n-- Generated: ${new Date().toISOString()}\n-- ==============================================================================\n\n`;

  for (const table of tables) {
    try {
      const { data, error } = await client.from(table).select("*").limit(5000);
      if (error) {
        console.warn(`[${name}] Notice on table ${table}:`, error.message);
      } else {
        dataExport[table] = data || [];
        fullSqlData += jsonToSqlInserts(table, data || []);
        console.log(`[${name}] Exported ${data ? data.length : 0} rows from ${table}`);
      }
    } catch (e) {
      console.warn(`[${name}] Error on table ${table}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(backupDir, `${name}_data.json`), JSON.stringify(dataExport, null, 2), "utf-8");
  fs.writeFileSync(path.join(backupDir, `${name}_DATA_BACKUP.sql`), fullSqlData, "utf-8");
  console.log(`Finished export for ${name}!`);
}

async function main() {
  const quranTables = ["categories", "authors", "articles", "tags", "pages", "menu_items", "social_links", "contact_messages", "surah_info", "turnstile_settings"];
  await exportProject("wooniche_quran", "https://djoshusyzfsndnmwpoxd.supabase.co", "sb_publishable_AGmD3MCDM_5-9yqQuqnDLw_WDAIfNGp", quranTables);

  const alamTables = ["categories", "authors", "articles", "article_categories", "tags", "pages", "menu_items", "social_links", "contact_messages", "turnstile_settings"];
  await exportProject("a_wooniche_alam_m", "https://qehupsubyhemzmscoiig.supabase.co", "sb_publishable_qBP_JYLoYwMDE3ikPXUmbQ_ghibepTw", alamTables);
}

main().catch(console.error);
