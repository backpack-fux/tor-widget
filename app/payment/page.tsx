import PaymentCard from "@/components/cards/payment-card";

export default function PaymentView() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center" />
      <PaymentCard />
      <div className="mt-8" />
    </section>
  );
}
