import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FiDownload, FiExternalLink, FiMessageCircle, FiSend, FiX, FiZap } from "react-icons/fi"

const starterMessages = [
  {
    role: "bot",
    text: "Hey, I am Joel's AI assistant. I can answer questions, guide you around the site, or help you contact Joel.",
    actions: [
      { label: "View Projects", type: "scroll", target: "projects" },
      { label: "Contact Joel", type: "scroll", target: "contact" },
    ],
  },
]

const quickPrompts = [
  "Can I see projects?",
  "How can I hire Joel?",
  "What edits can he do?",
]

const sectionWords = {
  projects: ["project", "projects", "portfolio", "work", "works", "showcase", "see"],
  contact: ["contact", "email", "mail", "gmail", "hire", "reach", "message", "call"],
  skills: ["skill", "skills", "tool", "tools", "technology", "tech", "stack", "software"],
  media: ["video", "reel", "edit", "editing", "media", "showreel", "cinematic"],
  about: ["about", "who", "intro", "introduction", "joel"],
  home: ["home", "top", "start", "hero"],
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word))
}

function getSectionTarget(text) {
  const question = text.toLowerCase()

  if (hasAny(question, sectionWords.projects)) return "projects"
  if (hasAny(question, sectionWords.contact)) return "contact"
  if (hasAny(question, sectionWords.skills)) return "skills"
  if (hasAny(question, sectionWords.media)) return "media"
  if (question.includes("about") || question.includes("who is joel")) return "about"
  if (hasAny(question, sectionWords.home)) return "home"

  return null
}

function getActionsForMessage(text, reply = "") {
  const combined = `${text} ${reply}`.toLowerCase()
  const actions = []

  if (hasAny(combined, sectionWords.projects)) {
    actions.push({ label: "View Projects", type: "scroll", target: "projects" })
  }

  if (hasAny(combined, sectionWords.contact)) {
    actions.push({ label: "Contact Joel", type: "scroll", target: "contact" })
    actions.push({ label: "Send Email", type: "link", href: "mailto:joeljebasingh0@gmail.com" })
  }

  if (hasAny(combined, sectionWords.skills)) {
    actions.push({ label: "View Skills", type: "scroll", target: "skills" })
  }

  if (hasAny(combined, sectionWords.media)) {
    actions.push({ label: "Watch Reel", type: "scroll", target: "media" })
  }

  if (combined.includes("resume") || combined.includes("cv")) {
    actions.push({ label: "Download Resume", type: "link", href: "/resume.pdf", icon: "download" })
  }

  if (combined.includes("instagram")) {
    actions.push({ label: "Open Instagram", type: "link", href: "https://www.instagram.com/lara._.editz._/" })
  }

  return actions.slice(0, 3)
}

function getLocalReply(text) {
  const question = text.toLowerCase()

  if (["hi", "hello", "hey", "yo"].some((word) => question.trim() === word || question.startsWith(`${word} `))) {
    return "Hey. I am here with you. Ask me anything about Joel's projects, skills, editing work, resume, or contact details."
  }

  if (question.includes("thank")) {
    return "You're welcome. I can also take you straight to Joel's projects, reel, resume, or contact section."
  }

  if (hasAny(question, sectionWords.contact) || question.includes("mail id") || question.includes("id")) {
    return "Sure. Joel's mail ID is joeljebasingh0@gmail.com. You can message him there for website work, video editing, 3D projects, or collaborations."
  }

  if (hasAny(question, sectionWords.projects)) {
    return "Yes. Joel has cinematic video edits, a responsive e-commerce website, and 3D creative visuals. I can take you to the Projects section now."
  }

  if (hasAny(question, sectionWords.media)) {
    return "Joel creates cinematic edits, reels, transitions, and story-driven video work. The featured reel section is the best place to see his editing style."
  }

  if (hasAny(question, sectionWords.skills)) {
    return "Joel's main stack is React, Node.js, MongoDB, frontend design, Premiere Pro, After Effects, Blender, OBS Studio, and creative production tools."
  }

  if (question.includes("resume") || question.includes("cv")) {
    return "Joel's resume is available from the home section. You can view it in the browser or download it directly."
  }

  if (question.includes("price") || question.includes("cost") || question.includes("budget")) {
    return "Pricing depends on the project size and deadline. The easiest next step is to email Joel with what you need, your timeline, and any references."
  }

  if (question.includes("who") || question.includes("about")) {
    return "Joel is a creative developer, video editor, and 3D artist. His style mixes clean React websites with cinematic editing and visual design."
  }

  return "I can answer that best if you ask it around Joel's portfolio, projects, skills, video editing, resume, or contact details. You can also ask me to take you to any section."
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

  const scrollToSection = (target, shouldClose = true) => {
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    if (shouldClose) {
      window.setTimeout(() => setIsOpen(false), 350)
    }
  }

  const handleAction = (action) => {
    if (action.type === "scroll") {
      scrollToSection(action.target)
      return
    }

    if (action.type === "prompt") {
      sendMessage(action.prompt)
      return
    }

    window.open(action.href, action.href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer")
  }

  const sendMessage = async (text = message) => {
    const cleanMessage = text.trim()
    const sectionTarget = getSectionTarget(cleanMessage)

    if (!cleanMessage || loading) return

    const userMessage = {
      role: "user",
      text: cleanMessage,
    }
    const nextChat = [...chat, userMessage]

    setChat(nextChat)
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
          history: nextChat.slice(-8).map(({ role, text }) => ({ role, text })),
        }),
      })

      if (!res.ok) {
        throw new Error("Chat request failed")
      }

      const data = await res.json()
      const botText = data.reply || getLocalReply(cleanMessage)

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: botText,
          actions: data.actions?.length ? data.actions : getActionsForMessage(cleanMessage, botText),
        },
      ])
    } catch {
      const botText = getLocalReply(cleanMessage)

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: botText,
          actions: getActionsForMessage(cleanMessage, botText),
        },
      ])
    } finally {
      setLoading(false)

      if (sectionTarget) {
        window.setTimeout(() => scrollToSection(sectionTarget), 950)
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
            className="mb-4 w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#050505]/95 text-white shadow-[0_0_55px_rgba(212,175,55,0.2)] backdrop-blur-xl sm:w-[410px]"
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
                    <p className="text-xs text-gray-400">Natural answers + site actions</p>
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

            <div className="h-[380px] space-y-4 overflow-y-auto px-4 py-5 text-sm">
              {chat.map((msg, index) => (
                <motion.div
                  key={`${msg.role}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[86%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-md bg-[#D4AF37] text-black shadow-[0_0_22px_rgba(212,175,55,0.25)]"
                          : "rounded-bl-md border border-white/10 bg-white/[0.06] text-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.role === "bot" && msg.actions?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.actions.map((action) => (
                          <button
                            key={`${index}-${action.label}`}
                            type="button"
                            onClick={() => handleAction(action)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3 py-1.5 text-xs text-[#D4AF37] transition duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                          >
                            {action.icon === "download" ? <FiDownload aria-hidden="true" /> : <FiExternalLink aria-hidden="true" />}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
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
                  placeholder="Ask naturally..."
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
