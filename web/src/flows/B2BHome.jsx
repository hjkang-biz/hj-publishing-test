// Flow 4 — B2B 홈 (디자인 핸드오프 `app-home-test` 의 모바일 홈 화면)
//
// 디자인의 카테고리 탭 / 브랜드 스와이프 / 최근주문 묶음 카드 / 즐겨찾기 / 추천
// / 빠른 발주 / 마감 카운트다운 / 외상 잔액 카드 / 장바구니 미니바 를 한 화면에
// 모은 통합 홈. 디자인은 하이트진로 그린을 메인으로 썼지만, 이 프로젝트는 기존
// 브랜드(오렌지)를 유지하기로 했기 때문에 primary accent 만 오렌지로 교체했다.
// 컨텍스트 컬러(red/amber/blue/제품 일러스트)는 디자인 의도를 그대로 따른다.

import { useEffect, useMemo, useRef, useState } from 'react';
import { BANNERS, BRANDS, CATALOG, CATEGORIES, RECENT_ORDERS, getOrderProduct } from '../data/b2bHome.js';

// ─── 인라인 토큰 ──────────────────────────────────────────
// 디자인 css 의 일부 토큰은 우리 SCSS 토큰과 매핑이 어렵거나, 이 화면에서만
// 필요한 nuance(라이트 라인, 카드 그림자) 가 있어서 컴포넌트 안에서만 쓴다.
const LINE2 = '#EFF1F5';
const BG_PAGE = '#F7F8FA';
const SHADOW_CARD = '0 1px 2px rgba(15,17,21,0.04), 0 4px 14px rgba(15,17,21,0.05)';
const SHADOW_POP = '0 8px 24px rgba(15,17,21,0.18)';
const RED = '#E5432B';
const AMBER = '#B45309';
const BRAND = 'var(--brand)';
const BRAND_STRONG = 'var(--brand-strong)';
const BRAND_SOFT = 'var(--brand-soft)';
const BRAND_TINT = 'var(--brand-tint)';

// ─── 아이콘 ───────────────────────────────────────────────
// design 의 components.jsx Icon 집합을 발췌. Lucide 풍 stroke, currentColor 기본.
const Icon = {
  clipboard: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" fill={c} stroke="none" />
      <path d="M9 11l2 2 4-4" />
    </svg>
  ),
  cart: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2.5l2 12.5h11l2-9H7" />
      <circle cx="9" cy="20" r="1.4" fill={c} stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill={c} stroke="none" />
    </svg>
  ),
  bell: (s = 22, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  ),
  search: (s = 20, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  ),
  chevron: (dir = 'down', s = 16, c = 'currentColor') => {
    const r = { down: 'rotate(0)', up: 'rotate(180)', right: 'rotate(-90)', left: 'rotate(90)' }[dir];
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" style={{ transform: r }} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  },
  heart: (filled = false, s = 20, c = RED) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={filled ? c : '#8A93A0'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-7-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  ),
  grid: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  ),
  list: (s = 18, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  plus: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  minus: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  ),
  cartSmall: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2.5l2 12.5h11l2-9H7" />
      <circle cx="9" cy="20" r="1.4" fill={c} stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill={c} stroke="none" />
    </svg>
  ),
  refresh: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  chart: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M6 17V11" />
      <path d="M11 17V7" />
      <path d="M16 17V14" />
      <path d="M21 17V9" />
    </svg>
  ),
  trendUp: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17L9 11L13 15L21 7" />
      <path d="M14 7h7v7" />
    </svg>
  ),
  clock: (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  bolt: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none">
      <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" />
    </svg>
  ),
  wallet: (s = 14, c = 'currentColor') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1.5" fill={c} stroke="none" />
    </svg>
  ),
  // tab bar — active 시 fill, 아니면 stroke
  home: (active, s = 24) =>
    active ? (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={BRAND}>
        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
      </svg>
    ) : (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#8A93A0" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
      </svg>
    ),
  order: (active, s = 24) => {
    const c = active ? BRAND : '#8A93A0';
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="12" height="17" rx="2" />
        <path d="M9 9h6M9 13h6M9 17h4" />
      </svg>
    );
  },
  bottleNav: (active, s = 24) => {
    const c = active ? BRAND : '#8A93A0';
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M10 2h4v3h-4z" fill={c} />
        <path d="M10 5v3l-2 2v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V10l-2-2V5" />
      </svg>
    );
  },
  gift: (active, s = 24) => {
    const c = active ? BRAND : '#8A93A0';
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="1.5" />
        <path d="M3 12h18M12 8v12" />
        <path d="M8.5 8C6.5 8 6 5 8 5s4 3 4 3M15.5 8C17.5 8 18 5 16 5s-4 3-4 3" />
      </svg>
    );
  },
  user: (active, s = 24) => {
    const c = active ? BRAND : '#8A93A0';
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="1.8">
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M4.5 20c1-3.5 4.2-5.5 7.5-5.5s6.5 2 7.5 5.5" />
      </svg>
    );
  },
};

