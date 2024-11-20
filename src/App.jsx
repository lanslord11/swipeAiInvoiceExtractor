import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ShoppingCart, FileText, Upload, Menu } from 'lucide-react';
import AddInvoice from "./components/AddInvoice/AddInvoice";
import Customers from "./components/Customers/Customers.jsx";
import Products from "./components/Products/Products.jsx";
import Invoices from "./components/Invoices/Invoices.jsx";

const tabs = [
  { name: 'Customers', icon: Users, path: "/customers" },
  { name: 'Products', icon: ShoppingCart, path: "/products" },
  { name: 'Invoices', icon: FileText, path: "/invoices" },
  { name: 'Upload Invoice', icon: Upload, path: "/addinvoice" }
];

export default function Component() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <motion.div
        className="w-64 bg-gray-800 p-6 shadow-lg"
        initial={false}
        animate={{ width: isSidebarOpen ? "16rem" : "5rem" }}
      >
        <h1 className={`text-2xl font-bold mb-8 text-center text-cyan-400 ${!isSidebarOpen && "hidden"}`}>
          Data Extraction
        </h1>
        <nav className="space-y-2">
          {tabs.map(({ name, icon: Icon, path }) => (
            <motion.button
              key={name}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                location.pathname === path ? "bg-cyan-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => navigate(path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-2">{name}</span>}
            </motion.button>
          ))}
        </nav>
      </motion.div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-cyan-400">
            {tabs.find(tab => tab.path === location.pathname)?.name || "Home"}
          </h2>
          <div className="w-6" /> {/* Placeholder for symmetry */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/addinvoice" element={<AddInvoice />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products/>} />
                <Route path="/invoices" element={<Invoices/>} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Data Extraction</h1>
      <p className="text-xl text-gray-400">Select a tab to get started</p>
    </div>
  );
}