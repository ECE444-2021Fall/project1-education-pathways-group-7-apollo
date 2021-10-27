import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

const filters = ['Course Year', 'Division/Department', 'Campus']

const year = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
];

const campus = [
    {label: 'Any', value: '1'},
    {label: 'Missisauga', value: '2'},
    {label: 'Scarborough', value: '3'},
    {label: 'St. George', value: '4'},
];

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar style={{
            backgroundColor: '#4CC0C2',
            alignContent: 'center',
        }}
        position="fixed" open={open}>
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        >
        <DrawerHeader>
            <header style={{
                position: 'relative',
                fontFamily: 'Bodoni Moda',
                fontWeight: 'bold',
                width: '25vw',
                alignSelf: 'left',
                color: '#36454F'
            }}>
                Filters
            </header>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            <ListItem 
                key={filters[0]}>
                <ListItemText primary={filters[0]}/>
            </ListItem> 
            <Select style={{
                position: 'relative',
                alignSelf: 'center',
                borderRadius: 5,
                width: '15vw',
                fontSize: '100%',
                marginLeft: '1vw',
                marginTop: '1vh',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}>
                {year.map((option) => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>   
            <ListItem key={filters[1]}>
                <ListItemText primary={filters[1]} />
            </ListItem> 
            <Select style={{
                position: 'relative',
                alignSelf: 'center',
                borderRadius: 5,
                width: '15vw',
                fontSize: '100%',
                marginLeft: '1vw',
                marginTop: '1vh',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}>
            </Select>   
            <ListItem button key={filters[2]}>
                <ListItemText primary={filters[2]} />
            </ListItem> 
            <Select style={{
                position: 'relative',
                alignSelf: 'center',
                borderRadius: 5,
                width: '15vw',
                fontSize: '100%',
                marginLeft: '1vw',
                marginTop: '1vh',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}>
                {campus.map((option) => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>   
        </List>
        <Button 
            style={{
                fontFamily: 'Bodoni Moda',
                borderRadius: 5,
                width: '15vw',
                alignSelf: 'center',
                backgroundColor: "#4ac1c3",
                fontSize: "80%",
                marginTop: '2vh',
                marginBottom: '2vh',
                fontWeight: 'bold',
                paddingTop: '1vh',
                paddingBottom: '1vh',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            }}
            variant="contained"
            type="submit"  
            className="btn btn-lg btn-primary btn-block">
              Apply Filters
        </Button>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
          tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
          sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
          tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
          gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
          et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
          tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Main>
    </Box>
  );
}
