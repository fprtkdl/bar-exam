import type { ExamMeta } from '../../types/written'

export const examMeta: ExamMeta = {
  questionCount: 60,
  minutes: 60,
  passScore: 60,
  standardPeriod:
    '2022.1.1~2024.12.31 (원문 확인). 2025년 이후 적용본 원문은 미확보 — Q-net 종목 페이지(2026-11-12 조회)의 시험과목·형식은 동일',
  sources: [
    'https://www.q-net.or.kr/crf005.do?id=crf00503s01&gSite=Q&gId=&jmCd=7916 (한국산업인력공단 Q-net 조주기능사 종목 상세, 2026-11-12 조회)',
    'https://www.msu.ac.kr/foodstartup/board/read?boardManagementNo=1582&boardNo=603&menuLevel=2&menuNo=790 (출제기준 HWP 2022.1.1~2024.12.31 게시)',
  ],
}
