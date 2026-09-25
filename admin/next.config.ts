import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Build autocontido só no container da VPS (o Dockerfile define a
  // variável). No Windows o standalone falha criando links simbólicos, então
  // o build local continua no modo normal.
  output: process.env.NEXT_STANDALONE === "1" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Se você usar imagens do Google (perfil), adicione também:
      {
        protocol: "http",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "rzvcfkxafbqkdzgouxly.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
