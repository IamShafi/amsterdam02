import { supabase } from "@/integrations/supabase/client";

export interface TourImage {
  id: string;
  category: "tour" | "group" | "hero";
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export const getImagesByCategory = async (
  category: "tour" | "group" | "hero"
): Promise<TourImage[]> => {
  try {
    const { data, error } = await supabase
      .from("tour_images")
      .select("*")
      .eq("category", category)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as TourImage[];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};
