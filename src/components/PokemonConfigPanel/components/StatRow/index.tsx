import { FC, useState, useEffect } from 'react';
import { Typography } from '@imspdr/ui';
import { StatName } from '@/util';
import {
  RowContainer,
  LabelBox,
  BaseStatBox,
  ActualStatBox,
  EvInputBox,
  MinMaxBtn,
  NatureBox,
  NatureBtn,
  RankBox,
} from './styled';

interface StatRowProps {
  statKey: StatName;
  label: string;
  baseStat: number;
  actualStat: number;
  ev: number;
  onEvChange: (val: number) => void;
  natureModifier: 1.1 | 1.0 | 0.9;
  onNatureChange: (val: 1.1 | 1.0 | 0.9) => void;
  rank: number;
  onRankChange: (val: number) => void;
}

const StatRow: FC<StatRowProps> = ({
  statKey,
  label,
  baseStat,
  actualStat,
  ev,
  onEvChange,
  natureModifier,
  onNatureChange,
  rank,
  onRankChange,
}) => {
  const isHp = statKey === 'hp';

  const [localEv, setLocalEv] = useState(ev.toString());
  const [localRank, setLocalRank] = useState(rank.toString());

  useEffect(() => {
    setLocalEv(ev.toString());
  }, [ev]);

  useEffect(() => {
    setLocalRank(rank.toString());
  }, [rank]);

  const handleEvBlur = () => {
    let val = Number(localEv);
    if (isNaN(val)) val = 0;
    if (val > 32) val = 32;
    if (val < 0) val = 0;
    setLocalEv(val.toString());
    onEvChange(val);
  };

  const handleRankBlur = () => {
    let val = Number(localRank);
    if (isNaN(val)) val = 0;
    if (val > 6) val = 6;
    if (val < -6) val = -6;
    setLocalRank(val.toString());
    onRankChange(val);
  };

  return (
    <RowContainer>
      <LabelBox>
        <Typography variant="body" level={3} bold>{label}</Typography>
      </LabelBox>
      <BaseStatBox>
        <Typography variant="body" level={3} color="foreground.3">{baseStat}</Typography>
      </BaseStatBox>
      <ActualStatBox>
        <Typography variant="body" level={3} color="primary.1" bold>
          {actualStat}
        </Typography>
      </ActualStatBox>
      <EvInputBox>
        <MinMaxBtn onClick={() => { setLocalEv('0'); onEvChange(0); }}>0</MinMaxBtn>
        <input 
          type="number" 
          min="0" max="32" step="1" 
          value={localEv} 
          onChange={(e) => setLocalEv(e.target.value)} 
          onBlur={handleEvBlur}
        />
        <MinMaxBtn onClick={() => { setLocalEv('32'); onEvChange(32); }}>32</MinMaxBtn>
      </EvInputBox>
      <NatureBox>
        <NatureBtn 
          disabled={isHp}
          active={natureModifier === 1.1} 
          modifierType="up"
          onClick={() => onNatureChange(1.1)}
        >
          ▲
        </NatureBtn>
        <NatureBtn 
          disabled={isHp}
          active={natureModifier === 1.0} 
          modifierType="none"
          onClick={() => onNatureChange(1.0)}
        >
          -
        </NatureBtn>
        <NatureBtn 
          disabled={isHp}
          active={natureModifier === 0.9} 
          modifierType="down"
          onClick={() => onNatureChange(0.9)}
        >
          ▼
        </NatureBtn>
      </NatureBox>
      <RankBox>
        <input 
          type="number" 
          min="-6" max="6" 
          value={localRank} 
          disabled={isHp}
          onChange={(e) => setLocalRank(e.target.value)} 
          onBlur={handleRankBlur}
          style={{ visibility: isHp ? 'hidden' : 'visible' }}
        />
      </RankBox>
    </RowContainer>
  );
};

export default StatRow;
