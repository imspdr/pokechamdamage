import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
  align-items: center;
`;

export const TabItemWrapper = styled.div<{ active: boolean }>`
  cursor: pointer;
  padding: 8px 16px;
  border-bottom: ${(props) => (props.active ? '2px solid var(--imspdr-primary-1)' : '2px solid transparent')};
  transition: all 0.2s;

  &:hover {
    background-color: var(--imspdr-background-2);
  }
`;
