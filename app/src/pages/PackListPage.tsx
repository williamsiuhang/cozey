import { useEffect, useState } from 'react';
import PageLayout from './PageLayout';
import { Order, ResponseOrders, ResponseProducts } from '@cozey/index';
import { Box, Button, Card, Chip, Divider, Snackbar, Stack, Typography } from '@mui/joy';
import API from '../utils/api';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Celebration } from '@mui/icons-material';

dayjs.extend(LocalizedFormat);

export default function PackListPage() {
  const [orders, setOrders] = useState<ResponseOrders['orders']>([]);
  const [products, setProducts] = useState<ResponseProducts['products']>([]);
  const [parts, setParts] = useState<ResponseProducts['parts']>([]);
  const [loading, setLoading] = useState<number[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * [Computed]
   */
  const _products = products.reduce((acc: any, product) => {
    acc[product.id] = product.name;
    return acc;
  }, {})
  const _parts = parts.reduce((acc: any, part) => {
    acc[part.id] = part.name;
    return acc;
  }, {})

  const dates = [...new Set(orders.map(order => dayjs(order.date).format('YYYY-MM-DD')))];
  const _orders = dates.reduce((acc: any, date) => {
    acc[date] = orders.filter(order => dayjs(order.date).format('YYYY-MM-DD') === date);
    return acc;
  }, {})

  /**
   * [Mounted]
   * Fetch orders from API
   */
  useEffect(() => {
    API.get('/orders').then((res: ResponseOrders) => {
      const unfulfilledOrders = res.orders.filter(order => order.status === 'paid');
      setOrders(unfulfilledOrders);
    })

    API.get('/products').then((res: ResponseProducts) => {
      setProducts(res.products);
      setParts(res.parts);
    })
  }, []);

  /**
   * [Function]
   * Complete order (finished packing and shipped)
   */
  const onClickCompleteOrder = async (orderId: number) => {
    setLoading([...loading, orderId]);

    try {
      const res: ResponseOrders = await API.put(`/complete-order/${orderId}`);
      setOrders(res.orders);
      setSnackbarMessage(`Order INV-${orderId} completed successfully`);
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(loading.filter(id => id !== orderId));
    }
  }

  return (
    <PageLayout>
      <Card
        invertedColors
        variant="soft"
        color="primary"
        size="sm"
        sx={{ boxShadow: 'none' }}
      >
        <Typography level="body-xs">
          This page contains all pending orders that need to be packed and shipped.
          Please click on the "Complete Order" button to mark an order as fulfilled.
        </Typography>
      </Card>
      { !orders.length && (
        <Stack sx={{ m: 3 }} direction="row">
          <Typography level="body-sm" color="neutral">No orders remaining</Typography>
          <Celebration sx={{ mx: 0.8, mt: 0.4 }} />
        </Stack>
      ) }
      <Box sx={{ m: 2 }}>
        {
          Object.entries(_orders).map(([date, orders], i) => (
            <Box key={`b-${i}`}>
              <Chip>
                <Typography level="body-sm">{dayjs(date).format('MMMM D, YYYY')}</Typography>
              </Chip>
              <Box>
                {(orders as Order[]).map((order, i) => (
                  <Card key={i} sx={{ m: 1, width: 350 }}>
                    {/* {JSON.stringify(order)} */}
                    <Stack>
                      <Chip color="primary">INV-{order.id}</Chip>
                      {/* <Typography level="title-sm"></Typography> */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                        <Typography level="body-sm">Order Date</Typography>
                        <Typography level="body-sm">{dayjs(order.date).format('LL')}</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ p: 1 }}>
                        <Typography level="body-sm">Line Items</Typography>
                        {
                          order.productIds.map((id, n) => (
                            <Box key={`${i}-${n}`}>
                              <Chip color="success">
                                <Typography level="title-sm">{_products[id]}</Typography>
                              </Chip>
                              <Box>
                                {
                                  products.find(product => product.id === id)?.partIds.map((id, m) => (
                                    <Chip key={`${i}-${n}-${m}`} color="neutral" size="sm">{_parts[id]}</Chip>
                                  ))
                                }
                              </Box>
                            </Box>
                          ))
                        }
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                        <Typography level="body-sm">Ships to</Typography>
                        <Box>
                          <Typography level="body-sm">{order.customerName}</Typography>
                          <Typography level="body-sm">{order.shippingAddress}</Typography>
                        </Box>
                      </Box>
                    </Stack>
                    <Divider />
                    <Button
                      color="neutral"
                      loading={loading.includes(order.id)}
                      onClick={() => onClickCompleteOrder(order.id)}
                    >
                        Complete Order
                    </Button>
                  </Card>
                ))}
              </Box>
            </Box>
          ))
        }
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        color="neutral"
      >
        {snackbarMessage}
      </Snackbar>
    </PageLayout>
  );
};;