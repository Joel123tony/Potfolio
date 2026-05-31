import { GoogleGenerativeAI } from "@google/generative-ai"

const resumeSummary =
  "Joel Jebasingh J is based in Chennai, India. Phone: 8939386459. Email: joeljebasingh0@gmail.com. Portfolio: https://joelpotfolio1.netlify.app/. He is an aspiring Full-Stack Developer, Game Developer, and Creative Designer. Education: BCA Computer Applications from Mar Gregorios College of Arts and Science, Chennai, 2025, 60.25%; Higher Secondary from Daniel Thomas Matriculation HSS, Chennai, 2022, 52.33%; Secondary from Daniel Thomas Matriculation HSS, Chennai, 2020, 43.8%. Skills: HTML5, CSS, JavaScript, responsive design, Python, MySQL, MongoDB, Roblox Studio, Unreal Engine 5, Photoshop, Premiere Pro, After Effects, Blender 3D animation basics, and MS Office. Projects: responsive websites and UI practice projects, Roblox Obby game with checkpoints and UI systems, simulator-style game concept, UE5 FPS prototype, UE5 cinematic environment design, video editing, motion graphics, posters, and thumbnails. Strengths: fast learner, creativity, problem solving, and adaptability."

const latestOnePieceEpisodeReply =
  "The latest One Piece anime episode is Episode 1164, titled \"Saul's Resolve - The Inherited Will of Ohara.\" It released on May 31, 2026."

const ONE_PIECE_WIKI_API = "https://onepiece.fandom.com/api.php"

function stripWikiMarkup(text = "") {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function fetchOnePieceWikiContext(message) {
  const searchParams = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    list: "search",
    srlimit: "1",
    srsearch: message,
  })

  const searchResponse = await fetch(`${ONE_PIECE_WIKI_API}?${searchParams}`)

  if (!searchResponse.ok) return null

  const searchData = await searchResponse.json()
  const bestMatch = searchData.query?.search?.[0]

  if (!bestMatch?.pageid) return null

  const pageParams = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    pageids: String(bestMatch.pageid),
    prop: "extracts|info",
    exintro: "1",
    explaintext: "1",
    inprop: "url",
    redirects: "1",
  })

  const pageResponse = await fetch(`${ONE_PIECE_WIKI_API}?${pageParams}`)

  if (!pageResponse.ok) return null

  const pageData = await pageResponse.json()
  const page = pageData.query?.pages?.[bestMatch.pageid]

  if (!page?.extract) return null

  return {
    title: page.title,
    url: page.fullurl,
    extract: stripWikiMarkup(page.extract).slice(0, 1600),
  }
}

function isOnePieceQuestion(question) {
  return [
    "one piece",
    "onepiece",
    "luffy",
    "zoro",
    "sanji",
    "nami",
    "usopp",
    "chopper",
    "robin",
    "franky",
    "brook",
    "jinbe",
    "straw hat",
    "strawhat",
    "grand line",
    "devil fruit",
    "pirate king",
    "thousand sunny",
    "going merry",
    "shanks",
    "kaido",
    "big mom",
    "blackbeard",
    "ace",
    "sabo",
    "law",
    "wano",
  ].some((word) => question.includes(word))
}

function isLatestOnePieceEpisodeQuestion(question) {
  const asksEpisode = question.includes("episode") || question.includes("ep")
  const asksLatest = question.includes("latest") || question.includes("last") || question.includes("new") || question.includes("current")

  return asksEpisode && asksLatest && isOnePieceQuestion(question)
}

function getOnePieceReply(question) {
  if (isLatestOnePieceEpisodeQuestion(question)) {
    return latestOnePieceEpisodeReply
  }

  if (question.includes("luffy")) {
    return "Monkey D. Luffy is the captain of the Straw Hat Pirates. His dream is to become the Pirate King."
  }

  if (question.includes("zoro")) {
    return "Roronoa Zoro is the Straw Hat Pirates' swordsman. His dream is to become the world's greatest swordsman."
  }

  if (question.includes("sanji")) {
    return "Sanji is the Straw Hat Pirates' cook. He is known for powerful kicks, sharp style, and his dream of finding the All Blue."
  }

  if (question.includes("nami")) {
    return "Nami is the Straw Hat Pirates' navigator. Her dream is to draw a complete map of the world."
  }

  if (question.includes("chopper")) {
    return "Tony Tony Chopper is the Straw Hat Pirates' doctor. He is a reindeer who ate the Human-Human Fruit."
  }

  if (question.includes("devil fruit")) {
    return "Devil Fruits are mysterious fruits in One Piece that give special powers, but the user loses the ability to swim."
  }

  if (question.includes("thousand sunny")) {
    return "The Thousand Sunny is the Straw Hat Pirates' main ship after the Going Merry. It was built by Franky."
  }

  if (question.includes("going merry")) {
    return "The Going Merry was the Straw Hat Pirates' first ship and one of the most emotional parts of One Piece."
  }

  if (question.includes("straw hat") || question.includes("strawhat")) {
    return "The Straw Hat Pirates are Luffy's crew. Their core dream is to sail the Grand Line and help Luffy become Pirate King."
  }

  if (question.includes("pirate king")) {
    return "The Pirate King is the title given to the person who finds the One Piece and reaches the top of the pirate world."
  }

  return "One Piece is an adventure anime and manga about Monkey D. Luffy and the Straw Hat Pirates searching for the legendary treasure called the One Piece."
}

function getPortfolioReply(message) {
  const question = message.toLowerCase()

  if (isOnePieceQuestion(question)) {
    return getOnePieceReply(question)
  }

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

    const question = message.toLowerCase()

    if (isLatestOnePieceEpisodeQuestion(question)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: latestOnePieceEpisodeReply }),
      }
    }

    const onePieceContext = isOnePieceQuestion(question)
      ? await fetchOnePieceWikiContext(message).catch(() => null)
      : null

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: onePieceContext
            ? `${onePieceContext.title}: ${onePieceContext.extract.split(". ").slice(0, 2).join(". ")}.`
            : getPortfolioReply(message),
        }),
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
For Joel/portfolio questions, use only the profile details below.
For One Piece anime or manga questions, answer with general One Piece knowledge in a short, friendly way.
When One Piece Wiki context is provided, use it as the main source and rewrite it naturally in your own words. Do not sound like you are copying a wiki page.

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

One Piece Wiki context:
${onePieceContext ? `Title: ${onePieceContext.title}\nURL: ${onePieceContext.url}\nSummary: ${onePieceContext.extract}` : "No wiki context was needed or found."}

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
