import styled from '@emotion/styled';

export const CalculatorContainer = styled.div`
  width: 100%;
  background-color: var(--imspdr-background-1);
  border: 1px solid var(--imspdr-background-3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  box-sizing: border-box;
`;

export const InputSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  
  input[type="number"] {
    width: 80px;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid var(--imspdr-background-3);
    background: transparent;
    color: var(--imspdr-foreground-1);
  }
  
  select {
    padding: 6px;
    border-radius: 4px;
    border: 1px solid var(--imspdr-background-3);
    background: var(--imspdr-background-2);
    color: var(--imspdr-foreground-1);
  }
`;

export const ModifierRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
`;

export const ModifierColumn = styled.div`
  flex: 1;
  min-width: 200px;
  background-color: var(--imspdr-background-2);
  border: 1px solid var(--imspdr-background-3);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const MultiplierTag = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid var(--imspdr-background-3);
  background-color: var(--imspdr-background-2);
  color: var(--imspdr-foreground-1);
  
  &:hover {
    background-color: var(--imspdr-background-3);
  }
`;

export const AppliedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: var(--imspdr-primary-1);
  color: var(--imspdr-white);

  button {
    background: transparent;
    border: none;
    color: var(--imspdr-white);
    font-size: 10px;
    cursor: pointer;
    padding: 0;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`;

export const ResultBox = styled.div`
  padding: 16px;
  background-color: var(--imspdr-background-2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

export const RollList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  font-size: 12px;
  color: var(--imspdr-foreground-3);
`;
