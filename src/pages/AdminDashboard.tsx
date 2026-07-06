import { useState, useEffect } from 'react';
import { Image, Folder, Eye, TrendingUp, Edit, Save, X } from 'lucide-react';
import { galleryApi, categoryApi, statsApi } from '../api/services';
import { Gallery, Category } from '../types';

export default function AdminDashboard() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [editingVisits, setEditingVisits] = useState(false);
  const [editVisitsValue, setEditVisitsValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [galleryList, categoryList, statsData] = await Promise.all([
        galleryApi.getAll(),
        categoryApi.getAll(),
        statsApi.get(),
      ]);
      setGalleries(galleryList);
      setCategories(categoryList);
      if (statsData) {
        setTotalVisits(statsData.totalVisits);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditVisits = () => {
    setEditVisitsValue(totalVisits);
    setEditingVisits(true);
  };

  const handleSaveVisits = async () => {
    try {
      const result = await statsApi.update({ totalVisits: editVisitsValue });
      if (result) {
        setTotalVisits(result.totalVisits);
      }
      setEditingVisits(false);
    } catch (error) {
      console.error('Failed to update visits:', error);
    }
  };

  const handleCancelEditVisits = () => {
    setEditingVisits(false);
  };

  const stats = [
    {
      title: '作品集总数',
      value: galleries.length,
      icon: Image,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: '分类数量',
      value: categories.filter((c) => c.id !== 'all').length,
      icon: Folder,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: '总访问次数',
      value: totalVisits,
      icon: Eye,
      color: 'bg-green-500/20 text-green-400',
      isEditable: true,
    },
    {
      title: '总照片数',
      value: galleries.reduce((sum, g) => sum + g.photoCount, 0),
      icon: TrendingUp,
      color: 'bg-orange-500/20 text-orange-400',
    },
  ];

  const recentGalleries = galleries.slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">仪表盘</h1>
        <p className="text-gray-400 mt-1">欢迎回来，管理员</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              if (stat.isEditable && editingVisits && stat.title === '总访问次数') {
                return (
                  <div key={stat.title} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            value={editVisitsValue}
                            onChange={(e) => setEditVisitsValue(Number(e.target.value))}
                            className="w-24 px-3 py-1 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          />
                          <button
                            onClick={handleSaveVisits}
                            className="p-1 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEditVisits}
                            className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={stat.title} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
                        {stat.isEditable && (
                          <button
                            onClick={handleStartEditVisits}
                            className="p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">最近的作品集</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {recentGalleries.map((gallery) => (
                <div key={gallery.id} className="p-5 flex items-center gap-4 hover:bg-gray-800/50 transition-colors">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{gallery.title}</h3>
                    <p className="text-sm text-gray-400">{gallery.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{gallery.photoCount} 张照片</p>
                    <p className="text-xs text-gray-500">{gallery.viewCount} 浏览</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
