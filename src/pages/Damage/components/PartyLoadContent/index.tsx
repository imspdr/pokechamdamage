import { FC } from 'react';
import { Button, Typography } from '@imspdr/ui';
import { atom, useAtom } from 'jotai';
import { useParties } from '@/hooks/useParties';
import { PokemonConfig } from '@/types/pokemon';
import pokemonData from '@/data/pokemon.json';
import PokemonSlotCard from '@/components/PokemonSlotCard';
import {
  ListContainer,
  PartyListButton,
  PartyName,
  PartyMemberCount,
  GridContainer,
  SlotsGrid,
  SlotWrapper,
  CenterContainer,
  RoleSelectText,
  FooterContainer,
  AttackerButton,
  DefenderButton,
  FooterFullButton
} from './styled';

export const selectedPartyIdAtom = atom<string | null>(null);
export const selectedSlotIndexAtom = atom<number | null>(null);

interface Props {
  onSelect: (config: PokemonConfig, role: 'attacker' | 'defender') => void;
}

export const PartyLoadContent: FC<Props> = ({ onSelect }) => {
  const { parties } = useParties();
  const [selectedPartyId, setSelectedPartyId] = useAtom(selectedPartyIdAtom);
  const [selectedSlotIndex, setSelectedSlotIndex] = useAtom(selectedSlotIndexAtom);

  const getPokemonName = (id: string | null) => {
    if (!id) return '선택 안됨';
    const p = (pokemonData as any[]).find(poke => poke.id === id);
    return p ? p.koreanName : '알 수 없음';
  };

  if (!selectedPartyId) {
    return (
      <ListContainer>
        {parties.map(p => (
          <PartyListButton key={p.id} variant="outline" onClick={() => setSelectedPartyId(p.id)}>
            <PartyName>{p.name}</PartyName>
            <PartyMemberCount>
              포켓몬 {p.members.filter(m => m.id).length} / 6
            </PartyMemberCount>
          </PartyListButton>
        ))}
      </ListContainer>
    );
  }

  const party = parties.find(p => p.id === selectedPartyId);
  if (!party) return null;

  if (selectedSlotIndex === null) {
    return (
      <GridContainer>
        <SlotsGrid>
          {party.members.map((m, idx) => (
            <SlotWrapper 
              key={idx}
              onClick={() => m.id && setSelectedSlotIndex(idx)}
              disabled={!m.id}
            >
              <PokemonSlotCard member={m} />
            </SlotWrapper>
          ))}
        </SlotsGrid>
      </GridContainer>
    );
  }

  const member = party.members[selectedSlotIndex];

  return (
    <CenterContainer>
      <Typography variant="title" level={3} bold>{getPokemonName(member.id)}</Typography>
      <Typography variant="body" level={2} color="foreground.2">
        <RoleSelectText>
          이 포켓몬을 데미지 계산기의<br />어느 쪽에 불러올까요?
        </RoleSelectText>
      </Typography>
    </CenterContainer>
  );
};

export const PartyLoadFooter: FC<{ onCancel: () => void, onSelect: (config: PokemonConfig, role: 'attacker' | 'defender') => void }> = ({ onCancel, onSelect }) => {
  const { parties } = useParties();
  const [selectedPartyId, setSelectedPartyId] = useAtom(selectedPartyIdAtom);
  const [selectedSlotIndex, setSelectedSlotIndex] = useAtom(selectedSlotIndexAtom);

  if (selectedSlotIndex !== null && selectedPartyId !== null) {
    const party = parties.find(p => p.id === selectedPartyId);
    const member = party?.members[selectedSlotIndex];

    if (member) {
      return (
        <FooterContainer>
          <Button variant="outline" onClick={() => setSelectedSlotIndex(null)} style={{ flex: 1 }}>
            이전
          </Button>
          <AttackerButton variant="solid" onClick={() => onSelect(member, 'attacker')}>
            공격 측으로
          </AttackerButton>
          <DefenderButton variant="solid" onClick={() => onSelect(member, 'defender')}>
            방어 측으로
          </DefenderButton>
        </FooterContainer>
      );
    }
  }

  if (selectedPartyId !== null) {
    return (
      <FooterFullButton variant="ghost" onClick={() => setSelectedPartyId(null)}>
        이전 (파티 목록)
      </FooterFullButton>
    );
  }

  return (
    <FooterFullButton variant="ghost" onClick={onCancel}>
      취소
    </FooterFullButton>
  );
};
