import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const wranglerConfigPath = path.resolve(".output/server/wrangler.json");
const targetWorkers = [
  "quran-explore-pro-5574",               // Powers wooniche.com (apex domain)
  "kaalikolom-ux-quran-explore-pro-5574", // Powers www.wooniche.com
];

for (const workerName of targetWorkers) {
  console.log(`\n🚀 Deploying to Cloudflare Edge (Worker: ${workerName})...`);
  if (fs.existsSync(wranglerConfigPath)) {
    const config = JSON.parse(fs.readFileSync(wranglerConfigPath, "utf-8"));
    config.name = workerName;
    const utcDate = new Date().toISOString().slice(0, 10);
    config.compatibility_date = utcDate;
    fs.writeFileSync(wranglerConfigPath, JSON.stringify(config, null, 2), "utf-8");
  }
  execSync("npx nitro deploy --prebuilt", { stdio: "inherit" });
  console.log(`✅ Successfully deployed to Worker: ${workerName}!`);
}

console.log(`\n🎉 Full deployment completed for both wooniche.com and www.wooniche.com!`);
