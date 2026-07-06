import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 sm:mb-10 pb-4 border-b border-gray-900/5 gap-4">
      <div className="flex-1 min-w-0 -mt-2 sm:mt-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 py-1">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-full select-none ios-pill px-4 py-2 text-sm font-semibold text-gray-800 whitespace-nowrap leading-none shrink-0 text-xs font-bold tracking-wide transition-all ${
                activeCategory === category.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}