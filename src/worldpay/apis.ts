"use server";

const worldpayApiUrl = process.env.WORLDPAY_API_URL;
if (!worldpayApiUrl) {
  throw new Error("WORLDPAY_API_URL is not set");
}

export type CardSessionInput = {
  identity: string;
  cardExpiryDate: {
    month: number;
    year: number;
  };
  cvc: string;
  cardNumber: string;
};

export type CardSessionOutput = {
  _links: {
    "sessions:session": {
      href: string;
    };
    curies: [
      {
        href: string;
        name: string;
        templated: boolean;
      }
    ];
  };
};

export const createCardSession = async (
  input: CardSessionInput
): Promise<CardSessionOutput["_links"]["sessions:session"]["href"]> => {
  const response = await fetch(`${worldpayApiUrl}/sessions/card`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.worldpay.sessions-v1.hal+json",
      "Content-Type": "application/vnd.worldpay.sessions-v1.hal+json",
    },
    body: JSON.stringify({
      identity: input.identity,
      cardExpiryDate: {
        month: input.cardExpiryDate.month,
        year: input.cardExpiryDate.year,
      },
      cvc: input.cvc,
      cardNumber: input.cardNumber,
    }),
  });
  const data: CardSessionOutput = await response.json();
  return data._links["sessions:session"].href;
};
