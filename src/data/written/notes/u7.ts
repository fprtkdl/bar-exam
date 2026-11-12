import type { TopicNote } from '../../../types/written'

const notes: TopicNote[] = [
  {
    topicId: 'u7-t1',
    keywords: ['party', 'reservation', 'check / bill', 'on the house', 'separate checks', 'Would you mind', 'Take your time', 'Same again', 'another'],
    sections: [
      {
        heading: '맞이·안내 표현',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻·쓰임'],
            rows: [
              ['Good evening. Welcome to our bar.', '안녕하세요, 어서 오세요 (저녁 인사)'],
              ['How many are in your party? / How many people, please?', '일행이 몇 분이십니까? (**party** = 일행)'],
              ['Do you have a reservation?', '예약하셨습니까?'],
              ['Would you like to sit at the bar or at a table?', '바 좌석과 테이블 중 어디에 앉으시겠습니까?'],
              ['This way, please. / Follow me, please.', '이쪽으로 오세요 (안내)'],
              ['Please have a seat.', '앉으세요'],
              ['May I take your coat?', '외투를 받아 드릴까요?'],
              ['Just a moment, please.', '잠시만 기다려 주십시오'],
            ],
          },
        ],
      },
      {
        heading: '주문받기·추천·제공 표현',
        blocks: [
          {
            kind: 'table',
            head: ['상황', '바텐더(B)', '고객(G) 응답 예'],
            rows: [
              ['주문 받기', 'May I take your order? / What would you like to drink? / What can I get you?', "I'll have a gin and tonic. / I'd like a draft beer."],
              ['아직 못 정함', 'Take your time. I\'ll be back in a few minutes. (천천히 고르세요)', "I haven't decided yet."],
              ['추천 요청', "I'd recommend our house special. / How about a Mojito? / Why don't you try ~?", 'What do you recommend?'],
              ['마시는 방식 묻기', 'How would you like it? Straight or on the rocks?', 'On the rocks, please.'],
              ['주문 확인', 'Let me repeat your order. / Anything else?', "That's all, thanks."],
              ['곧 나감', 'Certainly. / Sure. / Coming right up. (곧 갖다 드리겠습니다)', '-'],
              ['음료 제공', 'Here you are. / Here is your drink. Enjoy your drink.', 'Thank you.'],
              ['추가 주문', 'Would you like another drink? / Another round?', 'Same again, please. (같은 걸로 한 잔 더)'],
              ['나이 확인', 'May I see your ID, please? (신분증 좀 보여 주시겠어요?)', 'Sure, here it is.'],
              ['영업 종료', "Last call for drinks. (마지막 주문 받습니다) / We close at midnight.", '-'],
            ],
          },
          {
            kind: 'tip',
            text: '**another + 단수명사** = (같은 종류) 하나 더: "Would you like **another drink**?" ↔ other 는 단수 가산명사 앞에 관사 없이 못 쓴다(other drink ✕). **had better + 동사원형** (had better to ✕). 손님 대사("I\'d like ~")와 바텐더 대사("I\'d recommend ~")를 구분하는 문제가 자주 나온다.',
          },
        ],
      },
      {
        heading: '예약 표현',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻'],
            rows: [
              ["I'd like to make a reservation for four at 8 p.m.", '오후 8시에 4명 예약하고 싶습니다'],
              ['For how many people? / How many will there be in your party?', '몇 분이십니까?'],
              ['For what time? / What time would you like?', '몇 시로 해 드릴까요?'],
              ['Under what name? / May I have your name, please?', '어느 분 성함으로 할까요?'],
              ["I'd like to change (cancel) my reservation.", '예약을 변경(취소)하고 싶습니다'],
              ["I'm sorry, we're fully booked tonight.", '죄송하지만 오늘 밤은 예약이 다 찼습니다'],
              ['No-show', '예약하고 연락 없이 나타나지 않음'],
            ],
          },
        ],
      },
      {
        heading: '계산 표현',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻'],
            rows: [
              ['Could I have the check (bill), please?', '계산서 주세요 (미국 check, 영국 bill)'],
              ['How would you like to pay? / Cash or charge?', '어떻게 계산하시겠습니까? 현금입니까, 카드입니까?'],
              ["I'll pay by credit card. / I'll pay in cash.", '신용카드(현금)로 내겠습니다'],
              ["We'd like to pay separately. / Separate checks, please.", '각자 따로 계산하겠습니다 (split the bill, go Dutch 도 같은 뜻)'],
              ["It's on me. / It's my treat.", '제가 낼게요 (손님끼리)'],
              ["It's on the house.", '가게에서 무료로 드리는 것입니다 (서비스)'],
              ['Could you charge it to my room? / Put it on my room bill.', '객실 요금으로 달아 주세요 (호텔 바) → May I have your room number?'],
              ['Please sign here.', '여기에 서명해 주세요'],
              ["Here's your change. / Keep the change.", '거스름돈 여기 있습니다 / 거스름돈은 가지세요(팁)'],
              ['Is the service charge included?', '봉사료가 포함되어 있나요?'],
            ],
          },
          {
            kind: 'tip',
            text: '**on the house** (업장 무료) 와 **on me** (내가 계산) 를 헷갈리게 내는 문제가 단골이다.',
          },
        ],
      },
      {
        heading: '불만 처리·정중한 거절',
        blocks: [
          {
            kind: 'list',
            items: [
              '사과: **I\'m sorry for the inconvenience.** / I apologize. (불편을 드려 죄송합니다)',
              '즉시 조치: **I\'ll make you a new one right away.** / I\'ll bring you another one. (새로 만들어 드리겠습니다)',
              '확인: Let me check with the manager. (매니저에게 확인해 보겠습니다)',
              '고객 불만 예: This is too sweet(strong). / I didn\'t order this. / This beer is flat. (김이 빠졌다)',
              '정중한 거절: **I\'m afraid** smoking isn\'t allowed in here. (죄송하지만 ~)',
            ],
          },
          {
            kind: 'tip',
            text: '**Would you mind if I ~?** 는 "~해도 괜찮을까요?(꺼리시나요?)". **Not at all / Of course not** = 괜찮다(허락). 거절할 때는 "I\'m afraid ~" 로 이유를 말한다. 불만에는 "You\'re welcome", "Enjoy your drink" 같은 엉뚱한 응답 대신 사과 + 조치가 정답.',
          },
        ],
      },
    ],
  },
  {
    topicId: 'u7-t2',
    keywords: ['back bar', 'under bar', 'jigger', 'strainer', 'muddler', 'stir', 'float', 'straight / neat', 'on the rocks', 'chaser', 'dash', 'corkage'],
    sections: [
      {
        heading: '바 시설물',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻'],
            rows: [
              ['Front bar (bar counter)', '고객이 앉아 마시는 바 카운터'],
              ['Back bar', '바텐더 뒤편의 술병·글라스 진열장(장식·보관)'],
              ['Under bar', '카운터 아래 바텐더 작업대(싱크, 아이스 빈, 스피드 랙)'],
              ['Speed rack (speed rail)', '작업대 앞에 자주 쓰는 술병을 꽂아 두는 선반'],
              ['Ice bin / Ice maker', '얼음 보관통 / 제빙기'],
              ['Bar stool', '바 카운터용 높은 의자'],
              ['Beer tap (draft tower)', '생맥주 추출기'],
              ['Wine cellar', '와인 저장고'],
            ],
          },
        ],
      },
      {
        heading: '조주 기구 (영문 설명으로 출제)',
        blocks: [
          {
            kind: 'table',
            head: ['기구', '영문 설명 핵심어', '뜻'],
            rows: [
              ['Shaker', 'cap, strainer, body / shake with ice', '셰이커'],
              ['Mixing glass', 'stir with ice', '믹싱 글라스'],
              ['Bar spoon', 'long spoon for stirring and floating', '바 스푼'],
              ['Jigger (measure cup)', '**measure** liquor, two cones of different sizes', '지거 (계량컵)'],
              ['Strainer', '**hold back ice** when pouring', '스트레이너 (얼음 걸러 내기)'],
              ['Muddler', '**crush** fruit, herbs or sugar in a glass', '머들러 (으깨기)'],
              ['Squeezer', 'squeeze juice from lemons and limes', '스퀴저 (즙 짜기)'],
              ['Ice tongs / Ice scoop / Ice pick', 'pick up / scoop / break ice', '얼음 집게 / 얼음 삽 / 얼음 송곳'],
              ['Blender', 'electric machine for frozen drinks', '블렌더'],
              ['Corkscrew (wine opener)', 'remove a cork', '코르크 따개'],
              ['Pourer', 'fits into a bottle neck to control the flow', '푸어러'],
              ['Coaster', 'small mat under a glass', '컵 받침'],
            ],
          },
        ],
      },
      {
        heading: '조주 기법',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '영문 설명', '뜻'],
            rows: [
              ['Shake', 'mix ingredients with ice in a shaker by shaking hard', '흔들기'],
              ['Stir', 'mix ingredients with ice in a **mixing glass** using a **bar spoon**', '휘젓기'],
              ['Build', 'pour ingredients directly into the serving glass', '글라스에 직접 붓기'],
              ['Float (layer)', 'pour gently over the back of a bar spoon so it rests **on top of** another liquid', '띄우기(층 쌓기)'],
              ['Blend', 'mix with crushed ice in an electric blender', '블렌더로 갈기'],
              ['Muddle', 'crush ingredients in the glass with a muddler', '으깨기'],
              ['Frost (rimming)', 'coat the rim of a glass with salt or sugar', '글라스 테두리에 소금·설탕 묻히기'],
            ],
          },
        ],
      },
      {
        heading: '마시는 방식·용량·영업 용어',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻'],
            rows: [
              ['Straight / Neat', '얼음·물 없이 술만 그대로'],
              ['On the rocks', '얼음 위에 부어서 (올드패션드 글라스)'],
              ['Straight up (up)', '얼음과 함께 섞은 뒤 얼음 없이 걸러 냄'],
              ['Chaser', '독한 술을 마신 뒤 바로 마시는 물·음료 (water back 도 같은 쓰임)'],
              ['Double', '두 배 분량'],
              ['Dash', '비터 등을 몇 방울 떨어뜨리는 아주 적은 양(약 1/32 oz)'],
              ['Pony', '1 oz (약 30 ml)'],
              ['Jigger (shot)', '1.5 oz (약 45 ml)'],
              ['Highball', '증류주 + 탄산음료를 긴 글라스에 담은 음료'],
              ['Nightcap', '잠자리에 들기 전 마시는 술'],
              ['Corkage (charge)', '손님이 가져온 술을 따 주고 받는 요금'],
              ['House brand (well)', '술 이름을 지정하지 않으면 나가는 기본 술'],
              ['Happy hour', '할인 시간대'],
            ],
          },
          {
            kind: 'tip',
            text: '용량 크기: **dash < pony(1 oz) < jigger(1.5 oz) < double**. 1 oz ≈ 30 ml. **Chaser** 는 술이 아니라 "뒤따라 마시는 음료" 라는 점이 핵심.',
          },
        ],
      },
    ],
  },
  {
    topicId: 'u7-t3',
    keywords: ['fermented', 'distilled', 'liqueur', 'aperitif', 'digestif', 'juniper', 'agave', 'molasses', 'bourbon', 'cognac', 'vintage', 'dry', 'lager'],
    sections: [
      {
        heading: '분류 용어',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻'],
            rows: [
              ['Fermented liquor (brewed)', '양조주: 와인·맥주·사케'],
              ['Distilled liquor (spirits)', '증류주: 위스키·브랜디·진·보드카·럼·데킬라'],
              ['Compounded liquor / Liqueur', '혼성주: 증류주에 과일·허브·향료·당분을 더한 술'],
              ['Fortified wine', '주정강화 와인: 셰리(Sherry, 스페인), 포트(Port, 포르투갈)'],
              ['Aperitif', '식전주 (식욕 돋움)'],
              ['Digestif (after-dinner drink)', '식후주 (소화 돕기)'],
              ['Proof', '미국식 알코올 도수 표기 = 도수(%) × 2'],
            ],
          },
        ],
      },
      {
        heading: '증류주 영문 설명 핵심어',
        blocks: [
          {
            kind: 'table',
            head: ['술', '영문 설명 핵심어', '뜻'],
            rows: [
              ['Scotch whisky', 'malted barley, peat, Scotland, aged in oak casks at least 3 years', '스코틀랜드, 맥아·피트'],
              ['Bourbon whiskey', 'USA (mainly Kentucky), at least **51% corn**, new **charred oak** barrels', '미국, 옥수수 51% 이상, 그을린 새 오크통'],
              ['Cognac', 'brandy distilled from **wine** (grapes), Cognac region of **France**, aged in oak', '프랑스 코냑 지방 포도 브랜디'],
              ['Calvados', '**apple** brandy from Normandy, France', '사과 브랜디'],
              ['Kirsch', '**cherry** brandy', '체리 브랜디'],
              ['Grappa', 'Italian brandy made from grape **pomace** (skins and seeds left after pressing)', '포도 찌꺼기 브랜디(이탈리아)'],
              ['Gin', 'neutral spirit flavored with **juniper berries**, colorless', '노간주 열매 향'],
              ['Vodka', 'from grain or potatoes, filtered through **charcoal**, colorless and nearly odorless', '숯 여과, 무색·무취'],
              ['Rum', 'from **sugarcane** juice or **molasses**, the Caribbean', '사탕수수·당밀, 카리브해'],
              ['Tequila', 'from **blue agave**, Jalisco, **Mexico**', '블루 아가베, 멕시코'],
            ],
          },
        ],
      },
      {
        heading: '혼성주·양조주 영문 설명 핵심어',
        blocks: [
          {
            kind: 'table',
            head: ['술', '영문 설명 핵심어'],
            rows: [
              ['Kahlua', '**coffee** liqueur from Mexico'],
              ['Cointreau (triple sec)', '**orange** liqueur from France'],
              ['Drambuie', 'Scotch whisky + heather **honey** + herbs'],
              ["Baileys", 'Irish whiskey + **cream** (Irish cream liqueur)'],
              ['Campari', 'Italian **bitter** red aperitif'],
              ['Amaretto', '**almond**-flavored Italian liqueur'],
              ['Crème de cassis / Crème de menthe', '**blackcurrant** / **mint** liqueur'],
              ['Champagne', '**sparkling wine** from the Champagne region of France, second fermentation in the bottle'],
              ['Lager', 'beer fermented at **low** temperature with yeast that sinks to the **bottom** (하면발효)'],
              ['Ale', 'beer fermented at warmer temperature with yeast that rises to the **top** (상면발효)'],
            ],
          },
        ],
      },
      {
        heading: '와인·칵테일 영어 표현',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻'],
            rows: [
              ['Vintage', '포도를 **수확한 해** (라벨의 연도)'],
              ['Dry / Sweet', '단맛이 거의 없음 / 단맛이 있음'],
              ['Full-bodied / Light-bodied', '맛이 무겁고 진함 / 가벼움'],
              ['Bouquet (aroma)', '와인의 향'],
              ['Sommelier', '와인 담당 직원'],
              ['House wine', '업장이 기본으로 내는 와인 (a glass of house red)'],
              ['Red or white? / A glass or a bottle?', '와인 주문 시 묻는 표현'],
            ],
          },
          {
            kind: 'table',
            head: ['칵테일', '영문 설명'],
            rows: [
              ['Martini', 'gin + dry vermouth, garnished with an **olive**'],
              ['Manhattan', 'whiskey + sweet vermouth + Angostura bitters, garnished with a **cherry**'],
              ['Margarita', 'tequila + triple sec + lime juice, **salt-rimmed** glass'],
              ['Bloody Mary', 'vodka + **tomato juice** (+ lemon, Worcestershire sauce, Tabasco), celery'],
              ['Screwdriver', 'vodka + orange juice'],
              ['Cuba Libre', 'rum + lime juice + cola'],
            ],
          },
          {
            kind: 'tip',
            text: '영문 설명 문제는 **원료·산지 단어 하나**로 푼다: juniper→진, agave→데킬라, molasses→럼, 51% corn→버번, apple→칼바도스, coffee→칼루아, honey→드람뷰이. 위스키 주문을 받으면 "How would you like it? Straight or on the rocks?" 로 마시는 방식을 묻는다.',
          },
        ],
      },
    ],
  },
  {
    topicId: 'u7-t4',
    keywords: ['soft drink', 'carbonated', 'tonic water', 'quinine', 'still / sparkling', 'decaf', 'cappuccino', 'unfermented', 'mocktail', 'Virgin Mary', 'refill'],
    sections: [
      {
        heading: '청량음료·물',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '영문 설명 핵심어 / 뜻'],
            rows: [
              ['Soft drink', '알코올이 없는 음료(주로 청량음료)'],
              ['Carbonated drink (soda)', '탄산음료'],
              ['Tonic water', 'carbonated water flavored with **quinine** (키니네), 진 토닉에 사용'],
              ['Ginger ale', '**ginger**-flavored carbonated drink'],
              ['Club soda (soda water)', '향 없는 탄산수'],
              ['Lemonade', 'lemon juice + sugar + water'],
              ['Mineral water: still / sparkling', '광천수: **탄산 없는 물 / 탄산 있는 물**'],
              ['Grenadine syrup', '**pomegranate**(석류) 시럽, 붉은색'],
            ],
          },
        ],
      },
      {
        heading: '커피',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '구성'],
            rows: [
              ['Espresso', '고압으로 짧게 추출한 진한 커피'],
              ['Americano', 'espresso + hot water'],
              ['Cafe latte', 'espresso + a lot of steamed milk, thin layer of foam'],
              ['Cappuccino', 'espresso + steamed milk + **thick layer of milk foam**'],
              ['Cafe mocha', 'espresso + **chocolate** + steamed milk'],
              ['Macchiato', 'espresso "marked" with a small amount of milk foam'],
              ['Decaf (decaffeinated)', '**카페인을 제거한** 커피 ↔ regular'],
            ],
          },
          {
            kind: 'list',
            items: [
              'How would you like your coffee? — Black, please. / With cream and sugar.',
              'Regular or decaf? (일반 커피와 디카페인 중 어느 것?)',
              'Would you like a **refill**? (더 채워 드릴까요?)',
            ],
          },
        ],
      },
      {
        heading: '차',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '발효 정도'],
            rows: [
              ['Green tea', '**불발효차** (unfermented)'],
              ['Oolong tea', '**반발효차** (semi-fermented)'],
              ['Black tea', '**완전발효차** (fully fermented) = 홍차'],
              ['Herbal tea', '허브의 꽃·잎·뿌리를 우린 차 (예: chamomile, peppermint)'],
            ],
          },
          {
            kind: 'tip',
            text: '**Black tea = 홍차** (검은 차가 아님). 녹차 → 우롱차 → 홍차 순으로 발효 정도가 커진다.',
          },
        ],
      },
      {
        heading: '무알코올 칵테일 (Mocktail)',
        blocks: [
          {
            kind: 'table',
            head: ['영어', '뜻·구성'],
            rows: [
              ['Mocktail (virgin cocktail)', 'a mixed drink that contains **no alcohol** (mock + cocktail)'],
              ['Virgin Mary', 'Bloody Mary **without vodka**'],
              ['Shirley Temple', 'ginger ale + grenadine, cherry garnish'],
            ],
          },
          {
            kind: 'tip',
            text: '음료 앞의 **virgin** = "술을 뺀". 운전하는 손님에게는 "Would you like a non-alcoholic drink?" 로 무알코올 음료를 권한다.',
          },
        ],
      },
    ],
  },
]

export default notes
