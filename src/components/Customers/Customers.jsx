import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Search, Phone, CreditCard, User } from 'lucide-react'

export default function Customers() {
  const customers = useSelector((state) => state.customers.customers)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [customers, searchTerm])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Customers</h1>
      
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800 focus:text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.customer_id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{customer.name}</h3>
                <p className="text-sm text-gray-500">ID: {customer.customer_id}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2 text-cyan-500" />
                <span>{customer.phone_number || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CreditCard className="w-5 h-5 mr-2 text-cyan-500" />
                <span>Total Purchase: ${customer.total_purchase_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No customers found.</p>
      )}
    </div>
  )
}