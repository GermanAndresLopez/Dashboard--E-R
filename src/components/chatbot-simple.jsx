"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { enviarMensaje } from "../actions/chat-actions"

export default function ChatbotSimple() {
  const [isOpen, setIsOpen] = useState(false)
  const [mensajes, setMensajes] = useState([
    {
      id: "1",
      role: "assistant",
      content: "¡Hola! Soy tu asistente para consultar datos de sensores. Pregúntame sobre la información disponible.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensajes])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const nuevoMensajeUsuario = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMensajes((prev) => [...prev, nuevoMensajeUsuario])
    setInputValue("")
    setIsLoading(true)

    try {
      const historialReciente = mensajes.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const resultado = await enviarMensaje(inputValue.trim(), historialReciente)

      const respuestaBot = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: resultado.success ? resultado.respuesta : resultado.error,
        timestamp: new Date(),
      }

      setMensajes((prev) => [...prev, respuestaBot])
    } catch (error) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, ocurrió un error. Por favor, intenta de nuevo.",
        timestamp: new Date(),
      }
      setMensajes((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const limpiarChat = () => {
    setMensajes([
      {
        id: "1",
        role: "assistant",
        content:
          "¡Hola! Soy tu asistente para consultar datos de sensores. Pregúntame sobre la información disponible.",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante del bot */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl transition-all duration-300 hover:scale-110 group flex items-center justify-center"
        >
          <MessageCircle className="h-7 w-7 text-white group-hover:animate-pulse" />
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="w-96 h-[500px] bg-white rounded-lg shadow-2xl border-0 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Asistente de Sensores</h3>
                  <p className="text-xs text-blue-100">En línea</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={limpiarChat}
                  className="h-8 w-8 text-white hover:bg-white/20 rounded transition-colors flex items-center justify-center"
                  title="Limpiar chat"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={toggleChat}
                  className="h-8 w-8 text-white hover:bg-white/20 rounded transition-colors flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Área de mensajes */}
          <div className="flex flex-col h-[420px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`flex gap-3 ${mensaje.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {mensaje.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                      mensaje.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
                    }`}
                  >
                    {mensaje.content}
                  </div>
                  {mensaje.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Área de input */}
            <div className="border-t bg-white p-4 rounded-b-lg">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Pregunta sobre los sensores..."
                  disabled={isLoading}
                  maxLength={200}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">Respuestas basadas en datos reales de sensores</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
