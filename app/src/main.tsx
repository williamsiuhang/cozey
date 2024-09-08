import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { CssVarsProvider } from '@mui/joy/styles';
import theme from './theme';

import ShopPage from './pages/ShopPage';
import OrdersPage from './pages/OrdersPage';
import OrderPartsPage from './pages/OrderPartsPage';
import PackListPage from './pages/PackListPage';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/order-parts",
    element: <OrderPartsPage />,
  },
  {
    path: "/packaging",
    element: <PackListPage />,
  },
  {
    path: "*",
    element: <Navigate to="/shop" />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <RouterProvider router={router} />
    </CssVarsProvider>
  </StrictMode>,
);
