/** 도트 그림 교체용. 키 `${kind}/${id}` (예: 'glass/cocktail'), 값 = 이미지 URL. 값이 있으면 SVG 대신 <img>(pixelated) */
export type ArtKind = 'cocktail' | 'glass' | 'bottle' | 'tool' | 'garnish'

export const artOverrides: Record<string, string> = {}
