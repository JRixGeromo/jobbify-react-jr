import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Globe,
  Building2,
  Map,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface ServiceArea {
  id: string;
  name: string;
  radius: number;
  zipCodes: string[];
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  serviceAreas: ServiceArea[];
  isMainLocation: boolean;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Main Office',
      address: '123 Main St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '(512) 555-0123',
      email: 'main@servicepro.com',
      serviceAreas: [
        {
          id: '1',
          name: 'Central Austin',
          radius: 15,
          zipCodes: ['78701', '78702', '78703'],
        },
      ],
      isMainLocation: true,
    },
  ]);

  const handleAddLocation = () => {
    const newLocation: Location = {
      id: uuidv4(),
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      serviceAreas: [],
      isMainLocation: false,
    };
    setLocations([...locations, newLocation]);
  };

  const handleAddServiceArea = (locationId: string) => {
    const newServiceArea: ServiceArea = {
      id: uuidv4(),
      name: '',
      radius: 10,
      zipCodes: [],
    };
    setLocations(
      locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              serviceAreas: [...location.serviceAreas, newServiceArea],
            }
          : location
      )
    );
  };

  const handleRemoveLocation = (locationId: string) => {
    setLocations(locations.filter((location) => location.id !== locationId));
  };

  const handleRemoveServiceArea = (locationId: string, areaId: string) => {
    setLocations(
      locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              serviceAreas: location.serviceAreas.filter(
                (area) => area.id !== areaId
              ),
            }
          : location
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Locations</h1>
            <p className="text-slate-600">
              Manage your business locations and service areas
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-sm border border-purple-100"
            >
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      {location.name || 'New Location'}
                    </h2>
                  </div>
                  {!location.isMainLocation && (
                    <button
                      onClick={() => handleRemoveLocation(location.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Location Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Location Name
                    </label>
                    <input
                      type="text"
                      value={location.name}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, name: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={location.phone}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, phone: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={location.email}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, email: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={location.address}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, address: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={location.city}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, city: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={location.state}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, state: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={location.zipCode}
                      onChange={(e) =>
                        setLocations(
                          locations.map((loc) =>
                            loc.id === location.id
                              ? { ...loc, zipCode: e.target.value }
                              : loc
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-800">
                      Service Areas
                    </h3>
                    <button
                      onClick={() => handleAddServiceArea(location.id)}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {location.serviceAreas.map((area) => (
                      <div key={area.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <input
                            type="text"
                            value={area.name}
                            onChange={(e) =>
                              setLocations(
                                locations.map((loc) =>
                                  loc.id === location.id
                                    ? {
                                        ...loc,
                                        serviceAreas: loc.serviceAreas.map(
                                          (sa) =>
                                            sa.id === area.id
                                              ? { ...sa, name: e.target.value }
                                              : sa
                                        ),
                                      }
                                    : loc
                                )
                              )
                            }
                            placeholder="Area Name"
                            className="text-sm font-medium text-slate-800 border-none focus:ring-0"
                          />
                          <button
                            onClick={() =>
                              handleRemoveServiceArea(location.id, area.id)
                            }
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Radius (miles)
                            </label>
                            <input
                              type="number"
                              value={area.radius}
                              onChange={(e) =>
                                setLocations(
                                  locations.map((loc) =>
                                    loc.id === location.id
                                      ? {
                                          ...loc,
                                          serviceAreas: loc.serviceAreas.map(
                                            (sa) =>
                                              sa.id === area.id
                                                ? {
                                                    ...sa,
                                                    radius: parseInt(
                                                      e.target.value
                                                    ),
                                                  }
                                                : sa
                                          ),
                                        }
                                      : loc
                                  )
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              ZIP Codes
                            </label>
                            <input
                              type="text"
                              value={area.zipCodes.join(', ')}
                              onChange={(e) =>
                                setLocations(
                                  locations.map((loc) =>
                                    loc.id === location.id
                                      ? {
                                          ...loc,
                                          serviceAreas: loc.serviceAreas.map(
                                            (sa) =>
                                              sa.id === area.id
                                                ? {
                                                    ...sa,
                                                    zipCodes: e.target.value
                                                      .split(',')
                                                      .map((zip) => zip.trim()),
                                                  }
                                                : sa
                                          ),
                                        }
                                      : loc
                                  )
                                )
                              }
                              placeholder="Enter ZIP codes, separated by commas"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddLocation}
            className="w-full py-4 border-2 border-dashed border-purple-200 rounded-lg text-purple-600 hover:text-purple-700 hover:border-purple-300"
          >
            <Plus className="h-5 w-5 mx-auto" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Map Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Map Preview
            </h3>
            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
              <Map className="h-8 w-8 text-slate-400" />
            </div>
          </div>

          {/* Coverage Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Coverage Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Total Service Areas</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {locations.reduce(
                    (sum, loc) => sum + loc.serviceAreas.length,
                    0
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total ZIP Codes</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {locations.reduce(
                    (sum, loc) =>
                      sum +
                      loc.serviceAreas.reduce(
                        (sum, area) => sum + area.zipCodes.length,
                        0
                      ),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
