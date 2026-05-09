"use client";

import { useEffect, useRef } from "react";

interface AddressFields {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect: (fields: AddressFields) => void;
  className?: string;
  required?: boolean;
  name?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGooglePlaces?: () => void;
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  className,
  required,
  name = "address",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    function initAutocomplete() {
      if (!inputRef.current || !window.google?.maps?.places) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete( // eslint-disable-line
        inputRef.current,
        {
          componentRestrictions: { country: "in" }, // India only
          fields: ["address_components", "formatted_address"],
          types: ["address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const place = autocompleteRef.current?.getPlace() as any;
        if (!place?.address_components) return;

        let streetNumber = "";
        let route = "";
        let sublocality = "";
        let locality = "";
        let state = "";
        let postalCode = "";
        let country = "India";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const component of place.address_components as any[]) {
          const type = component.types[0];
          switch (type) {
            case "street_number":      streetNumber = component.long_name; break;
            case "route":              route = component.long_name; break;
            case "sublocality_level_1": sublocality = component.long_name; break;
            case "locality":           locality = component.long_name; break;
            case "administrative_area_level_1": state = component.long_name; break;
            case "postal_code":        postalCode = component.long_name; break;
            case "country":            country = component.long_name; break;
          }
        }

        const streetAddress = streetNumber
          ? `${streetNumber} ${route}`.trim()
          : route || place.formatted_address?.split(",")[0] || "";

        onPlaceSelect({
          address: streetAddress,
          city: locality || sublocality,
          state,
          zip: postalCode,
          country,
        });
      });
    }

    // Load script if not already loaded
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const scriptId = "google-maps-places";
    if (document.getElementById(scriptId)) {
      // Script already loading — wait for it
      window.initGooglePlaces = initAutocomplete;
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
    script.async = true;
    script.defer = true;
    window.initGooglePlaces = initAutocomplete;
    document.head.appendChild(script);

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="off"
      placeholder="Start typing your address…"
      className={className}
    />
  );
}
