// hooks/use-ranking.ts
import { api } from "@/libs/api";
import { useEffect, useState } from "react";

export type RankingItem = {
  id: number;
  username: string;
  experience: number;
  character: string;
  position: number;
  display_name: string;
  is_blocked: boolean;
  name_hidden: boolean;
};

export function useRanking(token: string, userId?: string, level?: string) {
  const [top3, setTop3] = useState<RankingItem[]>([]);
  const [rest, setRest] = useState<RankingItem[]>([]);
  const [userPosition, setUserPosition] = useState<RankingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await api.getRanking(token, level);

        const list: RankingItem[] = data.map((item, index) => ({
          ...item,
          position: index + 1,
        }));
        if (!mounted) return;

        setTop3(list.slice(0, 3));
        setRest(list.slice(3, 33)); // ← máximo 30 elementos
        setUserPosition(list.find((i) => String(i.id) === userId) || null);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [token, level, userId, revision]);

  return {
    top3,
    rest,
    userPosition,
    loading,
    refresh: () => setRevision((current) => current + 1),
  };
}
