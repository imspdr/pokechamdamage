import styled from '@emotion/styled';

export const RowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  margin-bottom: 4px;
`;

export const LabelBox = styled.div`
  width: 40px;
  flex-shrink: 0;
`;

export const BaseStatBox = styled.div`
  width: 30px;
  text-align: right;
  flex-shrink: 0;
`;

export const ActualStatBox = styled.div`
  width: 36px;
  text-align: right;
  flex-shrink: 0;
`;

export const EvInputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  min-width: 80px;

  input[type="number"] {
    width: 36px;
    padding: 2px;
    border-radius: 4px;
    border: 1px solid var(--imspdr-background-3);
    font-size: 13px;
    text-align: center;
  }
`;

export const MinMaxBtn = styled.button`
  padding: 2px 4px;
  font-size: 10px;
  border-radius: 4px;
  background-color: var(--imspdr-background-2);
  border: 1px solid var(--imspdr-background-3);
  color: var(--imspdr-foreground-2);
  cursor: pointer;

  &:hover {
    background-color: var(--imspdr-background-3);
  }
  
  &:disabled {
    visibility: hidden;
  }
`;

export const NatureBox = styled.div`
  display: flex;
  gap: 2px;
  width: 70px;
  justify-content: center;
  flex-shrink: 0;
`;

export const NatureBtn = styled.button<{ active: boolean; modifierType: 'up' | 'none' | 'down' }>`
  padding: 2px 4px;
  font-size: 11px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.active ? 'transparent' : 'var(--imspdr-background-3)')};
  background-color: ${(props) => {
    if (!props.active) return 'transparent';
    if (props.modifierType === 'up') return 'var(--imspdr-danger-1)';
    if (props.modifierType === 'down') return 'var(--imspdr-info-1)';
    return 'var(--imspdr-foreground-3)';
  }};
  color: ${(props) => (props.active ? 'var(--imspdr-white)' : 'var(--imspdr-foreground-1)')};
  cursor: pointer;

  &:disabled {
    visibility: hidden;
  }
`;

export const RankBox = styled.div`
  display: flex;
  align-items: center;
  width: 40px;
  flex-shrink: 0;
  
  input[type="number"] {
    width: 100%;
    padding: 2px;
    border-radius: 4px;
    border: 1px solid var(--imspdr-background-3);
    text-align: center;
    background: transparent;
    color: var(--imspdr-foreground-1);
    font-size: 13px;
  }
`;
