"use client";

import SectionTitle from "../SectionTitle";

const Localizacao = () => {
  return (
    <section id="localizacao" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Localização"
          subtitle="Estamos localizados em um ponto estratégico de fácil acesso no Jardim Itália."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-lg shadow-lg p-8 h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Como Chegar
            </h3>
            <p className="text-gray-700 mb-6">
              Estamos localizados na Av. Erico Preza Filho, 362 Sala 01, na
              Galeria Napoli, no bairro Jardim Itália em Cuiabá. Nossa
              localização é de fácil acesso, próxima a diversos estabelecimentos
              comerciais e com estacionamento disponível.
            </p>

            <div className="mb-8">
              <a
                href="https://www.google.com/maps/dir//-15.603707,+-56.058788/@-15.6038987,-56.0583062,18.92z/data=!4m4!4m3!1m0!1m1!4e1?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-700 hover:text-orange-800 transition-colors"
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
                Ver rotas no Google Maps
              </a>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Pontos de Referência
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Próximo ao Bosque da Saúde</li>
              <li>A 5 minutos do Shopping Pantanal</li>
              <li>Ao lado da Clínica Vida</li>
              <li>Próximo à Avenida das Torres</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Estacionamento
            </h3>
            <p className="text-gray-700">
              Dispomos de estacionamento gratuito para clientes na frente da
              galeria, além de amplo estacionamento nas ruas adjacentes.
            </p>
          </div>

          <div className="h-full">
            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d967.0224746875762!2d-56.05878800000001!3d-15.603707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDM2JzEzLjQiUyA1NsKwMDMnMzEuNiJX!5e0!3m2!1spt-BR!2sbr!4v1647289523529!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Escovato"
                aria-label="Mapa mostrando a localização do Escovato"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Localizacao;
