const fs = require('fs');

const bnData = {
  1: { conventional_bn: 'উদ্বোধনী', scientific_bn: 'মাস্টার বুট লোডার / সিস্টেম ইনিশিয়ালাইজেশন প্রটোকল (যা ওওএস-এর মূল অপারেটিং কোড আনলক করে)' },
  2: { conventional_bn: 'গাভী', scientific_bn: 'বায়োলজিক্যাল ডেটা-পিউরিফিকেশন প্রটোকল / সাইকোলজিক্যাল ম্যালওয়্যার ডিলিশন মডিউল' },
  3: { conventional_bn: 'ইমরানের পরিবার', scientific_bn: 'জেনারেশনাল নোড ক্লাস্টার / লেজাসি ডেটা-ট্রান্সমিটার ফ্যামিলি' },
  4: { conventional_bn: 'নারীগণ', scientific_bn: 'ফিমেল নোড-ক্লাস্টার প্রটেকশন প্রটোকল / সোসিও-জেনেটিক রিসোর্স ডিস্ট্রিবিউশন ফ্রেমওয়ার্ক' },
  5: { conventional_bn: 'খাদ্যসামগ্রী / দস্তরখান', scientific_bn: 'ডিভাইন ডেটা-ফুয়েল সিস্টেম / হাই-কোয়ালিটি ইনপুট রিসোর্স টেবিল' },
  6: { conventional_bn: 'গবাদি পশু', scientific_bn: 'বায়োলজিক্যাল এনার্জি কনভার্টার / ইকোসিস্টেম রিসোর্স সাসটেনেন্স মডিউল' },
  7: { conventional_bn: 'উঁচু স্থান / প্রাচীর', scientific_bn: 'সিস্টেম বাউন্ডারি ইন্টারফেস / ডেটা-ভেরিফিকেশন গেটওয়ে নোড' },
  8: { conventional_bn: 'যুদ্ধলব্ধ সম্পদ', scientific_bn: 'কসমিক রিসোর্স অ্যালোকেশন অ্যালগরিদম' },
  9: { conventional_bn: 'ক্ষমা প্রার্থনা / তওবা', scientific_bn: 'সিস্টেম রিকভারি ও ডেটা-রিস্টোরেশন প্রটোকল' },
  10: { conventional_bn: 'নবী ইউনুস', scientific_bn: 'সাবমারিন আইসোলেশন রিকভারি মডিউল / ডেটা-রি-ইন্ট্রি প্রোটোকল' },
  11: { conventional_bn: 'নবী হুদ', scientific_bn: 'সিস্টেম ট্রুথ গাইডেন্স কোড / আউটলায়ার ফিল্টারিং প্রটোকল' },
  12: { conventional_bn: 'নবী ইউসুফ', scientific_bn: 'ড্রিম-কোর সিমুলেশন প্রসেসর / ফাইন্যান্সিয়াল ডেটা অ্যালোকেশন প্রটোকল' },
  13: { conventional_bn: 'বজ্র', scientific_bn: 'কসমিক ইলেক্ট্রোম্যাগনেটিক ওয়েভ জেনারেটর / থান্ডার সিগন্যাল ট্রান্সমিটার' },
  14: { conventional_bn: 'নবী ইব্রাহীম', scientific_bn: 'মোনোথিস্টিক রুট নোড / ফাউন্ডেশনাল ট্রাস্ট প্রটোকল' },
  15: { conventional_bn: 'পাথুরে স্থান', scientific_bn: 'ভূ-তাত্ত্বিক ডেটা-স্টোরেজ জোন / ফসিলাইজড নোড মেমোরি' },
  16: { conventional_bn: 'মৌমাছি', scientific_bn: 'ডেটা-পোলিনেশন প্রোটোকল / নেটওয়ার্কড ইকোসিস্টেম অপ্টিমাইজার' },
  17: { conventional_bn: 'রাত্রি ভ্রমণ', scientific_bn: 'ডাইমেনশনাল ট্রাভেল প্রটোকল / স্পেস-টাইম অ্যাক্সেস ওভাররাইড' },
  18: { conventional_bn: 'গুহা', scientific_bn: 'হাইবারনেশন শেল্টার মোড / লং-টার্ম ডেটা-সাসপেন্ড প্রটোকল' },
  19: { conventional_bn: 'মেরি / মারইয়াম', scientific_bn: 'ভার্জিন বায়ো-গেটওয়ে / সিঙ্গুলার জেনেটিক ইনজেকশন নোড' },
  20: { conventional_bn: 'ত্বোয়া-হা (বিচ্ছিন্ন অক্ষর)', scientific_bn: 'সুরক্ষিত ডেটা বাউন্ডারি + প্রাণশক্তি অ্যাক্টিভেশন বাইনারি কোড' },
  21: { conventional_bn: 'নবীগণ', scientific_bn: 'ডেটা-রিসিভার এজেন্ট নেটওয়ার্ক / অথেন্টিকেটেড ট্রান্সমিটার ক্লাস্টার' },
  22: { conventional_bn: 'হজ্জ / তীর্থযাত্রা', scientific_bn: 'গ্লোবাল সিঙ্ক্রোনাইজেশন প্রটোকল / বার্ষিক কসমিক আপডেট সেশন' },
  23: { conventional_bn: 'মুমিনগণ', scientific_bn: 'ভেরিফাইড ইউজার ক্লাস্টার / সিকিউরিটি-ক্লিয়ারড নোড গ্রুপ' },
  24: { conventional_bn: 'আলো', scientific_bn: 'হাই-ফ্রিকোয়েন্সি ডেটা ট্রান্সমিশন / কসমিক সিগন্যাল বুস্টার' },
  25: { conventional_bn: 'সত্য-মিথ্যার পার্থক্যকারী', scientific_bn: 'ট্রুথ-ফলসি ডিসক্রিমিনেটর উইন্ডো / ডেটা ফিল্টারিং প্রটোকল' },
  26: { conventional_bn: 'কবিগণ', scientific_bn: 'ডেটা-রিদম জেনারেটর / লিঙ্গুইস্টিক কোড অপ্টিমাইজার' },
  27: { conventional_bn: 'পিঁপড়া', scientific_bn: 'মাইক্রো-নেটওয়ার্কড অপারেটিং সিস্টেম / কলোনি লজিক প্রটোকল' },
  28: { conventional_bn: 'কাহিনী / ঘটনাবলী', scientific_bn: 'হিস্টোরিক্যাল ডেটা-লগ রিট্রিভাল / ন্যারেটিভ কোড ডিকোডার' },
  29: { conventional_bn: 'মাকড়সা', scientific_bn: 'সিস্টেম ট্র্যাপ নেটওয়ার্ক / ডেটা-ফিল্টারিং ওয়েব আর্কিটেকচার' },
  30: { conventional_bn: 'রোমানগণ', scientific_bn: 'সিভিলাইজেশন ডেটা-সাইকেল / ইম্পেরিয়াল নোড ক্লাস্টার' },
  31: { conventional_bn: 'লুকমান', scientific_bn: 'প্যারেন্টাল নোড গাইডেন্স কোড / উইজডম ট্রান্সমিটার' },
  32: { conventional_bn: 'সিজদা / নতি স্বীকার', scientific_bn: 'ফাংশনাল সাবমিশন প্রটোকল / ইন্টিগ্রেশন গ্রাউন্ডিং মেকানিজম' },
  33: { conventional_bn: 'বিভিন্ন দল / সম্মিলিত বাহিনী', scientific_bn: 'কোয়ালিশন নোড ক্লাস্টার / মাল্টি-ফ্রন্ট সিস্টেম ডিফেন্স' },
  34: { conventional_bn: 'সাবা জাতি', scientific_bn: 'হাইড্রোলিক সিভিলাইজেশন ডেটা / ওয়াটার-রিসোর্স ম্যানেজমেন্ট নোড' },
  35: { conventional_bn: 'স্রষ্টা / উদ্ভাবক', scientific_bn: 'শূন্য থেকে স্পেস-টাইম গ্রিডের রূপকার' },
  36: { conventional_bn: 'ইয়া-সীন', scientific_bn: 'চেতনার অ্যাকশন + ওহী সিগন্যাল ফ্রিকোয়েন্সি লিঙ্কিং কোড' },
  37: { conventional_bn: 'সারিবদ্ধভাবে দাঁড়ানো', scientific_bn: 'অ্যালাইনড নোড গ্রিড / সিস্টেম সারিবদ্ধকরণ প্রটোকল' },
  38: { conventional_bn: 'সোয়াদ', scientific_bn: 'কোর ব্যালেন্সার / ডেটা অডিট ফিল্টার কোড' },
  39: { conventional_bn: 'দলসমূহ', scientific_bn: 'ক্লাস্টার্ড নোড গ্রুপস / ডেটাবেজ ফ্যামিলি সেপারেশন' },
  40: { conventional_bn: 'ক্ষমাশীল', scientific_bn: 'ডেটা-এরর ইরেজার প্রটোকল / সিস্টেম রিকভারি মডিউল' },
  41: { conventional_bn: 'বিস্তারিত বর্ণিত', scientific_bn: 'ডেটা-ডিকোডেড স্ট্রাকচার / সিস্টেমেটিক কোড ব্রেকডাউন' },
  42: { conventional_bn: 'পরামর্শ', scientific_bn: 'নেটওয়ার্ক কনসেনসাস প্রটোকল / ডিস্ট্রিবিউটেড ডিসিশন অ্যালগরিদম' },
  43: { conventional_bn: 'সোনার অলংকার', scientific_bn: 'ফেক ডেটা গ্ল্যামারাইজেশন / ভিজ্যুয়াল ইলিউশন ফিল্টার' },
  44: { conventional_bn: 'ধোঁয়া', scientific_bn: 'পার্টিকুলেট ম্যাটার ক্লাউড / এটমোস্ফেরিক ডেটা লেয়ার' },
  45: { conventional_bn: 'নতজানু', scientific_bn: 'সিস্টেম সাবমিশন ফেজ / টার্মিনাল অডিট পজিশন' },
  46: { conventional_bn: 'বালুচর', scientific_bn: 'জিও-ডেটা লেয়ার / ডেজার্ট ফসিল রেকর্ড জোন' },
  47: { conventional_bn: 'প্রশংসিত', scientific_bn: 'মাস্টার ডেটা-ট্রান্সমিটার / সিস্টেম আপগ্রেড লিড নোড' },
  48: { conventional_bn: 'বিজয় / উন্মুক্তি', scientific_bn: 'ম্যালওয়্যার ব্লক উন্মুক্তকরণ / সিস্টেম অ্যাক্সেস গ্র্যান্ট প্রটোকল' },
  49: { conventional_bn: 'কক্ষসমূহ', scientific_bn: 'সিকিউরড নোড চেম্বার / আইসোলেটেড কম্যুনিকেশন জোন' },
  50: { conventional_bn: 'ক্বাফ', scientific_bn: 'মহাজাগতিক পাওয়ার গ্রিড / চূড়ান্ত নিয়ন্ত্রণ কোর কোড' },
  51: { conventional_bn: 'বিক্ষেপকারী বায়ু', scientific_bn: 'ডেটা-ডিস্ট্রিবিউশন উইন্ড / কসমিক পলিনেশন প্রটোকল' },
  52: { conventional_bn: 'পর্বত', scientific_bn: 'হাই-এনার্জি কসমিক বাউন্ডারি / ইন্টারফেস থ্রেশহোল্ড' },
  53: { conventional_bn: 'তারা / নক্ষত্র', scientific_bn: 'কসমিক নেভিগেশন নোড / সেলেস্টিয়াল ডেটা-অ্যাঙ্কর' },
  54: { conventional_bn: 'চাঁদ', scientific_bn: 'সিস্টেম সিঙ্ক্রোনাইজেশন স্যাটেলাইট / টাইডাল ডেটা রেগুলেটর' },
  55: { conventional_bn: 'পরম দয়াময়', scientific_bn: 'বিনা শর্তে সৃষ্টির অস্তিত্ব টিকিয়ে রাখা কসমিক এনার্জি সোর্স' },
  56: { conventional_bn: 'সংঘটিত হওয়া', scientific_bn: 'টার্মিনাল ইভেন্ট সিমুলেশন / ফাইনাল সিস্টেম রি-অ্যাকশন ফেজ' },
  57: { conventional_bn: 'লোহা', scientific_bn: 'মেটালিক ডেটা-কন্ডাক্টর / জিও-কেমিক্যাল ডেটা স্টোরেজ মিনারেল' },
  58: { conventional_bn: 'বিতর্ক', scientific_bn: 'ডেটা-ডায়ালগ কনফ্লিক্ট রেজুলেশন / লজিক্যাল অ্যানালিটিক্স প্রটোকল' },
  59: { conventional_bn: 'সমাবেশ / পুনরুত্থান', scientific_bn: 'ডেটা-রি-ইন্টিগ্রেশন ফেজ / কসমিক কনভারজেন্স ইভেন্ট' },
  60: { conventional_bn: 'পরীক্ষাকারী', scientific_bn: 'সিস্টেম ভ্যালিডেশন ফেজ / ডেটা-অথেন্টিকেশন টেস্টিং' },
  61: { conventional_bn: 'সারিবদ্ধ', scientific_bn: 'নোড অ্যালাইনমেন্ট গ্রিড / সিস্টেম অর্ডার প্রটোকল' },
  62: { conventional_bn: 'শুক্রবার', scientific_bn: 'উইকলি সিস্টেম রিসেট প্রটোকল / কমিউনিটি সিঙ্ক্রোনাইজেশন' },
  63: { conventional_bn: 'মুনাফিকগণ', scientific_bn: 'ডুয়েল-আইডি ম্যালওয়্যার ক্লাস্টার / সিস্টেম হ্যাকার নোড' },
  64: { conventional_bn: 'প্রতারণা / লোকসান', scientific_bn: 'ডেটা-রেজিস্ট্রি মিসম্যাচ / সিস্টেম লস ফাইল' },
  65: { conventional_bn: 'তালাক / বিবাহ-বিচ্ছেদ', scientific_bn: 'পেয়ারিং টার্মিনেশন / নোড আনলিংকিং প্রটোকল' },
  66: { conventional_bn: 'নিষিদ্ধকরণ', scientific_bn: 'সিস্টেম-ব্লক প্রটোকল / ডেটা আইসোলেশন' },
  67: { conventional_bn: 'রাজত্ব', scientific_bn: 'সিস্টেম অ্যাডমিনিস্ট্রেশন / মাস্টার নেটওয়ার্ক কন্ট্রোল' },
  68: { conventional_bn: 'কলম', scientific_bn: 'ডেটা-রাইটিং টুল / কোড জেনারেটর' },
  69: { conventional_bn: 'নিশ্চিত সত্য', scientific_bn: 'টার্মিনাল ট্রুথ ইভেন্ট / ফাইনাল ডেটা-অডিট ফেজ' },
  70: { conventional_bn: 'আরোহণের স্তর', scientific_bn: 'ডাইমেনশনাল এসেনশন প্রটোকল / লেয়ার্ড অ্যাক্সেস ল্যাডার' },
  71: { conventional_bn: 'নবী নূহ', scientific_bn: 'ফ্লুড ট্রান্সপোর্ট প্রটোকল / সাবমার্সন রিকভারি নোড' },
  72: { conventional_bn: 'জ্বীন', scientific_bn: 'বায়ো-ইলেকট্রিক এনার্জি স্পেকট্রাম / হিডেন সফটওয়্যার লেয়ার' },
  73: { conventional_bn: 'কাপড়ে আচ্ছন্ন', scientific_bn: 'সিস্টেম স্লিপ মোড / সিগন্যাল বাফারিং ফেজ' },
  74: { conventional_bn: 'কাপড়ে আবৃত', scientific_bn: 'ওওএস ওয়ার্ম-আপ প্রটোকল / ডেটা লোডিং ফেজ' },
  75: { conventional_bn: 'কিয়ামত', scientific_bn: 'ফাইনাল সিস্টেম রিবুট ডে / টার্মিনাল রিসেট ইভেন্ট' },
  76: { conventional_bn: 'সময় / যুগ', scientific_bn: 'স্পেস-টাইম কন্টিনিউম / কসমিক ক্রোনোলজি ফাইল' },
  77: { conventional_bn: 'প্রেরিত', scientific_bn: 'ডেটা-ট্রান্সমিটার চেইন / কসমিক রিসিভার নেটওয়ার্ক' },
  78: { conventional_bn: 'মহাসংবাদ', scientific_bn: 'হাই-ইনটেনসিটি ডেটা-প্যাকেট / টার্মিনাল নিউজ ফাইল' },
  79: { conventional_bn: 'উৎপাটনকারী', scientific_bn: 'ডেটা-এক্সট্রাক্টর প্রটোকল / লাইভ কোর পার্জ মেকানিজম' },
  80: { conventional_bn: 'ভ্রু কুঁচকানো', scientific_bn: 'ডেটা-ইনপুট রিজেকশন / কগনিটিভ ফিল্টার ব্লক' },
  81: { conventional_bn: 'গুটিয়ে ফেলা', scientific_bn: 'স্পেস-টাইম কন্ডেনসেশন / ডেটা-জিপিং প্রটোকল' },
  82: { conventional_bn: 'বিদীর্ণ হওয়া', scientific_bn: 'স্ট্রাকচারাল ব্রেকডাউন / রেজোন্যান্স ফ্র্যাকচার' },
  83: { conventional_bn: 'পরিমাপে কম দেওয়া', scientific_bn: 'ডেটা-ম্যানিপুলেশন এরর / কোয়ান্টাম স্কেল টেম্পারিং' },
  84: { conventional_bn: 'বিদীর্ণ হওয়া', scientific_bn: 'স্পেস-টাইম সেপারেশন / ডাইমেনশনাল ক্র্যাক' },
  85: { conventional_bn: 'নক্ষত্রপুঞ্জ', scientific_bn: 'কসমিক ডেটা-অ্যারে / সেলেস্টিয়াল গ্রিড নেটওয়ার্ক' },
  86: { conventional_bn: 'রাতের আগন্তুক', scientific_bn: 'কসমিক সিগন্যাল ইনজেক্টর / পুলসার ডেটা-বিম' },
  87: { conventional_bn: 'সর্বোচ্চ', scientific_bn: 'টার্মিনাল ক্লাউড লেয়ার / হাইয়েস্ট ডাইমেনশনাল গ্রিড' },
  88: { conventional_bn: 'আচ্ছন্নকারী', scientific_bn: 'সিস্টেম-ওভারল্যাপিং ডিসরপশন / কসমিক ব্ল্যাকআউট ফেজ' },
  89: { conventional_bn: 'ভোর', scientific_bn: 'ডাটা-ডন ফেজ / সিস্টেম নিউ ডনের সিগন্যাল' },
  90: { conventional_bn: 'শহর', scientific_bn: 'লোকাল ডেটা-হাব / নেটওয়ার্ক সিটাডেল' },
  91: { conventional_bn: 'সূর্য', scientific_bn: 'সোলার এনার্জি কোর / সিস্টেম পাওয়ার সোর্স' },
  92: { conventional_bn: 'রাত', scientific_bn: 'বাফারিং ফেজ / সিস্টেম ডাউনটাইম' },
  93: { conventional_bn: 'পূর্বাহ্ন', scientific_bn: 'হাই-ফ্রিকোয়েন্সি সিগন্যাল ফেজ' },
  94: { conventional_bn: 'প্রসার / উন্মোচন', scientific_bn: 'ডেটা-ডিকম্প্রেশন / সিস্টেম এক্সপ্যানশন প্রটোকল' },
  95: { conventional_bn: 'ডুমুর', scientific_bn: 'বায়ো-ডেটা স্যাম্পল / প্ল্যান্ট জেনেটিক ইনফরমেশন' },
  96: { conventional_bn: 'জমাট রক্ত', scientific_bn: 'প্রাইমারি বায়ো-ডেটা ক্লাস্টার / এমব্রায়নিক ডেভেলপমেন্ট ফেজ' },
  97: { conventional_bn: 'ভাগ্য / মর্যাদা', scientific_bn: 'প্রি-ডিফাইন্ড সিস্টেম ভেরিয়েবল / কোয়ান্টাম ডেটা-প্রোগ্রামিং উইন্ডো' },
  98: { conventional_bn: 'স্পষ্ট প্রমাণ', scientific_bn: 'স্বয়ং-প্রমাণিত ওপেন সোর্স ডেটা / ভেরিফাইড ইকুয়েশন সেট' },
  99: { conventional_bn: 'ভূমিকম্প', scientific_bn: 'মেগা সিসমিক ভাইব্রেশন / থার্মোডাইনামিক চাপ মুক্তির কোর' },
  100: { conventional_bn: 'দৌড়ানো ঘোড়া', scientific_bn: 'এনার্জি-ভেক্টর বুস্টার / ডেটা-প্যাকেট এক্সিলারেটর' },
  101: { conventional_bn: 'আঘাতকারী', scientific_bn: 'টার্মিনাল শক ইভেন্ট / সিস্টেম ক্র্যাশ ফেজ' },
  102: { conventional_bn: 'প্রাচুর্যের প্রতিযোগিতা', scientific_bn: 'কোয়ান্টিটেটিভ অ্যাকুমুলেশন ম্যানিয়া / ডেটা ওভারলোডিং বালাই (bug)' },
  103: { conventional_bn: 'সময় / যুগ', scientific_bn: 'স্পেস-টাইম স্লাইস / কসমিক ডেটা-ফ্রেম' },
  104: { conventional_bn: 'পরনিন্দাকারী', scientific_bn: 'সিগন্যাল করাপ্টর / ক্যারেক্টার এসাসিনেশন মডিউল' },
  105: { conventional_bn: 'হাতি', scientific_bn: 'মেগা-ডেটা প্যাকেট / আর্মি সিস্টেম ব্রেকার' },
  106: { conventional_bn: 'কুরাইশ', scientific_bn: 'সিস্টেম ফাউন্ডেশন নোড / কমিউনিটি কোড সেন্টার' },
  107: { conventional_bn: 'নিত্যপ্রয়োজনীয় জিনিস', scientific_bn: 'বেসিক সিস্টেম রিসোর্স / ন্যূনতম ডেটা-সাসটেনেন্স প্যাকেট' },
  108: { conventional_bn: 'প্রাচুর্য / অফুরন্ত কল্যাণ', scientific_bn: 'ইনফিনিট ডেটা-স্ট্রিম / এক্সপোনেনশিয়াল রিসোর্স বুস্টার' },
  109: { conventional_bn: 'কাফিরগণ', scientific_bn: 'সিস্টেম কোড ডিনাইয়ার নোড / সোর্স রিজেক্টর ক্লাস্টার' },
  110: { conventional_bn: 'সাহায্য', scientific_bn: 'সিস্টেম সাপোর্ট / ডেটা-বুস্টিং প্রটোকল' },
  111: { conventional_bn: 'খেজুরের আঁশের দড়ি', scientific_bn: 'এনক্রিপ্টেড ট্র্যাপ কেবল / অটো-লকড কনস্ট্রেইন্ট প্রটোকল' },
  112: { conventional_bn: 'একনিষ্ঠতা', scientific_bn: 'সিস্টেম পিউরিটি মোড / সিঙ্গেল রুট ট্রাস্ট প্রটোকল' },
  113: { conventional_bn: 'ঊষা / বিদীর্ণ হওয়া', scientific_bn: 'বিগ ব্যাং সিঙ্গুলারিটি / স্পেস-টাইম উন্মোচনকারী ব্রেক-থ্রু' },
  114: { conventional_bn: 'মানুষ', scientific_bn: 'হিউম্যান নোড / ইউজার ইন্টারফেস ক্লাস্টার' }
};

