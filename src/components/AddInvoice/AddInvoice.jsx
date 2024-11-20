import React, { useRef, useState } from "react"
import { useDataExtraction } from "../../services/aiExtractor"
import { Upload, FileText, Loader } from 'lucide-react'
import {addInvoice} from '../../redux/invoiceSlice'
import { useDispatch } from 'react-redux'
import InvoiceApprovalModal from '../modals/InvoiceApprovalModal';
import CustomerApprovalModal from "../modals/CustomerApprovalModal"


import {addCustomer} from '../../redux/customerSlice'

const AddInvoice = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceToApprove, setInvoiceToApprove] = useState({});
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToApprove, setCustomerToApprove] = useState({});

  const { extractData, loading, error } = useDataExtraction()
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState("")

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFileName(file ? file.name : "")
  }

  const  handleExtract =  () => {
    const file = fileInputRef.current.files[0]
    if (file) {
        extractData(file);

      // result.invoices.forEach((invoice) => {
      //   // setInvoiceToApprove(invoice);
      //   // setIsModalOpen(true);
      //   dispatch(addInvoice(invoice));
      // });
      // result.customers.forEach((customer) => {
      //   console.log("customer",customer)
      //   setCustomerToApprove(customer);
      //   setIsCustomerModalOpen(true);
      // });
    }
  }

  const handleApproveInvoice = (approvedInvoice) => {
    dispatch(addInvoice(approvedInvoice));
    setIsModalOpen(false);
  };

  const handleApproveCustomer = (approvedCustomer) => {
    dispatch(addCustomer(approvedCustomer));
    setIsCustomerModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Invoice</h1>
      {/* <InvoiceApprovalModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        invoice={invoiceToApprove}
        onApprove={handleApproveInvoice}
      /> */}
      {/* <CustomerApprovalModal
        isOpen={isCustomerModalOpen}
        onRequestClose={() => setIsCustomerModalOpen(false)}
        customer={customerToApprove}
        onApprove={handleApproveCustomer}
      /> */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Invoice
          </label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <label
              htmlFor="file-upload"
              className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        {fileName && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{fileName}</span>
          </div>
        )}
        <button
          onClick={handleExtract}
          disabled={loading || !fileName}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            (loading || !fileName) && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Extract Data
            </>
          )}
        </button>
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddInvoice