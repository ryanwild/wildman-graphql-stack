"use client";

import { createContext } from "react";

export type GlobalProps = {
  sessionAvailable: boolean;
};

export const GlobalPropsContext = createContext<GlobalProps | null>(null);

export default function GlobalPropsProvider({
  children,
  globalProps,
}: {
  children: React.ReactNode;
  globalProps: GlobalProps;
}) {
  return (
    <GlobalPropsContext value={globalProps}>{children}</GlobalPropsContext>
  );
}
