import { useState } from 'react';
import { Phone, MessageCircle, Check, X } from 'lucide-react';
import { Profile } from '../types';

interface HeaderProps {
  profile: Profile;
}

export default function Header({ profile }: HeaderProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleCopyPhone = () => handleCopy(profile.phone, 'phone');
  const handleWechatClick = () => {
    setShowQrCode(true);
  };

  return (
    <header className="mb-6 sm:mb-16 lg:mb-20 flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10 lg:gap-12 animate-fade-in-up">
      <div className="relative group shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-60 group-hover:scale-110 transition-all duration-500" />
        <img
          alt="Avatar"
          className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-[4px] sm:border-[6px] border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          src={profile.avatarUrl}
        />
      </div>
      <div className="text-center md:text-left pt-0 -mt-4 md:-mt-6 flex-1">
        <div className="relative">
          <span className="shiny-text block text-4xl sm:text-5xl md:text-6xl font-bold mb-2 tracking-tight leading-tight pb-2 text-center md:text-left mx-auto md:mx-0">
            {profile.name}
          </span>
        </div>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl font-light leading-relaxed mb-5 sm:mb-6 tracking-wide whitespace-pre-line text-center md:text-left">
          {profile.bio}
        </p>
        <div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-6 text-gray-500">
            <button
              type="button"
              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap cursor-pointer transition-all ${
                copied === 'phone'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white/60 text-gray-800 hover:bg-white/80 border border-white/60'
              }`}
              onClick={handleCopyPhone}
            >
              {copied === 'phone' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{profile.phone}</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap cursor-pointer transition-all bg-white/60 text-gray-800 hover:bg-white/80 border border-white/60"
              onClick={handleWechatClick}
            >
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span>WeChat</span>
            </button>
          </div>
          <p className="mt-3.5 mb-0 text-xs text-gray-500 md:hidden">
            推荐使用<span className="font-semibold text-gray-700">电脑端</span>浏览器访问本站（Chrome/Edge）
          </p>
        </div>
      </div>

      {showQrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowQrCode(false)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowQrCode(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">微信联系方式</h3>
              <p className="text-gray-500 text-sm mb-6">扫描二维码或添加微信ID</p>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 inline-block">
                <img
                  src={profile.wechatQrCodeUrl}
                  alt="微信二维码"
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="mt-6">
                <p className="text-gray-500 text-xs mb-1">微信号</p>
                <p className="text-lg font-semibold text-gray-800">{profile.wechat}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}