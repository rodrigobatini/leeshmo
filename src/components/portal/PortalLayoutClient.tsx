"use client";

import { usePathname } from "next/navigation";
import { PortalFrame } from "./PortalFrame";

/**
 * Onboarding em tela cheia sem sidebar; demais rotas do grupo (portal) usam o shell Lovable-like.
 */
export function PortalLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/onboarding")) {
    return <>{children}</>;
  }
  return <PortalFrame>{children}</PortalFrame>;
}
