import styled from '@emotion/styled';
import { Button } from '@imspdr/ui';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PartyListButton = styled(Button)`
  justify-content: space-between;
  padding: 12px;
`;

export const PartyName = styled.span`
  font-weight: bold;
`;

export const PartyMemberCount = styled.span`
  font-size: 12px;
  color: var(--imspdr-foreground-3);
`;

export const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const SlotWrapper = styled.div<{ disabled?: boolean }>`
  aspect-ratio: 1;
  border: 1px solid var(--imspdr-background-3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  opacity: ${props => props.disabled ? 0.3 : 1};
  background-color: var(--imspdr-background-2);
`;

export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

export const RoleSelectText = styled.div`
  text-align: center;
`;

export const FooterContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const AttackerButton = styled(Button)`
  flex: 1;
  background-color: var(--imspdr-danger-1);
`;

export const DefenderButton = styled(Button)`
  flex: 1;
  background-color: var(--imspdr-info-1);
`;

export const FooterFullButton = styled(Button)`
  width: 100%;
  color: var(--imspdr-foreground-2);
`;
