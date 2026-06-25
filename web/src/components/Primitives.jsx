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
      <span className="prod-tile-label">{p.name}</span>
      {qty != null && <span className="qty-badge">{qty}</span>}
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
    <div className="page-nav">
      <div className="row between page-nav-row">
        <button className="press icon-btn" onClick={onBack}>
          <Ic name="chevLeft" size={24} color="var(--fg-strong)" />
        </button>
        <span className="t-title-s fg-strong">{title}</span>
        <div className="icon-btn">{right}</div>
      </div>
    </div>
  );
}

export function BottomBar({ children }) {
  return <div className="bottom-bar">{children}</div>;
}
