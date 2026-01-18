'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, DollarSign, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { Trek, AgentTrekOffer } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AgentOffersPage() {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [treks, setTreks] = useState<Trek[]>([]);
  const [myOffers, setMyOffers] = useState<AgentTrekOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<AgentTrekOffer | null>(null);
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    price_usd: '',
    group_size_min: '1',
    group_size_max: '10',
    availability_start: '',
    availability_end: '',
    includes: '',
    excludes: '',
    custom_notes: '',
    booking_terms: '',
  });

  // Protect route
  useEffect(() => {
    if (session.status === 'loading') return;
    
    if (session.status === 'unauthenticated') {
      router.push('/agency/login');
    } else if (session.data?.user?.role !== 'agency') {
      router.push('/');
    } else {
      loadData();
    }
  }, [session.status, session.data?.user?.role, router]);

  async function loadData() {
    try {
      setLoading(true);
      
      // Fetch all treks
      const treksRes = await fetch('/api/treks');
      const allTreks = await treksRes.json();
      setTreks(allTreks);
      
      // Fetch my offers
      const offersRes = await fetch(`/api/agent-offers?agentId=${session.data?.user?.id}`);
      const offers = await offersRes.json();
      setMyOffers(offers);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load trek offers',
      });
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog(trek: Trek) {
    setSelectedTrek(trek);
    setEditingOffer(null);
    setFormData({
      price_usd: '',
      group_size_min: '1',
      group_size_max: '10',
      availability_start: '',
      availability_end: '',
      includes: '',
      excludes: '',
      custom_notes: '',
      booking_terms: '50% deposit required. Cancellation policy applies.',
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(offer: AgentTrekOffer) {
    const trek = treks.find(t => t.id === offer.trek_id);
    setSelectedTrek(trek || null);
    setEditingOffer(offer);
    setFormData({
      price_usd: String(offer.price_usd),
      group_size_min: String(offer.group_size_min),
      group_size_max: String(offer.group_size_max),
      availability_start: offer.availability_start.split('T')[0],
      availability_end: offer.availability_end.split('T')[0],
      includes: offer.includes.join('\n'),
      excludes: offer.excludes.join('\n'),
      custom_notes: offer.custom_notes,
      booking_terms: offer.booking_terms,
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedTrek) return;

    const payload = {
      trek_id: selectedTrek.id,
      trek_slug: selectedTrek.slug,
      price_usd: parseFloat(formData.price_usd),
      group_size_min: parseInt(formData.group_size_min),
      group_size_max: parseInt(formData.group_size_max),
      availability_start: new Date(formData.availability_start).toISOString(),
      availability_end: new Date(formData.availability_end).toISOString(),
      includes: formData.includes.split('\n').filter(s => s.trim()),
      excludes: formData.excludes.split('\n').filter(s => s.trim()),
      custom_notes: formData.custom_notes,
      booking_terms: formData.booking_terms,
    };

    try {
      const url = editingOffer
        ? `/api/agent-offers/${editingOffer.id}`
        : '/api/agent-offers';
      const method = editingOffer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save offer');

      toast({
        title: 'Success',
        description: `Offer ${editingOffer ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save offer',
      });
    }
  }

  async function handleDelete(offerId: string) {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const res = await fetch(`/api/agent-offers/${offerId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete offer');

      toast({
        title: 'Success',
        description: 'Offer deleted successfully',
      });

      loadData();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete offer',
      });
    }
  }

  function hasOffer(trekId: string): boolean {
    return myOffers.some(o => o.trek_id === trekId && o.active);
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Trek Offerings</h1>
        <p className="text-muted-foreground">
          Manage which treks you offer and set your pricing
        </p>
      </div>

      {/* My Active Offers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Offerings ({myOffers.filter(o => o.active).length})</CardTitle>
          <CardDescription>Treks you currently offer to customers</CardDescription>
        </CardHeader>
        <CardContent>
          {myOffers.filter(o => o.active).length === 0 ? (
            <p className="text-muted-foreground">You don&apos;t have any active offerings yet. Browse available treks below to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trek Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Group Size</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOffers.filter(o => o.active).map((offer) => {
                  const trek = treks.find(t => t.id === offer.trek_id);
                  return (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        {trek?.name || offer.trek_slug}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          {offer.price_usd}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {offer.group_size_min}-{offer.group_size_max}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(offer.availability_start).toLocaleDateString()} - {new Date(offer.availability_end).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(offer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(offer.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Available Treks Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Available Treks Catalog</CardTitle>
          <CardDescription>Browse all treks and add them to your offerings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {treks.map((trek) => {
              const isOffered = hasOffer(trek.id);
              return (
                <Card key={trek.id} className={isOffered ? 'border-green-500' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg">{trek.name}</CardTitle>
                    <CardDescription>
                      {trek.region} · {trek.duration} days · {trek.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {isOffered ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Offering
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          Not Offered
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={isOffered ? 'outline' : 'default'}
                        onClick={() => openCreateDialog(trek)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {isOffered ? 'Add Another' : 'Offer Trek'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? 'Edit Offer' : 'Create New Offer'} - {selectedTrek?.name}
            </DialogTitle>
            <DialogDescription>
              Set your pricing and package details for this trek
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price_usd}
                  onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min">Min Group Size</Label>
                  <Input
                    id="min"
                    type="number"
                    required
                    min="1"
                    value={formData.group_size_min}
                    onChange={(e) => setFormData({ ...formData, group_size_min: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="max">Max Group Size</Label>
                  <Input
                    id="max"
                    type="number"
                    required
                    min="1"
                    value={formData.group_size_max}
                    onChange={(e) => setFormData({ ...formData, group_size_max: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Availability Start</Label>
                <Input
                  id="start"
                  type="date"
                  required
                  value={formData.availability_start}
                  onChange={(e) => setFormData({ ...formData, availability_start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end">Availability End</Label>
                <Input
                  id="end"
                  type="date"
                  required
                  value={formData.availability_end}
                  onChange={(e) => setFormData({ ...formData, availability_end: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="includes">What&apos;s Included (one per line)</Label>
              <Textarea
                id="includes"
                rows={5}
                placeholder="Professional guide&#10;All permits&#10;3 meals per day&#10;Accommodation"
                value={formData.includes}
                onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="excludes">What&apos;s Not Included (one per line)</Label>
              <Textarea
                id="excludes"
                rows={4}
                placeholder="International flights&#10;Travel insurance&#10;Personal expenses"
                value={formData.excludes}
                onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Custom Notes (Optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Any special notes about your service..."
                value={formData.custom_notes}
                onChange={(e) => setFormData({ ...formData, custom_notes: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="terms">Booking Terms</Label>
              <Textarea
                id="terms"
                rows={2}
                required
                placeholder="e.g., 50% deposit required. Free cancellation up to 30 days."
                value={formData.booking_terms}
                onChange={(e) => setFormData({ ...formData, booking_terms: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
