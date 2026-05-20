// 샘플 상품/매장 데이터 — E-오더(HJ) 프로토타입용
export const products = [
  { sku: 'TERA-500-B',  name: '테라',           sub: '500mL · 20병/박스', boxPrice: 38000, bottlePrice: 1900, color: '#1F7A3D', accent: '#0E5126', tag: '맥주',   stock: 'high' },
  { sku: 'CASS-500-B',  name: '카스',           sub: '500mL · 20병/박스', boxPrice: 37500, bottlePrice: 1875, color: '#0B4DA2', accent: '#062E63', tag: '맥주',   stock: 'high' },
  { sku: 'JINRO-360-B', name: '진로',           sub: '360mL · 30병/박스', boxPrice: 51000, bottlePrice: 1700, color: '#5BC2E7', accent: '#1C7AA4', tag: '소주',   stock: 'high' },
  { sku: 'CHUM-360-B',  name: '참이슬 후레쉬',   sub: '360mL · 30병/박스', boxPrice: 51000, bottlePrice: 1700, color: '#2EAA59', accent: '#1A6E3A', tag: '소주',   stock: 'medium' },
  { sku: 'KELLY-500-B', name: '켈리',           sub: '500mL · 20병/박스', boxPrice: 38500, bottlePrice: 1925, color: '#C9A24A', accent: '#7A5F1F', tag: '맥주',   stock: 'medium' },
  { sku: 'HITE-500-B',  name: '하이트',         sub: '500mL · 20병/박스', boxPrice: 36000, bottlePrice: 1800, color: '#3179C7', accent: '#1A4E8A', tag: '맥주',   stock: 'high' },
  { sku: 'JINRO-IS-360-B', name: '진로이즈백',   sub: '360mL · 30병/박스', boxPrice: 51500, bottlePrice: 1716, color: '#7ABFCB', accent: '#3E7C88', tag: '소주',   stock: 'medium' },
  { sku: 'MAESIL-360-B', name: '매실원',        sub: '360mL · 30병/박스', boxPrice: 54000, bottlePrice: 1800, color: '#9CC44B', accent: '#5F7E26', tag: '리큐르', stock: 'high' },
];

const productMap = Object.fromEntries(products.map((p) => [p.sku, p]));
export const byId = (sku) => productMap[sku];

export const favorites = [
  { sku: 'TERA-500-B',  lastQty: 4 },
  { sku: 'CASS-500-B',  lastQty: 3 },
  { sku: 'CHUM-360-B',  lastQty: 5 },
  { sku: 'JINRO-360-B', lastQty: 3 },
  { sku: 'KELLY-500-B', lastQty: 2 },
];

export const stores = [
  {
    id: 'gangnam', name: '강남점', region: '강남구 역삼동',
    todayOrders: 3, weekOrders: 14, monthRevenue: 8420000,
    pendingDeliveries: 2, creditUsed: 1840000, creditLimit: 3000000,
    health: 'good', trend: '+12%',
    next: { sku: 'TERA-500-B', qty: 6, eta: '내일 오전' },
    sales: [62, 71, 68, 75, 82, 78, 88, 92],
  },
  {
    id: 'mapo', name: '마포점', region: '마포구 합정동',
    todayOrders: 1, weekOrders: 9, monthRevenue: 5610000,
    pendingDeliveries: 1, creditUsed: 2640000, creditLimit: 3000000,
    health: 'warn', trend: '-4%',
    next: { sku: 'CASS-500-B', qty: 4, eta: '오늘 오후' },
    sales: [58, 62, 60, 64, 59, 56, 52, 56],
  },
  {
    id: 'hongdae', name: '홍대점', region: '마포구 서교동',
    todayOrders: 5, weekOrders: 21, monthRevenue: 12120000,
    pendingDeliveries: 3, creditUsed: 920000, creditLimit: 4500000,
    health: 'great', trend: '+24%',
    next: { sku: 'KELLY-500-B', qty: 8, eta: '내일 오후' },
    sales: [78, 82, 88, 90, 96, 102, 108, 121],
  },
];

export const fmtWon = (n) => '₩' + n.toLocaleString('ko-KR');
export const fmtWonShort = (n) => {
  if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, '') + '천만';
  if (n >= 10000) return (n / 10000).toFixed(0) + '만';
  return n.toLocaleString('ko-KR');
};
