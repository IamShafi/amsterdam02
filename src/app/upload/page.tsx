'use client';
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload as UploadIcon, Trash2, Loader2, ImagePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  uploadImage,
  deleteImage,
  getImagesByCategory,
  updateImageOrder,
  type TourImage,
} from "@/lib/api/imageService";

const Upload = () => {
  const [tourFiles, setTourFiles] = useState<FileList | null>(null);
  const [groupFiles, setGroupFiles] = useState<FileList | null>(null);
  const [heroFiles, setHeroFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Add noindex meta tag to prevent indexing by search engines
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'robots';
    metaTag.content = 'noindex, nofollow';
    document.head.appendChild(metaTag);

    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);

  // Fetch tour images
  const { data: tourImages = [], isLoading: tourLoading } = useQuery({
    queryKey: ["tour-images"],
    queryFn: () => getImagesByCategory("tour"),
  });

  // Fetch group images
  const { data: groupImages = [], isLoading: groupLoading } = useQuery({
    queryKey: ["group-images"],
    queryFn: () => getImagesByCategory("group"),
  });

  const { data: heroImages = [], isLoading: heroLoading } = useQuery({
    queryKey: ["hero-images"],
    queryFn: () => getImagesByCategory("hero"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) => deleteImage(id, url),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tour-images"] });
        queryClient.invalidateQueries({ queryKey: ["group-images"] });
        queryClient.invalidateQueries({ queryKey: ["hero-images"] });
        toast.success("Image deleted successfully");
      },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) => updateImageOrder(id, order),
    onError: () => {
      toast.error("Failed to update image order");
    },
  });

  const handleUpload = async (category: 'tour' | 'group' | 'hero') => {
    const files = category === 'tour' ? tourFiles : category === 'group' ? groupFiles : heroFiles;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    const currentImages = category === 'tour' ? tourImages : category === 'group' ? groupImages : heroImages;
    let nextOrder = currentImages.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const altText = category === 'tour' ? `Tour image ${nextOrder + 1}` : category === 'group' ? `Group image ${nextOrder + 1}` : `Hero image ${nextOrder + 1}`;
      
      const result = await uploadImage(file, category, altText, nextOrder);
      if (result) {
        successCount++;
        nextOrder++;
      } else {
        failCount++;
      }
    }

    setUploading(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: [`${category}-images`] });
    }
    
    if (failCount > 0) {
      toast.error(`${failCount} image(s) failed to upload`);
    }

    // Reset file input
    if (category === 'tour') {
      setTourFiles(null);
    } else if (category === 'group') {
      setGroupFiles(null);
    } else {
      setHeroFiles(null);
    }
  };

  const handleDelete = (image: TourImage) => {
    if (confirm(`Delete this image?`)) {
      deleteMutation.mutate({ id: image.id, url: image.image_url });
    }
  };

  const handleMoveLeft = async (image: TourImage, category: 'tour' | 'group' | 'hero') => {
    const images = category === 'tour' ? tourImages : category === 'group' ? groupImages : heroImages;
    const currentIndex = images.findIndex(img => img.id === image.id);
    
    if (currentIndex <= 0) return; // Already first
    
    const prevImage = images[currentIndex - 1];
    
    try {
      // Swap orders
      await updateOrderMutation.mutateAsync({ id: image.id, order: currentIndex - 1 });
      await updateOrderMutation.mutateAsync({ id: prevImage.id, order: currentIndex });
      
      // Refresh
      queryClient.invalidateQueries({ queryKey: [`${category}-images`] });
      toast.success("Image moved left");
    } catch (error) {
      toast.error("Failed to move image");
    }
  };

  const handleMoveRight = async (image: TourImage, category: 'tour' | 'group' | 'hero') => {
    const images = category === 'tour' ? tourImages : category === 'group' ? groupImages : heroImages;
    const currentIndex = images.findIndex(img => img.id === image.id);
    
    if (currentIndex >= images.length - 1) return; // Already last
    
    const nextImage = images[currentIndex + 1];
    
    try {
      // Swap orders
      await updateOrderMutation.mutateAsync({ id: image.id, order: currentIndex + 1 });
      await updateOrderMutation.mutateAsync({ id: nextImage.id, order: currentIndex });
      
      // Refresh
      queryClient.invalidateQueries({ queryKey: [`${category}-images`] });
      toast.success("Image moved right");
    } catch (error) {
      toast.error("Failed to move image");
    }
  };

  // Image Card Component
  const ImageCard = ({ 
    image, 
    category,
    isFirst,
    isLast
  }: { 
    image: TourImage; 
    category: 'tour' | 'group' | 'hero';
    isFirst: boolean;
    isLast: boolean;
  }) => {
    return (
      <div className="relative group">
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <img
            src={image.image_url}
            alt={image.alt_text}
            className="w-full h-full object-cover"
          />
          
          {/* Controls overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2">
            {/* Left arrow */}
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handleMoveLeft(image, category)}
              disabled={isFirst || updateOrderMutation.isPending}
              className="bg-background/80 hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Delete button */}
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDelete(image)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>

            {/* Right arrow */}
            <Button
              size="icon"
              variant="secondary"
              onClick={() => handleMoveRight(image, category)}
              disabled={isLast || updateOrderMutation.isPending}
              className="bg-background/80 hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {image.alt_text}
        </p>
      </div>
    );
  };

  const ImageGrid = ({ 
    images, 
    loading, 
    category 
  }: { 
    images: TourImage[]; 
    loading: boolean;
    category: 'tour' | 'group' | 'hero';
  }) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <ImagePlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No images uploaded yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageCard 
            key={image.id} 
            image={image} 
            category={category}
            isFirst={index === 0}
            isLast={index === images.length - 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Tour Images</h1>
          <p className="text-muted-foreground">
            Upload and manage images for your tour detail page
          </p>
        </div>

        <div className="space-y-8">
          {/* Tour Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Images (Top Carousel)</CardTitle>
              <CardDescription>
                These images appear in the main carousel at the top of the tour page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageGrid images={tourImages} loading={tourLoading} category="tour" />
              
              <div className="border-t pt-6">
                <Label htmlFor="tour-upload">Upload New Tour Images</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="tour-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setTourFiles(e.target.files)}
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => handleUpload('tour')}
                    disabled={!tourFiles || uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UploadIcon className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Pictures Section */}
          <Card>
            <CardHeader>
              <CardTitle>Group Pictures (Happy Travelers Carousel)</CardTitle>
              <CardDescription>
                These images appear in the "21,000+ Happy Travelers" section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageGrid images={groupImages} loading={groupLoading} category="group" />
              
              <div className="border-t pt-6">
                <Label htmlFor="group-upload">Upload New Group Pictures</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="group-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setGroupFiles(e.target.files)}
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => handleUpload('group')}
                    disabled={!groupFiles || uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UploadIcon className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Images</CardTitle>
              <CardDescription>
                These images appear in the hero section at the top of the homepage (requires exactly 5 images)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageGrid images={heroImages} loading={heroLoading} category="hero" />
              
              <div className="border-t pt-6">
                <Label htmlFor="hero-upload">Upload New Hero Images</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="hero-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => setHeroFiles(e.target.files)}
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => handleUpload('hero')}
                    disabled={!heroFiles || uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UploadIcon className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;