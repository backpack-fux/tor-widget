"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { RadioGroup, Radio, useRadio, RadioProps } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { InfoIcon } from "lucide-react";
import { OrderData } from "./page";
import { useRouter } from "next/navigation";
import { Tooltip } from "@nextui-org/tooltip";
import { Slider } from "@nextui-org/slider";

import CardDetailsForm from "@/components/form/card-details-form";
import AddressForm from "@/components/form/address-form";
import SuccessForm from "@/components/form/success-form";

export default function Checkout({
  orderData,
  onPayment,
}: {
  orderData: OrderData;
  onPayment: (paymentDetails: any) => Promise<void>;
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isCardValid, setIsCardValid] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [addressMismatchAcknowledged, setAddressMismatchAcknowledged] =
    useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

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

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    if (sameAsShipping) {
      setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "card" && !isCardValid) {
      console.log("Please correct the card information");
    } else {
      try {
        const paymentDetails = {
          // Collect necessary payment details
          method: paymentMethod,
          card:
            paymentMethod === "card"
              ? {
                  /* card details */
                }
              : undefined,
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          tipAmount,
          total: orderData.order.subtotal + serviceFee + tipAmount,
        };

        const result = await onPayment(paymentDetails);
        console.log("Order placed successfully", result);
        setIsSuccessOpen(true);
      } catch (error) {
        console.error("Failed to place order", error);
        // Handle error (show error message to user)
      }
    }
  };

  const addressesDiffer =
    !sameAsShipping &&
    (shippingAddress.name !== billingAddress.name ||
      shippingAddress.address !== billingAddress.address ||
      shippingAddress.city !== billingAddress.city ||
      shippingAddress.state !== billingAddress.state ||
      shippingAddress.zip !== billingAddress.zip);

  const subTotal = orderData.order.subtotal;
  const serviceFee =
    (tipAmount + subTotal) * (Number(orderData.merchant.fee) / 100);
  const total = subTotal + serviceFee + tipAmount;

  return (
    <Card className="max-w-3xl mx-auto p-4 px-4">
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
        />

        <Checkbox isSelected={sameAsShipping} onValueChange={setSameAsShipping}>
          Billing address same as shipping
        </Checkbox>

        {!sameAsShipping && (
          <AddressForm
            title="Billing Information"
            address={billingAddress}
            onChange={handleBillingChange}
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
          <CardDetailsForm
            onCardChange={(_, isValid) => {
              setIsCardValid(isValid);
            }}
          />
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
              !isAcknowledged ||
              (addressesDiffer && !addressMismatchAcknowledged) ||
              (paymentMethod === "card" && !isCardValid)
            }
            onPress={handlePlaceOrder}
          >
            Place Order
          </Button>
          {isSuccessOpen && (
            <SuccessForm
              isOpen={isSuccessOpen}
              onClose={() => setIsSuccessOpen(false)}
              title="Order Placed"
              message={`Your order has been placed successfully. You should shortly receive a confirmation email and SMS text with your order details.`}
              fadeOutOpts={{ autoFadeOut: false }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
