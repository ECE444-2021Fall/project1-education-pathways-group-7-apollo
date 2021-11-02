import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function CoursePlanner() {
  return(
      <Box sx={{ 
        width: 300,
        height: 150,
        p: 10, 
        m: 2,
        border: '1px solid black',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end', }}
      >
        <Stack direction="row" 
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Item>Fall</Item>
          <Item>Winter</Item>
          <Item>Summer</Item>
        </Stack>
      </Box>
  )
}; 