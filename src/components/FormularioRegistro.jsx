
import { useState } from "react"
import { registrarProduccion } from "../actions/chat-actions"

const FormularioRegistro = () => {
  const [formData, setFormData] = useState({
    departamento: "",
    tecnologia: "",
    produccion_mwh: "",
    fecha: "",
    año: "",
    mes: "",
    día: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await registrarProduccion(formData)
      if (res.success) {
        alert("Registro agregado exitosamente")
        setFormData({
          departamento: "",
          tecnologia: "",
          produccion_mwh: "",
          fecha: "",
          año: "",
          mes: "",
          día: "",
        })
      } else {
        alert(res.error || "Error al agregar registro")
      }
    } catch (error) {
      alert("Error al agregar registro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <div style={{ maxWidth: "32rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "1rem" }}>
          Registro de Producción Energética
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="departamento"
            type="text"
            value={formData.departamento}
            onChange={handleChange}
            placeholder="Departamento"
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            name="tecnologia"
            type="text"
            value={formData.tecnologia}
            onChange={handleChange}
            placeholder="Tecnología"
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            name="produccion_mwh"
            type="number"
            step="0.01"
            value={formData.produccion_mwh}
            onChange={handleChange}
            placeholder="Producción (MWh)"
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            name="año"
            type="number"
            value={formData.año}
            onChange={handleChange}
            placeholder="Año"
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            name="mes"
            type="number"
            value={formData.mes}
            onChange={handleChange}
            placeholder="Mes"
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            name="día"
            type="number"
            value={formData.día}
            onChange={handleChange}
            placeholder="Día"
            required
            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#d1d5db" : "#16a34a",
              color: "white",
              fontWeight: "500",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {isLoading ? "Guardando..." : "Agregar Registro"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormularioRegistro
