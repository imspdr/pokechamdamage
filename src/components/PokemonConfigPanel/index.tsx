import { FC } from 'react';
import { Typography } from '@imspdr/ui';
import { PokemonAutoComplete, PokemonOption } from '../PokemonAutoComplete';
import { PokemonConfig } from '@/types/pokemon';
import StatRow from './components/StatRow';
import { StatName, calculateStat } from '@/util';
import pokemonData from '@/data/pokemon.json';
import { TypeBadge } from '../TypeBadge';
import { PanelWrapper, HeaderRow } from './styled';

interface Props {
  title: string;
  config: PokemonConfig;
  onChange: (newConfig: PokemonConfig) => void;
}

const pokemonOptions: PokemonOption[] = pokemonData.map((p) => {
  const aliases: string[] = [];
  
  if (p.form && p._baseKoreanName) {
    const formName = p.koreanName.replace(p._baseKoreanName, '').replace(/^-/, '');
    if (formName) {
      aliases.push(`${formName}${p._baseKoreanName}`); // e.g. 메가이상해꽃
      aliases.push(`${formName} ${p._baseKoreanName}`); // e.g. 메가 이상해꽃
    }
    aliases.push(p._baseKoreanName); // e.g. 이상해꽃
  }

  return {
    label: p.koreanName,
    value: p.id,
    aliases,
  };
});

const STAT_LABELS: Record<StatName, string> = {
  hp: 'HP',
  attack: '공격',
  defense: '방어',
  spAttack: '특공',
  spDefense: '특방',
  speed: '스피드',
};

const STAT_SHORT_LABELS: Record<StatName, string> = {
  hp: 'H',
  attack: 'A',
  defense: 'B',
  spAttack: 'C',
  spDefense: 'D',
  speed: 'S',
};

const STAT_KEYS: StatName[] = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];

const PokemonConfigPanel: FC<Props> = ({ title, config, onChange }) => {
  const selectedPokemon = pokemonData.find((p) => p.id === config.id);

  const handleIdChange = (id: string) => {
    onChange({ ...config, id });
  };

  const handleEvChange = (stat: StatName, val: number) => {
    onChange({ ...config, evs: { ...config.evs, [stat]: val } });
  };

  const handleNatureChange = (stat: StatName, val: 1.1 | 1.0 | 0.9) => {
    const newNature = { ...config.nature };
    if (val === 1.1) {
      STAT_KEYS.forEach((k) => {
        if (newNature[k] === 1.1) newNature[k] = 1.0;
      });
    }
    if (val === 0.9) {
      STAT_KEYS.forEach((k) => {
        if (newNature[k] === 0.9) newNature[k] = 1.0;
      });
    }
    newNature[stat] = val;
    onChange({ ...config, nature: newNature });
  };

  const handleRankChange = (stat: StatName, val: number) => {
    onChange({ ...config, ranks: { ...config.ranks, [stat]: val } });
  };

  return (
    <PanelWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '24px' }}>
        <Typography variant="caption" level={1} color="foreground.2">
          {title}
        </Typography>
        {selectedPokemon && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {selectedPokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        )}
      </div>

      <PokemonAutoComplete
        key={config.id || 'empty'}
        initialValue={selectedPokemon?.koreanName || ''}
        options={pokemonOptions}
        onSelect={(opt) => handleIdChange(opt.value)}
        noResultText="포켓몬을 찾을 수 없습니다."
      />

      {selectedPokemon && (
        <>
          <HeaderRow>
            <div className="label-col" />
            <div className="base-col">
              <Typography variant="caption" level={1} color="foreground.3">
                종족
              </Typography>
            </div>
            <div className="actual-col">
              <Typography variant="caption" level={1} color="foreground.3">
                실능
              </Typography>
            </div>
            <div className="ev-col">
              <Typography variant="caption" level={1} color="foreground.3">
                노력치
              </Typography>
            </div>
            <div className="nature-col">
              <Typography variant="caption" level={1} color="foreground.3">
                성격
              </Typography>
            </div>
            <div className="rank-col">
              <Typography variant="caption" level={1} color="foreground.3">
                랭크
              </Typography>
            </div>
          </HeaderRow>

          {STAT_KEYS.map((statKey) => {
            const baseStat = (selectedPokemon.baseStats as any)[statKey];
            const ev = config.evs[statKey];
            const natureModifier = config.nature[statKey];
            const actualStat = calculateStat(statKey, baseStat, ev, natureModifier);

            return (
              <StatRow
                key={statKey}
                statKey={statKey}
                label={STAT_LABELS[statKey]}
                baseStat={baseStat}
                actualStat={actualStat}
                ev={ev}
                onEvChange={(val) => handleEvChange(statKey, val)}
                natureModifier={natureModifier}
                onNatureChange={(val) => handleNatureChange(statKey, val)}
                rank={config.ranks[statKey]}
                onRankChange={(val) => handleRankChange(statKey, val)}
              />
            );
          })}
        </>
      )}
    </PanelWrapper>
  );
};

export default PokemonConfigPanel;
