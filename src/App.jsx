import { useState, useRef, useEffect } from "react";
import {
  Plane,
  Calendar,
  MapPin,
  Compass,
  ArrowRight,
  Loader2,
} from "lucide-react";

// Base de dados simulada para o Autocomplete
const CIDADES_AEROPORTOS = [
  // --- BRASIL (Capitais e Principais Cidades) ---
  { id: 1, nome: "Belo Horizonte (Confins)", codigo: "CNF", pais: "Brasil" },
  { id: 2, nome: "Belo Horizonte (Pampulha)", codigo: "PLU", pais: "Brasil" },
  { id: 3, nome: "São Paulo (Guarulhos)", codigo: "GRU", pais: "Brasil" },
  { id: 4, nome: "São Paulo (Congonhas)", codigo: "CGH", pais: "Brasil" },
  { id: 5, nome: "Campinas (Viracopos)", codigo: "VCP", pais: "Brasil" },
  { id: 6, nome: "Rio de Janeiro (Galeão)", codigo: "GIG", pais: "Brasil" },
  {
    id: 7,
    nome: "Rio de Janeiro (Santos Dumont)",
    codigo: "SDU",
    pais: "Brasil",
  },
  { id: 8, nome: "Brasília", codigo: "BSB", pais: "Brasil" },
  { id: 9, nome: "Salvador", codigo: "SSA", pais: "Brasil" },
  { id: 10, nome: "Recife", codigo: "REC", pais: "Brasil" },
  { id: 11, nome: "Fortaleza", codigo: "FOR", pais: "Brasil" },
  { id: 12, nome: "Curitiba", codigo: "CWB", pais: "Brasil" },
  { id: 13, nome: "Porto Alegre", codigo: "POA", pais: "Brasil" },
  { id: 14, nome: "Florianópolis", codigo: "FLN", pais: "Brasil" },
  { id: 15, nome: "Manaus", codigo: "MAO", pais: "Brasil" },
  { id: 16, nome: "Belém", codigo: "BEL", pais: "Brasil" },
  { id: 17, nome: "Goiânia", codigo: "GYN", pais: "Brasil" },
  { id: 18, nome: "Vitória", codigo: "VIX", pais: "Brasil" },
  { id: 19, nome: "Cuiabá", codigo: "CGB", pais: "Brasil" },
  { id: 20, nome: "Campo Grande", codigo: "CGR", pais: "Brasil" },
  { id: 21, nome: "Natal", codigo: "NAT", pais: "Brasil" },
  { id: 22, nome: "Maceió", codigo: "MCZ", pais: "Brasil" },
  { id: 23, nome: "João Pessoa", codigo: "JPA", pais: "Brasil" }, // Corrigido!
  { id: 24, nome: "Aracaju", codigo: "AJU", pais: "Brasil" },
  { id: 25, nome: "São Luís", codigo: "SLZ", pais: "Brasil" },
  { id: 26, nome: "Teresina", codigo: "THE", pais: "Brasil" },
  { id: 27, nome: "Palmas", codigo: "PMW", pais: "Brasil" },
  { id: 28, nome: "Macapá", codigo: "MCP", pais: "Brasil" },
  { id: 29, nome: "Boa Vista", codigo: "BVB", pais: "Brasil" },
  { id: 30, nome: "Rio Branco", codigo: "RBR", pais: "Brasil" },
  { id: 31, nome: "Porto Velho", codigo: "PVH", pais: "Brasil" },
  { id: 32, nome: "Foz do Iguaçu", codigo: "IGU", pais: "Brasil" },
  {
    id: 33,
    nome: "Navegantes / Balneário Camboriú",
    codigo: "NVT",
    pais: "Brasil",
  },
  { id: 34, nome: "Porto Seguro", codigo: "BPS", pais: "Brasil" },
  { id: 35, nome: "Ilhéus", codigo: "IOS", pais: "Brasil" },
  { id: 36, nome: "Uberlândia", codigo: "UDI", pais: "Brasil" },
  { id: 37, nome: "Ribeirão Preto", codigo: "RAO", pais: "Brasil" },
  { id: 38, nome: "São José do Rio Preto", codigo: "SJP", pais: "Brasil" },
  { id: 39, nome: "Londrina", codigo: "LDB", pais: "Brasil" },
  { id: 40, nome: "Maringá", codigo: "MGF", pais: "Brasil" },
  { id: 41, nome: "Joinville", codigo: "JOI", pais: "Brasil" },
  { id: 42, nome: "Santarém", codigo: "STM", pais: "Brasil" },
  { id: 43, nome: "Petrolina", codigo: "PNZ", pais: "Brasil" },
  { id: 44, nome: "Juazeiro do Norte", codigo: "JDO", pais: "Brasil" },
  { id: 45, nome: "Campina Grande", codigo: "CPV", pais: "Brasil" },

  // --- INTERNACIONAIS ---
  { id: 100, nome: "Lisboa", codigo: "LIS", pais: "Portugal" },
  { id: 101, nome: "Porto", codigo: "OPO", pais: "Portugal" },
  { id: 102, nome: "Madrid", codigo: "MAD", pais: "Espanha" },
  { id: 103, nome: "Barcelona", codigo: "BCN", pais: "Espanha" },
  { id: 104, nome: "Paris (Charles de Gaulle)", codigo: "CDG", pais: "França" },
  { id: 105, nome: "Paris (Orly)", codigo: "ORY", pais: "França" },
  { id: 106, nome: "Roma (Fiumicino)", codigo: "FCO", pais: "Itália" },
  { id: 107, nome: "Milão (Malpensa)", codigo: "MXP", pais: "Itália" },
  { id: 108, nome: "Londres (Heathrow)", codigo: "LHR", pais: "Reino Unido" },
  { id: 109, nome: "Nova Iorque (JFK)", codigo: "JFK", pais: "EUA" },
  { id: 110, nome: "Miami", codigo: "MIA", pais: "EUA" },
  { id: 111, nome: "Orlando", codigo: "MCO", pais: "EUA" },
  { id: 112, nome: "Tóquio (Haneda)", codigo: "HND", pais: "Japão" },
  { id: 113, nome: "Buenos Aires (Ezeiza)", codigo: "EZE", pais: "Argentina" },
  { id: 114, nome: "Santiago", codigo: "SCL", pais: "Chile" },
  { id: 115, nome: "Bogotá", codigo: "BOG", pais: "Colômbia" },
];

