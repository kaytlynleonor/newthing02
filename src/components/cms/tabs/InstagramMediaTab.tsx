import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, RefreshCw } from 'lucide-react';
import { fetchInstagramPosts, addInstagramPost, deleteInstagramPost, InstagramPost } from '../../../lib/instagramPosts';

export const InstagramMediaTab: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchInstagramPosts();
      setPosts(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load Instagram posts';
      alert(msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this Instagram post?')) return;
    setDeletingId(id);
    try {
      await deleteInstagramPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Delete failed';
      alert(msg);
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg uppercase tracking-[0.2em]">Instagram Media</h2>
        <button onClick={load} className="flex items-center gap-1.5 text-xs uppercase tracking-wider border border-[#EEE8DF] bg-white px-3 py-2 hover:bg-[#F5F1EB]">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} /> Loading Instagram posts...
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-sm text-[#A99684] py-8">No Instagram posts saved.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {posts.map(p => (
            <li key={p.id} className="flex items-center justify-between p-2 border border-[#EEE8DF] bg-white">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm underline text-[#11100E]">
                {p.url}
              </a>
              <button onClick={() => handleDelete(p.id)} disabled={deletingId===p.id} className="p-1 text-red-600">
                {deletingId===p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};