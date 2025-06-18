"use client"

import { useState } from "react"
import { agregarRegistro } from "../services/registroApi"
import { toast } from "react-toastify"
import { Save, AlertTriangle } from "lucide-react"

const FormularioRegistro = () => {
  const [formData, setFormData] = useState({
    Fecha: "",
    Temperatura_C: "",
    Voltaje_V: "",
    Eficiencia_Porcentaje: "",
    Alarma: 0,
    Tipo_Alarma: "",
    Alarma_Calculada: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await agregarRegistro(formData)
      toast.success(data.message)
      if (data.alerta) toast.warn(data.alerta)

      // Reset form
      setFormData({
        Fecha: "",
        Temperatura_C: "",
        Voltaje_V: "",
        Eficiencia_Porcentaje: "",
        Alarma: 0,
        Tipo_Alarma: "",
        Alarma_Calculada: 0,
      })
    } catch (error) {
      toast.error("Error al agregar registro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingresar Registro</h1>
          <p className="text-gray-600">Añade nuevos datos de sensores al sistema</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input
                  name="Fecha"
                  type="date"
                  value={formData.Fecha}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Temperatura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura (°C)</label>
                <input
                  name="Temperatura_C"
                  type="number"
                  step="0.1"
                  value={formData.Temperatura_C}
                  onChange={handleChange}
                  placeholder="Ej: 25.5"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Voltaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voltaje (V)</label>
                <input
                  name="Voltaje_V"
                  type="number"
                  step="0.1"
                  value={formData.Voltaje_V}
                  onChange={handleChange}
                  placeholder="Ej: 12.5"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Eficiencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eficiencia (%)</label>
                <input
                  name="Eficiencia_Porcentaje"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.Eficiencia_Porcentaje}
                  onChange={handleChange}
                  placeholder="Ej: 85.2"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Alarma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alarma</label>
                <select
                  name="Alarma"
                  value={formData.Alarma}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Sin alarma</option>
                  <option value={1}>Con alarma</option>
                </select>
              </div>

              {/* Tipo de Alarma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Alarma</label>
                <input
                  name="Tipo_Alarma"
                  type="text"
                  value={formData.Tipo_Alarma}
                  onChange={handleChange}
                  placeholder="Ej: Temperatura alta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Alarma Calculada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alarma Calculada</label>
              <select
                name="Alarma_Calculada"
                value={formData.Alarma_Calculada}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Sin alarma calculada</option>
                <option value={1}>Con alarma calculada</option>
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Información importante</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Asegúrate de que todos los valores sean correctos antes de enviar. Los datos se procesarán
                    automáticamente para detectar anomalías.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Agregar Registro
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormularioRegistro
