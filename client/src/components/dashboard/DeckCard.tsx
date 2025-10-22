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
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-emerald-200/60 dark:border-emerald-800/60 hover:border-emerald-400 dark:hover:border-emerald-600 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-emerald-950/50 dark:via-teal-950/30 dark:to-green-950/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold line-clamp-2 flex-1 text-emerald-900 dark:text-emerald-100">{deck.name}</CardTitle>
          <Badge variant={deck.isActive ? 'default' : 'secondary'} className={deck.isActive ? 'ml-2 bg-emerald-600 hover:bg-emerald-700' : 'ml-2'}>
            {deck.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          Uploaded {formatDistanceToNow(new Date(deck.uploadDate), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-300/50 dark:border-emerald-700/50">
            <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{deck.totalViewers}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Unique Viewers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-100/70 dark:bg-teal-900/40 border border-teal-300/50 dark:border-teal-700/50">
            <BarChart3 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{deck.totalOpens}</p>
              <p className="text-xs text-teal-700 dark:text-teal-400">Total Opens</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewAnalytics(deck._id)}
          className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGetLink(deck._id)}
          className="flex-1 min-w-[120px] border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Get Link
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleActive(deck._id, !deck.isActive)}
          className="min-w-[40px] hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
        >
          {deck.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(deck._id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 min-w-[40px]"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}