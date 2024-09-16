import React from "react";
import { Input } from "@nextui-org/input";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { Address } from "@/pylon/types";

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
  address: Address;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStateChange: (value: string) => void;
};

export default function AddressForm({
  title,
  address,
  onChange,
  onStateChange,
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={address.firstName}
          onChange={onChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={address.lastName}
          onChange={onChange}
        />
      </div>
      <Input
        label="Address"
        name="address1"
        value={address.address1}
        onChange={onChange}
      />
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={address.city}
          onChange={onChange}
        />
        <Autocomplete
          label="State"
          selectedKey={address.state}
          onSelectionChange={(key) => onStateChange(key as string)}
        >
          {states.map((state) => (
            <AutocompleteItem key={state.value} value={state.value}>
              {state.label}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Input
          label="ZIP Code"
          name="postalCode"
          value={address.postalCode}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
