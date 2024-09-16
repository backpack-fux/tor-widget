import { notFound } from "next/navigation";
import Checkout from "./checkout";
import { revalidateTag } from "next/cache";

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
  paymentToken: string;
};

async function getOrderData(orderId: string): Promise<OrderData | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/transaction/link/${orderId}`,
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
  const data = await response.json();

  // Remove sensitive data (i.e. paymentToken) before passing to the client
  const { paymentToken, ...safeOrderData } = data.data;
  return safeOrderData;
}

async function processPayment(orderId: string, paymentDetails: any) {
  const orderData = await getOrderData(orderId);
  if (!orderData) {
    throw new Error("Order not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/transaction/process`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_JWT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        paymentDetails,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Payment processing failed");
  }

  return await response.json();
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
    revalidateTag(`order-${params.orderId}`);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  async function handlePayment(paymentDetails: any) {
    "use server";
    return processPayment(params.orderId, paymentDetails);
  }

  return <Checkout orderData={orderData} onPayment={handlePayment} />;
}
