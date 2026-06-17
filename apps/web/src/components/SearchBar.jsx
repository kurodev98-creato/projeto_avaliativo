import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = ({ value, onChange, placeholder = "Buscar produtos..." }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default SearchBar;