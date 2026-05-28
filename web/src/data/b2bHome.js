// B2B 홈 화면용 데이터 — 디자인 핸드오프(`app-home-test`)의 products.jsx 를
// ESM 으로 옮기고, 기존 프로젝트의 토큰/네이밍과 자연스럽게 어울리도록 정리한 카탈로그.
//
// kind 는 Bottle / Can 일러스트의 variant 키입니다.
//   'can:xxx' 접두어가 붙으면 캔, 그 외는 보틀로 해석합니다.
// tint 는 상품 카드 배경 강조용 파스텔 색.

export const CATALOG = [
  { id: 'p1', name: '진로이즈백 (병) 360ml',    spec: '박스 · 20개입', price: 27000, kind: 'soju-clear',  tag: 'Best',  stock: 'in',  tint: '#EAF1FA' },
  { id: 'p2', name: '참이슬 후레쉬 (병) 360ml', spec: '박스 · 20개입', price: 27000, kind: 'soju-green',  tag: 'Best',  stock: 'in',  tint: '#EEF6EF' },
  { id: 'p3', name: '테라 (병) 500ml',         spec: '박스 · 20개입', price: 32000, kind: 'beer-brown',  tag: '추천',  stock: 'in',  tint: '#F4ECE5' },
  { id: 'p4', name: '카스 후레쉬 (캔) 500ml',   spec: '박스 · 24개입', price: 38400, kind: 'can:cass',    tag: null,    stock: 'in',  tint: '#E8F0FB' },
  { id: 'p5', name: '켈리 (병) 500ml',         spec: '박스 · 20개입', price: 33500, kind: 'beer-amber',  tag: '신상',  stock: 'low', tint: '#FAF1E4' },
  { id: 'p6', name: '청하 (병) 295ml',         spec: '박스 · 30개입', price: 22000, kind: 'cheongha',    tag: null,    stock: 'in',  tint: '#EDF2F7' },
  { id: 'p7', name: '매화수 (병) 375ml',       spec: '박스 · 20개입', price: 29000, kind: 'maehwasoo',   tag: null,    stock: 'in',  tint: '#FCEEF1' },
  { id: 'p8', name: '토닉워터 (캔) 250ml',     spec: '박스 · 24개입', price: 18000, kind: 'can:terra',   tag: null,    stock: 'in',  tint: '#EAF3EC' },
];

const productMap = Object.fromEntries(CATALOG.map((p) => [p.id, p]));
export const getOrderProduct = (pid) => productMap[pid];

export const RECENT_ORDERS = [
  {
    id: 'o1', date: '2026.05.14 (목)', orderNo: '#20413',
    items: [{ pid: 'p1', qty: 5 }, { pid: 'p2', qty: 5 }, { pid: 'p3', qty: 5 }],
    typesCount: 3, totalBoxes: 15, totalAmount: 112000, status: '완료',
  },
  {
    id: 'o2', date: '2026.05.10 (일)', orderNo: '#20356',
    items: [{ pid: 'p4', qty: 4 }, { pid: 'p5', qty: 2 }],
    typesCount: 2, totalBoxes: 6, totalAmount: 67400, status: '완료',
  },
  {
    id: 'o3', date: '2026.05.07 (목)', orderNo: '#20289',
    items: [{ pid: 'p1', qty: 10 }, { pid: 'p2', qty: 10 }, { pid: 'p3', qty: 5 }, { pid: 'p6', qty: 3 }],
    typesCount: 4, totalBoxes: 28, totalAmount: 245000, status: '완료',
  },
  {
    id: 'o4', date: '2026.05.02 (토)', orderNo: '#20177',
    items: [{ pid: 'p5', qty: 3 }, { pid: 'p7', qty: 2 }],
    typesCount: 2, totalBoxes: 5, totalAmount: 95000, status: '완료',
  },
  {
    id: 'o5', date: '2026.04.28 (월)', orderNo: '#20102',
    items: [{ pid: 'p2', qty: 8 }, { pid: 'p4', qty: 4 }, { pid: 'p8', qty: 2 }],
    typesCount: 3, totalBoxes: 14, totalAmount: 128400, status: '완료',
  },
];

