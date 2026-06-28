import styled from '@emotion/styled';

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--imspdr-background-1);
  border: 1px solid var(--imspdr-background-3);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--imspdr-shadow);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const OptionsList = styled.div`
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--imspdr-background-3);
    border-radius: 3px;
  }
`;

export const OptionItem = styled.div<{ isSelected?: boolean }>`
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  color: var(--imspdr-foreground-1);
  background: ${({ isSelected }) => (isSelected ? 'var(--imspdr-background-2)' : 'transparent')};
  border-left: 3px solid
    ${({ isSelected }) => (isSelected ? 'var(--imspdr-primary-1)' : 'transparent')};

  @media (hover: hover) {
    &:hover {
      background: var(--imspdr-background-3);
    }
  }
`;

export const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--imspdr-foreground-3);
`;
