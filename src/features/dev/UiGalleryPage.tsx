import { useState, type ReactNode } from 'react'
import { ICON_BITMAPS, type IconName } from '../../ui/icons'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ChipGroup,
  Disclosure,
  EmptyState,
  Icon,
  inputClass,
  Modal,
  PageHeader,
  PageLoading,
  ProgressBar,
  SearchInput,
  Select,
  StatTile,
  Tabs,
  type Tone,
} from '../../ui'

const ICONS = Object.keys(ICON_BITMAPS) as IconName[]
const TONES: Tone[] = ['paper', 'peach', 'mint', 'lavender', 'butter', 'sky', 'good', 'bad']

const SORT = [
  { value: 'name', label: '이름순' },
  { value: 'glass', label: '잔 종류' },
  { value: 'method', label: '기법순' },
]
const BASES = ['진', '보드카', '럼', '테킬라', '위스키', '브랜디', '리큐르', '와인', '맥주', '전통주', '논알코올']
const LONG = Array.from({ length: 40 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}번 · ${['마티니', '네그로니', '모히토', '다이키리', '사이드카'][i % 5]}`,
}))

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-pixel text-lg">{title}</h2>
      {children}
    </section>
  )
}
const Row = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>

/** 개발용: 공용 UI 의 모든 상태를 한 화면에 */
export default function UiGalleryPage() {
  const [sort, setSort] = useState('name')
  const [base, setBase] = useState('진')
  const [long, setLong] = useState('12')
  const [mode, setMode] = useState('practice')
  const [q, setQ] = useState('마티니')
  const [q2, setQ2] = useState('')
  const [c1, setC1] = useState(true)
  const [c2, setC2] = useState(false)
  const [tab, setTab] = useState('a')
  const [modal, setModal] = useState(false)
  const [bottom, setBottom] = useState('2')

  return (
    <div>
      <PageHeader
        title="UI 갤러리"
        subtitle="개발 확인용 — 공용 컴포넌트의 모든 상태"
        back={{ to: '/', label: '홈으로' }}
        actions={<Button size="sm">동작</Button>}
      />

      <Section title={`아이콘 (${ICONS.length})`}>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {ICONS.map((n) => (
            <li key={n} className="flex flex-col items-center gap-2 rounded-pixel border-2 border-ink bg-paper px-2 py-3 shadow-pixel-sm">
              <span className="flex items-end gap-2">
                <Icon name={n} size={12} />
                <Icon name={n} />
                <Icon name={n} size={24} />
              </span>
              <span className="font-pixel text-xs whitespace-nowrap">{n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-pixel bg-bar-night p-3 text-bar-glow">
          {ICONS.map((n) => (
            <Icon key={n} name={n} />
          ))}
        </div>
      </Section>

      <Section title="툴바 정렬 (Button sm · Select · SearchInput · ChipGroup)">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={q} onChange={setQ} label="레시피 검색" placeholder="이름·재료로 찾기" className="w-full sm:w-56" />
          <Select label="정렬" value={sort} onChange={setSort} options={SORT} />
          <Select label="베이스" hideLabel value={base} onChange={setBase} options={BASES.map((b) => ({ value: b, label: b }))} />
          <Button size="sm" variant="secondary">
            <Icon name="refresh" />
            초기화
          </Button>
          <Button size="sm">
            <Icon name="play" />
            시작
          </Button>
        </div>
      </Section>

      <Section title="Select">
        <Row>
          <Select label="긴 목록" value={long} onChange={setLong} options={LONG} />
          <Select label="비활성" value="name" onChange={() => {}} options={SORT} disabled />
          <Select label="선택 없음" value="" onChange={() => {}} options={SORT} />
        </Row>
        <div className="mt-3 h-24 overflow-hidden rounded-pixel border-2 border-dashed border-ink-faint p-3">
          <p className="mb-2 text-xs text-ink-soft">부모 overflow: hidden · 높이 96px</p>
          <Select label="잘림 확인" value={base} onChange={setBase} options={BASES.map((b) => ({ value: b, label: b }))} />
        </div>
      </Section>

      <Section title="ChipGroup">
        <div className="flex flex-col gap-3">
          <ChipGroup
            label="모드"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'practice', label: '연습' },
              { value: 'challenge', label: '도전' },
              { value: 'exam', label: '시험' },
            ]}
          />
          <ChipGroup label="정렬" hideLabel value={sort} onChange={setSort} options={SORT} />
        </div>
      </Section>

      <Section title="Checkbox · TextField · SearchInput">
        <Row>
          <Checkbox checked={c1} onChange={setC1}>
            해설 바로 보기
          </Checkbox>
          <Checkbox checked={c2} onChange={setC2}>
            틀린 문제만
          </Checkbox>
          <Checkbox checked onChange={() => {}} disabled>
            비활성(켜짐)
          </Checkbox>
          <Checkbox checked={false} onChange={() => {}} disabled>
            비활성(꺼짐)
          </Checkbox>
        </Row>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input className={inputClass} placeholder="inputClass" aria-label="예시 입력" />
          <input className={inputClass} value="비활성 입력" disabled aria-label="비활성 입력" readOnly />
          <SearchInput value={q2} onChange={setQ2} label="빈 검색" placeholder="검색어 없음" />
        </div>
        <textarea className={`${inputClass} mt-3 h-auto py-2`} rows={3} placeholder="textarea 는 inputClass + h-auto py-2" aria-label="메모" />
      </Section>

      <Section title="Disclosure">
        <div className="flex flex-col gap-3">
          <Disclosure summary="닫힌 상태 — 눌러서 펼치기">
            <p className="text-sm">펼친 내용. 기본 삼각형 대신 chevron-right 가 90° 돌아간다.</p>
          </Disclosure>
          <Disclosure summary="처음부터 펼침" defaultOpen>
            <p className="text-sm">
              본문 링크는 <a className="text-link" href="#/dev/ui">text-link 클래스</a>로 쓴다.
            </p>
          </Disclosure>
        </div>
      </Section>

      <Section title="Button">
        <Row>
          <Button>기본</Button>
          <Button variant="secondary">보조</Button>
          <Button variant="ghost">고스트</Button>
          <Button disabled>비활성</Button>
          <Button size="sm">작게</Button>
          <Button size="sm" variant="secondary">
            <Icon name="download" />
            내보내기
          </Button>
          <Button size="sm" variant="ghost">
            <Icon name="trash" />
            지우기
          </Button>
          <Button size="sm" variant="secondary" disabled>
            비활성
          </Button>
        </Row>
      </Section>

      <Section title="Card · Badge">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="font-pixel">정적 카드</p>
            <p className="text-sm text-ink-soft">interactive 없음</p>
          </Card>
          <Card to="/dev/ui" tone="mint">
            <p className="font-pixel">링크 카드 (to)</p>
            <p className="text-sm text-ink-soft">hover 들림 · 눌림 · 포커스 링</p>
          </Card>
          <Card interactive tone="lavender" className="relative">
            <button type="button" className="font-pixel after:absolute after:inset-0">
              interactive 카드
            </button>
            <p className="text-sm text-ink-soft">안의 버튼이 카드 전체를 덮음</p>
          </Card>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Badge key={t} tone={t}>
              {t}
            </Badge>
          ))}
          <Badge tone="good">
            <Icon name="check" size={12} />
            정답
          </Badge>
          <Badge tone="bad">
            <Icon name="x" size={12} />
            오답
          </Badge>
        </div>
      </Section>

      <Section title="Tabs · Modal">
        <Tabs
          label="예시 탭"
          value={tab}
          onChange={setTab}
          items={[
            { id: 'a', label: '얼음' },
            { id: 'b', label: '술·재료' },
            { id: 'c', label: '가니쉬' },
          ]}
        />
        <div id={`tabpanel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="py-4 text-sm">
          선택된 탭: {tab}
        </div>
        <Button variant="secondary" onClick={() => setModal(true)}>
          모달 열기
        </Button>
        <Modal open={modal} onClose={() => setModal(false)} title="모달 안의 Select">
          <p className="mb-3 text-sm">Esc 는 열린 Select 만 닫고, 한 번 더 누르면 모달이 닫힌다.</p>
          <Select label="베이스" value={base} onChange={setBase} options={BASES.map((b) => ({ value: b, label: b }))} />
        </Modal>
      </Section>

      <Section title="ProgressBar · StatTile · EmptyState · PageLoading">
        <div className="grid gap-3 sm:grid-cols-2">
          <ProgressBar value={7} max={20} label="진도" showValue />
          <ProgressBar value={20} max={20} label="완료" tone="good" showValue />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="정답률" value="82%" hint="최근 50문항" />
          <StatTile label="푼 문제" value={240} tone="sky" />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <EmptyState title="아직 기록이 없어요" description="문제를 풀면 여기에 쌓입니다." action={<Button size="sm">문제 풀기</Button>} />
          <PageLoading />
        </div>
      </Section>

      <Section title="화면 아래쪽 Select (위로 열림)">
        <Select label="아래쪽" value={bottom} onChange={setBottom} options={LONG.slice(0, 8)} />
      </Section>
    </div>
  )
}
