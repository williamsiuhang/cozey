import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OrderTable from '../components/OrderTable';
import PageLayout from './PageLayout';
import { useEffect, useState } from 'react';
import API from '../utils/api';
import { ResponseOrders, ResponseProducts } from '@cozey/index';

export default function OrdersPage() {
  const [orders, setOrders] = useState<ResponseOrders['orders']>([]);
  const [products, setProducts] = useState<ResponseProducts['products']>([]);
  const [loading, setLoading] = useState(false);

  /**
   * [Mounted]
   * Fetch orders from API
   */
  useEffect(() => {
    API.get('/orders').then((res: ResponseOrders) => {
      setOrders(res.orders);
    })

    API.get('/products').then((res: ResponseProducts) => {
      setProducts(res.products);
    })
  }, []);

  /**
   * [Function]
   * Reset all data
   */
  const onClickReset = async () => {
    setLoading(true);

    try {
      const res = await API.post('/reset');

      setOrders(res.orders);
      setProducts(res.products); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: 'calc(12px + var(--Header-height))',
            sm: 'calc(12px + var(--Header-height))',
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100dvh',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="/shop"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
              Orders
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box
          sx={{
            display: 'flex',
            mb: 1,
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="h2" component="h1">
            Orders
          </Typography>
          <Button
            color="primary"
            startDecorator={<RestartAltIcon />}
            size="sm"
            loading={loading}
            onClick={() => onClickReset()}  
          >
            Reset All Data
          </Button>
        </Box>
        <OrderTable orders={orders} products={products} />
      </Box>
    </PageLayout>
  );
}