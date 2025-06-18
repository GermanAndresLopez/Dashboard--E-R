"use client"

import { useState } from "react"
import { cargarCSV } from "../services/registroApi"
import { toast } from "react-toastify"
import { Upload, FileText, CheckCircle } from "lucide-react"

const CargarCSV = () => {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error("Selecciona un archivo CSV")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const data = await cargarCSV(formData)
      toast.success(data.message)
      if (data.alertas && data.alertas.length > 0) {
        data.alertas.forEach((alerta) => toast.warn(alerta))
      }
      setFile(null)
    } catch (error) {
      toast.error("Error al cargar CSV")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subir Archivos CSV</h1>
          <p className="text-gray-600">Carga datos de sensores desde archivos CSV</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />

              <div className="space-y-4">
                {file ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-green-700">Archivo seleccionado</p>
                      <p className="text-sm text-green-600">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Arrastra tu archivo CSV aquí</p>
                      <p className="text-sm text-gray-500">o haz clic para seleccionar un archivo</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* File Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Formato requerido</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    El archivo CSV debe contener las columnas: Fecha, Temperatura_C, Voltaje_V, Eficiencia_Porcentaje,
                    Alarma, Tipo_Alarma, Alarma_Calculada
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Subiendo archivo...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Subir CSV
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CargarCSV
