import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Image, Users, User, Link as LinkIcon } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GalleryCategory } from '@/types';
import { haptics } from '@/lib/haptics';

export function AdminGallery() {
  const { galleryImages, addGalleryImage, deleteGalleryImage } = useSalon();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('women');
  const [activeTab, setActiveTab] = useState<'women' | 'men'>('women');

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    
    haptics.success();
    addGalleryImage(newImageUrl.trim(), selectedCategory, newImageCaption.trim() || undefined);
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleDelete = (id: string) => {
    haptics.warning();
    if (confirm('Delete this image?')) {
      deleteGalleryImage(id);
    }
  };

  const womenImages = galleryImages.filter(img => img.category === 'women');
  const menImages = galleryImages.filter(img => img.category === 'men');
  const displayImages = activeTab === 'women' ? womenImages : menImages;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-display font-bold">Gallery</h1>
        <p className="text-muted-foreground mt-1">
          Manage photos shown on your website
        </p>
      </div>

      {/* Add New Image */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Photo
          </CardTitle>
          <CardDescription>
            Paste an image URL to add to your gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Category</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={selectedCategory === 'women' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('women')}
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Women
                </Button>
                <Button
                  type="button"
                  variant={selectedCategory === 'men' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('men')}
                  className="flex-1"
                >
                  <User className="w-4 h-4 mr-2" />
                  Men
                </Button>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Caption (optional)</Label>
              <Input
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                placeholder="e.g., Box Braids, Fade..."
                className="mt-2 h-12"
              />
            </div>
          </div>
          
          <div>
            <Label className="font-semibold">Image URL</Label>
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-12 pl-10"
                />
              </div>
              <Button 
                onClick={handleAddImage}
                disabled={!newImageUrl.trim()}
                className="h-12 px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use image URLs from Unsplash, Instagram, or any image hosting service
            </p>
          </div>

          {/* Preview */}
          {newImageUrl && (
            <div className="mt-4">
              <Label className="font-semibold mb-2 block">Preview</Label>
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-primary/30">
                <img 
                  src={newImageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Invalid+URL';
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'women' ? 'default' : 'outline'}
          onClick={() => setActiveTab('women')}
          className="flex-1 h-12"
        >
          <Users className="w-4 h-4 mr-2" />
          Women ({womenImages.length})
        </Button>
        <Button
          variant={activeTab === 'men' ? 'default' : 'outline'}
          onClick={() => setActiveTab('men')}
          className="flex-1 h-12"
        >
          <User className="w-4 h-4 mr-2" />
          Men ({menImages.length})
        </Button>
      </div>

      {/* Gallery Grid */}
      {displayImages.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No {activeTab}'s photos yet</p>
            <p className="text-sm text-muted-foreground">Add photos above to showcase your work</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-border">
                <img 
                  src={img.url} 
                  alt={img.caption || 'Gallery image'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Error';
                  }}
                />
              </div>
              {img.caption && (
                <p className="text-sm font-medium mt-2 text-center truncate">{img.caption}</p>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => handleDelete(img.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
