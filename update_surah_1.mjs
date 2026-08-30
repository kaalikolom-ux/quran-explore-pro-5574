import fs from "fs";

const p = "public/data/quran/surahs/1.json";
const data = JSON.parse(fs.readFileSync(p, "utf-8"));
const metas = [
  { bn: "সিস্টেমের মূল উৎসের পরিচয় ও করুণাময় গুণাবলী", en: "Root Directory Authentication" },
  { bn: "সমস্ত ডেটা-সিস্টেমের Root Directory-এর প্রশংসা", en: "Attribute Signal Broadcast" },
  { bn: "সর্ব-ব্যাপী ও পার্সোনালাইজড করুণা", en: "Data-compassionate Declaration" },
  { bn: "চূড়ান্ত হিসাব-নিকাশের সময়কালের কর্তৃত্ব", en: "Final Phase Recognition" },
  { bn: "একমাত্র Root Directory-এর সাথে সংযোগ ও সহায়তা প্রার্থনা", en: "Full Synchronization Protocol" },
  { bn: "সঠিক পথপ্রদর্শনের আবেদন", en: "Optimized Pathway Request" },
  { bn: "অনুগ্রহপ্রাপ্তদের পথ, Penalty ও Deviation এড়ানো", en: "Data-blessing Stream Allocation" }
];

data.ayahs.forEach((a, i) => {
  if (metas[i]) {
    a.meta_bn = metas[i].bn;
    a.meta_en = metas[i].en;
  }
});

fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
console.log("Updated Surah 1 with metadata successfully!");
