import React from "react";
import { Input } from "@nextui-org/input";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";

const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

type AddressFormProps = {
  title: string;
  address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AddressForm({
  title,
  address,
  onChange,
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Input
        label="Full Name"
        name="name"
        value={address.name}
        onChange={onChange}
      />
      <Input
        label="Address"
        name="address"
        value={address.address}
        onChange={onChange}
      />
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={address.city}
          onChange={onChange}
        />
        <Autocomplete label="State" className="max-w-xs" onChange={onChange}>
          {states.map((state) => (
            <AutocompleteItem key={state.value} value={state.value}>
              {state.label}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Input
          label="ZIP Code"
          name="zip"
          value={address.zip}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
