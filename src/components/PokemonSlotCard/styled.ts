import styled from '@emotion/styled';

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const EmptyIcon = styled.div`
  font-size: 24px;
  opacity: 0.2;
`;

export const EmptyText = styled.div`
  margin-top: 4px;
  font-size: 10px;
  color: var(--imspdr-foreground-3);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 4px;
  box-sizing: border-box;
  justify-content: center;
`;

export const NameText = styled.div`
  text-align: center;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 14px;
  color: var(--imspdr-foreground-1);
`;

export const TypesRow = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
  margin-bottom: 4px;
`;

export const TypeTag = styled.div<{ bg: string; textColor: string }>`
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 4px;
  background-color: ${props => props.bg};
  color: ${props => props.textColor};
  white-space: nowrap;
`;

export const SummaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const SummaryText = styled.div<{ colorVariant: 'primary' | 'danger' }>`
  font-size: 10px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: ${props => props.colorVariant === 'primary' ? 'var(--imspdr-primary-1)' : 'var(--imspdr-danger-1)'};
`;
