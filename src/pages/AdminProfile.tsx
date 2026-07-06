import { useState, useEffect } from 'react';
import { Save, Camera, Phone, MessageCircle, Upload, X } from 'lucide-react';
import { profileApi, uploadApi } from '../api/services';
import { Profile as ProfileType } from '../types';

export default function AdminProfile() {
  const [formData, setFormData] = useState<ProfileType | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [uploadingQrCode, setUploadingQrCode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await profileApi.get();
      if (profile) {
        setFormData(profile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    
    try {
      await profileApi.update(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('保存失败，请重试');
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const result = await uploadApi.upload(file);
      if (result && formData) {
        setFormData({ ...formData, avatarUrl: result.url });
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('上传失败，请重试');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleClearAvatar = () => {
    if (formData) {
      setFormData({ ...formData, avatarUrl: '' });
    }
  };

  const handleUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBackground(true);
    try {
      const result = await uploadApi.upload(file);
      if (result && formData) {
        setFormData({ ...formData, backgroundUrl: result.url });
      }
    } catch (error) {
      console.error('Failed to upload background:', error);
      alert('上传失败，请重试');
    } finally {
      setUploadingBackground(false);
    }
  };

  const handleClearBackground = () => {
    if (formData) {
      setFormData({ ...formData, backgroundUrl: '' });
    }
  };

  const handleUploadQrCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQrCode(true);
    try {
      const result = await uploadApi.upload(file);
      if (result && formData) {
        setFormData({ ...formData, wechatQrCodeUrl: result.url });
      }
    } catch (error) {
      console.error('Failed to upload QR code:', error);
      alert('上传失败，请重试');
    } finally {
      setUploadingQrCode(false);
    }
  };

  const handleClearQrCode = () => {
    if (formData) {
      setFormData({ ...formData, wechatQrCodeUrl: '' });
    }
  };

  if (loading || !formData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">个人信息</h1>
          <p className="text-gray-400 mt-1">编辑您的个人资料</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
          }`}
        >
          <Save className="w-5 h-5" />
          <span>{saved ? '已保存' : '保存更改'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">基本信息</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">头像</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={formData.avatarUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="%236b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"%3E%3Ccircle cx="12" cy="8" r="5"/%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/%3E%3C/svg%3E'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-gray-700 bg-gray-900"
                  />
                  {formData.avatarUrl && (
                    <button
                      onClick={handleClearAvatar}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadAvatar}
                      disabled={uploadingAvatar}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400 hover:border-purple-500 hover:text-white cursor-pointer transition-all">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingAvatar ? '上传中...' : '点击上传头像'}</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full mt-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                    placeholder="或手动输入图片URL"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="请输入姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">昵称</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="请输入昵称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">网站标题</label>
              <input
                type="text"
                value={formData.siteTitle || ''}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="请输入网站标题（如：Ljx Space）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">首页背景图</label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-12">
                  <img
                    src={formData.backgroundUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="48" viewBox="0 0 24 24" fill="none" stroke="%236b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E'}
                    alt="Background"
                    className="w-full h-full rounded-lg object-cover border-2 border-gray-700 bg-gray-900"
                  />
                  {formData.backgroundUrl && (
                    <button
                      onClick={handleClearBackground}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadBackground}
                      disabled={uploadingBackground}
                      className="hidden"
                      id="background-upload"
                    />
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400 hover:border-purple-500 hover:text-white cursor-pointer transition-all">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingBackground ? '上传中...' : '点击上传背景图'}</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.backgroundUrl}
                    onChange={(e) => setFormData({ ...formData, backgroundUrl: e.target.value })}
                    className="w-full mt-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                    placeholder="或手动输入图片URL"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">上传的图片会以玻璃化效果显示在首页背景</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">联系方式</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  手机号
                </span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="请输入手机号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  微信号
                </span>
              </label>
              <input
                type="text"
                value={formData.wechat}
                onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="请输入微信号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">微信二维码</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <img
                    src={formData.wechatQrCodeUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="%236b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E'}
                    alt="WeChat QR Code"
                    className="w-full h-full rounded-xl object-cover border-2 border-gray-700 bg-gray-900"
                  />
                  {formData.wechatQrCodeUrl && (
                    <button
                      onClick={handleClearQrCode}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadQrCode}
                      disabled={uploadingQrCode}
                      className="hidden"
                      id="qrcode-upload"
                    />
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400 hover:border-purple-500 hover:text-white cursor-pointer transition-all">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingQrCode ? '上传中...' : '点击上传二维码'}</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.wechatQrCodeUrl || ''}
                    onChange={(e) => setFormData({ ...formData, wechatQrCodeUrl: e.target.value })}
                    className="w-full mt-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                    placeholder="或手动输入图片URL"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">上传后，点击首页的 WeChat 按钮将显示此二维码</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="请输入个人简介"
                rows={6}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Camera className="w-6 h-6 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">版权声明</h2>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            所有图片均有RAW文件有版权，站内图片均为压缩版，严禁盗图。
            未经授权，禁止转载、复制、分发本站任何内容。
          </p>
        </div>
      </div>
    </div>
  );
}