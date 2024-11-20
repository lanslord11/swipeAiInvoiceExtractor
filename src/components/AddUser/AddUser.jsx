import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from './store/userSlice';

const AddUser = () => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const dispatch = useDispatch();

  const handleAddUser = () => {
    dispatch(addUser({
      customer_id: customerId,
      customer_name: customerName,
      phone_number: phoneNumber,
      total_purchase_amount: totalPurchaseAmount,
    }));
  };

  return (
    <div>
      <input type="text" placeholder="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
      <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <input type="number" placeholder="Total Purchase Amount" value={totalPurchaseAmount} onChange={(e) => setTotalPurchaseAmount(e.target.value)} />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default AddUser;