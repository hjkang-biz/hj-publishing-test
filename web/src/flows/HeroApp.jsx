// HeroApp — 앱 시작 플로우 (스플래시 → 로그인 → 홈 + 공지 팝업)
// ------------------------------------------------------------------
// 프로토타입(hite-b2b-home-v2)을 참고한 화면 확인용 플로우.
// 스타일은 전부 styles/_hero.scss 클래스로 처리(인라인 최소화).
// 개발 로직은 화면 전환에 필요한 최소한만 둔다.
import { useState, useEffect, Fragment } from 'react';

// ── 인라인 SVG 아이콘 (색은 currentColor로 클래스에서 상속) ──
function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' };
  const s = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'chevron':
      return <svg {...p}><path {...s} d="M9 5l7 7-7 7" /></svg>;
    case 'chevron-down':
      return <svg {...p}><path {...s} d="M7 10l5 5 5-5" /></svg>;
    case 'search':
      return <svg {...p}><circle {...s} cx="11" cy="11" r="7" /><path {...s} d="M20 20l-3.5-3.5" /></svg>;
    case 'bell':
      return <svg {...p}><path {...s} d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path {...s} d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case 'cart':
      return <svg {...p}><circle {...s} cx="9" cy="21" r="1" /><circle {...s} cx="20" cy="21" r="1" /><path {...s} d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>;
    case 'id':
      return <svg {...p}><rect {...s} x="3" y="4" width="18" height="16" rx="2" /><path {...s} d="M3 9h18M7 14h5" /></svg>;
    case 'lock':
      return <svg {...p}><rect {...s} x="5" y="11" width="14" height="9" rx="2" /><path {...s} d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case 'eye':
      return <svg {...p}><path {...s} d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" /><circle {...s} cx="12" cy="12" r="2.6" /></svg>;
    case 'eye-off':
      return <svg {...p}><path {...s} d="M4 4l16 16M10.5 10.6a2.5 2.5 0 0 0 3.4 3.4M6.5 6.7C4.3 8.1 3 12 3 12s3.5 7 9 7c1.7 0 3.2-.4 4.5-1.1M9.5 5.2A9.5 9.5 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-2.2 3" /></svg>;
    case 'phone':
      return <svg {...p}><path {...s} d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
    case 'x':
      return <svg {...p}><path {...s} d="M18 6L6 18M6 6l12 12" /></svg>;
    case 'ai':
      return <svg {...p}><rect {...s} x="4" y="8" width="16" height="12" rx="4" /><path {...s} d="M9 5h6M12 5v3M9.5 16.5q2.5 1.5 5 0" /><circle cx="9" cy="13" r="1.2" fill="currentColor" /><circle cx="15" cy="13" r="1.2" fill="currentColor" /></svg>;
    case 'home':
      return <svg {...p}><path {...s} d="M3 11l9-7 9 7" /><path {...s} d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" /></svg>;
    case 'box':
      return <svg {...p}><path {...s} d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path {...s} d="M3.3 7L12 12l8.7-5M12 22V12" /></svg>;
    case 'ledger':
      return <svg {...p}><path {...s} d="M7 3h10a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z" /><path {...s} d="M9 8h6M9 12h6" /></svg>;
    case 'truck':
      return <svg {...p}><path {...s} d="M3 6h11v9H3z" /><path {...s} d="M14 9h3.6L21 12v3h-7z" /><circle {...s} cx="6.5" cy="17.5" r="1.6" /><circle {...s} cx="17" cy="17.5" r="1.6" /></svg>;
    case 'user':
      return <svg {...p}><circle {...s} cx="12" cy="8" r="4" /><path {...s} d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case 'contract':
      return <svg {...p}><path {...s} d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path {...s} d="M9 13l2 2 4-4" /></svg>;
    case 'won':
      return <svg {...p}><circle {...s} cx="12" cy="12" r="9" /><path {...s} d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2-5 1.5-5 3.5a2.5 2 0 0 0 5 0" /></svg>;
    case 'grid':
      return <svg {...p}><rect {...s} x="3.5" y="3.5" width="7" height="7" rx="2" /><rect {...s} x="13.5" y="3.5" width="7" height="7" rx="2" /><rect {...s} x="3.5" y="13.5" width="7" height="7" rx="2" /><rect {...s} x="13.5" y="13.5" width="7" height="7" rx="2" /></svg>;
    case 'soju':
      return <svg {...p}><path {...s} d="M10 3h4M10.5 3v3.2L9 9.5a3 3 0 0 0-.4 1.6V19a2 2 0 0 0 2 2h1.8a2 2 0 0 0 2-2v-7.9a3 3 0 0 0-.4-1.6L15.5 6.2V3M8.8 12.6h6.4" /></svg>;
    case 'beer':
      return <svg {...p}><path {...s} d="M6 8h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" /><path {...s} d="M15 10h2.4a2.5 2.5 0 0 1 0 5H15M7.5 8c0-2 1.3-3 2.5-3M11 8c0-2 1-3 2.3-3" /></svg>;
    case 'wine':
      return <svg {...p}><path {...s} d="M8 3h8M8.7 3v4.5c0 2 .8 3 .8 5V20a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7.5c0-2 .8-3 .8-5V3M9.5 11h5" /></svg>;
    case 'whisky':
      return <svg {...p}><path {...s} d="M7 5.5h10l-1.1 13a1 1 0 0 1-1 .9H9.1a1 1 0 0 1-1-.9z" /><path {...s} d="M7.7 11h8.6" /></svg>;
    case 'speaker':
      return <svg {...p}><path {...s} d="M4 9v6h3l8 4V5L7 9H4Z" /><path {...s} d="M18 9a4 4 0 0 1 0 6" /></svg>;
    default:
      return null;
  }
}

