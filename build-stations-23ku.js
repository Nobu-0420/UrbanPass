/**
 * 東京都23区の駅を CSV から抽出し、stations-23ku+10.json を出力する。
 * 読み込み優先: station20252321free.csv → station20251211free.csv
 * 手動追記用: stations-manual.csv を同時に作成（description 等を追記可能）。
 * Data Source: Open Data / Analysis by Swappee
 */

const fs = require('fs');
const path = require('path');

const WARDS_23 = [
  '千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区',
  '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区',
  '北区', '荒川区', '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区'
];

const dir = __dirname;
const csvCandidates = [
  path.join(dir, 'station20252321free.csv'),
  path.join(dir, 'station20251211free.csv')
];

let csvPath = null;
for (const p of csvCandidates) {
  if (fs.existsSync(p)) {
    csvPath = p;
    break;
  }
}

if (!csvPath) {
  console.error('CSV not found. Place station2025*.csv in this folder.');
  process.exit(1);
}

// UTF-8 で読み込み
let raw = fs.readFileSync(csvPath, 'utf8');
let lines = raw.split(/\r?\n/).filter(l => l.length > 0);
const header = lines[0].split(',');
let rows = lines.slice(1);

// station_cd,station_g_cd,station_name,station_name_k,station_name_r,line_cd,pref_cd,post,address,lon,lat,open_ymd,close_ymd,e_status,e_sort
// station_name は CSV の漢字をそのまま使用（前後空白のみ trim）。照合は漢字完全一致で行う。
const idx = {
  station_cd: 0, station_g_cd: 1, station_name: 2, station_name_k: 3, station_name_r: 4,
  line_cd: 5, pref_cd: 6, post: 7, address: 8, lon: 9, lat: 10,
  open_ymd: 11, close_ymd: 12, e_status: 13, e_sort: 14
};

function parseRow(line) {
  const parts = line.split(',');
  if (parts.length < 11) return null;
  const stationName = (parts[idx.station_name] || '').trim();
  return {
    station_cd: parts[idx.station_cd],
    station_g_cd: parts[idx.station_g_cd],
    station_name: stationName,
    station_name_k: parts[idx.station_name_k],
    line_cd: parts[idx.line_cd],
    pref_cd: parts[idx.pref_cd],
    post: parts[idx.post],
    address: parts[idx.address],
    lon: parts[idx.lon],
    lat: parts[idx.lat]
  };
}

function wardFromAddress(address) {
  if (!address) return null;
  for (const w of WARDS_23) {
    if (address.includes(w)) return w;
  }
  return null;
}

let in23 = [];
for (const line of rows) {
  const r = parseRow(line);
  if (!r) continue;
  if (r.pref_cd !== '13') continue;
  const ward = wardFromAddress(r.address);
  if (!ward) continue;
  in23.push({ ...r, ward });
}

// 採用したCSVが駅データ形式でない（23区該当0件）場合は次候補にフォールバック
const usedCandidateIndex = csvCandidates.indexOf(csvPath);
for (let i = usedCandidateIndex + 1; in23.length === 0 && i < csvCandidates.length; i++) {
  const fallbackPath = csvCandidates[i];
  if (!fs.existsSync(fallbackPath)) continue;
  csvPath = fallbackPath;
  raw = fs.readFileSync(csvPath, 'utf8');
  lines = raw.split(/\r?\n/).filter(l => l.length > 0);
  rows = lines.slice(1);
  in23 = [];
  for (const line of rows) {
    const r = parseRow(line);
    if (!r) continue;
    if (r.pref_cd !== '13') continue;
    const ward = wardFromAddress(r.address);
    if (!ward) continue;
    in23.push({ ...r, ward });
  }
  if (in23.length > 0) {
    console.log('Using fallback CSV: ' + path.basename(csvPath) + ' (previous CSV had no 23-ku rows in expected format)');
  }
}

// 同一駅（station_g_cd）をまとめる: 駅名・区・座標は同じで、line_cd が複数
const byGcd = new Map();
for (const r of in23) {
  const g = r.station_g_cd;
  if (!byGcd.has(g)) {
    byGcd.set(g, {
      station_cd: r.station_cd,
      station_g_cd: r.station_g_cd,
      station_name: r.station_name,
      station_name_k: r.station_name_k || '',
      ward: r.ward,
      address: r.address,
      lon: parseFloat(r.lon) || 0,
      lat: parseFloat(r.lat) || 0,
      line_cds: [r.line_cd]
    });
  } else {
    const cur = byGcd.get(g);
    if (!cur.line_cds.includes(r.line_cd)) cur.line_cds.push(r.line_cd);
  }
}

