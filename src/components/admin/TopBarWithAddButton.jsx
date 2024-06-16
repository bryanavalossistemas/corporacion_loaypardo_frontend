import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TopBarWithAddButton({ title, buttonText, src }) {
  return (
    <div className="flex justify-between items-center bg-lime-500 pl-6 pr-2 py-2">
      <h2 className="font-bold">{title}</h2>
      <Link to={src}>
        <Button className="flex items-center justify-center gap-x-2 rounded-none">
          <Plus className="h-6 w-6" strokeWidth={2} />
          <span>{buttonText}</span>
        </Button>
      </Link>
    </div>
  );
}
