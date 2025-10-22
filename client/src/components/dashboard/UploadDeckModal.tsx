import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X } from 'lucide-react';
import { uploadDeck } from '@/api/decks';
import { useToast } from '@/hooks/useToast';

interface UploadDeckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  file: FileList;
}

export function UploadDeckModal({ open, onOpenChange, onSuccess }: UploadDeckModalProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a PDF file',
        variant: 'destructive',
      });
      return;
    }

    console.log('Starting deck upload:', data.name);
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', selectedFile);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await uploadDeck(formData);
      setUploadProgress(100);
      console.log('Deck uploaded successfully');
      toast({
        title: 'Success',
        description: 'Deck uploaded successfully',
      });
      reset();
      setSelectedFile(null);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload deck';
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF file',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 50MB',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue('file', [] as unknown as FileList);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload New Deck</DialogTitle>
          <DialogDescription>
            Upload your pitch deck PDF to start tracking investor engagement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Deck Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Series A Pitch Deck"
                {...register('name', { required: 'Deck name is required' })}
                disabled={uploading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>PDF File *</Label>
              {!selectedFile ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="file-upload"
                    {...register('file', { required: 'PDF file is required' })}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF only, max 50MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.file && (
                <p className="text-sm text-destructive">{errors.file.message}</p>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || !selectedFile}>
              {uploading ? 'Uploading...' : 'Upload Deck'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}