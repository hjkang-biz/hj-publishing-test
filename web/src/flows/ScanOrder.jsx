// Flow 2: 영업 중 스캔 발주 — 카메라 뷰파인더 → 바텀시트 → 장바구니 하이라이트
import React, { useState, useEffect } from 'react';
import { byId, fmtWon } from '../data/products.js';
import { Ic } from '../components/Icons.jsx';
import { ProductTile, StockBadge, Stepper } from '../components/Primitives.jsx';

export function ScanOrderFlow() {
  const [screen, setScreen] = useState('scan');
  const [scannedSku, setScannedSku] = useState(null);
  const [qty, setQty] = useState(2);
  const [unit, setUnit] = useState('box');
  const [cartCount, setCartCount] = useState(3);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (screen !== 'scan' || scannedSku) return;
    const t = setTimeout(() => {
      setScannedSku('CASS-500-B');
      setScreen('detail');
    }, 1400);
    return () => clearTimeout(t);
  }, [screen, scannedSku]);

  const addToCart = () => {
    setCartCount((c) => c + 1);
    setScreen('scan');
    setScannedSku(null);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  if (screen === 'scan' || screen === 'detail') {
    return (
      <div className="screen" style={{ background: '#0a0a0a' }}>
        <ScannerView cartCount={cartCount} />
        {scannedSku && screen === 'detail' && (
          <DetailSheet
            sku={scannedSku}
            qty={qty}
            setQty={setQty}
            unit={unit}
            setUnit={setUnit}
            onClose={() => {
              setScreen('scan');
              setScannedSku(null);
            }}
            onAdd={addToCart}
            onCart={() => setScreen('cart')}
          />
        )}
        {toast && <Toast msg="장바구니에 담았어요" />}
      </div>
    );
  }

  if (screen === 'cart') {
    return (
      <div className="screen">
        <PageNav title="장바구니" onBack={() => setScreen('scan')} />
        <div className="screen-scroll no-status-pad" style={{ paddingTop: 0, paddingBottom: 130 }}>
          <div
            style={{
              margin: '12px 16px 4px',
              padding: '12px 14px',
              background: 'var(--brand-soft)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid rgba(31,111,235,0.18)',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ic name="scan" size={16} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="t-body-m" style={{ color: 'var(--brand-strong)', fontWeight: 600 }}>
              스캔으로 카스 1박스 추가됨
            </span>
          </div>
          <div className="col" style={{ padding: '8px 16px', gap: 10 }}>
            <CartRow sku="CASS-500-B" qty={1} highlight />
            <CartRow sku="TERA-500-B" qty={4} />
            <CartRow sku="JINRO-360-B" qty={3} />
            <CartRow sku="CHUM-360-B" qty={2} />
          </div>
          <div style={{ margin: '20px 16px 0' }} className="card">
            <div style={{ padding: '14px 16px' }} className="col gap-10">
              <div className="row between">
                <span className="t-body-m fg-alt">소계</span>
                <span className="t-body-m fg-strong">261,500원</span>
              </div>
              <div className="row between">
                <span className="t-body-m fg-alt">부가세 (10%)</span>
                <span className="t-body-m fg-strong">26,150원</span>
              </div>
              <div className="divider" />
              <div className="row between">
                <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                  총 결제 금액
                </span>
                <span className="t-title-m fg-brand">287,650원</span>
              </div>
            </div>
          </div>
        </div>
        <BottomBar>
          <button className="cta">4개 상품 · 287,650원 발주하기</button>
        </BottomBar>
      </div>
    );
  }
}

function ScannerView({ cartCount }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 45%, rgba(40,40,40,1) 0%, rgba(8,8,8,1) 100%)',
        }}
      />
      <FakeShelf />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          padding: '60px 16px 16px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ic name="x" size={22} color="#fff" strokeWidth={2.2} />
        </button>
        <div className="col" style={{ alignItems: 'center', gap: 2 }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>바코드 스캔</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>박스 라벨을 가운데에 맞춰주세요</span>
        </div>
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Ic name="cart" size={22} color="#fff" strokeWidth={2} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
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
                border: '2px solid #0a0a0a',
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 260,
          height: 260,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
        }}
      >
        {[
          { top: -2, left: -2, borderTop: 4, borderLeft: 4 },
          { top: -2, right: -2, borderTop: 4, borderRight: 4 },
          { bottom: -2, left: -2, borderBottom: 4, borderLeft: 4 },
          { bottom: -2, right: -2, borderBottom: 4, borderRight: 4 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: s.top,
              left: s.left,
              right: s.right,
              bottom: s.bottom,
              width: 38,
              height: 38,
              borderTopWidth: s.borderTop || 0,
              borderLeftWidth: s.borderLeft || 0,
              borderRightWidth: s.borderRight || 0,
              borderBottomWidth: s.borderBottom || 0,
              borderStyle: 'solid',
              borderColor: 'var(--brand)',
              borderRadius:
                i === 0 ? '14px 0 0 0' : i === 1 ? '0 14px 0 0' : i === 2 ? '0 0 0 14px' : '0 0 14px 0',
            }}
          />
        ))}
        <div className="scan-line" style={{ top: 0 }} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          padding: '24px 20px calc(40px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div className="col gap-12">
          <div className="row gap-10" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="pulse" style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--brand)' }} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>스캔 중…</span>
          </div>
          <div className="row gap-8" style={{ justifyContent: 'center' }}>
            <button
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ic name="flash" size={16} color="#fff" fill="#fff" /> 플래시
            </button>
            <button
              style={{
                height: 40,
                padding: '0 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ic name="search" size={16} color="#fff" /> 직접 검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FakeShelf() {
  return (
    <svg
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}
    >
      <defs>
        <linearGradient id="box1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0B4DA2" />
          <stop offset="100%" stopColor="#062E63" />
        </linearGradient>
        <linearGradient id="box2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1F7A3D" />
          <stop offset="100%" stopColor="#0E5126" />
        </linearGradient>
      </defs>
      <g transform="translate(50, 250) rotate(-4)">
        <rect width="160" height="180" rx="6" fill="url(#box1)" />
        <rect x="20" y="60" width="120" height="50" rx="3" fill="rgba(255,255,255,0.18)" />
        <text x="80" y="92" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Pretendard, sans-serif">
          카스
        </text>
      </g>
      <g transform="translate(190, 270) rotate(3)">
        <rect width="160" height="170" rx="6" fill="url(#box2)" />
        <rect x="20" y="60" width="120" height="50" rx="3" fill="rgba(255,255,255,0.18)" />
        <text x="80" y="92" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Pretendard, sans-serif">
          테라
        </text>
      </g>
      <g transform="translate(120, 450) rotate(-1)">
        <rect width="180" height="120" rx="6" fill="url(#box1)" opacity="0.7" />
      </g>
    </svg>
  );
}

