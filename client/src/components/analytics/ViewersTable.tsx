import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeckViewer } from '@/types/deck';
import { formatDistanceToNow } from 'date-fns';
import { Search, ArrowUpDown, Eye } from 'lucide-react';

interface ViewersTableProps {
  viewers: DeckViewer[];
  onViewDetails: (viewerId: string) => void;
}

export function ViewersTable({ viewers, onViewDetails }: ViewersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'email' | 'totalOpens' | 'totalTimeSpent' | 'lastOpened'>('lastOpened');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredViewers = viewers.filter((viewer) =>
    viewer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedViewers = [...filteredViewers].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'lastOpened' || sortField === 'email') {
      aValue = aValue.toString();
      bValue = bValue.toString();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatTime = (seconds: number) => {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('email')}
                  className="font-semibold"
                >
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>First Opened</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('lastOpened')}
                  className="font-semibold"
                >
                  Last Opened
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('totalOpens')}
                  className="font-semibold"
                >
                  Opens
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('totalTimeSpent')}
                  className="font-semibold"
                >
                  Time Spent
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedViewers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No viewers found
                </TableCell>
              </TableRow>
            ) : (
              sortedViewers.map((viewer) => (
                <TableRow key={viewer._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{viewer.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(viewer.firstOpened), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(viewer.lastOpened), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {viewer.totalOpens}
                    </span>
                  </TableCell>
                  <TableCell>{formatTime(viewer.totalTimeSpent)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(viewer._id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}