// ─── Bottle / Can 일러스트 ────────────────────────────────
// 디자인의 products.jsx 일러스트를 그대로 옮긴 것. variant 별로 cap/body/label 색 매핑.
function Bottle({ kind = 'soju-green', size = 80 }) {
  const variants = {
    'soju-green':  { top: '#1B9050', body: '#0F7A3D', deep: '#053D1F', cap: '#053D1F', label: '#FFFFFF', labelText: '#E5432B', text: '참이슬' },
    'soju-clear':  { top: '#EDF3FA', body: '#C7D6E8', deep: '#8FA3BC', cap: '#1F6FEB', label: '#1F6FEB', labelText: '#FFFFFF', text: '진로' },
    'beer-brown':  { top: '#8A4F2E', body: '#5C3220', deep: '#321B0E', cap: '#FFD24A', label: '#E5432B', labelText: '#FFFFFF', text: 'TERRA' },
    'beer-amber':  { top: '#E89B3F', body: '#B5701F', deep: '#6E4310', cap: '#0F1115', label: '#0F1115', labelText: '#FFD24A', text: 'KELLY' },
    'whisky':      { top: '#C77B3D', body: '#9C5722', deep: '#5A2F0E', cap: '#0F1115', label: '#0F1115', labelText: '#E2B968', text: 'WHISKY' },
    'wine':        { top: '#7A1A30', body: '#4D0B1B', deep: '#28050D', cap: '#D4AF6A', label: '#E8DCC4', labelText: '#5A1023', text: 'WINE' },
    'cheongha':    { top: '#C2D6E8', body: '#8FAFC8', deep: '#5A7A95', cap: '#1E5B33', label: '#1E5B33', labelText: '#FFFFFF', text: '淸河' },
    'maehwasoo':   { top: '#F2B6C2', body: '#D87E92', deep: '#8E4458', cap: '#3F8A4A', label: '#FFFFFF', labelText: '#B96978', text: '매화수' },
  };
  const v = variants[kind] || variants['soju-green'];
  const gid = `bot-${kind}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={v.top} />
          <stop offset="40%" stopColor={v.body} />
          <stop offset="100%" stopColor={v.deep} />
        </linearGradient>
        <linearGradient id={`${gid}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="65%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id={`${gid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(15,17,21,0.32)" />
          <stop offset="100%" stopColor="rgba(15,17,21,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="93" rx="24" ry="3.5" fill={`url(#${gid}-shadow)`} />
      <rect x="42" y="7" width="16" height="10" rx="1.8" fill={v.cap} />
      <rect x="42" y="10" width="16" height="1" fill="rgba(255,255,255,0.18)" />
      <rect x="42" y="14" width="16" height="1" fill="rgba(0,0,0,0.18)" />
      <path d="M44 17 L56 17 L56 30 Q56 33 53 33 L47 33 Q44 33 44 30 Z" fill={`url(#${gid}-body)`} />
      <path d="M46 32 Q46 34 44 38 Q40 42 38 44 L62 44 Q60 42 56 38 Q54 34 54 32 Z" fill={`url(#${gid}-body)`} />
      <rect x="32" y="42" width="36" height="48" rx="4" fill={`url(#${gid}-body)`} />
      <rect x="32" y="42" width="36" height="48" rx="4" fill={`url(#${gid}-shine)`} />
      <rect x="32.5" y="56" width="35" height="22" fill={v.label} rx="0.5" />
      <rect x="32.5" y="56" width="35" height="2" fill="rgba(0,0,0,0.06)" />
      <text x="50" y="71" textAnchor="middle" fontFamily="Pretendard,system-ui" fontWeight="800" fontSize="8" fill={v.labelText} style={{ letterSpacing: v.text.length > 4 ? '-0.3px' : '0' }}>
        {v.text}
      </text>
      <rect x="32" y="86" width="36" height="4" rx="2" fill="rgba(0,0,0,0.18)" />
    </svg>
  );
}

function Can({ kind = 'cass', size = 80 }) {
  const variants = {
    cass:  { top: '#3D8AFF', body: '#1F6FEB', deep: '#0F3F8A', rim: '#0F3F8A', accent: '#FFFFFF', text: 'CASS' },
    hite:  { top: '#FF6242', body: '#E5432B', deep: '#7A1F12', rim: '#7A1F12', accent: '#FFFFFF', text: 'HITE' },
    kelly: { top: '#E0973F', body: '#C97A2B', deep: '#6E4218', rim: '#5A3614', accent: '#0F1115', text: 'KELLY' },
    terra: { top: '#2F7D48', body: '#1E5B33', deep: '#0B2D17', rim: '#0B2D17', accent: '#FFFFFF', text: 'TERRA' },
  };
  const v = variants[kind] || variants['cass'];
  const gid = `can-${kind}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={v.top} />
          <stop offset="50%" stopColor={v.body} />
          <stop offset="100%" stopColor={v.deep} />
        </linearGradient>
        <linearGradient id={`${gid}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="25%" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          <stop offset="80%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
        <radialGradient id={`${gid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(15,17,21,0.32)" />
          <stop offset="100%" stopColor="rgba(15,17,21,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="93" rx="22" ry="3.5" fill={`url(#${gid}-shadow)`} />
      <ellipse cx="50" cy="14" rx="18" ry="4" fill={v.rim} />
      <ellipse cx="50" cy="13" rx="14" ry="2.5" fill="rgba(255,255,255,0.35)" />
      <rect x="32" y="14" width="36" height="4" fill={v.rim} />
      <rect x="32" y="18" width="36" height="70" fill={`url(#${gid}-body)`} rx="0.5" />
      <rect x="32" y="18" width="36" height="70" fill={`url(#${gid}-shine)`} rx="0.5" />
      <ellipse cx="50" cy="88" rx="18" ry="2.5" fill="rgba(0,0,0,0.32)" />
      <rect x="32" y="42" width="36" height="16" fill={v.rim} opacity="0.85" />
      <rect x="32" y="42" width="36" height="0.8" fill="rgba(255,255,255,0.4)" />
      <text x="50" y="54" textAnchor="middle" fontFamily="Pretendard,system-ui" fontWeight="900" fontSize="9.5" fill={v.accent} style={{ letterSpacing: '0.5px' }}>
        {v.text}
      </text>
    </svg>
  );
}

function ProductImage({ kind, size = 88, tint = '#F2F4F7' }) {
  const isCan = kind.startsWith('can:');
  const cleanKind = isCan ? kind.slice(4) : kind;
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: 14,
        background: `radial-gradient(circle at 50% 30%, #ffffff 0%, ${tint} 60%, ${tint} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(15,17,21,0.04)',
      }}
    >
      {isCan ? <Can kind={cleanKind} size={size} /> : <Bottle kind={cleanKind} size={size} />}
    </div>
  );
}

function ProductImageFixed({ kind, size = 72, tint = '#F2F4F7' }) {
  const isCan = kind.startsWith('can:');
  const cleanKind = isCan ? kind.slice(4) : kind;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 11,
        background: `radial-gradient(circle at 50% 30%, #ffffff 0%, ${tint} 70%, ${tint} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      {isCan ? <Can kind={cleanKind} size={size - 14} /> : <Bottle kind={cleanKind} size={size - 12} />}
    </div>
  );
}

// ─── 마우스 드래그 스크롤 hook ────────────────────────────
// 가로 스크롤러에서 데스크탑 마우스로도 swipe 가능하게.
function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let moved = false;

    const onDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };
    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 5) moved = true;
      el.scrollLeft = scrollStart - dx;
    };
    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    };
    // 드래그 후 click 이 자식 버튼에 발사되지 않도록 캡쳐 단계에서 무력화.
    const onClickCapture = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('click', onClickCapture, true);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);
  return ref;
}

