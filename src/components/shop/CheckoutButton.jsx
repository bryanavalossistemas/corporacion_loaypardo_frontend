import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function CheckOutButton() {
  return (
    <div className="flex justify-end">
      <Link to={"/checkout"}>
        <Button className="mt-4 h-[60px] rounded-none mb-24 px-16 text-base">
          Checkout
        </Button>
      </Link>
    </div>
  );
}