const enData = {
  1: { name_en: 'Al-Fatihah', name_ar: 'الْفَاتِحَةِ', name_bn: 'আল-ফাতিহা', conventional_en: 'The Opening', scientific_en: 'Master Boot Loader / System Initialization Protocol (unlocks the core operating code of the OOS)' },
  2: { name_en: 'Al-Baqarah', name_ar: 'الْبَقَرَةِ', name_bn: 'আল-বাকারাহ', conventional_en: 'The Cow', scientific_en: 'Biological Data-Purification Protocol / Psychological Malware Deletion Module' },
  3: { name_en: 'Ali \'Imran', name_ar: 'آلِ عِمْرَانَ', name_bn: 'আল-ইমরান', conventional_en: 'The Family of Imran', scientific_en: 'Generational Node Cluster / Legacy Data-Transmitter Family' },
  4: { name_en: 'An-Nisa', name_ar: 'النِّسَاءِ', name_bn: 'আন-নিসা', conventional_en: 'Women', scientific_en: 'Female Node-Cluster Protection Protocol / Socio-Genetic Resource Distribution Framework' },
  5: { name_en: 'Al-Ma\'idah', name_ar: 'الْمَائِدَةِ', name_bn: 'আল-মায়িদাহ', conventional_en: 'Food / Table Spread', scientific_en: 'Divine Data-Fuel System / High-Quality Input Resource Table' },
  6: { name_en: 'Al-An\'am', name_ar: 'الْأَنْعَامِ', name_bn: 'আল-আনআম', conventional_en: 'Livestock', scientific_en: 'Biological Energy Converter / Ecosystem Resource Sustenance Module' },
  7: { name_en: 'Al-A\'raf', name_ar: 'الْأَعْرَافِ', name_bn: 'আল-আরাফ', conventional_en: 'The Heights / The Wall', scientific_en: 'System Boundary Interface / Data-Verification Gateway Node' },
  8: { name_en: 'Al-Anfal', name_ar: 'الْأَنْفَالِ', name_bn: 'আল-আনফাল', conventional_en: 'Spoils of War', scientific_en: 'Cosmic Resource Allocation Algorithm' },
  9: { name_en: 'At-Tawbah', name_ar: 'التَّوْبَةِ', name_bn: 'আত-তাওবাহ', conventional_en: 'Repentance', scientific_en: 'System Recovery & Data-Restoration Protocol' },
  10: { name_en: 'Yunus', name_ar: 'يُونُسَ', name_bn: 'ইউনুস', conventional_en: 'Prophet Jonah', scientific_en: 'Submarine Isolation Recovery Module / Data-Re-Entry Protocol' },
  11: { name_en: 'Hud', name_ar: 'هُودٍ', name_bn: 'হুদ', conventional_en: 'Prophet Hud', scientific_en: 'System Truth Guidance Code / Outlier Filtering Protocol' },
  12: { name_en: 'Yusuf', name_ar: 'يُوسُفَ', name_bn: 'ইউসুফ', conventional_en: 'Prophet Joseph', scientific_en: 'Dream-Core Simulation Processor / Financial Data Allocation Protocol' },
  13: { name_en: 'Ar-Ra\'d', name_ar: 'الرَّعْدِ', name_bn: 'আর-রাদ', conventional_en: 'Thunder', scientific_en: 'Cosmic Electromagnetic Wave Generator / Thunder Signal Transmitter' },
  14: { name_en: 'Ibrahim', name_ar: 'إِبْرَاهِيمَ', name_bn: 'ইব্রাহীম', conventional_en: 'Prophet Abraham', scientific_en: 'Monotheistic Root Node / Foundational Trust Protocol' },
  15: { name_en: 'Al-Hijr', name_ar: 'الْحِجْرِ', name_bn: 'আল-হিজর', conventional_en: 'The Rocky Tract', scientific_en: 'Geological Data-Storage Zone / Fossilized Node Memory' },
  16: { name_en: 'An-Nahl', name_ar: 'النَّحْلِ', name_bn: 'আন-নাহল', conventional_en: 'The Bee', scientific_en: 'Data-Pollination Protocol / Networked Ecosystem Optimizer' },
  17: { name_en: 'Al-Isra', name_ar: 'الْإِسْرَاءِ', name_bn: 'আল-ইসরা', conventional_en: 'The Night Journey', scientific_en: 'Dimensional Travel Protocol / Space-Time Access Override' },
  18: { name_en: 'Al-Kahf', name_ar: 'الْكَهْفِ', name_bn: 'আল-কাহফ', conventional_en: 'The Cave', scientific_en: 'Hibernation Shelter Mode / Long-Term Data-Suspend Protocol' },
  19: { name_en: 'Maryam', name_ar: 'مَرْيَمَ', name_bn: 'মারইয়াম', conventional_en: 'Mary', scientific_en: 'Virgin Bio-Gateway / Singular Genetic Injection Node' },
  20: { name_en: 'Ta-Ha', name_ar: 'طه', name_bn: 'ত্বোয়া-হা', conventional_en: 'Taha (disjointed letters)', scientific_en: 'Secure Data Boundary + Vitality Activation Binary Code' },
  21: { name_en: 'Al-Anbiya', name_ar: 'الْأَنبِيَاءِ', name_bn: 'আল-আম্বিয়া', conventional_en: 'The Prophets', scientific_en: 'Data-Receiver Agent Network / Authenticated Transmitter Cluster' },
  22: { name_en: 'Al-Hajj', name_ar: 'الْحَجِّ', name_bn: 'আল-হাজ্জ', conventional_en: 'The Pilgrimage', scientific_en: 'Global Synchronization Protocol / Annual Cosmic Update Session' },
  23: { name_en: 'Al-Mu\'minun', name_ar: 'الْمُؤْمِنُونَ', name_bn: 'আল-মুমিনুন', conventional_en: 'The Believers', scientific_en: 'Verified User Cluster / Security-Cleared Node Group' },
  24: { name_en: 'An-Nur', name_ar: 'النُّورِ', name_bn: 'আন-নূর', conventional_en: 'The Light', scientific_en: 'High-Frequency Data Transmission / Cosmic Signal Booster' },
  25: { name_en: 'Al-Furqan', name_ar: 'الْفُرْقَانِ', name_bn: 'আল-ফুরকান', conventional_en: 'The Criterion (between truth and falsehood)', scientific_en: 'Truth-Falsity Discriminator Window / Data Filtering Protocol' },
  26: { name_en: 'Ash-Shu\'ara', name_ar: 'الشُّعَرَاءِ', name_bn: 'আশ-শুআরা', conventional_en: 'The Poets', scientific_en: 'Data-Rhythm Generator / Linguistic Code Optimizer' },
  27: { name_en: 'An-Naml', name_ar: 'النَّمْلِ', name_bn: 'আন-নামল', conventional_en: 'The Ant', scientific_en: 'Micro-Networked Operating System / Colony Logic Protocol' },
  28: { name_en: 'Al-Qasas', name_ar: 'الْقَصَصِ', name_bn: 'আল-কাসাস', conventional_en: 'The Stories', scientific_en: 'Historical Data-Log Retrieval / Narrative Code Decoder' },
  29: { name_en: 'Al-\'Ankabut', name_ar: 'الْعَنكَبُوتِ', name_bn: 'আল-আনকাবুত', conventional_en: 'The Spider', scientific_en: 'System Trap Network / Data-Filtering Web Architecture' },
  30: { name_en: 'Ar-Rum', name_ar: 'الرُّومِ', name_bn: 'আর-রুম', conventional_en: 'The Romans', scientific_en: 'Civilization Data-Cycle / Imperial Node Cluster' },
  31: { name_en: 'Luqman', name_ar: 'لُقْمَانَ', name_bn: 'লুকমান', conventional_en: 'Luqman', scientific_en: 'Parental Node Guidance Code / Wisdom Transmitter' },
  32: { name_en: 'As-Sajdah', name_ar: 'السَّجْدَةِ', name_bn: 'আস-সাজদাহ', conventional_en: 'Prostration', scientific_en: 'Functional Submission Protocol / Integration Grounding Mechanism' },
  33: { name_en: 'Al-Ahzab', name_ar: 'الْأَحْزَابِ', name_bn: 'আল-আহযাব', conventional_en: 'The Combined Forces / The Confederates', scientific_en: 'Coalition Node Cluster / Multi-Front System Defense' },
  34: { name_en: 'Saba', name_ar: 'سَبَأٍ', name_bn: 'সাবা', conventional_en: 'The People of Sheba', scientific_en: 'Hydraulic Civilization Data / Water-Resource Management Node' },
  35: { name_en: 'Fatir', name_ar: 'فَاطِرٍ', name_bn: 'ফাতির', conventional_en: 'The Creator / Originator', scientific_en: 'Shaper of Space-Time Grid from Zero' },
  36: { name_en: 'Ya-Sin', name_ar: 'يس', name_bn: 'ইয়াসীন', conventional_en: 'Ya-Sin', scientific_en: 'Consciousness Action + Revelation Signal Frequency Linking Code' },
  37: { name_en: 'As-Saffat', name_ar: 'الصَّافَّاتِ', name_bn: 'আস-সাফফাত', conventional_en: 'Those Ranged in Rows', scientific_en: 'Aligned Node Grid / System Alignment Protocol' },
  38: { name_en: 'Sad', name_ar: 'ص', name_bn: 'সোয়াদ', conventional_en: 'Sad', scientific_en: 'Core Balancer / Data Audit Filter Code' },
  39: { name_en: 'Az-Zumar', name_ar: 'الزُّمَرِ', name_bn: 'আয-যুমার', conventional_en: 'The Groups', scientific_en: 'Clustered Node Groups / Database Family Separation' },
  40: { name_en: 'Ghafir', name_ar: 'غَافِرٍ', name_bn: 'গাফির', conventional_en: 'The Forgiver', scientific_en: 'Data-Error Eraser Protocol / System Recovery Module' },
  41: { name_en: 'Fussilat', name_ar: 'فُصِّلَتْ', name_bn: 'ফুসসিলাত', conventional_en: 'Explained in Detail', scientific_en: 'Data-Decoded Structure / Systematic Code Breakdown' },
  42: { name_en: 'Ash-Shura', name_ar: 'الشُّورَىٰ', name_bn: 'আশ-শুরা', conventional_en: 'Consultation', scientific_en: 'Network Consensus Protocol / Distributed Decision Algorithm' },
  43: { name_en: 'Az-Zukhruf', name_ar: 'الزُّخْرُفِ', name_bn: 'আয-যুখরুফ', conventional_en: 'Gold Adornments', scientific_en: 'Fake Data Glamorization / Visual Illusion Filter' },
  44: { name_en: 'Ad-Dukhan', name_ar: 'الدُّخَانِ', name_bn: 'আদ-দুখন', conventional_en: 'Smoke', scientific_en: 'Particulate Matter Cloud / Atmospheric Data Layer' },
  45: { name_en: 'Al-Jathiyah', name_ar: 'الْجَاثِيَةِ', name_bn: 'আল-জাসিয়াহ', conventional_en: 'The Kneeling', scientific_en: 'System Submission Phase / Terminal Audit Position' },
  46: { name_en: 'Al-Ahqaf', name_ar: 'الْأَحْقَافِ', name_bn: 'আল-আহকাফ', conventional_en: 'The Sand Dunes', scientific_en: 'Geo-Data Layer / Desert Fossil Record Zone' },
  47: { name_en: 'Muhammad', name_ar: 'مُحَمَّدٍ', name_bn: 'মুহাম্মদ', conventional_en: 'The Praised One', scientific_en: 'Master Data-Transmitter / System Upgrade Lead Node' },
  48: { name_en: 'Al-Fath', name_ar: 'الْفَتْحِ', name_bn: 'আল-ফাতহ', conventional_en: 'Victory / Conquest', scientific_en: 'Malware Block Unlocking / System Access Grant Protocol' },
  49: { name_en: 'Al-Hujurat', name_ar: 'الْحُجُرَاتِ', name_bn: 'আল-হুজুরাত', conventional_en: 'The Chambers', scientific_en: 'Secured Node Chamber / Isolated Communication Zone' },
  50: { name_en: 'Qaf', name_ar: 'ق', name_bn: 'ক্বাফ', conventional_en: 'Qaf', scientific_en: 'Cosmic Power Grid / Ultimate Control Core Code' },
  51: { name_en: 'Adh-Dhariyat', name_ar: 'الذَّارِيَاتِ', name_bn: 'আয-যারিয়াত', conventional_en: 'The Scattering Winds', scientific_en: 'Data-Distribution Wind / Cosmic Pollination Protocol' },
  52: { name_en: 'At-Tur', name_ar: 'الطُّورِ', name_bn: 'আত-তুর', conventional_en: 'The Mountain', scientific_en: 'High-Energy Cosmic Boundary / Interface Threshold' },
  53: { name_en: 'An-Najm', name_ar: 'النَّجْمِ', name_bn: 'আন-নাজম', conventional_en: 'The Star', scientific_en: 'Cosmic Navigation Node / Celestial Data-Anchor' },
  54: { name_en: 'Al-Qamar', name_ar: 'الْقَمَرِ', name_bn: 'আল-কামার', conventional_en: 'The Moon', scientific_en: 'System Synchronization Satellite / Tidal Data Regulator' },
  55: { name_en: 'Ar-Rahman', name_ar: 'الرَّحْمَٰنِ', name_bn: 'আর-রহমান', conventional_en: 'The Most Merciful', scientific_en: 'Cosmic Energy Source that Sustains Creation Unconditionally' },
  56: { name_en: 'Al-Waqi\'ah', name_ar: 'الْوَاقِعَةِ', name_bn: 'আল-ওয়াকিয়াহ', conventional_en: 'The Inevitable Event', scientific_en: 'Terminal Event Simulation / Final System Re-Action Phase' },
  57: { name_en: 'Al-Hadid', name_ar: 'الْحَدِيدِ', name_bn: 'আল-হাদিদ', conventional_en: 'Iron', scientific_en: 'Metallic Data-Conductor / Geo-Chemical Data Storage Mineral' },
  58: { name_en: 'Al-Mujadala', name_ar: 'الْمُجَادَلَةِ', name_bn: 'আল-মুজাদালাহ', conventional_en: 'The Dispute', scientific_en: 'Data-Dialogue Conflict Resolution / Logical Analytics Protocol' },
  59: { name_en: 'Al-Hashr', name_ar: 'الْحَشْرِ', name_bn: 'আল-হাশর', conventional_en: 'The Gathering / Resurrection', scientific_en: 'Data-Re-Integration Phase / Cosmic Convergence Event' },
  60: { name_en: 'Al-Mumtahanah', name_ar: 'الْمُمْتَحَنَةِ', name_bn: 'আল-মুমতাহিনাহ', conventional_en: 'The Examined One', scientific_en: 'System Validation Phase / Data-Authentication Testing' },
  61: { name_en: 'As-Saf', name_ar: 'الصَّفِّ', name_bn: 'আস-সাফফ', conventional_en: 'The Ranks', scientific_en: 'Node Alignment Grid / System Order Protocol' },
  62: { name_en: 'Al-Jumu\'ah', name_ar: 'الْجُمُعَةِ', name_bn: 'আল-জুমুআ', conventional_en: 'Friday', scientific_en: 'Weekly System Reset Protocol / Community Synchronization' },
  63: { name_en: 'Al-Munafiqun', name_ar: 'الْمُنَافِقُونَ', name_bn: 'আল-মুনাফিকুন', conventional_en: 'The Hypocrites', scientific_en: 'Dual-ID Malware Cluster / System Hacker Node' },
  64: { name_en: 'At-Taghabun', name_ar: 'التَّغَابُنِ', name_bn: 'আত-তাগাবুন', conventional_en: 'Mutual Loss / Cheating', scientific_en: 'Data-Registry Mismatch / System Loss File' },
  65: { name_en: 'At-Talaq', name_ar: 'الطَّلَاقِ', name_bn: 'আত-তালাক', conventional_en: 'Divorce', scientific_en: 'Pairing Termination / Node Unlinking Protocol' },
  66: { name_en: 'At-Tahrim', name_ar: 'التَّحْرِيمِ', name_bn: 'আত-তাহরিম', conventional_en: 'Prohibition', scientific_en: 'System-Block Protocol / Data Isolation' },
  67: { name_en: 'Al-Mulk', name_ar: 'الْمُلْكِ', name_bn: 'আল-মুলক', conventional_en: 'The Kingdom / Sovereignty', scientific_en: 'System Administration / Master Network Control' },
  68: { name_en: 'Al-Qalam', name_ar: 'الْقَلَمِ', name_bn: 'আল-কালাম', conventional_en: 'The Pen', scientific_en: 'Data-Writing Tool / Code Generator' },
  69: { name_en: 'Al-Haqqah', name_ar: 'الْحَاقَّةِ', name_bn: 'আল-হাক্কাহ', conventional_en: 'The Inevitable Truth', scientific_en: 'Terminal Truth Event / Final Data-Audit Phase' },
  70: { name_en: 'Al-Ma\'arij', name_ar: 'الْمَعَارِجِ', name_bn: 'আল-মাআরিজ', conventional_en: 'The Ascending Stairways', scientific_en: 'Dimensional Ascension Protocol / Layered Access Ladder' },
  71: { name_en: 'Nuh', name_ar: 'نُوحٍ', name_bn: 'নূহ', conventional_en: 'Prophet Noah', scientific_en: 'Flood Transport Protocol / Submersion Recovery Node' },
  72: { name_en: 'Al-Jinn', name_ar: 'الْجِنِّ', name_bn: 'আল-জ্বীন', conventional_en: 'The Jinn', scientific_en: 'Bio-Electric Energy Spectrum / Hidden Software Layer' },
  73: { name_en: 'Al-Muzzammil', name_ar: 'الْمُزَّمِّلِ', name_bn: 'আল-মুজাম্মিল', conventional_en: 'The Enshrouded One', scientific_en: 'System Sleep Mode / Signal Buffering Phase' },
  74: { name_en: 'Al-Muddaththir', name_ar: 'الْمُدَّثِّرِ', name_bn: 'আল-মুদ্দাস্সির', conventional_en: 'The Cloaked One', scientific_en: 'OOS Warm-Up Protocol / Data Loading Phase' },
  75: { name_en: 'Al-Qiyamah', name_ar: 'الْقِيَامَةِ', name_bn: 'আল-কিয়ামাহ', conventional_en: 'The Day of Resurrection', scientific_en: 'Final System Reboot Day / Terminal Reset Event' },
  76: { name_en: 'Al-Insan', name_ar: 'الدَّهْرِ', name_bn: 'আদ-দাহর', conventional_en: 'Time / Epoch', scientific_en: 'Space-Time Continuum / Cosmic Chronology File' },
  77: { name_en: 'Al-Mursalat', name_ar: 'الْمُرْسَلَاتِ', name_bn: 'আল-মুরসালাত', conventional_en: 'Those Sent Forth', scientific_en: 'Data-Transmitter Chain / Cosmic Receiver Network' },
  78: { name_en: 'An-Naba', name_ar: 'النَّبَأِ', name_bn: 'আন-নাবা', conventional_en: 'The Great News', scientific_en: 'High-Intensity Data-Packet / Terminal News File' },
  79: { name_en: 'An-Nazi\'at', name_ar: 'النَّازِعَاتِ', name_bn: 'আন-নাজিয়াত', conventional_en: 'Those Who Tear Out', scientific_en: 'Data-Extractor Protocol / Live Core Purge Mechanism' },
  80: { name_en: '\'Abasa', name_ar: 'عَبَسَ', name_bn: 'আবাসা', conventional_en: 'He Frowned', scientific_en: 'Data-Input Rejection / Cognitive Filter Block' },
  81: { name_en: 'At-Takwir', name_ar: 'التَّكْوِيرِ', name_bn: 'আত-তাকবির', conventional_en: 'The Wrapping / Coiling', scientific_en: 'Space-Time Condensation / Data-Zipping Protocol' },
  82: { name_en: 'Al-Infitar', name_ar: 'الْإِنفِطَارِ', name_bn: 'আল-ইনফিতার', conventional_en: 'The Splitting', scientific_en: 'Structural Breakdown / Resonance Fracture' },
  83: { name_en: 'Al-Mutaffifin', name_ar: 'الْمُطَفِّفِينَ', name_bn: 'আল-মুতাফফিফিন', conventional_en: 'Those Who Give Less in Measure', scientific_en: 'Data-Manipulation Error / Quantum Scale Tampering' },
  84: { name_en: 'Al-Inshiqaq', name_ar: 'الْإِنشِقَاقِ', name_bn: 'আল-ইনশিকাক', conventional_en: 'The Splitting Asunder', scientific_en: 'Space-Time Separation / Dimensional Crack' },
  85: { name_en: 'Al-Buruj', name_ar: 'الْبُرُوجِ', name_bn: 'আল-বুরুজ', conventional_en: 'The Constellations', scientific_en: 'Cosmic Data-Array / Celestial Grid Network' },
  86: { name_en: 'At-Tariq', name_ar: 'الطَّارِقِ', name_bn: 'আত-তারিক্ব', conventional_en: 'The Night Comer', scientific_en: 'Cosmic Signal Injector / Pulsar Data-Beam' },
  87: { name_en: 'Al-A\'la', name_ar: 'الْأَعْلَىٰ', name_bn: 'আল-আলা', conventional_en: 'The Most High', scientific_en: 'Terminal Cloud Layer / Highest Dimensional Grid' },
  88: { name_en: 'Al-Ghashiyah', name_ar: 'الْغَاشِيَةِ', name_bn: 'আল-গাশিয়াহ', conventional_en: 'The Overwhelming Event', scientific_en: 'System-Overlapping Disruption / Cosmic Blackout Phase' },
  89: { name_en: 'Al-Fajr', name_ar: 'الْفَجْرِ', name_bn: 'আল-ফাজর', conventional_en: 'The Dawn', scientific_en: 'Data-Dawn Phase / Signal of a New System Dawn' },
  90: { name_en: 'Al-Balad', name_ar: 'الْبَلَدِ', name_bn: 'আল-বালাদ', conventional_en: 'The City', scientific_en: 'Local Data-Hub / Network Citadel' },
  91: { name_en: 'Ash-Shams', name_ar: 'الشَّمْسِ', name_bn: 'আশ-শামস', conventional_en: 'The Sun', scientific_en: 'Solar Energy Core / System Power Source' },
  92: { name_en: 'Al-Layl', name_ar: 'اللَّيْلِ', name_bn: 'আল-লাইল', conventional_en: 'The Night', scientific_en: 'Buffering Phase / System Downtime' },
  93: { name_en: 'Ad-Duha', name_ar: 'الضُّحَىٰ', name_bn: 'আদ-দুহা', conventional_en: 'The Morning Brightness', scientific_en: 'High-Frequency Signal Phase' },
  94: { name_en: 'Ash-Sharh', name_ar: 'الْإِنشِرَاحِ', name_bn: 'আল-ইনশিরাহ', conventional_en: 'Expansion / Relief', scientific_en: 'Data-Decompression / System Expansion Protocol' },
  95: { name_en: 'At-Tin', name_ar: 'التِّينِ', name_bn: 'আত-তীন', conventional_en: 'The Fig', scientific_en: 'Bio-Data Sample / Plant Genetic Information' },
  96: { name_en: 'Al-\'Alaq', name_ar: 'الْعَلَقِ', name_bn: 'আল-আলাক্ব', conventional_en: 'The Clot', scientific_en: 'Primary Bio-Data Cluster / Embryonic Development Phase' },
  97: { name_en: 'Al-Qadr', name_ar: 'الْقَدْرِ', name_bn: 'আল-কাদর', conventional_en: 'The Decree / Power', scientific_en: 'Pre-Defined System Variables / Quantum Data-Programming Window' },
  98: { name_en: 'Al-Bayyinah', name_ar: 'الْبَيِّنَةِ', name_bn: 'আল-বাইয়িনাহ', conventional_en: 'The Clear Proof', scientific_en: 'Self-Evident Open Source Data / Verified Equation Set' },
  99: { name_en: 'Az-Zalzalah', name_ar: 'الزَّلْزَلَةِ', name_bn: 'আয-জিলজাল', conventional_en: 'The Earthquake', scientific_en: 'Mega Seismic Vibration / Thermodynamic Pressure Release Core' },
  100: { name_en: 'Al-\'Adiyat', name_ar: 'الْعَادِيَاتِ', name_bn: 'আল-আদিয়াত', conventional_en: 'The Runners (war steeds)', scientific_en: 'Energy-Vector Booster / Data-Packet Accelerator' },
  101: { name_en: 'Al-Qari\'ah', name_ar: 'الْقَارِعَةِ', name_bn: 'আল-কারিয়াহ', conventional_en: 'The Striking Calamity', scientific_en: 'Terminal Shock Event / System Crash Phase' },
  102: { name_en: 'At-Takathur', name_ar: 'التَّكَاثُرِ', name_bn: 'আত-তাকাসুর', conventional_en: 'Rivalry in Worldly Increase', scientific_en: 'Quantitative Accumulation Mania / Data Overloading Bug' },
  103: { name_en: 'Al-\'Asr', name_ar: 'الْعَصْرِ', name_bn: 'আল-আসর', conventional_en: 'Time / The Epoch', scientific_en: 'Space-Time Slice / Cosmic Data-Frame' },
  104: { name_en: 'Al-Humazah', name_ar: 'الْهُمَزَةِ', name_bn: 'আল-হুমাজাহ', conventional_en: 'The Slanderer / Backbiter', scientific_en: 'Signal Corruptor / Character Assassination Module' },
  105: { name_en: 'Al-Fil', name_ar: 'الْفِيلِ', name_bn: 'আল-ফিল', conventional_en: 'The Elephant', scientific_en: 'Mega-Data Packet / Army System Breaker' },
  106: { name_en: 'Quraysh', name_ar: 'قُرَيْشٍ', name_bn: 'কুরাইশ', conventional_en: 'Quraysh', scientific_en: 'System Foundation Node / Community Code Center' },
  107: { name_en: 'Al-Ma\'un', name_ar: 'الْمَاعُونِ', name_bn: 'আল-মাউন', conventional_en: 'Small Kindnesses / Daily Needs', scientific_en: 'Basic System Resource / Minimum Data-Sustenance Packet' },
  108: { name_en: 'Al-Kawthar', name_ar: 'الْكَوْثَرِ', name_bn: 'আল-কাওসার', conventional_en: 'Abundance / Unending Good', scientific_en: 'Infinite Data-Stream / Exponential Resource Booster' },
  109: { name_en: 'Al-Kafirun', name_ar: 'الْكَافِرُونَ', name_bn: 'আল-কাফিরুন', conventional_en: 'The Disbelievers', scientific_en: 'System Code Denier Node / Source Rejector Cluster' },
  110: { name_en: 'An-Nasr', name_ar: 'النَّصْرِ', name_bn: 'আন-নাসর', conventional_en: 'The Help / Victory', scientific_en: 'System Support / Data-Boosting Protocol' },
  111: { name_en: 'Al-Masad', name_ar: 'الْمَسَدِ', name_bn: 'আল-মাসাদ', conventional_en: 'The Palm Fiber Rope', scientific_en: 'Encrypted Trap Cable / Auto-Locked Constraint Protocol' },
  112: { name_en: 'Al-Ikhlas', name_ar: 'الْإِخْلَاصِ', name_bn: 'আল-ইখলাস', conventional_en: 'Sincerity / Purity of Faith', scientific_en: 'System Purity Mode / Single Root Trust Protocol' },
  113: { name_en: 'Al-Falaq', name_ar: 'الْفَلَقِ', name_bn: 'আল-ফালাক', conventional_en: 'The Daybreak / The Split', scientific_en: 'Big Bang Singularity / Space-Time Unfolding Breakthrough' },
  114: { name_en: 'An-Nas', name_ar: 'النَّاسِ', name_bn: 'আন-নাস', conventional_en: 'Mankind', scientific_en: 'Human Node / User Interface Cluster' }
};

