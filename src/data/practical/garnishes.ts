import type { Garnish } from '../../types/practical'

/** 공식 가니쉬 표기 1개 = id 1개. "A or B" 표기는 하나의 id 로 둔다. 소금 리밍은 Recipe.rim 으로 표현 */
export const garnishes: Garnish[] = [
  { id: 'cherry', nameKo: '체리', nameEn: 'Cherry', description: '레드 체리 하나를 칵테일 픽에 꽂거나 잔에 넣는다. 맨해튼.' },
  { id: 'green-olive', nameKo: '그린 올리브', nameEn: 'Green Olive', description: '칵테일 픽에 꽂은 그린 올리브. 드라이 마티니.' },
  { id: 'orange-cherry', nameKo: '오렌지 슬라이스와 체리', nameEn: 'A Slice of Orange and Cherry', description: '오렌지 슬라이스와 체리를 함께. 올드 패션드·싱가포르 슬링.' },
  { id: 'lemon-cherry', nameKo: '레몬 슬라이스와 체리', nameEn: 'A Slice of Lemon and Cherry', description: '레몬 슬라이스와 체리를 함께. 위스키 사워.' },
  { id: 'pineapple-cherry', nameKo: '파인애플 웨지와 체리', nameEn: 'A Wedge of Fresh Pineapple & Cherry', description: '생 파인애플 웨지와 체리를 픽에 꽂는다. 블렌드 칵테일·준 벅. 마이타이는 파인애플 대신 오렌지 웨지도 인정.' },
  { id: 'nutmeg', nameKo: '넛맥 파우더', nameEn: 'Nutmeg Powder', description: '육두구 가루를 표면에 뿌린다. 브랜디 알렉산더.' },
  { id: 'lemon-twist', nameKo: '레몬 필 트위스트', nameEn: 'Twist of Lemon Peel', description: '레몬 껍질을 비틀어 향을 뿌리고 잔에 걸치거나 넣는다.' },
  { id: 'orange-twist', nameKo: '오렌지 필 트위스트', nameEn: 'Twist of Orange Peel', description: '오렌지 껍질을 비틀어 향을 뿌린다. 불바디에.' },
  { id: 'lime-lemon-twist', nameKo: '라임 또는 레몬 필 트위스트', nameEn: 'Twist of Lime or Lemon Peel', description: '라임이나 레몬 껍질 트위스트. 코스모폴리탄.' },
  { id: 'lemon-slice', nameKo: '레몬 슬라이스', nameEn: 'A Slice of Lemon', description: '둥글게 썬 레몬 한 조각. 진 피즈·프레시 레몬 스쿼시.' },
  { id: 'lime-lemon-slice', nameKo: '라임 또는 레몬 슬라이스', nameEn: 'A Slice of Lime or Lemon', description: '라임이나 레몬 슬라이스. 모스코 뮬.' },
  { id: 'lemon-wedge', nameKo: '레몬 웨지', nameEn: 'A Wedge of Lemon', description: '쐐기 모양 레몬 조각. 쿠바 리브레.' },
  { id: 'lime-lemon-wedge', nameKo: '라임 또는 레몬 웨지', nameEn: 'A Wedge of Lime or Lemon', description: '라임이나 레몬 웨지. 시브리즈·롱 아일랜드 아이스티.' },
  { id: 'apple-slice', nameKo: '사과 슬라이스', nameEn: 'A Slice of Apple', description: '얇게 저민 사과. 애플 마티니·풋사랑.' },
]
