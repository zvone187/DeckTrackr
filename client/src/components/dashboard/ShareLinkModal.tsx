import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface ShareLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: string;
}

export function ShareLinkModal({ open, onOpenChange, link }: ShareLinkModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    console.log('Link copied to clipboard:', link);
    toast({
      title: 'Link copied!',
      description: 'The shareable link has been copied to your clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">Share Your Deck</DialogTitle>
          <DialogDescription>
            Copy this link and share it with investors. They'll be prompted to enter their email before viewing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={link}
              readOnly
              className="flex-1 font-mono text-sm"
            />
            <Button onClick={copyToClipboard} className="shrink-0">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="bg-secondary/30 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Each time someone opens this link, their activity will be tracked and visible in your analytics dashboard.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}