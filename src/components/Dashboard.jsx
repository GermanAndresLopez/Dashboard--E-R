import { BarChart3, TrendingUp, AlertTriangle, Zap } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de sensores industriales</p>
        </div>

        {/* PowerBI Dashboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard de Análisis</h2>
            <p className="text-sm text-gray-600">Visualización de datos en tiempo real</p>
          </div>
          <div className="p-6">
            <div className="w-full overflow-x-auto">
              <iframe
                title="HACKATON"
                width="100%"
                height="800"
                src="https://app.powerbi.com/view?r=eyJrIjoiNzBjYmNjNGItMzNlYS00ZjZmLTlmMWQtMTQ2NzZiYjY5OWYxIiwidCI6IjZjYTM0YWUxLTQ2NmYtNDRiYy1hN2FhLTBhYzVhNzhjNjFiMSIsImMiOjR9"
                frameBorder="0"
                allowFullScreen={true}
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
