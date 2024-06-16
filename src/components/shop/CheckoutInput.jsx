import { Input } from "../ui/input";

export default function DirectionInput({ ...props }) {
  return (
    <Input
      className="h-[64px] rounded-none border-none text-xl bg-[#F6F6F6] px-6"
      {...props}
    />
  );
}
