import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Link2, BarChart3, Trash2, Power, PowerOff } from 'lucide-react';
import { Deck } from '@/types/deck';
import { formatDistanceToNow } from 'date-fns';

interface DeckCardProps {
  deck: Deck;
  onViewAnalytics: (deckId: string) => void;
  onGetLink: (deckId: string) => void;
  onDelete: (deckId: string) => void;
  onToggleActive: (deckId: string, isActive: boolean) => void;
}

export function DeckCard({ deck, onViewAnalytics, onGetLink, onDelete, onToggleActive }: DeckCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold line-clamp-2 flex-1">{deck.name}</CardTitle>
          <Badge variant={deck.isActive ? 'default' : 'secondary'} className="ml-2">
            {deck.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Uploaded {formatDistanceToNow(new Date(deck.uploadDate), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{deck.totalViewers}</p>
              <p className="text-xs text-muted-foreground">Unique Viewers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-secondary">
            <BarChart3 className="h-5 w-5 text-secondary-foreground" />
            <div>
              <p className="text-2xl font-bold">{deck.totalOpens}</p>
              <p className="text-xs text-muted-foreground">Total Opens</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewAnalytics(deck._id)}
          className="flex-1 min-w-[120px]"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGetLink(deck._id)}
          className="flex-1 min-w-[120px]"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Get Link
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleActive(deck._id, !deck.isActive)}
          className="min-w-[40px]"
        >
          {deck.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(deck._id)}
          className="text-destructive hover:text-destructive min-w-[40px]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}