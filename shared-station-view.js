/**
 * SharedStationView — 駅情報表示の共通コンポーネント
 * ユーザー用・管理者用の両方から利用し、isAdmin で表示を出し分ける。
 * - isAdmin false: アフィリエイトリンク・内部用メモを非表示
 * - isAdmin true: 全データ + 編集・削除ボタンを表示
 */
(function (global) {
  'use strict';

  const clockSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  const transferSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 7v6h-6"/></svg>';
  const maxBar = 50;
  const barPct = (v) => Math.min(100, (v == null || !Number.isFinite(v) ? 0 : Math.abs(v)) / maxBar * 100);

  /**
   * 1件の駅カード用HTMLを生成する
   * @param {Object} c - 候補駅オブジェクト（stationName, timeA, timeB, transfersA, transfersB, timePart, transitPenalty, rankBonus, towerMansionBonus, commercialPenalty, hubPenalty, rentScore, score）
   * @param {number} i - 表示順位（0始まり）
   * @param {Object} opts - オプション
   * @param {boolean} opts.isAdmin - 管理者表示なら true
   * @param {string} opts.nameA - 勤務地A表示名
   * @param {string} opts.nameB - 勤務地B表示名
   * @param {function(number):string} opts.formatTravelTime - 所要時間フォーマット
   * @param {function(*):string} opts.rankLabel - ランク数値→ラベル（例: num => 'S'）
   * @param {Set} opts.rankKStationNames - Kランク駅名集合
   * @param {Object} opts.STATION_RANK_AND_RECOMMENDATION - 駅名→{ rank, recommendation }
   * @param {Object} opts.rankByStationName - 駅名→ランク
   * @param {Object} opts.stationRankDescriptions - 駅名→説明文
   * @param {function(string):string} opts.getStationDescription - 駅名→解説
   * @param {Array<string>} opts.CP_GOOD_STATIONS - CP優良駅名配列
   * @param {function(string):string} [opts.getInternalMemo] - 駅名→内部メモ（管理者用。未設定なら非表示）
   * @returns {string} カードの innerHTML 文字列
   */
  function SharedStationView(c, i, opts) {
    const isAdmin = !!opts.isAdmin;
    const nameA = opts.nameA || '勤務地A';
    const nameB = opts.nameB || '勤務地B';
    const formatTravelTime = opts.formatTravelTime || (m => (m == null || typeof m !== 'number') ? '—' : String(m) + '分');
    const rankLabel = opts.rankLabel || (num => (num == null ? '' : typeof num === 'string' ? num : (num <= 30 ? 'S' : num <= 70 ? 'A' : 'B')));
    const rankKStationNames = opts.rankKStationNames || new Set();
    const rec = (opts.STATION_RANK_AND_RECOMMENDATION && opts.STATION_RANK_AND_RECOMMENDATION[c.stationName]) || null;
    const rank = (rec && rec.rank) ? rec.rank : rankLabel(opts.rankByStationName && opts.rankByStationName[c.stationName]);
    const rankDisplay = rank ? (rank + (rankKStationNames.has(c.stationName) ? ' / K' : '')) : (rankKStationNames.has(c.stationName) ? 'K' : '');
    const descFromCsv = opts.stationRankDescriptions && opts.stationRankDescriptions[c.stationName];
    const rawFeature = descFromCsv || (rec && rec.recommendation) || (opts.getStationDescription && opts.getStationDescription(c.stationName));
    const featureText = (rawFeature && String(rawFeature).trim() && String(rawFeature).trim() !== '各駅の特徴') ? String(rawFeature).trim() : '';
    const descHtml = featureText ? `<p class="result-station-desc">${featureText}</p>` : '';
    const rankHtml = rankDisplay ? `<span class="result-rank-badge">${rankDisplay}ランク</span>` : '';
    const CP_GOOD_STATIONS = opts.CP_GOOD_STATIONS || [];
    const isCPGood = CP_GOOD_STATIONS.indexOf(c.stationName) !== -1;
    const cpBadgeHtml = isCPGood ? '<span class="result-cp-badge">CP優良駅</span>' : '';

    const tPart = c.timePart != null ? Number(c.timePart) : 0;
    const tPen = c.transitPenalty != null ? Number(c.transitPenalty) : 0;
    const rBonus = c.rankBonus != null ? Number(c.rankBonus) : 0;
    const tBonus = c.towerMansionBonus != null ? Number(c.towerMansionBonus) : 0;
    const cPen = c.commercialPenalty != null ? Number(c.commercialPenalty) : 0;
    const hPen = (c.hubPenalty != null ? Number(c.hubPenalty) : 0);
    const rScore = (c.rentScore != null && Number.isFinite(c.rentScore)) ? Number(c.rentScore) : null;
    const aiScoreHtml = `
      <div class="ai-analysis-score">
        <p class="ai-analysis-score-title">AI Analysis Score — スコア根拠</p>
        <div class="ai-analysis-score-bars">
          <div class="ai-analysis-row"><label>通勤時間</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(tPart)}%"></div></div><span class="bar-value">${tPart.toFixed(0)}</span></div>
          <div class="ai-analysis-row"><label>乗換ペナルティ</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(tPen)}%"></div></div><span class="bar-value">${tPen}</span></div>
          <div class="ai-analysis-row"><label>ランク・街ブランド</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(rBonus)}%"></div></div><span class="bar-value">${rBonus}</span></div>
          <div class="ai-analysis-row"><label>商業地ペナルティ</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(cPen)}%"></div></div><span class="bar-value">${cPen}</span></div>
          <div class="ai-analysis-row"><label>タワマン・再開発</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(tBonus)}%"></div></div><span class="bar-value">${tBonus}</span></div>
          ${hPen !== 0 ? `<div class="ai-analysis-row"><label>ハブ駅ペナルティ</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(hPen)}%"></div></div><span class="bar-value">${hPen}</span></div>` : ''}
          ${rScore != null ? `<div class="ai-analysis-row"><label>家賃スコア</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(rScore)}%"></div></div><span class="bar-value">${rScore.toFixed(0)}</span></div>` : ''}
          <div class="ai-analysis-row" style="margin-top:8px; padding-top:8px; border-top:1px solid var(--color-border);"><label>合計スコア</label><div class="bar-wrap"><div class="bar-fill" style="width:${barPct(c.score)}%"></div></div><span class="bar-value">${c.score.toFixed(1)}</span></div>
        </div>
      </div>`;

    // isAdmin false（ユーザー用）: アフィリエイトリンク・内部メモを隠す / isAdmin true（管理者用）: すべて表示
    const ctaBlockHtml = !isAdmin ? '' : `
      <div class="cta-block">
        ${(['SS','S','A'].indexOf(String(rank).toUpperCase()) !== -1 ? '<p class="cta-message-small">人気エリアは、家賃が高騰しがちです。予算内で賢く住むための『あなたにフィットする』住まい探しをしませんか？</p>' : '')}
        <a href="https://swappee.jp/" target="_blank" rel="noopener" class="btn-swappee">今すぐ Swappee で診断する</a>
      </div>`;

    const getInternalMemo = opts.getInternalMemo || (() => '');
    const internalMemo = isAdmin && getInternalMemo ? getInternalMemo(c.stationName) : '';
    const internalMemoHtml = (isAdmin && internalMemo !== undefined && internalMemo !== null && String(internalMemo).trim() !== '') 
      ? `<div class="result-internal-memo" data-station="${c.stationName}"><strong>内部メモ:</strong> ${String(internalMemo).trim()}</div>` 
      : (isAdmin ? `<div class="result-internal-memo result-internal-memo--empty" data-station="${c.stationName}"><strong>内部メモ:</strong> （未設定）</div>` : '');

    const adminActionsHtml = isAdmin ? `
      <div class="result-admin-actions" data-station-name="${c.stationName}">
        <button type="button" class="btn btn-secondary btn-edit-station" data-station-name="${c.stationName}" aria-label="編集">編集</button>
        <button type="button" class="btn btn-secondary btn-delete-station" data-station-name="${c.stationName}" aria-label="削除">削除</button>
      </div>` : '';

    // 所要時間目安・乗り換え回数はユーザー・管理者の両方に表示。乗り換えはユーザー向けに「（目安）」を付与
    const transferLabelA = isAdmin ? `乗り換え${c.transfersA}回` : `乗り換え${c.transfersA}回（目安）`;
    const transferLabelB = isAdmin ? `乗り換え${c.transfersB}回` : `乗り換え${c.transfersB}回（目安）`;
    const chipsHtml = `
      <div class="result-chips">
        <span class="result-chip">${clockSvg}勤務地A（${nameA}）へ${formatTravelTime(c.timeA)}</span>
        <span class="result-chip">${clockSvg}勤務地B（${nameB}）へ${formatTravelTime(c.timeB)}</span>
        <span class="result-chip">${transferSvg}勤務地A（${nameA}）へ ${transferLabelA}</span>
        <span class="result-chip">${transferSvg}勤務地B（${nameB}）へ ${transferLabelB}</span>
      </div>`;
    const aiScoreSectionHtml = isAdmin ? aiScoreHtml : '';

    return `
      <div class="result-station-name">
        <span>${i + 1}位　${c.stationName}</span>${rankHtml}${cpBadgeHtml}
      </div>
      ${descHtml}
      ${chipsHtml}
      ${aiScoreSectionHtml}
      ${internalMemoHtml}
      ${ctaBlockHtml}
      ${adminActionsHtml}
    `;
  }

  global.SharedStationView = SharedStationView;
})(typeof window !== 'undefined' ? window : this);
