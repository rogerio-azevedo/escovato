"use client";

import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Função para rolagem suave
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer id="footer" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image
              src="/logo-white.svg"
              alt="Escovato"
              width={150}
              height={50}
              className="mb-4"
            />
            <p className="text-gray-400">
              Transformando beleza em arte, cuidando de você com excelência e
              dedicação.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/escovato.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/escovato"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Endereço</h3>
            <p className="text-gray-400 mb-2">
              Av. Erico Preza Filho, 362 Sala 01
              <br />
              Galeria Napoli - Jardim Itália
              <br />
              Cuiabá - MT, 78060-758
            </p>
            <div className="mt-4">
              <a
                href="https://www.google.com/maps/dir//-15.603707,+-56.058788/@-15.6038987,-56.0583062,18.92z/data=!4m4!4m3!1m0!1m1!4e1?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors inline-flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Ver no mapa
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contato</h3>
            <p className="text-gray-400 mb-2">
              <span className="block">Telefone:</span>
              <a
                href="tel:+556599813535"
                className="text-pink-400 hover:text-pink-300 transition-colors"
              >
                (65) 99813-5353
              </a>
            </p>
            <p className="text-gray-400 mb-2">
              <span className="block">WhatsApp:</span>
              <a
                href="https://wa.me/5565998135353"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors"
              >
                (65) 99813-5353
              </a>
            </p>
            <p className="text-gray-400">
              <span className="block">Email:</span>
              <a
                href="mailto:contato@escovato.com.br"
                className="text-pink-400 hover:text-pink-300 transition-colors"
              >
                contato@escovato.com.br
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              Horário de Funcionamento
            </h3>
            <ul className="text-gray-400 space-y-2">
              <li className="flex justify-between">
                <span>Segunda a Sexta:</span>
                <span>9h às 20h</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span>9h às 18h</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span>Fechado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <button
            onClick={scrollToTop}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 mb-6 inline-block transition-colors"
            aria-label="Voltar ao topo"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
          <p className="text-gray-500">
            &copy; {currentYear} Escovato. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
