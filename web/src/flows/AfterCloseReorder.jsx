// Flow 1: 마감 후 재주문 — 김영자 사장님 시나리오 (5단계)
import React, { useState } from 'react';
import { favorites, byId, fmtWon } from '../data/products.js';
import { Ic } from '../components/Icons.jsx';
import { TabBar, ProductTile, Stepper, PageNav, BottomBar } from '../components/Primitives.jsx';

export function AfterCloseFlow() {
  const [screen, setScreen] = useState('home');
  const [qtys, setQtys] = useState(Object.fromEntries(favorites.map((f) => [f.sku, f.lastQty])));
  const [selected, setSelected] = useState(Object.fromEntries(favorites.map((f) => [f.sku, true])));
  const [date, setDate] = useState(14);
  const [pay, setPay] = useState('credit');

  const cartItems = favorites.filter((f) => selected[f.sku] && qtys[f.sku] > 0);
  const subtotal = cartItems.reduce((s, f) => s + byId(f.sku).boxPrice * qtys[f.sku], 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  if (screen === 'home') {
    return (
      <div className="screen">
        <div className="screen-scroll screen-bottom-pad" style={{ background: 'var(--bg)' }}>
          <AppHeader />
          <SearchBar />
          <QuickGrid onFav={() => setScreen('fav')} />
          <SummaryCards />
          <AIBanner />
          <RecentOrderCard onReorder={() => setScreen('cart')} />
          <Categories />
          <div style={{ height: 32 }} />
        </div>
        <TabBar active="home" />
      </div>
    );
  }

  if (screen === 'fav') {
    const selCount = Object.entries(selected).filter(([sku, v]) => v && qtys[sku] > 0).length;
    const selTotal = favorites.reduce(
      (s, f) => s + (selected[f.sku] ? byId(f.sku).boxPrice * qtys[f.sku] : 0),
      0
    );
    return (
      <div className="screen">
        <PageNav
          title="즐겨찾기"
          onBack={() => setScreen('home')}
          right={
            <button className="t-body-m fg-brand" style={{ fontWeight: 600 }}>
              편집
            </button>
          }
        />
        <div className="screen-scroll no-status-pad" style={{ paddingTop: 0, paddingBottom: 130 }}>
          <div style={{ padding: '12px 16px 8px' }} className="row between">
            <span className="t-body-s fg-alt">{favorites.length}개 상품 · 직전 주문 수량 자동 입력</span>
            <span className="t-body-s fg-brand" style={{ fontWeight: 600 }}>
              전체 선택
            </span>
          </div>
          <div className="col" style={{ padding: '0 16px', gap: 10 }}>
            {favorites.map((f) => {
              const p = byId(f.sku);
              const sel = selected[f.sku];
              return (
                <div
                  key={f.sku}
                  className="card"
                  style={{
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    outline: sel ? '2px solid var(--brand)' : 'none',
                    outlineOffset: -2,
                    background: sel ? 'var(--brand-tint)' : 'var(--surface)',
                  }}
                >
                  <button
                    onClick={() => setSelected((s) => ({ ...s, [f.sku]: !s[f.sku] }))}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: sel ? 'none' : '1.5px solid var(--line-strong)',
                      background: sel ? 'var(--brand)' : 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {sel && <Ic name="check" size={16} color="#fff" strokeWidth={2.5} />}
                  </button>
                  <ProductTile p={p} />
                  <div className="col grow" style={{ gap: 2, minWidth: 0 }}>
                    <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                      {p.name}
                    </span>
                    <span className="t-body-s fg-alt">{p.sub}</span>
                    <span className="t-label fg-brand" style={{ marginTop: 2 }}>
                      {fmtWon(p.boxPrice)}
                      <span className="fg-alt" style={{ fontWeight: 400 }}>
                        {' '}/ 박스
                      </span>
                    </span>
                  </div>
                  <Stepper value={qtys[f.sku]} onChange={(v) => setQtys((q) => ({ ...q, [f.sku]: v }))} />
                </div>
              );
            })}
          </div>
        </div>
        <BottomBar>
          <div className="col grow gap-4">
            <span className="t-body-s fg-alt">{selCount}개 상품 합계</span>
            <span className="t-title-m fg-strong">{fmtWon(selTotal)}</span>
          </div>
          <button
            className="cta"
            style={{ width: 'auto', padding: '0 28px' }}
            onClick={() => setScreen('cart')}
          >
            장바구니 담기
          </button>
        </BottomBar>
      </div>
    );
  }

  if (screen === 'cart') {
    return (
      <div className="screen">
        <PageNav title="장바구니" onBack={() => setScreen('fav')} />
        <div className="screen-scroll no-status-pad" style={{ paddingTop: 0, paddingBottom: 180 }}>
          <div
            style={{
              margin: '12px 16px 4px',
              padding: '12px 14px',
              background: 'var(--green-soft)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 18 }}>🎉</div>
            <span className="t-body-m" style={{ color: 'var(--green-on)', fontWeight: 600 }}>
              최소 주문 금액 충족! 무료 배송 가능
            </span>
          </div>
          <div className="col" style={{ padding: '8px 16px', gap: 10 }}>
            {cartItems.map((f) => {
              const p = byId(f.sku);
              return (
                <div
                  key={f.sku}
                  className="card"
                  style={{ padding: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <ProductTile p={p} />
                  <div className="col grow" style={{ gap: 4, minWidth: 0 }}>
                    <div className="row between" style={{ gap: 8 }}>
                      <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                        {p.name}
                      </span>
                      <Ic name="x" size={18} color="var(--fg-assist)" />
                    </div>
                    <span className="t-body-s fg-alt">{p.sub}</span>
                    <div className="row between" style={{ marginTop: 8 }}>
                      <Stepper value={qtys[f.sku]} onChange={(v) => setQtys((q) => ({ ...q, [f.sku]: v }))} />
                      <span className="t-body-l fg-strong" style={{ fontWeight: 700 }}>
                        {fmtWon(p.boxPrice * qtys[f.sku])}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ margin: '20px 16px 0' }} className="card">
            <div style={{ padding: '14px 16px' }} className="col gap-10">
              <div className="row between">
                <span className="t-body-m fg-alt">소계</span>
                <span className="t-body-m fg-strong">{fmtWon(subtotal)}</span>
              </div>
              <div className="row between">
                <span className="t-body-m fg-alt">부가세 (10%)</span>
                <span className="t-body-m fg-strong">{fmtWon(vat)}</span>
              </div>
              <div className="row between">
                <span className="t-body-m fg-alt">배송비</span>
                <span className="t-body-m fg-green" style={{ fontWeight: 600 }}>
                  무료
                </span>
              </div>
              <div className="divider" />
              <div className="row between">
                <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                  총 결제 금액
                </span>
                <span className="t-title-m fg-brand">{fmtWon(total)}</span>
              </div>
            </div>
          </div>
        </div>
        <BottomBar>
          <button className="cta" onClick={() => setScreen('checkout')}>
            {cartItems.length}개 상품 · {fmtWon(total)} 발주하기
          </button>
        </BottomBar>
      </div>
    );
  }

  if (screen === 'checkout') {
    return (
      <div className="screen">
        <PageNav title="주문하기" onBack={() => setScreen('cart')} />
        <div className="screen-scroll no-status-pad" style={{ paddingTop: 0, paddingBottom: 130 }}>
          <Section title="배송 희망일" subtitle="공휴일 제외 · 내일부터 선택 가능">
            <DateStrip selected={date} onChange={setDate} />
          </Section>

          <Section
            title="배송지"
            right={
              <span className="t-body-s fg-brand" style={{ fontWeight: 600 }}>
                변경
              </span>
            }
          >
            <div className="card tight" style={{ padding: 14 }}>
              <div className="row gap-8" style={{ alignItems: 'flex-start' }}>
                <span className="badge brand" style={{ marginTop: 2 }}>
                  기본
                </span>
                <div className="col grow gap-4">
                  <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                    은평 삼겹살집
                  </span>
                  <span className="t-body-s fg-alt">서울 은평구 갈현로 12, 1층</span>
                  <span className="t-body-s fg-alt">김영자 사장님 · 010-2345-XXXX</span>
                </div>
              </div>
            </div>
          </Section>

          <Section title="배송 메모">
            <div className="card tight" style={{ padding: '12px 14px' }}>
              <span className="t-body-m fg-alt">매장 후문, 부재 시 옆 편의점에 맡겨주세요</span>
            </div>
            <div className="row" style={{ gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {['도착 전 연락', '후문 배송', '문 앞 배송'].map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </Section>

          <Section title="결제 수단">
            <div className="col gap-8">
              {[
                { id: 'credit', label: '외상', sub: '월말 일괄 정산' },
                { id: 'bank', label: '계좌이체', sub: '신한은행 110-XXX-XXXX' },
                { id: 'card', label: '신용카드', sub: '신한 ****-3829' },
                { id: 'easy', label: '간편결제', sub: '카카오페이' },
              ].map((o) => (
                <div
                  key={o.id}
                  onClick={() => setPay(o.id)}
                  className="card tight"
                  style={{
                    padding: 14,
                    cursor: 'pointer',
                    borderColor: pay === o.id ? 'var(--brand)' : 'var(--line)',
                    background: pay === o.id ? 'var(--brand-tint)' : 'var(--surface)',
                  }}
                >
                  <div className="row between">
                    <div className="col gap-4">
                      <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                        {o.label}
                      </span>
                      <span className="t-body-s fg-alt">{o.sub}</span>
                    </div>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        border: pay === o.id ? 'none' : '1.5px solid var(--line-strong)',
                        background: pay === o.id ? 'var(--brand)' : 'var(--surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {pay === o.id && (
                        <div style={{ width: 8, height: 8, background: '#fff', borderRadius: 999 }} />
                      )}
                    </div>
                  </div>
                  {pay === o.id && o.id === 'credit' && (
                    <div className="col" style={{ marginTop: 14, gap: 8 }}>
                      <div className="row between">
                        <span className="t-body-s fg-alt">신용 한도 사용</span>
                        <span className="t-body-s fg-strong" style={{ fontWeight: 600 }}>
                          1,840,000 / 3,000,000원
                        </span>
                      </div>
                      <div className="gauge-track">
                        <div className="gauge-fill" style={{ width: '61%' }} />
                      </div>
                      <span className="t-body-s fg-alt">잔여 한도 1,160,000원 · 이번 발주 가능</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="card" style={{ padding: '16px 18px' }}>
              <div className="col gap-10">
                <div className="row between">
                  <span className="t-body-m fg-alt">소계</span>
                  <span className="t-body-m">{fmtWon(subtotal)}</span>
                </div>
                <div className="row between">
                  <span className="t-body-m fg-alt">부가세 (10%)</span>
                  <span className="t-body-m">{fmtWon(vat)}</span>
                </div>
                <div className="divider" />
                <div className="row between">
                  <span className="t-body-l" style={{ fontWeight: 600 }}>
                    합계
                  </span>
                  <span className="t-title-m fg-brand">{fmtWon(total)}</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
        <BottomBar>
          <button className="cta" onClick={() => setScreen('done')}>
            {fmtWon(total)} 발주하기
          </button>
        </BottomBar>
      </div>
    );
  }

  if (screen === 'done') {
    return (
      <div className="screen">
        <div
          className="screen-scroll no-status-pad"
          style={{ paddingTop: 60, paddingBottom: 130, background: 'var(--surface)' }}
        >
          <div className="col" style={{ alignItems: 'center', padding: '32px 24px 12px', gap: 16 }}>
            <div
              className="fade-up"
              style={{
                width: 88,
                height: 88,
                borderRadius: 999,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(31,111,235,0.32)',
              }}
            >
              <Ic name="check" size={48} color="#fff" strokeWidth={2.8} />
            </div>
            <div className="col" style={{ alignItems: 'center', gap: 6 }}>
              <span className="t-title-l fg-strong">발주 완료! 🎉</span>
              <span className="t-body-l fg-alt">5월 14일(목) 오전 도착 예정이에요</span>
            </div>
          </div>

          <div style={{ padding: '20px 16px 0' }}>
            <div className="card" style={{ padding: 18 }}>
              <div className="row between" style={{ marginBottom: 12 }}>
                <span className="t-body-s fg-alt">주문번호</span>
                <span className="t-label fg-strong">HJ-2026-05-13-#0418</span>
              </div>
              <div className="divider" style={{ marginBottom: 12 }} />
              <div className="col gap-8">
                {cartItems.slice(0, 3).map((f) => {
                  const p = byId(f.sku);
                  return (
                    <div key={f.sku} className="row between">
                      <span className="t-body-m fg-strong">
                        {p.name} × {qtys[f.sku]}박스
                      </span>
                      <span className="t-body-m fg-alt">{fmtWon(p.boxPrice * qtys[f.sku])}</span>
                    </div>
                  );
                })}
                {cartItems.length > 3 && (
                  <span className="t-body-s fg-alt">외 {cartItems.length - 3}개 상품</span>
                )}
              </div>
              <div className="divider" style={{ margin: '14px 0' }} />
              <div className="row between">
                <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                  총 결제 금액
                </span>
                <span className="t-title-m fg-brand">{fmtWon(total)}</span>
              </div>
            </div>

            <button
              className="press"
              style={{
                marginTop: 14,
                width: '100%',
                padding: '14px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--brand-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand)',
                }}
              >
                <Ic name="receipt" size={20} />
              </div>
              <div className="col grow gap-4" style={{ alignItems: 'flex-start' }}>
                <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                  발주서 자동 발급 완료
                </span>
                <span className="t-body-s fg-alt">PDF · 앱 내 보관</span>
              </div>
              <Ic name="chev" size={20} color="var(--fg-assist)" />
            </button>

            <div className="row gap-8" style={{ marginTop: 20 }}>
              <button className="cta secondary" onClick={() => setScreen('home')}>
                홈으로
              </button>
              <button
                className="cta"
                style={{ background: 'var(--surface)', color: 'var(--brand)', border: '1.5px solid var(--brand)' }}
              >
                주문 내역 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function AppHeader() {
  return (
    <div style={{ padding: '8px 16px 12px' }} className="row between">
      <div className="col">
        <span className="t-body-s fg-alt">하이트진로 직납 · 강북지점</span>
        <span className="t-title-m fg-strong">사장님, 안녕하세요 👋</span>
      </div>
      <button
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--bg-cool)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Ic name="bell" size={22} color="var(--fg-neutral)" />
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 9,
            width: 8,
            height: 8,
            background: 'var(--red)',
            borderRadius: 999,
            border: '2px solid var(--bg-cool)',
          }}
        />
      </button>
    </div>
  );
}

function SearchBar() {
  return (
    <div style={{ padding: '0 16px 16px' }}>
      <div
        className="row"
        style={{
          background: 'var(--bg-cool)',
          borderRadius: 14,
          padding: '12px 14px',
          gap: 10,
          border: '1px solid var(--line)',
        }}
      >
        <Ic name="search" size={20} color="var(--fg-alt)" />
        <span className="t-body-l fg-alt grow">테라, 소주, 맥주잔 검색</span>
        <button style={{ padding: 4 }}>
          <Ic name="scan" size={22} color="var(--fg-neutral)" />
        </button>
        <div style={{ width: 1, height: 18, background: 'var(--line)' }} />
        <button style={{ padding: 4 }}>
          <Ic name="mic" size={22} color="var(--fg-neutral)" />
        </button>
      </div>
    </div>
  );
}

function QuickGrid({ onFav }) {
  const items = [
    { icon: 'heart', label: '즐겨찾기', color: '#FF4242', bg: '#fff0f0', onClick: onFav },
    { icon: 'refresh', label: '재주문', color: '#1F6FEB', bg: '#E8F0FE' },
    { icon: 'receipt', label: '발주서', color: '#0066FF', bg: '#eaf2fe' },
    { icon: 'box', label: '빈통회수', color: '#00A636', bg: '#e6fff0' },
  ];
  return (
    <div style={{ padding: '0 16px 16px' }} className="row gap-10">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={it.onClick}
          className="press"
          style={{
            flex: 1,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '12px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: it.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: it.color,
            }}
          >
            <Ic name={it.icon} size={20} />
          </div>
          <span className="t-body-s fg-strong" style={{ fontWeight: 600 }}>
            {it.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SummaryCards() {
  return (
    <div style={{ padding: '0 16px 14px' }} className="row gap-10">
      <div className="card" style={{ flex: 1, padding: 14 }}>
        <span className="t-body-s fg-alt">이번 주 주문</span>
        <div className="row" style={{ alignItems: 'baseline', gap: 4, marginTop: 6 }}>
          <span className="t-num-big fg-strong" style={{ fontSize: 28 }}>
            4
          </span>
          <span className="t-body-m fg-alt">건</span>
        </div>
        <span className="t-body-s fg-green" style={{ fontWeight: 600, marginTop: 4 }}>
          ↑ 1건 전주 대비
        </span>
      </div>
      <div
        className="card"
        style={{
          flex: 1,
          padding: 14,
          background: 'var(--red-soft)',
          borderColor: 'rgba(255,66,66,0.18)',
        }}
      >
        <span className="t-body-s fg-red" style={{ fontWeight: 600 }}>
          ⚠ 미결제 금액
        </span>
        <div className="row" style={{ alignItems: 'baseline', gap: 2, marginTop: 6 }}>
          <span className="t-num-big fg-strong" style={{ fontSize: 24 }}>
            220,000
          </span>
          <span className="t-body-m fg-alt">원</span>
        </div>
        <span className="t-body-s fg-red" style={{ fontWeight: 600, marginTop: 4 }}>
          결제 마감 D-3
        </span>
      </div>
    </div>
  );
}

function AIBanner() {
  return (
    <div style={{ padding: '0 16px 14px' }}>
      <div
        className="press"
        style={{
          padding: '14px 16px',
          borderRadius: 16,
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #4F86F2 0%, #1F6FEB 50%, #0B4ED9 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 6px 16px rgba(31,111,235,0.25)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ic name="sparkles" size={22} color="#fff" strokeWidth={2} />
        </div>
        <div className="col grow gap-4" style={{ minWidth: 0 }}>
          <span className="t-body-s" style={{ opacity: 0.92, fontWeight: 600 }}>
            💡 AI 추천
          </span>
          <span className="t-body-l" style={{ fontWeight: 700 }}>
            이번 주 발주 시점이 다가왔어요
          </span>
        </div>
        <Ic name="chev" size={20} color="#fff" />
      </div>
    </div>
  );
}

function RecentOrderCard({ onReorder }) {
  return (
    <div style={{ padding: '0 16px 14px' }}>
      <div className="row between" style={{ marginBottom: 10 }}>
        <span className="t-title-s fg-strong">최근 주문</span>
        <span className="t-body-s fg-alt">5월 6일</span>
      </div>
      <div className="card" style={{ padding: 14 }}>
        <div className="row gap-10">
          <div className="row" style={{ gap: -10, position: 'relative' }}>
            {['TERA-500-B', 'CASS-500-B', 'CHUM-360-B'].map((sku, i) => (
              <div key={sku} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }}>
                <ProductTile p={byId(sku)} />
              </div>
            ))}
          </div>
          <div className="col grow gap-4" style={{ minWidth: 0 }}>
            <span className="t-body-m fg-strong" style={{ fontWeight: 600 }}>
              테라 외 4개
            </span>
            <span className="t-body-s fg-alt">총 17박스 · 312,400원</span>
          </div>
        </div>
        <button className="cta press" style={{ marginTop: 12, height: 48 }} onClick={onReorder}>
          <Ic name="refresh" size={18} color="#fff" strokeWidth={2.2} />
          다시 주문하기
        </button>
      </div>
    </div>
  );
}

function Categories() {
  const cats = [
    { name: '맥주', emoji: '🍺', bg: '#FFF7E6' },
    { name: '소주', emoji: '🍶', bg: '#E6F8FF' },
    { name: '위스키', emoji: '🥃', bg: '#E8F0FE' },
    { name: '와인', emoji: '🍷', bg: '#FBE8EC' },
    { name: '사케', emoji: '🍙', bg: '#F4ECFB' },
    { name: '기타', emoji: '🧊', bg: '#EFF1F5' },
  ];
  return (
    <div style={{ padding: '0 16px' }}>
      <span className="t-title-s fg-strong" style={{ marginBottom: 10, display: 'block' }}>
        카테고리
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {cats.map((c) => (
          <button
            key={c.name}
            className="press card tight"
            style={{
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: c.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              {c.emoji}
            </div>
            <span className="t-body-s fg-strong" style={{ fontWeight: 600 }}>
              {c.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ title, subtitle, right, children }) {
  return (
    <div style={{ padding: '20px 16px 0' }}>
      {title && (
        <div className="row between" style={{ marginBottom: 10 }}>
          <div className="col gap-4">
            <span className="t-title-s fg-strong">{title}</span>
            {subtitle && <span className="t-body-s fg-alt">{subtitle}</span>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function DateStrip({ selected, onChange }) {
  const days = [
    { d: 13, w: '오늘', dis: true },
    { d: 14, w: '목', label: '내일' },
    { d: 15, w: '금' },
    { d: 16, w: '토' },
    { d: 17, w: '일', dis: true },
    { d: 18, w: '월' },
    { d: 19, w: '화' },
  ];
  return (
    <div className="h-scroll no-scrollbar" style={{ margin: '0 -16px', padding: '0 16px' }}>
      {days.map((day) => {
        const sel = selected === day.d;
        return (
          <button
            key={day.d}
            onClick={() => !day.dis && onChange(day.d)}
            style={{
              width: 64,
              height: 80,
              flexShrink: 0,
              borderRadius: 14,
              background: sel ? 'var(--brand)' : day.dis ? 'var(--bg-cool)' : 'var(--surface)',
              border: sel ? 'none' : '1px solid var(--line)',
              color: sel ? '#fff' : day.dis ? 'var(--fg-dim)' : 'var(--fg-strong)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              opacity: day.dis ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>{day.label || day.w}</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{day.d}</span>
            <span style={{ fontSize: 10, opacity: 0.65 }}>5월</span>
          </button>
        );
      })}
    </div>
  );
}
