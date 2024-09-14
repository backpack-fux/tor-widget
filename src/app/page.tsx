import BlankCard from "@/components/cards/blank-card";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center" />
      <BlankCard />
      <div className="mt-8" />
    </section>
  );
}