function App() {
  const [formData, setFormData] = useState({
    origem: "",
    dataPartida: "",
    destinos: "",
    estilo: "equilibrado",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Estados para o Autocomplete
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const sugestoesRef = useRef(null);

  // Fecha as sugestões se clicar fora do menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sugestoesRef.current &&
        !sugestoesRef.current.contains(event.target)
      ) {
        setMostrarSugestoes(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Lógica do Autocomplete apenas para o campo "origem"
    if (name === "origem") {
      if (value.length > 0) {
        const filtro = CIDADES_AEROPORTOS.filter(
          (cidade) =>
            cidade.nome.toLowerCase().includes(value.toLowerCase()) ||
            cidade.codigo.toLowerCase().includes(value.toLowerCase()) ||
            cidade.pais.toLowerCase().includes(value.toLowerCase()),
        );
        setSugestoes(filtro);
        setMostrarSugestoes(true);
      } else {
        setMostrarSugestoes(false);
      }
    }
  };

  const selecionarSugestao = (cidade) => {
    setFormData((prev) => ({
      ...prev,
      origem: `${cidade.nome} (${cidade.codigo}) - ${cidade.pais}`,
    }));
    setMostrarSugestoes(false);
  };

  const gerarRoteiro = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setResultado(true);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat bg-fixed font-sans selection:bg-blue-200"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop')",
      }}
    >
      {/* 1. Camada de Fundo Isolada */}
      <div className="absolute inset-0 bg-slate-900/60 z-0 pointer-events-none"></div>

      {/* 2. Wrapper Principal que mantém tudo organizado */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 w-full z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <Plane size={28} className="rotate-45" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Orquestrador<span className="text-blue-600">Logístico</span>
              </h1>
            </div>
            <div className="text-sm text-slate-700 font-semibold bg-white/50 px-3 py-1 rounded-full border border-slate-200/50">
              Powered by AWS Bedrock
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                Planeie a sua rota
              </h2>
              <p className="text-slate-200 text-sm drop-shadow-sm font-medium">
                Insira as suas restrições e deixaremos a IA calcular a logística
                ideal para a sua travessia internacional.
              </p>
            </div>

            <form
              onSubmit={gerarRoteiro}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/40 space-y-5"
            >
              {/* Campo: Origem com Autocomplete */}
              <div className="space-y-2 relative" ref={sugestoesRef}>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  Local de Origem
                </label>
                <input
                  type="text"
                  name="origem"
                  value={formData.origem}
                  onChange={handleInputChange}
                  onFocus={() =>
                    formData.origem.length > 0 && setMostrarSugestoes(true)
                  }
                  placeholder="Ex: Belo Horizonte (CNF)"
                  className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  autoComplete="off"
                />

                {/* Menu Suspenso de Sugestões */}
                {mostrarSugestoes && sugestoes.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {sugestoes.map((cidade) => (
                      <li
                        key={cidade.id}
                        onClick={() => selecionarSugestao(cidade)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {cidade.nome}
                          </span>
                          <span className="text-xs text-slate-500">
                            {cidade.pais}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                          {cidade.codigo}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  Data de Partida
                </label>
                <input
                  type="date"
                  name="dataPartida"
                  value={formData.dataPartida}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  Destinos Desejados (Países/Cidades)
                </label>
                <textarea
                  name="destinos"
                  value={formData.destinos}
                  onChange={handleInputChange}
                  placeholder="Ex: Espanha, França e Itália. Preciso de passar por Madrid."
                  rows="3"
                  className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Compass size={16} className="text-slate-400" />
                  Estilo de Viagem
                </label>
                <select
                  name="estilo"
                  value={formData.estilo}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="equilibrado">Equilibrado (Recomendado)</option>
                  <option value="economico">
                    Económico (Foco em comboios/voos low-cost)
                  </option>
                  <option value="luxo">
                    Conforto/Luxo (Rotas mais rápidas)
                  </option>
                  <option value="aventura">
                    Aventura (Exploração intensa)
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />A orquestrar
                    logística...
                  </>
                ) : (
                  <>
                    Gerar Roteiro Inteligente
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-8">
            {!resultado && !isLoading && (
              <div className="h-full min-h-[400px] border border-white/20 rounded-2xl flex flex-col items-center justify-center text-slate-300 bg-slate-900/50 backdrop-blur-md p-6 text-center shadow-2xl">
                <div className="p-4 bg-white/10 rounded-full mb-4">
                  <Plane size={40} className="text-white opacity-80" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-wide">
                  A aguardar parâmetros
                </h3>
                <p className="text-sm max-w-sm text-slate-200 font-light leading-relaxed">
                  Preencha o formulário ao lado. O modelo AWS Bedrock irá
                  processar a malha aérea e ferroviária para construir o seu
                  roteiro.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full min-h-[400px] border border-white/40 rounded-2xl flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl shadow-2xl p-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-blue-50 text-blue-600 p-4 rounded-full mb-4">
                    <Compass size={32} className="animate-spin-slow" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  A analisar dados logísticos...
                </h3>
                <div className="flex flex-col gap-3 text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />{" "}
                    Consultar melhores voos transatlânticos
                  </span>
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />{" "}
                    Mapear ligações de comboio na Europa
                  </span>
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />{" "}
                    Estruturar itinerário JSON
                  </span>
                </div>
              </div>
            )}

            {resultado && !isLoading && (
              <div className="h-full min-h-[400px] bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <MapPin size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Interface Preparada!
                </h3>
                <p className="text-slate-600 mb-6 max-w-md leading-relaxed font-medium">
                  O formulário está a funcionar perfeitamente em harmonia com o
                  novo design e o autocomplete. O próximo passo é criar a API
                  Route para enviar estes dados para o modelo Claude no AWS
                  Bedrock.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="w-full py-6 text-center mt-auto border-t border-white/10 bg-slate-900/60 backdrop-blur-md flex flex-col items-center gap-3 shadow-inner">
          <p className="text-slate-200 text-sm font-medium drop-shadow-md">
            Desenvolvido por{" "}
            <span className="text-blue-400 font-bold tracking-wide text-base">
              Luiz Guilherme Faria
            </span>
          </p>
          <div className="flex items-center gap-6 mt-1">
            <a
              href="https://github.com/devfaria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/luiz-guilherme-faria-a454ba244/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