// ─── 상단 헤더 ────────────────────────────────────────────
function Header({ cartCount, onCart }) {
  return (
    <div style={{ padding: '8px 14px 12px', display: 'flex', alignItems: 'center', gap: 6, background: '#fff' }}>
      <div style={{ display: 'flex', gap: 5, flex: 1, minWidth: 0, alignItems: 'center' }}>
        <WholesalerLogo name="세계주류" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, flex: 1, padding: '6px 4px' }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: BRAND_SOFT,
              color: BRAND_STRONG,
              padding: '2px 6px',
              borderRadius: 4,
              flexShrink: 0,
              letterSpacing: '-0.01em',
            }}
          >
            거래처
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.02em' }}>
            강남양꼬치 본점
          </span>
        </div>
      </div>
      <HeaderIconBtn label="배송현황">{Icon.clipboard(20, '#2A2F36')}</HeaderIconBtn>
      <HeaderIconBtn label="장바구니" badge={cartCount} onClick={onCart}>
        {Icon.cart(20, '#2A2F36')}
      </HeaderIconBtn>
      <HeaderIconBtn label="알림" badge={2}>
        {Icon.bell(20, '#2A2F36')}
      </HeaderIconBtn>
    </div>
  );
}

function HeaderIconBtn({ children, label, badge, onClick }) {
  return (
    <button onClick={onClick} aria-label={label} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
        {badge ? (
          <span
            style={{
              position: 'absolute',
              top: -5,
              right: -7,
              minWidth: 15,
              height: 15,
              padding: '0 3px',
              background: RED,
              color: '#fff',
              borderRadius: 9999,
              fontSize: 9.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #fff',
            }}
          >
            {badge}
          </span>
        ) : null}
      </div>
    </button>
  );
}

