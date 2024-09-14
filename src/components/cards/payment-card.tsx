"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Radio, RadioGroup } from "@nextui-org/radio";

import { siteConfig } from "@/config/site";

export default function PaymentCard() {
  return (
    <Card className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-4 px-4">
      <CardHeader className="flex flex-col items-center pb-0 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">Payment Details</h1>
      </CardHeader>
      <CardBody>
        <p className="text-center mb-4 px-20">
          <span className="font-semibold text-pink-500">Optional:</span>{" "}
          <span className="text-gray-500">
            Add a tip to support our services and development.
          </span>
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center mb-4">
            <RadioGroup orientation="horizontal">
              <Radio value="10">Good 10%</Radio>
              <Radio value="15">Excellent 15%</Radio>
              <Radio value="random">Karma random</Radio>
            </RadioGroup>
          </div>

          <div className="flex justify-between gap-4 mb-4">
            <Button className="w-1/2" color="default" variant="flat">
              Apple Pay
            </Button>
            <Button className="w-1/2" color="default" variant="flat">
              Google Pay
            </Button>
          </div>

          <Input label="Card number" placeholder="4242 4242 4242 4242" />
          <div className="flex gap-4">
            <Input className="w-1/2" label="Exp Date" placeholder="01 2024" />
            <Input className="w-1/2" label="CVV" placeholder="123" />
          </div>

          <div className="flex justify-between text-gray-500">
            <div>Sub-Total</div>
            <div>$100.00</div>
          </div>
          <div className="flex justify-between text-gray-500">
            <div>Service Fee</div>
            <div>$07.15</div>
          </div>
          <div className="flex justify-between font-bold text-gray-800">
            <div>Total</div>
            <div>$107.15</div>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button
              as={Link}
              className="w-1/2"
              color="default"
              href={siteConfig.links.home}
              variant="flat"
            >
              Cancel
            </Button>
            <Button className="w-1/2" color="primary">
              Place Order
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
