import { FC } from 'react';

import { PokemonConfig } from '@/types/pokemon';
import { getTypeInfo } from '@/typeMap';
import { getPokemonName, getPokemonTypes, getEvSummary, getNatureSummary } from '@/util';
import { EmptyContainer, EmptyIcon, EmptyText, Container, NameText, TypesRow, TypeTag, SummaryColumn, SummaryText } from './styled';

interface Props {
  member: PokemonConfig;
}

const PokemonSlotCard: FC<Props> = ({ member }) => {
  const types = getPokemonTypes(member.id);

  if (!member.id) {
    return (
      <EmptyContainer>
        <EmptyIcon>+</EmptyIcon>
        <EmptyText>비어있음</EmptyText>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <NameText>
        {getPokemonName(member.id)}
      </NameText>
      
      <TypesRow>
        {types.map(t => {
          const tInfo = getTypeInfo(t);
          return (
            <TypeTag key={t} bg={tInfo.color} textColor={tInfo.textColor}>
              {tInfo.ko}
            </TypeTag>
          );
        })}
      </TypesRow>

      <SummaryColumn>
        <SummaryText colorVariant="primary">
          {getEvSummary(member.evs)}
        </SummaryText>
        <SummaryText colorVariant="danger">
          {getNatureSummary(member.nature)}
        </SummaryText>
      </SummaryColumn>
    </Container>
  );
};

export default PokemonSlotCard;
