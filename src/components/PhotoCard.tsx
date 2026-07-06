import { useNavigate } from 'react-router-dom';
import { Eye, Image } from 'lucide-react';
import { Gallery } from '../types';

interface PhotoCardProps {
  gallery: Gallery;
  categoryName?: string;
}

export default function PhotoCard({ gallery, categoryName }: PhotoCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group bento-card relative aspect-[5/8] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-white/70 border-2 border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-200 ease-out hover:scale-[1.02]"
      draggable={false}
      style={{ transformStyle: 'preserve-3d' }}
      onClick={() => navigate(`/gallery/${gallery.id}`)}
    >
      <div className="absolute top-2 left-2 right-2 bottom-[72px] rounded-xl sm:top-3 sm:left-3 sm:right-3 sm:bottom-[108px] sm:rounded-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          src={gallery.coverImage}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        {categoryName && categoryName !== '全部' && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/90 text-[10px] sm:text-xs font-medium">
            {categoryName}
          </div>
        )}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/90 text-[10px] sm:text-xs font-medium border border-white/10">
          <Eye className="w-3 h-3" />
          <span>{gallery.viewCount}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[64px] sm:h-[100px] flex flex-col justify-center px-2.5 sm:px-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] sm:text-2xl font-bold text-gray-800 tracking-tight group-hover:text-black transition-colors">
            {gallery.title}
          </h3>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md backdrop-blur-sm border border-gray-200/80">
            <Image className="w-3 h-3" />
            <span>{gallery.photoCount}</span>
          </span>
        </div>
        <p className="text-gray-500 text-[11px] sm:text-sm mt-0.5 sm:mt-1 font-light truncate opacity-80 group-hover:opacity-100 transition-opacity">
          {gallery.description}
        </p>
      </div>
    </div>
  );
}