// ── 1. 스플래시 ────────────────────────────────────────────
function HeroSplash({ onDone }) {
  return (
    <button type="button" className="hero-splash" onClick={onDone} aria-label="시작">
      <span className="hero-splash__emblem">
        <span className="hero-splash__logo">HERO</span>
      </span>
      <div className="hero-splash__wordmark">히어로</div>
      <div className="hero-splash__rule">
        <span /> B2B ORDER PLATFORM <span />
      </div>
      <div className="hero-splash__tagline">사장님 매장을 위한 똑똑한 주류 주문</div>
      <div className="hero-splash__dots"><span /><span /><span /></div>
      <div className="hero-splash__version">v2.0.0 · 비즈데이터</div>
    </button>
  );
}

// ── 2. 로그인 ──────────────────────────────────────────────
function HeroLogin({ onLogin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);

  return (
    <div className="hero-login">
      <div className="hero-login__band">
        <div className="hero-login__top">
          <span className="hero-login__brand">HERO</span>
          <span className="hero-login__cs"><Icon name="phone" size={13} /> 고객센터</span>
        </div>
        <div className="hero-login__welcome">사장님,<br />환영합니다</div>
        <div className="hero-login__welcome-sub">로그인하고 오늘 매장 주문을 시작하세요</div>
      </div>

      <form className="hero-login__card" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div className="hero-login__handle" />
        <div className="hero-login__title">로그인</div>

        <div className="hero-login__fields">
          <label className="hero-field">
            <span className="hero-field__icon"><Icon name="id" size={19} /></span>
            <input
              className="hero-field__input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="휴대전화번호 또는 이메일주소"
              autoComplete="off"
            />
          </label>
          <label className="hero-field">
            <span className="hero-field__icon"><Icon name="lock" size={19} /></span>
            <input
              className="hero-field__input"
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
              autoComplete="off"
            />
            <button type="button" className="hero-field__toggle" onClick={() => setShowPw((v) => !v)} aria-label="비밀번호 표시">
              <Icon name={showPw ? 'eye' : 'eye-off'} size={20} />
            </button>
          </label>
        </div>

        <div className="hero-login__options">
          <span
            className={'hero-check' + (autoLogin ? ' is-on' : '')}
            onClick={() => setAutoLogin((v) => !v)}
          >
            <span className="hero-check__box">{autoLogin && '✓'}</span>
            자동 로그인
          </span>
          <span className="hero-login__link">비밀번호 찾기 ›</span>
        </div>

        <button type="submit" className="hero-btn hero-btn--primary">로그인</button>

        <div className="hero-login__divider">또는</div>

        <button type="button" className="hero-btn hero-btn--outline">신규 회원가입</button>

        <div className="hero-login__foot">
          <span>입력 정보는 암호화되어 안전하게 보호됩니다</span>
        </div>
      </form>
    </div>
  );
}

