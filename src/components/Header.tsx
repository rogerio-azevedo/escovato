"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Detectar seção ativa
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100; // Ajuste para compensar o header

      sections.forEach((section) => {
        const sectionId = section.getAttribute("id") || "";
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função para rolagem suave
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop;
      window.scrollTo({
        top: offsetTop - 80, // Ajuste para compensar a altura do header
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  // Estilo de texto para o menu no topo (antes do scroll)
  const topMenuTextStyle = isScrolled
    ? "text-gray-800"
    : "text-white drop-shadow-md";

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md py-2 scrolled"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="relative h-12 w-40">
          <Image
            src={isScrolled ? "/logo.svg" : "/logo-white.svg"}
            alt="Escovato"
            fill
            className={`object-contain ${!isScrolled ? "drop-shadow-md" : ""}`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => scrollToSection("nosso-espaco")}
            className={`${topMenuTextStyle} hover:text-pink-400 font-medium transition-colors nav-link ${
              activeSection === "nosso-espaco" ? "active" : ""
            }`}
          >
            Nosso Espaço
          </button>
          <button
            onClick={() => scrollToSection("profissionais")}
            className={`${topMenuTextStyle} hover:text-pink-400 font-medium transition-colors nav-link ${
              activeSection === "profissionais" ? "active" : ""
            }`}
          >
            Profissionais
          </button>
          <button
            onClick={() => scrollToSection("servicos")}
            className={`${topMenuTextStyle} hover:text-pink-400 font-medium transition-colors nav-link ${
              activeSection === "servicos" ? "active" : ""
            }`}
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection("footer")}
            className={`${topMenuTextStyle} hover:text-pink-400 font-medium transition-colors nav-link ${
              activeSection === "localizacao" ? "active" : ""
            }`}
          >
            Localização
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden ${
            isScrolled ? "text-gray-800" : "text-white drop-shadow-md"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection("nosso-espaco")}
              className={`text-gray-800 hover:text-pink-600 font-medium transition-colors text-left ${
                activeSection === "nosso-espaco" ? "text-pink-600" : ""
              }`}
            >
              Nosso Espaço
            </button>
            <button
              onClick={() => scrollToSection("profissionais")}
              className={`text-gray-800 hover:text-pink-600 font-medium transition-colors text-left ${
                activeSection === "profissionais" ? "text-pink-600" : ""
              }`}
            >
              Profissionais
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className={`text-gray-800 hover:text-pink-600 font-medium transition-colors text-left ${
                activeSection === "servicos" ? "text-pink-600" : ""
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection("footer")}
              className={`text-gray-800 hover:text-pink-600 font-medium transition-colors text-left ${
                activeSection === "localizacao" ? "text-pink-600" : ""
              }`}
            >
              Localização
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
