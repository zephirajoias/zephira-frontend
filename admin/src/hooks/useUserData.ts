import { jwtDecode } from "jwt-decode";
import nookies from "nookies";
import { useEffect, useState } from "react";

interface UserState {
  name: string;
  initials: string;
  email: string | null;
  userId: number | null;
  role: string | null;
  exp: number | null; // Novo campo
  isExpired: boolean; // Auxiliar para o Front-end
}

interface JwtPayload {
  sub: number;
  email: string;
  roles: string;
  name: string;
  exp: number; // Claim de expiração vinda do back-end
}

const cleanString = (str: string | undefined): string => {
  if (!str) return "";
  return str.trim();
};

export const useUserData = () => {
  const [user, setUser] = useState<UserState>({
    name: "Usuário",
    initials: "U",
    email: null,
    userId: null,
    role: null,
    exp: null,
    isExpired: false,
  });

  useEffect(() => {
    const cookies = nookies.get(null);
    const token = cookies["zephira-token"] || cookies.auth_token;

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Verificação de expiração (Pleno Level)
        const currentTime = Date.now() / 1000;
        const isExpired = decoded.exp < currentTime;

        const cleanedName = cleanString(decoded.name);
        const generatedInitials =
          cleanedName
            .split(" ")
            .filter(Boolean) // Remove espaços extras
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

        setUser({
          name: cleanedName,
          email: cleanString(decoded.email),
          userId: decoded.sub,
          role: decoded.roles,
          initials: generatedInitials,
          exp: decoded.exp,
          isExpired: isExpired,
        });

        if (isExpired) {
          console.warn("A sessão do usuário expirou.");
          // Aqui você poderia disparar um logout automático se desejar
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, []);

  return { ...user };
};
