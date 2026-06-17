import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const FilterSidebar = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  priceRange, 
  onPriceChange,
  onClearFilters,
  isMobile,
  onClose
}) => {
  return (
    <div className="space-y-6">
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Categorias</h3>
          {selectedCategories.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-auto p-0 text-xs">
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => onCategoryChange(category.id, checked)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Faixa de Preço</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={onPriceChange}
            max={2000}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;