// 카테고리별 브랜드 — 가로 스와이프 형태로 노출. kind 는 Bottle/Can variant 키.
export const CATEGORIES = ['맥주', '소주', '수입맥주', '수입위스키', '무알콜', '전통주', '와인'];

export const BRANDS = {
  '맥주':       [['테라', 'beer-brown'], ['카스', 'can:cass'], ['켈리', 'beer-amber'], ['하이트', 'can:hite'], ['OB', 'can:cass'], ['클라우드', 'beer-brown'], ['필라이트', 'beer-amber'], ['오비프리미어', 'can:kelly']],
  '소주':       [['참이슬', 'soju-green'], ['진로이즈백', 'soju-clear'], ['처음처럼', 'soju-green'], ['좋은데이', 'soju-clear'], ['한라산', 'soju-clear'], ['일품진로', 'soju-green'], ['새로', 'soju-clear'], ['진로', 'soju-green']],
  '수입맥주':   [['하이네켄', 'can:cass'], ['아사히', 'can:hite'], ['칭다오', 'can:terra'], ['코로나', 'can:kelly'], ['버드와이저', 'can:cass'], ['호가든', 'can:terra'], ['기네스', 'can:hite'], ['스텔라', 'can:kelly']],
  '수입위스키': [['발렌타인', 'whisky'], ['조니워커', 'whisky'], ['글렌피딕', 'whisky'], ['잭다니엘', 'whisky'], ['시바스리갈', 'whisky'], ['맥캘란', 'whisky'], ['로얄살루트', 'whisky'], ['짐빔', 'whisky']],
  '무알콜':     [['하이트제로', 'can:hite'], ['클라우드클리어', 'can:cass'], ['칭따오논알콜', 'can:terra'], ['하이네켄0', 'can:cass'], ['아사히제로', 'can:hite'], ['에델바이스', 'wine']],
  '전통주':     [['장수막걸리', 'cheongha'], ['지평막걸리', 'cheongha'], ['백화수복', 'cheongha'], ['안동소주', 'soju-clear'], ['국순당', 'cheongha'], ['소곡주', 'maehwasoo'], ['문배주', 'soju-green'], ['이강주', 'maehwasoo']],
  '와인':       [['몬테스', 'wine'], ['옐로우테일', 'wine'], ['디아블로', 'wine'], ['1865', 'wine'], ['프론테라', 'wine'], ['우드브릿지', 'wine'], ['칠레와인', 'wine'], ['빌라M', 'wine']],
};

// 상단 배너 — bg/fg/accent 는 그라데이션 + 텍스트 톤. kind 는 일러스트 보틀.
export const BANNERS = [
  {
    id: 'b1', title: '5월 이즈백\n캐시백 프로모션', sub: '박스당 1,500원 적립',
    bg: 'linear-gradient(135deg,#E55F00 0%,#FF6B00 60%,#FF9450 100%)',
    fg: '#fff', accent: '#FFD24A', kind: 'soju-clear',
  },
  {
    id: 'b2', title: '테라·켈리 묶음\n5% 추가 할인', sub: '두 박스 이상 주문 시',
    bg: 'linear-gradient(135deg,#0F1115 0%,#2A2F36 100%)',
    fg: '#fff', accent: '#E5432B', kind: 'beer-brown',
  },
  {
    id: 'b3', title: '신규 거래처\n첫 주문 5만원 쿠폰', sub: '~ 5/31까지',
    bg: 'linear-gradient(135deg,#FFF1E6 0%,#FFD9B8 100%)',
    fg: '#0F1115', accent: '#FF6B00', kind: 'cheongha',
  },
];
