import { OrderInput } from "@/components/home/order-input";
import { Card } from "@nextui-org/card";

export default function OrderPage() {
  return (
    <div className="flex items-center justify-center">
      <Card className="p-24 px-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Enter Order ID</h1>
        <OrderInput />
      </Card>
    </div>
  );
}
