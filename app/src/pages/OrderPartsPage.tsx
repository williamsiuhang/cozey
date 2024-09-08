import { useEffect, useState } from 'react';
import PageLayout from './PageLayout';
import API from '../utils/api';
import { ResponseOrderParts, ResponseProducts } from '@cozey/index';
import { Box, Card, Tab, TabList, TabPanel, Tabs, Typography, tabClasses } from '@mui/joy';
import dayjs from 'dayjs';

export default function OrderPartsPage() {
  const [orderParts, setOrderParts] = useState<ResponseOrderParts>({});
  const [parts, setParts] = useState<ResponseProducts['parts']>([]);

  /**
   * [Computed]
   * Map the part id to namesfor easy access.
   */
  const _parts = parts.reduce((acc: Record<string, string>, part) => {  
    acc[part.id] = part.name;
    return acc;
  }, {});

  /**
   * [Mounted]
   * Fetch the order parts data.
   */
  useEffect(() => {
    API.get('/order-parts').then((data) => {
      setOrderParts(data);
    });

    API.get('/products').then((res: ResponseProducts) => {
      setParts(res.parts);
    })
  }, []);

  const countParts = (partIds: number[]) => {
    const uniquePartIds = [...new Set(partIds)];
    const aggregated = uniquePartIds.reduce((acc: Record<number, number>, partId) => {
      acc[partId] = partIds.filter((id) => id === partId).length;
      return acc;
    }, {})

    return aggregated;
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
          This page contains a summary of the parts required to fulfill orders from specified dates.
        </Typography>
      </Card>
      <Box sx={{ m: 2 }}>
        <Tabs size="md">
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: 'xl',
              bgcolor: 'background.level1',
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: 'sm',
                bgcolor: 'background.surface',
              },
            }}
          >
            {Object.keys(orderParts).map((date) => (
              <Tab disableIndicator key={date}>
                {dayjs(date).format('MMM D, YYYY')}
              </Tab>
            ))}
          </TabList>
          {Object.entries(orderParts).map(([date, partIds], i) => (
            <TabPanel key={date} value={i}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(countParts(partIds)).map(([partId, quantity]) => (
                  <Box key={partId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography level="body-sm">{_parts[Number(partId)]}</Typography>
                    <Typography level="body-sm">{quantity}</Typography>
                  </Box>
                ))}
              </Box>
            </TabPanel>
          ))}
        </Tabs>
      </Box>
    </PageLayout>
  );
};;