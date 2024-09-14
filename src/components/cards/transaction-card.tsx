"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function TransactionCard() {
  return (
    <Card className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-4 px-4">
      <CardHeader className="flex flex-col items-center pb-0 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Backpack Transactional On-ramps
        </h1>
      </CardHeader>
      <CardBody>
        <p className="text-center mb-4 px-20">
          <span className="font-semibold text-pink-500">MyBackpack LLC</span>{" "}
          <span className="text-gray-500">
            provides transactional on-ramp services and is the name that will
            appear on your.
          </span>
          <span className="text-pink-500">bank statement</span>
        </p>
        <p className="text-center mb-6 text-gray-500">
          This payment link will expire in{" "}
          <span className="text-pink-500 font-semibold">60 minutes</span>,
          support is provided as needed in real time.
        </p>

        <Accordion>
          <AccordionItem
            key="1"
            aria-label="Name difference"
            className="bg-gray-500 p-4 rounded-lg mb-4"
            title="Does the name on your card differ from the name on the order?"
          >
            <div className="flex flex-col gap-4 mt-2">
              <Input readOnly label="Order Name" placeholder="Rick Sanchez" />
              <Input label="First Name" placeholder="Morty" />
              <Input label="Last Name" placeholder="Smith" />
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Address difference"
            className="bg-gray-500 p-4 rounded-lg mb-4"
            title="Does the billing address on your card differ from the delivery address?"
          >
            <div className="flex flex-col gap-4 mt-2">
              <Input
                label="Billing Address"
                placeholder="Enter billing address"
              />
              <Input label="City" placeholder="Enter city" />
              <Input
                label="State/Province"
                placeholder="Enter state or province"
              />
              <Input label="Postal Code" placeholder="Enter postal code" />
              <Input label="Country" placeholder="Enter country" />
            </div>
          </AccordionItem>
        </Accordion>

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
          <Button
            as={Link}
            className="w-1/2"
            color="primary"
            href={siteConfig.links.payment}
          >
            Proceed
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
