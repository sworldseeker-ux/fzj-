import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, GripVertical, Image, Video, Edit2, Save, X } from 'lucide-react';
import { galleryApi, uploadApi } from '../api/services';
import { Gallery, MediaItem } from '../types';

export default function AdminGalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (id) {
        const [galleryData, mediaData] = await Promise.all([
          galleryApi.getById(id),
          galleryApi.getMedia(id),
        ]);
        setGallery(galleryData);
        setMediaItems(mediaData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      galleryApi.incrementVisit(id);
    }
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadApi.upload(file);
        if (result) {
          const isVideo = file.type.startsWith('video/');
          await galleryApi.addMedia(id, {
            url: result.url,
            title: '',
            description: '',
            type: isVideo ? 'video' : 'image',
          });
        }
      }
      await loadData();
    } catch (error) {
      console.error('Failed to upload files:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!id || !confirm('确定要删除这个媒体文件吗？')) return;

    try {
      await galleryApi.deleteMedia(id, mediaId);
      await loadData();
    } catch (error) {
      console.error('Failed to delete media:', error);
      alert('删除失败，请重试');
    }
  };

  const handleEditStart = (mediaItem: MediaItem) => {
    setEditingId(mediaItem.id);
    setEditForm({ title: mediaItem.title, description: mediaItem.description });
  };

  const handleEditSave = async () => {
    if (!id || !editingId) return;

    try {
      await galleryApi.updateMedia(id, editingId, editForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      console.error('Failed to update media:', error);
      alert('保存失败，请重试');
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('index', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('index'));

    if (sourceIndex !== targetIndex && sourceIndex >= 0 && targetIndex >= 0) {
      const newItems = [...mediaItems];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, removed);

      setMediaItems(newItems);

      if (id) {
        const mediaIds = newItems.map(item => item.id);
        await galleryApi.reorderMedia(id, mediaIds);
      }
    }

    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  if (loading) {
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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/galleries')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回列表</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{gallery?.title}</h1>
          <p className="text-gray-400 mt-1">{gallery?.description}</p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-purple-400" />
            媒体文件管理
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">共 {mediaItems.length} 个文件</span>
            <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl cursor-pointer transition-all">
              <Upload className="w-5 h-5" />
              <span>{uploading ? '上传中...' : '上传文件'}</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {mediaItems.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无媒体文件，点击上方按钮上传</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative bg-gray-900/50 rounded-xl border overflow-hidden transition-all ${
                  dragOverIndex === index ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-700'
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <button
                    className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                    disabled={uploading}
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative aspect-video bg-gray-900">
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <img
                        src={`${item.url}#t=0.5`}
                        alt={item.title || 'Video'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 24 24" fill="none" stroke="%236b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"%3E%3Cpolygon points="5 3 19 12 5 21 5 3"/%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title || 'Image'}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="p-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(item)}
                          className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                        placeholder="标题"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="描述"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-white font-medium text-sm truncate">
                        {item.title || '未命名'}
                      </p>
                      <p className="text-gray-400 text-xs truncate mt-1">
                        {item.description || '无描述'}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {item.type === 'video' ? '视频' : '图片'}
                    </span>
                    <span className="text-xs text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">使用说明</h2>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>点击「上传文件」按钮可以从本地上传图片或视频</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>点击编辑图标可以修改媒体文件的标题和描述</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>拖拽左侧的排序图标可以调整媒体文件的显示顺序</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>点击删除图标可以删除媒体文件（需要确认）</span>
          </li>
        </ul>
      </div>
    </div>
  );
}