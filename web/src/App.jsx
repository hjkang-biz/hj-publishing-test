// 시나리오 캔버스
// - 데스크탑: 4개 시나리오를 칩으로 전환해 iOS 프레임 안에 렌더링
// - 모바일: iOS 프레임/캔버스 chrome 을 제거하고 실제 앱처럼 풀스크린 렌더링
//           + 시나리오 전환용 플로팅 FAB → 바텀시트
import { useState, useEffect } from 'react';
import { IOSDevice } from './components/IOSDevice.jsx';
import { AfterCloseFlow } from './flows/AfterCloseReorder.jsx';
import { RecoFlowV2 } from './flows/RecoFlow.jsx';
import { ScanOrderFlow } from './flows/ScanOrder.jsx';
import { MultiStoreFlow } from './flows/MultiStoreTower.jsx';
import { B2BHomeFlow } from './flows/B2BHome.jsx';

const SCENARIOS = [
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

const DEVICE_W = 402;
const DEVICE_H = 874;
const MOBILE_BREAKPOINT = 768;

// URL 해시 (#s1, #s1-v2 …) 와 동기화 — 모바일에서 새로고침 / 딥링크 대응
const idFromHash = () => {
  const h = window.location.hash.replace(/^#/, '');
  return SCENARIOS.some((s) => s.id === h) ? h : SCENARIOS[0].id;
};

export default function App() {
  const [activeId, setActiveId] = useState(idFromHash);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);
  const [sheetOpen, setSheetOpen] = useState(false);

  // 뷰포트 추적
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 데스크탑: iOS 프레임 스케일 계산
  useEffect(() => {
    if (isMobile) return;
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxW = Math.min(vw - 32, DEVICE_W);
      const maxH = Math.max(vh - 240, 480);
      const s = Math.min(maxW / DEVICE_W, maxH / DEVICE_H, 1);
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [isMobile]);

  // 활성 시나리오 → URL 해시 반영
  useEffect(() => {
    if (window.location.hash.replace(/^#/, '') !== activeId) {
      history.replaceState(null, '', '#' + activeId);
    }
  }, [activeId]);

  const active = SCENARIOS.find((s) => s.id === activeId) || SCENARIOS[0];
  const Active = active.Component;

  // ── 모바일 풀스크린 모드 ────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div className={'app-mobile' + (active.dark ? ' is-dark' : '')}>
          <div className="flow-host">
            <Active />
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

  // ── 데스크탑 캔버스 모드 ───────────────────────────────────
  return (
    <div className="canvas">
      <header className="canvas__title">
        <h1>E-오더(HJ) · 핵심 발주 시나리오</h1>
        <p>하이트진로 B2B 주류 발주 앱 · 리액트 + 리액트 네이티브 하이브리드 데모</p>
      </header>

      <div className="canvas__chips">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={'canvas__chip' + (s.id === activeId ? ' active' : '')}
            onClick={() => setActiveId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="canvas__frame-label">{active.sub}</div>

      <div style={{ width: DEVICE_W * scale, height: DEVICE_H * scale, position: 'relative' }}>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: DEVICE_W,
            height: DEVICE_H,
          }}
        >
          <IOSDevice width={DEVICE_W} height={DEVICE_H} dark={active.dark}>
            <Active />
          </IOSDevice>
        </div>
      </div>
    </div>
  );
}
