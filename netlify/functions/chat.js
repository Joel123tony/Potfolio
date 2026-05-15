import { GoogleGenerativeAI } from "@google/generative-ai"

function getPortfolioReply(message) {
  const question = message.toLowerCase()
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

    if (!message) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "Please type a message first." }),
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: getPortfolioReply(message) }),
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    })

    const prompt = `
You are Joel's friendly AI portfolio assistant on his personal website.

Answer naturally and directly, like a helpful human assistant. Keep replies short: 1 to 3 sentences.
If the user asks for a specific detail, give that detail first.
Use only the profile details below.

Joel's profile:
- Name: Joel
- Mail ID: joeljebasingh0@gmail.com
- Roles: Creative Developer, React Developer, Video Editor, 3D Artist
- Skills: React, Node.js, MongoDB, frontend development, Premiere Pro, After Effects, Blender, OBS Studio, Roblox Studio, MS Office
- Projects: cinematic video edits, an e-commerce website, and 3D creative projects
- Availability: open for freelance projects and creative collaborations
- Instagram: https://www.instagram.com/lara._.editz._/

User question: ${message}
`

    const result = await model.generateContent(prompt)
    const reply = result.response.text()

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    }
  } catch (error) {
    console.error(error)

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: getPortfolioReply("") }),
    }
  }
}
