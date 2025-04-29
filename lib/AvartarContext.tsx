// lib/AvatarContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

const AvatarContext = createContext<{
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}>({
  avatarUrl: null,
  setAvatarUrl: () => {},
});

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  return useContext(AvatarContext);
}
