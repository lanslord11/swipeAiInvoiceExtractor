import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function Invoices() {
  const invoices = useSelector((state) => state.invoices.invoices)
  const [expandedInvoices, setExpandedInvoices] = useState(new Set())

  const toggleInvoice = (serialNumber) => {
    setExpandedInvoices((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(serialNumber)) {
        newSet.delete(serialNumber)
      } else {
        newSet.add(serialNumber)
      }
      return newSet
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Invoices</h1>
      {invoices.map((invoice) => (
        <div key={invoice.serial_number} className="bg-white shadow-md rounded-lg mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Invoice {invoice.serial_number}</h2>
              <button
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                onClick={() => toggleInvoice(invoice.serial_number)}
                aria-expanded={expandedInvoices.has(invoice.serial_number)}
                aria-controls={`invoice-${invoice.serial_number}-content`}
              >
                {expandedInvoices.has(invoice.serial_number) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {expandedInvoices.has(invoice.serial_number) ? 'Collapse' : 'Expand'} invoice details
                </span>
              </button>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Customer ID: {invoice.customer_id}</span>
              <span>Date: {formatDate(invoice.date)}</span>
            </div>
            <div className="font-semibold text-lg mt-2 text-gray-800">
              Total Amount: {formatCurrency(invoice.total_amount)}
            </div>
          </div>
          {expandedInvoices.has(invoice.serial_number) && (
            <div id={`invoice-${invoice.serial_number}-content`} className="p-4">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3 text-right">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-right">Unit Price</th>
                    <th scope="col" className="px-6 py-3 text-right">Tax</th>
                    <th scope="col" className="px-6 py-3 text-right">Price with Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.products.map((product, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 text-right">{product.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(product.unit_price)}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(product.tax)}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(product.price_with_tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}