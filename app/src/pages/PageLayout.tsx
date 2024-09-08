import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function PageLayout({ children }: any) {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </Box>
    </CssVarsProvider>
  );
}