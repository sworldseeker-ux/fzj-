import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import PhotoCard from '../components/PhotoCard';
import { galleryApi, categoryApi, profileApi, statsApi } from '../api/services';
import { Gallery, Category, Profile } from '../types';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalVisits, setTotalVisits] = useState(3795);
  const [loading, setLoading] = useState(true);
  const hasVisitedRef = useRef(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [galleryList, categoryList, profileData, statsData] = await Promise.all([
        galleryApi.getAll(),
        categoryApi.getAll(),
        profileApi.get(),
        statsApi.get(),
      ]);
      setGalleries(galleryList);
      setCategories(categoryList);
      if (profileData) {
        setProfile(profileData);
      }
      if (statsData) {
        setTotalVisits(statsData.totalVisits);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasVisitedRef.current) return;
    hasVisitedRef.current = true;

    const handleVisit = async () => {
      try {
        await statsApi.incrementVisit();
      } catch (error) {
        console.error('Failed to increment visit:', error);
      }
    };
    handleVisit();
  }, []);

  const filteredGalleries: Gallery[] = activeCategory === 'all'
    ? galleries
    : galleries.filter(gallery => gallery.categoryId === activeCategory);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 font-sans antialiased selection:bg-gray-900 selection:text-white relative pb-10">
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-teal-50 to-emerald-50" />
        {profile.backgroundUrl && (
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            alt="background"
            src={profile.backgroundUrl}
          />
        )}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[80px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Navbar visitCount={totalVisits} profile={profile} />



      <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col">
        <Header profile={profile} />

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
          </div>
        ) : (
          <>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-10 lg:gap-12">
              {filteredGalleries.map((gallery) => {
                const category = categories.find(c => c.id === gallery.categoryId);
                return (
                  <PhotoCard key={gallery.id} gallery={gallery} categoryName={category?.name} />
                );
              })}
            </div>
          </>
        )}
      </div>


    </div>
  );
}
