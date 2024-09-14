"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function BlankCard() {
  return (
    <Card className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-4 px-4">
      <CardHeader className="flex flex-col items-center pb-0 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">
          How did you get there?
        </h1>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-center mt-6">
          <Button
            as={Link}
            className="w-1/2"
            color="primary"
            href={siteConfig.links.details}
          >
            Kick Rocks
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
