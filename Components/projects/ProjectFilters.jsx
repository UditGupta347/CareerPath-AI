import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const domains = [
  'All Domains',
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'IoT',
  'Cybersecurity',
  'Blockchain',
  'Cloud Computing',
  'AR/VR',
  'Data Science',
  'DevOps'
];

const complexities = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function ProjectFilters({ 
  filters, 
  onFilterChange,
  onSearch,
  searchQuery,
  onSearchChange 
}) {
  const hasActiveFilters = filters.domain !== 'All Domains' || filters.complexity !== 'All Levels';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-4 shadow-lg shadow-slate-200/50"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search projects, technologies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {}
        <div className="flex flex-wrap gap-3">
          <Select 
            value={filters.domain} 
            onValueChange={(value) => onFilterChange({ ...filters, domain: value })}
          >
            <SelectTrigger className="w-44 h-11 bg-slate-50 border-slate-200 rounded-xl">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map(domain => (
                <SelectItem key={domain} value={domain}>{domain}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.complexity} 
            onValueChange={(value) => onFilterChange({ ...filters, complexity: value })}
          >
            <SelectTrigger className="w-36 h-11 bg-slate-50 border-slate-200 rounded-xl">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {complexities.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100"
              onClick={() => onFilterChange({ domain: 'All Domains', complexity: 'All Levels' })}
            >
              <X className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}