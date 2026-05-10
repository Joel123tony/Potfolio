import { useState, useEffect, useRef } from "react"
import { FiMail, FiInstagram, FiBriefcase } from "react-icons/fi"
import { motion } from "framer-motion"

function App() {

  const [isMuted, setIsMuted] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {

        if (entry.isIntersecting) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }

      },
      {
        threshold: 0.5,
      }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }

  }, [])

  useEffect(() => {
  const moveCursor = (e) => {
    if (!cursorRef.current) return

    cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
  }

  window.addEventListener("mousemove", moveCursor)

  return () => window.removeEventListener("mousemove", moveCursor)
}, [])

  return (

    <div className="min-h-screen bg-black text-white overflow-x-hidden">

{/* Navbar */}
<nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-800 bg-black/70 backdrop-blur-xl">

  <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">

    {/* Logo */}
    <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-[#D4AF37] hover:drop-shadow-[0_0_12px_#D4AF37] transition duration-300 cursor-pointer">
      JOEL
    </h1>

    {/* Desktop Menu */}
    <ul className="hidden md:flex items-center gap-8 text-sm font-medium">

      {[
        "home",
        "about",
        "skills",
        "projects",
        "media",
        "contact"
      ].map((item, index) => (

        <li key={index}>

          <a
            href={`#${item}`}
            className="relative uppercase tracking-[2px] text-gray-300 hover:text-[#D4AF37] transition duration-300 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full"
          >
            {item}
          </a>

        </li>

      ))}

    </ul>

    {/* Mobile Button */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden flex flex-col gap-1.5 group"
    >

      <span className={`w-7 h-[2px] bg-white transition duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`}></span>

      <span className={`w-7 h-[2px] bg-white transition duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>

      <span className={`w-7 h-[2px] bg-white transition duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}></span>

    </button>

  </div>

</nav>      
<section
        id="home"
        className="relative flex flex-col items-center justify-center text-center py-32 px-6 overflow-hidden"
      >
        {/* Animated Background Glow */}
<div className="absolute w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[140px] rounded-full animate-pulse"></div>

        <p className="text-[#D4AF37] uppercase tracking-[5px] mb-4">
          Personal Portfolio
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Creative Developer
          <br />
          & Video Editor
        </h1>

        <p className="text-gray-400 mt-6 max-w-2xl text-lg">
          Building modern edits, modern websites and
          creative digital experiences.
        </p>

 <a
  href="/resume.pdf"
  download
  className="mt-10 bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition duration-300"
>
  <button>
  View My Resume
  </button>
</a>
      </section>

      {/* About */}
      <section
        id="about"
        className="px-8 py-24 bg-[#111111]"
      >

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div>

            <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
              About Me
            </p>

            <h2 className="text-4xl font-bold mb-6">
              Creative Mind With Technical Skills
            </h2>

            <p className="text-gray-400 leading-relaxed mb-6">
              I’m passionate about creating cinematic edits,
              modern websites and digital experiences.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Skilled in video editing, frontend development
              and creative design.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-black border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-[#D4AF37] text-3xl font-bold mb-2">
                2+
              </h3>

              <p className="text-gray-400">
                Years Learning Creative Skills
              </p>
            </div>

            <div className="bg-black border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-[#D4AF37] text-3xl font-bold mb-2">
                10+
              </h3>

              <p className="text-gray-400">
                Creative Projects
              </p>
            </div>

            <div className="bg-black border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-[#D4AF37] text-3xl font-bold mb-2">
                6+
              </h3>

              <p className="text-gray-400">
                Editing Tools
              </p>
            </div>

            <div className="bg-black border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-[#D4AF37] text-3xl font-bold mb-2">
                ∞
              </h3>

              <p className="text-gray-400">
                Creative Ideas
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Skills */}
      <section
        id="skills"
        className="px-8 py-24 bg-black"
      >

        <motion.div
  className="max-w-6xl mx-auto"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
          <div className="text-center mb-16">

            <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
              My Skills
            </p>

            <h2 className="text-4xl font-bold">
              Tools & Technologies
            </h2>

          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

            {[
              {
                title: "Premiere Pro",
                desc: "Professional video editing and storytelling."
              },
              {
                title: "After Effects",
                desc: "Motion graphics and visual effects."
              },
              {
                title: "React",
                desc: "Modern responsive frontend applications."
              },
              {
                title: "Node.js",
                desc: "Backend development and APIs."
              },
              {
                title: "MongoDB",
                desc: "Database management and integration."
              },
              {
                title: "OBS Studio",
                desc: "Live streaming and production setup."
              },
              {
                title: "Blender",
                desc: "Creating 3D animations and renders."
              },
              {
                title: "Roblox Studio",
                desc: "Game development and scripting."
              },
              {
                title: "MS Office",
                desc: "Word, PowerPoint and Excel experience."
              }

            ].map((skill, index) => (

              <div
                key={index}
                className="bg-[#111111] border border-gray-800 rounded-2xl p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:-translate-y-2 transition duration-500"
              >

                <h3 className="text-2xl font-bold mb-4">
                  {skill.title}
                </h3>

                <p className="text-gray-400">
                  {skill.desc}
                </p>

              </div>

            ))}

          </div>

     </motion.div>

      </section>

{/* Projects Section */}
<section
  id="projects"
  className="px-8 py-24 bg-[#111111]"
>

  <motion.div
    className="max-w-6xl mx-auto"
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >

    {/* Heading */}
    <div className="text-center mb-16">

      <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
        Projects
      </p>

      <h2 className="text-4xl font-bold">
        Featured Creative Works
      </h2>

    </div>

    {/* Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="group bg-black border border-gray-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:-translate-y-2 transition duration-500">

        <div className="overflow-hidden">

          <img
  src="/images/edit_logo.png"
  alt="project"
  className="h-56 w-[90%] mx-auto mt-4 rounded-2xl object-cover group-hover:scale-105 transition duration-700"
/>

        </div>

        <div className="p-6">

          <p className="text-[#D4AF37] text-sm mb-3">
            Video Editing
          </p>

          <h3 className="text-2xl font-bold mb-4">
            Video Edit
          </h3>

          <p className="text-gray-400 mb-6">
            Cinematic storytelling with smooth transitions.
          </p>

          <a
            href="https://drive.google.com/drive/folders/1efMW_BAGA_4nwJQeFEJI-fwzmNYYeoJb?usp=drive_link"
            target="_blank"
          >
            <button className="border border-gray-700 px-5 py-2 rounded-full hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition duration-300">
              View Project
            </button>
          </a>

        </div>

      </div>

      {/* Card 2 */}
      <div className="group bg-black border border-gray-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:-translate-y-2 transition duration-500">

        <div className="overflow-hidden">

       <img
  src="/images/web_logo.png"
  alt="project"
  className="h-56 w-[90%] mx-auto mt-4 rounded-2xl object-cover group-hover:scale-105 transition duration-700"
/>

        </div>

        <div className="p-6">

          <p className="text-[#D4AF37] text-sm mb-3">
            Web Development
          </p>

          <h3 className="text-2xl font-bold mb-4">
            E-commerce Website
          </h3>

          <p className="text-gray-400 mb-6">
            Responsive project built using MongoDB and Node.js.
          </p>

          <a
            href="https://neuraproject.netlify.app/"
            target="_blank"
          >
            <button className="border border-gray-700 px-5 py-2 rounded-full hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition duration-300">
              View Project
            </button>
          </a>

        </div>

      </div>

      {/* Card 3 */}
      <div className="group bg-black border border-gray-800 rounded-3xl overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:-translate-y-2 transition duration-500">

        <div className="overflow-hidden">

        <img
  src="/images/3d_logo.png"
  alt="project"
  className="h-56 w-[90%] mx-auto mt-4 rounded-2xl object-cover group-hover:scale-105 transition duration-700"
/>

        </div>

        <div className="p-6">

          <p className="text-[#D4AF37] text-sm mb-3">
            3D Design
          </p>

          <h3 className="text-2xl font-bold mb-4">
            3D Creative Project
          </h3>

          <p className="text-gray-400 mb-6">
            3D visuals and cinematic renders.
          </p>

          <a
            href="https://drive.google.com/drive/folders/1g8lWP0LlUI2xz9_5PFhxM7VJzFsM-JJf?usp=sharing"
            target="_blank"
          >
            <button className="border border-gray-700 px-5 py-2 rounded-full hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition duration-300">
              View Project
            </button>
          </a>

        </div>

      </div>

    </div>

  </motion.div>

</section>

{/* Showreel */}
<section id="media" className="px-8 py-24 bg-[#111111]">

  <div className="max-w-6xl mx-auto">

    <div className="text-center mb-16">

      <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
        Featured Reel
      </p>

      <h2 className="text-4xl font-bold mb-6">
        Cinematic Creative Showcase
      </h2>
    </div>

    {/* Video Container */}
    <div className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl h-[300px] md:h-[600px]">

      <video
  ref={videoRef}
  className="w-full h-full object-cover"
  autoPlay
  loop
  playsInline
  muted={isMuted}
  preload="metadata"
>
  <source
    src="https://res.cloudinary.com/dtdqsceur/video/upload/q_auto/f_auto/v1778408003/ordinary_person_gojo_lzietp.mp4"
    type="video/mp4"
  />
</video>

<button
  onClick={() => {
    setIsMuted((prev) => {
      const newMuted = !prev
      if (videoRef.current) {
        videoRef.current.muted = newMuted
      }
      return newMuted
    })
  }}
  className="absolute top-6 right-6 bg-black/60 px-4 py-2 rounded-full border border-gray-700"
>
  {isMuted ? "Unmute 🔊" : "Mute 🔇"}
</button>
</div>
</div>

</section>
  {/* Contact Section */}
<section
  id="contact"
  className="px-8 py-24 bg-black border-t border-gray-800 relative overflow-hidden"
>

  {/* Background Glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse"></div>

  <div className="max-w-6xl mx-auto relative z-10">

    {/* Heading */}
    <div className="text-center mb-16">

      <p className="text-[#D4AF37] uppercase tracking-[4px] mb-4">
        Contact
      </p>

      <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Let’s Build Something
        <span className="text-[#D4AF37]"> Creative</span>
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto text-lg">
        Available for video editing, website development,
        creative collaborations and freelance projects.
      </p>

    </div>

    {/* Contact Cards */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* Email */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-gray-800 rounded-3xl p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:-translate-y-2 transition duration-500">

        <FiMail className="text-5xl text-[#D4AF37] mb-5" />

        <h3 className="text-2xl font-bold mb-3">
          Email
        </h3>

        <p className="text-gray-400 mb-6 break-all">
          Joeljebasingh0@gmail.com
        </p>

        <a
          href="mailto:Joeljebasingh0@gmail.com"
          className="text-[#D4AF37] hover:underline"
        >
          Send Mail →
        </a>

      </div>

      {/* Instagram */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-gray-800 rounded-3xl p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:-translate-y-2 transition duration-500">

        <FiInstagram className="text-5xl text-[#D4AF37] mb-5" />

        <h3 className="text-2xl font-bold mb-3">
          Instagram
        </h3>

        <p className="text-gray-400 mb-6">
          Creative edits and cinematic reels showcase.
        </p>

        <a
          href="https://www.instagram.com/lara._.editz._/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D4AF37] hover:underline"
        >
          Visit Page →
        </a>

      </div>

      {/* Collaboration */}
      <div className="bg-[#111111]/80 backdrop-blur-md border border-gray-800 rounded-3xl p-8 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:-translate-y-2 transition duration-500">

        <FiBriefcase className="text-5xl text-[#D4AF37] mb-5" />

        <h3 className="text-2xl font-bold mb-3">
          Collaboration
        </h3>

        <p className="text-gray-400 mb-6">
          Open for freelance projects and creative teamwork.
        </p>

        <span className="text-[#D4AF37] font-medium">
          Available Now
        </span>

      </div>

    </div>

  </div>

</section>
      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-8 px-6">

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div>

            <h3 className="text-2xl font-bold text-[#D4AF37] mb-2">
              JOEL
            </h3>

            <p className="text-gray-500 text-sm">
              Creative Developer • Video Editor • 3D Artist
            </p>

          </div>

          <div className="flex gap-6 text-sm text-gray-400">

            <a href="#home" className="hover:text-[#D4AF37]">
              Home
            </a>

            <a href="#skills" className="hover:text-[#D4AF37]">
              Skills
            </a>

            <a href="#projects" className="hover:text-[#D4AF37]">
              Projects
            </a>

            <a href="#contact" className="hover:text-[#D4AF37]">
              Contact
            </a>

          </div>

          <div className="flex gap-5">

            <a
              href="https://www.instagram.com/lara._.editz._/"
              target="_blank"
              className="text-gray-400 hover:text-[#D4AF37]"
            >
              Instagram
            </a>

            <a
              href="mailto:Joeljebasingh0@gmail.com"
              className="text-gray-400 hover:text-[#D4AF37]"
            >
              Email
            </a>

          </div>

        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-900">

          <p className="text-gray-600 text-sm">
            © 2026 JOEL. Crafted with React JS, Tailwind CSS & Creative Vision.
          </p>

        </div>

      </footer>

    </div>

  )
}

export default App