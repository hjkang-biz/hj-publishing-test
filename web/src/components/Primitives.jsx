// 공통 UI 프리미티브 — Tab bar, ProductTile, StockBadge, Stepper
import React from 'react';
import { Ic } from './Icons.jsx';

export function TabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home', icon: 'home', label: '홈' },
    { id: 'orders', icon: 'list', label: '주문관리' },
    { id: 'notice', icon: 'speaker', label: '공지사항' },
    { id: 'me', icon: 'user', label: '내 정보' },
  ];
  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <button key={t.id} className={'tab' + (t.id === active ? ' active' : '')}>
          <span className="tab-icon">
            <Ic name={t.icon} size={24} strokeWidth={t.id === active ? 2.1 : 1.7} />
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ProductTile({ p, size = 'sm', qty }) {
  const cls = size === 'big' ? 'prod-tile big' : size === 'xl' ? 'prod-tile xl' : 'prod-tile';
  return (
    <div className={cls} style={{ background: `linear-gradient(160deg, ${p.color} 0%, ${p.accent} 100%)` }}>
      <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)', textAlign: 'center', lineHeight: 1.1 }}>{p.name}</span>
      {qty != null && (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            minWidth: 20,
            height: 20,
            padding: '0 5px',
            background: 'var(--brand)',
            color: '#fff',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
          }}
        >
          {qty}
        </span>
      )}
    </div>
  );
}

export function StockBadge({ stock }) {
  if (stock === 'high') return <span className="badge green">재고 충분</span>;
  if (stock === 'medium') return <span className="badge amber">재고 부족</span>;
  return <span className="badge red">품절</span>;
}

export function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="minus">−</button>
      <span className="v">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="plus">+</button>
    </div>
  );
}

export function PageNav({ title, onBack, right }) {
  return (
    <div
      style={{
        paddingTop: 'var(--status-bar-h)',
        background: '#fff',
        borderBottom: '1px solid var(--line)',
        position: 'relative',
        zIndex: 4,
      }}
    >
      <div className="row between" style={{ padding: '8px 6px 12px' }}>
        <button
          className="press"
          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={onBack}
        >
          <Ic name="chevLeft" size={24} color="var(--fg-strong)" />
        </button>
        <span className="t-title-s fg-strong">{title}</span>
        <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {right}
        </div>
      </div>
    </div>
  );
}

export function BottomBar({ children }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 6,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--line)',
        padding: '14px 16px calc(28px + env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}
