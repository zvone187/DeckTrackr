import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { MetricCard } from '@/components/analytics/MetricCard';
import { ViewersTable } from '@/components/analytics/ViewersTable';
import { getDeckAnalytics } from '@/api/decks';
import { DeckAnalytics } from '@/types/deck';
import { useToast } from '@/hooks/useToast';
import { Eye, MousePointerClick, Clock, BarChart3 } from 'lucide-react';

export function Analytics() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<DeckAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    if (!deckId) return;

    try {
      console.log('Loading analytics for deck:', deckId);
      const response = await getDeckAnalytics(deckId);
      setAnalytics(response.analytics);
      console.log('Analytics loaded');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics';
      console.error('Failed to load analytics:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [deckId, toast]);

  useEffect(() => {
    if (deckId) {
      loadAnalytics();
    }
  }, [deckId, loadAnalytics]);

  const handleViewDetails = (viewerId: string) => {
    console.log('Navigating to viewer details:', viewerId);
    navigate(`/deck/${deckId}/viewer/${viewerId}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Analytics not found</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">{analytics.deck.name}</h1>
          <p className="text-muted-foreground">Analytics Dashboard</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Viewers"
          value={analytics.totalViewers}
          icon={Eye}
          description="Unique email addresses"
        />
        <MetricCard
          title="Total Opens"
          value={analytics.totalOpens}
          icon={MousePointerClick}
          description="All viewing sessions"
        />
        <MetricCard
          title="Avg. Time Spent"
          value={formatTime(analytics.averageTimeSpent)}
          icon={Clock}
          description="Per viewing session"
        />
      </div>

      {/* Slide Engagement */}
      {analytics.slideEngagement && analytics.slideEngagement.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Slide Engagement</CardTitle>
            </div>
            <CardDescription>Views and average time spent per slide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.slideEngagement.map((slide) => (
                <div key={slide.pageNumber} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Slide {slide.pageNumber}</span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{slide.views} views</span>
                      <span className="font-medium text-foreground">
                        {Math.floor(slide.averageTime / 60)}m {slide.averageTime % 60}s avg
                      </span>
                    </div>
                  </div>
                  <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${(slide.views / Math.max(...analytics.slideEngagement.map(s => s.views))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Viewers Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Viewer Activity</h2>
        <ViewersTable viewers={analytics.viewers} onViewDetails={handleViewDetails} />
      </div>
    </div>
  );
}