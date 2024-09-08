import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingBag from '@mui/icons-material/ShoppingBag';

import { closeSidebar } from '../utils';
import { Card, Stack } from '@mui/joy';
import { NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Toggler({
  defaultExpanded = true,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);

  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const [note, setNote] = React.useState<1 | 2>(1);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <FiberSmartRecordIcon />
        </IconButton>
        <Typography level="title-lg">Cozey Giftbox</Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <Link to="/shop">
            <ListItem>
              <ListItemButton>
                <ShoppingBag />
                <ListItemContent>
                  <Typography level="title-sm">Shop</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </Link>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <AssignmentRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Warehouse</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? {
                            transform: 'rotate(180deg)',
                          }
                        : {
                            transform: 'none',
                          },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <Link to="/order-parts">
                  <ListItem sx={{ mt: 0.5 }}>
                    <ListItemButton>Order Parts</ListItemButton>
                  </ListItem>
                </Link>
                <Link to="/packaging">
                  <ListItem>
                    <ListItemButton>Packaging</ListItemButton>
                  </ListItem>
                </Link>
                <Link to="/orders">
                  <ListItem>
                    <ListItemButton>Orders</ListItemButton>
                  </ListItem>
                </Link>
              </List>
            </Toggler>
          </ListItem>
        </List>
        <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: 'none' }}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography level="title-sm">Demo Purposes</Typography>
            <IconButton size="sm">
              <NavigateNext onClick={() => {
                note === 1 ? setNote(2) : setNote(1)
              }} />
            </IconButton>
          </Stack>
          {note === 1 ? (
            <Typography level="body-xs">
              This dashboard combines the shop and warehouse management system. In a real world scenario, these would be separate apps.
            </Typography>
          ) : (
            <Typography level="body-xs">
              Assume that the shop is only accessible to customers, while the warehouse is only accessible to employees.
            </Typography>
          )}
        </Card>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="/profile.jpg"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">User Demo</Typography>
          <Typography level="body-xs">hello@world.com</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" disabled>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}