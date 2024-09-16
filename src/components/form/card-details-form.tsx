"use client";

import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import valid from "card-validator";

type CardDetails = {
  name: string;
  number: string;
  expiration: string;
  cvv: string;
};

type CardErrors = {
  name: string;
  number: string;
  expiration: string;
  cvv: string;
};

type Props = {
  onCardChange: (card: CardDetails, isValid: boolean) => void;
};

export default function CardDetailsForm({ onCardChange }: Props) {
  const [card, setCard] = useState<CardDetails>({
    name: "",
    number: "",
    expiration: "",
    cvv: "",
  });

  const [cardErrors, setCardErrors] = useState<CardErrors>({
    name: "",
    number: "",
    expiration: "",
    cvv: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    number: false,
    expiration: false,
    cvv: false,
  });

  useEffect(() => {
    const numberValidation = valid.number(card.number);
    const expirationValidation = valid.expirationDate(card.expiration);
    const cardCvvLength = numberValidation.card?.code?.size;
    const cvvValidation = valid.cvv(card.cvv, cardCvvLength);

    const newErrors = {
      number:
        touchedFields.number && !numberValidation.isValid
          ? "Invalid card number"
          : "",
      name:
        touchedFields.name && !isValidName(card.name)
          ? "Name should only contain letters and spaces"
          : "",
      expiration:
        touchedFields.expiration && !expirationValidation.isValid
          ? "Invalid expiration date"
          : "",
      cvv: touchedFields.cvv && !cvvValidation.isValid ? "Invalid CVV" : "",
    };

    setCardErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    onCardChange(card, isValid);
  }, [card, touchedFields, onCardChange]);

  const isValidName = (name: string) => {
    return /^[a-zA-Z\s]*$/.test(name);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatCvv = (value: string, cardNumber: string) => {
    const maxLength = valid.number(cardNumber).card?.code?.size;
    return value.slice(0, maxLength);
  };

  const formatExpirationDate = (value: string) => {
    const cleanValue = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (cleanValue.length === 0) return "";
    if (cleanValue.length <= 2) return cleanValue;
    return `${cleanValue.slice(0, 2)} / ${cleanValue.slice(2, 4)}`;
  };

  const handleChange =
    (field: keyof CardDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "name") {
        if (isValidName(value)) {
          setCard({ ...card, [field]: value });
        }
      } else if (field === "number") {
        value = formatCardNumber(value);
        setCard({ ...card, [field]: value });
      } else if (field === "expiration") {
        const formattedValue = formatExpirationDate(value);
        if (formattedValue !== card.expiration) {
          setCard({ ...card, [field]: formattedValue });
        }
      } else if (field === "cvv") {
        value = formatCvv(value, card.number);
        setCard({ ...card, [field]: value });
      } else {
        setCard({ ...card, [field]: value });
      }
    };

  const handleBlur = (field: keyof CardDetails) => () => {
    setTouchedFields({ ...touchedFields, [field]: true });
  };

  return (
    <div className="space-y-4">
      <Input
        label="Cardholder Name"
        placeholder="John Smith Doe"
        value={card.name}
        onChange={handleChange("name")}
        onBlur={handleBlur("name")}
        isInvalid={!!cardErrors.name}
        errorMessage={cardErrors.name}
      />
      <Input
        label="Card Number"
        placeholder="1234 5678 9012 3456"
        value={card.number}
        onChange={handleChange("number")}
        onBlur={handleBlur("number")}
        isInvalid={!!cardErrors.number}
        errorMessage={cardErrors.number}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiration Date"
          placeholder="MM / YY"
          value={card.expiration}
          onChange={handleChange("expiration")}
          onBlur={handleBlur("expiration")}
          isInvalid={!!cardErrors.expiration}
          errorMessage={cardErrors.expiration}
        />
        <Input
          label="CVV"
          placeholder="123"
          value={card.cvv}
          onChange={handleChange("cvv")}
          onBlur={handleBlur("cvv")}
          isInvalid={!!cardErrors.cvv}
          errorMessage={cardErrors.cvv}
        />
      </div>
    </div>
  );
}
