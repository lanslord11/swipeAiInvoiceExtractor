import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const InvoiceApprovalModal = ({ isOpen, onRequestClose, invoice, onApprove }) => {
  const [updatedInvoice, setUpdatedInvoice] = useState(invoice);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApprove = () => {
    if (Object.values(updatedInvoice).some((field) => field === '')) {
      alert('All fields must be filled out.');
      return;
    }
    onApprove(updatedInvoice);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Approve Invoice">
      <h2>Approve Invoice</h2>
      <form>
        <label>
          Serial Number:
          <input type="text" name="serial_number" value={updatedInvoice.serial_number} onChange={handleChange} />
        </label>
        <label>
          Customer ID:
          <input type="text" name="customer_id" value={updatedInvoice.customer_id} onChange={handleChange} />
        </label>
        <label>
          Product Name:
          <input type="text" name="product_name" value={updatedInvoice.products[0].name} onChange={handleChange} />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" value={updatedInvoice.products[0].quantity} onChange={handleChange} />
        </label>
        <label>
          Tax:
          <input type="number" name="tax" value={updatedInvoice.products[0].tax} onChange={handleChange} />
        </label>
        <label>
          Total Amount:
          <input type="number" name="total_amount" value={updatedInvoice.total_amount} onChange={handleChange} />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={updatedInvoice.date} onChange={handleChange} />
        </label>
      </form>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default InvoiceApprovalModal;