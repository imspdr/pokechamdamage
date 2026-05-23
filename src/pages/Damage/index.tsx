import { FC } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const DamagePage: FC = () => {
  return (
    <Container>
      <div>데미지 계산 페이지 Placeholder</div>
    </Container>
  );
};

export default DamagePage;
