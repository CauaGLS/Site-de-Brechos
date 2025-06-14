import Logo from "@/public/logo.svg";
import Image from "next/image";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 w-full">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src={Logo} alt="Logo" width={42} height={42} />
        </a>
        <LoginForm />
      </div>
    </div>
  );
}