// ── 홈 데이터 (정적 · 화면 확인용) ──────────────────────────
const CATEGORIES = [
  { key: '전체', icon: 'grid' },
  { key: '소주', icon: 'soju' },
  { key: '맥주', icon: 'beer' },
  { key: '수입맥주', icon: 'beer' },
  { key: '전통주', icon: 'soju' },
  { key: '위스키', icon: 'whisky' },
  { key: '와인', icon: 'wine' },
  { key: '무알콜', icon: 'wine' },
];
const ORDERS = [
  { id: '#H260702-1183', date: '07/02 09:12', sum: '진로이즈백 외 2종 · 13박스', label: '주문 요청', tone: 'blue', step: 0 },
  { id: '#H260701-1170', date: '07/01 11:05', sum: '카스 후레쉬 외 1종 · 6박스', label: '주문 확정', tone: 'amber', step: 1 },
  { id: '#H260630-1155', date: '06/30 09:42', sum: '테라·켈리 묶음 · 8박스', label: '배송 완료', tone: 'green', step: 2 },
];
const SHORTCUTS = [
  { label: '주문내역', icon: 'ledger' },
  { label: '배송내역', icon: 'truck' },
  { label: '전자근로계약', icon: 'contract' },
  { label: '지원사업', icon: 'won' },
];
const TABS = [
  { key: 'home', label: '홈', icon: 'home', on: true },
  { key: 'product', label: '상품', icon: 'box' },
  { key: 'ledger', label: '주문내역', icon: 'ledger' },
  { key: 'delivery', label: '배송내역', icon: 'truck' },
  { key: 'my', label: '마이', icon: 'user' },
];
const IMPORTANT_NOTICES = [
  { tag: '계약', tone: 'blue', title: '2026년 거래 기본계약 서명 요청 · D-7' },
  { tag: '정산', tone: 'amber', title: '6월 정산 마감 — 미지급금 6/30 자동 출금' },
  { tag: '배송', tone: 'amber', title: '폭염 대비 — 냉장 품목 오전 배송 우선' },
];

