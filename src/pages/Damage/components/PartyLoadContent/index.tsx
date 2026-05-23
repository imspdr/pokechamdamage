import { FC } from 'react';
import { Button, Typography } from '@imspdr/ui';
import { atom, useAtom } from 'jotai';
import { useParties } from '@/hooks/useParties';
import { PokemonConfig } from '@/types/pokemon';
import pokemonData from '@/data/pokemon.json';
import PokemonSlotCard from '@/components/PokemonSlotCard';

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {parties.map(p => (
          <Button key={p.id} variant="outline" onClick={() => setSelectedPartyId(p.id)} style={{ justifyContent: 'space-between', padding: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>{p.name}</span>
            <span style={{ fontSize: '12px', color: 'var(--imspdr-foreground-3)' }}>
              포켓몬 {p.members.filter(m => m.id).length} / 6
            </span>
          </Button>
        ))}
      </div>
    );
  }

  const party = parties.find(p => p.id === selectedPartyId);
  if (!party) return null;

  if (selectedSlotIndex === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {party.members.map((m, idx) => (
            <div 
              key={idx}
              onClick={() => m.id && setSelectedSlotIndex(idx)}
              style={{
                aspectRatio: '1',
                border: '1px solid var(--imspdr-background-3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: m.id ? 'pointer' : 'default',
                opacity: m.id ? 1 : 0.3,
                backgroundColor: 'var(--imspdr-background-2)'
              }}
            >
              <PokemonSlotCard member={m} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const member = party.members[selectedSlotIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <Typography variant="title" level={3} bold>{getPokemonName(member.id)}</Typography>
      <Typography variant="body" level={2} color="foreground.2" style={{ textAlign: 'center' }}>
        이 포켓몬을 데미지 계산기의<br />어느 쪽에 불러올까요?
      </Typography>
    </div>
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
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <Button variant="outline" onClick={() => setSelectedSlotIndex(null)} style={{ flex: 1 }}>
            이전
          </Button>
          <Button variant="solid" style={{ flex: 1, backgroundColor: 'var(--imspdr-danger-1)' }} onClick={() => onSelect(member, 'attacker')}>
            공격 측으로
          </Button>
          <Button variant="solid" style={{ flex: 1, backgroundColor: 'var(--imspdr-info-1)' }} onClick={() => onSelect(member, 'defender')}>
            방어 측으로
          </Button>
        </div>
      );
    }
  }

  if (selectedPartyId !== null) {
    return (
      <Button variant="ghost" onClick={() => setSelectedPartyId(null)} style={{ width: '100%', color: 'var(--imspdr-foreground-2)' }}>
        이전 (파티 목록)
      </Button>
    );
  }

  return (
    <Button variant="ghost" onClick={onCancel} style={{ width: '100%', color: 'var(--imspdr-foreground-2)' }}>
      취소
    </Button>
  );
};
