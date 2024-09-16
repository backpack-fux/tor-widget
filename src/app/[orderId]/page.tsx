import { notFound } from "next/navigation";
import Checkout from "./checkout";

export type OrderData = {
  merchant: {
    name: string;
    fee: string; // in percentage
  };
  customer: {
    email: string;
    phone: string;
  };
  order: {
    subtotal: number;
    currency: string;
  };
  expiresAt: string;
};

async function getOrderData(orderId: string): Promise<OrderData | null> {
  const response = await fetch(
    `http://localhost:8001/v1/transaction/link/${orderId}`,
    {
      next: {
        revalidate: 0, // This ensures the data is always fresh on first load
        tags: [`order-${orderId}`], // This allows us to invalidate the cache when needed
      },
    }
  );
  if (!response.ok) {
    return null;
  }
  return (await response.json()).data;
}

export default async function PaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderData = await getOrderData(params.orderId);

  if (!orderData) {
    notFound();
  }

  const expiresAt = new Date(orderData.expiresAt);
  const now = new Date();

  if (now > expiresAt) {
    // If the order has expired, invalidate the cache and redirect
    await fetch(`/api/invalidate-order?orderId=${params.orderId}`);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return (
    <Checkout orderData={orderData} />
  );
}
