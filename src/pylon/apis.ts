"use server";

import {
  GetOrderLinkOutput,
  PaymentProcessor,
  TransactionProcessInputProcessed,
} from "./types";

const baseApiUrl = process.env.API_URL;
if (!baseApiUrl) {
  throw new Error("API_URL is not set");
}

export async function getOrderLink(orderId: string): Promise<
  Promise<{
    data: GetOrderLinkOutput;
    revalidate: number;
    tags: string[];
  }>
> {
  const response = await fetch(`${baseApiUrl}/v1/transaction/link/${orderId}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  const data = await response.json();
  return data;
}

export async function processTransaction(
  paymentProcessor: PaymentProcessor,
  paymentDetails: TransactionProcessInputProcessed,
  paymentToken: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${baseApiUrl}/v1/transaction/process?paymentProcessor=${paymentProcessor}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paymentToken}`,
        },
        body: JSON.stringify(paymentDetails),
      }
    );

    if (!response.ok) {
      console.error(
        "Transaction processing failed:",
        response.status,
        response.statusText
      );
      return false;
    }

    const responseBody = await response.json();
    return responseBody.statusCode === 200;
  } catch (error) {
    console.error("Error processing transaction:", error);
    return false;
  }
}
