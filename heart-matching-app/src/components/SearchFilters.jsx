import React from 'react';
import { Filter } from 'lucide-react';
import { 
  AREA_OPTIONS, 
  AGE_GROUP_OPTIONS, 
  GENDER_OPTIONS, 
  NYHA_CLASS_OPTIONS, 
  CARE_LEVEL_OPTIONS,
  SERVICE_OPTIONS
} from '../data/constants';

const SearchFilters = ({ searchFilters, setSearchFilters }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
      <Filter className="h-5 w-5 mr-2" />
      検索条件
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">年齢層</label>
        <select
          value={searchFilters.ageGroup}
          onChange={(e) => setSearchFilters({...searchFilters, ageGroup: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {AGE_GROUP_OPTIONS.slice(1).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
        <select
          value={searchFilters.gender}
          onChange={(e) => setSearchFilters({...searchFilters, gender: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {GENDER_OPTIONS.slice(1).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NYHA分類</label>
        <select
          value={searchFilters.nyhaClass}
          onChange={(e) => setSearchFilters({...searchFilters, nyhaClass: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {NYHA_CLASS_OPTIONS.slice(1).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">介護度</label>
        <select
          value={searchFilters.careLevel}
          onChange={(e) => setSearchFilters({...searchFilters, careLevel: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {CARE_LEVEL_OPTIONS.slice(1).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
        <select
          value={searchFilters.area}
          onChange={(e) => setSearchFilters({...searchFilters, area: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {AREA_OPTIONS.slice(1).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">サービス</label>
        <select
          value={searchFilters.service}
          onChange={(e) => setSearchFilters({...searchFilters, service: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {SERVICE_OPTIONS.slice(1).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default SearchFilters;
