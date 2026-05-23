import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 16px 8px;
  box-sizing: border-box;
`;

export const PartyCard = styled.div`
  background-color: var(--imspdr-background-1);
  border: 1px solid var(--imspdr-background-3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: var(--imspdr-primary-1);
  }
`;

export const SlotsRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;

  @media (max-width: 767px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SlotItem = styled.div<{ active: boolean; empty: boolean }>`
  flex: 1;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 2px solid ${props => props.active ? 'var(--imspdr-primary-1)' : 'var(--imspdr-background-3)'};
  background-color: ${props => props.empty ? 'var(--imspdr-background-2)' : 'var(--imspdr-background-1)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    border-color: ${props => props.active ? 'var(--imspdr-primary-1)' : 'var(--imspdr-foreground-3)'};
  }

  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
    opacity: ${props => props.empty ? 0.3 : 1};
  }
`;

export const ConfigWrapper = styled.div`
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid var(--imspdr-background-3);
  background-color: var(--imspdr-background-1);
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 767px) {
    padding: 8px;
    width: 100%;
  }
`;
