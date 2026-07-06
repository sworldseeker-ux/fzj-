import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import { galleryApi, profileApi } from '../api/services';
import { Gallery, Profile } from '../types';

export default function GalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [mediaItems, setMediaItems] = useState<Gallery['mediaItems']>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const hasVisitedRef = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (hasVisitedRef.current || !id) return;
    hasVisitedRef.current = true;
    galleryApi.incrementVisit(id);
  }, [id]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === '+' || e.key === '=') {
        setScale(s => Math.min(s + 0.25, 5));
      } else if (e.key === '-') {
        setScale(s => Math.max(s - 0.25, 0.25));
      } else if (e.key === '0') {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.min(Math.max(s + delta, 0.25), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(s => Math.min(s + 0.25, 5));
  };

  const handleZoomOut = () => {
    setScale(s => Math.max(s - 0.25, 0.25));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (id) {
        const [galleryData, mediaData, profileData] = await Promise.all([
          galleryApi.getById(id),
          galleryApi.getMedia(id),
          profileApi.get(),
        ]);
        setGallery(galleryData);
        setMediaItems(mediaData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !gallery || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 font-sans antialiased relative">
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300" />
        {profile.backgroundUrl && (
          <img
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            alt="bg"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            src={profile.backgroundUrl}
          />
        )}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/70" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full text-gray-700 hover:bg-white/70 transition-all shadow-lg border border-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">BACK</span>
        </button>
      </nav>

      <div className="pt-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            {gallery.title}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">{gallery.description}</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-gray-400 text-xs">
            <Eye className="w-3 h-3" />
            <span>{gallery.viewCount}</span>
          </div>
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg">暂无照片</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className="group aspect-square rounded-xl overflow-hidden cursor-pointer bg-white/30 border-2 border-white/50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                onClick={() => setSelectedIndex(index)}
              >
                <div className="w-full h-full p-2 bg-white/40 rounded-lg overflow-hidden">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full rounded-md overflow-hidden">
                      <img
                        src={`${item.url}#t=0.5`}
                        alt={item.title || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"%3E%3Cpolygon points="5 3 19 12 5 21 5 3"/%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || ''}
                      className="w-full h-full object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{item.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && mediaItems[selectedIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedIndex(null)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setSelectedIndex(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : mediaItems.length - 1);
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(selectedIndex < mediaItems.length - 1 ? selectedIndex + 1 : 0);
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            className="relative max-w-[90vw] max-h-[85vh] p-4"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            <div
              ref={imageRef}
              className="relative select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              onMouseDown={handleMouseDown}
              onDragStart={(e) => e.preventDefault()}
            >
              {mediaItems[selectedIndex].type === 'video' ? (
                <video
                  src={mediaItems[selectedIndex].url}
                  controls
                  autoPlay
                  className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />
              ) : (
                <img
                  src={mediaItems[selectedIndex].url}
                  alt={mediaItems[selectedIndex].title || ''}
                  className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  draggable={false}
                />
              )}
              {mediaItems[selectedIndex].title && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5">
                  <p className="text-white/80 text-sm text-center">{mediaItems[selectedIndex].title}</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-full px-4 py-2">
              <button
                className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-all"
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                title="缩小"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-white/80 text-sm min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-all"
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                title="放大"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16M4 12h16" />
                </svg>
              </button>
              <button
                className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-all"
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                title="重置"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedIndex + 1} / {mediaItems.length}
          </div>
        </div>
      )}


    </div>
  );
}