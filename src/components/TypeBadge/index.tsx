import { FC } from 'react';
import styled from '@emotion/styled';
import { getTypeInfo } from '../../typeMap';

const BadgeContainer = styled.div<{ bg: string; textColor: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${(props) => props.bg};
  color: ${(props) => props.textColor};
  font-size: 11px;
  font-weight: 700;
`;

interface TypeBadgeProps {
  type: string;
}

export const TypeBadge: FC<TypeBadgeProps> = ({ type }) => {
  const info = getTypeInfo(type);
  return (
    <BadgeContainer bg={info.color} textColor={info.textColor}>
      {info.ko}
    </BadgeContainer>
  );
};
