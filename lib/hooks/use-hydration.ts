"use client";

import { useEffect, useState } from "react";

import { useBoardStore } from "@/store/board-store";

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinish = useBoardStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useBoardStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => { unsubFinish(); };
  }, []);

  return hydrated;
}
