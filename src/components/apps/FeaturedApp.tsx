import React from 'react';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: string;
}

interface FeaturedAppProps {
  app: App;
}

export function FeaturedApp({ app }: FeaturedAppProps) {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={app.icon}
          alt={app.name}
          className="w-12 h-12 rounded-lg bg-white p-2"
        />
        <div>
          <h3 className="font-semibold text-lg">{app.name}</h3>
          <p className="text-purple-100">{app.price}</p>
        </div>
      </div>
      <p className="mb-4 text-purple-50">{app.description}</p>
      <button className="w-full py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50">
        Learn More
      </button>
    </div>
  );
}