function DetailSheet({ sku, qty, setQty, unit, setUnit, onClose, onAdd, onCart }) {
  const p = byId(sku);
  const unitPrice = unit === 'box' ? p.boxPrice : p.bottlePrice;
  const total = unitPrice * qty;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 10 }} onClick={onClose} />
      <div
        className="slide-up"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 11,
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '8px 0 calc(20px + env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--line-strong)', margin: '0 auto 12px' }} />
        <div style={{ padding: '0 16px' }}>
          <div
            className="row gap-8"
            style={{
              padding: '8px 12px',
              background: 'var(--green-soft)',
              borderRadius: 10,
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Ic name="check" size={16} color="#00892e" strokeWidth={2.4} />
            <span className="t-body-s" style={{ color: '#00892e', fontWeight: 600 }}>
              SKU 인식 완료 · {p.sku}
            </span>
          </div>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 14 }}>
          <ProductTile p={p} size="big" />
          <div className="col grow gap-4" style={{ minWidth: 0 }}>
            <span className="t-title-s fg-strong">{p.name}</span>
            <span className="t-body-s fg-alt">{p.sub}</span>
            <div className="row gap-8" style={{ marginTop: 4 }}>
              <StockBadge stock={p.stock} />
              <span className="t-body-s fg-alt">예상 배송 1일</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 16px 12px' }}>
          <div className="seg" style={{ width: '100%' }}>
            <button className={unit === 'box' ? 'active' : ''} onClick={() => setUnit('box')} style={{ flex: 1 }}>
              박스 (20병)
            </button>
            <button className={unit === 'bottle' ? 'active' : ''} onClick={() => setUnit('bottle')} style={{ flex: 1 }}>
              병
            </button>
          </div>
          <div className="row between" style={{ marginTop: 10, padding: '0 4px' }}>
            <span className="t-body-s fg-alt">단가</span>
            <div className="row gap-6" style={{ alignItems: 'baseline' }}>
              <span className="t-title-s fg-strong">{fmtWon(unitPrice)}</span>
              <span className="t-body-s fg-alt">/ {unit === 'box' ? '박스' : '병'}</span>
              {unit === 'box' && <span className="t-body-s fg-alt">· 병당 {fmtWon(p.bottlePrice)}</span>}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 16px', background: 'var(--bg-cool)', margin: '0 0 16px' }}>
          <div className="row between">
            <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
              수량
            </span>
            <Stepper value={qty} onChange={setQty} />
          </div>
          <div className="row between" style={{ marginTop: 10 }}>
            <span className="t-body-m fg-alt">합계</span>
            <span className="t-title-m fg-brand">{fmtWon(total)}</span>
          </div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', gap: 10 }}>
          <button className="cta secondary press" style={{ flex: 0, padding: '0 18px' }} onClick={onCart}>
            <Ic name="cart" size={20} />
          </button>
          <button className="cta press" style={{ flex: 1 }} onClick={onAdd}>
            장바구니 담기 · {fmtWon(total)}
          </button>
        </div>
      </div>
    </>
  );
}

function Toast({ msg }) {
  return (
    <div
      className="fade-up"
      style={{
        position: 'absolute',
        top: 110,
        left: 16,
        right: 16,
        zIndex: 20,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          background: 'var(--brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ic name="check" size={16} color="#fff" strokeWidth={2.6} />
      </div>
      <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{msg}</span>
    </div>
  );
}

function CartRow({ sku, qty, highlight }) {
  const p = byId(sku);
  return (
    <div
      className="card fade-up"
      style={{
        padding: 14,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        ...(highlight
          ? {
              borderColor: 'var(--brand)',
              background: 'var(--brand-tint)',
              boxShadow: '0 0 0 3px rgba(31,111,235,0.12)',
            }
          : {}),
      }}
    >
      <ProductTile p={p} />
      <div className="col grow" style={{ gap: 4, minWidth: 0 }}>
        <div className="row between" style={{ gap: 8 }}>
          <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
            {p.name}
          </span>
          {highlight && <span className="badge brand">방금 스캔</span>}
        </div>
        <span className="t-body-s fg-alt">{p.sub}</span>
        <div className="row between" style={{ marginTop: 8 }}>
          <Stepper value={qty} onChange={() => {}} />
          <span className="t-body-l fg-strong" style={{ fontWeight: 700 }}>
            {fmtWon(p.boxPrice * qty)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PageNav({ title, onBack }) {
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
        <div style={{ width: 40, height: 40 }} />
      </div>
    </div>
  );
}

function BottomBar({ children }) {
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