// 도매상 로고 — 파란 구 + 흰 S + 빨간 한글 워드마크
function WholesalerLogo({ name = '세계주류' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px 4px 5px', borderRadius: 10, background: '#fff', border: `1px solid ${LINE2}`, flexShrink: 0 }}>
      <svg width="26" height="26" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        <defs>
          <radialGradient id="sphG" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#7FB3FF" />
            <stop offset="55%" stopColor="#1F6FEB" />
            <stop offset="100%" stopColor="#0F3F8A" />
          </radialGradient>
          <radialGradient id="sphHi" cx="34%" cy="26%" r="22%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="14" fill="url(#sphG)" />
        <circle cx="16" cy="16" r="14" fill="url(#sphHi)" />
        <path
          d="M22.5 11.5c-1.5-1.6-3.8-2-5.6-1.3-1.7.6-2.5 2.3-1.8 3.8.6 1.2 2.2 1.5 4 1.8 1.9.3 4 .7 4.7 2.4.9 2-.3 4.2-2.7 5.1-2.4.9-5.5.2-7.2-1.7"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 900, color: '#C42929', letterSpacing: '-0.04em', fontFamily: 'Pretendard, system-ui', whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

// ─── 상단 배너 캐러셀 ──────────────────────────────────────
function Banner() {
  const [i, setI] = useState(0);
  const trackRef = useRef(null);
  const drag = useRef({ x: 0, dx: 0, dragging: false });

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (trackRef.current) trackRef.current.style.transform = `translateX(${-i * 100}%)`;
  }, [i]);

  const onStart = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current = { x, dx: 0, dragging: true };
  };
  const onMove = (e) => {
    if (!drag.current.dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current.dx = x - drag.current.x;
    if (trackRef.current) trackRef.current.style.transform = `translateX(calc(${-i * 100}% + ${drag.current.dx}px))`;
  };
  const onEnd = () => {
    if (!drag.current.dragging) return;
    const dx = drag.current.dx;
    drag.current.dragging = false;
    if (dx < -40 && i < BANNERS.length - 1) setI(i + 1);
    else if (dx > 40 && i > 0) setI(i - 1);
    else if (trackRef.current) trackRef.current.style.transform = `translateX(${-i * 100}%)`;
  };

  return (
    <div style={{ padding: '4px 16px 0', background: '#fff' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 18,
          overflow: 'hidden',
          height: 140,
          boxShadow: '0 6px 20px rgba(15,17,21,0.08), 0 1px 3px rgba(15,17,21,0.04)',
        }}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        <div ref={trackRef} style={{ display: 'flex', height: '100%', transition: 'transform .35s cubic-bezier(.2,.7,.2,1)' }}>
          {BANNERS.map((b) => (
            <div key={b.id} style={{ minWidth: '100%', height: '100%', background: b.bg, color: b.fg, padding: '20px 20px', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: b.fg === '#0F1115' ? 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5), transparent 50%)' : 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 55%)',
                }}
              />
              <div style={{ flex: 1, zIndex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '.06em',
                    background: b.fg === '#0F1115' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.22)',
                    color: b.fg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 9px',
                    borderRadius: 9999,
                    marginBottom: 10,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 9999, background: b.accent }} />
                  EVENT
                </div>
                <div style={{ fontSize: 19, fontWeight: 900, lineHeight: 1.22, whiteSpace: 'pre-line', letterSpacing: '-0.03em', textShadow: b.fg === '#fff' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none' }}>
                  {b.title}
                </div>
                <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 7, fontWeight: 500, letterSpacing: '-0.01em' }}>{b.sub}</div>
              </div>
              <div style={{ position: 'absolute', right: -8, bottom: -18, opacity: 0.96, transform: 'rotate(-8deg)', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))' }}>
                <Bottle kind={b.kind} size={130} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '10px 0 6px' }}>
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            style={{
              width: idx === i ? 20 : 6,
              height: 6,
              borderRadius: 9999,
              background: idx === i ? BRAND : 'var(--fg-dim)',
              transition: 'all .25s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 검색바 ────────────────────────────────────────────────
function SearchBar() {
  return (
    <div style={{ padding: '4px 16px 10px', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 14px', borderRadius: 12, background: '#F2F4F7' }}>
        {Icon.search(20, '#8A93A0')}
        <input
          placeholder="상품명, 브랜드, 카테고리로 검색하세요"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, fontWeight: 500, color: 'var(--fg-strong)' }}
        />
      </div>
    </div>
  );
}

// ─── 마감 카운트다운 바 ────────────────────────────────────
function nextDeadline(timeStr = '14:00') {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d.getTime();
}
const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

function DeadlineBar({ deadlineTime = '14:00' }) {
  const [now, setNow] = useState(Date.now());
  const [open, setOpen] = useState(false);
  const target = useMemo(() => nextDeadline(deadlineTime), [deadlineTime]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target - now);
  const hours = diff / 3600000;
  const mins = (diff % 3600000) / 60000;
  const secs = (diff % 60000) / 1000;

  // 30분 / 2시간 / 그 이상 — 긴급도에 따라 팔레트 변경. 기본은 브랜드 컬러.
  const palette =
    diff < 30 * 60000
      ? { bg: '#FEEAE5', border: '#FBD0C8', fg: '#9A1F1F', accent: RED }
      : diff < 2 * 3600000
      ? { bg: '#FFF7E6', border: '#FCE4B5', fg: '#7A4A0E', accent: AMBER }
      : { bg: BRAND_SOFT, border: BRAND_TINT, fg: BRAND_STRONG, accent: BRAND };

  return (
    <div style={{ padding: '0 16px 12px', background: '#fff' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: palette.bg, border: `1px solid ${palette.border}`, textAlign: 'left' }}
      >
        <span style={{ color: palette.accent, display: 'flex' }}>{Icon.clock(16, palette.accent)}</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: palette.fg }}>오늘 {deadlineTime} 주문 마감</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: palette.accent, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {pad2(hours)}:{pad2(mins)}:{pad2(secs)} 남음
          </span>
        </div>
        <span style={{ color: palette.accent, display: 'flex' }}>{Icon.chevron(open ? 'up' : 'down', 16, palette.accent)}</span>
      </button>
      {open && (
        <div style={{ marginTop: 6, padding: '12px 14px', borderRadius: 10, background: '#FAFBFC', border: `1px solid ${LINE2}`, fontSize: 12.5, lineHeight: 1.65, color: 'var(--fg-neutral)' }}>
          • <b>오늘 {deadlineTime}까지</b> 주문 시 내일 오전 출고
          <br />
          • 마감 이후 주문은 모레 영업일 출고
          <br />
          • 어린이날(5/5)·부처님오신날(5/15)은 1일 전 18시 마감
        </div>
      )}
    </div>
  );
}

// ─── 빠른 발주 (Top SKU 1-tap) ─────────────────────────────
function QuickReorderItem({ item, onAdd }) {
  const [qty, setQty] = useState(item.defaultQty || 1);
  const p = getOrderProduct(item.pid);
  if (!p) return null;
  const short = p.name.split(' (')[0];
  return (
    <div style={{ flexShrink: 0, width: 178, padding: '8px 10px 10px', borderRadius: 10, border: `1.5px solid ${BRAND}`, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9999, background: p.tint || '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          {p.kind.startsWith('can:') ? <Can kind={p.kind.slice(4)} size={22} /> : <Bottle kind={p.kind} size={26} />}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {short}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Stepper qty={qty} onChange={setQty} size="sm" />
        <button
          onClick={() => onAdd && onAdd(p, qty)}
          style={{
            flex: 1,
            height: 26,
            borderRadius: 6,
            background: BRAND,
            color: '#fff',
            fontWeight: 700,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          {Icon.cartSmall(11, '#fff')} 담기
        </button>
      </div>
    </div>
  );
}

function QuickReorder({ items = [], onQuickAdd }) {
  if (!items.length) return null;
  return (
    <div style={{ padding: '0 16px 12px', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <span style={{ color: BRAND, display: 'flex' }}>{Icon.bolt(13, 'currentColor')}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: BRAND_STRONG, letterSpacing: '-0.01em' }}>빠른 발주</span>
        <span style={{ fontSize: 11, color: 'var(--fg-assist)', fontWeight: 500 }}>· 평소 시키는 수량</span>
      </div>
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {items.map((it) => (
          <QuickReorderItem key={it.pid} item={it} onAdd={onQuickAdd} />
        ))}
        <div style={{ width: 4, flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ─── 카테고리 탭 + 브랜드 스와이프 ────────────────────────
function CategoryTabs({ active, onChange }) {
  const dragRef = useDragScroll();
  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${LINE2}` }}>
      <div ref={dragRef} className="no-scrollbar" style={{ display: 'flex', gap: 0, padding: '0 8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {CATEGORIES.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              style={{
                padding: '12px 12px',
                position: 'relative',
                whiteSpace: 'nowrap',
                fontSize: 14.5,
                fontWeight: on ? 800 : 500,
                color: on ? 'var(--fg-strong)' : 'var(--fg-alt)',
              }}
            >
              {c}
              {on && <span style={{ position: 'absolute', left: 8, right: 8, bottom: 0, height: 2.5, background: BRAND, borderRadius: 2 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BrandScroller({ category }) {
  const brands = BRANDS[category] || BRANDS['맥주'];
  const dragRef = useDragScroll();
  return (
    <div style={{ padding: '12px 0 16px', background: '#fff' }}>
      <div ref={dragRef} className="no-scrollbar" style={{ display: 'flex', gap: 10, padding: '0 16px 4px', overflowX: 'auto', scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch' }}>
        {brands.map(([label, kind]) => (
          <button key={label} className="press" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, width: 74, scrollSnapAlign: 'start' }}>
            <BrandLogoTile kind={kind} size={74} />
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-neutral)', textAlign: 'center', lineHeight: 1.25, maxWidth: 74, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </div>
          </button>
        ))}
        <div style={{ width: 4, flexShrink: 0 }} />
      </div>
    </div>
  );
}

function BrandLogoTile({ kind, size = 74 }) {
  const isCan = kind.startsWith('can:');
  const cleanKind = isCan ? kind.slice(4) : kind;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #F2F4F7 70%, #F2F4F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${LINE2}`,
      }}
    >
      {isCan ? <Can kind={cleanKind} size={size - 18} /> : <Bottle kind={cleanKind} size={size - 14} />}
    </div>
  );
}

// ─── 섹션 헤더 / Spec / Stock / Tag / Stepper / Toggle ───
function SectionHeader({ title, count, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 16px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</h3>
        {count != null && <span style={{ fontSize: 13, color: 'var(--fg-assist)', fontWeight: 600 }}>{count}</span>}
      </div>
      {right}
    </div>
  );
}

function SpecChip({ children, size = 'md' }) {
  const isSm = size === 'sm';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSm ? '3px 9px' : '4px 10px',
        borderRadius: 9999,
        background: BRAND_SOFT,
        border: `1px solid ${BRAND}`,
        color: BRAND_STRONG,
        fontSize: isSm ? 11 : 11.5,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function StockChip({ stock }) {
  const map = {
    in: { c: '#005C2E', t: '재고 있음', d: '#007A3D' },
    low: { c: AMBER, t: '재고 부족', d: '#D68A11' },
    out: { c: '#9A1F1F', t: '품절', d: RED },
  };
  const v = map[stock] || map.in;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: v.c }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: v.d }} />
      {v.t}
    </span>
  );
}

function Tag({ children, kind = 'best' }) {
  const map = {
    best: { bg: BRAND_STRONG, c: '#fff' },
    rec: { bg: BRAND_SOFT, c: BRAND_STRONG },
    new: { bg: '#FFEFE6', c: AMBER },
  };
  const v = map[kind] || map.best;
  return (
    <span
      style={{
        background: v.bg,
        color: v.c,
        fontSize: 10.5,
        fontWeight: 800,
        padding: '3px 7px',
        borderRadius: 6,
        letterSpacing: '.01em',
      }}
    >
      {children}
    </span>
  );
}

function HomeStepper({ qty, onChange, compact = false, size = 'md' }) {
  const isSm = size === 'sm';
  const h = isSm ? 26 : compact ? 28 : 34;
  const btnW = isSm ? 24 : h;
  const numW = isSm ? 22 : 28;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid var(--line)`, borderRadius: 8, height: h, overflow: 'hidden', background: '#fff' }}>
      <button onClick={() => onChange(Math.max(1, qty - 1))} style={{ width: btnW, height: h, color: 'var(--fg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Icon.minus(isSm ? 12 : 14)}
      </button>
      <span style={{ minWidth: numW, textAlign: 'center', fontSize: isSm ? 12 : 13, fontWeight: 700 }}>{qty}</span>
      <button onClick={() => onChange(qty + 1)} style={{ width: btnW, height: h, color: 'var(--fg-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {Icon.plus(isSm ? 12 : 14)}
      </button>
    </div>
  );
}
// 동일 이름 충돌 회피용 alias — 디자인 코드에서 Stepper 로 참조하던 부분.
const Stepper = HomeStepper;

function ViewToggle({ mode, onChange }) {
  const Btn = ({ type, icon, label }) => {
    const on = mode === type;
    return (
      <button
        onClick={() => onChange(type)}
        aria-label={label}
        style={{
          width: 30,
          height: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: on ? BRAND : 'transparent',
          color: on ? '#fff' : 'var(--fg-alt)',
          transition: 'background-color .15s, color .15s',
        }}
      >
        {icon}
      </button>
    );
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, padding: 2, borderRadius: 8, background: '#F2F4F7', border: `1px solid ${LINE2}` }}>
      <Btn type="grid" icon={Icon.grid(15)} label="이미지 보기" />
      <Btn type="list" icon={Icon.list(15)} label="리스트 보기" />
    </div>
  );
}

// ─── 상품 카드 (이미지) / 리스트 row ──────────────────────
function ProductCardImage({ p, fav, onFav, onAdd, ctaMode = 'default' }) {
  const [qty, setQty] = useState(1);
  const isReorder = ctaMode === 'reorder';
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${LINE2}`, padding: 10, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: SHADOW_CARD }}>
      <div style={{ position: 'relative' }}>
        <ProductImage kind={p.kind} tint={p.tint} />
        {p.tag && (
          <div style={{ position: 'absolute', top: 6, left: 6 }}>
            <Tag kind={p.tag === 'Best' ? 'best' : p.tag === '추천' ? 'rec' : 'new'}>{p.tag}</Tag>
          </div>
        )}
        <button
          onClick={onFav}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 28,
            height: 28,
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon.heart(fav, 14)}
        </button>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.3,
          color: 'var(--fg-strong)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          minHeight: 34,
        }}
      >
        {p.name}
      </div>
      <div>
        <SpecChip size="sm">{p.spec}</SpecChip>
      </div>
      <StockChip stock={p.stock} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <Stepper qty={qty} onChange={setQty} size="sm" />
        <button
          onClick={() => onAdd(p, qty)}
          style={{
            flex: 1,
            minWidth: 0,
            height: 30,
            borderRadius: 8,
            background: isReorder ? '#fff' : BRAND,
            color: isReorder ? BRAND_STRONG : '#fff',
            border: isReorder ? `1.5px solid ${BRAND}` : 'none',
            fontWeight: 700,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '0 4px',
          }}
        >
          {isReorder ? <>{Icon.refresh(13, BRAND_STRONG)} 재주문</> : <>{Icon.cartSmall(13, '#fff')} 담기</>}
        </button>
      </div>
    </div>
  );
}

