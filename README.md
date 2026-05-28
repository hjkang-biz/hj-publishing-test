# E-오더(HJ) · 하이브리드 앱 프로토타입

하이트진로 B2B 주류 발주 앱의 핵심 시나리오 4종을 **React 웹 + React Native WebView** 하이브리드 구조로 구현한 데모입니다. 퍼블리셔/디자이너가 화면 구현 가능 여부를 검증할 수 있는 수준으로 만들었습니다.

## 구성

```
hj-test/
├── web/        ← React (Vite) 웹 앱 — 실제 UI/UX 가 여기 있습니다
└── mobile/     ← React Native (Expo) 셸 — WebView 로 위 웹을 띄움
```

웹은 **단독으로도 브라우저에서 그대로 확인 가능**하고, 네이티브 앱은 그 웹 화면을 WebView 로 감싸서 iOS/Android 앱으로 배포할 수 있는 구조입니다.

## 시나리오 5종

| # | 시나리오 | 비고 |
|---|---|---|
| ⓪ | B2B 홈 (통합) | 카테고리 · 브랜드 · 최근주문 묶음 · 즐겨찾기 · 추천 · 빠른 발주 · 마감 카운트다운 · 외상 잔액 · 장바구니 미니바 |
| ① | 마감 후 재주문 (즐겨찾기 5탭 발주) | 김영자 사장님 · 5개 화면 |
| ① V2 | 추천 중심 2탭 발주 | 4주 패턴 + 묶음 + 즐겨찾기 진화 |
| ② | 영업 중 스캔 발주 | 다크 카메라 + 바텀시트 |
| ③ | 다점포 컨트롤 타워 | 박준혁 사장님 · 3매장 |

## 웹 실행 (퍼블리셔 검증용)

```bash
cd web
npm install
npm run dev          # http://localhost:5173
```

- 상단 칩으로 4개 시나리오를 자유롭게 전환
- iOS 26 디바이스 프레임(402×874) 안에서 실제 화면처럼 동작
- 빌드: `npm run build` → `web/dist/` (정적 호스팅 가능)

## 모바일 앱 실행 (하이브리드 검증용)

```bash
cd mobile
npm install
npm start            # Expo Dev Tools 실행 → iOS/Android 시뮬레이터 또는 실기기
```

- `mobile/App.js`의 `WEB_URL` 이 웹 dev 서버를 가리키도록 되어 있음
  - iOS 시뮬레이터: `http://localhost:5173`
  - Android 에뮬레이터: `http://10.0.2.2:5173`
  - 실기기는 같은 Wi-Fi 의 LAN IP(예: `http://172.16.2.180:5173`)로 바꾸세요
- 배포 시에는 `WEB_URL` 을 정적 호스팅 주소로 교체

## 파일 구조 (web)

```
web/src/
├── main.jsx, App.jsx              ← 진입점 + 시나리오 캔버스
├── styles.css                     ← 디자인 토큰 + 공통 클래스
├── components/
│   ├── Icons.jsx                  ← Lucide 풍 인라인 SVG
│   ├── IOSDevice.jsx              ← iOS 26 디바이스 프레임
│   └── Primitives.jsx             ← TabBar, Stepper, PageNav, BottomBar 등
├── data/
│   ├── products.js                ← 상품/매장/즐겨찾기 (시나리오 ①·②·③)
│   ├── reco.js                    ← 추천 엔진 출력 (4주 패턴 · 묶음)
│   └── b2bHome.js                 ← B2B 홈 전용 카탈로그 · 브랜드 · 최근주문 · 배너
└── flows/
    ├── B2BHome.jsx                ← 시나리오 ⓪
    ├── AfterCloseReorder.jsx      ← 시나리오 ①
    ├── RecoFlow.jsx               ← 시나리오 ① V2
    ├── ScanOrder.jsx              ← 시나리오 ②
    └── MultiStoreTower.jsx        ← 시나리오 ③
```

## 디자인 토큰

`web/src/styles.css` 의 `:root` 에 정의:
- 브랜드 컬러: `--brand: #FF6B00` (하이트진로 오렌지)
- 시맨틱: green/amber/red/blue + soft 베리언트
- 반경: 4/8/12/16/24
- 타이포: `t-title-l/m/s`, `t-body-l/m/s`, `t-label`, `t-cta` 클래스로 사용

## 폰트

Pretendard CDN 로드 (`web/index.html`). 별도 설치 불필요.

## 참고

이 프로토타입은 [Claude Design](https://claude.ai/design) 에서 만든 HTML/JS 산출물(`E-오더 프로토타입.html`)을 모듈화하여 옮긴 것입니다. 데이터·인터랙션·시각 톤은 원본과 동일하게 유지했습니다.
