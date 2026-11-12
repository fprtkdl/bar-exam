import type { Ingredient } from '../../types/practical'

/** 표준 레시피(2026년 Q-net 공개)에 쓰이는 재료 전부. abv 는 공식 표기(전통주 4종)를 빼면 일반 시판 기준 대표값 */
export const ingredients: Ingredient[] = [
  // 증류주
  { id: 'bourbon-whiskey', nameKo: '버번 위스키', nameEn: 'Bourbon Whiskey', category: 'spirit', abv: 40, color: '#b8681f', bottle: 'spirit', description: '옥수수 51% 이상, 새 오크통 숙성한 미국 위스키. 맨해튼·올드 패션드·위스키 사워·뉴욕·불바디에의 베이스.' },
  { id: 'scotch-whisky', nameKo: '스카치 위스키', nameEn: 'Scotch Whisky', category: 'spirit', abv: 40, color: '#c98a2e', bottle: 'spirit', description: '스코틀랜드산 위스키. 러스티 네일의 베이스.' },
  { id: 'dry-gin', nameKo: '드라이 진', nameEn: 'Dry Gin', category: 'spirit', abv: 40, color: '#eef4f7', opacity: 0.25, bottle: 'spirit', description: '주니퍼베리 향의 무색 증류주. 공식 표기는 모두 Dry Gin.' },
  { id: 'vodka', nameKo: '보드카', nameEn: 'Vodka', category: 'spirit', abv: 40, color: '#f2f6f8', opacity: 0.2, bottle: 'spirit', description: '무색·무취에 가까운 증류주.' },
  { id: 'light-rum', nameKo: '라이트 럼', nameEn: 'Light Rum', category: 'spirit', abv: 40, color: '#f3f1e6', opacity: 0.25, bottle: 'spirit', description: '사탕수수 원료의 무색 럼(화이트 럼).' },
  { id: 'bacardi-rum-white', nameKo: '바카디 럼 화이트', nameEn: 'Bacardi Rum White', category: 'spirit', abv: 40, color: '#f3f1e6', opacity: 0.25, bottle: 'spirit', description: '바카디 칵테일 전용으로 공식 표기된 화이트 럼.' },
  { id: 'tequila', nameKo: '데킬라', nameEn: 'Tequila', category: 'spirit', abv: 40, color: '#f1ead2', opacity: 0.3, bottle: 'spirit', description: '멕시코 블루 아가베 증류주. 마가리타·데킬라 선라이즈·롱 아일랜드 아이스티.' },
  { id: 'brandy', nameKo: '브랜디', nameEn: 'Brandy', category: 'spirit', abv: 40, color: '#9c4f1c', bottle: 'spirit', description: '포도주를 증류해 숙성한 술. 푸스 카페 맨 위층.' },
  { id: 'apple-brandy', nameKo: '애플 브랜디', nameEn: 'Apple Brandy', category: 'spirit', abv: 40, color: '#c07a2c', bottle: 'spirit', description: '사과 발효주를 증류한 브랜디(칼바도스 등). 허니문 칵테일의 베이스.' },

  // 리큐르
  { id: 'creme-de-menthe-green', nameKo: '크렘 드 망트(그린)', nameEn: 'Crème de Menthe (Green)', category: 'liqueur', abv: 24, color: '#1f9e4a', bottle: 'liqueur', description: '박하 리큐르, 초록색. 푸스 카페 가운데층·그래스호퍼.' },
  { id: 'creme-de-menthe-white', nameKo: '크렘 드 망트(화이트)', nameEn: 'Crème de Menthe (White)', category: 'liqueur', abv: 24, color: '#f2f7f4', opacity: 0.3, bottle: 'liqueur', description: '무색 박하 리큐르. 진도.' },
  { id: 'creme-de-cacao-brown', nameKo: '크렘 드 카카오(브라운)', nameEn: 'Crème de Cacao (Brown)', category: 'liqueur', abv: 24, color: '#4a2513', bottle: 'liqueur', description: '카카오 리큐르, 갈색. 브랜디 알렉산더.' },
  { id: 'creme-de-cacao-white', nameKo: '크렘 드 카카오(화이트)', nameEn: 'Crème de Cacao (White)', category: 'liqueur', abv: 24, color: '#f4f1ea', opacity: 0.3, bottle: 'liqueur', description: '무색 카카오 리큐르. 그래스호퍼.' },
  { id: 'coffee-liqueur', nameKo: '커피 리큐르', nameEn: 'Coffee Liqueur (Kahlúa)', category: 'liqueur', abv: 20, color: '#2b160c', bottle: 'liqueur', description: '깔루아 등 커피 리큐르. 블랙 러시안·B-52 맨 아래층·금산.' },
  { id: 'drambuie', nameKo: '드람뷔', nameEn: 'Drambuie', category: 'liqueur', abv: 40, color: '#c4801f', bottle: 'liqueur', description: '스카치 위스키에 꿀·허브를 더한 리큐르. 러스티 네일.' },
  { id: 'triple-sec', nameKo: '트리플 섹', nameEn: 'Triple Sec', category: 'liqueur', abv: 30, color: '#f6f3e8', opacity: 0.3, bottle: 'liqueur', description: '무색 오렌지 리큐르. 마가리타는 공식 표기상 "Cointreau or Triple Sec".' },
  { id: 'baileys', nameKo: '베일리스 아이리시 크림', nameEn: "Bailey's Irish Cream Liqueur", category: 'liqueur', abv: 17, color: '#cdb08a', bottle: 'liqueur', description: '위스키와 크림의 리큐르. B-52 가운데층.' },
  { id: 'grand-marnier', nameKo: '그랑 마니에', nameEn: 'Grand Marnier', category: 'liqueur', abv: 40, color: '#d0821f', bottle: 'liqueur', description: '코냑 베이스 오렌지 리큐르. B-52 맨 위층.' },
  { id: 'midori', nameKo: '미도리(멜론 리큐르)', nameEn: 'Midori (Melon Liqueur)', category: 'liqueur', abv: 20, color: '#5cc83b', bottle: 'liqueur', description: '선명한 연두색 멜론 리큐르. 준 벅.' },
  { id: 'coconut-rum', nameKo: '코코넛 럼', nameEn: 'Coconut Flavored Rum', category: 'liqueur', abv: 21, color: '#f5f3ee', opacity: 0.3, bottle: 'liqueur', description: '코코넛 향 럼 리큐르(말리부 등). 준 벅·블루 하와이안.' },
  { id: 'banana-liqueur', nameKo: '바나나 리큐르', nameEn: 'Banana Liqueur', category: 'liqueur', abv: 20, color: '#f2d64b', bottle: 'liqueur', description: '바나나 향 리큐르. 준 벅.' },
  { id: 'cherry-brandy', nameKo: '체리 브랜디', nameEn: 'Cherry Flavored Brandy', category: 'liqueur', abv: 24, color: '#8e1028', bottle: 'liqueur', description: '체리 향 리큐르. 싱가포르 슬링 위에 띄운다(On Top).' },
  { id: 'apricot-brandy', nameKo: '애프리콧 브랜디', nameEn: 'Apricot Flavored Brandy', category: 'liqueur', abv: 24, color: '#d98a2b', bottle: 'liqueur', description: '살구 향 리큐르. 애프리콧 칵테일의 베이스.' },
  { id: 'apple-pucker', nameKo: '애플 퍼커', nameEn: 'Apple Pucker (Sour Apple Liqueur)', category: 'liqueur', abv: 15, color: '#9ad63a', bottle: 'liqueur', description: '새콤한 청사과 리큐르. 애플 마티니·풋사랑·금산.' },
  { id: 'benedictine', nameKo: '베네딕틴 D.O.M', nameEn: 'Benedictine DOM', category: 'liqueur', abv: 40, color: '#c9922c', bottle: 'liqueur', description: '허브·꿀 리큐르. 허니문·힐링.' },
  { id: 'blue-curacao', nameKo: '블루 큐라소', nameEn: 'Blue Curaçao', category: 'liqueur', abv: 25, color: '#1d7fd6', bottle: 'liqueur', description: '파란 오렌지 리큐르. 블루 하와이안.' },
  { id: 'creme-de-cassis', nameKo: '크렘 드 카시스', nameEn: 'Crème de Cassis', category: 'liqueur', abv: 16, color: '#5a0f2e', bottle: 'liqueur', description: '블랙커런트 리큐르, 진한 자주색. 키르·힐링.' },
  { id: 'campari', nameKo: '캄파리', nameEn: 'Campari', category: 'liqueur', abv: 25, color: '#c8102e', bottle: 'liqueur', description: '쌉쌀한 붉은 비터 리큐르. 네그로니·불바디에.' },

  // 양조주·베르무트
  { id: 'sweet-vermouth', nameKo: '스위트 베르무트', nameEn: 'Sweet Vermouth', category: 'wine', abv: 16, color: '#7a2a16', bottle: 'wine', description: '허브로 향을 낸 붉은 강화 와인. 맨해튼·네그로니·불바디에.' },
  { id: 'dry-vermouth', nameKo: '드라이 베르무트', nameEn: 'Dry Vermouth', category: 'wine', abv: 18, color: '#ece7c4', opacity: 0.4, bottle: 'wine', description: '무색에 가까운 드라이 강화 와인. 드라이 마티니.' },
  { id: 'white-wine', nameKo: '화이트 와인', nameEn: 'White Wine', category: 'wine', abv: 12, color: '#efe3a0', opacity: 0.6, bottle: 'wine', description: '청포도 와인. 키르의 베이스.' },

  // 전통주
  { id: 'gamhongro', nameKo: '감홍로', nameEn: 'Gam Hong Ro', category: 'traditional', abv: 40, color: '#d0703a', bottle: 'spirit', description: '평양 지역 전통 소주에 약재를 우린 붉은빛 증류주(공식 표기 40도). 힐링의 베이스.' },
  { id: 'jindo-hongju', nameKo: '진도 홍주', nameEn: 'Jindo Hong Ju', category: 'traditional', abv: 40, color: '#b0182c', bottle: 'spirit', description: '지초로 붉게 물들인 진도 전통 증류주(공식 표기 40도). 진도의 베이스.' },
  { id: 'andong-soju', nameKo: '안동 소주', nameEn: 'Andong Soju', category: 'traditional', abv: 35, color: '#f4f4f0', opacity: 0.2, bottle: 'spirit', description: '안동 전통 증류식 소주(공식 표기 35도). 풋사랑의 베이스.' },
  { id: 'geumsan-insamju', nameKo: '금산 인삼주', nameEn: 'Geumsan Insamju', category: 'traditional', abv: 43, color: '#e8d6a0', opacity: 0.5, bottle: 'spirit', description: '금산 인삼으로 빚은 증류주(공식 표기 43도). 금산의 베이스.' },
  { id: 'bokbunja-wine', nameKo: '선운산 복분자주', nameEn: 'Sunwoonsan Bokbunja Wine', category: 'traditional', abv: 15, color: '#4d0a22', bottle: 'wine', description: '고창 선운산 복분자로 빚은 과실주. 고창의 베이스.' },

  // 주스
  { id: 'lemon-juice', nameKo: '레몬 주스', nameEn: 'Lemon Juice', category: 'juice', abv: 0, color: '#f6ec9a', opacity: 0.7, bottle: 'juice', description: '신맛 담당. 사이드카·싱가포르 슬링·위스키 사워 등.' },
  { id: 'lime-juice', nameKo: '라임 주스', nameEn: 'Lime Juice', category: 'juice', abv: 0, color: '#d7eb9a', opacity: 0.7, bottle: 'juice', description: '신맛 담당. 마가리타·다이키리·뉴욕 등.' },
  { id: 'fresh-lemon', nameKo: '생레몬(즉석 착즙)', nameEn: 'Fresh Squeezed Lemon', category: 'juice', abv: 0, color: '#f8ee9e', opacity: 0.7, bottle: 'jar', description: '레몬 1/2개를 스퀴저로 직접 짠다. 프레시 레몬 스쿼시 전용.' },
  { id: 'orange-juice', nameKo: '오렌지 주스', nameEn: 'Orange Juice', category: 'juice', abv: 0, color: '#f7a21b', bottle: 'carton', description: '데킬라 선라이즈·마이타이·애프리콧·버진 프루트 펀치.' },
  { id: 'pineapple-juice', nameKo: '파인애플 주스', nameEn: 'Pineapple Juice', category: 'juice', abv: 0, color: '#f4d35e', bottle: 'carton', description: '트로피컬 칵테일(블루 하와이안·피냐 콜라다·마이타이·준 벅).' },
  { id: 'cranberry-juice', nameKo: '크랜베리 주스', nameEn: 'Cranberry Juice', category: 'juice', abv: 0, color: '#b3123a', bottle: 'carton', description: '시브리즈·코스모폴리탄·버진 프루트 펀치.' },
  { id: 'grapefruit-juice', nameKo: '자몽 주스', nameEn: 'Grapefruit Juice', category: 'juice', abv: 0, color: '#f7b39a', bottle: 'carton', description: '시브리즈·버진 프루트 펀치.' },
  { id: 'white-grape-juice', nameKo: '청포도 주스', nameEn: 'White Grape Juice', category: 'juice', abv: 0, color: '#e3e6a2', bottle: 'carton', description: '진도에 쓰는 청포도 주스.' },

  // 시럽·믹스
  { id: 'grenadine-syrup', nameKo: '그레나딘 시럽', nameEn: 'Grenadine Syrup', category: 'syrup', abv: 0, color: '#c0102c', bottle: 'syrup', description: '석류 시럽, 진홍색. 비중이 커서 가라앉는다(푸스 카페 맨 아래·데킬라 선라이즈).' },
  { id: 'raspberry-syrup', nameKo: '라즈베리 시럽', nameEn: 'Raspberry Syrup', category: 'syrup', abv: 0, color: '#c2185b', bottle: 'syrup', description: '진도에 쓰는 산딸기 시럽.' },
  { id: 'sweet-sour-mix', nameKo: '스위트 앤 사워 믹스', nameEn: 'Sweet & Sour Mix', category: 'syrup', abv: 0, color: '#f1eaa0', bottle: 'juice', description: '레몬·설탕 믹스. 롱 아일랜드 아이스티·준 벅·힐링.' },
  { id: 'pina-colada-mix', nameKo: '피냐 콜라다 믹스', nameEn: 'Pina Colada Mix', category: 'syrup', abv: 0, color: '#f6f0dc', bottle: 'carton', description: '코코넛 크림·파인애플 믹스. 피냐 콜라다.' },

  // 탄산·믹서
  { id: 'soda-water', nameKo: '소다수', nameEn: 'Soda Water', category: 'mixer', abv: 0, color: '#eef7fb', opacity: 0.15, bottle: 'soda', description: '무가당 탄산수.' },
  { id: 'cola', nameKo: '콜라', nameEn: 'Cola', category: 'mixer', abv: 0, color: '#3a1a0c', bottle: 'soda', description: '쿠바 리브레·롱 아일랜드 아이스티.' },
  { id: 'ginger-ale', nameKo: '진저에일', nameEn: 'Ginger Ale', category: 'mixer', abv: 0, color: '#e6c77a', opacity: 0.6, bottle: 'soda', description: '생강 향 탄산음료. 모스코 뮬.' },
  { id: 'sprite', nameKo: '사이다(스프라이트)', nameEn: 'Sprite', category: 'mixer', abv: 0, color: '#eef7ee', opacity: 0.15, bottle: 'soda', description: '레몬·라임 탄산음료. 고창.' },

  // 유제품·비터스·기타
  { id: 'light-milk', nameKo: '우유', nameEn: 'Light Milk', category: 'dairy', abv: 0, color: '#faf7ef', opacity: 0.95, bottle: 'carton', description: '브랜디 알렉산더·그래스호퍼.' },
  { id: 'angostura-bitters', nameKo: '앙고스투라 비터스', nameEn: 'Angostura Bitters', category: 'bitters', abv: 44.7, color: '#6b1d0e', bottle: 'bitters', description: '쓴맛 향신료 비터스. 1 dash 단위. 맨해튼·올드 패션드.' },
  { id: 'powdered-sugar', nameKo: '설탕(가루)', nameEn: 'Powdered Sugar', category: 'other', abv: 0, color: '#ffffff', opacity: 0.9, bottle: 'jar', description: '가루 설탕. tsp 단위로 넣는다.' },
  { id: 'salt', nameKo: '소금', nameEn: 'Salt', category: 'other', abv: 0, color: '#ffffff', opacity: 0.9, bottle: 'jar', description: '마가리타 잔 테두리 리밍(Rimming with Salt) 전용.' },
]