const stations = Array.from(byGcd.values()).sort((a, b) => {
  const wardOrder = WARDS_23.indexOf(a.ward) - WARDS_23.indexOf(b.ward);
  if (wardOrder !== 0) return wardOrder;
  return (a.station_name || '').localeCompare(b.station_name || '');
});

// 照合用: 23区の「行数」（駅・路線の組み合わせ＝約650になる想定）とユニーク駅数
const rowCount23 = in23.length;
const uniqueCount = stations.length;

const out = {
  _comment: 'Data Source: Open Data / Analysis by Swappee. 東京都23区の駅一覧（駅データCSVから抽出）',
  generated: new Date().toISOString().slice(0, 10),
  sourceCsv: path.basename(csvPath),
  count: uniqueCount,
  rowCount23: rowCount23,
  note: 'rowCount23=CSVの23区該当行数(駅・路線の組み合わせ)。count=ユニーク駅数(station_g_cdで集約)。約650は「駅」数または「駅・路線」数の目安。',
  stations
};

fs.writeFileSync(path.join(dir, 'stations-23ku+10.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('Written stations-23ku+10.json');
console.log('  23区 行数(駅・路線の組み合わせ): ' + rowCount23);
console.log('  23区 ユニーク駅数(station_g_cd): ' + uniqueCount);

// 手動追記用CSV: 既存駅の名前・区・説明用のテンプレート + 新規追加用の空行
const manualHeader = 'station_name,ward,line_name,description,notes';
const manualRows = [
  '# 手動で追記する場合は以下の列を使用してください。',
  '# station_name: 駅名（必須）, ward: 区名（例: 港区）, line_name: 路線名（任意）, description: 解説1-2行（任意）, notes: メモ（任意）',
  '# 新規行を追加する場合は上記の列に沿ってカンマ区切りで追加してください。',
  manualHeader
];
// 既存の stations-23ku から駅名・区だけサンプルで数行入れておく（任意）
const sample = stations.slice(0, 5).map(s => `${s.station_name},${s.ward},,,`);
manualRows.push(...sample);
manualRows.push(',,,,'); // 空行（追記用）

fs.writeFileSync(path.join(dir, 'stations-manual.csv'), manualRows.join('\n'), 'utf8');
console.log('Written stations-manual.csv (for manual additions)');

// 区別集計（照合用）
const byWard = new Map();
for (const s of stations) {
  const w = s.ward;
  byWard.set(w, (byWard.get(w) || 0) + 1);
}
const wardLines = WARDS_23.map(w => '  ' + w + ': ' + (byWard.get(w) || 0) + ' 駅');
const totalWard = Array.from(byWard.values()).reduce((a, b) => a + b, 0);

const report = [
  '=== 23区 駅データCSV 照合結果 ===',
  'CSV: ' + path.basename(csvPath),
  '集計日: ' + new Date().toISOString().slice(0, 10),
  '',
  '23区該当 行数（駅・路線の組み合わせ）: ' + rowCount23,
  '  ※同一駅が複数路線で複数行になるため、約650〜700以上になることがあります。',
  '',
  '23区 ユニーク駅数（station_g_cdで集約）: ' + uniqueCount,
  '  ※サジェスト・一覧ではこの駅数を使用しています。',
  '',
  '--- 区別の駅数（CSV照合用） ---',
  wardLines.join('\n'),
  '  合計: ' + totalWard + ' 駅',
  '',
  '「約650駅」との照合:',
  '  - 駅・路線の組み合わせ数: ' + rowCount23 + ' 行（想定650前後ならこの数字で照合）',
  '  - 物理的な「駅」の数: ' + uniqueCount + ' 駅（想定650駅ならCSVに含まれる範囲ではこの数）',
  '  - 利用しているCSVに含まれる路線・駅のみが対象です。他データソースでは650前後になる場合があります。'
].join('\n');
fs.writeFileSync(path.join(dir, 'stations-23ku-report.txt'), report, 'utf8');
console.log('Written stations-23ku-report.txt');
