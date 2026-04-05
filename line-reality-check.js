/**
 * LINE内「Reality Check（順位診断）」用モジュール
 * ユーザーから送られた駅名に対し、stations.json を参照して順位を算出し回答メッセージを返す。
 *
 * 使い方:
 *   const { getReplyMessage, getRankPosition } = require('./line-reality-check');
 *   const msg = getReplyMessage('自由が丘');
 */

const path = require('path');
const fs = require('fs');

const STATIONS_PATH = path.join(__dirname, 'stations.json');

/** ランク別スコア（独自スコアリング）。高いほど上位。 */
const RANK_SCORE = {
  SS: 100,
  S: 80,
  P: 60,
  A: 40,
  B: 20
};

const TAGLINE = '結果はあくまでAI基準で判断されたものであり、あなたの「住みやすい」と感じる事が最も重要です。';

let _stations = null;
let _sortedByName = null;

function loadStations() {
  if (_stations) return _stations;
  const raw = fs.readFileSync(STATIONS_PATH, 'utf8');
  const data = JSON.parse(raw);
  _stations = Array.isArray(data.stations) ? data.stations : [];
  return _stations;
}

/**
 * 駅名で検索（完全一致 → 前方一致の順）
 * @param {string} query - ユーザー入力（駅名）
 * @returns {{ name: string, rank: string, is_quiet_selection: boolean } | null}
 */
function findStation(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().replace(/\s+/g, ' ');
  if (!q) return null;
  const list = loadStations();
  const exact = list.find(s => s.name === q || s.name.replace(/\s/g, '') === q.replace(/\s/g, ''));
  if (exact) return exact;
  const starts = list.filter(s => s.name.indexOf(q) === 0 || s.name.replace(/\s/g, '').indexOf(q.replace(/\s/g, '')) === 0);
  return starts.length === 1 ? starts[0] : (starts[0] || null);
}

/**
 * 全駅をスコアでソートしたリストを返す（同点は is_quiet_selection で微差、その後駅名）
 */
function getSortedByScore() {
  if (_sortedByName) return _sortedByName;
  const list = loadStations().slice();
  const baseScore = r => (RANK_SCORE[r] != null ? RANK_SCORE[r] : 0);
  list.sort((a, b) => {
    const scoreA = baseScore(a.rank) + (a.is_quiet_selection ? 0.5 : 0);
    const scoreB = baseScore(b.rank) + (b.is_quiet_selection ? 0.5 : 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (a.name || '').localeCompare(b.name || '', 'ja');
  });
  _sortedByName = list;
  return list;
}

/**
 * 指定駅の順位を算出する
 * @param {string} stationName - 駅名
 * @returns {{ position: number, rank: string, is_quiet_selection: boolean, found: boolean }}
 */
function getRankPosition(stationName) {
  const station = findStation(stationName);
  if (!station) {
    return { position: 0, rank: null, is_quiet_selection: false, found: false };
  }
  const sorted = getSortedByScore();
  const idx = sorted.findIndex(s => s.name === station.name);
  const position = idx >= 0 ? idx + 1 : 0;
  return {
    position,
    rank: station.rank || null,
    is_quiet_selection: !!station.is_quiet_selection,
    found: true
  };
}

/**
 * 順位診断の返信メッセージを生成
 * @param {string} stationName - ユーザーが送った駅名
 * @returns {string}
 */
function getReplyMessage(stationName) {
  const resolved = findStation(stationName);
  const displayName = resolved ? resolved.name : (stationName || '').trim() || 'その駅';
  const result = getRankPosition(stationName);

  if (!result.found) {
    return `${displayName}は残念ながらランク外でした。${TAGLINE}`;
  }

  return `${displayName}の順位は${result.position}位です。${TAGLINE}`;
}

module.exports = {
  loadStations,
  findStation,
  getSortedByScore,
  getRankPosition,
  getReplyMessage,
  RANK_SCORE,
  TAGLINE
};
