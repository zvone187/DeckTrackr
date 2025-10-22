import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { MetricCard } from '@/components/analytics/MetricCard';
import { ViewersTable } from '@/components/analytics/ViewersTable';
import { getDeckAnalytics, exportAnalytics } from '@/api/decks';
import { DeckAnalytics } from '@/types/deck';
import { useToast } from '@/hooks/useToast';
import { Eye, MousePointerClick, Clock, TrendingUp, TrendingDown } from 'lucide-react';

export function Analytics() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<DeckAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deckId) {
      loadAnalytics();
    }
  }, [deckId]);

  const loadAnalytics = async () => {
    if (!deckId) return;

    try {
      console.log('Loading analytics for deck:', deckId);
      const response = await getDeckAnalytics(deckId);
      setAnalytics(response.analytics);
      console.log('Analytics loaded');
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (viewerId: string) => {
    console.log('Navigating to viewer details:', viewerId);
    navigate(`/deck/${deckId}/viewer/${viewerId}`);
  };

  const handleExport = async () => {
    if (!deckId) return;

    try {
      console.log('Exporting analytics...');
      const blob = await exportAnalytics(deckId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${analytics?.deck.name || 'deck'}-analytics.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Success',
        description: 'Analytics exported successfully',
      });
    } catch (error: any) {
      console.error('Failed to export analytics:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
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
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <MetricCard
          title="Most Viewed Slide"
          value={`Slide ${analytics.mostViewedSlide}`}
          icon={TrendingUp}
          description="Highest engagement"
        />
      </div>

      {/* Drop-off Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-destructive/10">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold">Drop-off Point</h3>
              <p className="text-sm text-muted-foreground">Where viewers typically stop</p>
            </div>
          </div>
          <p className="text-3xl font-bold">Slide {analytics.dropOffSlide}</p>
        </div>

        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Engagement Rate</h3>
              <p className="text-sm text-muted-foreground">Viewers who completed the deck</p>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {Math.round((analytics.mostViewedSlide / analytics.deck.pageCount) * 100)}%
          </p>
        </div>
      </div>

      {/* Viewers Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Viewer Activity</h2>
        <ViewersTable viewers={analytics.viewers} onViewDetails={handleViewDetails} />
      </div>
    </div>
  );
}