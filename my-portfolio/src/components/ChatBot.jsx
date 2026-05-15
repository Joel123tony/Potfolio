import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FiMessageCircle, FiSend, FiX, FiZap } from "react-icons/fi"

const starterMessages = [
  {
    role: "bot",
    text: "Hi, I am Joel's AI assistant. Ask me about his skills, projects, edits, or how to contact him.",
  },
]

const quickPrompts = [
  "What can Joel build?",
  "Joel mail id?",
  "Show his projects",
]

function getLocalReply(text) {
  const question = text.toLowerCase()
  const asksContact = [
    "contact",
    "email",
    "mail",
    "mail id",
    "gmail",
    "id",
    "hire",
    "reach",
    "message",
  ].some((word) => question.includes(word))

  if (asksContact) {
    return "Sure. Joel's mail ID is joeljebasingh0@gmail.com. You can message him there for website work, video editing, 3D projects, or collaborations."
  }

  if (question.includes("project") || question.includes("work")) {
    return "Joel has three main project areas here: cinematic video edits, a responsive e-commerce website, and 3D creative visuals. The Projects section has the links to view them."
  }

  if (question.includes("edit") || question.includes("video") || question.includes("reel")) {
    return "Joel creates cinematic video edits, smooth transitions, and creative reels. His editing style is focused on motion, timing, and storytelling."
  }

  if (question.includes("skill") || question.includes("build") || question.includes("developer") || question.includes("website")) {
    return "Joel can build modern React websites and portfolio-style experiences. He also works with Node.js, MongoDB, frontend design, Premiere Pro, After Effects, and Blender."
  }

  if (question.includes("resume") || question.includes("cv")) {
    return "You can view or download Joel's resume from the buttons in the home section of this portfolio."
  }

  if (question.includes("who") || question.includes("about")) {
    return "Joel is a creative developer, video editor, and 3D artist. He mixes frontend development with cinematic editing and visual design."
  }

  return "I can help with that. Joel is a creative developer, video editor, and 3D artist. Ask me about his mail ID, projects, skills, resume, or editing work."
}

function getSectionTarget(text) {
  const question = text.toLowerCase()

  if (question.includes("project") || question.includes("work") || question.includes("portfolio")) {
    return "projects"
  }

  if (
    question.includes("contact") ||
    question.includes("email") ||
    question.includes("mail") ||
    question.includes("gmail") ||
    question.includes("hire") ||
    question.includes("reach")
  ) {
    return "contact"
  }

  if (question.includes("skill") || question.includes("tool") || question.includes("technology")) {
    return "skills"
  }

  if (question.includes("video") || question.includes("reel") || question.includes("edit") || question.includes("media")) {
    return "media"
  }

  if (question.includes("about") || question.includes("who is joel")) {
    return "about"
  }

  if (question.includes("home") || question.includes("top")) {
    return "home"
  }

  return null
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState(starterMessages)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const apiUrl = useMemo(() => {
    return import.meta.env.VITE_CHAT_API_URL || "/.netlify/functions/chat"
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat, loading, isOpen])

  const sendMessage = async (text = message) => {
    const cleanMessage = text.trim()
    const sectionTarget = getSectionTarget(cleanMessage)

    if (!cleanMessage || loading) return

    const userMessage = {
      role: "user",
      text: cleanMessage,
    }

    setChat((prev) => [...prev, userMessage])
    setMessage("")
    setLoading(true)

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
        }),
      })

      if (!res.ok) {
        throw new Error("Chat request failed")
      }

      const data = await res.json()

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply || getLocalReply(cleanMessage),
        },
      ])
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: getLocalReply(cleanMessage),
        },
      ])
    } finally {
      setLoading(false)

      if (sectionTarget) {
        window.setTimeout(() => {
          document.getElementById(sectionTarget)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
          setIsOpen(false)
        }, 850)
      }
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-[60] sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#050505]/95 text-white shadow-[0_0_55px_rgba(212,175,55,0.2)] backdrop-blur-xl sm:w-[390px]"
          >
            <div className="relative overflow-hidden border-b border-white/10 bg-[#111111] px-4 py-4">
              <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#D4AF37]/20 blur-3xl"></div>
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]">
                    <FiZap aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-wide">Joel AI Assistant</h2>
                    <p className="text-xs text-gray-400">Portfolio guide</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-gray-300 transition duration-300 hover:border-[#D4AF37]/70 hover:text-[#D4AF37]"
                  aria-label="Close chat"
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="h-[360px] space-y-4 overflow-y-auto px-4 py-5 text-sm">
              {chat.map((msg, index) => (
                <motion.div
                  key={`${msg.role}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-[#D4AF37] text-black shadow-[0_0_22px_rgba(212,175,55,0.25)]"
                        : "rounded-bl-md border border-white/10 bg-white/[0.06] text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-[#D4AF37]">
                    <span className="chat-dot"></span>
                    <span className="chat-dot animation-delay-150"></span>
                    <span className="chat-dot animation-delay-300"></span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            <div className="border-t border-white/10 bg-black/70 p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                    className="shrink-0 rounded-full border border-[#D4AF37]/30 px-3 py-2 text-xs text-gray-300 transition duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#111111] p-2 focus-within:border-[#D4AF37]/70">
                <textarea
                  rows="1"
                  value={message}
                  placeholder="Ask about Joel..."
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!message.trim() || loading}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4AF37] text-black transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  aria-label="Send message"
                >
                  <FiSend aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37] text-black shadow-[0_0_35px_rgba(212,175,55,0.45)] transition duration-300"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.18 }}
          >
            {isOpen ? <FiX size={22} aria-hidden="true" /> : <FiMessageCircle size={23} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
