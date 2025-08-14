import { jsPDF } from "jspdf"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY

// Función para convertir números de mes a nombres en español
const obtenerNombreMes = (numeroMes) => {
  const meses = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
  }
  return meses[numeroMes] || `Mes ${numeroMes}`
}

const obtenerDatosSensores = async () => {
  const response = await fetch(SUPABASE_URL, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status}`)
  }

  return await response.json()
}

const calcularEstadisticas = (datos) => {
  if (!datos?.length) {
    return {
      totalRegistros: 0,
      produccionTotal: 0,
      produccionPromedio: 0,
      departamentos: [],
      tecnologias: [],
      produccionPorDepartamento: {},
      produccionPorTecnologia: {},
      produccionPorMes: {},
    }
  }

  const producciones = datos.map((d) => Number.parseFloat(d.produccion_mwh) || 0)
  const produccionTotal = producciones.reduce((a, b) => a + b, 0)
  const produccionPromedio = producciones.length ? produccionTotal / producciones.length : 0
  const departamentos = [...new Set(datos.map((d) => d.departamento).filter(Boolean))]
  const tecnologias = [...new Set(datos.map((d) => d.tecnologia).filter(Boolean))]

  const sumBy = (arr, key) =>
    arr.reduce((acc, d) => {
      if (d[key]) acc[d[key]] = (acc[d[key]] || 0) + (Number.parseFloat(d.produccion_mwh) || 0)
      return acc
    }, {})

  return {
    totalRegistros: datos.length,
    produccionTotal,
    produccionPromedio,
    departamentos,
    tecnologias,
    produccionPorDepartamento: sumBy(datos, "departamento"),
    produccionPorTecnologia: sumBy(datos, "tecnologia"),
    produccionPorMes: sumBy(datos, "mes"),
  }
}

export const generarReportePDF = async () => {
  try {
    const datos = await obtenerDatosSensores()
    const estadisticas = calcularEstadisticas(datos)

    const doc = new jsPDF()
    const colorPrimario = [33, 150, 243]
    const colorSecundario = [55, 71, 79]
    const colorFondo = [245, 247, 250]

    const fechaActual = new Date()

    // === PORTADA ===
    doc.setFillColor(...colorPrimario)
    doc.rect(0, 0, 210, 297, "F")
    doc.setFontSize(26)
    doc.setTextColor(255, 255, 255)
    doc.text("REPORTE DE PRODUCCIÓN ENERGÉTICA", 105, 90, { align: "center" })
    doc.setFontSize(14)
    doc.text("Sistema de Monitoreo y Reporte", 105, 110, { align: "center" })
    doc.setFontSize(12)
    doc.text(
      `Generado el ${fechaActual.toLocaleDateString("es-ES")} a las ${fechaActual.toLocaleTimeString("es-ES")}`,
      105,
      130,
      { align: "center" },
    )
    doc.addPage()

    // === RESUMEN ===
    doc.setFontSize(20)
    doc.setTextColor(...colorPrimario)
    doc.text("Resumen Ejecutivo", 20, 20)
    doc.setDrawColor(...colorPrimario)
    doc.setLineWidth(0.8)
    doc.line(20, 22, 190, 22)

    const resumen = [
      `Total registros: ${estadisticas.totalRegistros}`,
      `Producción total: ${estadisticas.produccionTotal.toFixed(2)} MWh`,
      `Producción promedio: ${estadisticas.produccionPromedio.toFixed(2)} MWh`,
      `Departamentos: ${estadisticas.departamentos.join(", ") || "N/A"}`,
      `Tecnologías: ${estadisticas.tecnologias.join(", ") || "N/A"}`,
    ]

    doc.setFontSize(12)
    doc.setTextColor(...colorSecundario)
    let y = 35
    resumen.forEach((line) => {
      doc.roundedRect(20, y - 6, 170, 10, 2, 2, "S")
      doc.text(line, 25, y + 1)
      y += 14
    })

    // === TABLAS AGRUPADAS MEJORADAS ===
    const addTable = (title, data, tipoTabla) => {
      y += 10
      doc.setFontSize(16)
      doc.setTextColor(...colorPrimario)
      doc.text(title, 20, y)
      y += 6
      doc.setDrawColor(...colorPrimario)
      doc.setLineWidth(0.5)
      doc.line(20, y, 190, y)
      y += 6

      // Encabezados de columna en negrillas
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "bold")

      // Determinar el encabezado según el tipo de tabla
      let encabezadoCategoria = "Categoría"
      if (tipoTabla === "departamento") {
        encabezadoCategoria = "Departamento"
      } else if (tipoTabla === "tecnologia") {
        encabezadoCategoria = "Tecnología"
      } else if (tipoTabla === "mes") {
        encabezadoCategoria = "Mes"
      }

      doc.text(encabezadoCategoria, 25, y)
      doc.text("Producción (MWh)", 130, y)
      y += 5
      doc.setFont("helvetica", "normal")

      // Procesar los datos según el tipo de tabla
      let datosParaMostrar = {}
      if (tipoTabla === "mes") {
        // Convertir números de mes a nombres
        Object.entries(data).forEach(([numeroMes, valor]) => {
          const nombreMes = obtenerNombreMes(Number.parseInt(numeroMes))
          datosParaMostrar[nombreMes] = valor
        })
      } else {
        datosParaMostrar = data
      }

      Object.entries(datosParaMostrar).forEach(([k, v], i) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        if (i % 2 === 0) {
          doc.setFillColor(...colorFondo)
          doc.rect(20, y - 4, 170, 6, "F")
        }
        doc.text(k, 25, y)
        doc.text(v.toFixed(2), 130, y)
        y += 6
      })
    }

    // Llamar a las tablas con sus tipos específicos
    addTable("Producción por Departamento", estadisticas.produccionPorDepartamento, "departamento")
    addTable("Producción por Tecnología", estadisticas.produccionPorTecnologia, "tecnologia")
    addTable("Producción por Mes", estadisticas.produccionPorMes, "mes")

    // === DATOS DETALLADOS (últimos 20 registros) ===
    doc.addPage()

    doc.setFontSize(18)
    doc.setTextColor(...colorPrimario)
    doc.text("DATOS DETALLADOS DE PRODUCCIÓN", 20, 30)

    doc.setFontSize(10)
    doc.setTextColor(...colorSecundario)
    doc.text(`Mostrando los últimos 20 registros de ${estadisticas.totalRegistros} totales`, 20, 45)

    let yPos = 60

    // Encabezados de la tabla de datos
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Fecha", 20, yPos)
    doc.text("Departamento", 55, yPos)
    doc.text("Tecnología", 95, yPos)
    doc.text("Producción (MWh)", 135, yPos)
    doc.text("Año", 170, yPos)
    doc.text("Mes", 185, yPos)

    // Línea separadora
    doc.setDrawColor(...colorPrimario)
    doc.line(15, yPos + 2, 195, yPos + 2)

    yPos += 10
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)

    // Datos detallados (últimos 20 registros)
    const datosLimitados20 = datos.slice(-20)

    datosLimitados20.forEach((registro, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 30

        // Repetir encabezados en nueva página
        doc.setFont("helvetica", "bold")
        doc.setFontSize(10)
        doc.text("Fecha", 20, yPos)
        doc.text("Departamento", 55, yPos)
        doc.text("Tecnología", 95, yPos)
        doc.text("Producción (MWh)", 135, yPos)
        doc.text("Año", 170, yPos)
        doc.text("Mes", 185, yPos)

        doc.setDrawColor(...colorPrimario)
        doc.line(15, yPos + 2, 195, yPos + 2)
        yPos += 10
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
      }

      // Color de fila alternado
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(15, yPos - 3, 180, 8, "F")
      }

      doc.setTextColor(0, 0, 0)

      const fecha = registro.fecha ? new Date(registro.fecha).toLocaleDateString("es-ES") : "N/A"
      const nombreMes = registro.mes ? obtenerNombreMes(Number.parseInt(registro.mes)) : "N/A"

      doc.text(fecha, 20, yPos)
      doc.text((registro.departamento || "N/A").toString(), 55, yPos)
      doc.text((registro.tecnologia || "N/A").toString(), 95, yPos)
      doc.text((registro.produccion_mwh || "N/A").toString(), 135, yPos)
      doc.text((registro.año || "N/A").toString(), 170, yPos)
      doc.text(nombreMes, 185, yPos)

      yPos += 8
    })

    // === PIE DE PÁGINA ===
    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(...colorSecundario)
      doc.line(20, 285, 190, 285)
      doc.text(`Página ${i} de ${totalPages}`, 20, 292)
      doc.text("Sistema de Monitoreo Energético", 105, 292, { align: "center" })
      doc.text(`Generado: ${fechaActual.toLocaleDateString("es-ES")}`, 190, 292, { align: "right" })
    }

    const nombreArchivo = `reporte_energia_${fechaActual.toISOString().split("T")[0]}.pdf`
    doc.save(nombreArchivo)
    return { success: true, archivo: nombreArchivo }
  } catch (err) {
    console.error("Error al generar PDF:", err)
    throw err
  }
}
