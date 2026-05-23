import { atom } from 'jotai';

export type TabType = 'damage' | 'party';

// 현재 활성화된 탭
export const activeTabAtom = atom<TabType>('damage');

// 데미지 계산과 파티 구성 탭 간 상태를 공유할 임시 상태
// 추후 실제 데이터 구조에 맞게 변경
export const sharedDataAtom = atom<{
  attacker?: string;
  defender?: string;
  party: string[];
}>({
  party: [],
});
