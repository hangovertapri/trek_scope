'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import type { Trek } from '@/lib/types';

type NewTrekForm = {
  name: string;
  slug: string;
  region: string;
  difficulty: string;
  duration: number;
  price_min: number;
  price_max: number;
  images: string[];
  videoUrl: string;
  agencyId: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<NewTrekForm>({ name: '', slug: '', region: '', difficulty: 'Moderate', duration: 1, price_min: 0, price_max: 0, images: [], videoUrl: '', agencyId: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewTrekForm>>({});
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [editUploadingImages, setEditUploadingImages] = useState<string[]>([]);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === 'loading') return; // Wait for session to load
    
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      router.replace('/admin/login');
      return;
    }
    
    fetchTreks();
  }, [status, session, router]);

  // Handle image file upload for Add Trek form
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert('Please select valid image files');
        continue;
      }

      // Convert image to base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (isEdit) {
          setEditForm(prev => ({
            ...prev,
            images: [...(prev.images || []), dataUrl]
          }));
        } else {
          setForm(prev => ({
            ...prev,
            images: [...prev.images, dataUrl]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove image from form
  function removeImage(index: number, isEdit: boolean = false) {
    if (isEdit) {
      setEditForm(prev => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== index)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  }

  async function fetchTreks() {
    setLoading(true);
    const res = await fetch('/api/treks');
    const data = await res.json();
    setTreks(data);
    setLoading(false);
  }

  async function addTrek(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      region: form.region,
      difficulty: form.difficulty,
      duration: Number(form.duration),
      price_range: [Number(form.price_min), Number(form.price_max)],
      altitude: 0,
      best_season: [],
      permit_required: false,
      highlights: [],
      itinerary: [],
      images: form.images.length > 0 ? form.images : ['default-trek'],
      safety_tips: [],
      map_embed_url: form.videoUrl || '',
      description: '',
      overview: '',
      faq: [],
      agencyId: form.agencyId || undefined, // Admin can assign to agency or leave unassigned
    };
    const res = await fetch('/api/treks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      await fetchTreks();
      setForm({ name: '', slug: '', region: '', difficulty: 'Moderate', duration: 1, price_min: 0, price_max: 0, images: [], videoUrl: '', agencyId: '' });
    } else {
      alert('Failed to add trek');
    }
  }

  function startEdit(t: Trek) {
    setEditId(t.id);
    setEditForm({
      name: t.name,
      slug: t.slug,
      region: t.region,
      difficulty: t.difficulty,
      duration: t.duration,
      price_min: t.price_range?.[0] ?? 0,
      price_max: t.price_range?.[1] ?? 0,
      images: t.images || [],
      videoUrl: t.map_embed_url || '',
    });
  }

  function cancelEdit() {
    setEditId(null);
    setEditForm({});
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const patch: any = {};
    if (editForm.name !== undefined) patch.name = editForm.name;
    if (editForm.slug !== undefined) patch.slug = editForm.slug;
    if (editForm.region !== undefined) patch.region = editForm.region;
    if (editForm.difficulty !== undefined) patch.difficulty = editForm.difficulty as string;
    if (editForm.duration !== undefined) patch.duration = Number(editForm.duration);
    if (editForm.price_min !== undefined || editForm.price_max !== undefined) patch.price_range = [Number(editForm.price_min ?? 0), Number(editForm.price_max ?? 0)];
    if (editForm.images !== undefined) patch.images = editForm.images;
    if (editForm.videoUrl !== undefined) patch.map_embed_url = editForm.videoUrl;

    const res = await fetch('/api/treks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, patch }) });
    if (res.ok) {
      await fetchTreks();
      cancelEdit();
    } else {
      alert('Update failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this trek?')) return;
    const res = await fetch('/api/treks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok) await fetchTreks();
    else alert('Delete failed');
  }

  function logout() {
    signOut({ callbackUrl: '/admin/login', redirect: true });
  }

  // Show loading state while session is being checked
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage treks and agencies</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/agencies" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            📊 View Agencies
          </Link>
          <button onClick={logout} className="px-4 py-2 rounded bg-muted text-muted-foreground hover:bg-muted/90">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 bg-card p-4 rounded">
          <h2 className="font-semibold mb-3">Add Trek</h2>
          <form onSubmit={addTrek} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Trek Name *</label>
              <input placeholder="e.g., Everest Base Camp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL-friendly) *</label>
              <input placeholder="e.g., everest-base-camp" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Region *</label>
              <input placeholder="e.g., Khumbu" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty Level *</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900">
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Duration (days) *</label>
              <input type="number" placeholder="e.g., 14" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400" required min="1" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Min Price (USD)</label>
                <input type="number" placeholder="e.g., 1200" value={form.price_min} onChange={(e) => setForm({ ...form, price_min: Number(e.target.value) })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Price (USD)</label>
                <input type="number" placeholder="e.g., 1800" value={form.price_max} onChange={(e) => setForm({ ...form, price_max: Number(e.target.value) })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400" min="0" />
              </div>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <label className="block text-sm font-medium mb-2">Upload Images</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm cursor-pointer"
              />
              {form.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium">Uploaded Images ({form.images.length}):</p>
                  <div className="grid grid-cols-2 gap-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative bg-gray-100 rounded overflow-hidden">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx, false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t">
                <label className="block text-xs font-medium mb-2">Or add image URLs manually</label>
                <textarea 
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={form.images.filter(img => !img.startsWith('data:')).join(', ')} 
                  onChange={(e) => {
                    const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    const dataUrls = form.images.filter(img => img.startsWith('data:'));
                    setForm({ ...form, images: [...dataUrls, ...urls] });
                  }} 
                  className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400 text-xs h-12"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input 
                type="url"
                placeholder="https://www.youtube.com/embed/..."
                value={form.videoUrl} 
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} 
                className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Assign to Agency (Optional)</label>
              <input 
                type="text"
                placeholder="e.g., agency-1 (leave empty for admin-managed trek)"
                value={form.agencyId} 
                onChange={(e) => setForm({ ...form, agencyId: e.target.value })} 
                className="w-full border rounded px-2 py-1 bg-white text-gray-900 placeholder:text-gray-400 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Agencies can only edit their own treks. Admins can edit all.</p>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="px-3 py-1 bg-accent text-white rounded">Add</button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-card p-4 rounded">
          <h2 className="font-semibold mb-3">Treks</h2>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <ul className="space-y-3">
              {treks.map((t) => (
                <li key={t.id} className="flex items-center justify-between border-b py-2">
                  <div className="flex-1">
                    {editId === t.id ? (
                      <form onSubmit={submitEdit} className="space-y-2">
                        <div>
                          <label className="text-xs font-medium">Trek Name</label>
                          <input value={editForm.name ?? ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm mt-1" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-medium">Region</label>
                            <input value={editForm.region ?? ''} onChange={(e) => setEditForm({ ...editForm, region: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Difficulty</label>
                            <select value={editForm.difficulty ?? 'Moderate'} onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm mt-1">
                              <option value="Easy">Easy</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Challenging">Challenging</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium">Duration (days)</label>
                            <input type="number" value={editForm.duration ?? 1} onChange={(e) => setEditForm({ ...editForm, duration: Number(e.target.value) })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm mt-1" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Min Price (USD)</label>
                            <input type="number" value={editForm.price_min ?? 0} onChange={(e) => setEditForm({ ...editForm, price_min: Number(e.target.value) })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm mt-1" />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Max Price (USD)</label>
                            <input type="number" value={editForm.price_max ?? 0} onChange={(e) => setEditForm({ ...editForm, price_max: Number(e.target.value) })} className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-sm mt-1" />
                          </div>
                        </div>
                        
                        <div className="border-t pt-2 mt-2">
                          <label className="text-xs font-medium">Upload Images</label>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-xs cursor-pointer mt-1"
                          />
                          {(editForm.images && editForm.images.length > 0) && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs font-medium">Images ({editForm.images.length}):</p>
                              <div className="grid grid-cols-3 gap-1">
                                {editForm.images.map((img, idx) => (
                                  <div key={idx} className="relative bg-gray-100 rounded overflow-hidden">
                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-12 object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(idx, true)}
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-2 pt-2 border-t">
                            <label className="text-xs font-medium">Or add URLs</label>
                            <textarea 
                              value={(editForm.images || []).filter(img => !img.startsWith('data:')).join(', ')} 
                              onChange={(e) => {
                                const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                const dataUrls = (editForm.images || []).filter(img => img.startsWith('data:'));
                                setEditForm({ ...editForm, images: [...dataUrls, ...urls] });
                              }} 
                              className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-xs h-10 mt-1"
                              placeholder="URL1, URL2"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium">Video URL</label>
                          <input 
                            type="url"
                            value={editForm.videoUrl ?? ''} 
                            onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })} 
                            className="w-full border rounded px-2 py-1 bg-white text-gray-900 text-xs mt-1"
                            placeholder="https://..."
                          />
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={cancelEdit} className="px-2 py-1 bg-gray-200 rounded">Cancel</button>
                          <button type="submit" className="px-2 py-1 bg-accent text-white rounded">Save</button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.region} • {t.difficulty} • {t.duration} days</div>
                        {t.agencyId && <div className="text-xs text-blue-600 mt-1">🏢 Agency: {t.agencyId}</div>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {editId !== t.id && (
                      <>
                        <button onClick={() => startEdit(t)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
