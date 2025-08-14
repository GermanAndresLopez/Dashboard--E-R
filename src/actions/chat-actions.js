import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// 📌 Configuración de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY

// 📌 Configuración de OpenRouter (corregida)
const openrouter = createOpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // Endpoint correcto
})

let cachedContext = null

// 📌 Obtener datos de Supabase y generar contexto
async function obtenerDatosSensores() {
  if (cachedContext) return cachedContext

  try {
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

    const datos = await response.json()
    const columnas = datos.length > 0 ? Object.keys(datos[0]) : []
    const totalRegistros = datos.length
    const muestra = datos.slice(0, 3)

    const producciones = datos
      .map((d) => Number.parseFloat(d.produccion_mwh))
      .filter((v) => !isNaN(v))

    const totalProduccion = producciones.reduce((a, b) => a + b, 0).toFixed(2)
    const departamentos = [...new Set(datos.map((d) => d.departamento).filter(Boolean))]
    const tecnologias = [...new Set(datos.map((d) => d.tecnologia).filter(Boolean))]

    const datosNormalizados = datos.map(d => ({
  departamento: d.departamento?.toLowerCase() || "",
  tecnologia: d.tecnologia || "",
  produccion_mwh: d.produccion_mwh || 0,
  fecha: d.fecha || "",
  año: d.año || "",
  mes: d.mes || "",
  día: d.día || ""
}))

const contexto = `Eres un asistente especializado en análisis de datos de producción energética.
Dispones de los datos completos de la tabla "hackathon" de Supabase.

Reglas:
- Responde exclusivamente usando los datos listados aquí.
- Las comparaciones de "departamento" deben ser insensibles a mayúsculas/minúsculas.
- Para fechas y periodos, usa siempre el campo "fecha" (ignora "created_at").
- Si no existe información para algo, responde claramente que no se encuentra en la base.
- No inventes ni estimes información fuera de lo que está en los registros.
- Todas las cifras deben basarse en la suma o conteo real de los registros.
- Si la pregunta se refiere a un periodo de tiempo, filtra por el campo "fecha".
- No imagines ni supongas datos que no estén en los registros.

📊 Datos completos:
${JSON.stringify(datosNormalizados, null, 2)}
`

    cachedContext = contexto
    return contexto
  } catch (error) {
    console.error("Error al obtener datos de Supabase:", error)
    return "Error al cargar los datos de sensores. Por favor, intenta más tarde."
  }
}

// 📌 Registrar un nuevo dato en Supabase
export async function registrarProduccion({ departamento, tecnologia, produccion_mwh, fecha, año, mes, día }) {
  try {
    const response = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ departamento, tecnologia, produccion_mwh, fecha, año, mes, día }),
    })

    if (!response.ok) {
      throw new Error(`Error al registrar: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error al registrar producción:", error)
    return { success: false, error: "No se pudo registrar la producción." }
  }
}

// 📌 Limpia el pensamiento oculto del modelo
function limpiarPensamiento(texto) {
  return texto.replace(/◁think▷.*?◁\/think▷/gs, "").trim()
}

// 📌 Envía mensaje a la IA con contexto de Supabase
export async function enviarMensaje(mensaje, historial) {
  try {
    const contexto = await obtenerDatosSensores()

    const mensajesCompletos = [
      { role: "system", content: contexto },
      ...historial,
      { role: "user", content: mensaje },
    ]

    const { text } = await generateText({
      model: openrouter.chat("mistralai/mistral-small-3.2-24b-instruct:free"), // ✅ Sintaxis corregida
      messages: mensajesCompletos,
      temperature: 0.2,
      maxTokens: 500,
    })

    return {
      success: true,
      respuesta: limpiarPensamiento(text),
    }
  } catch (error) {
    console.error("Error en el chat:", error)
    return {
      success: false,
      error: "Error al procesar tu mensaje. Por favor, intenta de nuevo.",
    }
  }
}
