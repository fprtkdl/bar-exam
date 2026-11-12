import type { Glass } from '../../types/practical'

/** 표준 레시피에 실제로 쓰이는 잔만. 용량은 일반적인 시판 규격 대표값 */
export const glasses: Glass[] = [
  { id: 'cocktail', nameKo: '칵테일 글라스', nameEn: 'Cocktail Glass', capacityOz: 4.5, stemmed: true, description: '역삼각형 볼에 긴 스템. 얼음 없이 서빙하므로 미리 칠링한다.' },
  { id: 'old-fashioned', nameKo: '올드 패션드 글라스', nameEn: 'Old-fashioned Glass', capacityOz: 8, stemmed: false, description: '키 낮고 바닥 두꺼운 텀블러. 록 글라스라고도 한다.' },
  { id: 'highball', nameKo: '하이볼 글라스', nameEn: 'Highball Glass', capacityOz: 10, stemmed: false, description: '얼음과 탄산·주스를 채우는 원통형 텀블러.' },
  { id: 'collins', nameKo: '콜린스 글라스', nameEn: 'Collins Glass', capacityOz: 12, stemmed: false, description: '하이볼보다 가늘고 긴 텀블러. 롱 아일랜드 아이스티·준 벅.' },
  { id: 'sour', nameKo: '사워 글라스', nameEn: 'Sour Glass', capacityOz: 5, stemmed: true, description: '스템이 있는 작은 잔. 위스키 사워 전용.' },
  { id: 'footed-pilsner', nameKo: '풋티드 필스너 글라스', nameEn: 'Footed Pilsner Glass', capacityOz: 12, stemmed: true, description: '받침이 달린 길쭉한 잔. 블렌드 칵테일·싱가포르 슬링·데킬라 선라이즈.' },
  { id: 'champagne-saucer', nameKo: '샴페인 글라스(소서형)', nameEn: 'Champagne Glass (Saucer)', capacityOz: 4.5, stemmed: true, description: '넓고 얕은 볼의 스템 잔. 그래스호퍼.' },
  { id: 'champagne-flute', nameKo: '플루트 샴페인 글라스', nameEn: 'Flute Champagne Glass', capacityOz: 6, stemmed: true, description: '가늘고 긴 볼의 스템 잔. 고창.' },
  { id: 'white-wine', nameKo: '화이트 와인 글라스', nameEn: 'White Wine Glass', capacityOz: 8, stemmed: true, description: '레드 와인 잔보다 작은 튤립형 스템 잔. 키르.' },
  { id: 'sherry', nameKo: '셰리 글라스(2oz)', nameEn: 'Sherry Glass (2oz)', capacityOz: 2, stemmed: true, description: '작은 스템 잔. B-52 를 층층이 쌓는다.' },
  { id: 'liqueur', nameKo: '리큐르 글라스(스템)', nameEn: 'Stemmed Liqueur Glass', capacityOz: 1, stemmed: true, description: '가늘고 작은 스템 잔. 푸스 카페를 층층이 쌓는다.' },
]
