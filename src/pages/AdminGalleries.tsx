import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye, Upload, X } from 'lucide-react';
import { galleryApi, categoryApi, uploadApi } from '../api/services';
import { Gallery, Category } from '../types';

export default function AdminGalleries() {
  const navigate = useNavigate();
  const [galleryList, setGalleryList] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    categoryId: '',
    photoCount: 0,
    viewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [galleries, cats] = await Promise.all([
        galleryApi.getAll(),
        categoryApi.getAll(),
      ]);
      setGalleryList(galleries);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGalleries = galleryList.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (gallery?: Gallery) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData({
        title: gallery.title,
        description: gallery.description,
        coverImage: gallery.coverImage,
        categoryId: gallery.categoryId,
        photoCount: gallery.photoCount,
        viewCount: gallery.viewCount,
      });
    } else {
      setEditingGallery(null);
      setFormData({
        title: '',
        description: '',
        coverImage: '',
        categoryId: '',
        photoCount: 0,
        viewCount: 0,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.coverImage) {
      alert('请填写标题和封面图片');
      return;
    }

    try {
      if (editingGallery) {
        await galleryApi.update(editingGallery.id, formData);
      } else {
        await galleryApi.create(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to save gallery:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      galleryApi.delete(deleteConfirmId)
        .then(() => {
          loadData();
          setDeleteConfirmId(null);
        })
        .catch((error) => {
          console.error('Failed to delete gallery:', error);
          alert('删除失败，请重试');
          setDeleteConfirmId(null);
        });
    }
  };

  const handleUploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCoverImage(true);
    try {
      const result = await uploadApi.upload(file);
      if (result) {
        setFormData({ ...formData, coverImage: result.url });
      }
    } catch (error) {
      console.error('Failed to upload cover image:', error);
      alert('上传失败，请重试');
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const handleClearCoverImage = () => {
    setFormData({ ...formData, coverImage: '' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">作品集管理</h1>
          <p className="text-gray-400 mt-1">管理您的摄影作品集</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>添加作品集</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索作品集..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGalleries.map((gallery) => {
            const category = categories.find((c) => c.id === gallery.categoryId);
            return (
              <div
                key={gallery.id}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all group"
                onClick={() => navigate(`/admin/galleries/${gallery.id}`)}
              >
                <div className="relative aspect-video">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">
                      管理媒体文件
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(gallery); }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(gallery.id); }}
                      className="p-2 bg-black/50 hover:bg-red-500/70 rounded-lg text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{gallery.title}</h3>
                    <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                      {category?.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{gallery.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{gallery.photoCount} 个媒体文件</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {gallery.viewCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">确认删除</h2>
            <p className="text-gray-300 mb-6">确定要删除这个作品集吗？此操作无法撤销。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingGallery ? '编辑作品集' : '添加作品集'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="请输入标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="请输入描述"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">封面图片</label>
                {formData.coverImage && (
                  <div className="relative mb-3">
                    <img
                      src={formData.coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-xl border border-gray-700"
                    />
                    <button
                      onClick={handleClearCoverImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadCoverImage}
                    disabled={uploadingCoverImage}
                    className="hidden"
                    id="cover-upload"
                  />
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400 hover:border-purple-500 hover:text-white cursor-pointer transition-all">
                    <Upload className="w-5 h-5" />
                    <span>{uploadingCoverImage ? '上传中...' : '点击上传封面图片'}</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full mt-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  placeholder="或手动输入图片URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">请选择分类</option>
                  {categories.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">照片数量</label>
                  <div className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400">
                    {formData.photoCount}（自动）
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">浏览次数</label>
                  <div className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400">
                    {formData.viewCount}（自动）
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
