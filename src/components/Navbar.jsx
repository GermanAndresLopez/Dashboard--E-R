"use client"
import { Home, Upload, Plus, BarChart3 } from "lucide-react"

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Inicio", icon: Home },
    { id: "upload", label: "Subir Archivos", icon: Upload },
    { id: "registro", label: "Ingresar Registro", icon: Plus },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Produccion de Energia Renovable - MagicDev 🧙🏻‍♂️</h1>
              <p className="text-xs text-gray-500">Panel de Control</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
