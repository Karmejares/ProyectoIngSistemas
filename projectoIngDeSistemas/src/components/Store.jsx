import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function Store() {
  const { coins, removeCoins } = useContext(UserContext);
  const catFoodItems = [
    { id: 1, name: 'Fish', price: 10 },
    { id: 2, name: 'Cookies', price: 5 },
    { id: 3, name: 'Wet Food', price: 15 },
    { id: 4, name: 'Cat Food', price: 8 },
    { id: 5, name: 'Meat', price: 12 },
    { id: 6, name: 'Chicken', price: 10 },
  ];

  return (
    <div className="store-container"> {/* Add a class for potential styling */}
      <h2>Cat Food Store</h2>
      <ul>
        {catFoodItems.map(item => (
          <li key={item.id} className="store-item"> {/* Add a class for potential styling */}
            {item.name} - {item.price} coins
            <button onClick={() => handlePurchase(item)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );

  function handlePurchase(item) {
    if (coins >= item.price) {
      removeCoins(item.price);
      alert(`You purchased ${item.name} for ${item.price} coins!`);
    } else {
      alert('Not enough coins!');
    }
  }
}

export default Store;
