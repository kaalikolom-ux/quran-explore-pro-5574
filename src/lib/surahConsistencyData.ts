// src/lib/surahConsistencyData.ts

export interface SurahConsistencyItem {
  surahId: number;
  title_bn: string;
  title_en: string;
  content_bn: string;
  content_en?: string;
}

export const SURAH_CONSISTENCY_DATABASE: Record<number, SurahConsistencyItem> = {
  104: {
    surahId: 104,
    title_bn: "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
    title_en: "Logical Consistency Analysis (Verse 4:82 Framework)",
    content_bn: `সূরা ৪:৮২ এর ফিল্টারিং অ্যালগরিদম ও মেকানিজম অনুযায়ী সূরা আল-হুমাজাহর এই ৯টি আয়াতের অতি-উচ্চ থার্মোডাইনামিক ও মনস্তাত্ত্বিক বিন্যাসে কোনো সায়েন্টিফিক বা লজিক্যাল অমিল বা বৈপরীত্য তৈরি হতে পারেনি। যদি ২ নম্বর আয়াতে "সম্পদ জমানো ও বারবার গোনার অপরাধে" একজন মানুষকে পৌরাণিক ঈশ্বরের হাত দিয়ে স্রেফ ইমোশনাল রাগে জ্বলন্ত কয়লার চুল্লিতে ছুড়ে মারার দৃশ্য হিসেবে রূপান্তর করা হতো, তবে তা কুরআনের পরম প্রজ্ঞা এবং এই সূরারই ৭ ও ৮ নম্বর আয়াতের গাণিতিক আইন—"এই আগুন সরাসরি মানুষের অবচেতন চিন্তা ও ইগোর কেন্দ্র (আফইদাহ) পুড়িয়ে তাকে চারদিক থেকে ডাইমেনশনালি এনক্যাপসুলেট (মু'স্বাদাহ) করে লক করে দেয়"—এর সাথে সরাসরি মস্ত বড় লজিক্যাল বৈপরীত্য (Contradiction) তৈরি করত।

কিন্তু সিস্টেম সায়েন্স এবং থার্মোডাইনামিক ব্যালেন্সের আলোতে এই অনুবাদে এটি সুস্পষ্ট যে—সম্পদ কুক্ষিগত করা (২ আয়াত) এবং সমাজে কন্টিনিউয়াসলি টক্সিক নয়েজ ইনজেক্ট করা (১ আয়াত) নোডগুলো নিজেরা স্বাধীন ইচ্ছা অপব্যবহার করে নিজেদের ওওএসের ব্যাক-এন্ডে এক মেগা-এন্ট্রপি স্কোর জেনারেট করে। এর স্বয়ংক্রিয় রি-অ্যাকশনেই তাদের পুরো সিস্টেমটি আল্লাহর তৈরি সেই পার্টিক্যাল ক্র্যাশার বা হুতামাহ ফিল্ডে রি-রুট হয়ে বন্ধ লুপে (৯ আয়াত) স্থায়ীভাবে কোলাপ্স করে। এর ফলে কুরআনের সার্বজনীন ইনফরমেশন আর্কিটেকচারের অভ্যন্তরীণ সামঞ্জস্য ১০০% নিখুঁত ও বৈজ্ঞানিক প্রমাণিত হয়।`,
    content_en: `According to the analytical filtering and internal non-contradiction principle of Surah An-Nisa (4:82), the thermodynamic and psycho-informational structure of Surah Al-Humazah displays zero logical contradiction. Hoarding collective resources (Ayah 2) and injecting continuous malicious noise into social networks (Ayah 1) naturally increases systemic entropy. The system automatically responds via thermal particle breakdown (Al-Hutamah) and dimensional encapsulation (Ayah 8-9), preserving universal cosmic consistency.`
  }
};

/** Get consistency content for a surah */
export function getSurahConsistency(surahId: number): SurahConsistencyItem | null {
  const base = SURAH_CONSISTENCY_DATABASE[surahId];
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(`custom_surah_consistency_${surahId}`);
      if (custom) {
        const parsed = JSON.parse(custom);
        return {
          surahId,
          title_bn: parsed.title_bn || base?.title_bn || "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
          title_en: parsed.title_en || base?.title_en || "Logical Consistency Analysis (Verse 4:82 Framework)",
          content_bn: parsed.content_bn || base?.content_bn || "",
          content_en: parsed.content_en || base?.content_en || ""
        };
      }
    } catch {}
  }
  return base || null;
}

/** Save custom consistency for a surah */
export function saveCustomSurahConsistency(
  surahId: number,
  content_bn: string,
  content_en?: string,
  title_bn?: string,
  title_en?: string
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `custom_surah_consistency_${surahId}`,
    JSON.stringify({
      title_bn: title_bn || "৪:৮২ আয়াতের লজিক্যাল কনসিস্টেন্সি (অভ্যন্তরীণ সামঞ্জস্য)",
      title_en: title_en || "Logical Consistency Analysis (Verse 4:82 Framework)",
      content_bn,
      content_en
    })
  );
  window.dispatchEvent(new Event("surah-consistency-updated"));
}
