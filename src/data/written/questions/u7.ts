import type { Question } from '../../../types/written'

const q = (t: number, n: number, rest: Omit<Question, 'id' | 'unitId' | 'topicId'>): Question => ({
  id: `u7-t${t}-q${String(n).padStart(2, '0')}`,
  unitId: 'u7',
  topicId: `u7-t${t}`,
  ...rest,
})

const questions: Question[] = [
  // ── t1 기초 외국어와 접객 서비스 표현 ──
  q(1, 1, {
    type: 'english',
    difficulty: 1,
    stem: '다음 대화의 빈칸에 들어갈 말로 가장 알맞은 것은?',
    passage: 'B: Good evening. Welcome to our bar. ______\nG: Two, please. We don\'t have a reservation.',
    choices: ['How many are in your party?', 'What would you like to drink?', 'How would you like to pay?', 'Would you like another one?'],
    answer: 0,
    explanation:
      '해석: B "안녕하세요, 어서 오세요. ______" / G "두 명이요. 예약은 안 했어요." 고객이 "Two(두 명)" 라고 답했으므로 인원을 묻는 "How many are in your party?(일행이 몇 분이십니까?)" 가 알맞다. party = 일행. 음료 주문·결제 방법·추가 주문을 묻는 말에는 "Two" 라고 답하지 않는다.',
  }),
  q(1, 2, {
    type: 'english',
    difficulty: 1,
    stem: '고객의 주문에 대한 바텐더의 응답으로 가장 알맞은 것은?',
    passage: "G: I'll have a Scotch on the rocks.\nB: ______",
    choices: ["You're welcome.", 'Not at all.', 'Certainly. Coming right up.', 'Keep the change.'],
    answer: 2,
    explanation:
      '해석: G "스카치 온더록으로 할게요." 주문을 받으면 "Certainly. Coming right up.(알겠습니다. 곧 갖다 드리겠습니다)" 으로 응답한다. "You\'re welcome" 은 감사 인사에 대한 답, "Not at all" 은 감사·부탁에 대한 답, "Keep the change(거스름돈은 가지세요)" 는 고객이 계산할 때 하는 말이다.',
  }),
  q(1, 3, {
    type: 'english',
    difficulty: 2,
    stem: '다음 예약 대화의 빈칸에 들어갈 말로 가장 알맞은 것은?',
    passage: "G: I'd like to make a reservation for tomorrow evening.\nB: Certainly. ______\nG: Four people, at eight o'clock.\nB: Under what name, please?",
    choices: ['Would you like to sit at the bar?', 'For how many people, and at what time?', 'How would you like to pay?', 'May I see your ID, please?'],
    answer: 1,
    explanation:
      '해석: G "내일 저녁 예약하고 싶어요." B "알겠습니다. ______" G "4명, 8시요." B "어느 분 성함으로 할까요?" 고객이 인원(Four people)과 시간(eight o\'clock)으로 답했으므로 "몇 분이시고 몇 시로 해 드릴까요?" 가 정답이다. 좌석 위치·결제 방법·신분증 요청에는 인원과 시간으로 답하지 않는다.',
  }),
  q(1, 4, {
    type: 'english',
    difficulty: 1,
    stem: '고객이 다음과 같이 말했을 때 원하는 것은?',
    passage: 'G: Could I have the check, please?',
    choices: ['예약을 확인해 달라', '주문을 다시 확인해 달라', '외투를 맡아 달라', '계산서를 가져다 달라'],
    answer: 3,
    explanation:
      '해석: "계산서 좀 주시겠어요?" check(미국)·bill(영국) 은 계산서다. "Could I have ~?" 는 "~을 주시겠어요?" 라는 정중한 요청. check 를 "확인하다" 의 뜻으로 오해해 ①·② 를 고르지 않도록 주의한다.',
  }),
  q(1, 5, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화의 빈칸에 들어갈 바텐더의 응답으로 가장 알맞은 것은?',
    passage: "G: We'd like to pay separately.\nB: ______",
    choices: ["Sure. I'll bring you separate checks.", "Sure. It's on the house.", "I'm sorry, we're fully booked.", "Sure. I'll put everything on one bill."],
    answer: 0,
    explanation:
      '해석: G "따로따로 계산하고 싶어요." → B "네, 계산서를 따로 가져다 드리겠습니다." separately·separate checks = 각자 계산. "It\'s on the house" 는 업장이 무료로 제공한다는 뜻, "fully booked" 는 예약이 다 찼다는 뜻, "one bill" 은 한 장으로 합쳐 계산하는 것이므로 요청과 반대다.',
  }),
  q(1, 6, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화에서 밑줄 친 "It\'s on the house" 의 뜻으로 옳은 것은?',
    passage: "G: Excuse me, I didn't order this dessert wine.\nB: It's on the house, sir. We hope you enjoy it.",
    choices: ['고객이 직접 계산해야 한다', '업장에서 무료로 제공한다', '객실 요금으로 청구된다', '일행이 나누어 계산한다'],
    answer: 1,
    explanation:
      '해석: G "실례지만 이 디저트 와인은 주문하지 않았는데요." B "가게에서 드리는 서비스입니다. 맛있게 드세요." on the house = 업장(가게)이 비용을 부담 = 무료 제공. "It\'s on me(제가 낼게요)" 와 혼동하기 쉽다. 객실 청구는 charge it to my room, 나누어 계산은 separate checks.',
  }),
  q(1, 7, {
    type: 'english',
    difficulty: 1,
    stem: '고객의 불만에 대한 바텐더의 응답으로 가장 알맞은 것은?',
    passage: "G: Excuse me, this cocktail is too sweet. I can't drink it.\nB: ______",
    choices: ["You're welcome. Cheers!", "That's all right. Enjoy your drink.", 'Thank you. Please come again.', "I'm sorry about that. I'll make you a new one right away."],
    answer: 3,
    explanation:
      '해석: G "이 칵테일이 너무 달아서 못 마시겠어요." 불만에는 사과 + 즉시 조치가 원칙이다: "죄송합니다. 바로 새로 만들어 드리겠습니다." 나머지는 불만을 무시하거나(Enjoy your drink), 상황과 맞지 않는 인사(You\'re welcome, Please come again)다.',
  }),
  q(1, 8, {
    type: 'english',
    difficulty: 3,
    stem: '다음 상황에서 빈칸에 들어갈 바텐더의 응답으로 가장 알맞은 것은?',
    passage: '(The bar is a non-smoking area.)\nG: Would you mind if I smoke here?\nB: ______',
    choices: ['Not at all. Go ahead.', "I'm afraid smoking isn't allowed in here.", "Of course not. Here's an ashtray.", 'No problem. Enjoy your cigarette.'],
    answer: 1,
    explanation:
      '해석: (바는 금연 구역이다.) G "여기서 담배 피워도 될까요?" "Would you mind if ~?" 는 "~하면 꺼리시겠어요?" 라는 뜻이라 "Not at all / Of course not / No problem" 은 모두 "괜찮다(피워도 된다)" 는 허락이 된다. 금연 구역이므로 "죄송하지만 이곳은 금연입니다(I\'m afraid ~)" 로 정중히 거절해야 한다.',
  }),
  q(1, 9, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화의 빈칸에 들어갈 바텐더의 말로 가장 알맞은 것은?',
    passage: "G: I can't decide. What do you recommend?\nB: ______",
    choices: ["I'd recommend our house special, a Mojito.", "I'd like to have a Mojito, please.", 'You had better to try a Mojito.', "No, I don't recommend anything."],
    answer: 0,
    explanation:
      '해석: G "못 고르겠네요. 뭘 추천하세요?" → B "저희 하우스 스페셜인 모히토를 추천합니다." ② "I\'d like ~" 는 손님이 주문할 때 쓰는 말이다. ③ had better 뒤에는 동사원형이 와야 하므로 "had better to try" 는 문법상 틀렸다(had better try). ④ 추천 요청을 거절하는 무례한 응답이다.',
  }),
  q(1, 10, {
    type: 'english',
    difficulty: 1,
    stem: '다음 대화에서 고객이 원하는 것은?',
    passage: 'B: Would you like another drink?\nG: Same again, please.',
    choices: ['이제 그만 마시겠다', '다른 술을 추천해 달라', '같은 술로 한 잔 더 달라', '계산서를 같이 달라'],
    answer: 2,
    explanation:
      '해석: B "한 잔 더 하시겠습니까?" G "같은 걸로 한 잔 더 주세요." Same again = 방금 마신 것과 같은 것을 다시. 다른 술을 원하면 "Something different", 그만 마시려면 "No, thanks. I\'m fine." 이라고 한다.',
  }),
  q(1, 11, {
    type: 'english',
    difficulty: 2,
    stem: '호텔 바에서의 다음 대화 빈칸에 들어갈 말로 가장 알맞은 것은?',
    passage: 'G: Can I put this on my room bill?\nB: Certainly. ______',
    choices: ['How many are in your party?', 'Would you like it on the rocks?', 'Do you have a reservation?', 'May I have your room number, please?'],
    answer: 3,
    explanation:
      '해석: G "이걸 제 객실 요금에 달아 줄 수 있나요?" B "물론입니다. 객실 번호를 알려 주시겠습니까?" 객실 청구(room charge)를 하려면 객실 번호와 서명이 필요하다. 일행 수·마시는 방식·예약 여부는 계산과 관계없는 질문이다.',
  }),
  q(1, 12, {
    type: 'english',
    difficulty: 1,
    stem: '바텐더가 다음과 같이 말하는 주된 목적은?',
    passage: 'B: Excuse me. May I see your ID, please?',
    choices: ['예약 여부를 확인하려고', '객실 번호를 확인하려고', '나이(신분)를 확인하려고', '결제 수단을 확인하려고'],
    answer: 2,
    explanation:
      '해석: "실례지만 신분증 좀 보여 주시겠어요?" ID(identification) = 신분증. 바에서는 미성년자에게 주류를 판매하지 않도록 신분증으로 나이를 확인한다. 예약은 "Do you have a reservation?", 결제 수단은 "How would you like to pay?" 로 묻는다.',
  }),
  q(1, 13, {
    type: 'english',
    difficulty: 3,
    stem: '다음 빈칸에 들어갈 말로 문법상 알맞은 것은?',
    passage: 'B: Your glass is empty. Would you like ______ drink?',
    choices: ['another', 'other', 'others', 'the others'],
    answer: 0,
    explanation:
      '해석: "잔이 비었네요. 한 잔 더 하시겠어요?" another + 단수 가산명사 = (같은 종류의) 하나 더. other 는 단수 가산명사 앞에 관사 없이 단독으로 쓰지 않고(other drink ✕), others·the others 는 대명사라 명사 앞에 올 수 없다.',
  }),
  q(1, 14, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화의 빈칸에 들어갈 고객의 대답으로 가장 알맞은 것은?',
    passage: 'B: How would you like to pay, sir?\nG: ______',
    choices: ['On the rocks, please.', 'For two people, please.', 'With lemon, please.', 'By credit card, please.'],
    answer: 3,
    explanation:
      '해석: B "어떻게 계산하시겠습니까?" G "신용카드로 할게요." pay(지불하다)를 묻는 질문이므로 결제 수단으로 답한다. "How would you like ~?" 형태가 같아도 "How would you like it?(술을 어떻게 드릴까요?)" 에는 On the rocks, 차에는 With lemon 으로 답한다. 인원은 예약·안내 때 묻는다.',
  }),
  q(1, 15, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화에서 고객의 마지막 말이 뜻하는 것은?',
    passage: "B: That comes to 18 dollars.\nG: Here's 20 dollars. Keep the change.",
    choices: ['거스름돈 2달러를 달라', '영수증을 함께 달라', '거스름돈 2달러는 팁으로 가지라', '카드로 다시 계산해 달라'],
    answer: 2,
    explanation:
      '해석: B "18달러입니다." G "20달러 여기 있어요. 거스름돈은 가지세요." Keep the change = 남는 돈(2달러)을 돌려주지 말고 가지라는 뜻으로 팁을 주는 표현이다. 바텐더가 거스름돈을 줄 때는 "Here\'s your change." 라고 한다.',
  }),
  q(1, 16, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화의 빈칸에 들어갈 바텐더의 말로 가장 알맞은 것은?',
    passage: "B: Are you ready to order?\nG: Not yet. I haven't decided.\nB: ______",
    choices: ["Hurry up, please. We're busy.", "Take your time. I'll be back in a few minutes.", 'Same again, please.', 'Here you are. Enjoy your drink.'],
    answer: 1,
    explanation:
      '해석: B "주문하시겠습니까?" G "아직이요. 못 정했어요." B "천천히 고르세요. 몇 분 뒤에 다시 오겠습니다." Take your time = 서두르지 말고 천천히. ① 고객을 재촉하는 무례한 말, ③ 고객이 추가 주문할 때 쓰는 말, ④ 음료를 낼 때 하는 말이다.',
  }),

  // ── t2 음료 영업장 전문용어 ──
  q(2, 1, {
    type: 'english',
    difficulty: 1,
    stem: '다음 설명에 해당하는 기구는?',
    passage: 'This is a tool used to measure the amount of liquor. It usually has two cones of different sizes joined together.',
    choices: ['Jigger', 'Strainer', 'Muddler', 'Squeezer'],
    answer: 0,
    explanation:
      '해석: "술의 양을 재는 데 쓰는 도구로, 보통 크기가 다른 원뿔 두 개가 붙어 있다." → 지거(계량컵). measure(재다)가 핵심어. 스트레이너는 얼음을 거르고, 머들러는 으깨고, 스퀴저는 즙을 짠다.',
  }),
  q(2, 2, {
    type: 'english',
    difficulty: 1,
    stem: '다음 설명에 해당하는 기구는?',
    passage: 'This is used to hold back ice when you pour a drink from a shaker or a mixing glass into a glass.',
    choices: ['Ice tongs', 'Strainer', 'Bar spoon', 'Pourer'],
    answer: 1,
    explanation:
      '해석: "셰이커나 믹싱 글라스에서 잔으로 음료를 따를 때 얼음을 걸러 내는(hold back) 데 쓴다." → 스트레이너. 아이스 텅스는 얼음을 집는 집게, 바 스푼은 젓거나 띄울 때 쓰는 긴 스푼, 푸어러는 병목에 끼워 따르는 양을 조절하는 마개다.',
  }),
  q(2, 3, {
    type: 'english',
    difficulty: 2,
    stem: '바(bar) 시설 용어 "Back bar" 의 뜻으로 옳은 것은?',
    choices: ['고객이 앉아 마시는 바 카운터', '카운터 아래 바텐더 작업대', '바텐더 뒤편의 술병·글라스 진열장', '생맥주를 뽑는 추출기'],
    answer: 2,
    explanation:
      'Back bar 는 바텐더 뒤쪽에 술병과 글라스를 진열·보관하는 장식장이다. ① 은 Front bar(bar counter), ② 는 Under bar(싱크·아이스 빈·스피드 랙이 있는 작업대), ④ 는 Beer tap(draft tower)이다.',
  }),
  q(2, 4, {
    type: 'english',
    difficulty: 2,
    stem: '다음 고객의 주문 방식을 영어로 나타낸 것으로 가장 알맞은 것은?',
    passage: "G: I'd like a Scotch, without ice or water, please.",
    choices: ['On the rocks', 'Straight', 'With a chaser', 'Frozen'],
    answer: 1,
    explanation:
      '해석: "얼음도 물도 없이 스카치 주세요." 얼음·물 없이 술만 그대로 마시는 방식은 Straight(=Neat)다. On the rocks 는 얼음 위에 붓는 방식, chaser 는 뒤따라 마시는 물·음료를 곁들이는 것, frozen 은 갈아 낸 얼음과 섞은 음료다.',
  }),
  q(2, 5, {
    type: 'english',
    difficulty: 2,
    stem: '다음 문장에서 "chaser" 의 뜻으로 옳은 것은?',
    passage: 'G: A shot of tequila, please. And a glass of water as a chaser.',
    choices: ['술에 섞는 탄산음료', '술잔 테두리에 묻히는 소금', '술을 두 배로 담은 것', '독한 술을 마신 뒤 이어 마시는 음료'],
    answer: 3,
    explanation:
      '해석: "데킬라 한 잔이랑, 체이서로 물 한 잔 주세요." chaser 는 독한 술을 마신 직후 입가심으로 따라 마시는 물·음료다(water back 도 같은 쓰임). 술에 섞는 탄산음료는 mixer, 테두리에 소금을 묻히는 것은 frost(rimming), 두 배 분량은 double.',
  }),
  q(2, 6, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 조주 기법은?',
    passage: 'Mix the ingredients with ice in a mixing glass by using a bar spoon, and then strain into a chilled glass.',
    choices: ['Shake', 'Stir', 'Build', 'Blend'],
    answer: 1,
    explanation:
      '해석: "믹싱 글라스에 얼음과 재료를 넣고 바 스푼으로 섞은 뒤 차갑게 한 잔에 걸러 따른다." → 스터(Stir, 휘젓기). Shake 는 셰이커로 흔들기, Build 는 서브할 잔에 직접 붓기, Blend 는 전기 블렌더로 갈기다.',
  }),
  q(2, 7, {
    type: 'english',
    difficulty: 3,
    stem: '다음 설명에 해당하는 조주 기법은?',
    passage: 'Pour the liquid gently over the back of a bar spoon so that it rests on top of the drink without mixing.',
    choices: ['Muddle', 'Shake', 'Frost', 'Float'],
    answer: 3,
    explanation:
      '해석: "바 스푼 뒷면을 타고 액체를 천천히 부어 섞이지 않고 음료 위에 머물게 한다." → 플로트(Float, 띄우기·층 쌓기). rests on top of 가 핵심어. Muddle 은 으깨기, Frost 는 잔 테두리에 소금·설탕 묻히기다.',
  }),
  q(2, 8, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 기구는?',
    passage: 'This tool is used to crush fruit, herbs or sugar in the bottom of a glass.',
    choices: ['Squeezer', 'Ice pick', 'Muddler', 'Corkscrew'],
    answer: 2,
    explanation:
      '해석: "잔 바닥에서 과일·허브·설탕을 으깨는 데 쓰는 도구." → 머들러. crush(으깨다)가 핵심어. 스퀴저는 레몬·라임 즙을 짜고, 아이스 픽은 얼음을 깨고, 코르크스크루는 코르크 마개를 딴다.',
  }),
  q(2, 9, {
    type: 'compare',
    difficulty: 3,
    stem: '다음 영어 용량 표현 중 양이 가장 적은 것은?',
    choices: ['Dash', 'Pony', 'Jigger', 'Double'],
    answer: 0,
    explanation:
      'Dash 는 비터 등을 몇 방울 떨어뜨리는 아주 적은 양(약 1/32 oz)이다. Pony = 1 oz(약 30 ml), Jigger = 1.5 oz(약 45 ml), Double = 두 배 분량. 크기 순서는 dash < pony < jigger < double.',
  }),
  q(2, 10, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화에서 "corkage charge" 의 뜻으로 옳은 것은?',
    passage: 'G: We brought our own bottle of wine. Is that OK?\nB: Sure, but there is a corkage charge of 20,000 won.',
    choices: ['와인을 보관해 주는 요금', '병째 주문할 때의 할인 요금', '가져온 술을 따 주고 받는 요금', '남은 와인을 포장해 주는 요금'],
    answer: 2,
    explanation:
      '해석: G "와인을 직접 가져왔는데 괜찮나요?" B "네, 다만 코키지 요금 2만 원이 있습니다." corkage(charge) = 손님이 가져온 술의 마개를 따 주고 잔 등을 제공하며 받는 요금이다.',
  }),

  // ── t3 알코올성 음료 외국어 표현 ──
  q(3, 1, {
    type: 'english',
    difficulty: 1,
    stem: '다음 설명에 해당하는 술은?',
    passage: 'This spirit is distilled from fermented sugarcane juice or molasses. It is mainly produced in the Caribbean.',
    choices: ['Gin', 'Rum', 'Vodka', 'Tequila'],
    answer: 1,
    explanation:
      '해석: "발효한 사탕수수즙이나 당밀(molasses)을 증류한 술로, 주로 카리브해 지역에서 생산된다." → 럼. 진은 노간주 열매(juniper) 향, 보드카는 곡물·감자를 숯으로 여과, 데킬라는 블루 아가베가 원료다.',
  }),
  q(3, 2, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 술은?',
    passage: 'This colorless spirit is made from a neutral spirit and flavored mainly with juniper berries.',
    choices: ['Gin', 'Vodka', 'Rum', 'Brandy'],
    answer: 0,
    explanation:
      '해석: "중성 주정으로 만들고 주로 노간주 열매(juniper berries)로 향을 낸 무색의 증류주." → 진. 보드카도 무색이지만 juniper 향을 내지 않고 숯 여과로 무색·무취에 가깝다. 럼은 사탕수수, 브랜디는 와인(포도)을 증류한다.',
  }),
  q(3, 3, {
    type: 'english',
    difficulty: 1,
    stem: '다음 설명에 해당하는 술은?',
    passage: 'This spirit is made from the blue agave plant, mainly in the state of Jalisco, Mexico.',
    choices: ['Rum', 'Whisky', 'Vodka', 'Tequila'],
    answer: 3,
    explanation:
      '해석: "주로 멕시코 할리스코 주에서 블루 아가베로 만드는 증류주." → 데킬라. agave·Mexico 가 핵심어. 럼은 사탕수수·당밀, 위스키는 곡물, 보드카는 곡물·감자가 원료다.',
  }),
  q(3, 4, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 위스키는?',
    passage: 'This American whiskey is made from a grain mixture of at least 51% corn and is aged in new charred oak barrels.',
    choices: ['Scotch whisky', 'Bourbon whiskey', 'Irish whiskey', 'Canadian whisky'],
    answer: 1,
    explanation:
      '해석: "옥수수를 51% 이상 쓴 곡물로 만들고, 안쪽을 그을린 새 오크통에서 숙성하는 미국 위스키." → 버번 위스키. 스카치 위스키는 스코틀랜드에서 맥아(malted barley)와 피트를 써서 만들며, American 이라는 단서와 맞지 않는다.',
  }),
  q(3, 5, {
    type: 'english',
    difficulty: 3,
    stem: '다음 설명에 해당하는 술은?',
    passage: 'This brandy is distilled from wine made from grapes grown in a specific region of France, and it is aged in oak casks.',
    choices: ['Cognac', 'Calvados', 'Kirsch', 'Grappa'],
    answer: 0,
    explanation:
      '해석: "프랑스 특정 지역에서 재배한 포도로 만든 와인을 증류하고 오크통에서 숙성한 브랜디." → 코냑. 칼바도스는 사과 브랜디(노르망디), 키르슈는 체리 브랜디, 그라파는 포도 찌꺼기(pomace)로 만드는 이탈리아 브랜디라 "wine 을 증류" 와 "France" 를 함께 만족하지 않는다.',
  }),
  q(3, 6, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 리큐르는?',
    passage: 'This is a coffee-flavored liqueur that comes from Mexico.',
    choices: ['Cointreau', 'Drambuie', 'Kahlua', 'Campari'],
    answer: 2,
    explanation:
      '해석: "멕시코산 커피 향 리큐르." → 칼루아. 쿠앵트로는 프랑스 오렌지 리큐르, 드람뷰이는 스카치 위스키 + 꿀 + 허브, 캄파리는 이탈리아의 쓴맛 나는 붉은 식전주다.',
  }),
  q(3, 7, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 리큐르는?',
    passage: 'This liqueur is made from Scotch whisky, heather honey and herbs.',
    choices: ['Amaretto', 'Baileys', 'Crème de menthe', 'Drambuie'],
    answer: 3,
    explanation:
      '해석: "스카치 위스키, 헤더 꿀, 허브로 만든 리큐르." → 드람뷰이. 아마레토는 아몬드 향 이탈리아 리큐르, 베일리스는 아이리시 위스키 + 크림, 크렘 드 망트는 박하(mint) 리큐르다.',
  }),
  q(3, 8, {
    type: 'compare',
    difficulty: 3,
    stem: '주류 분류의 영어 표현과 뜻의 연결이 옳지 않은 것은?',
    choices: ['Fermented liquor – 양조주', 'Distilled liquor – 증류주', 'Liqueur – 혼성주', 'Aperitif – 식후주'],
    answer: 3,
    explanation:
      'Aperitif 는 식욕을 돋우려고 식사 전에 마시는 식전주다. 식후주는 Digestif(after-dinner drink)다. 양조주(fermented)·증류주(distilled)·혼성주(liqueur, compounded liquor) 연결은 옳다.',
  }),
  q(3, 9, {
    type: 'english',
    difficulty: 1,
    stem: '다음 대화의 빈칸에 들어갈 말로 가장 알맞은 것은?',
    passage: "G: I'd like a bourbon, please.\nB: ______\nG: On the rocks, please.",
    choices: ['How would you like it?', 'Still or sparkling?', 'Regular or decaf?', 'Red or white?'],
    answer: 0,
    explanation:
      '해석: G "버번 주세요." B "어떻게 드릴까요?" G "온더록으로요." 위스키 주문을 받으면 마시는 방식(straight / on the rocks)을 묻는다. Still or sparkling 은 물, Regular or decaf 는 커피, Red or white 는 와인을 주문할 때 묻는 말이다.',
  }),
  q(3, 10, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화에서 "vintage" 의 뜻으로 옳은 것은?',
    passage: "G: What vintage is this wine?\nB: It's a 2018.",
    choices: ['와인을 만든 포도 품종', '와인을 숙성한 통의 종류', '포도를 수확한 해', '와인을 병에 넣은 장소'],
    answer: 2,
    explanation:
      '해석: G "이 와인은 몇 년산인가요?" B "2018년산입니다." vintage = 와인을 만든 포도를 수확한 해로, 라벨의 연도로 표시된다. 연도로 답한 것도 단서다.',
  }),
  q(3, 11, {
    type: 'english',
    difficulty: 2,
    stem: '다음 고객이 원하는 와인으로 옳은 것은?',
    passage: "G: I'd like a glass of white wine. Something dry, please.",
    choices: ['단맛이 강한 와인', '단맛이 거의 없는 와인', '탄산이 있는 와인', '오래 숙성한 와인'],
    answer: 1,
    explanation:
      '해석: "화이트 와인 한 잔 주세요. 드라이한 걸로요." 와인에서 dry 는 "마른" 이 아니라 단맛이 거의 없다는 뜻이고, 반대는 sweet 다. 탄산이 있는 와인은 sparkling wine 이다.',
  }),
  q(3, 12, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 칵테일은?',
    passage: 'This cocktail is made with tequila, triple sec and lime juice, and it is served in a glass with a salt-rimmed edge.',
    choices: ['Martini', 'Manhattan', 'Bloody Mary', 'Margarita'],
    answer: 3,
    explanation:
      '해석: "데킬라, 트리플 섹, 라임 주스로 만들고 테두리에 소금을 묻힌 잔에 낸다." → 마가리타. 마티니는 진 + 드라이 베르무트(올리브), 맨해튼은 위스키 + 스위트 베르무트 + 비터(체리), 블러디 메리는 보드카 + 토마토 주스다.',
  }),
  q(3, 13, {
    type: 'english',
    difficulty: 3,
    stem: '다음 설명에 해당하는 칵테일은?',
    passage: 'This cocktail is made by stirring gin and dry vermouth, and it is usually garnished with an olive.',
    choices: ['Martini', 'Manhattan', 'Screwdriver', 'Cuba Libre'],
    answer: 0,
    explanation:
      '해석: "진과 드라이 베르무트를 스터해 만들고 보통 올리브로 장식한다." → 마티니. 맨해튼도 베르무트를 쓰지만 위스키 + 스위트 베르무트 + 앙고스투라 비터에 체리로 장식한다. 스크루드라이버는 보드카 + 오렌지 주스, 쿠바 리브레는 럼 + 라임 주스 + 콜라.',
  }),
  q(3, 14, {
    type: 'english',
    difficulty: 3,
    stem: '다음 영문 설명에 해당하는 맥주의 발효 방식은?',
    passage: 'Lager is a type of beer that is fermented at low temperatures with yeast that sinks to the bottom of the tank.',
    choices: ['상면발효', '하면발효', '자연발효', '증류'],
    answer: 1,
    explanation:
      '해석: "라거는 낮은 온도에서, 탱크 바닥으로 가라앉는 효모로 발효한 맥주다." → 하면발효. 효모가 위로 떠오르며(top) 비교적 높은 온도에서 발효하는 것은 에일(Ale)의 상면발효다. 맥주는 양조주라 증류하지 않는다.',
  }),

  // ── t4 비알코올성 음료 외국어 표현 ──
  q(4, 1, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 음료는?',
    passage: 'This is carbonated water flavored with quinine. It is often mixed with gin.',
    choices: ['Ginger ale', 'Club soda', 'Tonic water', 'Lemonade'],
    answer: 2,
    explanation:
      '해석: "키니네(quinine)로 향을 낸 탄산수로, 진과 자주 섞는다." → 토닉 워터(진 토닉). 진저 에일은 생강 향 탄산음료, 클럽 소다는 향이 없는 탄산수, 레모네이드는 레몬즙 + 설탕 + 물이다.',
  }),
  q(4, 2, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 커피는?',
    passage: 'This coffee is made with espresso and steamed milk, and it is topped with a thick layer of milk foam.',
    choices: ['Americano', 'Cappuccino', 'Cafe mocha', 'Espresso'],
    answer: 1,
    explanation:
      '해석: "에스프레소와 스팀 밀크로 만들고 위에 두꺼운 우유 거품층을 올린 커피." → 카푸치노. 아메리카노는 에스프레소 + 뜨거운 물, 카페 모카는 초콜릿이 들어가며, 에스프레소는 우유 없이 진하게 추출한 커피다.',
  }),
  q(4, 3, {
    type: 'english',
    difficulty: 1,
    stem: '다음 대화에서 바텐더가 묻는 것은?',
    passage: 'G: Can I have a bottle of mineral water?\nB: Still or sparkling?',
    choices: ['탄산 없는 물과 탄산수 중 어느 것', '차가운 물과 따뜻한 물 중 어느 것', '작은 병과 큰 병 중 어느 것', '얼음을 넣을지 말지'],
    answer: 0,
    explanation:
      '해석: G "미네랄 워터 한 병 주시겠어요?" B "일반 물로 드릴까요, 탄산수로 드릴까요?" still water = 탄산 없는 물, sparkling water = 탄산수. still 을 "여전히", sparkling 을 "반짝이는" 으로 직역하지 않도록 주의.',
  }),
  q(4, 4, {
    type: 'english',
    difficulty: 2,
    stem: '다음 대화에서 "decaf" 의 뜻으로 옳은 것은?',
    passage: 'G: A cup of coffee, please.\nB: Regular or decaf?',
    choices: ['우유를 넣은 커피', '설탕을 넣지 않은 커피', '얼음을 넣은 커피', '카페인을 제거한 커피'],
    answer: 3,
    explanation:
      '해석: G "커피 한 잔 주세요." B "일반 커피로 드릴까요, 디카페인으로 드릴까요?" decaf = decaffeinated(카페인을 제거한). regular 는 카페인이 있는 보통 커피다. 설탕·우유 여부는 "How would you like your coffee?" 로 묻는다.',
  }),
  q(4, 5, {
    type: 'compare',
    difficulty: 3,
    stem: '차의 영어 명칭과 설명의 연결이 옳지 않은 것은?',
    choices: ['Green tea – 불발효차', 'Black tea – 완전발효차', 'Oolong tea – 완전발효차', 'Herbal tea – 허브의 꽃·잎·뿌리를 우린 차'],
    answer: 2,
    explanation:
      '우롱차(Oolong tea)는 반발효차(semi-fermented)다. 녹차는 불발효차, 홍차(Black tea)는 완전발효차로 발효 정도는 녹차 < 우롱차 < 홍차 순이다. Black tea 를 "검은 차" 가 아니라 홍차로 기억할 것.',
  }),
  q(4, 6, {
    type: 'english',
    difficulty: 1,
    stem: '다음 설명에 해당하는 영어 용어는?',
    passage: 'This is a mixed drink that looks like a cocktail but contains no alcohol.',
    choices: ['Mocktail', 'Nightcap', 'Highball', 'Chaser'],
    answer: 0,
    explanation:
      '해석: "칵테일처럼 보이지만 알코올이 없는 혼합 음료." → 목테일(mock + cocktail, virgin cocktail). 나이트캡은 자기 전에 마시는 술, 하이볼은 증류주 + 탄산음료, 체이서는 독한 술 뒤에 마시는 음료다.',
  }),
  q(4, 7, {
    type: 'english',
    difficulty: 2,
    stem: '다음 설명에 해당하는 무알코올 음료는?',
    passage: 'This non-alcoholic drink is a Bloody Mary made without vodka.',
    choices: ['Shirley Temple', 'Screwdriver', 'Cuba Libre', 'Virgin Mary'],
    answer: 3,
    explanation:
      '해석: "보드카를 빼고 만든 블러디 메리인 무알코올 음료." → 버진 메리. virgin = 술을 뺀. 셜리 템플은 진저 에일 + 그레나딘의 목테일이지만 블러디 메리와 관계없고, 스크루드라이버(보드카)·쿠바 리브레(럼)는 술이 들어간다.',
  }),
  q(4, 8, {
    type: 'english',
    difficulty: 1,
    stem: '바텐더가 다음과 같이 말했을 때의 뜻으로 옳은 것은?',
    passage: 'B: Would you like a refill on your coffee?',
    choices: ['커피를 다른 종류로 바꿔 드릴까요?', '커피를 포장해 드릴까요?', '커피를 더 채워 드릴까요?', '커피에 설탕을 넣어 드릴까요?'],
    answer: 2,
    explanation:
      '해석: "커피를 더 채워 드릴까요?" refill = 다시(re) 채우다(fill). 같은 음료를 빈 잔에 다시 따라 주는 것이다. 포장은 to go / take out, 설탕 여부는 "How would you like your coffee?" 로 묻는다.',
  }),
]

export default questions
