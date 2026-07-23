import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
};

export function FadeIn({ children }: Props) {
  return <>{children}</>;
}