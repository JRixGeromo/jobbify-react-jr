'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, Grid, List, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logger } from '@/lib/logger';

import type { Quote, QuoteStats, QuoteStatus, QuoteView } from '@/types/quote';

const mockQuotes: Quote[] = [
  {
    id: 'Q001',
    client: 'Acme Corp',
    clientId: 'CLIENT001',
    date: '2024-02-08',
    amount: 1500.00,
    status: 'pending' as QuoteStatus,
    service: 'Web Development'
  },
  {
    id: 'Q002',
    client: 'TechStart Inc',
    clientId: 'CLIENT002',
    date: '2024-02-07',
    amount: 2500.00,
    status: 'approved' as QuoteStatus,
    service: 'Mobile App'
  }
];

const mockStats: QuoteStats = {
  total: 10,
  pending: 3,
  approved: 5,
  rejected: 2
};

const statuses: Record<QuoteStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

interface StatsCardsProps {
  stats: QuoteStats;
}

function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Total Quotes</h3>
        </div>
        <div className="text-2xl font-bold">{stats.total}</div>
      </div>
      {Object.entries(stats)
        .filter(([key]) => key !== 'total')
        .map(([status, count]) => (
          <div key={status} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium capitalize">{status}</h3>
            </div>
            <div className="text-2xl font-bold">{count}</div>
          </div>
        ))}
    </div>
  );
}

export function QuotesContent() {
  useEffect(() => {
    try {
      logger.info('QuotesPage mounted')
      return () => {
        logger.info('QuotesPage unmounted')
      }
    } catch (error) {
      console.error('Error in QuotesPage useEffect:', error)
    }
  }, [])

  const [view, setView] = useState<QuoteView>('list');
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-8">
      <div className="px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
            <p className="text-muted-foreground">Manage service quotes</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newView = view === "grid" ? "list" : "grid"
                logger.info('View changed:', { from: view, to: newView })
                setView(newView)
              }}>
              {view === "list" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Create Quote
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8">
          <StatsCards stats={mockStats} />

          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter quotes..."
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 px-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Status
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Amount
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Date
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-[200px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {view === "list" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <Link href={`/quotes/${quote.id}`} className="hover:underline">
                          {quote.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/clients/${quote.clientId}`} className="hover:underline">
                          {quote.client}
                        </Link>
                      </TableCell>
                      <TableCell>{quote.service}</TableCell>
                      <TableCell>{format(new Date(quote.date), "PP")}</TableCell>
                      <TableCell>${quote.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={cn(statuses[quote.status])}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockQuotes.map((quote) => (
                <div key={quote.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <Link href={`/quotes/${quote.id}`} className="font-medium hover:underline">
                        {quote.id}
                      </Link>
                      <Badge className={cn(statuses[quote.status])}>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground">Client</div>
                      <div className="font-medium">{quote.client}</div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground">Service</div>
                      <div className="font-medium">{quote.service}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="font-medium">${quote.amount.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="font-medium">{format(new Date(quote.date), "PP")}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-6 pt-0">
                    <Button variant="ghost" size="sm">View Details</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
