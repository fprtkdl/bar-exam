import type { MethodId, PourUnit, Recipe, RecipeIngredient } from '../../types/practical'

/**
 * 국가기술자격 실기시험 표준레시피 (한국산업인력공단, 2026년 기능사 제1회 실기부터 적용, 2025-12-30 Q-net 공개).
 * 번호·순서는 공식 표 그대로. 근거·판단 메모는 docs/research/practical-recipes.md
 */
const i = (ingredientId: string, amount: number, unit: PourUnit, via: MethodId): RecipeIngredient => ({ ingredientId, amount, unit, via })

export const recipes: Recipe[] = [
  {
    id: 'pousse-cafe', nameEn: 'Pousse Cafe', nameKo: '푸스 카페', base: 'liqueur', glassId: 'liqueur', methods: ['float'],
    ingredients: [i('grenadine-syrup', 1 / 3, 'part', 'float'), i('creme-de-menthe-green', 1 / 3, 'part', 'float'), i('brandy', 1 / 3, 'part', 'float')],
    glassIce: null, chill: false, rim: null, garnishIds: [], garnishText: '없음',
    tip: '아래부터 그레나딘(빨강) → 민트 그린(초록) → 브랜디(갈색). 바 스푼 등에 대고 천천히 띄우고, 층이 섞이면 감점.',
  },
  {
    id: 'manhattan', nameEn: 'Manhattan', nameKo: '맨해튼', base: 'whiskey', glassId: 'cocktail', methods: ['stir'],
    ingredients: [i('bourbon-whiskey', 1.5, 'oz', 'stir'), i('sweet-vermouth', 0.75, 'oz', 'stir'), i('angostura-bitters', 1, 'dash', 'stir')],
    glassIce: null, chill: true, rim: null, garnishIds: ['cherry'], garnishText: 'Cherry',
    tip: '버번 1 1/2 : 스위트 베르무트 3/4 + 비터스 1dash. 믹싱 글라스에서 스터 후 스트레인.',
  },
  {
    id: 'dry-martini', nameEn: 'Dry Martini', nameKo: '드라이 마티니', base: 'gin', glassId: 'cocktail', methods: ['stir'],
    ingredients: [i('dry-gin', 2, 'oz', 'stir'), i('dry-vermouth', 1 / 3, 'oz', 'stir')],
    glassIce: null, chill: true, rim: null, garnishIds: ['green-olive'], garnishText: 'Green Olive',
    tip: '진 2oz + 드라이 베르무트 1/3oz, 스터. 가니쉬는 그린 올리브.',
  },
  {
    id: 'old-fashioned', nameEn: 'Old Fashioned', nameKo: '올드 패션드', base: 'whiskey', glassId: 'old-fashioned', methods: ['build'],
    ingredients: [i('powdered-sugar', 1, 'tsp', 'build'), i('angostura-bitters', 1, 'dash', 'build'), i('soda-water', 0.5, 'oz', 'build'), i('bourbon-whiskey', 1.5, 'oz', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['orange-cherry'], garnishText: 'A Slice of Orange and Cherry',
    tip: '설탕·비터스·소다수 1/2oz 를 먼저 넣어 설탕을 녹인 뒤 얼음, 버번 1 1/2oz 순(공식 표는 버번이 먼저 적혀 있다).',
  },
  {
    id: 'brandy-alexander', nameEn: 'Brandy Alexander', nameKo: '브랜디 알렉산더', base: 'brandy', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('brandy', 0.75, 'oz', 'shake'), i('creme-de-cacao-brown', 0.75, 'oz', 'shake'), i('light-milk', 0.75, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: ['nutmeg'], garnishText: 'Nutmeg Powder',
    tip: '세 재료 모두 3/4oz. 카카오는 브라운. 우유가 들어가니 충분히 셰이크, 넛맥 파우더로 마무리.',
  },
  {
    id: 'singapore-sling', nameEn: 'Singapore Sling', nameKo: '싱가포르 슬링', base: 'gin', glassId: 'footed-pilsner', methods: ['shake', 'build', 'float'],
    ingredients: [i('dry-gin', 1.5, 'oz', 'shake'), i('lemon-juice', 0.5, 'oz', 'shake'), i('powdered-sugar', 1, 'tsp', 'shake'), i('soda-water', 0, 'fill', 'build'), i('cherry-brandy', 0.5, 'oz', 'float')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['orange-cherry'], garnishText: 'A Slice of Orange and Cherry',
    tip: '공식 조주법은 Shake/Build. 진·레몬·설탕 셰이크 → 소다수로 채움 → 체리 브랜디 1/2oz 를 위에(On Top).',
  },
  {
    id: 'black-russian', nameEn: 'Black Russian', nameKo: '블랙 러시안', base: 'vodka', glassId: 'old-fashioned', methods: ['build'],
    ingredients: [i('vodka', 1, 'oz', 'build'), i('coffee-liqueur', 0.5, 'oz', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: [], garnishText: '없음',
    tip: '보드카 1oz + 커피 리큐르 1/2oz, 얼음 넣은 올드 패션드 글라스에 빌드. 가니쉬 없음.',
  },
  {
    id: 'margarita', nameEn: 'Margarita', nameKo: '마가리타', base: 'tequila', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('tequila', 1.5, 'oz', 'shake'), i('triple-sec', 0.5, 'oz', 'shake'), i('lime-juice', 0.5, 'oz', 'shake')],
    glassIce: null, chill: true, rim: 'salt', garnishIds: [], garnishText: 'Rimming with Salt',
    tip: '잔 테두리에 소금 리밍을 먼저. 공식 표기는 "Cointreau or Triple Sec 1/2oz". 리밍이 쓰이는 유일한 레시피.',
  },
  {
    id: 'rusty-nail', nameEn: 'Rusty Nail', nameKo: '러스티 네일', base: 'whiskey', glassId: 'old-fashioned', methods: ['build'],
    ingredients: [i('scotch-whisky', 1, 'oz', 'build'), i('drambuie', 0.5, 'oz', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: [], garnishText: '없음',
    tip: '버번이 아니라 스카치 위스키. 드람뷔 1/2oz.',
  },
  {
    id: 'whiskey-sour', nameEn: 'Whiskey Sour', nameKo: '위스키 사워', base: 'whiskey', glassId: 'sour', methods: ['shake', 'build'],
    ingredients: [i('bourbon-whiskey', 1.5, 'oz', 'shake'), i('lemon-juice', 0.5, 'oz', 'shake'), i('powdered-sugar', 1, 'tsp', 'shake'), i('soda-water', 1, 'oz', 'build')],
    glassIce: null, chill: true, rim: null, garnishIds: ['lemon-cherry'], garnishText: 'A Slice of Lemon and Cherry',
    tip: '셰이크 후 사워 글라스에 따르고 소다수 1oz 를 위에(On Top). 소다수는 fill 이 아니라 정확히 1oz.',
  },
  {
    id: 'new-york', nameEn: 'New York', nameKo: '뉴욕', base: 'whiskey', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('bourbon-whiskey', 1.5, 'oz', 'shake'), i('lime-juice', 0.5, 'oz', 'shake'), i('powdered-sugar', 1, 'tsp', 'shake'), i('grenadine-syrup', 0.5, 'tsp', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: ['lemon-twist'], garnishText: 'Twist of Lemon peel',
    tip: '라임 주스(레몬 아님)인데 가니쉬는 레몬 필. 그레나딘은 1/2tsp.',
  },
  {
    id: 'daiquiri', nameEn: 'Daiquiri', nameKo: '다이키리', base: 'rum', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('light-rum', 1.75, 'oz', 'shake'), i('lime-juice', 0.75, 'oz', 'shake'), i('powdered-sugar', 1, 'tsp', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '럼 1 3/4 + 라임 3/4 + 설탕 1tsp. 바카디 칵테일과 구조가 같고 설탕 대신 그레나딘이면 바카디.',
  },
  {
    id: 'b-52', nameEn: 'B-52', nameKo: 'B-52', base: 'liqueur', glassId: 'sherry', methods: ['float'],
    ingredients: [i('coffee-liqueur', 1 / 3, 'part', 'float'), i('baileys', 1 / 3, 'part', 'float'), i('grand-marnier', 1 / 3, 'part', 'float')],
    glassIce: null, chill: false, rim: null, garnishIds: [], garnishText: '없음',
    tip: '셰리 글라스(2oz). 아래부터 커피 리큐르 → 베일리스 → 그랑 마니에.',
  },
  {
    id: 'june-bug', nameEn: 'June Bug', nameKo: '준 벅', base: 'liqueur', glassId: 'collins', methods: ['shake'],
    ingredients: [i('midori', 1, 'oz', 'shake'), i('coconut-rum', 0.5, 'oz', 'shake'), i('banana-liqueur', 0.5, 'oz', 'shake'), i('pineapple-juice', 2, 'oz', 'shake'), i('sweet-sour-mix', 2, 'oz', 'shake')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['pineapple-cherry'], garnishText: 'A Wedge of fresh Pineapple & Cherry',
    tip: '셰이크인데 콜린스 글라스(얼음). 미도리 1 · 코코넛 럼 1/2 · 바나나 1/2 · 파인애플 2 · 스위트앤사워 2.',
  },
  {
    id: 'bacardi', nameEn: 'Bacardi Cocktail', nameKo: '바카디 칵테일', base: 'rum', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('bacardi-rum-white', 1.75, 'oz', 'shake'), i('lime-juice', 0.75, 'oz', 'shake'), i('grenadine-syrup', 1, 'tsp', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '반드시 바카디 럼 화이트. 그레나딘 1tsp.',
  },
  {
    id: 'cuba-libre', nameEn: 'Cuba Libre', nameKo: '쿠바 리브레', base: 'rum', glassId: 'highball', methods: ['build'],
    ingredients: [i('light-rum', 1.5, 'oz', 'build'), i('lime-juice', 0.5, 'oz', 'build'), i('cola', 0, 'fill', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lemon-wedge'], garnishText: 'A Wedge of Lemon',
    tip: '라임 주스를 넣지만 공식 가니쉬는 레몬 웨지.',
  },
  {
    id: 'grasshopper', nameEn: 'Grasshopper', nameKo: '그래스호퍼', base: 'liqueur', glassId: 'champagne-saucer', methods: ['shake'],
    ingredients: [i('creme-de-menthe-green', 1, 'oz', 'shake'), i('creme-de-cacao-white', 1, 'oz', 'shake'), i('light-milk', 1, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '칵테일 글라스가 아니라 소서형 샴페인 글라스. 민트 그린·카카오 화이트·우유 각 1oz.',
  },
  {
    id: 'seabreeze', nameEn: 'Seabreeze', nameKo: '시브리즈', base: 'vodka', glassId: 'highball', methods: ['build'],
    ingredients: [i('vodka', 1.5, 'oz', 'build'), i('cranberry-juice', 3, 'oz', 'build'), i('grapefruit-juice', 0.5, 'oz', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lime-lemon-wedge'], garnishText: 'A Wedge of Lime or Lemon',
    tip: '크랜베리 3oz, 자몽 1/2oz. 양이 큰 쪽이 크랜베리.',
  },
  {
    id: 'apple-martini', nameEn: 'Apple Martini', nameKo: '애플 마티니', base: 'vodka', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('vodka', 1, 'oz', 'shake'), i('apple-pucker', 1, 'oz', 'shake'), i('lime-juice', 0.5, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: ['apple-slice'], garnishText: 'A Slice of Apple',
    tip: '이름은 마티니지만 진이 아니라 보드카 베이스, 스터가 아니라 셰이크.',
  },
  {
    id: 'negroni', nameEn: 'Negroni', nameKo: '네그로니', base: 'gin', glassId: 'old-fashioned', methods: ['build'],
    ingredients: [i('dry-gin', 0.75, 'oz', 'build'), i('sweet-vermouth', 0.75, 'oz', 'build'), i('campari', 0.75, 'oz', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lemon-twist'], garnishText: 'Twist of Lemon peel',
    tip: '각 3/4oz 빌드, 레몬 필. 불바디에(버번·각 1oz·스터·오렌지 필)와 헷갈리지 말 것.',
  },
  {
    id: 'long-island-iced-tea', nameEn: 'Long Island Iced Tea', nameKo: '롱 아일랜드 아이스티', base: 'gin', glassId: 'collins', methods: ['build'],
    ingredients: [i('dry-gin', 0.5, 'oz', 'build'), i('vodka', 0.5, 'oz', 'build'), i('light-rum', 0.5, 'oz', 'build'), i('tequila', 0.5, 'oz', 'build'), i('triple-sec', 0.5, 'oz', 'build'), i('sweet-sour-mix', 1.5, 'oz', 'build'), i('cola', 0, 'fill', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lime-lemon-wedge'], garnishText: 'A Wedge of Lime or Lemon',
    tip: '진·보드카·럼·데킬라·트리플 섹 각 1/2oz + 스위트앤사워 1 1/2oz, 콜라를 위에(On Top).',
  },
  {
    id: 'sidecar', nameEn: 'Sidecar', nameKo: '사이드카', base: 'brandy', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('brandy', 1, 'oz', 'shake'), i('triple-sec', 1, 'oz', 'shake'), i('lemon-juice', 0.25, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '브랜디 1 · 트리플 섹 1 · 레몬 1/4. 레몬이 1/4oz 로 적다.',
  },
  {
    id: 'mai-tai', nameEn: 'Mai-Tai', nameKo: '마이타이', base: 'rum', glassId: 'footed-pilsner', methods: ['blend'],
    ingredients: [i('light-rum', 1.25, 'oz', 'blend'), i('triple-sec', 0.75, 'oz', 'blend'), i('lime-juice', 1, 'oz', 'blend'), i('pineapple-juice', 1, 'oz', 'blend'), i('orange-juice', 1, 'oz', 'blend'), i('grenadine-syrup', 0.25, 'oz', 'blend')],
    glassIce: null, chill: true, rim: null, garnishIds: ['pineapple-cherry'], garnishText: 'A Wedge of fresh Pineapple(Orange) & Cherry',
    tip: '블렌더에 크러시드 아이스와 함께 간다. 럼 1 1/4, 트리플 섹 3/4, 주스 3종 각 1, 그레나딘 1/4.',
  },
  {
    id: 'pina-colada', nameEn: 'Pina Colada', nameKo: '피냐 콜라다', base: 'rum', glassId: 'footed-pilsner', methods: ['blend'],
    ingredients: [i('light-rum', 1.25, 'oz', 'blend'), i('pina-colada-mix', 2, 'oz', 'blend'), i('pineapple-juice', 2, 'oz', 'blend')],
    glassIce: null, chill: true, rim: null, garnishIds: ['pineapple-cherry'], garnishText: 'A Wedge of fresh Pineapple & Cherry',
    tip: '럼 1 1/4 + 피냐 콜라다 믹스 2 + 파인애플 주스 2, 블렌드.',
  },
  {
    id: 'cosmopolitan', nameEn: 'Cosmopolitan Cocktail', nameKo: '코스모폴리탄', base: 'vodka', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('vodka', 1, 'oz', 'shake'), i('triple-sec', 0.5, 'oz', 'shake'), i('lime-juice', 0.5, 'oz', 'shake'), i('cranberry-juice', 0.5, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: ['lime-lemon-twist'], garnishText: 'Twist of Lime or Lemon peel',
    tip: '보드카 1 + 나머지 셋 각 1/2oz.',
  },
  {
    id: 'moscow-mule', nameEn: 'Moscow Mule', nameKo: '모스코 뮬', base: 'vodka', glassId: 'highball', methods: ['build'],
    ingredients: [i('vodka', 1.5, 'oz', 'build'), i('lime-juice', 0.5, 'oz', 'build'), i('ginger-ale', 0, 'fill', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lime-lemon-slice'], garnishText: 'A Slice of Lime or Lemon',
    tip: '진저에일로 채운다. 가니쉬는 웨지가 아니라 슬라이스.',
  },
  {
    id: 'apricot', nameEn: 'Apricot Cocktail', nameKo: '애프리콧 칵테일', base: 'liqueur', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('apricot-brandy', 1.5, 'oz', 'shake'), i('dry-gin', 1, 'tsp', 'shake'), i('lemon-juice', 0.5, 'oz', 'shake'), i('orange-juice', 0.5, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '진은 1tsp 뿐. 애프리콧 브랜디 1 1/2oz 가 주재료.',
  },
  {
    id: 'honeymoon', nameEn: 'Honeymoon Cocktail', nameKo: '허니문 칵테일', base: 'brandy', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('apple-brandy', 0.75, 'oz', 'shake'), i('benedictine', 0.75, 'oz', 'shake'), i('triple-sec', 0.25, 'oz', 'shake'), i('lemon-juice', 0.5, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '애플 브랜디 3/4 · 베네딕틴 3/4 · 트리플 섹 1/4 · 레몬 1/2.',
  },
  {
    id: 'blue-hawaiian', nameEn: 'Blue Hawaiian', nameKo: '블루 하와이안', base: 'rum', glassId: 'footed-pilsner', methods: ['blend'],
    ingredients: [i('light-rum', 1, 'oz', 'blend'), i('blue-curacao', 1, 'oz', 'blend'), i('coconut-rum', 1, 'oz', 'blend'), i('pineapple-juice', 2.5, 'oz', 'blend')],
    glassIce: null, chill: true, rim: null, garnishIds: ['pineapple-cherry'], garnishText: 'A Wedge of fresh Pineapple & Cherry',
    tip: '럼·블루 큐라소·코코넛 럼 각 1oz + 파인애플 2 1/2oz, 블렌드.',
  },
  {
    id: 'kir', nameEn: 'Kir', nameKo: '키르', base: 'wine', glassId: 'white-wine', methods: ['build'],
    ingredients: [i('white-wine', 3, 'oz', 'build'), i('creme-de-cassis', 0.5, 'oz', 'build')],
    glassIce: null, chill: true, rim: null, garnishIds: ['lemon-twist'], garnishText: 'Twist of Lemon peel',
    tip: '화이트 와인 3oz + 크렘 드 카시스 1/2oz, 얼음 없이 빌드.',
  },
  {
    id: 'tequila-sunrise', nameEn: 'Tequila Sunrise', nameKo: '데킬라 선라이즈', base: 'tequila', glassId: 'footed-pilsner', methods: ['build', 'float'],
    ingredients: [i('tequila', 1.5, 'oz', 'build'), i('orange-juice', 0, 'fill', 'build'), i('grenadine-syrup', 0.5, 'oz', 'float')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: [], garnishText: '없음',
    tip: '오렌지 주스로 채운 뒤 그레나딘 1/2oz 를 흘려 넣어 아래로 가라앉힌다(해돋이). 젓지 않는다.',
  },
  {
    id: 'healing', nameEn: 'Healing', nameKo: '힐링', base: 'traditional', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('gamhongro', 1.5, 'oz', 'shake'), i('benedictine', 1 / 3, 'oz', 'shake'), i('creme-de-cassis', 1 / 3, 'oz', 'shake'), i('sweet-sour-mix', 1, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: ['lemon-twist'], garnishText: 'Twist of Lemon peel',
    tip: '감홍로(40도) 1 1/2oz. 베네딕틴·카시스 각 1/3oz.',
  },
  {
    id: 'jindo', nameEn: 'Jindo', nameKo: '진도', base: 'traditional', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('jindo-hongju', 1, 'oz', 'shake'), i('creme-de-menthe-white', 0.5, 'oz', 'shake'), i('white-grape-juice', 0.75, 'oz', 'shake'), i('raspberry-syrup', 0.5, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '진도 홍주(40도) 1oz. 민트는 화이트, 청포도 주스 3/4oz.',
  },
  {
    id: 'puppy-love', nameEn: 'Puppy Love', nameKo: '풋사랑', base: 'traditional', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('andong-soju', 1, 'oz', 'shake'), i('triple-sec', 1 / 3, 'oz', 'shake'), i('apple-pucker', 1, 'oz', 'shake'), i('lime-juice', 1 / 3, 'oz', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: ['apple-slice'], garnishText: 'A Slice of Apple',
    tip: '안동 소주(35도) 1 · 애플 퍼커 1 · 트리플 섹 1/3 · 라임 1/3. 가니쉬 사과.',
  },
  {
    id: 'geumsan', nameEn: 'Geumsan', nameKo: '금산', base: 'traditional', glassId: 'cocktail', methods: ['shake'],
    ingredients: [i('geumsan-insamju', 1.5, 'oz', 'shake'), i('coffee-liqueur', 0.5, 'oz', 'shake'), i('apple-pucker', 0.5, 'oz', 'shake'), i('lime-juice', 1, 'tsp', 'shake')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '금산 인삼주(43도) 1 1/2oz, 라임은 1tsp.',
  },
  {
    id: 'gochang', nameEn: 'Gochang', nameKo: '고창', base: 'traditional', glassId: 'champagne-flute', methods: ['stir'],
    ingredients: [i('bokbunja-wine', 2, 'oz', 'stir'), i('triple-sec', 0.5, 'oz', 'stir'), i('sprite', 2, 'oz', 'stir')],
    glassIce: null, chill: true, rim: null, garnishIds: [], garnishText: '없음',
    tip: '사이다까지 믹싱 글라스에서 스터(공식 조주법 Stir 하나). 플루트 샴페인 글라스.',
  },
  {
    id: 'gin-fizz', nameEn: 'Gin Fizz', nameKo: '진 피즈', base: 'gin', glassId: 'highball', methods: ['shake', 'build'],
    ingredients: [i('dry-gin', 1.5, 'oz', 'shake'), i('lemon-juice', 0.5, 'oz', 'shake'), i('powdered-sugar', 1, 'tsp', 'shake'), i('soda-water', 0, 'fill', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lemon-slice'], garnishText: 'A Slice of Lemon',
    tip: '진·레몬·설탕 셰이크 → 얼음 하이볼 글라스 → 소다수로 채움. 2022년 슬로 진 피즈에서 바뀜.',
  },
  {
    id: 'fresh-lemon-squash', nameEn: 'Fresh Lemon Squash', nameKo: '프레시 레몬 스쿼시', base: 'non-alcoholic', glassId: 'highball', methods: ['build'],
    ingredients: [i('fresh-lemon', 0.5, 'ea', 'build'), i('powdered-sugar', 2, 'tsp', 'build'), i('soda-water', 0, 'fill', 'build')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['lemon-slice'], garnishText: 'A Slice of Lemon',
    tip: '레몬 1/2개를 스퀴저로 직접 짠다. 설탕 2tsp 를 녹인 뒤 얼음, 소다수로 채움.',
  },
  {
    id: 'virgin-fruit-punch', nameEn: 'Virgin Fruit Punch', nameKo: '버진 프루트 펀치', base: 'non-alcoholic', glassId: 'footed-pilsner', methods: ['blend'],
    ingredients: [i('orange-juice', 1, 'oz', 'blend'), i('pineapple-juice', 1, 'oz', 'blend'), i('cranberry-juice', 1, 'oz', 'blend'), i('grapefruit-juice', 1, 'oz', 'blend'), i('lemon-juice', 0.5, 'oz', 'blend'), i('grenadine-syrup', 0.5, 'oz', 'blend')],
    glassIce: null, chill: true, rim: null, garnishIds: ['pineapple-cherry'], garnishText: 'A Wedge of fresh Pineapple & Cherry',
    tip: '주스 4종 각 1oz + 레몬 1/2 + 그레나딘 1/2, 블렌드.',
  },
  {
    id: 'boulevardier', nameEn: 'Boulevardier', nameKo: '불바디에', base: 'whiskey', glassId: 'old-fashioned', methods: ['stir'],
    ingredients: [i('bourbon-whiskey', 1, 'oz', 'stir'), i('sweet-vermouth', 1, 'oz', 'stir'), i('campari', 1, 'oz', 'stir')],
    glassIce: 'cube', chill: false, rim: null, garnishIds: ['orange-twist'], garnishText: 'Twist of Orange peel',
    tip: '2024년 추가. 각 1oz 를 믹싱 글라스에서 스터해 올드 패션드 글라스로. 가니쉬는 오렌지 필.',
  },
]
