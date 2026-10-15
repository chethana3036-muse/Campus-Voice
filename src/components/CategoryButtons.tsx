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
  const categories: { label: CategoryFilterType; icon: React.ReactNode; activeColor: string }[] = [
    {
      label: 'All',
      icon: <Layers className="w-4 h-4" />,
      activeColor: 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 border-cyan-400',
    },
    {
      label: 'Academic',
      icon: <GraduationCap className="w-4 h-4" />,
      activeColor: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-400',
    },
    {
      label: 'Events',
      icon: <Calendar className="w-4 h-4" />,
      activeColor: 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 border-amber-300',
    },
    {
      label: 'Placement',
      icon: <Briefcase className="w-4 h-4" />,
      activeColor: 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 border-emerald-400',
    },
  ];

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {categories.map(({ label, icon, activeColor }) => {
          const isSelected = selectedCategory === label;
          const count = counts[label];

          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectCategory(label)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer border backdrop-blur-md ${
                isSelected
                  ? activeColor
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white shadow-sm'
              }`}
            >
              <span className={isSelected ? 'text-current' : 'text-slate-400'}>
                {icon}
              </span>
              <span>{label}</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? 'bg-black/20 text-current'
                    : 'bg-white/10 text-slate-300'
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
