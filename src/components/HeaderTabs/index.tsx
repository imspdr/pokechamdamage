import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@imspdr/ui';
import { TabContainer, TabItemWrapper } from './styled';

const HeaderTabs: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDamage = location.pathname.startsWith('/damage');
  const isParty = location.pathname.startsWith('/party');

  return (
    <TabContainer>
      <TabItemWrapper 
        active={isDamage} 
        onClick={() => navigate('/damage')}
      >
        <Typography 
          variant="body" 
          level={2} 
          color={isDamage ? 'primary.1' : 'foreground.3'} 
          bold={isDamage}
        >
          데미지계산
        </Typography>
      </TabItemWrapper>
      <TabItemWrapper 
        active={isParty} 
        onClick={() => navigate('/party')}
      >
        <Typography 
          variant="body" 
          level={2} 
          color={isParty ? 'primary.1' : 'foreground.3'} 
          bold={isParty}
        >
          파티 구성
        </Typography>
      </TabItemWrapper>
    </TabContainer>
  );
};

export default HeaderTabs;
