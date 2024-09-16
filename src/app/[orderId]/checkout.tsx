"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { RadioGroup, Radio, useRadio, RadioProps } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip } from "@nextui-org/tooltip";
import { Slider } from "@nextui-org/slider";

import CardDetailsForm, {
  CardDetails,
} from "@/components/form/card-details-form";
import AddressForm from "@/components/form/address-form";
import SuccessForm from "@/components/form/success-form";
import {
  GetOrderLinkOutput,
  TransactionProcessInputPreProcessed,
  Address,
  ISO3166Alpha2Country,
  PaymentProcessor,
} from "@/pylon/types";
import LoadingOverlay from "@/components/loading";

export default function Checkout({
  orderData,
  onPayment,
}: {
  orderData: Omit<GetOrderLinkOutput, "paymentToken">;
  onPayment: (
    paymentDetails: TransactionProcessInputPreProcessed
  ) => Promise<boolean>;
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isCardValid, setIsCardValid] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: "US" as ISO3166Alpha2Country,
  });
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: "US" as ISO3166Alpha2Country,
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [addressMismatchAcknowledged, setAddressMismatchAcknowledged] =
    useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    const expiresAt = new Date(orderData.expiresAt);
    const interval = setInterval(() => {
      const now = new Date();
      const difference = expiresAt.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        router.push("/");
      } else {
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [orderData.expiresAt, router]);

  useEffect(() => {
    const initialTipPercentage = 0.15;
    setTipAmount(
      parseFloat((initialTipPercentage * orderData.order.subtotal).toFixed(2))
    );
  }, [orderData.order.subtotal]);

  useEffect(() => {
    if (isOrderPlaced || isOrderSuccess) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 15_000); // 15 seconds

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }
  }, [isOrderPlaced, isOrderSuccess]);

  const handleStateChange =
    (addressType: "shipping" | "billing") => (value: string) => {
      if (addressType === "shipping") {
        setShippingAddress((prev) => ({ ...prev, state: value }));
        if (sameAsShipping) {
          setBillingAddress((prev) => ({ ...prev, state: value }));
        }
      } else {
        setBillingAddress((prev) => ({ ...prev, state: value }));
      }
    };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (sameAsShipping) {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "card" && !isCardValid) {
      console.log("Please correct the card information");
    } else {
      setIsLoading(true);
      setIsOrderPlaced(true);
      try {
        const paymentDetails: TransactionProcessInputPreProcessed = {
          paymentProcessor: "WORLDPAY" as PaymentProcessor,
          order: {
            customer: {
              email: orderData.customer.email,
              phoneNumber: orderData.customer.phone,
              shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                city: shippingAddress.city,
                state: shippingAddress.state,
                address1: shippingAddress.address1,
                postalCode: shippingAddress.postalCode,
                countryCode: shippingAddress.countryCode,
              },
              billingAddress: sameAsShipping ? shippingAddress : billingAddress,
            },
            value: {
              currency: orderData.order.currency,
              tipAmount,
              total: orderData.order.subtotal + serviceFee + tipAmount,
            },
            card: {
              name: cardDetails?.name ?? "",
              number: cardDetails?.number.replace(/\s/g, "") ?? "",
              expiryYear: parseInt(
                cardDetails?.expiration?.split("/")[1] ?? ""
              ),
              expiryMonth: parseInt(
                cardDetails?.expiration?.split("/")[0] ?? ""
              ),
              cvv: cardDetails?.cvv ?? "",
            },
          },
        };

        const result = await onPayment(paymentDetails);
        setIsOrderSuccess(result);

        if (result) {
          setIsSuccessOpen(true);
          setIsOrderPlaced(true);
        } else {
          setIsOrderPlaced(false);
        }
      } catch (error) {
        console.error("Failed to place order", error);
        setIsOrderSuccess(false);
        setIsOrderPlaced(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardChange = (card: CardDetails, isValid: boolean) => {
    setCardDetails(card);
    setIsCardValid(isValid);
  };

  const addressesDiffer =
    !sameAsShipping &&
    (shippingAddress.firstName !== billingAddress.firstName ||
      shippingAddress.lastName !== billingAddress.lastName ||
      shippingAddress.address1 !== billingAddress.address1 ||
      shippingAddress.city !== billingAddress.city ||
      shippingAddress.state !== billingAddress.state ||
      shippingAddress.postalCode !== billingAddress.postalCode);

  const subTotal = orderData.order.subtotal;
  const serviceFee =
    (tipAmount + subTotal) * (Number(orderData.merchant.fee) / 100);
  const total = subTotal + serviceFee + tipAmount;

  return (
    <Card className="max-w-3xl mx-auto p-4 px-4">
      {isLoading && <LoadingOverlay />}
      <div className="bg-yellow-100 p-2 rounded-t-md text-sm text-yellow-700 flex items-center justify-center">
        <Tooltip
          showArrow={true}
          content={`If this expires and you did not complete the purchase, please contact ${orderData.merchant.name} for support.`}
          placement="top"
          color="warning"
        >
          <InfoIcon className="w-4 h-4 mr-2" />
        </Tooltip>
        <span>
          Order expires in: {timeLeft}
          <span id="countdown" className="font-semibold"></span>
        </span>
      </div>
      <CardHeader className="flex-col items-start">
        <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
        <p className="text-sm text-gray-500">
          You're purchasing from{" "}
          <span className="font-semibold">{orderData.merchant.name}</span> via
          Backpack
        </p>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="bg-blue-100 p-4 rounded-md text-sm text-blue-700 flex items-start">
          <div className="border-l-4 border-blue-500 h-full"></div>
          <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Backpack</span> is the payment
            processor for this transaction. The charge on your statement will
            appear as <span className="font-semibold">BACKPACK LLC</span>.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Information</h3>
          <Input
            label="Email"
            name="email"
            value={orderData.customer.email}
            isDisabled
          />
          <Input
            label="Phone"
            name="phone"
            value={orderData.customer.phone}
            isDisabled
          />
        </div>

        <AddressForm
          title="Shipping Information"
          address={shippingAddress}
          onChange={handleShippingChange}
          onStateChange={handleStateChange("shipping")}
        />

        <Checkbox isSelected={sameAsShipping} onValueChange={setSameAsShipping}>
          Billing address same as shipping
        </Checkbox>

        {!sameAsShipping && (
          <AddressForm
            title="Billing Information"
            address={billingAddress}
            onChange={handleBillingChange}
            onStateChange={handleStateChange("billing")}
          />
        )}

        {addressesDiffer && (
          <div className="bg-yellow-100 p-4 rounded-md text-sm text-yellow-700">
            <p className="font-medium">
              Attention: Billing and shipping information do not match
            </p>
            <p className="mt-2">
              Please verify that the information is correct. Mismatched
              information may require additional verification steps.
            </p>
            <Checkbox
              isSelected={addressMismatchAcknowledged}
              onValueChange={setAddressMismatchAcknowledged}
              className="mt-2"
            >
              I confirm that the billing and shipping information provided is
              correct
            </Checkbox>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Method</h3>

          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            orientation="horizontal"
            classNames={{
              wrapper: "space-x-4",
            }}
          >
            <Radio value="card">Credit or Debit Card</Radio>
            <Radio value="apple" isDisabled description="Coming Soon">
              Apple Pay
            </Radio>
            <Radio value="google" isDisabled description="Coming Soon">
              Google Pay
            </Radio>
          </RadioGroup>
        </div>

        {paymentMethod === "card" && (
          <CardDetailsForm onCardChange={handleCardChange} />
        )}

        <Divider />

        <div className="space-y-4">
          <Slider
            label="Add a tip"
            showTooltip={true}
            step={0.05}
            formatOptions={{ style: "percent" }}
            maxValue={0.3}
            minValue={0}
            marks={[
              {
                value: 0.1,
                label: `10%`,
              },
              {
                value: 0.15,
                label: `15%`,
              },
              {
                value: 0.2,
                label: `20%`,
              },
            ]}
            value={tipAmount / orderData.order.subtotal}
            onChange={(value) =>
              setTipAmount(
                parseFloat(
                  (Number(value) * orderData.order.subtotal).toFixed(2)
                )
              )
            }
            className="max-w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sub-Total</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          {tipAmount > 0 && (
            <div className="flex justify-between">
              <span>Tip</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Service Fee ({orderData.merchant.fee}%)</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Checkbox isSelected={isAcknowledged} onValueChange={setIsAcknowledged}>
          I acknowledge that Backpack is processing this payment on behalf of{" "}
          <span className="font-semibold">{orderData.merchant.name}</span>, and
          I confirm that all provided information is accurate.
        </Checkbox>

        <div className="flex justify-between">
          <Button color="danger" variant="light">
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={
              isOrderPlaced ||
              !isAcknowledged ||
              (addressesDiffer && !addressMismatchAcknowledged) ||
              (paymentMethod === "card" && !isCardValid)
            }
            onPress={handlePlaceOrder}
          >
            Place Order
          </Button>
          <SuccessForm
            isOpen={isSuccessOpen}
            onClose={() => {
              setIsSuccessOpen(false);
              if (!isOrderSuccess) {
                setIsOrderPlaced(false); // Allow retry on failure
              }
            }}
            title={isOrderSuccess ? "Order Placed" : "Order Failed"}
            message={
              isOrderSuccess
                ? `Your order has been placed successfully. You should shortly receive a confirmation email and SMS text with your order details.`
                : `Your order has failed to be placed. Please try again.`
            }
            isSuccess={isOrderSuccess}
            fadeOutOpts={{ autoFadeOut: false }}
            isLoading={isLoading}
          />
        </div>
      </CardBody>
    </Card>
  );
}
