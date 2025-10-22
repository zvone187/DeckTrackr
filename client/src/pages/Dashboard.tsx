import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { DeckCard } from '@/components/dashboard/DeckCard';
import { UploadDeckModal } from '@/components/dashboard/UploadDeckModal';
import { ShareLinkModal } from '@/components/dashboard/ShareLinkModal';
import { DeleteConfirmModal } from '@/components/dashboard/DeleteConfirmModal';
import { getDecks, deleteDeck, updateDeck, getDeckLink } from '@/api/decks';
import { Deck } from '@/types/deck';
import { useToast } from '@/hooks/useToast';

export function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareLinkModalOpen, setShareLinkModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [shareLink, setShareLink] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadDecks = useCallback(async () => {
    try {
      console.log('Loading decks...');
      const response = await getDecks();
      setDecks(response.decks);
      console.log('Decks loaded:', response.decks.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load decks';
      console.error('Failed to load decks:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDecks();
  }, [loadDecks]);

  const handleViewAnalytics = (deckId: string) => {
    console.log('Navigating to analytics for deck:', deckId);
    navigate(`/deck/${deckId}/analytics`);
  };

  const handleGetLink = (deckId: string) => {
    const deck = decks.find((d) => d._id === deckId);
    if (deck) {
      const link = `${window.location.origin}/view/${deck._id}`;
      console.log('Generated share link for deck:', deckId);
      setShareLink(link);
      setShareLinkModalOpen(true);
    } else {
      toast({
        title: 'Error',
        description: 'Unable to generate share link',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = (deckId: string) => {
    const deck = decks.find((d) => d._id === deckId);
    if (deck) {
      setSelectedDeck(deck);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDeck) return;

    try {
      console.log('Deleting deck:', selectedDeck._id);
      await deleteDeck(selectedDeck._id);
      setDecks(decks.filter((d) => d._id !== selectedDeck._id));
      toast({
        title: 'Success',
        description: 'Deck deleted successfully',
      });
      setDeleteModalOpen(false);
      setSelectedDeck(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete deck';
      console.error('Failed to delete deck:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (deckId: string, isActive: boolean) => {
    try {
      console.log('Toggling deck active status:', deckId, isActive);
      const response = await updateDeck(deckId, { isActive });
      setDecks(decks.map((d) => (d._id === deckId ? response.deck : d)));
      toast({
        title: 'Success',
        description: `Deck ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update deck';
      console.error('Failed to update deck:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your decks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Decks</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your pitch decks
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Upload New Deck
        </Button>
      </div>

      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">No decks yet</h2>
            <p className="text-muted-foreground max-w-md">
              Upload your first pitch deck to start tracking investor engagement
            </p>
          </div>
          <Button onClick={() => setUploadModalOpen(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Upload Your First Deck
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard
              key={deck._id}
              deck={deck}
              onViewAnalytics={handleViewAnalytics}
              onGetLink={handleGetLink}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

      <UploadDeckModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={loadDecks}
      />

      <ShareLinkModal
        open={shareLinkModalOpen}
        onOpenChange={setShareLinkModalOpen}
        link={shareLink}
      />

      {selectedDeck && (
        <DeleteConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={confirmDelete}
          deckName={selectedDeck.name}
        />
      )}
    </div>
  );
}