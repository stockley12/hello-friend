import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Image, Users, User, Upload, Video, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GalleryCategory, MediaType } from '@/types';
import { haptics } from '@/lib/haptics';
import { toast } from 'sonner';

export function AdminGallery() {
  const { galleryImages, addGalleryImage, deleteGalleryImage, uploadGalleryFile } = useSalon();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('women');
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>('image');
  const [activeTab, setActiveTab] = useState<'women' | 'men'>('women');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Determine media type from file
    const isVideo = file.type.startsWith('video/');
    const mediaType: MediaType = isVideo ? 'video' : 'image';

    setIsUploading(true);
    haptics.medium();

    try {
      const url = await uploadGalleryFile(file, selectedCategory);
      if (url) {
        await addGalleryImage(url, selectedCategory, mediaType, newImageCaption.trim() || undefined);
        toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully!`);
        setNewImageCaption('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error('Failed to upload file. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = async () => {
    if (!newImageUrl.trim()) return;
    
    haptics.success();
    setIsUploading(true);
    
    try {
      await addGalleryImage(newImageUrl.trim(), selectedCategory, selectedMediaType, newImageCaption.trim() || undefined);
      toast.success('Media added successfully!');
      setNewImageUrl('');
      setNewImageCaption('');
    } catch (error) {
      toast.error('Failed to add media.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    haptics.warning();
    if (confirm('Delete this media? This cannot be undone.')) {
      try {
        await deleteGalleryImage(id, url);
        toast.success('Media deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete media.');
      }
    }
  };

  const womenMedia = galleryImages.filter(img => img.category === 'women');
  const menMedia = galleryImages.filter(img => img.category === 'men');
  const displayMedia = activeTab === 'women' ? womenMedia : menMedia;
  const images = displayMedia.filter(m => m.mediaType === 'image' || !m.mediaType);
  const videos = displayMedia.filter(m => m.mediaType === 'video');

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-display font-bold">Gallery & Media</h1>
        <p className="text-muted-foreground mt-1">
          Manage photos and videos shown on your website
        </p>
      </div>

      {/* Add New Media */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Media
          </CardTitle>
          <CardDescription>
            Upload images or videos to showcase your work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Upload Mode Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={uploadMode === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMode('file')}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              type="button"
              variant={uploadMode === 'url' ? 'default' : 'outline'}
              onClick={() => setUploadMode('url')}
              className="flex-1"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Paste URL
            </Button>
          </div>

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

          {uploadMode === 'file' ? (
            <div>
              <Label className="font-semibold">Upload Image or Video</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isUploading 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                      <span className="text-sm text-primary font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload image or video</span>
                      <span className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF, MP4, WebM (max 50MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          ) : (
            <>
              {/* Media Type for URL */}
              <div>
                <Label className="font-semibold">Media Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={selectedMediaType === 'image' ? 'default' : 'outline'}
                    onClick={() => setSelectedMediaType('image')}
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMediaType === 'video' ? 'default' : 'outline'}
                    onClick={() => setSelectedMediaType('video')}
                    className="flex-1"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Media URL</Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder={selectedMediaType === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                      className="h-12 pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleAddUrl}
                    disabled={!newImageUrl.trim() || isUploading}
                    className="h-12 px-6"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                    Add
                  </Button>
                </div>
              </div>

              {/* Preview */}
              {newImageUrl && (
                <div className="mt-4">
                  <Label className="font-semibold mb-2 block">Preview</Label>
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-primary/30">
                    {selectedMediaType === 'video' ? (
                      <video 
                        src={newImageUrl} 
                        className="w-full h-full object-cover"
                        muted
                        onError={(e) => {
                          (e.target as HTMLVideoElement).poster = 'https://via.placeholder.com/128?text=Invalid+URL';
                        }}
                      />
                    ) : (
                      <img 
                        src={newImageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Invalid+URL';
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
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
          Women ({womenMedia.length})
        </Button>
        <Button
          variant={activeTab === 'men' ? 'default' : 'outline'}
          onClick={() => setActiveTab('men')}
          className="flex-1 h-12"
        >
          <User className="w-4 h-4 mr-2" />
          Men ({menMedia.length})
        </Button>
      </div>

      {/* Images Section */}
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Image className="w-5 h-5 text-primary" />
          Images ({images.length})
        </h3>
        {images.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-8 text-center">
              <Image className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">No {activeTab}'s photos yet</p>
              <p className="text-sm text-muted-foreground">Upload photos above to showcase your work</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
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
                  className="absolute top-2 right-2 h-8 w-8 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={() => handleDelete(img.id, img.url)}
                  aria-label="Delete media"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-primary" />
          Videos ({videos.length})
        </h3>
        {videos.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-8 text-center">
              <Video className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">No {activeTab}'s videos yet</p>
              <p className="text-sm text-muted-foreground">Upload videos above to showcase your work</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((vid, index) => (
              <motion.div
                key={vid.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-border bg-black">
                  <video 
                    src={vid.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:opacity-0 transition-opacity">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                {vid.caption && (
                  <p className="text-sm font-medium mt-2 text-center truncate">{vid.caption}</p>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={() => handleDelete(vid.id, vid.url)}
                  aria-label="Delete media"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
