import { GoogleGenerativeAI } from "@google/generative-ai"

const profile = {
  email: "joeljebasingh0@gmail.com",
  instagram: "https://www.instagram.com/lara._.editz._/",
}

const negativeWords = [
  "bad",
  "waste",
  "wast",
  "worst",
  "loser",
  "losser",
  "useless",
  "trash",
  "poor",
  "hate",
]

const positiveWords = [
  "nice",
  "good",
  "great",
  "awesome",
  "amazing",
  "cool",
  "super",
  "best",
  "love",
  "talented",
  "creative",
  "impressive",
]

function includesAny(text, words) {
  return words.some((word) => text.includes(word))
}

function getActions(message, reply = "") {
  const text = `${message} ${reply}`.toLowerCase()
  const actions = []

  if (includesAny(text, ["project", "projects", "portfolio", "work", "works", "showcase"])) {
    actions.push({ label: "View Projects", type: "scroll", target: "projects" })
  }

  if (includesAny(text, ["contact", "email", "mail", "gmail", "hire", "reach", "message"])) {
    actions.push({ label: "Contact Joel", type: "scroll", target: "contact" })
    actions.push({ label: "Send Email", type: "link", href: `mailto:${profile.email}` })
  }

  if (includesAny(text, ["skill", "skills", "tool", "tools", "technology", "stack"])) {
    actions.push({ label: "View Skills", type: "scroll", target: "skills" })
  }

  if (includesAny(text, ["video", "reel", "edit", "editing", "media", "showreel"])) {
    actions.push({ label: "Watch Reel", type: "scroll", target: "media" })
  }

  if (includesAny(text, ["resume", "cv"])) {
    actions.push({ label: "Download Resume", type: "link", href: "/resume.pdf", icon: "download" })
  }

  if (text.includes("instagram")) {
    actions.push({ label: "Open Instagram", type: "link", href: profile.instagram })
  }

  return actions.slice(0, 3)
}

function getPortfolioReply(message) {
  const question = message.toLowerCase()

  if (["hi", "hello", "hey", "yo"].some((word) => question.trim() === word || question.startsWith(`${word} `))) {
    return "Hey. I am here with you. Ask me anything about Joel's projects, skills, editing work, resume, or contact details."
  }

  if (question.includes("thank")) {
    return "You're welcome. I can also take you straight to Joel's projects, reel, resume, or contact section."
  }

  if (question.includes("joel") && includesAny(question, negativeWords)) {
    return "I get what you mean, but I would keep it respectful. Joel is still learning and building his creative skills, and this portfolio shows his progress in web development, video editing, and 3D work."
  }

  if (question.includes("joel") && includesAny(question, positiveWords)) {
    return "That's kind of you to say. Joel will really appreciate that support. He has been putting effort into his websites, edits, and creative projects."
  }

  if (includesAny(question, ["contact", "email", "mail", "mail id", "gmail", "hire", "reach", "message", "id"])) {
    return `Sure. Joel's mail ID is ${profile.email}. You can message him there for website work, video editing, 3D projects, or collaborations.`
  }

  if (includesAny(question, ["project", "projects", "portfolio", "work", "works", "showcase", "see"])) {
    return "Yes. Joel has cinematic video edits, a responsive e-commerce website, and 3D creative visuals. I can take you to the Projects section now."
  }

  if (includesAny(question, ["edit", "editing", "video", "reel", "showreel", "cinematic", "media"])) {
    return "Joel creates cinematic edits, reels, transitions, and story-driven video work. The featured reel section is the best place to see his editing style."
  }

  if (includesAny(question, ["skill", "skills", "build", "developer", "website", "tool", "tools", "tech", "stack"])) {
    return "Joel's main stack is React, Node.js, MongoDB, frontend design, Premiere Pro, After Effects, Blender, OBS Studio, and creative production tools."
  }

  if (includesAny(question, ["resume", "cv"])) {
    return "Joel's resume is available from the home section. You can view it in the browser or download it directly."
  }

  if (includesAny(question, ["price", "cost", "budget", "rate", "charge"])) {
    return "Pricing depends on the project size and deadline. The easiest next step is to email Joel with what you need, your timeline, and any references."
  }

  if (question.includes("who") || question.includes("about")) {
    return "Joel is a creative developer, video editor, and 3D artist. His style mixes clean React websites with cinematic editing and visual design."
  }

  return "I can answer best around Joel's portfolio, projects, skills, video editing, resume, and contact details. Ask naturally, or tell me which section you want to see."
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return []

  return history
    .filter((item) => ["user", "bot"].includes(item.role) && typeof item.text === "string")
    .slice(-8)
    .map((item) => ({
      role: item.role === "bot" ? "assistant" : "user",
      text: item.text.slice(0, 500),
    }))
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: "Please send a POST request." }),
    }
  }

  try {
    const body = JSON.parse(event.body || "{}")
    const message = body.message?.trim()
    const history = sanitizeHistory(body.history)

    if (!message) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "Please type a message first." }),
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      const reply = getPortfolioReply(message)

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, actions: getActions(message, reply) }),
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 220,
      },
    })

    const conversation = history
      .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.text}`)
      .join("\n")

    const prompt = `
You are Joel's AI assistant inside his portfolio website.

Your style:
- Sound natural, warm, and conversational.
- Answer the user's exact question first.
- Keep replies short: usually 1 to 3 sentences.
- If the user asks to see, open, view, or go somewhere, say you can take them there.
- If the user asks something outside Joel's portfolio, answer briefly only if useful, then guide back to Joel.
- If the user insults Joel, stay calm and positive. Do not insult the user. Gently ask for respect and highlight Joel's learning, effort, and creative progress.
- If the user praises Joel, appreciate the user warmly and say Joel would value the support.
- Do not invent links, phone numbers, companies, degrees, clients, or experience not listed below.

Joel's known profile:
- Name: Joel
- Mail ID: ${profile.email}
- Instagram: ${profile.instagram}
- Roles: Creative Developer, React Developer, Video Editor, 3D Artist
- Skills: React, Node.js, MongoDB, frontend development, Premiere Pro, After Effects, Blender, OBS Studio, Roblox Studio, MS Office
- Projects: cinematic video edits, an e-commerce website, and 3D creative projects
- Availability: open for freelance projects and creative collaborations
- Site sections: home, about, skills, projects, media/showreel, contact

Recent conversation:
${conversation || "No previous conversation."}

Current user question:
${message}
`

    const result = await model.generateContent(prompt)
    const reply = result.response.text().trim()

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply, actions: getActions(message, reply) }),
    }
  } catch (error) {
    console.error(error)

    const fallbackReply = getPortfolioReply("")

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: fallbackReply, actions: getActions("", fallbackReply) }),
    }
  }
}
