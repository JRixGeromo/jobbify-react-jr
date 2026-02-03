import { useState } from 'react';
import { AppHeader } from '../../../components/apps/AppHeader';
import { SearchBar } from '../../../components/apps/SearchBar';
import { AppList } from '../../../components/apps/AppList';
import { apps } from '../../../data/apps';

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(apps.map((app) => app.category)));
  const featuredApps = apps.filter((app) => app.featured);
  const popularApps = apps.filter((app) => app.popular);

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const remainingApps = filteredApps.filter(
    (app) => !app.featured && !app.popular
  );

  return (
    <div className="p-6">
      <AppHeader />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <AppList
        featuredApps={featuredApps}
        popularApps={popularApps}
        remainingApps={remainingApps}
      />
    </div>
  );
}
