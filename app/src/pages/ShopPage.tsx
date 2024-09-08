import { type ResponseProducts } from '@cozey/index.d';
import { useEffect, useState } from 'react';
import PageLayout from './PageLayout';
import API from '../utils/api';
import Card from '@mui/joy/Card';
import { Button, Chip, Grid, List, ListItem, Snackbar, Typography } from '@mui/joy';
import { money } from '../utils/money';

export default function ShopPage() {
  // [Refs] Define state for products and parts
  const [products, setProducts] = useState<ResponseProducts['products']>();
  const [parts, setParts] = useState<ResponseProducts['parts']>();
  const [loading, setLoading] = useState<Set<number>>(new Set());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * [Computed]
   * Map products to include parts
   */
  const inventory = (products ?? []).map(product => {
    return {
      ...product,
      parts: product.partIds.map(partId => parts?.find(part => part.id === partId))
    }
  })

  /**
   * [Mounted]
   * Fetch products and parts from API
   */
  useEffect(() => {
    API.get('/products').then((res: ResponseProducts) => {
      setProducts(res.products);
      setParts(res.parts);
    })
  }, []);

  /**
   * [Function]
   * Handle buy button click
   * @param productId 
   */
  const onClickBuy = async (productId: number) => {
    setLoading((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });

    try {
      // purchase product
      const res = await API.post('/purchase', { productIds: [productId] });
      setSnackbarMessage('Product purchased successfully');

      // update inventory state
      if (res.products && res.parts) {
        setProducts(res.products);
        setParts(res.parts);
      }
    } catch (e) {
      setSnackbarMessage('An error occurred');
      console.error(e);
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });

      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 2000);
    }
  }

  return (
    <PageLayout>
      <Grid container spacing={1} sx={{ flexGrow: 1, margin: 0.5 }}>
        {inventory.map(product => (
          <Grid key={`p-${product.id}`}>
            <Card
              key={product.id}
              sx={{
                "--Card-radius": "5px",
              }}
            >
              <h4 style={{ margin: 0 }}>{product.name}</h4>
              <Chip sx={{ p: 0, px: 1, m: 0, mt: -1, color: 'var(--joy-palette-neutral-400)' }}>
                {money.format(product.price)}
              </Chip>
              <List style={{ fontSize: '0.75rem' }}>
                {product.parts.map(part => (
                  <ListItem key={part?.id} sx={{ minWidth: 180, mt: -2 }}>
                    {part?.name ?? '--'}
                  </ListItem>
                ))}
              </List>
              {
                product.stock === 0 && (
                  <Typography level="body-xs" color="danger">
                    Out of stock
                  </Typography>
                )
              }
              {
                product.stock > 0 && (
                  <Typography level="body-xs">
                    {product.stock} remaining
                  </Typography>
                )
              }
              <Button
                variant="solid"
                color="primary"
                loading={loading.has(product.id)}
                disabled={product.stock === 0}
                onClick={() => onClickBuy(product.id)}
              >
                Buy
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        color="neutral"
      >
        {snackbarMessage}
      </Snackbar>
    </PageLayout>
  )
}