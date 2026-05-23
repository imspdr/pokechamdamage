import { FC, useState } from 'react';
import { useModal } from '@imspdr/ui';
import { PageContainer, PanelsRow, PanelContainer, CenterAction, LoadPartyButton, SwapButton } from './styled';
import PokemonConfigPanel from '@/components/PokemonConfigPanel';
import DamageCalculatorPanel from './components/DamageCalculatorPanel';
import { PartyLoadContent, PartyLoadFooter, selectedPartyIdAtom, selectedSlotIndexAtom } from './components/PartyLoadContent';
import { PokemonConfig, createDefaultConfig } from '@/types/pokemon';
import { useParties } from '@/hooks/useParties';
import { useSetAtom } from 'jotai';

const DamagePage: FC = () => {
  const [attackerConfig, setAttackerConfig] = useState<PokemonConfig>(createDefaultConfig());
  const [defenderConfig, setDefenderConfig] = useState<PokemonConfig>(createDefaultConfig());
  const { parties } = useParties();
  const { openModal, closeModal } = useModal();
  const setSelectedPartyId = useSetAtom(selectedPartyIdAtom);
  const setSelectedSlotIndex = useSetAtom(selectedSlotIndexAtom);

  const handleSwap = () => {
    const temp = attackerConfig;
    setAttackerConfig(defenderConfig);
    setDefenderConfig(temp);
  };

  const handleLoadFromPartyClick = () => {
    setSelectedPartyId(null);
    setSelectedSlotIndex(null);
    let modalId: string;
    
    const handleSelect = (config: PokemonConfig, role: 'attacker' | 'defender') => {
      if (role === 'attacker') setAttackerConfig(config);
      else setDefenderConfig(config);
      if (modalId) closeModal(modalId);
    };

    modalId = openModal(
      <PartyLoadContent onSelect={handleSelect} />,
      { 
        title: '파티에서 불러오기',
        footer: <PartyLoadFooter onCancel={() => closeModal(modalId)} onSelect={handleSelect} />
      }
    );
  };

  return (
    <PageContainer>
      {parties.length > 0 && (
        <LoadPartyButton variant="solid" onClick={handleLoadFromPartyClick}>
          내 파티에서 포켓몬 불러오기
        </LoadPartyButton>
      )}
      
      <PanelsRow>
        <PanelContainer>
          <PokemonConfigPanel 
            title="공격 포켓몬" 
            config={attackerConfig} 
            onChange={setAttackerConfig} 
          />
        </PanelContainer>

        <CenterAction>
          <SwapButton 
            variant="outline" 
            onClick={handleSwap}
          >
            ⇄
          </SwapButton>
        </CenterAction>

        <PanelContainer>
          <PokemonConfigPanel 
            title="방어 포켓몬" 
            config={defenderConfig} 
            onChange={setDefenderConfig} 
          />
        </PanelContainer>
      </PanelsRow>

      <DamageCalculatorPanel 
        attackerConfig={attackerConfig}
        defenderConfig={defenderConfig}
      />
    </PageContainer>
  );
};

export default DamagePage;
