// Flow 1 V2: 추천 기반 2탭 재주문 — 홈(추천 hero) → 추천 리스트 → 발주 확정
import React, { useState, useMemo } from 'react';
import { rem } from '../lib/rem.js';
import { byId, fmtWon } from '../data/products.js';
import { reco, recoTotal, recoUnits } from '../data/reco.js';
import { Ic } from '../components/Icons.jsx';
import { TabBar, ProductTile, Stepper, PageNav, BottomBar } from '../components/Primitives.jsx';

export function RecoFlowV2() {
  const [screen, setScreen] = useState('home');
  const [source, setSource] = useState('ai');
  const [qtys, setQtys] = useState({});
  const [addonOn, setAddonOn] = useState({});

  const sourceData = useMemo(() => {
    if (source === 'ai') {
      return {
        kind: 'ai',
        title: '이번 주 권장 발주',
        items: reco.current.items.map((it) => ({ ...it })),
        confidence: reco.current.confidence,
        reasonShort: reco.current.reasonShort,
        reasonLong: reco.current.reasonLong,
      };
    }
    const b = reco.bundles.find((x) => x.id === source);
    return {
      kind: 'bundle',
      bundle: b,
      title: b.name,
      items: b.items.map((it) => ({ ...it, avg4w: it.qty, lastWeek: it.qty, trend: 0, conf: 'high' })),
      confidence: null,
      reasonShort: `묶음 발주 · ${b.usage}`,
      reasonLong: b.sub,
    };
  }, [source]);

  const enterReco = (src) => {
    setSource(src);
    const data = src === 'ai' ? reco.current.items : reco.bundles.find((b) => b.id === src).items;
    setQtys(Object.fromEntries(data.map((it) => [it.sku, it.qty])));
    setAddonOn({});
    setScreen('reco');
  };

  if (screen === 'home') return <HomeV2 onReco={() => enterReco('ai')} onBundle={(id) => enterReco(id)} />;
  if (screen === 'reco')
    return (
      <RecoListV2
        data={sourceData}
        qtys={qtys}
        setQtys={setQtys}
        addonOn={addonOn}
        setAddonOn={setAddonOn}
        onBack={() => setScreen('home')}
        onConfirm={() => setScreen('done')}
      />
    );
  if (screen === 'done')
    return <DoneV2 data={sourceData} qtys={qtys} addonOn={addonOn} onHome={() => setScreen('home')} />;
  return null;
}

