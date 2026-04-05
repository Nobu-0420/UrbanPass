/**
 * 診断結果で出せる駅をランクごとに一覧化する。
 * network_data.json の路線グラフに含まれる駅 × station_outputlist_all.csv のランクで突き合わせる。
 */
const fs = require('fs');
const path = require('path');

const networkPath = path.join(__dirname, 'data', 'network_data.json');
const csvPath = path.join(__dirname, 'station_outputlist_all.csv');

const network = JSON.parse(fs.readFileSync(networkPath, 'utf8'));
const lines = network.lines || [];
const graphStations = new Set();
lines.forEach(line => {
  (line.stations || []).forEach(s => graphStations.add(s));
});

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
const csvLines = csvText.trim().split(/\r?\n/).filter(l => l.length > 0);
const header = parseCsvLine(csvLines[0]);
const nameIdx = header.findIndex(h => String(h || '').trim().toLowerCase().replace(/_/g, '') === 'stationname');
const rankIdx = header.findIndex(h => (h || '').toLowerCase() === 'rank');
if (nameIdx < 0 || rankIdx < 0) {
  console.error('CSV header not found');
  process.exit(1);
}

const rankByStation = {};
for (let i = 1; i < csvLines.length; i++) {
  const parts = parseCsvLine(csvLines[i]);
  const name = (parts[nameIdx] || '').trim();
  const rank = (parts[rankIdx] || '').trim();
  if (!name || !rank) continue;
  rankByStation[name] = rank;
  const m = name.match(/\(([^)]+)\)$/);
  if (m) rankByStation[m[1]] = rank;
}
try {
  const configPath = path.join(__dirname, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const ranks = config.stationRanks || {};
  for (const [tier, names] of Object.entries(ranks)) {
    if (!Array.isArray(names)) continue;
    names.forEach(name => { rankByStation[name] = tier; });
  }
} catch (e) {}

const byRank = { SS: [], P: [], S: [], A: [], B: [] };
const noRank = [];
const graphList = [...graphStations].sort((a, b) => a.localeCompare(b, 'ja'));

graphList.forEach(station => {
  const rank = rankByStation[station] || null;
  if (rank === 'SS' || rank === 'P' || rank === 'S' || rank === 'A' || rank === 'B') {
    byRank[rank].push(station);
  } else {
    noRank.push(station);
  }
});

['SS', 'P', 'S', 'A', 'B'].forEach(r => byRank[r].sort((a, b) => a.localeCompare(b, 'ja')));

const out = [];
out.push('# 診断結果で出せる街のリスト（ランク別）');
out.push('');
out.push('※ network_data.json の路線グラフに含まれる駅のうち、station_outputlist_all.csv にランクが付与されている駅をランク別に掲載。');
out.push('※ ランクなしはグラフ上には存在するが station_outputlist_all に未掲載の駅。');
out.push('');

out.push('## SSランク');
out.push(byRank.SS.length + ' 駅');
out.push('');
out.push(byRank.SS.join('、'));
out.push('');

out.push('## Pランク（ポテンシャル）');
out.push(byRank.P.length + ' 駅');
out.push('');
out.push(byRank.P.join('、'));
out.push('');

out.push('## Sランク');
out.push(byRank.S.length + ' 駅');
out.push('');
out.push(byRank.S.join('、'));
out.push('');

out.push('## Aランク');
out.push(byRank.A.length + ' 駅');
out.push('');
out.push(byRank.A.join('、'));
out.push('');

out.push('## Bランク');
out.push(byRank.B.length + ' 駅');
out.push('');
out.push(byRank.B.join('、'));
out.push('');

out.push('## ランクなし（結果には出るがランク未設定）');
out.push(noRank.length + ' 駅');
out.push('');
out.push(noRank.join('、'));
out.push('');

const outPath = path.join(__dirname, 'output-stations-by-rank.md');
fs.writeFileSync(outPath, out.join('\n'), 'utf8');
console.log('Written: ' + outPath);
console.log('SS:', byRank.SS.length, 'P:', byRank.P.length, 'S:', byRank.S.length, 'A:', byRank.A.length, 'B:', byRank.B.length, 'ランクなし:', noRank.length);
