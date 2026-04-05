/**
 * stations_data.js
 * Data Source: Open Data / Analysis by Swappee
 * 23区全駅＋23区外精鋭駅の統合データ。isHub（ターミナル）・quietness（閑静度）を付与。
 * 駅名の羅列はこのファイル内にのみ保持し、プロンプトやindex.htmlには持たない。
 */

(function (global) {
  'use strict';

  var HUB_STATION_NAMES = ['新宿', '品川', '東京', '渋谷', '池袋', '上野', '新橋', '銀座', '大手町'];
  /** JR山手線の全駅（閑静モードで検索結果・サジェストから完全除外）※30駅とされる場合あり、本リストはグラフと一致する28駅 */
  var YAMANOTE_STATION_NAMES = ['東京', '有楽町', '新橋', '田町', '品川', '大崎', '五反田', '目黒', '恵比寿', '渋谷', '原宿', '代々木', '新宿', '新大久保', '高田馬場', '目白', '池袋', '大塚', '巣鴨', '駒込', '田端', '西日暮里', '日暮里', '鶯谷', '上野', '御徒町', '秋葉原', '神田'];
  /** 東京メトロで2路線以上乗り入れの駅（閑静モードで除外） */
  var METRO_MULTI_LINE_STATION_NAMES = ['渋谷', '表参道', '永田町', '霞ヶ関', '大手町', '飯田橋', '後楽園', '四ツ谷', '赤坂見附', '溜池山王', '国会議事堂前', '九段下', '神保町', '日本橋', '茅場町', '門前仲町', '東銀座', '銀座', '日比谷', '三越前'];
  var QUIET_WARDS = { '世田谷区': 5, '杉並区': 5, '目黒区': 5, '練馬区': 5, '文京区': 4 };

  function quietnessFor(ward) {
    return QUIET_WARDS[ward] != null ? QUIET_WARDS[ward] : 0;
  }

  function isHub(name) {
    return HUB_STATION_NAMES.indexOf(name) !== -1;
  }

  function isYamanote(name) {
    return YAMANOTE_STATION_NAMES.indexOf(name) !== -1;
  }

  function isMetroMultiLine(name) {
    return METRO_MULTI_LINE_STATION_NAMES.indexOf(name) !== -1;
  }

  // ステップA: 23区内の全駅（JR・メトロ・都営・主要私鉄）＋ ステップB: 23区外15駅
  var STATIONS_23KU = [
    { id: 'tokyo', name: '東京', ward: '千代田区' },
    { id: 'yurakucho', name: '有楽町', ward: '千代田区' },
    { id: 'shinbashi', name: '新橋', ward: '港区' },
    { id: 'shinagawa', name: '品川', ward: '港区' },
    { id: 'tamachi', name: '田町', ward: '港区' },
    { id: 'osaki', name: '大崎', ward: '品川区' },
    { id: 'gotanda', name: '五反田', ward: '品川区' },
    { id: 'meguro', name: '目黒', ward: '目黒区' },
    { id: 'nakameguro', name: '中目黒', ward: '目黒区' },
    { id: 'kamimeguro', name: '上目黒', ward: '目黒区' },
    { id: 'ebisu', name: '恵比寿', ward: '渋谷区' },
    { id: 'shibuya', name: '渋谷', ward: '渋谷区' },
    { id: 'harajuku', name: '原宿', ward: '渋谷区' },
    { id: 'yoyogi', name: '代々木', ward: '渋谷区' },
    { id: 'shinjuku', name: '新宿', ward: '新宿区' },
    { id: 'shinokubo', name: '新大久保', ward: '新宿区' },
    { id: 'takadanobaba', name: '高田馬場', ward: '新宿区' },
    { id: 'mejiro', name: '目白', ward: '豊島区' },
    { id: 'ikebukuro', name: '池袋', ward: '豊島区' },
    { id: 'otsuka', name: '大塚', ward: '豊島区' },
    { id: 'sugamo', name: '巣鴨', ward: '豊島区' },
    { id: 'komagome', name: '駒込', ward: '豊島区' },
    { id: 'tabata', name: '田端', ward: '北区' },
    { id: 'nishinippori', name: '西日暮里', ward: '荒川区' },
    { id: 'nippori', name: '日暮里', ward: '荒川区' },
    { id: 'uguisudani', name: '鶯谷', ward: '台東区' },
    { id: 'ueno', name: '上野', ward: '台東区' },
    { id: 'okachimachi', name: '御徒町', ward: '台東区' },
    { id: 'akihabara', name: '秋葉原', ward: '千代田区' },
    { id: 'kanda', name: '神田', ward: '千代田区' },
    { id: 'otemachi', name: '大手町', ward: '千代田区' },
    { id: 'ginza', name: '銀座', ward: '中央区' },
    { id: 'toranomon', name: '虎ノ門', ward: '港区' },
    { id: 'tameikesanno', name: '溜池山王', ward: '港区' },
    { id: 'akasakamitsuke', name: '赤坂見附', ward: '港区' },
    { id: 'nogizaka', name: '乃木坂', ward: '港区' },
    { id: 'omotesando', name: '表参道', ward: '港区' },
    { id: 'gaienmae', name: '外苑前', ward: '港区' },
    { id: 'korakuen', name: '後楽園', ward: '文京区' },
    { id: 'myogadani', name: '茗荷谷', ward: '文京区' },
    { id: 'shinotsuka', name: '新大塚', ward: '文京区' },
    { id: 'hongosanchome', name: '本郷三丁目', ward: '文京区' },
    { id: 'ochanomizu', name: '御茶ノ水', ward: '千代田区' },
    { id: 'awajicho', name: '淡路町', ward: '千代田区' },
    { id: 'yotsuya', name: '四ツ谷', ward: '新宿区' },
    { id: 'yotsuyasanchome', name: '四谷三丁目', ward: '新宿区' },
    { id: 'shinjukugyoen', name: '新宿御苑前', ward: '新宿区' },
    { id: 'shinjuku_sanchome', name: '新宿三丁目', ward: '新宿区' },
    { id: 'nishishinjuku', name: '西新宿', ward: '新宿区' },
    { id: 'nakano_sakaue', name: '中野坂上', ward: '中野区' },
    { id: 'nakano', name: '中野', ward: '中野区' },
    { id: 'koenji', name: '高円寺', ward: '中野区' },
    { id: 'asagaya', name: '阿佐ヶ谷', ward: '杉並区' },
    { id: 'ogikubo', name: '荻窪', ward: '杉並区' },
    { id: 'ochiai', name: '落合', ward: '新宿区' },
    { id: 'waseda', name: '早稲田', ward: '新宿区' },
    { id: 'kagurazaka', name: '神楽坂', ward: '新宿区' },
    { id: 'iidabashi', name: '飯田橋', ward: '新宿区' },
    { id: 'kudanshita', name: '九段下', ward: '千代田区' },
    { id: 'takebashi', name: '竹橋', ward: '千代田区' },
    { id: 'nihonbashi', name: '日本橋', ward: '中央区' },
    { id: 'kayabacho', name: '茅場町', ward: '中央区' },
    { id: 'monzennakacho', name: '門前仲町', ward: '江東区' },
    { id: 'kiba', name: '木場', ward: '江東区' },
    { id: 'toyocho', name: '東陽町', ward: '江東区' },
    { id: 'kiyosumi', name: '清澄白河', ward: '江東区' },
    { id: 'sumiyoshi', name: '住吉', ward: '江東区' },
    { id: 'kinshicho', name: '錦糸町', ward: '墨田区' },
    { id: 'oji', name: '王子', ward: '北区' },
    { id: 'oji_kamiya', name: '王子神谷', ward: '北区' },
    { id: 'shirokane', name: '白金台', ward: '港区' },
    { id: 'shirokanetakanawa', name: '白金高輪', ward: '港区' },
    { id: 'azabujuban', name: '麻布十番', ward: '港区' },
    { id: 'roppongiitchome', name: '六本木一丁目', ward: '港区' },
    { id: 'nagatacho', name: '永田町', ward: '千代田区' },
    { id: 'ichigaya', name: '市ヶ谷', ward: '新宿区' },
    { id: 'todaimae', name: '東大前', ward: '文京区' },
    { id: 'honkomagome', name: '本駒込', ward: '文京区' },
    { id: 'nishigahara', name: '西ヶ原', ward: '北区' },
    { id: 'mitsukoshimae', name: '三越前', ward: '中央区' },
    { id: 'suitengumae', name: '水天宮前', ward: '中央区' },
    { id: 'hanzomon', name: '半蔵門', ward: '千代田区' },
    { id: 'jimbocho', name: '神保町', ward: '千代田区' },
    { id: 'minamisenju', name: '南千住', ward: '荒川区' },
    { id: 'minowa', name: '三ノ輪', ward: '台東区' },
    { id: 'iriya', name: '入谷', ward: '台東区' },
    { id: 'nakano_okachimachi', name: '仲御徒町', ward: '台東区' },
    { id: 'kodemnacho', name: '小伝馬町', ward: '中央区' },
    { id: 'ningyocho', name: '人形町', ward: '中央区' },
    { id: 'hatchobori', name: '八丁堀', ward: '中央区' },
    { id: 'tsukiji', name: '築地', ward: '中央区' },
    { id: 'higashiginza', name: '東銀座', ward: '中央区' },
    { id: 'kasumigaseki', name: '霞ヶ関', ward: '千代田区' },
    { id: 'kamiyacho', name: '神谷町', ward: '港区' },
    { id: 'roppongi', name: '六本木', ward: '港区' },
    { id: 'hiroo', name: '広尾', ward: '港区' },
    { id: 'yoyogiuehara', name: '代々木上原', ward: '渋谷区' },
    { id: 'yoyogikoen', name: '代々木公園', ward: '渋谷区' },
    { id: 'meijijingumae', name: '明治神宮前', ward: '港区' },
    { id: 'akasaka', name: '赤坂', ward: '港区' },
    { id: 'kokkaigijidomae', name: '国会議事堂前', ward: '千代田区' },
    { id: 'hibiya', name: '日比谷', ward: '千代田区' },
    { id: 'shinochanomizu', name: '新御茶ノ水', ward: '千代田区' },
    { id: 'yushima', name: '湯島', ward: '文京区' },
    { id: 'nedu', name: '根津', ward: '文京区' },
    { id: 'kitasenju', name: '北千住', ward: '足立区' },
    { id: 'oimachi', name: '大井町', ward: '品川区' },
    { id: 'shimoshinmei', name: '下神明', ward: '品川区' },
    { id: 'togoshikoen', name: '戸越公園', ward: '品川区' },
    { id: 'nakaben', name: '中延', ward: '品川区' },
    { id: 'ebaramachi', name: '荏原町', ward: '品川区' },
    { id: 'hatanodai', name: '旗の台', ward: '品川区' },
    { id: 'kitachikusa', name: '北千束', ward: '大田区' },
    { id: 'ookayama', name: '大岡山', ward: '目黒区' },
    { id: 'midorigaoka', name: '緑が丘', ward: '目黒区' },
    { id: 'jiyugaoka', name: '自由が丘', ward: '目黒区' },
    { id: 'futakotamagawa', name: '二子玉川', ward: '世田谷区' },
    { id: 'shindaita', name: '新代田', ward: '世田谷区' },
    { id: 'fudomae', name: '不動前', ward: '品川区' },
    { id: 'musashikoyama', name: '武蔵小山', ward: '品川区' },
    { id: 'nishikoyama', name: '西小山', ward: '品川区' },
    { id: 'senzoku', name: '洗足', ward: '目黒区' },
    { id: 'okusawa', name: '奥沢', ward: '目黒区' },
    { id: 'denenchofu', name: '田園調布', ward: '大田区' },
    { id: 'toyosu', name: '豊洲', ward: '江東区' },
    { id: 'tsukishima', name: '月島', ward: '中央区' },
    { id: 'kachidoki', name: '勝どき', ward: '中央区' },
    { id: 'ariake', name: '有明', ward: '江東区' },
    { id: 'shinkiba', name: '新木場', ward: '江東区' },
    { id: 'nishikasai', name: '西葛西', ward: '江戸川区' },
    { id: 'kasai', name: '葛西', ward: '江戸川区' },
    { id: 'mizue', name: '瑞江', ward: '江戸川区' },
    { id: 'funabori', name: '船堀', ward: '江戸川区' },
    { id: 'nerima', name: '練馬', ward: '練馬区' },
    { id: 'nerimakasugacho', name: '練馬春日町', ward: '練馬区' },
    { id: 'hikarigaoka', name: '光が丘', ward: '練馬区' },
    { id: 'akabane', name: '赤羽', ward: '北区' },
    { id: 'kuramae', name: '蔵前', ward: '台東区' },
    { id: 'hamacho', name: '浜町', ward: '中央区' },
    { id: 'ryogoku', name: '両国', ward: '墨田区' },
    { id: 'morishita', name: '森下', ward: '江東区' },
    { id: 'kikukawa', name: '菊川', ward: '墨田区' },
    { id: 'shinohashicho', name: '東日本橋', ward: '中央区' },
    { id: 'bakuroyokoyama', name: '馬喰横山', ward: '中央区' },
    { id: 'aoto', name: '青砥', ward: '葛飾区' },
    { id: 'togoshi', name: '戸越', ward: '品川区' },
    { id: 'sengoku', name: '千石', ward: '文京区' },
    { id: 'sendagi', name: '千駄木', ward: '文京区' },
    { id: 'machiya', name: '町屋', ward: '足立区' },
    { id: 'ayase', name: '綾瀬', ward: '足立区' },
    { id: 'kameido', name: '亀戸', ward: '江東区' },
    { id: 'kameidosuijin', name: '亀戸水神', ward: '江東区' },
    { id: 'higashiojima', name: '東大島', ward: '江東区' },
    { id: 'shirako', name: '白鬚橋', ward: '墨田区' },
    { id: 'honjoazumabashi', name: '本所吾妻橋', ward: '墨田区' },
    { id: 'asakusabashi', name: '浅草橋', ward: '台東区' }
  ];

  var STATIONS_OUTSIDE_23 = [
    { id: 'musashikosugi', name: '武蔵小杉', ward: '川崎市中原区', timeToTokyo: 18 },
    { id: 'urawa', name: '浦和', ward: 'さいたま市浦和区', timeToTokyo: 30 },
    { id: 'shinurayasu', name: '新浦安', ward: '浦安市', timeToTokyo: 35 },
    { id: 'kichijoji', name: '吉祥寺', ward: '武蔵野市', timeToTokyo: 20 },
    { id: 'tamaplaza', name: 'たまプラーザ', ward: '横浜市青葉区', timeToTokyo: 35 },
    { id: 'mitaka', name: '三鷹', ward: '三鷹市', timeToTokyo: 22 },
    { id: 'yokohama', name: '横浜', ward: '横浜市西区', timeToTokyo: 28 },
    { id: 'saitamashintoshin', name: 'さいたま新都心', ward: 'さいたま市大宮区', timeToTokyo: 32 },
    { id: 'ichikawa', name: '市川', ward: '市川市', timeToTokyo: 32 },
    { id: 'omiya', name: '大宮', ward: 'さいたま市大宮区', timeToTokyo: 30 },
    { id: 'kawaguchi', name: '川口', ward: '川口市', timeToTokyo: 26 },
    { id: 'kaihimmakuhari', name: '海浜幕張', ward: '千葉市美浜区', timeToTokyo: 40 },
    { id: 'funabashi_ext', name: '船橋', ward: '船橋市', timeToTokyo: 38 },
    { id: 'kashiwa', name: '柏', ward: '柏市', timeToTokyo: 45 },
    { id: 'matsudo', name: '松戸', ward: '松戸市', timeToTokyo: 42 }
  ];

  var STATIONS_23KU_NORMALIZED = STATIONS_23KU.map(function (s) {
    return {
      id: s.id,
      name: s.name,
      ward: s.ward,
      isHub: isHub(s.name),
      quietness: quietnessFor(s.ward),
      in23: true
    };
  });

  var STATIONS_OUTSIDE_NORMALIZED = STATIONS_OUTSIDE_23.map(function (s) {
    return {
      id: s.id,
      name: s.name,
      ward: s.ward,
      isHub: false,
      quietness: 0,
      in23: false,
      timeToTokyo: s.timeToTokyo
    };
  });

  var STATIONS_DATA = STATIONS_23KU_NORMALIZED.concat(STATIONS_OUTSIDE_NORMALIZED);

  function suggestStations(query, options) {
    var q = (query || '').trim();
    if (!q) return [];
    var limit = (options && options.limit) || 20;
    var excludeHubsInQuiet = (options && options.excludeHubsInQuiet) === true;
    var list = STATIONS_DATA;
    if (excludeHubsInQuiet) list = list.filter(function (s) { return !s.isHub && !isYamanote(s.name) && !isMetroMultiLine(s.name); });
    var lower = q.toLowerCase();
    var scored = list.map(function (s) {
      var name = s.name;
      var nameL = name.toLowerCase();
      var score = 0;
      if (nameL === lower) score = 100;
      else if (nameL.indexOf(lower) === 0) score = 80;
      else if (nameL.indexOf(lower) !== -1) score = 60;
      else if (lower.indexOf(nameL) === 0) score = 40;
      if (s.ward && s.ward.indexOf(q) !== -1) score = Math.max(score, 50);
      return { station: s, score: score };
    }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, limit).map(function (x) { return x.station; });
  }

  var REQUIRED_STATIONS = ['二子玉川', '田町', '東京', '新宿', '品川', '渋谷', '池袋', '上野', '北千住', '門前仲町', '中野', '荻窪', '大井町', '自由が丘', '武蔵小杉', '浦和', '横浜', '大宮'];
  var REQUIRED_LINES_HINT = ['山手線', '中央線', '銀座線', '丸ノ内線', '日比谷線', '東西線', '千代田線', '半蔵門線', '南北線', '有楽町線', '副都心線', '都営浅草線', '都営三田線', '都営新宿線', '都営大江戸線', '東急東横線', '東急目黒線', '東急大井町線', '東急田園都市線', '京王線', '京王井の頭線', '西武新宿線', '西武池袋線', '東武スカイツリーライン'];

  function validateStationCoverage() {
    var names = {};
    STATIONS_DATA.forEach(function (s) { names[s.name] = true; });
    var missing = REQUIRED_STATIONS.filter(function (n) { return !names[n]; });
    var ok = missing.length === 0;
    return { ok: ok, missing: missing, requiredLinesHint: REQUIRED_LINES_HINT };
  }

  function mergeStationsFromJson(jsonData) {
    if (!jsonData || !jsonData.stations || !Array.isArray(jsonData.stations) || jsonData.stations.length === 0) return false;
    var list = jsonData.stations.map(function (s) {
      return {
        id: s.station_g_cd || s.station_cd || ('csv_' + (s.station_name || '').replace(/\s/g, '')),
        name: s.station_name || '',
        ward: s.ward || '',
        isHub: isHub(s.station_name || ''),
        quietness: quietnessFor(s.ward || ''),
        in23: true
      };
    }).filter(function (s) { return s.name; });
    STATIONS_23KU_NORMALIZED.length = 0;
    list.forEach(function (s) { STATIONS_23KU_NORMALIZED.push(s); });
    STATIONS_DATA.length = 0;
    STATIONS_23KU_NORMALIZED.forEach(function (s) { STATIONS_DATA.push(s); });
    STATIONS_OUTSIDE_NORMALIZED.forEach(function (s) { STATIONS_DATA.push(s); });
    return true;
  }

  global.StationsData = {
    get STATIONS_DATA() { return STATIONS_DATA; },
    get STATIONS_23KU() { return STATIONS_23KU_NORMALIZED; },
    STATIONS_OUTSIDE_23: STATIONS_OUTSIDE_NORMALIZED,
    HUB_STATION_NAMES: HUB_STATION_NAMES,
    YAMANOTE_STATION_NAMES: YAMANOTE_STATION_NAMES,
    METRO_MULTI_LINE_STATION_NAMES: METRO_MULTI_LINE_STATION_NAMES,
    suggestStations: suggestStations,
    validateStationCoverage: validateStationCoverage,
    mergeStationsFromJson: mergeStationsFromJson,
    REQUIRED_STATIONS: REQUIRED_STATIONS
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
