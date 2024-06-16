import { Input as AuthInput } from "@/components/ui/input";

export default function Input({ ...props }) {
  return <AuthInput className="w-full py-8 px-4 text-base rounded-none border-none" {...props} />;
}
