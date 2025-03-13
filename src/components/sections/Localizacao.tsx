"use client";

import SectionTitle from "../SectionTitle";

const Localizacao = () => {
  return (
    <section id="localizacao" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Localização"
          subtitle="Estamos localizados em um ponto estratégico de fácil acesso. Venha nos visitar!"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-pink-500 pl-3">
                Endereço
              </h3>
              <p className="text-gray-600 mb-6">
                Av. Erico Preza Filho, 362 Sala 01
                <br />
                Galeria Napoli - Jardim Itália
                <br />
                Cuiabá - MT, 78060-758
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-pink-500 pl-3">
                Horário de Funcionamento
              </h3>
              <div className="space-y-2 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Segunda a Sexta:</span>
                  <span>09:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span>Fechado</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-pink-500 pl-3">
                Contato
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>(65) 99813-5353</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>contato@escovato.com.br</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://www.google.com/maps/dir//-15.603707,+-56.058788/@-15.6038987,-56.0583062,18.92z/data=!4m4!4m3!1m0!1m1!4e1?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-full transition-colors"
              >
                <span className="flex items-center">
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
                  Como Chegar
                </span>
              </a>
            </div>
          </div>

          <div className="h-full rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d967.0224746875762!2d-56.05878800000001!3d-15.603707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDM2JzEzLjQiUyA1NsKwMDMnMzEuNiJX!5e0!3m2!1spt-BR!2sbr!4v1647289523529!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Escovato"
              aria-label="Mapa mostrando a localização do Escovato"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Localizacao;
