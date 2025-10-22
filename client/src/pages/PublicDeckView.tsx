import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EmailCaptureForm } from '@/components/viewer/EmailCaptureForm';
import { DeckViewer } from '@/components/viewer/DeckViewer';
import { getPublicDeck, submitViewerEmail, startViewingSession, endViewingSession } from '@/api/viewer';
import { useToast } from '@/hooks/useToast';

export function PublicDeckView() {
  const { deckId } = useParams<{ deckId: string }>();
  const { toast } = useToast();
  const [deckName, setDeckName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (deckId) {
      loadDeck();
      checkExistingViewer();
    }
  }, [deckId]);

  const loadDeck = async () => {
    if (!deckId) return;

    try {
      console.log('Loading public deck:', deckId);
      const response = await getPublicDeck(deckId);
      setDeckName(response.deck.name);
      setPageCount(response.deck.pageCount);
      setIsActive(response.deck.isActive);
      console.log('Deck loaded:', response.deck.name);
    } catch (error: any) {
      console.error('Failed to load deck:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deck',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkExistingViewer = () => {
    const storedViewerId = localStorage.getItem(`viewer_${deckId}`);
    if (storedViewerId) {
      console.log('Found existing viewer:', storedViewerId);
      setViewerId(storedViewerId);
      startSession(storedViewerId);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    if (!deckId) return;

    setSubmitting(true);
    try {
      console.log('Submitting viewer email:', email);
      const response = await submitViewerEmail({ deckId, email });
      const newViewerId = response.viewerId;
      setViewerId(newViewerId);
      localStorage.setItem(`viewer_${deckId}`, newViewerId);
      console.log('Viewer registered:', newViewerId);
      await startSession(newViewerId);
    } catch (error: any) {
      console.error('Failed to submit email:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startSession = async (vId: string) => {
    if (!deckId) return;

    try {
      console.log('Starting viewing session');
      const response = await startViewingSession({ deckId, viewerId: vId });
      setSessionId(response.sessionId);
      console.log('Session started:', response.sessionId);
    } catch (error: any) {
      console.error('Failed to start session:', error);
    }
  };

  const handleClose = async () => {
    if (sessionId) {
      try {
        console.log('Ending viewing session');
        await endViewingSession(sessionId);
        console.log('Session ended');
      } catch (error: any) {
        console.error('Failed to end session:', error);
      }
    }
    window.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4 max-w-md p-8">
          <h1 className="text-3xl font-bold">Deck Not Available</h1>
          <p className="text-muted-foreground">
            This deck is no longer available or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (!viewerId || !sessionId) {
    return (
      <EmailCaptureForm
        deckName={deckName}
        onSubmit={handleEmailSubmit}
        isLoading={submitting}
      />
    );
  }

  return (
    <DeckViewer
      deckId={deckId!}
      viewerId={viewerId}
      sessionId={sessionId}
      pageCount={pageCount}
      deckName={deckName}
      onClose={handleClose}
    />
  );
}