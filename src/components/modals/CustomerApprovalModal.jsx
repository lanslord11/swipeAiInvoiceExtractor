import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';


Modal.setAppElement('#root');

const CustomerApprovalModal = ({ isOpen, onRequestClose, customer, onApprove }) => {
  const [updatedCustomer, setUpdatedCustomer] = useState({...customer});

  useEffect(() => {
    console.log("customer inside modal",updatedCustomer)
  }, [updatedCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApprove = () => {
    if (Object.values(updatedCustomer).some((field) => field === '')) {
      alert('All fields must be filled out.');
      return;
    }
    onApprove(updatedCustomer);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Approve Customer">
      <h2>Approve Customer</h2>
      <form>
        <label>
          Customer ID:
          <input type="text" name="customer_id" value={updatedCustomer.customer_id} onChange={handleChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={updatedCustomer.name} onChange={handleChange} />
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone_number" value={updatedCustomer.phone_number} onChange={handleChange} />
        </label>
        <label>
          Total Purchase Amount:
          <input type="number" name="total_purchase_amount" value={updatedCustomer.total_purchase_amount} onChange={handleChange} />
        </label>
      </form>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default CustomerApprovalModal;