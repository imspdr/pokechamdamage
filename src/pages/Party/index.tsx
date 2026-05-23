import { FC, useState } from 'react';
import { Button, Typography } from '@imspdr/ui';
import { useParties } from '@/hooks/useParties';
import PokemonConfigPanel from '@/components/PokemonConfigPanel';
import { Party } from '@/types/party';
import { PokemonConfig } from '@/types/pokemon';
import pokemonData from '@/data/pokemon.json';
import { PageContainer, PartyCard, SlotsRow, SlotItem, ConfigWrapper, ListHeader, EmptyMessage, EditHeader, PartyNameInput } from './styled';
import PokemonSlotCard from '@/components/PokemonSlotCard';

const PartyPage: FC = () => {
  const { parties, createParty, updateParty, deleteParty } = useParties();
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);

  const activeParty = parties.find(p => p.id === editingPartyId);

  const handleCreate = () => {
    const id = createParty();
    setEditingPartyId(id);
    setActiveSlotIndex(0);
  };

  const handleMemberChange = (index: number, newConfig: PokemonConfig) => {
    if (!activeParty) return;
    const newMembers = [...activeParty.members];
    newMembers[index] = newConfig;
    updateParty(activeParty.id, { ...activeParty, members: newMembers });
  };

  const getPokemonImage = (id: string | null) => {
    if (!id) return null;
    const p = (pokemonData as any[]).find(poke => poke.id === id);
    if (!p) return null;
    // We can use a generic pokeball placeholder if we don't have images
    return null;
  };

  const getPokemonName = (id: string | null) => {
    if (!id) return '선택 안됨';
    const p = (pokemonData as any[]).find(poke => poke.id === id);
    return p ? p.koreanName : '알 수 없음';
  };

  if (!editingPartyId || !activeParty) {
    return (
      <PageContainer>
        <ListHeader>
          <Typography variant="title" level={6} bold>내 파티 목록</Typography>
          <Button variant="solid" onClick={handleCreate}>새 파티 만들기</Button>
        </ListHeader>

        {parties.length === 0 ? (
          <EmptyMessage variant="body" level={1} color="foreground.3">
            저장된 파티가 없습니다.<br />새 파티를 만들어보세요!
          </EmptyMessage>
        ) : (
          parties.map(party => (
            <PartyCard key={party.id} onClick={() => { setEditingPartyId(party.id); setActiveSlotIndex(0); }}>
              <div>
                <Typography variant="body" level={1} bold>{party.name}</Typography>
                <Typography variant="caption" level={1} color="foreground.3">
                  포켓몬: {party.members.filter(m => m.id).length} / 6
                </Typography>
              </div>
              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); deleteParty(party.id); }} style={{ color: 'var(--imspdr-danger-1)' }}>
                삭제
              </Button>
            </PartyCard>
          ))
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <EditHeader>
        <Button variant="outline" onClick={() => setEditingPartyId(null)}>목록으로</Button>
        <PartyNameInput
          value={activeParty.name}
          onChange={(e) => updateParty(activeParty.id, { ...activeParty, name: e.target.value })}
        />
      </EditHeader>

      <SlotsRow>
        {activeParty.members.map((member, idx) => (
          <SlotItem
            key={idx}
            active={activeSlotIndex === idx}
            empty={!member.id}
            onClick={() => setActiveSlotIndex(idx)}
          >
            <PokemonSlotCard member={member} />
          </SlotItem>
        ))}
      </SlotsRow>

      <ConfigWrapper>
        <PokemonConfigPanel
          title={`${activeSlotIndex + 1}번 슬롯 포켓몬`}
          config={activeParty.members[activeSlotIndex]}
          onChange={(newConfig) => handleMemberChange(activeSlotIndex, newConfig)}
        />
      </ConfigWrapper>
    </PageContainer>
  );
};

export default PartyPage;
