"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Button
        onClick={() =>
          signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          })
        }
      >
        Sair
      </Button>
    </div>
  );
}