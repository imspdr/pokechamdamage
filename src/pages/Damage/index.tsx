import { FC, useState } from 'react';
import { Button } from '@imspdr/ui';
import { PageContainer, PanelContainer, CenterAction } from './styled';
import PokemonConfigPanel from '../../components/PokemonConfigPanel';
import { PokemonConfig, createDefaultConfig } from '../../types/pokemon';

const DamagePage: FC = () => {
  const [attackerConfig, setAttackerConfig] = useState<PokemonConfig>(createDefaultConfig());
  const [defenderConfig, setDefenderConfig] = useState<PokemonConfig>(createDefaultConfig());

  const handleSwap = () => {
    const temp = attackerConfig;
    setAttackerConfig(defenderConfig);
    setDefenderConfig(temp);
  };

  return (
    <PageContainer>
      <PanelContainer>
        <PokemonConfigPanel 
          title="공격 포켓몬" 
          config={attackerConfig} 
          onChange={setAttackerConfig} 
        />
      </PanelContainer>

      <CenterAction>
        <Button variant="ghost" onClick={handleSwap}>
          ⇄
        </Button>
      </CenterAction>

      <PanelContainer>
        <PokemonConfigPanel 
          title="방어 포켓몬" 
          config={defenderConfig} 
          onChange={setDefenderConfig} 
        />
      </PanelContainer>
    </PageContainer>
  );
};

export default DamagePage;
