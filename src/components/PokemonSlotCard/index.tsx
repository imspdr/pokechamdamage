import { FC } from 'react';
import { Typography } from '@imspdr/ui';
import { PokemonConfig } from '@/types/pokemon';
import { getTypeInfo } from '@/typeMap';
import { getPokemonName, getPokemonTypes, getEvSummary, getNatureSummary } from '@/util';

interface Props {
  member: PokemonConfig;
}

const PokemonSlotCard: FC<Props> = ({ member }) => {
  const types = getPokemonTypes(member.id);

  if (!member.id) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '24px', opacity: 0.2 }}>+</div>
        <Typography variant="caption" level={1} color="foreground.3" style={{ marginTop: '4px', fontSize: '10px' }}>
          비어있음
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '4px', boxSizing: 'border-box', justifyContent: 'center' }}>
      <Typography variant="body" level={3} bold style={{ textAlign: 'center', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
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
  );
};

export default PokemonSlotCard;
