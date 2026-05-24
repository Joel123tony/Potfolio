import { GoogleGenerativeAI } from "@google/generative-ai"

const resumeSummary =
  "Joel Jebasingh J is based in Chennai, India. Phone: 8939386459. Email: joeljebasingh0@gmail.com. Portfolio: https://joelpotfolio1.netlify.app/. He is an aspiring Full-Stack Developer, Game Developer, and Creative Designer. Education: BCA Computer Applications from Mar Gregorios College of Arts and Science, Chennai, 2025, 60.25%; Higher Secondary from Daniel Thomas Matriculation HSS, Chennai, 2022, 52.33%; Secondary from Daniel Thomas Matriculation HSS, Chennai, 2020, 43.8%. Skills: HTML5, CSS, JavaScript, responsive design, Python, MySQL, MongoDB, Roblox Studio, Unreal Engine 5, Photoshop, Premiere Pro, After Effects, Blender 3D animation basics, and MS Office. Projects: responsive websites and UI practice projects, Roblox Obby game with checkpoints and UI systems, simulator-style game concept, UE5 FPS prototype, UE5 cinematic environment design, video editing, motion graphics, posters, and thumbnails. Strengths: fast learner, creativity, problem solving, and adaptability."

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

  if (question.includes("phone") || question.includes("number") || question.includes("mobile")) {
    return "Joel's phone number on the resume is 8939386459, and his email is joeljebasingh0@gmail.com."
  }

  if (question.includes("education") || question.includes("college") || question.includes("bca") || question.includes("percentage") || question.includes("school")) {
    return "Joel studied BCA Computer Applications at Mar Gregorios College of Arts and Science, Chennai, graduating in 2025 with 60.25%. His 12th percentage is 52.33%, and his 10th percentage is 43.8% from Daniel Thomas Matriculation HSS."
  }

  if (question.includes("project") || question.includes("work")) {
    return "Joel's resume projects include responsive websites, UI practice projects, a Roblox Obby with checkpoints and UI systems, a simulator-style game concept, UE5 FPS prototype, UE5 cinematic environment design, video edits, posters, thumbnails, and motion graphics."
  }

  if (question.includes("edit") || question.includes("video") || question.includes("reel")) {
    return "Joel creates cinematic video edits, smooth transitions, and creative reels. His editing style is focused on motion, timing, and storytelling."
  }

  if (question.includes("skill") || question.includes("build") || question.includes("developer") || question.includes("website")) {
    return "Joel's skills include HTML5, CSS, JavaScript, responsive design, Python, MySQL, MongoDB, Roblox Studio, Unreal Engine 5, Photoshop, Premiere Pro, After Effects, Blender basics, MS Office, and React website work."
  }

  if (question.includes("resume") || question.includes("cv")) {
    return resumeSummary
  }

  if (question.includes("strength") || question.includes("good at")) {
    return "Joel's resume strengths are fast learning, creativity, problem solving, and adaptability."
  }

  if (question.includes("ai") || question.includes("prompt")) {
    return "Joel is up to date with AI knowledge and knows how to use AI tools for ideas, research, content, coding help, and faster creative work."
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
- Phone: 8939386459
- Location: Chennai, India
- Portfolio: https://joelpotfolio1.netlify.app/
- Professional summary: aspiring Full-Stack Developer, Game Developer, and Creative Designer skilled in web development, game design, and multimedia production
- Education: BCA Computer Applications at Mar Gregorios College of Arts and Science, Chennai (2025), 60.25%; Higher Secondary at Daniel Thomas Matriculation HSS, Chennai (2022), 52.33%; Secondary at Daniel Thomas Matriculation HSS, Chennai (2020), 43.8%
- Resume skills: HTML5, CSS, JavaScript, responsive design, Python, MySQL, MongoDB, Roblox Studio, Unreal Engine 5, Photoshop, Premiere Pro, After Effects, Blender 3D Animation Basics, MS Office
- Resume projects: responsive websites and UI practice projects; Roblox Obby game with checkpoints and UI systems; simulator-style game concept with upgrade and collection mechanics; UE5 FPS prototype with basic shooting system; UE5 cinematic environment design with lighting and terrain; video editing, motion graphics, posters, and thumbnails
- Strengths: fast learner, creativity, problem solving, adaptability
- AI knowledge: Joel is up to date with AI knowledge and knows how to use AI tools for ideas, research, content, coding help, and faster creative work

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
