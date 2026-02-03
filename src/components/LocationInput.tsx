import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
}

export function LocationInput({
  value,
  onChange,
  placeholder = 'Enter a location',
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value?.address || '');

  useEffect(() => {
    console.log('LocationInput value:', value);
    setInputValue(value?.address || '');

    const input = inputRef.current;
    if (input && value?.address) {
      input.value = value.address;
    }
  }, [value?.address]);

  useEffect(() => {
    const input = inputRef.current;
    // @ts-ignore
    if (!input || !window.google) return;

    // @ts-ignore
    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['formatted_address', 'geometry'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.geometry?.location && place.formatted_address) {
        onChange({
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setInputValue(place.formatted_address);
      }
    });

    return () => {
      // @ts-ignore
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onChange, value?.address]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  );
}
