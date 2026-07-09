// 시나리오 캔버스 — 유동 반응형
// - 디바이스 프레임/데스크탑·모바일 분기 없이 전 화면 공통으로 앱이 뷰포트를 채운다.
// - 브레이크포인트(390/673/800/1200)마다 각 플로우 내부가 리플로우된다.
// - 시나리오 전환은 플로팅 FAB → 바텀시트(넓은 화면에선 가운데 다이얼로그).
import { useState, useEffect } from 'react';
import { AfterCloseFlow } from './flows/AfterCloseReorder.jsx';
import { RecoFlowV2 } from './flows/RecoFlow.jsx';
import { ScanOrderFlow } from './flows/ScanOrder.jsx';
import { MultiStoreFlow } from './flows/MultiStoreTower.jsx';
import { B2BHomeFlow } from './flows/B2BHome.jsx';
import { HeroAppFlow } from './flows/HeroApp.jsx';

const SCENARIOS = [
  {
    id: 's-start',
    label: '🚀 앱 시작',
    sub: '스플래시 · 로그인 · 홈 · 공지 팝업',
    Component: HeroAppFlow,
    dark: false,
  },
  {
    id: 's0',
    label: '⓪ B2B 홈',
    sub: '카테고리 · 즐겨찾기 · 최근주문 · 추천',
    Component: B2BHomeFlow,
    dark: false,
  },
  {
    id: 's1',
    label: '① 마감 후 재주문',
    sub: '즐겨찾기 5탭 발주 · 김영자 사장님',
    Component: AfterCloseFlow,
    dark: false,
  },
  {
    id: 's1-v2',
    label: '① V2 · 추천 중심',
    sub: '2탭 내 발주 · 4주 패턴 + 묶음',
    Component: RecoFlowV2,
    dark: false,
  },
  {
    id: 's2',
    label: '② 영업 중 스캔 발주',
    sub: '바코드 1탭 추가 · 다크 카메라 뷰',
    Component: ScanOrderFlow,
    dark: true,
  },
  {
    id: 's3',
    label: '③ 다점포 컨트롤 타워',
    sub: '3매장 통합 · 박준혁 사장님',
    Component: MultiStoreFlow,
    dark: false,
  },
];

// URL 해시 (#s1, #s1-v2 …) 와 동기화 — 새로고침 / 딥링크 대응
const idFromHash = () => {
  const h = window.location.hash.replace(/^#/, '');
  return SCENARIOS.some((s) => s.id === h) ? h : SCENARIOS[0].id;
};

export default function App() {
  const [activeId, setActiveId] = useState(idFromHash);
  const [sheetOpen, setSheetOpen] = useState(false);

  // 활성 시나리오 → URL 해시 반영
  useEffect(() => {
    if (window.location.hash.replace(/^#/, '') !== activeId) {
      history.replaceState(null, '', '#' + activeId);
    }
  }, [activeId]);

  const active = SCENARIOS.find((s) => s.id === activeId) || SCENARIOS[0];
  const Active = active.Component;

  return (
    <>
      <div className="app-shell">
        <div className={'app-viewport' + (active.dark ? ' is-dark' : '')}>
          <div className="flow-host">
            <Active />
          </div>
        </div>
      </div>

      <button type="button" className="scenario-fab" onClick={() => setSheetOpen(true)} aria-label="시나리오 선택">
        <span className="scenario-fab__dot" />
        {active.label}
      </button>

      {sheetOpen && (
        <div className="scenario-sheet" onClick={() => setSheetOpen(false)}>
          <div className="scenario-sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="scenario-sheet__handle" />
            <div className="scenario-sheet__title">시나리오 선택</div>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={'scenario-sheet__item' + (s.id === activeId ? ' active' : '')}
                onClick={() => {
                  setActiveId(s.id);
                  setSheetOpen(false);
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="scenario-sheet__item-label">{s.label}</div>
                  <div className="scenario-sheet__item-sub">{s.sub}</div>
                </div>
                {s.id === activeId && <span className="badge brand">현재</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
