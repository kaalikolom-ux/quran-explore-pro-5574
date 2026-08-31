import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const wranglerConfigPath = path.resolve(".output/server/wrangler.json");
const workerName = "kaalikolom-ux-quran-explore-pro-5574";
const label = "wooniche.com (Quran Explorer)";

console.log(`\n🚀 Deploying to ${label} (Worker: ${workerName})...`);
if (fs.existsSync(wranglerConfigPath)) {
  const config = JSON.parse(fs.readFileSync(wranglerConfigPath, "utf-8"));
  config.name = workerName;
  fs.writeFileSync(wranglerConfigPath, JSON.stringify(config, null, 2), "utf-8");
}
execSync("npx nitro deploy --prebuilt", { stdio: "inherit" });
console.log(`✅ Successfully deployed to ${label}!`);
