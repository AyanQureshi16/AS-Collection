import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Image, Search, Plus } from "lucide-react";
import { useMedia } from "../../context/MediaContext";
import Pagination from "../../components/admin/Pagination";
import EmptyState from "../../components/admin/EmptyState";
import toast from "react-hot-toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function humanSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(2)} ${units[i]}`;
}

export default function Media() {
  const { media, isLoading, addMedia, updateMedia, deleteMedia } = useMedia();
  const fileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [viewItem, setViewItem] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [dragOver, setDragOver] = useState(false);

  useEffect(() => setCurrentPage(1), [searchQuery, filterType, sortBy]);

  const stats = useMemo(() => {
    const total = media.length;
    const images = media.filter((m) => (m.mimeType || "").startsWith("image/")).length;
    const others = total - images;
    const totalBytes = media.reduce((s, m) => s + (m.size || 0), 0);
    return { total, images, others, totalBytes };
  }, [media]);

  const filteredAndSorted = useMemo(() => {
    let list = Array.isArray(media) ? [...media] : [];
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => (m.name || "").toLowerCase().includes(q) || (m.mimeType || "").toLowerCase().includes(q));
    }
    if (filterType === "images") list = list.filter((m) => (m.mimeType || "").startsWith("image/"));

    switch (sortBy) {
      case "newest": list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "oldest": list.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case "name-asc": list.sort((a,b) => (a.name||"").localeCompare(b.name||"")); break;
      case "name-desc": list.sort((a,b) => (b.name||"").localeCompare(a.name||"")); break;
      case "largest": list.sort((a,b) => (b.size||0) - (a.size||0)); break;
      case "smallest": list.sort((a,b) => (a.size||0) - (b.size||0)); break;
      default: break;
    }
    return list;
  }, [media, searchQuery, filterType, sortBy]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages]);

  const onPickFile = (files) => {
    if (!files || !files.length) return;
    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) { toast.error("Unsupported file type"); return; }
    if (file.size > MAX_SIZE) { toast.error("File is too large (max 5MB)"); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      // get dimensions
      const img = new Image();
      img.onload = function() {
        const width = img.width;
        const height = img.height;
        const item = {
          name: file.name,
          type: "image",
          url: dataUrl,
          size: file.size,
          width,
          height,
          mimeType: file.type,
        };
        addMedia(item);
        toast.success("Media uploaded");
        setCurrentPage(1);
      };
      img.onerror = function() {
        toast.error("Failed to read image");
      };
      img.src = dataUrl;
    };
    reader.onerror = () => toast.error("Failed to read file");
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => fileInputRef.current && fileInputRef.current.click();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    onPickFile(files);
  };

  const attemptRename = (item) => { setRenameTarget(item); setRenameValue(item.name || ""); };
  const confirmRename = () => {
    if (!renameValue || !renameValue.trim()) { toast.error("Name is required"); return; }
    updateMedia(renameTarget.id, { name: renameValue });
    toast.success("Name updated");
    setRenameTarget(null);
  };

  const attemptDelete = (item) => setDeleteTarget(item);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMedia(deleteTarget.id);
    toast.success("Media deleted");
    setDeleteTarget(null);
    setTimeout(() => setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil((media.length - 1) / itemsPerPage)))), 0);
  };

  const copyUrl = async (u) => {
    try { await navigator.clipboard.writeText(u); toast.success("URL copied to clipboard\nNote: this URL is local to this browser/session and not publicly hosted"); }
    catch (err) { toast.error("Failed to copy URL"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-1"><span>Admin</span><span className="text-white/30">/</span><span>Media</span></div>
          <h1 className="font-poppins font-bold text-white text-2xl">Media Library</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search media..." className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-64" />
          </div>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option value="">All</option>
            <option value="images">Images</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A - Z</option>
            <option value="name-desc">Name Z - A</option>
            <option value="largest">Largest</option>
            <option value="smallest">Smallest</option>
          </select>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openFilePicker} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm hover:bg-gold-light transition-all">
            <Plus size={18} /> Upload Media
          </motion.button>
          <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={(e) => onPickFile(e.target.files)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass gold-border rounded-2xl p-4">
            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`p-6 rounded-xl border-2 border-dashed ${dragOver ? "border-gold/50 bg-white/5" : "border-white/10"}`}>
              <div className="flex items-center justify-center gap-4">
                <div className="text-white/50">Drag & drop files here or</div>
                <button onClick={openFilePicker} className="px-4 py-2 rounded-xl bg-white/5 text-white">Select file</button>
              </div>
              <div className="mt-2 text-white/50 text-sm">Accepted: JPEG, PNG, WEBP, GIF. Max size: 5MB. Images will be stored locally in this browser.</div>
            </div>

            {isLoading ? (
              <div className="p-6">Loading...</div>
            ) : totalItems === 0 ? (
              <div className="p-6"><EmptyState message={searchQuery || filterType ? "No media found" : undefined} onAdd={openFilePicker} /></div>
            ) : (
              <>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAndSorted.slice((currentPage -1)*itemsPerPage, currentPage*itemsPerPage).map((m) => (
                    <div key={m.id} className="bg-primary rounded-lg p-3 flex flex-col">
                      <div className="w-full h-36 bg-white/5 rounded-md overflow-hidden flex items-center justify-center">
                        {m.url ? <img src={m.url} alt={m.name} className="object-cover w-full h-full" /> : <div className="text-white/40">No preview</div>}
                      </div>
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-white text-sm font-semibold truncate">{m.name}</div>
                          <div className="text-white/50 text-xs">{m.mimeType} • {m.width ? `${m.width}x${m.height}` : "-"}</div>
                        </div>
                        <div className="text-white/50 text-xs">{humanSize(m.size)}</div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button onClick={() => setViewItem(m)} aria-label="View media" title="View media" className="p-2 rounded-lg text-white/60 hover:text-blue-400 hover:bg-blue-500/10">View</button>
                        <button onClick={() => attemptRename(m)} aria-label="Rename media" title="Rename media" className="p-2 rounded-lg text-white/60 hover:text-gold hover:bg-gold/10">Rename</button>
                        <button onClick={() => attemptDelete(m)} aria-label="Delete media" title="Delete media" className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-white/5 mt-4">
                  <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass gold-border rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Media Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-white/70">Total Media</span><span className="font-poppins font-semibold text-white">{stats.total}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Images</span><span className="font-poppins font-semibold text-white">{stats.images}</span></div>
              <div className="flex items-center justify-between"><span className="text-white/70">Other</span><span className="font-poppins font-semibold text-white">{stats.others}</span></div>
              <div className="mt-3 border-t border-white/5 pt-3 flex items-center justify-between"><span className="text-white/70">Total Storage Used</span><span className="font-poppins font-semibold text-gold">{humanSize(stats.totalBytes)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewItem(null)} />
          <div className="relative z-50 w-full max-w-3xl bg-primary rounded-2xl p-6">
            <div className="flex items-center justify-between"><h3 className="font-poppins font-semibold text-white text-lg">{viewItem.name}</h3><button onClick={() => setViewItem(null)} className="text-white/50">Close</button></div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="w-full h-64 bg-white/5 rounded-md overflow-hidden flex items-center justify-center">
                  {viewItem.url ? <img src={viewItem.url} alt={viewItem.name} className="object-contain w-full h-full" /> : <div className="text-white/40">No preview</div>}
                </div>
                <div className="mt-4 text-white/70"><p>Dimensions: {viewItem.width ? `${viewItem.width} x ${viewItem.height}` : "-"}</p><p>Size: {humanSize(viewItem.size)}</p></div>
              </div>

              <div>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-white/70"><span>MIME</span><span className="font-poppins font-semibold text-white">{viewItem.mimeType}</span></div>
                  <div className="flex justify-between text-white/70"><span>Uploaded</span><span className="font-poppins font-semibold text-white">{viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : "-"}</span></div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex items-center justify-between"><span className="text-white/70">URL</span><button onClick={() => copyUrl(viewItem.url)} className="px-3 py-1 rounded-lg bg-white/5 text-white text-xs">Copy/Use URL</button></div>
                  <div className="text-white/50 text-xs mt-2">Note: this URL is local to this browser/session and is not publicly hosted.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setRenameTarget(null)} />
          <div className="relative z-50 w-full max-w-md bg-primary rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg">Rename Media</h3>
            <div className="mt-3">
              <label className="text-white/70 text-xs">Name</label>
              <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={() => setRenameTarget(null)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
              <button onClick={confirmRename} className="px-4 py-2 rounded-xl bg-gold text-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-50 w-full max-w-lg bg-primary rounded-2xl p-6">
            <h3 className="font-poppins font-semibold text-white text-lg">Delete Media</h3>
            <p className="text-white/70 mt-2">This will remove the media item from the local media library. Are you sure you want to delete "{deleteTarget.name}"?</p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl bg-white/5 text-white">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