// ── 3. 홈 ──────────────────────────────────────────────────
function HeroHome() {
  const [noticeOpen, setNoticeOpen] = useState(true);

  return (
    <div className="hero-home">
      {/* 그린 브랜드 헤더 */}
      <header className="hero-home__header">
        <div className="hero-home__header-row">
          <button type="button" className="hero-home__store">
            <span className="hero-home__whol">세계주류 <Icon name="chevron-down" size={16} /></span>
            <span className="hero-home__store-tag">매장 · 강남양꼬치 본점</span>
          </button>
          <button type="button" className="hero-home__icon-btn" aria-label="통합검색"><Icon name="search" /></button>
          <button type="button" className="hero-home__icon-btn" aria-label="알림"><Icon name="bell" /></button>
          <button type="button" className="hero-home__icon-btn" aria-label="장바구니">
            <Icon name="cart" />
            <span className="hero-home__badge">4</span>
          </button>
        </div>
      </header>

      {/* 본문 */}
      <div className="hero-home__body">
        {/* 롤링 한줄 공지 */}
        <button type="button" className="hero-notice-bar">
          <span className="hero-notice-bar__tag">공지</span>
          <span className="hero-notice-bar__text">6월 정산 마감 — 미지급금 6/30 자동 출금</span>
          <span className="hero-notice-bar__chevron"><Icon name="chevron" size={15} /></span>
        </button>

        {/* 프로모 배너 */}
        <button type="button" className="hero-banner">
          <span className="hero-banner__tag">거래 안내 · D-7</span>
          <div className="hero-banner__title">2026년 거래 기본계약 서명이 필요해요</div>
          <span className="hero-banner__sub">전자근로계약에서 바로 서명 <Icon name="chevron" size={13} /></span>
        </button>

        {/* AI 주문 도우미 */}
        <div className="hero-sect">
          <span className="hero-sect__bar" />
          <span className="hero-sect__title">빠른 주문</span>
          <span className="hero-sect__hint">카테고리별 주문</span>
        </div>
        <button type="button" className="hero-ai">
          <span className="hero-ai__icon"><Icon name="ai" size={17} /></span>
          <span className="hero-ai__title">AI 주문 도우미</span>
          <span className="hero-ai__sub">텍스트·음성으로 빠르게</span>
          <span className="hero-ai__chevron"><Icon name="chevron" size={16} /></span>
        </button>

        {/* 카테고리 그리드 */}
        <div className="hero-grid-4">
          {CATEGORIES.map((c) => (
            <button type="button" key={c.key} className="hero-card hero-cat">
              <span className="hero-cat__icon"><Icon name={c.icon} size={22} /></span>
              <span className="hero-cat__label">{c.key}</span>
            </button>
          ))}
        </div>

        {/* 주문 현황 */}
        <div className="hero-sect">
          <span className="hero-sect__bar" />
          <span className="hero-sect__title">주문 현황</span>
          <span className="hero-sect__hint">상태 추적</span>
          <span className="hero-sect__more">전체 ›</span>
        </div>
        <div className="hero-card hero-orders">
          {ORDERS.map((o) => (
            <button type="button" key={o.id} className="hero-order">
              <div className="hero-order__top">
                <span className="hero-order__id">{o.id}</span>
                <span className={`hero-order__status hero-order__status--${o.tone}`}>{o.label}</span>
                <span className="hero-order__date">{o.date}</span>
              </div>
              <div className="hero-order__sum">{o.sum}</div>
              <div className="hero-progress">
                {[0, 1, 2].map((si) => (
                  <Fragment key={si}>
                    <span className={'hero-progress__dot' + (si <= o.step ? ' is-done' : '')} />
                    {si < 2 && <span className={'hero-progress__seg' + (si < o.step ? ' is-done' : '')} />}
                  </Fragment>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* 업무 바로가기 */}
        <div className="hero-sect">
          <span className="hero-sect__bar" />
          <span className="hero-sect__title">업무 바로가기</span>
        </div>
        <div className="hero-grid-4">
          {SHORTCUTS.map((s) => (
            <button type="button" key={s.label} className="hero-card hero-shortcut">
              <span className="hero-shortcut__icon"><Icon name={s.icon} size={19} /></span>
              <span className="hero-shortcut__label">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="hero-home__warn">
          경고 : 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다.
        </div>
      </div>

      {/* 하단 탭바 */}
      <nav className="hero-home__tabbar">
        {TABS.map((t) => (
          <button type="button" key={t.key} className={'hero-tab' + (t.on ? ' is-on' : '')} aria-label={t.label}>
            {t.on && <span className="hero-tab__mark" />}
            <Icon name={t.icon} size={22} />
            <span className="hero-tab__label">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* 중요 공지 팝업 */}
      {noticeOpen && (
        <div className="hero-modal" onClick={() => setNoticeOpen(false)}>
          <div className="hero-modal__panel" onClick={(e) => e.stopPropagation()}>
            <div className="hero-modal__head">
              <Icon name="speaker" size={19} />
              <span className="hero-modal__title">중요 공지 <em>{IMPORTANT_NOTICES.length}</em></span>
              <button type="button" className="hero-modal__close" onClick={() => setNoticeOpen(false)} aria-label="닫기">
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="hero-modal__list">
              {IMPORTANT_NOTICES.map((n) => (
                <button type="button" key={n.title} className="hero-notice-item" onClick={() => setNoticeOpen(false)}>
                  <span className={`hero-notice-item__tag hero-notice-item__tag--${n.tone}`}>{n.tag}</span>
                  <span className="hero-notice-item__text">{n.title}</span>
                  <span className="hero-notice-item__chevron"><Icon name="chevron" size={16} /></span>
                </button>
              ))}
            </div>
            <div className="hero-modal__foot">
              <button type="button" onClick={() => setNoticeOpen(false)}>오늘 하루 그만 보기</button>
              <button type="button" onClick={() => setNoticeOpen(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 플로우 컨트롤러 ────────────────────────────────────────
export function HeroAppFlow() {
  const [screen, setScreen] = useState('splash'); // splash | login | home

  // 스플래시 자동 진행 (2.2초) — 탭하면 즉시 넘어감
  useEffect(() => {
    if (screen !== 'splash') return;
    const t = setTimeout(() => setScreen('login'), 2200);
    return () => clearTimeout(t);
  }, [screen]);

  return (
    <div className="hero-flow">
      {screen === 'splash' && <HeroSplash onDone={() => setScreen('login')} />}
      {screen === 'login' && <HeroLogin onLogin={() => setScreen('home')} />}
      {screen === 'home' && <HeroHome />}
    </div>
  );
}