function HomeV2({ onReco, onBundle }) {
  const r = reco.current;
  const total = recoTotal(r.items);
  const ctx = reco.context;
  return (
    <div className="screen">
      <div className="screen-scroll screen-bottom-pad" style={{ background: 'var(--bg)' }}>
        <div style={{ padding: '8px 16px 12px' }} className="row between">
          <div className="col gap-2">
            <span className="t-body-s fg-alt">하이트진로 직납 · 강북지점 · 23:32</span>
            <span className="t-title-m fg-strong">사장님, 늦은 시간 수고하셨어요 👋</span>
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

        <div style={{ padding: '0 16px 18px' }}>
          <RecoHeroCard reco={r} total={total} ctx={ctx} onTap={onReco} />
        </div>

        <div style={{ paddingLeft: 16, marginBottom: 22 }}>
          <div className="row between" style={{ paddingRight: 16, marginBottom: 12 }}>
            <div className="col gap-2">
              <span className="t-title-s fg-strong">묶음 발주</span>
              <span className="t-body-s fg-alt">자주 함께 주문한 SKU를 한 번에</span>
            </div>
            <span className="t-body-s fg-brand" style={{ fontWeight: 600 }}>
              전체
            </span>
          </div>
          <div className="h-scroll no-scrollbar" style={{ gap: 10, paddingRight: 16, paddingBottom: 4 }}>
            {reco.bundles.map((b) => (
              <BundleCard key={b.id} b={b} onTap={() => onBundle(b.id)} />
            ))}
            <NewBundleCard />
          </div>
        </div>

        <div style={{ padding: '0 16px 18px' }}>
          <EvolveCard />
        </div>

        <div style={{ padding: '0 16px 18px' }}>
          <span className="t-title-s fg-strong" style={{ display: 'block', marginBottom: 10 }}>
            다른 발주 방식
          </span>
          <div className="row gap-10">
            {[
              { icon: 'heart', label: '즐겨찾기', color: '#FF4242', bg: '#fff0f0' },
              { icon: 'scan', label: '스캔 발주', color: '#0066FF', bg: '#eaf2fe' },
              { icon: 'list', label: '전체 카테고리', color: '#00A636', bg: '#e6fff0' },
              { icon: 'receipt', label: '발주서', color: '#46474c', bg: '#f4f4f5' },
            ].map((it) => (
              <button
                key={it.label}
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
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          <div
            className="card"
            style={{
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--red-soft)',
              borderColor: 'rgba(255,66,66,0.2)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,66,66,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ic name="warn" size={18} color="var(--red)" />
            </div>
            <div className="col grow gap-2" style={{ minWidth: 0 }}>
              <span className="t-body-s" style={{ color: 'var(--red)', fontWeight: 700 }}>
                미결제 220,000원 · 결제 마감 D-3
              </span>
              <span className="t-body-s fg-alt">5월 16일까지 결제 권장</span>
            </div>
            <Ic name="chev" size={18} color="var(--fg-assist)" />
          </div>
        </div>
      </div>
      <TabBar active="home" />
    </div>
  );
}

function RecoHeroCard({ reco: r, total, ctx, onTap }) {
  const previewSkus = r.items.slice(0, 5).map((it) => it.sku);
  return (
    <div
      className="press"
      onClick={onTap}
      style={{
        borderRadius: 20,
        cursor: 'pointer',
        background: 'linear-gradient(155deg, #5B8DEF 0%, #1F6FEB 55%, #0B4ED9 100%)',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 12px 28px rgba(31,111,235,0.32)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -60,
          right: -50,
          width: 180,
          height: 180,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -90,
          left: -30,
          width: 200,
          height: 200,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div style={{ position: 'relative', padding: '18px 18px 16px' }}>
        <div className="row between" style={{ marginBottom: 10 }}>
          <div className="row gap-6">
            <Ic name="sparkles" size={16} color="#fff" strokeWidth={2.2} />
            <span style={{ fontSize: rem(12), fontWeight: 700, letterSpacing: '0.02em', opacity: 0.95 }}>AI 추천 발주</span>
          </div>
          <div
            className="row gap-4"
            style={{
              padding: '4px 8px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: 999, background: '#4ADE80' }} />
            <span style={{ fontSize: rem(11), fontWeight: 700 }}>패턴 일치 {r.confidence}%</span>
          </div>
        </div>
        <div className="col" style={{ gap: 4, marginBottom: 14 }}>
          <span style={{ fontSize: rem(19), fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            이번 주 권장 발주가 준비됐어요
          </span>
          <span style={{ fontSize: rem(13), opacity: 0.88, lineHeight: 1.4 }}>{r.reasonLong}</span>
        </div>
        <div className="row" style={{ gap: 0, marginBottom: 14 }}>
          {previewSkus.map((sku, i) => (
            <div
              key={sku}
              style={{
                marginLeft: i === 0 ? 0 : -8,
                zIndex: 10 - i,
                boxShadow: '0 0 0 2px rgba(31,111,235,0.8)',
                borderRadius: 10,
              }}
            >
              <ProductTile p={byId(sku)} />
            </div>
          ))}
          <div className="col" style={{ marginLeft: 12, flex: 1, justifyContent: 'center', gap: 2 }}>
            <span style={{ fontSize: rem(11), opacity: 0.85, fontWeight: 600 }}>5개 SKU · 17박스 · 360병</span>
            <span style={{ fontSize: rem(22), fontWeight: 800, letterSpacing: '-0.02em' }}>{fmtWon(total)}</span>
          </div>
        </div>
        <div
          className="row between"
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="row gap-8">
            <Ic name="truck" size={16} color="#fff" strokeWidth={2} />
            <span style={{ fontSize: rem(13), fontWeight: 600 }}>
              {ctx.deliveryDate} {ctx.deliveryWindow} 도착
            </span>
          </div>
          <div className="row gap-4">
            <span style={{ fontSize: rem(13), fontWeight: 700 }}>확인하기</span>
            <Ic name="chev" size={16} color="#fff" strokeWidth={2.4} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BundleCard({ b, onTap }) {
  const total = recoTotal(b.items);
  const units = recoUnits(b.items);
  return (
    <button
      className="press"
      onClick={onTap}
      style={{
        width: 220,
        minHeight: 178,
        textAlign: 'left',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: b.tone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: rem(22),
          }}
        >
          {b.emoji}
        </div>
        {b.badge && <span className="badge brand">{b.badge}</span>}
      </div>
      <div className="col gap-2">
        <span className="t-title-s fg-strong" style={{ fontSize: rem(16) }}>
          {b.name}
        </span>
        <span className="t-body-s fg-alt">{b.sub}</span>
      </div>
      <div className="row" style={{ gap: -4, marginTop: 'auto', marginBottom: 4 }}>
        {b.items.slice(0, 4).map((it, i) => (
          <div key={it.sku} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: `linear-gradient(160deg, ${byId(it.sku).color}, ${byId(it.sku).accent})`,
                border: '2px solid var(--surface)',
                flexShrink: 0,
              }}
            />
          </div>
        ))}
        <span className="t-body-s fg-alt" style={{ marginLeft: 8, alignSelf: 'center' }}>
          {b.items.length}종 · {units}박스
        </span>
      </div>
      <div className="divider" />
      <div className="row between">
        <span className="t-body-s fg-alt">{b.usage}</span>
        <span className="t-label fg-strong">{fmtWon(total)}</span>
      </div>
    </button>
  );
}

function NewBundleCard() {
  return (
    <button
      className="press"
      style={{
        width: 160,
        minHeight: 178,
        background: 'transparent',
        border: '1.5px dashed var(--line-strong)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: 'var(--fg-alt)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: 'var(--bg-cool)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-neutral)',
        }}
      >
        <Ic name="plus" size={22} color="var(--fg-neutral)" strokeWidth={2.2} />
      </div>
      <span className="t-body-m" style={{ fontWeight: 600, color: 'var(--fg-neutral)' }}>
        내 묶음 만들기
      </span>
      <span className="t-body-s fg-alt" style={{ textAlign: 'center', padding: '0 12px' }}>
        장바구니에서 저장
      </span>
    </button>
  );
}

function EvolveCard() {
  const { dormant, promoted, candidate } = reco.evolution;
  const promotedP = byId(promoted.sku);
  const candidateP = byId(candidate.sku);
  return (
    <div className="card" style={{ padding: '4px 0', overflow: 'hidden' }}>
      <div className="row between" style={{ padding: '12px 16px 8px' }}>
        <div className="col gap-2">
          <span className="t-title-s fg-strong">즐겨찾기 진화</span>
          <span className="t-body-s fg-alt">발주 패턴 기반 자동 정리</span>
        </div>
        <span className="badge brand">3</span>
      </div>
      <div className="divider" />
      <EvolveRow icon="warn" tone="amber" title={`잠자는 즐겨찾기 ${dormant.count}개`} sub="4주 이상 발주 없음 · 정리할까요?" action="정리" />
      <div className="divider" />
      <EvolveRow icon="trend" tone="green" title={`'${promotedP.name}'이(가) 주력으로 승격`} sub="최근 4주 매주 발주 · 상단 고정" action="확인" />
      <div className="divider" />
      <EvolveRow icon="plus" tone="brand" title={`'${candidateP.name}' 즐겨찾기 추가`} sub={candidate.reason} action="추가" />
    </div>
  );
}

function EvolveRow({ icon, tone, title, sub, action }) {
  const tones = {
    amber: { bg: '#fff7e6', c: '#b86c00' },
    green: { bg: '#e6fff0', c: '#00892e' },
    brand: { bg: 'var(--brand-soft)', c: 'var(--brand-strong)' },
  };
  const t = tones[tone];
  return (
    <button
      className="press"
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px 16px',
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
          background: t.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: t.c,
        }}
      >
        <Ic name={icon} size={18} strokeWidth={2} />
      </div>
      <div className="col grow gap-2" style={{ minWidth: 0 }}>
        <span className="t-body-m fg-strong" style={{ fontWeight: 600 }}>
          {title}
        </span>
        <span className="t-body-s fg-alt">{sub}</span>
      </div>
      <span className="t-body-s" style={{ color: t.c, fontWeight: 700 }}>
        {action}
      </span>
    </button>
  );
}

function RecoListV2({ data, qtys, setQtys, addonOn, setAddonOn, onBack, onConfirm }) {
  const subtotal = data.items.reduce(
    (s, it) => s + byId(it.sku).boxPrice * (qtys[it.sku] ?? it.qty),
    0
  );
  const addonSubtotal = reco.current.addOns.reduce(
    (s, a) => s + (addonOn[a.sku] ? byId(a.sku).boxPrice * a.qty : 0),
    0
  );
  const total = subtotal + addonSubtotal;
  const vat = Math.round(total * 0.1);
  const grandTotal = total + vat;
  const totalUnits =
    data.items.reduce((s, it) => s + (qtys[it.sku] ?? it.qty), 0) +
    reco.current.addOns.reduce((s, a) => s + (addonOn[a.sku] ? a.qty : 0), 0);

  const ctx = reco.context;
  const creditAfter = ctx.creditUsed + grandTotal;
  const creditPct = Math.min(100, (creditAfter / ctx.creditLimit) * 100);
  const overLimit = creditAfter > ctx.creditLimit;
  const cutoffPassed = ctx.nowHour >= ctx.cutoff;

  return (
    <div className="screen">
      <PageNav
        title={data.title}
        onBack={onBack}
        right={
          <button
            className="press"
            style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ic name="info" size={20} color="var(--fg-neutral)" />
          </button>
        }
      />
      <div className="screen-scroll no-status-pad" style={{ paddingTop: 0, paddingBottom: 132 }}>
        <div style={{ padding: '14px 16px 0' }}>
          <ReasoningCard data={data} />
        </div>

        <div style={{ padding: '14px 16px 0' }} className="col gap-8">
          <GuardCutoff cutoffPassed={cutoffPassed} ctx={ctx} />
          <GuardCredit ctx={ctx} after={creditAfter} pct={creditPct} over={overLimit} />
        </div>

        <div style={{ padding: '20px 16px 0' }}>
          <div className="row between" style={{ marginBottom: 10 }}>
            <span className="t-title-s fg-strong">발주 상품 ({data.items.length}개)</span>
            <span className="t-body-s fg-alt">박스 단위</span>
          </div>
          <div className="col gap-8">
            {data.items.map((it) => (
              <PatternRow
                key={it.sku}
                it={it}
                qty={qtys[it.sku] ?? it.qty}
                onQty={(v) => setQtys((q) => ({ ...q, [it.sku]: v }))}
                showPattern={data.kind === 'ai'}
              />
            ))}
          </div>
        </div>

        {data.kind === 'ai' && reco.current.addOns.length > 0 && (
          <div style={{ padding: '24px 16px 0' }}>
            <div className="col gap-2" style={{ marginBottom: 10 }}>
              <span className="t-title-s fg-strong">함께 자주 주문해요</span>
              <span className="t-body-s fg-alt">최근 4주 동시 발주 패턴 기반</span>
            </div>
            <div className="col gap-8">
              {reco.current.addOns.map((a) => (
                <AddonRow
                  key={a.sku}
                  addon={a}
                  on={!!addonOn[a.sku]}
                  onToggle={() => setAddonOn((s) => ({ ...s, [a.sku]: !s[a.sku] }))}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '24px 16px 0' }}>
          <div className="col gap-2" style={{ marginBottom: 10 }}>
            <span className="t-title-s fg-strong">배송 · 결제</span>
            <span className="t-body-s fg-alt">지난 발주와 동일 · 변경하려면 탭</span>
          </div>
          <div className="card">
            <SettingRow icon="truck" label="배송 희망일" value={`${ctx.deliveryDate} ${ctx.deliveryWindow}`} />
            <div className="divider" />
            <SettingRow icon="map" label="배송지" value="은평 삼겹살집 · 서울 은평구 갈현로 12" />
            <div className="divider" />
            <SettingRow icon="money" label="결제 수단" value="외상 · 월말 일괄 정산" />
          </div>
        </div>

        <div style={{ padding: '20px 16px 0' }}>
          <div className="card" style={{ padding: '14px 16px' }}>
            <div className="col gap-10">
              <div className="row between">
                <span className="t-body-m fg-alt">소계 ({totalUnits}박스)</span>
                <span className="t-body-m fg-strong">{fmtWon(total)}</span>
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
                <span className="t-title-m fg-brand">{fmtWon(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar>
        <div className="col grow gap-2" style={{ minWidth: 0 }}>
          <span className="t-body-s fg-alt">
            {totalUnits}박스 · {ctx.deliveryDate} 도착
          </span>
          <span className="t-title-m fg-strong">{fmtWon(grandTotal)}</span>
        </div>
        <button
          className="cta press"
          style={{ width: 'auto', padding: '0 24px', ...(overLimit ? { background: 'var(--bg-neutral)', color: 'var(--fg-assist)', pointerEvents: 'none' } : {}) }}
          onClick={onConfirm}
        >
          {overLimit ? '한도 초과' : '발주 확정하기'}
        </button>
      </BottomBar>
    </div>
  );
}

function ReasoningCard({ data }) {
  if (data.kind === 'ai') {
    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: 14,
          background: 'var(--brand-soft)',
          border: '1px solid var(--brand-soft)',
          display: 'flex',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Ic name="sparkles" size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <div className="col grow gap-4">
          <div className="row gap-6">
            <span className="t-body-s fg-brand" style={{ fontWeight: 700 }}>
              AI 추천 · 패턴 일치 {data.confidence}%
            </span>
          </div>
          <span className="t-body-m fg-strong" style={{ fontWeight: 600 }}>
            {data.reasonLong}
          </span>
          <span className="t-body-s fg-alt">수량은 사장님이 자유롭게 조정할 수 있어요</span>
        </div>
      </div>
    );
  }
  const b = data.bundle;
  return (
    <div style={{ padding: '14px 16px', borderRadius: 14, background: b.tone, display: 'flex', gap: 12, alignItems: 'center' }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: rem(24),
        }}
      >
        {b.emoji}
      </div>
      <div className="col grow gap-4">
        <span className="t-body-s fg-alt" style={{ fontWeight: 600 }}>
          묶음 발주
        </span>
        <span className="t-body-m fg-strong" style={{ fontWeight: 600 }}>
          {b.sub}
        </span>
        <span className="t-body-s fg-alt">
          {b.usage} · 마지막 사용 {b.lastUsed}
        </span>
      </div>
    </div>
  );
}

function GuardCutoff({ cutoffPassed, ctx }) {
  if (!cutoffPassed) return null;
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 12,
        background: '#fff7e6',
        border: '1px solid rgba(255,155,0,0.3)',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <Ic name="clock" size={18} color="#b86c00" strokeWidth={2} />
      <div className="col grow gap-2">
        <span className="t-body-s" style={{ color: '#b86c00', fontWeight: 700 }}>
          {ctx.cutoff}시 마감 시간 지났어요
        </span>
        <span className="t-body-s fg-neutral">
          지금 발주하면{' '}
          <b style={{ fontWeight: 700 }}>
            {ctx.deliveryDate} {ctx.deliveryWindow}
          </b>{' '}
          도착 예정
        </span>
      </div>
    </div>
  );
}

function GuardCredit({ ctx, after, pct, over }) {
  const used = ctx.creditUsed;
  const limit = ctx.creditLimit;
  const usedPct = (used / limit) * 100;
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 12,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="row gap-8">
          <Ic name="money" size={18} color="var(--fg-neutral)" strokeWidth={2} />
          <span className="t-body-s fg-strong" style={{ fontWeight: 700 }}>
            외상 한도
          </span>
        </div>
        <span className="t-body-s fg-neutral" style={{ fontWeight: 600 }}>
          {fmtWon(used)}{' '}
          <span className="fg-alt" style={{ fontWeight: 400 }}>
            / {fmtWon(limit)}
          </span>
        </span>
      </div>
      <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--bg-neutral)', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: pct + '%',
            background: over ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--brand)',
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: usedPct + '%',
            background: over ? 'var(--red)' : usedPct > 80 ? 'var(--amber)' : 'var(--brand)',
          }}
        />
      </div>
      <div className="row between">
        <span className="t-body-s fg-alt">이번 발주 후 {Math.round(pct)}% 사용</span>
        <span
          className="t-body-s"
          style={{
            color: over ? 'var(--red)' : pct > 80 ? '#b86c00' : 'var(--fg-strong)',
            fontWeight: 700,
          }}
        >
          {over ? '⚠ 한도 초과' : `잔여 ${fmtWon(limit - after)}`}
        </span>
      </div>
    </div>
  );
}

function PatternRow({ it, qty, onQty, showPattern }) {
  const p = byId(it.sku);
  const bottlesPerBox = parseInt((p.sub.match(/(\d+)병\/박스/) || [])[1] || '20');
  const bottles = qty * bottlesPerBox;
  const change = qty - it.qty;
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
        <ProductTile p={p} />
        <div className="col grow gap-4" style={{ minWidth: 0 }}>
          <div className="row between" style={{ gap: 8 }}>
            <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
              {p.name}
            </span>
            {it.conf === 'high' && showPattern && <span className="badge green">패턴↑</span>}
          </div>
          <span className="t-body-s fg-alt">{p.sub}</span>
          {showPattern && (
            <div className="row gap-8" style={{ marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <Sparkline data={it.sparkline} suggested={it.qty} />
              <span className="t-body-s fg-alt">
                4주 평균{' '}
                <b className="fg-strong" style={{ fontWeight: 600 }}>
                  {it.avg4w}박스
                </b>
                {' · '}지난주{' '}
                <b className="fg-strong" style={{ fontWeight: 600 }}>
                  {it.lastWeek}박스
                </b>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="divider" style={{ margin: '12px 0' }} />
      <div className="row between" style={{ gap: 8 }}>
        <div className="col gap-2">
          <span className="t-body-s fg-alt">수량 (= {bottles}병)</span>
          <Stepper value={qty} onChange={onQty} />
        </div>
        <div className="col" style={{ alignItems: 'flex-end', gap: 2 }}>
          {change !== 0 && (
            <span
              className="badge"
              style={{
                background: change > 0 ? 'var(--brand-soft)' : 'var(--bg-cool)',
                color: change > 0 ? 'var(--brand-strong)' : 'var(--fg-neutral)',
              }}
            >
              추천 대비 {change > 0 ? '+' : ''}
              {change}박스
            </span>
          )}
          <span className="t-body-l fg-strong" style={{ fontWeight: 700 }}>
            {fmtWon(p.boxPrice * qty)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ data, suggested }) {
  const W = 60, H = 22;
  const max = Math.max(...data, suggested) * 1.1;
  const min = Math.min(...data, suggested) * 0.7;
  const step = W / (data.length - 1 + 0.6);
  const y = (v) => H - 3 - ((v - min) / (max - min || 1)) * (H - 6);
  const d = data.map((v, i) => (i === 0 ? 'M' : 'L') + i * step + ',' + y(v)).join(' ');
  const lastX = data.length * step;
  return (
    <svg width={W + 12} height={H} viewBox={`0 0 ${W + 12} ${H}`} style={{ flexShrink: 0 }}>
      <path d={d} stroke="var(--fg-alt)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={i * step} cy={y(v)} r="1.8" fill="var(--fg-alt)" />
      ))}
      <circle cx={lastX} cy={y(suggested)} r="3" fill="var(--brand)" stroke="var(--surface)" strokeWidth="1.5" />
    </svg>
  );
}

function AddonRow({ addon, on, onToggle }) {
  const p = byId(addon.sku);
  return (
    <button
      onClick={onToggle}
      className="press"
      style={{
        width: '100%',
        textAlign: 'left',
        background: on ? 'var(--brand-tint)' : 'var(--surface)',
        border: '1px solid ' + (on ? 'var(--brand)' : 'var(--line)'),
        borderRadius: 14,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <ProductTile p={p} />
      <div className="col grow gap-2" style={{ minWidth: 0 }}>
        <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
          {p.name}
        </span>
        <span className="t-body-s fg-alt">{addon.reason}</span>
        <span className="t-body-s fg-strong" style={{ fontWeight: 600 }}>
          {addon.qty}박스 · {fmtWon(p.boxPrice * addon.qty)}
        </span>
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background: on ? 'var(--brand)' : 'var(--surface)',
          border: on ? 'none' : '1.5px solid var(--line-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {on ? (
          <Ic name="check" size={16} color="#fff" strokeWidth={2.6} />
        ) : (
          <Ic name="plus" size={16} color="var(--fg-neutral)" strokeWidth={2.2} />
        )}
      </div>
    </button>
  );
}

function SettingRow({ icon, label, value }) {
  return (
    <button
      className="press"
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
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
          background: 'var(--bg-cool)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-neutral)',
        }}
      >
        <Ic name={icon} size={18} />
      </div>
      <div className="col grow gap-2" style={{ minWidth: 0 }}>
        <span className="t-body-s fg-alt">{label}</span>
        <span
          className="t-body-m fg-strong"
          style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {value}
        </span>
      </div>
      <span className="t-body-s fg-brand" style={{ fontWeight: 600 }}>
        변경
      </span>
    </button>
  );
}

function DoneV2({ data, qtys, addonOn, onHome }) {
  const items = data.items.map((it) => ({ ...it, qty: qtys[it.sku] ?? it.qty }));
  const addons = reco.current.addOns.filter((a) => addonOn[a.sku]);
  const all = [...items, ...addons];
  const total = all.reduce((s, it) => s + byId(it.sku).boxPrice * it.qty, 0);
  const grand = Math.round(total * 1.1);
  const ctx = reco.context;
  return (
    <div className="screen" style={{ background: 'var(--bg-elev)' }}>
      <div className="screen-scroll no-status-pad" style={{ paddingTop: 60, paddingBottom: 130 }}>
        <div className="col" style={{ alignItems: 'center', padding: '24px 24px 8px', gap: 14 }}>
          <div
            className="fade-up"
            style={{
              width: 80,
              height: 80,
              borderRadius: 999,
              background: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 24px rgba(31,111,235,0.32)',
            }}
          >
            <Ic name="check" size={44} color="#fff" strokeWidth={2.8} />
          </div>
          <div className="col" style={{ alignItems: 'center', gap: 4 }}>
            <span className="t-title-l fg-strong">발주 완료! 🎉</span>
            <span className="t-body-l fg-alt">
              {ctx.deliveryDate} {ctx.deliveryWindow} 도착 예정
            </span>
          </div>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#fff7e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b86c00',
              }}
            >
              <Ic name="clock" size={20} />
            </div>
            <div className="col grow gap-2" style={{ minWidth: 0 }}>
              <span className="t-body-s fg-alt">취소 가능 시간</span>
              <span className="t-body-m fg-strong" style={{ fontWeight: 700 }}>
                {ctx.cancelUntil}까지 · 8시간 26분 남음
              </span>
            </div>
            <span className="t-body-s" style={{ color: '#b86c00', fontWeight: 700 }}>
              취소
            </span>
          </div>
        </div>

        <div style={{ padding: '12px 16px 0' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: 'var(--brand-soft)',
              border: '1px solid var(--brand-soft)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ic name="sparkles" size={20} color="#fff" strokeWidth={2.2} />
            </div>
            <div className="col grow gap-2" style={{ minWidth: 0 }}>
              <span className="t-body-s fg-brand" style={{ fontWeight: 700 }}>
                다음 추천 발주일
              </span>
              <span className="t-body-m fg-strong" style={{ fontWeight: 600 }}>
                5월 20일(화) 발주 권장
              </span>
            </div>
            <button
              className="press"
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: 'var(--brand-soft)',
                color: 'var(--brand-strong)',
                fontSize: rem(13),
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Ic name="bell" size={14} color="var(--brand-strong)" strokeWidth={2.2} /> 알림
            </button>
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
              {all.slice(0, 4).map((it, i) => {
                const p = byId(it.sku);
                return (
                  <div key={it.sku + i} className="row between">
                    <span className="t-body-m fg-strong">
                      {p.name} × {it.qty}박스
                    </span>
                    <span className="t-body-m fg-alt">{fmtWon(p.boxPrice * it.qty)}</span>
                  </div>
                );
              })}
              {all.length > 4 && <span className="t-body-s fg-alt">외 {all.length - 4}개 상품</span>}
            </div>
            <div className="divider" style={{ margin: '14px 0' }} />
            <div className="row between">
              <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                총 결제 금액
              </span>
              <span className="t-title-m fg-brand">{fmtWon(grand)}</span>
            </div>
          </div>

          <button
            className="press"
            style={{
              marginTop: 12,
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
              <Ic name="star" size={20} />
            </div>
            <div className="col grow gap-2" style={{ alignItems: 'flex-start' }}>
              <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                이 발주를 묶음으로 저장
              </span>
              <span className="t-body-s fg-alt">다음에 1탭으로 동일 발주</span>
            </div>
            <Ic name="chev" size={20} color="var(--fg-assist)" />
          </button>

          <button
            className="press"
            style={{
              marginTop: 8,
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
                background: '#eaf2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blue)',
              }}
            >
              <Ic name="receipt" size={20} />
            </div>
            <div className="col grow gap-2" style={{ alignItems: 'flex-start' }}>
              <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                발주서 자동 발급 완료
              </span>
              <span className="t-body-s fg-alt">PDF · 앱 내 보관</span>
            </div>
            <Ic name="chev" size={20} color="var(--fg-assist)" />
          </button>

          <div className="row gap-8" style={{ marginTop: 20 }}>
            <button className="cta secondary" onClick={onHome}>
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
