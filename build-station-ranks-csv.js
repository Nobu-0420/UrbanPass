#!/usr/bin/env node
/**
 * config.json の stationRanks からランクごとの駅一覧 CSV (station_ranks.csv) を生成する。
 * 使い方: node build-station-ranks-csv.js
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const outPath = path.join(__dirname, 'station_ranks.csv');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const ranks = config.stationRanks || {};
const rows = ['rank,station_name'];

const order = ['SS', 'S', 'P', 'A', 'B'];
for (const rank of order) {
  const stations = ranks[rank];
  if (!Array.isArray(stations)) continue;
  for (const name of stations) {
    rows.push(`${rank},${name}`);
  }
}

fs.writeFileSync(outPath, rows.join('\n') + '\n', 'utf8');
console.log('Generated:', outPath, '(', rows.length - 1, 'stations )');
