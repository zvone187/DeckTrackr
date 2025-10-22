import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Calendar, Clock, MousePointerClick } from 'lucide-react';
import { MetricCard } from '@/components/analytics/MetricCard';
import { SessionTimeline } from '@/components/analytics/SessionTimeline';
import { getViewerDetails } from '@/api/decks';
import { ViewerDetails as ViewerDetailsType } from '@/types/deck';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';

export function ViewerDetails() {
  const { deckId, viewerId } = useParams<{ deckId: string; viewerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewerDetails, setViewerDetails] = useState<ViewerDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadViewerDetails = useCallback(async () => {
    if (!deckId || !viewerId) return;

    try {
      console.log('Loading viewer details:', viewerId);
      const response = await getViewerDetails(deckId, viewerId);
      setViewerDetails(response.viewerDetails);
      console.log('Viewer details loaded');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load viewer details';
      console.error('Failed to load viewer details:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [deckId, viewerId, toast]);

  useEffect(() => {
    if (deckId && viewerId) {
      loadViewerDetails();
    }
  }, [deckId, viewerId, loadViewerDetails]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading viewer details...</p>
        </div>
      </div>
    );
  }

  if (!viewerDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Viewer details not found</p>
          <Button onClick={() => navigate(`/deck/${deckId}/analytics`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analytics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(`/deck/${deckId}/analytics`)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{viewerDetails.viewer.email}</h1>
            <p className="text-muted-foreground">Viewer Activity Details</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="First Opened"
          value={format(new Date(viewerDetails.viewer.firstOpened), 'MMM dd, yyyy')}
          icon={Calendar}
          description={format(new Date(viewerDetails.viewer.firstOpened), 'h:mm a')}
        />
        <MetricCard
          title="Last Opened"
          value={format(new Date(viewerDetails.viewer.lastOpened), 'MMM dd, yyyy')}
          icon={Calendar}
          description={format(new Date(viewerDetails.viewer.lastOpened), 'h:mm a')}
        />
        <MetricCard
          title="Total Opens"
          value={viewerDetails.viewer.totalOpens}
          icon={MousePointerClick}
          description="Viewing sessions"
        />
        <MetricCard
          title="Total Time"
          value={formatTime(viewerDetails.viewer.totalTimeSpent)}
          icon={Clock}
          description="Across all sessions"
        />
      </div>

      {/* Sessions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Viewing Sessions</h2>
        <SessionTimeline sessions={viewerDetails.sessions} />
      </div>
    </div>
  );
}