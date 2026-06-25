// px → rem 문자열 — 인라인 스타일용
//
// 루트 폰트는 OS 글씨 크기 설정을 따라가도록 묶여 있다(_base.scss).
// 인라인 fontSize도 px 대신 rem(px)으로 쓰면 OS/브라우저 글씨 크기에 맞춰 함께 확대/축소된다.
// 디자인 기준 16px — SCSS의 rem() 함수와 동일 규칙.
export const rem = (px) => `${px / 16}rem`;
