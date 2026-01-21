import LoginForm from "@/components/login/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#f6f8f8]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#618986] border-t-[#11d4c4]"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
