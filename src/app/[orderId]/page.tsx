import { notFound } from "next/navigation";
import Checkout from "./checkout";
import { revalidateTag } from "next/cache";
import { getOrderLink, processTransaction } from "@/pylon/apis";
import {
  GetOrderLinkOutput,
  TransactionProcessInputPreProcessed,
  TransactionProcessInputProcessed,
} from "@/pylon/types";
import { CardSessionInput, createCardSession } from "@/worldpay/apis";

async function getOrderData(
  orderId: string
): Promise<GetOrderLinkOutput | null> {
  try {
    const data = await getOrderLink(orderId);
    return data.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
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

  const { paymentToken, ...remainingOrderData } = orderData;

  const expiresAt = new Date(orderData.expiresAt);
  const now = new Date();

  if (now > expiresAt) {
    revalidateTag(`order-${params.orderId}`);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  async function handlePayment(
    paymentDetails: TransactionProcessInputPreProcessed
  ) {
    "use server";

    const worldpayIdentity = process.env.WORLDPAY_IDENTITY;
    if (!worldpayIdentity) {
      throw new Error("Unable to process payment: missing payment token");
    }

    const cardDetails: CardSessionInput = {
      identity: worldpayIdentity,
      cardNumber: paymentDetails.order.card.number,
      cardExpiryDate: {
        month: paymentDetails.order.card.expiryMonth,
        year: parseInt(`20${paymentDetails.order.card.expiryYear}`),
      },
      cvc: paymentDetails.order.card.cvv,
    };

    // Call Worldpay API to create card session
    const sessionUrl = await createCardSession(cardDetails);
    if (!sessionUrl) {
      throw new Error("Unable to process payment: missing session url");
    }

    const { card, ...order } = paymentDetails.order;

    const processedPaymentDetails: TransactionProcessInputProcessed = {
      sessionUrl,
      order,
    };

    // Call Pylon API to process transaction
    const result = await processTransaction(
      paymentDetails.paymentProcessor,
      processedPaymentDetails,
      paymentToken
    );

    if (result) {
      return true;
    }
    return false;
  }

  return <Checkout orderData={remainingOrderData} onPayment={handlePayment} />;
}
