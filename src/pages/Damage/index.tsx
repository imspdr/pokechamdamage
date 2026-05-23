import { FC, useState } from 'react';
import { Button } from '@imspdr/ui';
import { PageContainer, PanelsRow, PanelContainer, CenterAction } from './styled';
import PokemonConfigPanel from '../../components/PokemonConfigPanel';
import DamageCalculatorPanel from './components/DamageCalculatorPanel';
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
      <PanelsRow>
        <PanelContainer>
          <PokemonConfigPanel 
            title="공격 포켓몬" 
            config={attackerConfig} 
            onChange={setAttackerConfig} 
          />
        </PanelContainer>

        <CenterAction>
          <Button 
            variant="outline" 
            onClick={handleSwap}
            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
          >
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
      </PanelsRow>

      <DamageCalculatorPanel 
        attackerConfig={attackerConfig}
        defenderConfig={defenderConfig}
      />
    </PageContainer>
  );
};

export default DamagePage;
