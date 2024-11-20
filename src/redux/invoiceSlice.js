import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(invoice => invoice.serial_number === action.payload.serial_number);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
  },
});

export const { addInvoice, updateInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;