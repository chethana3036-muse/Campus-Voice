import React from 'react';
import { Category } from '../types/announcement';
import { GraduationCap, Calendar, Briefcase, Layers } from 'lucide-react';

export type CategoryFilterType = 'All' | Category;

interface CategoryButtonsProps {
  selectedCategory: CategoryFilterType;
  onSelectCategory: (category: CategoryFilterType) => void;
  counts: {
    All: number;
    Academic: number;
    Events: number;
    Placement: number;
  };
}

export const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  const categories: { label: CategoryFilterType; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Layers className="w-4 h-4" /> },
    { label: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Placement', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {categories.map(({ label, icon }) => {
          const isSelected = selectedCategory === label;
          const count = counts[label];

          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectCategory(label)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-xs'
              }`}
            >
              <span className={isSelected ? 'text-indigo-300' : 'text-slate-400'}>
                {icon}
              </span>
              <span>{label}</span>
              <span
                className={`ml-1 text-xs px-1.5 py-0.5 rounded-md font-medium ${
                  isSelected
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