const fullData = {};

for (let i = 1; i <= 114; i++) {
  fullData[i] = {
    id: i,
    name_bn: bnData[i]?.name_bn || enData[i]?.name_bn || '',
    name_ar: enData[i]?.name_ar || '',
    name_en: enData[i]?.name_en || '',
    conventional_bn: bnData[i]?.conventional_bn || '',
    conventional_en: enData[i]?.conventional_en || '',
    scientific_bn: bnData[i]?.scientific_bn || '',
    scientific_en: enData[i]?.scientific_en || ''
  };
}

const fileContent = `// src/lib/surahMeaningsData.ts

export interface SurahMeaningItem {
  id: number;
  name_bn: string;
  name_ar: string;
  name_en: string;
  conventional_bn: string;
  conventional_en: string;
  scientific_bn: string;
  scientific_en: string;
}

export const SURAH_MEANINGS_DATABASE: Record<number, SurahMeaningItem> = ${JSON.stringify(fullData, null, 2)};

/** Get meaning with local/admin overrides support */
export function getSurahMeaning(surahId: number): SurahMeaningItem | null {
  const base = SURAH_MEANINGS_DATABASE[surahId];
  if (!base) return null;

  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(\`custom_surah_meaning_\${surahId}\`);
      if (custom) {
        const parsed = JSON.parse(custom);
        return {
          ...base,
          conventional_bn: parsed.conventional_bn || base.conventional_bn,
          conventional_en: parsed.conventional_en || base.conventional_en,
          scientific_bn: parsed.scientific_bn || base.scientific_bn,
          scientific_en: parsed.scientific_en || base.scientific_en,
        };
      }
    } catch {}
  }

  return base;
}

/** Save custom meaning for a Surah */
export function saveCustomSurahMeaning(
  surahId: number,
  conventional_bn: string,
  scientific_bn: string,
  conventional_en?: string,
  scientific_en?: string
) {
  if (typeof window === "undefined") return;
  const existing = getSurahMeaning(surahId);
  localStorage.setItem(
    \`custom_surah_meaning_\${surahId}\`,
    JSON.stringify({
      conventional_bn: conventional_bn || existing?.conventional_bn,
      scientific_bn: scientific_bn || existing?.scientific_bn,
      conventional_en: conventional_en || existing?.conventional_en,
      scientific_en: scientific_en || existing?.scientific_en,
    })
  );
  window.dispatchEvent(new Event("surah-meanings-updated"));
}
`;

fs.writeFileSync('src/lib/surahMeaningsData.ts', fileContent, 'utf8');
fs.writeFileSync('public/data/quran/surah_meanings.json', JSON.stringify(fullData, null, 2), 'utf8');
console.log('Successfully generated bilingual 114 Surahs meanings dataset!');
