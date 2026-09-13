import axios from "axios";

// Sem Content-Type fixo aqui: o axios já usa "application/json" sozinho
// pra objetos comuns. Se a gente fixa esse header na instância, o axios
// para de detectar FormData automaticamente e converte uploads (imagem
// de produto/categoria) pra JSON quebrado em vez de multipart de verdade
// — foi exatamente esse o bug que impedia criar produto com imagem.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zephira_token_admin");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
