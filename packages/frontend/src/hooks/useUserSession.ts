import { getMyMember } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";
import type { Member } from "shared";

export const useUserSession = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
    try {
      const data = await getMyMember();
        setMember(data);
      } catch (error) {
        setMember(null);
      }
    } catch {
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { member, loading, refetch };
};