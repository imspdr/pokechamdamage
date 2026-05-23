import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 8px;
  
  @media (max-width: 767px) {
    padding: 4px;
  }
`;

export const PanelsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 8px;
  width: 100%;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PanelContainer = styled.div`
  flex: 1;
  background-color: var(--imspdr-background-1);
  border: 1px solid var(--imspdr-background-3);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
`;

export const CenterAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;

  @media (max-width: 767px) {
    padding-top: 0;
    padding: 8px 0;
    transform: rotate(90deg);
  }
`;
