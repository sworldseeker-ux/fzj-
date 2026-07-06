import { useNavigate } from 'react-router-dom';
import { Eye, Cloud, Lock } from 'lucide-react';
import { Profile } from '../types';

interface NavbarProps {
  visitCount: number;
  profile: Profile;
}

export default function Navbar({ visitCount, profile }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-all duration-500">
      <div className="font-bold tracking-widest text-xl cursor-pointer flex items-center gap-2 group">
        <span className="font-bold text-lg sm:text-xl text-gray-900">{profile.siteTitle || 'Ljx Space'}</span>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-gray-700 bg-white/55 backdrop-blur-sm border border-white/60 shadow-sm">
          <Eye className="w-3 h-3 text-gray-400" />
          <span className="tracking-wider">全站访问次数：{visitCount}次</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200 bg-white/40 backdrop-blur-sm">
          <Cloud className="w-3 h-3" />
          <span>Auto-Saved</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="p-2.5 rounded-full hover:bg-white/40 text-gray-500 hover:text-gray-900 transition-colors"
          title="管理后台"
        >
          <Lock className="w-[18px] h-[18px]" />
        </button>
      </div>
    </nav>
  );
}