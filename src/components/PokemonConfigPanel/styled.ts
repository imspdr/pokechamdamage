import styled from '@emotion/styled';

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  margin-bottom: 2px;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--imspdr-background-3);
  
  /* Matches widths in StatRow */
  .label-col { width: 40px; }
  .base-col { width: 30px; text-align: right; }
  .actual-col { width: 36px; text-align: right; }
  .ev-col { flex: 1; min-width: 80px; text-align: center; }
  .nature-col { width: 70px; text-align: center; }
  .rank-col { width: 40px; text-align: center; }
`;
