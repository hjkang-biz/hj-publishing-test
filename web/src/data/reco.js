// 추천 엔진 출력 — Flow 1 V2 (4주 패턴 + 묶음 + 즐겨찾기 진화)
import { byId } from './products.js';

export const reco = {
  current: {
    confidence: 92,
    reasonShort: '4주 패턴 일치',
    reasonLong: '매주 화·수 발주 · 마지막 발주로부터 7일 경과',
    generatedAt: '23:30',
    items: [
      { sku: 'TERA-500-B',  qty: 4, avg4w: 4.0, lastWeek: 5, trend: -1, conf: 'high',   sparkline: [4, 4, 5, 5] },
      { sku: 'CASS-500-B',  qty: 3, avg4w: 3.2, lastWeek: 3, trend:  0, conf: 'high',   sparkline: [3, 3, 4, 3] },
      { sku: 'CHUM-360-B',  qty: 5, avg4w: 4.5, lastWeek: 4, trend: +1, conf: 'medium', sparkline: [4, 5, 4, 4] },
      { sku: 'JINRO-360-B', qty: 3, avg4w: 3.0, lastWeek: 3, trend:  0, conf: 'high',   sparkline: [3, 3, 3, 3] },
      { sku: 'KELLY-500-B', qty: 2, avg4w: 1.7, lastWeek: 2, trend:  0, conf: 'medium', sparkline: [1, 2, 2, 2] },
    ],
    addOns: [
      { sku: 'MAESIL-360-B', qty: 1, reason: '최근 4주 중 3번 함께 발주', confidence: 75 },
    ],
    totalUnits: 17,
    totalBottles: 360,
  },
  bundles: [
    {
      id: 'weekend', name: '주말 세트', emoji: '🍻',
      sub: '금·토·일 매장 보충용',
      usage: '이번 달 3회 사용',
      lastUsed: '5월 3일', tone: '#FFF1E6',
      items: [
        { sku: 'TERA-500-B', qty: 6 },
        { sku: 'CASS-500-B', qty: 4 },
        { sku: 'CHUM-360-B', qty: 6 },
      ],
    },
    {
      id: 'monday', name: '월요일 보충', emoji: '🥃',
      sub: '주말 직후 재고 채움',
      usage: '이번 달 2회 사용',
      lastUsed: '5월 6일', tone: '#EAF2FE',
      items: [
        { sku: 'TERA-500-B',  qty: 3 },
        { sku: 'JINRO-360-B', qty: 4 },
        { sku: 'KELLY-500-B', qty: 2 },
      ],
    },
    {
      id: 'summer', name: '여름 맥주 강화', emoji: '☀️',
      sub: '6~8월 시즌 권장',
      badge: 'NEW', tone: '#FFF7E6',
      items: [
        { sku: 'CASS-500-B',  qty: 5 },
        { sku: 'KELLY-500-B', qty: 4 },
        { sku: 'TERA-500-B',  qty: 5 },
        { sku: 'HITE-500-B',  qty: 3 },
      ],
    },
  ],
  evolution: {
    dormant: { count: 2, skus: ['JINRO-IS-360-B', 'MAESIL-360-B'] },
    promoted: { count: 1, sku: 'KELLY-500-B' },
    candidate: { count: 1, sku: 'HITE-500-B', reason: '최근 2회 장바구니 담음' },
  },
  context: {
    nowHour: 23,
    cutoff: 18,
    deliveryDate: '5월 14일(목)',
    deliveryWindow: '오전 8~12시',
    cancelUntil: '5월 14일 08:00',
    creditUsed: 1840000,
    creditLimit: 3000000,
    duplicateSku: null,
  },
};

export const recoTotal = (items) =>
  items.reduce((s, it) => s + byId(it.sku).boxPrice * it.qty, 0);
export const recoUnits = (items) => items.reduce((s, it) => s + it.qty, 0);
export const recoBottles = (items) =>
  items.reduce((s, it) => {
    const p = byId(it.sku);
    const m = (p.sub.match(/(\d+)병\/박스/) || [])[1];
    return s + (parseInt(m) || 20) * it.qty;
  }, 0);
