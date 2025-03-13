import React,{useState,useContext} from 'react';
import { Search } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';



export const SearchBar = () => {
  const {search, setSearch} = useContext(ShopContext);
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  )
}
