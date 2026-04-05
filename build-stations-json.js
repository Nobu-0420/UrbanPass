/**
 * station_outputlist_all.csv から stations.json を生成する。
 * ウェブとLINEの順位診断で共通利用するデータ。
 */
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'station_outputlist_all.csv');
const outPath = path.join(__dirname, 'stations.json');

function parseCsvLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let s = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { s += '"'; i += 2; }
        else if (line[i] === '"') { i++; break; }
        else { s += line[i]; i++; }
      }
      out.push(s);
    } else {
      let s = '';
      while (i < line.length && line[i] !== ',') s += line[i++];
      out.push(s.trim());
    }
    if (line[i] === ',') i++;
  }
  return out;
}

const csvText = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const lines = csvText.trim().split(/\r?\n/).filter(l => l.length > 0);
if (lines.length < 2) {
  console.error('CSV has no data rows');
  process.exit(1);
}

const header = parseCsvLine(lines[0]);
const nameIdx = header.findIndex(h => (h || '').toLowerCase().replace(/_/g, '') === 'stationname');
const rankIdx = header.findIndex(h => (h || '').toLowerCase() === 'rank');
const quietIdx = header.findIndex(h => (h || '').toLowerCase().replace(/_/g, '') === 'isquietselection');

if (nameIdx < 0 || rankIdx < 0) {
  console.error('CSV must have station_name and rank columns');
  process.exit(1);
}

const stations = [];
for (let i = 1; i < lines.length; i++) {
  const parts = parseCsvLine(lines[i]);
  const name = (parts[nameIdx] || '').trim();
  if (!name) continue;
  const rank = (parts[rankIdx] || '').trim().toUpperCase();
  const isQuietSelection = quietIdx >= 0 && (parts[quietIdx] === '1' || (parts[quietIdx] || '').toString().trim() === 'true');
  stations.push({ name, rank: rank || null, is_quiet_selection: isQuietSelection });
}

const payload = {
  _comment: 'ウェブ診断・LINE順位診断で共通利用。station_outputlist_all.csv から build-stations-json.js で生成。',
  updated: new Date().toISOString().slice(0, 10),
  stations
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
console.log('Written:', outPath, 'stations:', stations.length);
