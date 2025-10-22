import { ViewingSession } from '@/types/deck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, ArrowRight } from 'lucide-react';

interface SessionTimelineProps {
  sessions: ViewingSession[];
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <Card key={session._id} className="border-2 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Session {sessions.length - index}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDuration(session.duration)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(session.startTime), 'MMM dd, yyyy \'at\' h:mm a')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {session.slideNavigations.map((nav, navIndex) => (
                <div
                  key={navIndex}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {nav.fromSlide && (
                      <>
                        <span className="text-sm font-medium text-muted-foreground">
                          Slide {nav.fromSlide}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                    <span className="text-sm font-bold">
                      Slide {nav.slideNumber}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDuration(nav.timeSpent)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}