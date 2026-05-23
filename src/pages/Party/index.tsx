import { FC, useState } from 'react';
import { Button, Typography } from '@imspdr/ui';
import { useParties } from '../../hooks/useParties';
import PokemonConfigPanel from '../../components/PokemonConfigPanel';
import { Party } from '../../types/party';
import { PokemonConfig } from '../../types/pokemon';
import pokemonData from '../../data/pokemon.json';
import { PageContainer, PartyCard, SlotsRow, SlotItem, ConfigWrapper } from './styled';
import { StatName } from '../../util';
import { getTypeInfo } from '../../typeMap';

const STAT_SHORT_MAP: Record<StatName, string> = {
  hp: 'H', attack: 'A', defense: 'B', spAttack: 'C', spDefense: 'D', speed: 'S'
};

const getEvSummary = (evs: Record<StatName, number>) => {
  const parts: string[] = [];
  Object.entries(evs).forEach(([key, val]) => {
    if (val > 0) parts.push(`${STAT_SHORT_MAP[key as StatName]}${val}`);
  });
  return parts.length > 0 ? parts.join(' ') : '무보정';
};

const getNatureSummary = (nature: Record<StatName, number>) => {
  let up = '';
  let down = '';
  Object.entries(nature).forEach(([key, val]) => {
    if (val === 1.1) up = STAT_SHORT_MAP[key as StatName];
    if (val === 0.9) down = STAT_SHORT_MAP[key as StatName];
  });
  if (!up && !down) return '성격 무보정';
  return `+${up} -${down}`;
};

const getTypes = (id: string | null): string[] => {
  if (!id) return [];
  const p = (pokemonData as any[]).find(poke => poke.id === id);
  return p ? p.types : [];
};

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
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="title" level={6} bold>내 파티 목록</Typography>
          <Button variant="solid" onClick={handleCreate}>새 파티 만들기</Button>
        </div>

        {parties.length === 0 ? (
          <Typography 
            variant="body" 
            level={1} 
            color="foreground.3" 
            style={{ 
              marginTop: '40px', 
              textAlign: 'center', 
              wordBreak: 'keep-all', 
              whiteSpace: 'normal',
              width: '100%' 
            }}
          >
            저장된 파티가 없습니다.<br />새 파티를 만들어보세요!
          </Typography>
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
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button variant="outline" onClick={() => setEditingPartyId(null)} style={{ padding: '4px 8px' }}>←</Button>
        <input
          value={activeParty.name}
          onChange={(e) => updateParty(activeParty.id, { ...activeParty, name: e.target.value })}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--imspdr-background-3)',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--imspdr-foreground-1)',
            padding: '4px',
            minWidth: 0
          }}
        />
      </div>

      <SlotsRow>
        {activeParty.members.map((member, idx) => {
          const types = getTypes(member.id);
          return (
            <SlotItem
              key={idx}
              active={activeSlotIndex === idx}
              empty={!member.id}
              onClick={() => setActiveSlotIndex(idx)}
            >
              {!member.id ? (
                <>
                  <div style={{ fontSize: '24px', opacity: 0.2 }}>+</div>
                  <Typography variant="caption" level={1} color="foreground.3" style={{ marginTop: '4px', fontSize: '10px' }}>
                    비어있음
                  </Typography>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '4px', boxSizing: 'border-box', justifyContent: 'center' }}>
                  <Typography variant="body" level={3} bold style={{ textAlign: 'center', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getPokemonName(member.id)}
                  </Typography>
                  
                  <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '4px' }}>
                    {types.map(t => {
                      const tInfo = getTypeInfo(t);
                      return (
                        <div key={t} style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '4px', backgroundColor: tInfo.color, color: tInfo.textColor, whiteSpace: 'nowrap' }}>
                          {tInfo.ko}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <Typography variant="caption" level={1} style={{ fontSize: '10px', textAlign: 'center', color: 'var(--imspdr-primary-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {getEvSummary(member.evs)}
                    </Typography>
                    <Typography variant="caption" level={1} style={{ fontSize: '10px', textAlign: 'center', color: 'var(--imspdr-danger-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {getNatureSummary(member.nature)}
                    </Typography>
                  </div>
                </div>
              )}
            </SlotItem>
          );
        })}
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
