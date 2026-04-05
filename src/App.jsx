import React from 'react'

const SWAPPEE_LOGO_SRC = '/Swappee_logo.svg'

// =============================================================================
// ヒーローセクション：ファーストビュー（白背景・中央配置・ロゴアニメーション）
// =============================================================================
function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-16 md:py-24">
      <div className="mb-6 md:mb-8 animate-float">
        <div
          className="hero-logo-reveal flex items-center justify-center"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
          }}
        >
          <img
            src={SWAPPEE_LOGO_SRC}
            alt="Swappee"
            className="w-44 h-auto md:w-56 max-w-[min(100%,280px)] object-contain"
            width={280}
            height={280}
          />
        </div>
      </div>

      {/* キャッチフレーズ（控えめ・グレー） */}
      <p className="hero-text-reveal text-xs md:text-sm text-gray-500 tracking-widest mb-2" style={{ opacity: 0, animationDelay: '0.4s' }}>
        Technology drives your life.
      </p>

      {/* メインコピー：太めゴシック・深いネイビー */}
      <h1 className="hero-text-reveal text-2xl md:text-4xl lg:text-5xl font-bold text-navy text-center leading-tight tracking-wide mb-3" style={{ opacity: 0, animationDelay: '0.5s' }}>
        合わせるのは、不動産の方だ。
      </h1>

      {/* サブコピー：セリフ体イタリック・青エメラルド */}
      <p
        className="hero-text-reveal text-sm md:text-lg text-emerald italic tracking-wider"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', opacity: 0, animationDelay: '0.6s' }}
      >
        Property fits your life.
      </p>

      {/* ロゴ・コピーのふわっと出現＋ロゴの浮遊アニメーション */}
      <style>{`
        .hero-logo-reveal {
          animation: heroLogoReveal 1.2s ease-out 0.2s forwards;
        }
        .hero-text-reveal {
          animation: heroLogoReveal 0.8s ease-out forwards;
          transform: translateY(20px);
        }
        @keyframes heroLogoReveal {
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  )
}

// =============================================================================
// 課題提起セクション：従来の不動産探しの「不条理」3ポイント（カード形式）
// =============================================================================
function ProblemSection() {
  const points = [
    {
      title: '「おとり物件」の罠',
      description:
        '「いいな」と思った物件が「先ほど埋まりました」と常に言われる精神的ストレス。',
      icon: '✖️',
      iconLabel: '満室・おとり',
    },
    {
      title: '終わらない検索と妥協',
      description:
        '何百件もの物件情報を条件に合わせ、自分でスクロールして探す疲弊感。',
      icon: '🔍',
      iconLabel: '検索の無限ループ',
    },
    {
      title: 'タワマン特有のアナログ手続き',
      description:
        '引越し日程、管理組合への申請、鍵の受け渡しなど、電話やFAXに縛られる非効率。',
      icon: '📞',
      iconLabel: '電話・FAX・書類',
    },
  ]

  return (
    <section id="problem" className="bg-gray-50 py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy text-center mb-12 md:mb-16 tracking-wide leading-relaxed">
          「空き物件」から選ぶ時代は、もう終わり。
          <br />
          AIが導く、都市生活の最適解。
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {points.map((item, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
              <p className="sr-only">{item.iconLabel}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// 概念図セクション：スマホファースト縦比較（従来 vs Swappee）
// =============================================================================
function ConceptDiagramSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-md mx-auto relative">
        {/* データストリーム・都市光の背景エフェクト */}
        <div className="concept-diagram-bg absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* 上部：従来のシステム（物件起点） */}
        <div className="relative rounded-2xl bg-white/80 backdrop-blur border border-gray-200 p-6 md:p-8 shadow-lg mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/50 to-transparent pointer-events-none" />
          <h3 className="text-center text-sm md:text-base font-bold text-gray-600 mb-6 tracking-wide relative">
            「空き物件」から選ぶ消去法の時代
          </h3>
          {/* 空き物件アイコン（家・鍵・建物の複合） */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-200/80 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path d="M9 22V12h6v10" />
                <path d="M8 2v4M16 2v4M12 14v4" />
              </svg>
            </div>
          </div>
          {/* 矢印：不動産屋・Webプラットフォームへ */}
          <div className="flex justify-around items-start gap-2 mb-4">
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs text-gray-500 mb-1">不動産屋</span>
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <span className="text-gray-400 mt-1 text-[10px]">物件リスト</span>
            </div>
            <div className="flex items-center pt-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-xs text-gray-500 mb-1">Webプラットフォーム</span>
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              </div>
              <span className="text-gray-400 mt-1 text-[10px]">おとり・時間の無駄</span>
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs md:text-sm leading-relaxed relative">
            今、市場に出ているものに人生を合わせる不自由。不動産業界主導の不透明なプロセス。
          </p>
        </div>

        {/* 中央：転換点 */}
        <div className="flex flex-col items-center py-6 md:py-8">
          <p className="text-center text-lg md:text-xl font-bold text-navy mb-4 tracking-wide">
            Swappeeが、常識を上書きする。
          </p>
          <div className="flex flex-col items-center text-emerald">
            <svg className="w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(0,206,209,0.6)] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* 下部：Swappeeのシステム（ライフスタイル起点） */}
        <div className="relative rounded-2xl border-2 border-emerald/30 bg-emerald/5 p-6 md:p-8 shadow-lg overflow-hidden">
          <div className="absolute inset-0 concept-stream opacity-30 pointer-events-none" />
          <h3 className="text-center text-sm md:text-base font-bold text-navy mb-6 tracking-wide relative">
            AIが導く、都市生活の最適解
            <span className="block text-emerald font-semibold mt-1">（あなたの人生が起点）</span>
          </h3>
          {/* ライフスタイル条件アイコン → AIエンジン */}
          <div className="flex justify-around mb-4 relative">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-navy/80 mb-1">職住近接</span>
              <div className="w-12 h-12 rounded-xl bg-emerald/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-navy/80 mb-1">静寂</span>
              <div className="w-12 h-12 rounded-xl bg-emerald/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13M9 9l12-2" /></svg>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-navy/80 mb-1">育児環境</span>
              <div className="w-12 h-12 rounded-xl bg-emerald/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
              </div>
            </div>
          </div>
          {/* 光の矢印 → AIエンジン */}
          <div className="flex justify-center mb-4">
            <div className="w-full max-w-[200px] md:max-w-[240px] rounded-2xl bg-gradient-to-br from-emerald to-navy flex items-center justify-center shadow-lg concept-ai-icon relative p-3 md:p-4">
              <img
                src={SWAPPEE_LOGO_SRC}
                alt=""
                className="w-full h-auto object-contain"
                width={240}
                height={240}
              />
            </div>
          </div>
          <p className="text-center text-[10px] text-emerald font-semibold mb-2">AI都市生活最適化エンジン</p>
          <div className="flex justify-center mb-4">
            <svg className="w-8 h-8 text-emerald drop-shadow-[0_0_6px_rgba(0,206,209,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-xl bg-navy/10 border border-emerald/30">
              <span className="text-sm font-bold text-navy">あなただけの最適解</span>
              <span className="block text-xs text-emerald mt-0.5">地図・駅・QOLスコア</span>
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs md:text-sm leading-relaxed mt-6 relative">
            130駅のデータに基づき、あなたに最適な立地をAIが特定。妥協なき居住地の特定。
          </p>
        </div>
      </div>

      <style>{`
        .concept-diagram-bg {
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,206,209,0.06) 0%, transparent 50%),
                      linear-gradient(180deg, transparent 0%, rgba(0,31,63,0.02) 100%);
        }
        .concept-stream {
          background: repeating-linear-gradient(
            105deg,
            transparent,
            transparent 20px,
            rgba(0,206,209,0.03) 20px,
            rgba(0,206,209,0.03) 40px
          );
        }
        .concept-ai-icon {
          box-shadow: 0 0 20px rgba(0,206,209,0.3);
        }
      `}</style>
    </section>
  )
}

// =============================================================================
// 解決策セクション：Swappeeの3つの価値 + Before/After 比較
// =============================================================================
function SolutionSection() {
  const solutions = [
    {
      title: 'おとり物件ゼロ。リアルタイムマッチング',
      description:
        'AIが退去予定情報まで監視・取得し、募集前の物件情報をいち早くあなたへ。',
      icon: '✔',
      sub: 'リアルタイム',
    },
    {
      title: 'あなた専用のライフスタイル・レコメンド',
      description:
        '通勤経路、家族全員の動線を学習し、あなたが気づかなかった最適物件をAIが提案。',
      icon: '🤖',
      sub: 'パーソナライズ',
    },
    {
      title: '全てをデジタルで。ストレスフリーな入退去',
      description: 'AIが引越し日程、鍵の受け渡しまでワンストップで最適化。',
      icon: '📱',
      sub: 'デジタル完結',
    },
  ]

  const comparison = [
    { axis: '情報の鮮度', before: '掲載後に自分で検索', after: 'リアルタイム・募集前から' },
    { axis: '探す手間', before: '条件に合わせてスクロール', after: 'AIオートメーション' },
    { axis: '入居手続き', before: '電話・FAX・書類', after: 'ワンストップ・デジタル' },
  ]

  return (
    <section id="solution" className="bg-white py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 概念図の直下に配置 */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-navy text-center mb-4 tracking-wide">
          Swappeeが解決する3つの革命的な価値。
        </h2>
        <p className="text-center text-gray-600 mb-12 md:mb-16">
          Swappeeが、あなたの人生に不動産をフィットさせる。
        </p>

        {/* 解決策カード（青エメラルドをアクセントに） */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {solutions.map((item, i) => (
            <article
              key={i}
              className="rounded-2xl p-6 md:p-8 border-2 border-emerald/20 bg-emerald/5 hover:border-emerald/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-emerald/20 text-emerald flex items-center justify-center text-xl font-bold mb-4">
                {item.icon}
              </div>
              <span className="text-xs font-semibold text-emerald tracking-wider uppercase">{item.sub}</span>
              <h3 className="text-lg font-bold text-navy mt-1 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>

        {/* Before / After 比較（従来型 vs Swappee） */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-navy">
            <div className="p-4 border-b border-r border-gray-200">項目</div>
            <div className="p-4 border-b border-r border-gray-200 text-center">従来（Pull型）</div>
            <div className="p-4 border-b border-gray-200 text-center text-emerald">Swappee（Push型）</div>
          </div>
          {comparison.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-sm">
              <div className="p-4 border-r border-b border-gray-200 font-medium text-navy">{row.axis}</div>
              <div className="p-4 border-r border-b border-gray-200 text-gray-600">{row.before}</div>
              <div className="p-4 border-b border-gray-200 text-emerald font-medium">{row.after}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          AIが、不動産をあなたの人生に同期（Sync）させる。
        </p>
      </div>
    </section>
  )
}

// =============================================================================
// フッター：ロゴ・コピーライト・ソーシャル（ダミー）
// =============================================================================
function Footer() {
  return (
    <footer id="cta" className="bg-navy text-white py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <img
            src={SWAPPEE_LOGO_SRC}
            alt="Swappee"
            className="h-9 md:h-10 w-auto object-contain"
            width={200}
            height={80}
          />
        </div>
        <div className="flex gap-6 text-sm text-white/80">
          <a href="#!" className="hover:text-emerald transition-colors" aria-label="Twitter（ダミー）">
            Twitter
          </a>
          <a href="#!" className="hover:text-emerald transition-colors" aria-label="LINE（ダミー）">
            LINE
          </a>
        </div>
      </div>
      <p className="text-center text-white/60 text-xs mt-8 tracking-wide">
        © {new Date().getFullYear()} Techmaiz. All rights reserved.
      </p>
      {/* LINE先行登録 CTA：ページ最下部に配置 */}
      <div className="mt-10 pt-8 border-t border-white/20">
        <a
          href="#!"
          className="block w-full max-w-sm mx-auto py-4 px-8 bg-emerald text-white font-semibold rounded-full text-center tracking-wide hover:opacity-90 transition-opacity shadow-lg"
        >
          LINEで先行登録する
        </a>
      </div>
    </footer>
  )
}

// =============================================================================
// App：全セクションをモバイルファースト・レスポンシブで構成
// =============================================================================
export default function App() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <ConceptDiagramSection />
      <SolutionSection />
      <Footer />
    </div>
  )
}