function ProductRow({ p, fav, onFav, onAdd }) {
  const [qty, setQty] = useState(1);
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${LINE2}`, padding: 12, display: 'flex', gap: 12, boxShadow: SHADOW_CARD }}>
      <div style={{ position: 'relative' }}>
        <ProductImageFixed kind={p.kind} size={84} tint={p.tint} />
        {p.tag && (
          <div style={{ position: 'absolute', top: 5, left: 5 }}>
            <Tag kind={p.tag === 'Best' ? 'best' : p.tag === '추천' ? 'rec' : 'new'}>{p.tag}</Tag>
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: 'var(--fg-strong)' }}>{p.name}</div>
          <button onClick={onFav} style={{ padding: 2, marginTop: -2 }}>{Icon.heart(fav, 18)}</button>
        </div>
        <div>
          <SpecChip size="sm">{p.spec}</SpecChip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: 8 }}>
          <StockChip stock={p.stock} />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Stepper qty={qty} onChange={setQty} compact />
            <button
              onClick={() => onAdd(p, qty)}
              style={{
                height: 28,
                padding: '0 10px',
                borderRadius: 8,
                background: BRAND,
                color: '#fff',
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {Icon.cartSmall(13, '#fff')}담기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductScroller({ products, favs, toggleFav, onAdd, cardWidth = 158, ctaMode = 'default' }) {
  const dragRef = useDragScroll();
  return (
    <div ref={dragRef} className="no-scrollbar" style={{ display: 'flex', gap: 12, padding: '0 16px 12px', overflowX: 'auto', scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch', scrollPaddingLeft: 16 }}>
      {products.map((p) => (
        <div key={p.id} style={{ width: cardWidth, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <ProductCardImage p={p} fav={!!favs[p.id]} onFav={() => toggleFav(p.id)} onAdd={onAdd} ctaMode={ctaMode} />
        </div>
      ))}
      <div style={{ width: 8, flexShrink: 0 }} />
    </div>
  );
}

// ─── 최근주문 그룹 카드 / row ──────────────────────────────
function OrderGroupCard({ order, onReorder }) {
  const [qtys, setQtys] = useState(() => Object.fromEntries(order.items.map((it) => [it.pid, it.qty])));
  const updateQty = (pid, q) => setQtys((prev) => ({ ...prev, [pid]: Math.max(0, q) }));

  const totalBoxes = Object.values(qtys).reduce((a, b) => a + b, 0);
  const totalAmount = order.items.reduce((sum, it) => {
    const p = getOrderProduct(it.pid);
    return sum + (p ? p.price * (qtys[it.pid] || 0) : 0);
  }, 0);
  const activeTypes = order.items.filter((it) => (qtys[it.pid] || 0) > 0).length;

  const handleReorder = (e) => {
    e?.stopPropagation();
    onReorder({
      ...order,
      items: order.items.map((it) => ({ pid: it.pid, qty: qtys[it.pid] || 0 })).filter((it) => it.qty > 0),
      totalBoxes,
      totalAmount,
      typesCount: activeTypes,
    });
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${LINE2}`, padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: SHADOW_CARD, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>{order.date.slice(5)}</div>
          <div style={{ fontSize: 10.5, color: 'var(--fg-assist)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.orderNo}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: BRAND_STRONG, background: BRAND_SOFT, padding: '2px 7px', borderRadius: 9999, flexShrink: 0 }}>{order.status}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, borderTop: `1px solid ${LINE2}` }}>
        {order.items.map((it) => {
          const p = getOrderProduct(it.pid);
          if (!p) return null;
          return (
            <div key={it.pid} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: p.tint || '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {p.kind.startsWith('can:') ? <Can kind={p.kind.slice(4)} size={26} /> : <Bottle kind={p.kind} size={30} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.25 }}>{p.name}</div>
                <div>
                  <SpecChip size="sm">{p.spec}</SpecChip>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Stepper qty={qtys[it.pid] || 0} onChange={(q) => updateQty(it.pid, q)} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleReorder}
        disabled={totalBoxes === 0}
        style={{
          width: '100%',
          height: 36,
          borderRadius: 8,
          background: totalBoxes === 0 ? '#F2F4F7' : BRAND,
          color: totalBoxes === 0 ? 'var(--fg-assist)' : '#fff',
          fontWeight: 700,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          cursor: totalBoxes === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {Icon.refresh(13, totalBoxes === 0 ? '#8A93A0' : '#fff')} 재주문
      </button>
    </div>
  );
}

function OrderGroupRow({ order, onReorder }) {
  const [qtys, setQtys] = useState(() => Object.fromEntries(order.items.map((it) => [it.pid, it.qty])));
  const updateQty = (pid, q) => setQtys((prev) => ({ ...prev, [pid]: Math.max(0, q) }));

  const totalBoxes = Object.values(qtys).reduce((a, b) => a + b, 0);
  const totalAmount = order.items.reduce((sum, it) => {
    const p = getOrderProduct(it.pid);
    return sum + (p ? p.price * (qtys[it.pid] || 0) : 0);
  }, 0);
  const activeTypes = order.items.filter((it) => (qtys[it.pid] || 0) > 0).length;

  const handleReorder = (e) => {
    e?.stopPropagation();
    onReorder({
      ...order,
      items: order.items.map((it) => ({ pid: it.pid, qty: qtys[it.pid] || 0 })).filter((it) => it.qty > 0),
      totalBoxes,
      totalAmount,
      typesCount: activeTypes,
    });
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${LINE2}`, padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: SHADOW_CARD }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{order.date}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-assist)', fontWeight: 500 }}>{order.orderNo}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: BRAND_STRONG, background: BRAND_SOFT, padding: '2px 8px', borderRadius: 9999 }}>{order.status}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10, borderTop: `1px solid ${LINE2}` }}>
        {order.items.map((it) => {
          const p = getOrderProduct(it.pid);
          if (!p) return null;
          return (
            <div key={it.pid} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 9, background: p.tint || '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {p.kind.startsWith('can:') ? <Can kind={p.kind.slice(4)} size={30} /> : <Bottle kind={p.kind} size={34} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{p.name}</div>
                <div>
                  <SpecChip size="sm">{p.spec}</SpecChip>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Stepper qty={qtys[it.pid] || 0} onChange={(q) => updateQty(it.pid, q)} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleReorder}
        disabled={totalBoxes === 0}
        style={{
          width: '100%',
          height: 40,
          borderRadius: 8,
          background: totalBoxes === 0 ? '#F2F4F7' : BRAND,
          color: totalBoxes === 0 ? 'var(--fg-assist)' : '#fff',
          fontWeight: 700,
          fontSize: 13.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          cursor: totalBoxes === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {Icon.refresh(15, totalBoxes === 0 ? '#8A93A0' : '#fff')} 재주문
      </button>
    </div>
  );
}

function OrderGroupScroller({ orders, onReorder, cardWidth = 270 }) {
  const dragRef = useDragScroll();
  return (
    <div ref={dragRef} className="no-scrollbar" style={{ display: 'flex', gap: 12, padding: '0 16px 4px', overflowX: 'auto', scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch', scrollPaddingLeft: 16, alignItems: 'stretch' }}>
      {orders.map((o) => (
        <div key={o.id} style={{ width: cardWidth, flexShrink: 0, scrollSnapAlign: 'start' }}>
          <OrderGroupCard order={o} onReorder={onReorder} />
        </div>
      ))}
      <div style={{ width: 8, flexShrink: 0 }} />
    </div>
  );
}

// ─── 월간 요약 + 외상 한도 ────────────────────────────────
function MonthlySummaryCard({ ordersCount = 12, ordersAmount = 458000, deltaPct = 8, monthLabel = '5월', creditUsed = 3200000, creditLimit = 5000000 }) {
  const creditPct = Math.min(100, Math.round((creditUsed / creditLimit) * 100));
  const creditPalette =
    creditPct >= 90
      ? { bg: '#FEEAE5', border: '#FBD0C8', fg: '#9A1F1F', accent: RED }
      : creditPct >= 70
      ? { bg: '#FFF7E6', border: '#FCE4B5', fg: '#7A4A0E', accent: AMBER }
      : { bg: '#FFF8EC', border: '#F3DDA9', fg: '#7A4A0E', accent: '#C97A2B' };
  const wonShort = (w) => (w >= 10000 ? `${Math.floor(w / 10000).toLocaleString()}만` : w.toLocaleString());

  return (
    <div style={{ padding: '0 16px 12px', display: 'flex', gap: 10 }}>
      <button style={{ flex: 1, background: BRAND_SOFT, borderRadius: 14, padding: '12px 12px', border: `1px solid ${BRAND_TINT}`, display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: BRAND, display: 'flex' }}>{Icon.chart(13, 'currentColor')}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: BRAND_STRONG, letterSpacing: '-0.01em' }}>{monthLabel} 누적 발주</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.03em' }}>{ordersCount}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-alt)' }}>건</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: BRAND_STRONG, letterSpacing: '-0.02em' }}>₩{ordersAmount.toLocaleString()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
          <span style={{ color: BRAND, display: 'flex' }}>{Icon.trendUp(11, 'currentColor')}</span>
          <span style={{ fontSize: 10.5, color: 'var(--fg-alt)', fontWeight: 600 }}>지난달 +{deltaPct}%</span>
        </div>
      </button>

      <button style={{ flex: 1, background: creditPalette.bg, borderRadius: 14, padding: '12px', border: `1px solid ${creditPalette.border}`, display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ color: creditPalette.accent, display: 'flex' }}>{Icon.wallet(13, creditPalette.accent)}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: creditPalette.fg, letterSpacing: '-0.01em' }}>외상 잔액</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.03em' }}>₩{wonShort(creditUsed)}</span>
        </div>
        <div style={{ fontSize: 11, color: creditPalette.fg, fontWeight: 600 }}>
          한도 ₩{wonShort(creditLimit)} 중 {creditPct}%
        </div>
        <div style={{ height: 5, background: 'rgba(180,83,9,0.18)', borderRadius: 9999, overflow: 'hidden', marginTop: 6 }}>
          <div style={{ height: '100%', width: `${creditPct}%`, background: creditPalette.accent, borderRadius: 9999, transition: 'width .3s' }} />
        </div>
      </button>
    </div>
  );
}

// ─── 장바구니 미니바 ──────────────────────────────────────
function CartMiniBar({ count = 0, amount = 0, summary = '', onCheckout }) {
  if (count === 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        zIndex: 35,
        padding: '10px 16px 14px',
        background: 'rgba(15,17,21,0.94)',
        color: '#fff',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FF9450' }}>
            {Icon.cartSmall(14, 'currentColor')}
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1 }}>장바구니</span>
          </span>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>₩ {amount.toLocaleString()}</span>
        </div>
        {summary && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', fontWeight: 500, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</div>
        )}
      </div>
      <button onClick={onCheckout} style={{ flexShrink: 0, padding: '0 18px', height: 42, borderRadius: 9999, background: BRAND, color: '#fff', fontWeight: 800, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 3 }}>
        주문하기 <span style={{ fontSize: 16, marginTop: -1 }}>›</span>
      </button>
    </div>
  );
}

// ─── 하단 탭 바 ────────────────────────────────────────────
function BottomTabBar({ active, onChange }) {
  const tabs = [
    { id: 'home', label: '홈', icon: Icon.home },
    { id: 'order', label: '주문', icon: Icon.order },
    { id: 'shop', label: '상품', icon: Icon.bottleNav },
    { id: 'perks', label: '혜택', icon: Icon.gift },
    { id: 'me', label: '마이', icon: Icon.user },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(14px) saturate(160%)', borderTop: `1px solid ${LINE2}`, paddingBottom: 18 }}>
      <div style={{ display: 'flex' }}>
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{ flex: 1, padding: '8px 4px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            >
              <div style={{ position: 'relative' }}>{t.icon(on)}</div>
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, color: on ? BRAND_STRONG : 'var(--fg-assist)' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 메인 플로우 ──────────────────────────────────────────
export function B2BHomeFlow() {
  const [tab, setTab] = useState('home');
  const [activeCat, setActiveCat] = useState('맥주');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [favs, setFavs] = useState({ p1: true, p3: true });
  const [cartCount, setCartCount] = useState(15);
  const [cartAmount, setCartAmount] = useState(112000);
  const [cartSummary, setCartSummary] = useState('진로이즈백 외 3종 · 15박스');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg, ms = 1800) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  const handleTab = (id) => {
    setTab(id);
    if (id !== 'home') showToast('해당 화면은 준비 중이에요', 1500);
  };

  const toggleFav = (id) => setFavs((f) => ({ ...f, [id]: !f[id] }));

  const onAdd = (p, qty = 1) => {
    const short = p.name.split(' (')[0];
    setCartCount((c) => c + qty);
    setCartAmount((a) => a + (p.price || 0) * qty);
    setCartSummary(`${short} 외 N종 · 박스 추가`);
    showToast(`${short} · ${qty}박스 담았어요`);
  };

  const onReorderGroup = (order) => {
    const first = CATALOG.find((p) => p.id === order.items[0]?.pid);
    const short = first ? first.name.split(' (')[0] : '';
    setCartCount((c) => c + order.totalBoxes);
    setCartAmount((a) => a + order.totalAmount);
    setCartSummary(`${short} 외 ${order.typesCount - 1}종 · ${order.totalBoxes}박스`);
    showToast(`${order.typesCount}종 ${order.totalBoxes}박스 재주문 담았어요`, 2000);
  };

  // 섹션별 데이터
  const favorites = CATALOG.filter((p) => ['p1', 'p3', 'p5'].includes(p.id));
  const recommended = CATALOG.filter((p) => ['p4', 'p2', 'p7', 'p8', 'p6'].includes(p.id));
  const recentOrders = RECENT_ORDERS;

  // Top-5 단골 — 빠른 발주 (1탭) 의 기본 수량.
  const quickItems = [
    { pid: 'p1', defaultQty: 5 },
    { pid: 'p2', defaultQty: 5 },
    { pid: 'p3', defaultQty: 4 },
    { pid: 'p4', defaultQty: 3 },
  ];

  // "더보기 ›" — 모든 섹션 우측에 동일 패턴.
  const MoreBtn = () => (
    <button style={{ fontSize: 12.5, color: 'var(--fg-alt)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, padding: '2px 0' }}>
      더보기{' '}
      <span style={{ fontSize: 15, lineHeight: 1, color: 'var(--fg-assist)', fontWeight: 500, marginLeft: 1, marginTop: -1 }}>›</span>
    </button>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: BG_PAGE, paddingTop: 54 /* status bar */ }}>
      <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto', paddingBottom: 140 /* CartMiniBar + TabBar */ }}>
        <Header cartCount={cartCount} onCart={() => showToast('장바구니로 이동합니다', 1500)} />
        <Banner />
        <SearchBar />
        <DeadlineBar deadlineTime="14:00" />
        <QuickReorder items={quickItems} onQuickAdd={onAdd} />
        <CategoryTabs active={activeCat} onChange={setActiveCat} />
        <BrandScroller category={activeCat} />

        <div style={{ height: 10 }} />

        {/* 최근 주문 */}
        <SectionHeader
          title="최근 주문"
          count={recentOrders.length}
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MoreBtn />
              <ViewToggle mode={viewMode} onChange={setViewMode} />
            </div>
          }
        />
        {viewMode === 'grid' ? (
          <OrderGroupScroller orders={recentOrders} onReorder={onReorderGroup} />
        ) : (
          <div style={{ padding: '4px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentOrders.slice(0, 3).map((o) => (
              <OrderGroupRow key={o.id} order={o} onReorder={onReorderGroup} />
            ))}
          </div>
        )}

        {/* 즐겨찾기 */}
        <SectionHeader title="즐겨찾기" count={favorites.length} right={<MoreBtn />} />
        {viewMode === 'grid' ? (
          <ProductScroller products={favorites} favs={favs} toggleFav={toggleFav} onAdd={onAdd} />
        ) : (
          <div style={{ padding: '4px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {favorites.map((p) => (
              <ProductRow key={p.id} p={p} fav={!!favs[p.id]} onFav={() => toggleFav(p.id)} onAdd={onAdd} />
            ))}
          </div>
        )}

        {/* 추천상품 — 항상 가로 스와이프 */}
        <SectionHeader title="추천상품" count={null} right={<MoreBtn />} />
        <ProductScroller products={recommended} favs={favs} toggleFav={toggleFav} onAdd={onAdd} />

        <div style={{ height: 6 }} />
        <MonthlySummaryCard ordersCount={12} ordersAmount={458000} deltaPct={8} monthLabel="5월" creditUsed={3200000} creditLimit={5000000} />

        <div style={{ height: 16 }} />
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-assist)', padding: '8px 0 16px' }}>
          ⓒ HiteJinro B2B — 모든 거래는 사업자 등록증 인증 후 가능합니다
        </div>
      </div>

      <CartMiniBar
        count={cartCount}
        amount={cartAmount}
        summary={cartSummary}
        onCheckout={() => showToast('결제 화면으로 이동합니다', 1500)}
      />

      <BottomTabBar active={tab} onChange={handleTab} />

      {toast && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 108,
            transform: 'translateX(-50%)',
            background: 'rgba(15,17,21,0.92)',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            maxWidth: '80%',
            boxShadow: SHADOW_POP,
            animation: 'b2bToastIn .25s ease both',
          }}
        >
          <span style={{ color: '#7BD893', display: 'flex' }}>✓</span>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes b2bToastIn {
          from { transform: translate(-50%, 12px); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
