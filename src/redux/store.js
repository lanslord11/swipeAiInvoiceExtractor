import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';
import invoiceReducer from './invoiceSlice';

const store = configureStore({
  reducer: {
    customers: customerReducer,
    invoices: invoiceReducer,
  },
});

export default store;