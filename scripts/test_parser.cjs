const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'last_user_prompt.txt'), 'utf8');

const bnToEn = (str) => {
  const map = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
  return str.replace(/[০-৯]/g, d => map[d]);
};

const regex = /আয়াত\s+([০-৯]+)(?:\s*\(([^)]+)\))?/g;
let m;
const matches = [];
while ((m = regex.exec(content)) !== null) {
  matches.push({
    ayahBn: m[1],
    ayahNum: parseInt(bnToEn(m[1])),
    meta: m[2] ? m[2].trim() : '',
    index: m.index
  });
}

console.log('Total matches found:', matches.length);

const results = {};

for (let i = 0; i < matches.length; i++) {
  const cur = matches[i];
  const next = matches[i+1];
  const chunk = content.substring(cur.index, next ? next.index : content.length);
  
  // Extract science translation
  const sciIdx = chunk.indexOf('বিজ্ঞানভিত্তিক অনুবাদ:');
  let sciText = '';
  if (sciIdx !== -1) {
    let raw = chunk.substring(sciIdx + 'বিজ্ঞানভিত্তিক অনুবাদ:'.length).trim();
    // Stop at lexicon or next section if any
    const stopMarkers = ['📊', 'সূরা আল-বাকারার', 'আয়াত '];
    let minStop = raw.length;
    for (const marker of stopMarkers) {
      const p = raw.indexOf(marker);
      if (p !== -1 && p < minStop) {
        minStop = p;
      }
    }
    raw = raw.substring(0, minStop).trim();
    // remove leading and trailing quotes if any
    raw = raw.replace(/^["“]+|["”\s]+$/g, '').trim();
    // Also remove footnote numbers like [1]
    raw = raw.replace(/\[\d+\]\s*$/g, '').trim();
    sciText = raw;
  }
  
  // Extract traditional translation
  const tradIdx = chunk.indexOf('প্রচলিত অনুবাদ:');
  let tradText = '';
  if (tradIdx !== -1) {
    let rawTrad = chunk.substring(tradIdx + 'প্রচলিত অনুবাদ:'.length, sciIdx !== -1 ? sciIdx : undefined).trim();
    rawTrad = rawTrad.replace(/^["“]+|["”\s]+$/g, '').trim();
    rawTrad = rawTrad.replace(/\[\d+\]\s*$/g, '').trim();
    tradText = rawTrad;
  }
  
  results[cur.ayahNum] = {
    ayahNum: cur.ayahNum,
    meta: cur.meta,
    tradText,
    sciText
  };
  
  console.log(`Ayah ${cur.ayahNum} [${cur.meta}]: len=${sciText.length}`);
}

fs.writeFileSync(path.join(__dirname, 'parsed_177_222.json'), JSON.stringify(results, null, 2), 'utf8');
console.log('Saved to parsed_177_222.json');
