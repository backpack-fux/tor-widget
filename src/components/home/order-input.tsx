"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export function OrderInput() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      router.push(`/${orderId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <Input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <Button type="submit" color="primary">
        Go to Order
      </Button>
    </form>
  );
}
