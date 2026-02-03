import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Settings,
  Users,
  Globe,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoModeNotice } from '../../components/DemoModeNotice';

interface TimeSlot {
  start: string;
  end: string;
  maxBookings: number;
}

interface ServiceBooking {
  id: string;
  name: string;
  duration: number;
  price: string;
  description: string;
  enabled: boolean;
}

export default function OnlineBookingPage() {
  const [services, setServices] = useState<ServiceBooking[]>([
    {
      id: '1',
      name: 'Basic Plumbing Service',
      duration: 60,
      price: '$150',
      description: 'Standard plumbing inspection and minor repairs',
      enabled: true,
    },
    {
      id: '2',
      name: 'HVAC Maintenance',
      duration: 90,
      price: '$200',
      description: 'Regular HVAC system maintenance and cleaning',
      enabled: true,
    },
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { start: '09:00', end: '12:00', maxBookings: 3 },
    { start: '13:00', end: '17:00', maxBookings: 3 },
  ]);

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
          <Calendar className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Online Booking
            </h1>
            <p className="text-slate-600">
              Configure your online booking system
            </p>
          </div>
        </div>
      </div>

      <DemoModeNotice feature="Online booking" />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Bookable Services */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Bookable Services
                  </h2>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start justify-between border-b border-slate-100 pb-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-800">
                        {service.name}
                      </h3>
                      <span className="text-sm text-purple-600">
                        {service.price}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {service.duration} minutes
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.enabled}
                      onChange={() => {
                        setServices(
                          services.map((s) =>
                            s.id === service.id
                              ? { ...s, enabled: !s.enabled }
                              : s
                          )
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Available Time Slots
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slot.start}
                      onChange={(e) => {
                        const newSlots = [...timeSlots];
                        newSlots[index] = { ...slot, start: e.target.value };
                        setTimeSlots(newSlots);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={(e) => {
                        const newSlots = [...timeSlots];
                        newSlots[index] = { ...slot, end: e.target.value };
                        setTimeSlots(newSlots);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Max Bookings
                    </label>
                    <input
                      type="number"
                      value={slot.maxBookings}
                      onChange={(e) => {
                        const newSlots = [...timeSlots];
                        newSlots[index] = {
                          ...slot,
                          maxBookings: parseInt(e.target.value),
                        };
                        setTimeSlots(newSlots);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      min="1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Booking Widget */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Booking Widget
            </h3>
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <Globe className="h-8 w-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Embed code:</p>
                <pre className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600 overflow-auto">
                  {`<script src="https://booking.servicepro.com/widget.js"></script>
<div id="booking-widget" data-company="your-id"></div>`}
                </pre>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">
                  Total Bookings (This Month)
                </p>
                <p className="text-2xl font-semibold text-slate-800">24</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Conversion Rate</p>
                <p className="text-2xl font-semibold text-slate-800">68%</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Average Lead Time</p>
                <p className="text-2xl font-semibold text-slate-800">
                  2.5 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
