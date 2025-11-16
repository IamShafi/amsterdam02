import { supabase } from "@/integrations/supabase/client";

export interface TourImage {
  id: string;
  category: 'tour' | 'group' | 'hero';
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export const uploadImage = async (
  file: File,
  category: 'tour' | 'group' | 'hero',
  altText: string,
  displayOrder: number
): Promise<TourImage | null> => {
  try {
    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${category}-${Date.now()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tour-images')
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache for better performance
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('tour-images')
      .getPublicUrl(filePath);

    // Insert record
    const { data, error } = await supabase
      .from('tour_images')
      .insert({
        category,
        image_url: publicUrl,
        alt_text: altText,
        display_order: displayOrder
      })
      .select()
      .single();

    if (error) throw error;
    return data as TourImage;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteImage = async (imageId: string, imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/tour-images/');
    const filePath = pathParts[1];

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('tour-images')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete record
    const { error } = await supabase
      .from('tour_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const getImagesByCategory = async (category: 'tour' | 'group' | 'hero'): Promise<TourImage[]> => {
  try {
    const { data, error } = await supabase
      .from('tour_images')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []) as TourImage[];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

export const updateImageOrder = async (imageId: string, newOrder: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tour_images')
      .update({ display_order: newOrder })
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating image order:', error);
    return false;
  }
};

export const updateImageAltText = async (imageId: string, altText: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tour_images')
      .update({ alt_text: altText })
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating alt text:', error);
    return false;
  }
};