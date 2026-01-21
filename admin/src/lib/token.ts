import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

// 1. Carregue a chave PÚBLICA das variáveis de ambiente
const jwtPublicKeyEnv = process.env.JWT_PUBLIC_KEY;

if (!jwtPublicKeyEnv) {
  throw new Error(
    "JWT_PUBLIC_KEY não foi definida corretamente nas variáveis de ambiente."
  );
}

const jwtPublicKey = jwtPublicKeyEnv.replace(/\\n/g, "\n");

export interface JwtPayload extends DefaultJwtPayload {
  email: string;
  name: string;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwtPublicKey, {
      algorithms: ["RS256"],
    }) as unknown;

    return decoded as JwtPayload;
  } catch (error: unknown) {
    console.error(
      "Falha na verificação do token:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
