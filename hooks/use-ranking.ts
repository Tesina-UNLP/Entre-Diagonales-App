// hooks/use-ranking.ts
import { api } from "@/libs/api";
import { RankingApiResponse } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";

export type RankingItem = RankingApiResponse;

const PAGE_SIZE = 20;

export function useRanking(token: string, level?: string) {
  const [items, setItems] = useState<RankingItem[]>([]);
  const [userPosition, setUserPosition] = useState<RankingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const hasNextPageRef = useRef(false);

  const loadPage = useCallback(
    async (page: number, replace: boolean, isRefresh = false) => {
      if (!token) {
        setItems([]);
        setUserPosition(null);
        setHasNextPage(false);
        setLoading(false);
        return;
      }
      if (!replace && (!hasNextPageRef.current || loadingMoreRef.current)) {
        return;
      }

      const requestId = ++requestIdRef.current;
      if (isRefresh) {
        setRefreshing(true);
      } else if (replace) {
        setLoading(true);
      } else {
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }

      try {
        const response = await api.getRanking(token, level, page);
        if (requestId !== requestIdRef.current) return;

        setItems((current) => {
          const merged = replace
            ? response.results
            : [...current, ...response.results];
          return Array.from(
            new Map(merged.map((item) => [item.id, item])).values(),
          );
        });
        setUserPosition(response.current_user);
        setHasNextPage(response.next !== null);
        hasNextPageRef.current = response.next !== null;
      } catch {
        Toast.show({
          type: "error",
          text1: "Error al obtener el ranking",
          text2: "Deslizá nuevamente para reintentar.",
        });
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    },
    [level, token],
  );

  const refresh = useCallback(() => {
    void loadPage(1, true, true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      void loadPage(Math.floor(items.length / PAGE_SIZE) + 1, false);
    }
  }, [hasNextPage, items.length, loadPage, loading]);

  useEffect(() => {
    setItems([]);
    setUserPosition(null);
    setHasNextPage(false);
    hasNextPageRef.current = false;
    void loadPage(1, true);

    return () => {
      requestIdRef.current += 1;
    };
  }, [level, loadPage, token]);

  return {
    top3: items.slice(0, 3),
    rest: items.slice(3),
    userPosition,
    loading,
    refreshing,
    loadingMore,
    hasNextPage,
    loadMore,
    refresh,
  };
}
