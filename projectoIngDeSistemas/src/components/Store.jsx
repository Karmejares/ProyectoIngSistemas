import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { Typography, List, ListItem, Button, Box } from '@mui/material';

function Store() {
  const { coins, removeCoins, feedPet } = useContext(UserContext);
  const catFoodItems = [
    { id: 1, name: 'Fish', price: 10 },
    { id: 2, name: 'Cookies', price: 5 },
    { id: 3, name: 'Wet Food', price: 15 },
    { id: 4, name: 'Cat Food', price: 8 },
    { id: 5, name: 'Meat', price: 12 },
    { id: 6, name: 'Chicken', price: 10 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Cat Food Store
      </Typography>
      <List>
        {catFoodItems.map(item => (
          <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', py: 1 }}>
            <Typography variant="body1">
 {item.name} - {item.price} coins
            </Typography>
            <Button variant="contained" size="small" onClick={() => handlePurchase(item)}>Buy</Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  function handlePurchase(item) {
    if (coins >= item.price) {
      removeCoins(item.price);
      feedPet(item.name);
      alert(`You purchased ${item.name} for ${item.price} coins!`);
    } else {
      alert('Not enough coins!');
    }
  }
}

export default Store;
