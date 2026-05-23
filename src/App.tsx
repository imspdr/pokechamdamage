import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Layout,
  ModalProvider,
  ThemeProvider,
  ToastProvider,
  Typography,
} from '@imspdr/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DamagePage from './pages/Damage';
import PartyPage from './pages/Party';
import HeaderTabs from './components/HeaderTabs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: FC = () => {
  const basename = process.env.BASENAME || '/';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <ModalProvider>
            <BrowserRouter basename={basename}>
              <AppLayout />
            </BrowserRouter>
          </ModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const AppLayout: FC = () => {
  const navigate = useNavigate();

  return (
    <Layout
      title="데미지계산기"
      onHomeClick={() => navigate('/')}
      middleContent={<HeaderTabs />}
    >
      <Routes>
        <Route path="/damage" element={<DamagePage />} />
        <Route path="/party" element={<PartyPage />} />
        <Route path="*" element={<Navigate to="/damage" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
