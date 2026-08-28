import { useQuery } from "@tanstack/react-query";
import { useSession, useIsAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function useCategoryAccess() {
  const { user, loading: authLoading } = useSession();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const query = useQuery({
    queryKey: ["user-category-access", user?.id, user?.email],
    enabled: !!user && !isAdmin,
    queryFn: async () => {
      if (!user) return new Set<string>();

      try {
        const filters: string[] = [];
        if (user.id) filters.push(`user_id.eq.${user.id}`);
        if (user.email) filters.push(`email.eq.${user.email}`);

        const { data, error } = await supabase
          .from("category_user_access" as any)
          .select("category_id")
          .or(filters.join(","));

        if (error) {
          console.warn("category_user_access query notice:", error.message);
          return new Set<string>();
        }

        const set = new Set<string>();
        data?.forEach((row: any) => {
          if (row.category_id) set.add(row.category_id);
        });
        return set;
      } catch (err) {
        return new Set<string>();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const allowedCategoryIds = query.data || new Set<string>();

  const canAccessCategory = (category?: { id?: string; is_restricted?: boolean } | null): boolean => {
    // 1. Admin always has full access
    if (isAdmin) return true;

    // 2. If category is undefined/null or not restricted, any logged-in user can access
    if (!category || !category.is_restricted) {
      return true;
    }

    // 3. If restricted, user must be logged in and explicitly granted permission
    if (!user) return false;

    return category.id ? allowedCategoryIds.has(category.id) : false;
  };

  return {
    isLoggedIn: !!user,
    user,
    isAdmin,
    allowedCategoryIds,
    canAccessCategory,
    isLoading: authLoading || adminLoading || (!!user && !isAdmin && query.isLoading),
  };
}
