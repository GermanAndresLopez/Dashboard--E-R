"use client"

import { BarChart3, TrendingUp, AlertTriangle, Zap, FileText } from "lucide-react"
import { useState } from "react"
import { generarReportePDF } from "../services/reporteService"
import { toast } from "react-toastify"

const Dashboard = () => {
  const [generandoReporte, setGenerandoReporte] = useState(false)

  const handleGenerarReporte = async () => {
    setGenerandoReporte(true)
    try {
      await generarReportePDF()
      toast.success("📄 Reporte PDF generado y descargado exitosamente")
    } catch (error) {
      console.error("Error al generar reporte:", error)
      toast.error("Base de datos desconectada, no se puede generar el reporte")
    } finally {
      setGenerandoReporte(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{ display: "flex", justifyContent: "right", alignItems: "flex-start", marginBottom: "1rem" }}
          >
            

            {/* Botón Generar Reportes */}
            <button
              onClick={handleGenerarReporte}
              disabled={generandoReporte}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: generandoReporte ? "#d1d5db" : "#dc2626",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: generandoReporte ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                if (!generandoReporte) {
                  e.target.style.backgroundColor = "#b91c1c"
                  e.target.style.transform = "translateY(-1px)"
                  e.target.style.boxShadow = "0 6px 8px -1px rgba(0, 0, 0, 0.15)"
                }
              }}
              onMouseLeave={(e) => {
                if (!generandoReporte) {
                  e.target.style.backgroundColor = "#dc2626"
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }
              }}
            >
              {generandoReporte ? (
                <>
                  <div
                    style={{
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Generando...
                </>
              ) : (
                <>
                  <FileText style={{ height: "1rem", width: "1rem" }} />
                  Generar Reportes
                </>
              )}
            </button>
          </div>
        </div>

        {/* PowerBI Dashboard */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          
          <div style={{ padding: "1.5rem" }}>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <iframe title="segundo2dash" width="100%" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiYWFhMDI0ZmMtZjc2Ny00NmZiLWExZTgtMTI3OTdiYWQ3YTkyIiwidCI6IjZjYTM0YWUxLTQ2NmYtNDRiYy1hN2FhLTBhYzVhNzhjNjFiMSIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
