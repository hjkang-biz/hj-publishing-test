// Flow 3: 다점포 컨트롤 타워 — 박준혁 사장님 · 3매장 통합 대시보드
import React, { useState } from 'react';
import { rem } from '../lib/rem.js';
import { byId, stores, fmtWon } from '../data/products.js';
import { Ic } from '../components/Icons.jsx';
import { ProductTile } from '../components/Primitives.jsx';

export function MultiStoreFlow() {
  const [tab, setTab] = useState('all');
  const sumOrders = stores.reduce((s, x) => s + x.todayOrders, 0);
  const sumPending = stores.reduce((s, x) => s + x.pendingDeliveries, 0);
  const sumCredit = stores.reduce((s, x) => s + x.creditUsed, 0);
  const sumLimit = stores.reduce((s, x) => s + x.creditLimit, 0);
  const sumRev = stores.reduce((s, x) => s + x.monthRevenue, 0);
  const visible = tab === 'all' ? stores : stores.filter((s) => s.id === tab);

  return (
    <div className="screen" style={{ background: 'var(--bg)' }}>
      <div className="screen-scroll screen-bottom-pad" style={{ paddingTop: 50 }}>
        <div
          style={{
            background: 'linear-gradient(160deg, #1F2024 0%, #0E0F10 100%)',
            padding: '14px 16px 92px',
            color: '#fff',
            position: 'relative',
          }}
        >
          <div className="row between" style={{ marginBottom: 18 }}>
            <div className="col">
              <span
                style={{
                  fontSize: rem(12),
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                }}
              >
                다점포 컨트롤 타워
              </span>
              <div className="row gap-8" style={{ marginTop: 4, alignItems: 'baseline' }}>
                <span style={{ fontSize: rem(22), fontWeight: 700, letterSpacing: '-0.02em' }}>박준혁 사장님</span>
                <span style={{ fontSize: rem(14), color: 'rgba(255,255,255,0.6)' }}>3개 매장</span>
              </div>
            </div>
            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Ic name="bell" size={20} color="#fff" />
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 9,
                  width: 8,
                  height: 8,
                  background: 'var(--brand)',
                  borderRadius: 999,
                }}
              />
            </button>
          </div>

          <div className="row between" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: rem(13), color: 'rgba(255,255,255,0.6)' }}>5월 13일(수) · 영업중</span>
            <button
              className="row gap-4"
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.1)',
                fontSize: rem(12),
                color: '#fff',
                fontWeight: 500,
              }}
            >
              이번 달 <Ic name="chevDown" size={14} color="#fff" />
            </button>
          </div>

          <div className="col" style={{ gap: 4 }}>
            <span style={{ fontSize: rem(12), color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>매장 합계 매출</span>
            <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
              <span className="t-num-big" style={{ fontSize: rem(36), fontWeight: 700, color: '#fff' }}>
                ₩{(sumRev / 10000).toFixed(0)}
                <span style={{ fontSize: rem(22) }}>만</span>
              </span>
              <span
                style={{
                  fontSize: rem(13),
                  fontWeight: 700,
                  color: '#4ADE80',
                  padding: '3px 8px',
                  background: 'rgba(74,222,128,0.15)',
                  borderRadius: 6,
                }}
              >
                +18% 전월
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px', marginTop: -76, position: 'relative', zIndex: 2 }}>
          <div
            className="card"
            style={{
              padding: '16px 4px',
              background: 'var(--surface)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              display: 'flex',
            }}
          >
            <PillStat label="오늘 주문" value={sumOrders} unit="건" trend="+2" />
            <Sep />
            <PillStat label="배송 대기" value={sumPending} unit="건" color="amber" />
            <Sep />
            <PillStat
              label="여신 사용"
              value={Math.round(sumCredit / 10000) + '만'}
              unit=""
              sub={`/${Math.round(sumLimit / 10000)}만`}
            />
          </div>
        </div>

        <div style={{ padding: '20px 16px 0' }}>
          <div
            className="card"
            style={{
              padding: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1px solid var(--brand-soft)',
              background: 'var(--brand-soft)',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ic name="sparkles" size={20} color="#fff" strokeWidth={2} />
            </div>
            <div className="col grow gap-4" style={{ minWidth: 0 }}>
              <span className="t-body-s fg-brand" style={{ fontWeight: 700 }}>
                💡 AI 알림 · 마포점
              </span>
              <span className="t-body-m fg-strong" style={{ fontWeight: 600 }}>
                여신 88% 사용 · 결제 권장
              </span>
            </div>
            <Ic name="chev" size={20} color="var(--fg-assist)" />
          </div>
        </div>

        <div style={{ padding: '24px 16px 0' }}>
          <div className="h-scroll no-scrollbar" style={{ gap: 8, margin: '0 -16px', padding: '0 16px' }}>
            <FilterChip label="전체 매장" active={tab === 'all'} onClick={() => setTab('all')} count={3} />
            {stores.map((s) => (
              <FilterChip key={s.id} label={s.name} active={tab === s.id} onClick={() => setTab(s.id)} />
            ))}
          </div>
        </div>

        <div
          className="r-grid"
          style={{ padding: '14px 16px', '--cols': 1, '--cols-f': 2, '--cols-tl': 3, '--r-gap': '12px' }}
        >
          {visible.map((s) => (
            <StoreCard key={s.id} s={s} />
          ))}
        </div>

        <div style={{ padding: '12px 16px 0' }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <span className="t-title-s fg-strong">매장별 매출 추이</span>
            <span className="t-body-s fg-alt">8주 기준</span>
          </div>
          <div className="card" style={{ padding: '18px 16px' }}>
            <SalesChart stores={stores} />
            <div className="row gap-16" style={{ marginTop: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              {stores.map((s) => (
                <div key={s.id} className="row gap-6">
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: storeColor(s.id) }} />
                  <span className="t-body-s fg-alt">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 16px 0' }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <span className="t-title-s fg-strong">통합 빠른 발주</span>
            <span className="t-body-s fg-brand" style={{ fontWeight: 600 }}>
              전체 보기
            </span>
          </div>
          <div className="r-grid" style={{ '--cols': 1, '--cols-f': 2, '--cols-tl': 3, '--r-gap': '10px' }}>
            {stores.map((s) => {
              const p = byId(s.next.sku);
              return (
                <div
                  key={s.id}
                  className="card"
                  style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ width: 6, height: 56, borderRadius: 999, background: storeColor(s.id) }} />
                  <ProductTile p={p} />
                  <div className="col grow gap-4" style={{ minWidth: 0 }}>
                    <div className="row gap-6" style={{ alignItems: 'center' }}>
                      <span className="t-body-s fg-alt">{s.name}</span>
                      <span className="t-body-s fg-alt">·</span>
                      <span className="t-body-s fg-alt">{s.next.eta}</span>
                    </div>
                    <span className="t-body-l fg-strong" style={{ fontWeight: 600 }}>
                      {p.name} × {s.next.qty}박스
                    </span>
                  </div>
                  <button
                    className="press"
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: 10,
                      background: 'var(--brand-soft)',
                      color: 'var(--brand)',
                      fontSize: rem(13),
                      fontWeight: 700,
                    }}
                  >
                    발주
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '24px 16px 12px' }}>
          <div className="card" style={{ padding: 16, background: 'var(--bg-cool)' }}>
            <div className="row between" style={{ marginBottom: 10 }}>
              <span className="t-title-s fg-strong">정산 일정</span>
              <span className="badge amber">D-3</span>
            </div>
            <div className="row between">
              <div className="col gap-2">
                <span className="t-body-s fg-alt">5월 결제 마감</span>
                <span className="t-num-big" style={{ fontSize: rem(24), color: 'var(--fg-strong)' }}>
                  5월 16일
                </span>
              </div>
              <div className="col" style={{ alignItems: 'flex-end' }}>
                <span className="t-body-s fg-alt">미결제 합계</span>
                <span className="t-num-big fg-red" style={{ fontSize: rem(20) }}>
                  {fmtWon(540000)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashTabBar />
    </div>
  );
}

function PillStat({ label, value, unit, sub, trend, color }) {
  const vColor = color === 'amber' ? 'var(--amber)' : 'var(--fg-strong)';
  return (
    <div className="col" style={{ flex: 1, padding: '0 8px', gap: 4, alignItems: 'flex-start' }}>
      <span className="t-body-s fg-alt">{label}</span>
      <div className="row" style={{ alignItems: 'baseline', gap: 2 }}>
        <span className="t-num-big" style={{ fontSize: rem(22), color: vColor }}>
          {value}
        </span>
        {unit && (
          <span className="t-body-s fg-alt" style={{ marginLeft: 2 }}>
            {unit}
          </span>
        )}
        {sub && (
          <span className="t-body-s fg-alt" style={{ marginLeft: 2 }}>
            {sub}
          </span>
        )}
      </div>
      {trend && (
        <span className="t-body-s fg-green" style={{ fontWeight: 600, fontSize: rem(11) }}>
          ↑ {trend}
        </span>
      )}
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, background: 'var(--line)', alignSelf: 'stretch', margin: '4px 0' }} />;
}

function FilterChip({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="press"
      style={{
        height: 36,
        padding: '0 14px',
        borderRadius: 999,
        background: active ? 'var(--fg-strong)' : 'var(--surface)',
        color: active ? 'var(--invert-fg)' : 'var(--fg-neutral)',
        border: active ? 'none' : '1px solid var(--line)',
        fontSize: rem(13),
        fontWeight: 600,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {label}
      {count && (
        <span
          style={{
            padding: '0 6px',
            borderRadius: 999,
            background: active ? 'var(--invert-faint)' : 'var(--bg-neutral)',
            color: active ? 'var(--invert-fg)' : 'var(--fg-alt)',
            fontSize: rem(11),
            fontWeight: 700,
            height: 18,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StoreCard({ s }) {
  const creditPct = Math.round((s.creditUsed / s.creditLimit) * 100);
  const trendUp = !s.trend.startsWith('-');
  const dot = s.health === 'great' ? 'var(--green)' : s.health === 'warn' ? 'var(--amber)' : 'var(--blue)';
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row between" style={{ marginBottom: 12 }}>
        <div className="row gap-10" style={{ alignItems: 'center' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: dot,
              boxShadow: `0 0 0 4px ${
                dot === 'var(--green)' ? '#e6fff0' : dot === 'var(--amber)' ? '#fff7e6' : '#eaf2fe'
              }`,
            }}
          />
          <div className="col gap-2">
            <span className="t-title-s fg-strong">{s.name}</span>
            <span className="t-body-s fg-alt">{s.region}</span>
          </div>
        </div>
        <span
          className="badge"
          style={{
            background: trendUp ? 'var(--green-soft)' : 'var(--red-soft)',
            color: trendUp ? 'var(--green-on)' : 'var(--red-on)',
          }}
        >
          {trendUp ? <Ic name="trend" size={12} strokeWidth={2.2} /> : <Ic name="trendDown" size={12} strokeWidth={2.2} />}
          {s.trend}
        </span>
      </div>
      <div className="row" style={{ gap: 0, marginBottom: 12 }}>
        <MiniStat label="이번 주" value={s.weekOrders} unit="건" />
        <MiniStat label="이번 달 매출" value={(s.monthRevenue / 10000).toFixed(0) + '만'} unit="" />
        <MiniStat label="배송 대기" value={s.pendingDeliveries} unit="건" red={s.pendingDeliveries >= 3} />
      </div>
      <div className="col gap-6" style={{ marginBottom: 12 }}>
        <div className="row between">
          <span className="t-body-s fg-alt">여신 사용률</span>
          <span className="t-body-s fg-strong" style={{ fontWeight: 600 }}>
            {fmtWon(s.creditUsed)}{' '}
            <span className="fg-alt" style={{ fontWeight: 400 }}>
              / {fmtWon(s.creditLimit)}
            </span>
          </span>
        </div>
        <div className="gauge-track">
          <div className="gauge-fill" style={{ width: creditPct + '%' }} />
        </div>
        <div className="row between">
          <span className="t-body-s fg-alt">{creditPct}% 사용</span>
          {creditPct > 80 && (
            <span className="t-body-s" style={{ color: 'var(--red)', fontWeight: 600 }}>
              한도 임박
            </span>
          )}
        </div>
      </div>
      <div className="row gap-8">
        <button
          className="press"
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            background: 'var(--bg-cool)',
            color: 'var(--fg-strong)',
            fontSize: rem(14),
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Ic name="eye" size={16} /> 상세
        </button>
        <button
          className="press"
          style={{
            flex: 2,
            height: 44,
            borderRadius: 10,
            background: 'var(--brand)',
            color: '#fff',
            fontSize: rem(14),
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Ic name="bolt" size={16} color="#fff" fill="#fff" /> 빠른 발주
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit, red }) {
  return (
    <div className="col" style={{ flex: 1, gap: 2, paddingRight: 8 }}>
      <span className="t-body-s fg-alt" style={{ fontSize: rem(11) }}>
        {label}
      </span>
      <div className="row" style={{ alignItems: 'baseline', gap: 2 }}>
        <span
          className="t-num-big"
          style={{ fontSize: rem(18), color: red ? 'var(--red)' : 'var(--fg-strong)' }}
        >
          {value}
        </span>
        {unit && (
          <span className="t-body-s fg-alt" style={{ fontSize: rem(11) }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function storeColor(id) {
  return id === 'gangnam' ? '#FF6B00' : id === 'mapo' ? '#0066FF' : '#00BF40';
}

function SalesChart({ stores }) {
  const W = 320, H = 130, pad = { l: 24, r: 8, t: 8, b: 22 };
  const all = stores.flatMap((s) => s.sales);
  const max = Math.max(...all) * 1.1;
  const min = Math.min(...all) * 0.85;
  const n = stores[0].sales.length;
  const xStep = (W - pad.l - pad.r) / (n - 1);
  const y = (v) => H - pad.b - ((v - min) / (max - min)) * (H - pad.t - pad.b);
  const x = (i) => pad.l + i * xStep;
  const weeks = ['8주전', '', '', '', '', '', '', '이번주'];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block' }}>
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + t * (H - pad.t - pad.b)}
          y2={pad.t + t * (H - pad.t - pad.b)}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
      ))}
      {weeks.map((w, i) =>
        w ? (
          <text
            key={i}
            x={x(i)}
            y={H - 4}
            fontSize="10"
            fill="var(--fg-alt)"
            textAnchor={i === 0 ? 'start' : 'end'}
          >
            {w}
          </text>
        ) : null
      )}
      {stores.map((s) => {
        const c = storeColor(s.id);
        const d = s.sales.map((v, i) => (i === 0 ? 'M' : 'L') + x(i) + ',' + y(v)).join(' ');
        return (
          <g key={s.id}>
            <path d={d} stroke={c} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {s.sales.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={i === s.sales.length - 1 ? 4 : 2.4} fill={c} />
            ))}
            <text x={x(n - 1) + 6} y={y(s.sales[n - 1]) + 3} fontSize="10" fontWeight="700" fill={c}>
              {s.sales[n - 1]}만
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DashTabBar() {
  const tabs = [
    { id: 'home', icon: 'home', label: '홈' },
    { id: 'orders', icon: 'list', label: '주문관리' },
    { id: 'notice', icon: 'speaker', label: '공지사항' },
    { id: 'me', icon: 'user', label: '내 정보', active: true },
  ];
  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <button key={t.id} className={'tab' + (t.active ? ' active' : '')}>
          <span className="tab-icon">
            <Ic name={t.icon} size={24} strokeWidth={t.active ? 2.1 : 1.7} />
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
