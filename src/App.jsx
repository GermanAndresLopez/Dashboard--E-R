"use client"

import { useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import CargarCSV from "./components/CargarCSV"
import FormularioRegistro from "./components/FormularioRegistro"
import ChatbotSimple from "./components/chatbot-simple"

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "upload":
        return <CargarCSV />
      case "registro":
        return <FormularioRegistro />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>{renderContent()}</main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ChatbotSimple />
    </div>
  )
}

export default App
