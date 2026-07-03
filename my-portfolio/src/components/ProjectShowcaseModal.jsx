import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiGithub } from 'react-icons/fi';

const projects = [
  {
    id: 'church-website',
    title: "Methodist Tamil Church",
    subtitle: "Church Website",
    image: "/images/church_logo.png.png",
    description: "A modern digital platform built for church management, enabling event publishing, prayer requests, gallery management, pastor messages, multilingual content, and an intuitive admin CMS for seamless community engagement.",
    tech: [
      "React 19", "Node.js", "Express.js", "MongoDB", "Mongoose", "Tailwind CSS",
      "Vite", "React Router", "Axios", "JWT", "bcrypt", "Multer", "Cloudinary",
      "Helmet", "CORS", "Rate Limiter"
    ],
    features: [
      "Admin CMS", "Events", "Gallery", "Prayer Requests", "Pastor Messages",
      "Multi-language", "Image Uploads", "Role Management", "Responsive", "Secure Authentication"
    ],
    demoLink: "https://mtcpadikuppam.netlify.app/",
    githubLink: "https://github.com/Joel123tony",
  },
  {
    id: 'ecommerce-website',
    title: "Nerua",
    subtitle: "E-commerce Website",
    image: "/images/nerua_logo.png.png",
    description: "A feature-rich e-commerce platform designed to deliver a fast and secure shopping experience with product management, authentication, responsive design, and an intuitive administration system.",
    tech: [
      "HTML5", "CSS3", "JavaScript", "Node.js", "Express.js", "MongoDB", "Mongoose",
      "JWT", "bcrypt", "CORS", "dotenv", "Body Parser", "Font Awesome", "Bootstrap Icons",
      "Google Fonts", "3D Models (.glb)"
    ],
    features: [
      "Product Catalog", "Shopping Cart", "Authentication", "Admin Dashboard",
      "MongoDB", "Responsive", "Secure Login", "Order Management", "Product Management", "3D Product Showcase"
    ],
    demoLink: "https://neuraproject.netlify.app/",
    githubLink: "https://github.com/Joel123tony",
  }
];

const ProjectShowcaseModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Handle ESC key and Focus Trapping
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Basic focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus to modal for accessibility
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 md:p-6"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[90vw] max-w-[1400px] max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#0a0a0a] shadow-[0_0_50px_rgba(212,175,55,0.15)] outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Sticky */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-800 bg-[#0a0a0a]/90 px-5 md:px-8 py-4 backdrop-blur-xl">
              <div>
                <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-white">
                  Web Development
                </h2>
                <p className="mt-1 text-xs md:text-sm uppercase tracking-[2px] md:tracking-[3px] text-[#D4AF37]">
                  Selected Full Stack Projects
                </p>
              </div>
              <button
                onClick={onClose}
                className="group grid h-9 w-9 md:h-10 md:w-10 place-items-center rounded-full border border-gray-800 bg-[#111111] transition duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 shrink-0"
                aria-label="Close modal"
              >
                <FiX className="text-lg md:text-xl text-gray-400 transition duration-300 group-hover:text-[#D4AF37]" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.15, ease: "easeOut" }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#111111] shadow-[0_0_35px_rgba(0,0,0,0.5)] transition duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] w-full"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-video sm:h-[220px] lg:h-[240px] overflow-hidden border-b border-gray-800 bg-[#1a1a1a] shrink-0">
                      <div className="absolute inset-0 z-10 bg-black/20 transition duration-500 group-hover:bg-transparent"></div>
                      <img
                        src={project.image}
                        alt={`${project.title} Preview`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-grow flex-col p-4 sm:p-5 lg:p-6">
                      <div className="mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white transition duration-300 group-hover:text-[#D4AF37] leading-tight">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-[#D4AF37]">
                          {project.subtitle}
                        </p>
                      </div>

                      <p className="mb-4 text-xs sm:text-sm text-gray-400 leading-snug">
                        {project.description}
                      </p>

                      {/* Tech Badges */}
                      <div className="mb-4">
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">Technologies</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="flex items-center rounded border border-gray-800 bg-gray-900/60 px-2 h-[26px] text-[10px] sm:text-[11px] font-medium text-gray-300 transition duration-300 hover:border-[#D4AF37]/50 hover:text-white whitespace-nowrap"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-5 flex-grow">
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">Key Features</h4>
                        <ul className="flex flex-wrap gap-1.5">
                          {project.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center h-[24px] rounded bg-[#1a1a1a] px-2 text-[10px] sm:text-[11px] text-gray-400 whitespace-nowrap"
                            >
                              <span className="mr-1.5 h-1 w-1 rounded-full bg-[#D4AF37]"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800 shrink-0">
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-[#D4AF37] h-[36px] sm:h-[40px] text-xs sm:text-sm font-bold text-black transition duration-300 hover:scale-[1.02] hover:bg-transparent hover:text-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full"
                        >
                          <FiExternalLink /> Live Demo
                        </a>
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-700 bg-transparent h-[36px] sm:h-[40px] text-xs sm:text-sm font-bold text-white transition duration-300 hover:scale-[1.02] hover:border-gray-500 hover:bg-gray-800 w-full"
                        >
                          <FiGithub /> GitHub
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectShowcaseModal;
