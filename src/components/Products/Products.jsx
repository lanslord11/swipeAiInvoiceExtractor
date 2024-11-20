import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";

export default function Products() {
  const invoices = useSelector((state) => state.invoices.invoices);
  const [searchTerm, setSearchTerm] = useState("");

  const allProducts = useMemo(() => {
    return invoices.flatMap((invoice) => invoice.products);
  }, [invoices]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProducts, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>

      <div className="mb-4 relative">
      <input
      type="text"
      placeholder="Search products..."
      className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-800 focus:text-gray-700"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                QTY
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Tax
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Price with Tax
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Discount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {product.name}
                </td>

                <td className="px-6 py-4 text-right">
                  {product.quantity ? product.quantity : "NS"}
                </td>
                <td className="px-6 py-4 text-right">
                  {formatCurrency(product.unit_price)}
                </td>
                <td className="px-6 py-4 text-right">
                  {formatCurrency(product.tax)}
                </td>
                <td className="px-6 py-4 text-right">
                  {formatCurrency(product.price_with_tax)}
                </td>
                <td className="px-6 py-4 text-right">
                  {product.discount ? formatCurrency(product.discount) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No products found.</p>
      )}
    </div>
  );
}
