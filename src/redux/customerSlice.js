import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.customer_id === action.payload.customer_id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
  },
});

export const { addCustomer, updateCustomer } = customerSlice.actions;
export default customerSlice.reducer;