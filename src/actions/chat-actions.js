import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const SUPABASE_URL = "https://ydkzcqohevawyuroapbs.supabase.co/rest/v1/sensores"
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlka3pjcW9oZXZhd3l1cm9hcGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjc3MTQsImV4cCI6MjA2NTgwMzcxNH0.h0MlCCfDlVxwHIIqTlGg5SqZj0fPXRnOdKmTHpQ_lMI"

const openrouter = createOpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
})

let cachedContext = null

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

    // Estadísticas de temperatura
    const temperaturas = datos.map((d) => Number.parseFloat(d.temperatura_c)).filter((v) => !isNaN(v))
    const maxTemp = Math.max(...temperaturas)
    const minTemp = Math.min(...temperaturas)
    const avgTemp = (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(2)

    // Estadísticas de voltaje
    const voltajes = datos.map((d) => Number.parseFloat(d.voltaje_v)).filter((v) => !isNaN(v))
    const avgVolt = (voltajes.reduce((a, b) => a + b, 0) / voltajes.length).toFixed(2)

    // Estadísticas de eficiencia
    const eficiencias = datos.map((d) => Number.parseFloat(d.eficiencia_porcentaje)).filter((v) => !isNaN(v))
    const avgEf = (eficiencias.reduce((a, b) => a + b, 0) / eficiencias.length).toFixed(2)

    // Alarmas
    const totalAlarmas = datos.filter((d) => d.alarma == 1).length
    const tiposAlarma = [...new Set(datos.map((d) => d.tipo_alarma).filter(Boolean))]

    const contexto = `Eres un asistente especializado en análisis de datos de sensores industriales.
Responde únicamente basándote en los datos reales extraídos de una base Supabase.

📊 Estadísticas disponibles:
- Total de registros: ${totalRegistros}
- Columnas: ${columnas.join(", ")}

📈 Temperatura (°C):
- Máxima: ${maxTemp}
- Mínima: ${minTemp}
- Promedio: ${avgTemp}

⚡ Voltaje (V):
- Promedio: ${avgVolt}

🛠️ Eficiencia (%):
- Promedio: ${avgEf}

🚨 Alarmas:
- Registros con alarma activa: ${totalAlarmas}
- Tipos de alarma detectados: ${tiposAlarma.join(", ") || "ninguno"}

📌 Muestra de registros:
${JSON.stringify(muestra, null, 2)}

🔎 Instrucciones:
- Responde solo con base en los datos reales mostrados.
- Si no puedes calcular algo, dilo claramente.
- Sé técnico, conciso y en español.
- Si te preguntan por tendencias o comparaciones, responde usando los valores conocidos.
- No inventes ni completes información faltante.`

    cachedContext = contexto
    return contexto
  } catch (error) {
    console.error("Error al obtener datos de Supabase:", error)
    return "Error al cargar los datos de sensores. Por favor, intenta más tarde."
  }
}

function limpiarPensamiento(texto) {
  return texto.replace(/◁think▷.*?◁\/think▷/gs, "").trim()
}

export async function enviarMensaje(mensaje, historial) {
  try {
    const contexto = await obtenerDatosSensores()

    const mensajesCompletos = [{ role: "system", content: contexto }, ...historial, { role: "user", content: mensaje }]

    const { text } = await generateText({
      model: openrouter("mistralai/devstral-small:free"),
      messages: mensajesCompletos,
      temperature: 0.2,
      maxTokens: 300,
    })

    const respuestaLimpia = limpiarPensamiento(text)

    return {
      success: true,
      respuesta: respuestaLimpia,
    }
  } catch (error) {
    console.error("Error en el chat:", error)
    return {
      success: false,
      error: "Error al procesar tu mensaje. Por favor, intenta de nuevo.",
    }
  }
}
