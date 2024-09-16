import { Radio, RadioGroup } from "@nextui-org/radio";

type TipFormProps = {
  subtotal: number;
  setTipAmount: (amount: number) => void;
};

export default function TipForm({ subtotal, setTipAmount }: TipFormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 block">
        Optional: Add a tip
        <div className="text-sm text-gray-500">
          This will support our services and help us continue to offer you low
          fees and great rates.
        </div>
      </h3>

      <RadioGroup
        onValueChange={(value) => setTipAmount(parseFloat(value))}
        className="flex space-x-2"
        orientation="horizontal"
      >
        <Radio value="0" id="tip-0">
          No tip
        </Radio>
        <Radio value={`${subtotal * 0.1}`} id="tip-10">
          10% (${(subtotal * 0.1).toFixed(2)})
        </Radio>
        <Radio value={`${subtotal * 0.15}`} id="tip-15">
          15% (${(subtotal * 0.15).toFixed(2)})
        </Radio>
      </RadioGroup>
    </div>
  );
}
