import { FC, useState, useMemo } from 'react';
import { Typography } from '@imspdr/ui';
import { PokemonConfig } from '../../../../types/pokemon';
import { calculateDetailedDamage, getCalculatedStats } from '../../../../util';
import pokemonData from '../../../../data/pokemon.json';
import { getTypeInfo } from '../../../../typeMap';
import {
  CalculatorContainer,
  InputSection,
  ModifierRow,
  ModifierColumn,
  TagContainer,
  MultiplierTag,
  AppliedTag,
  ResultBox,
  RollList,
} from './styled';

const TYPES = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
const MULTIPLIERS = [0.5, 1.1, 1.2, 1.3, 1.5, 2.0];

interface Props {
  attackerConfig: PokemonConfig;
  defenderConfig: PokemonConfig;
}

const DamageCalculatorPanel: FC<Props> = ({ attackerConfig, defenderConfig }) => {
  const [moveType, setMoveType] = useState<string>('normal');
  const [movePower, setMovePower] = useState<number>(90);
  const [localPower, setLocalPower] = useState<string>('90');
  const [moveCategory, setMoveCategory] = useState<'Physical' | 'Special'>('Physical');
  const [activeMultipliers, setActiveMultipliers] = useState<number[]>([]);
  const [activeAtkMultipliers, setActiveAtkMultipliers] = useState<number[]>([]);
  const [activeDefMultipliers, setActiveDefMultipliers] = useState<number[]>([]);

  const handlePowerBlur = () => {
    let val = Number(localPower);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 900) val = 900;
    setLocalPower(val.toString());
    setMovePower(val);
  };

  const addMultiplier = (val: number) => setActiveMultipliers(prev => [...prev, val]);
  const removeMultiplier = (idx: number) => setActiveMultipliers(prev => prev.filter((_, i) => i !== idx));

  const addAtkMultiplier = (val: number) => setActiveAtkMultipliers(prev => [...prev, val]);
  const removeAtkMultiplier = (idx: number) => setActiveAtkMultipliers(prev => prev.filter((_, i) => i !== idx));

  const addDefMultiplier = (val: number) => setActiveDefMultipliers(prev => [...prev, val]);
  const removeDefMultiplier = (idx: number) => setActiveDefMultipliers(prev => prev.filter((_, i) => i !== idx));

  const result = useMemo(() => {
    if (!attackerConfig.id || !defenderConfig.id) return null;
    
    const atkData = (pokemonData as any[]).find(p => p.id === attackerConfig.id);
    const defData = (pokemonData as any[]).find(p => p.id === defenderConfig.id);
    if (!atkData || !defData) return null;

    const buildPokemonObj = (config: PokemonConfig, data: any) => {
      const instance = {
        level: 50,
        types: data.types,
        baseStats: data.baseStats,
        evs: config.evs,
        nature: config.nature
      };
      return {
        stats: getCalculatedStats(instance),
        ranks: config.ranks,
        types: data.types
      };
    };

    const atkObj = buildPokemonObj(attackerConfig, atkData);
    const defObj = buildPokemonObj(defenderConfig, defData);

    return calculateDetailedDamage(
      atkObj,
      defObj,
      { power: movePower, type: moveType, category: moveCategory },
      activeMultipliers,
      activeDefMultipliers,
      activeAtkMultipliers
    );
  }, [attackerConfig, defenderConfig, moveType, movePower, moveCategory, activeMultipliers, activeDefMultipliers, activeAtkMultipliers]);

  return (
    <CalculatorContainer>
      <InputSection>
        <div>
          <Typography variant="caption" level={1} color="foreground.3">위력</Typography>
          <div style={{ marginTop: '4px' }}>
            <input 
              type="number" 
              value={localPower} 
              onChange={e => setLocalPower(e.target.value)} 
              onBlur={handlePowerBlur}
              min="0"
              max="900"
            />
          </div>
        </div>
        
        <div>
          <Typography variant="caption" level={1} color="foreground.3">분류</Typography>
          <div style={{ marginTop: '4px' }}>
            <select value={moveCategory} onChange={e => setMoveCategory(e.target.value as any)}>
              <option value="Physical">물리</option>
              <option value="Special">특수</option>
            </select>
          </div>
        </div>

        <div>
          <Typography variant="caption" level={1} color="foreground.3">타입</Typography>
          <div style={{ marginTop: '4px' }}>
            <select value={moveType} onChange={e => setMoveType(e.target.value)}>
              {TYPES.map(t => (
                <option key={t} value={t}>{getTypeInfo(t).ko}</option>
              ))}
            </select>
          </div>
        </div>
      </InputSection>

      {result && result.rolls.length > 0 && (
        <ResultBox>
          {(activeAtkMultipliers.length > 0 || activeDefMultipliers.length > 0 || activeMultipliers.length > 0) && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4px' }}>
              {activeAtkMultipliers.map((m, i) => (
                <AppliedTag key={`atk-${i}`} style={{ backgroundColor: 'var(--imspdr-danger-1)' }}>
                  공: x{m}
                  <button onClick={() => removeAtkMultiplier(i)}>✕</button>
                </AppliedTag>
              ))}
              {activeDefMultipliers.map((m, i) => (
                <AppliedTag key={`def-${i}`} style={{ backgroundColor: 'var(--imspdr-info-1)' }}>
                  방: x{m}
                  <button onClick={() => removeDefMultiplier(i)}>✕</button>
                </AppliedTag>
              ))}
              {activeMultipliers.map((m, i) => (
                <AppliedTag key={`dmg-${i}`} style={{ backgroundColor: 'var(--imspdr-primary-1)' }}>
                  뎀: x{m}
                  <button onClick={() => removeMultiplier(i)}>✕</button>
                </AppliedTag>
              ))}
            </div>
          )}

          <Typography variant="title" level={3} color="primary.1" bold>
            {result.rolls[0]} ~ {result.rolls[result.rolls.length - 1]} 
            <span style={{ fontSize: '14px', color: 'var(--imspdr-foreground-2)', marginLeft: '8px' }}>
              ({result.percentages[0].toFixed(1)}% ~ {result.percentages[result.percentages.length - 1].toFixed(1)}%)
            </span>
          </Typography>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {result.percentages[0] >= 100 ? (
              <Typography variant="body" level={2} color="danger.1" bold>확정 1타</Typography>
            ) : result.percentages[result.percentages.length - 1] >= 100 ? (
              <Typography variant="body" level={2} color="warning.1" bold>난수 1타</Typography>
            ) : result.percentages[0] >= 50 ? (
              <Typography variant="body" level={2} color="warning.1" bold>확정 2타</Typography>
            ) : (
              <Typography variant="body" level={2} color="foreground.2" bold>확정 3타 이상</Typography>
            )}

            <Typography variant="caption" level={1} color="foreground.3">
              상성 배율: x{result.typeEffectiveness}
            </Typography>
          </div>

          <RollList>
            난수 목록: {result.rolls.join(', ')}
          </RollList>
        </ResultBox>
      )}

      <ModifierRow>
        <ModifierColumn>
          <Typography variant="body" level={3} bold>공격 능력치 보정</Typography>
          <TagContainer>
            {MULTIPLIERS.map(m => (
              <MultiplierTag key={m} onClick={() => addAtkMultiplier(m)}>
                x{m}
              </MultiplierTag>
            ))}
          </TagContainer>
        </ModifierColumn>

        <ModifierColumn>
          <Typography variant="body" level={3} bold>방어 능력치 보정</Typography>
          <TagContainer>
            {MULTIPLIERS.map(m => (
              <MultiplierTag key={m} onClick={() => addDefMultiplier(m)}>
                x{m}
              </MultiplierTag>
            ))}
          </TagContainer>
        </ModifierColumn>

        <ModifierColumn>
          <Typography variant="body" level={3} bold>데미지 배율 보정</Typography>
          <TagContainer>
            {MULTIPLIERS.map(m => (
              <MultiplierTag key={m} onClick={() => addMultiplier(m)}>
                x{m}
              </MultiplierTag>
            ))}
          </TagContainer>
        </ModifierColumn>
      </ModifierRow>
    </CalculatorContainer>
  );
};

export default DamageCalculatorPanel;
