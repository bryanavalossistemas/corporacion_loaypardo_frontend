import { Button } from "@/components/ui/button";
import HeaderNav from "./HeaderNav";
import HeaderNavItem from "./HeaderNavItem";
import { Link } from "react-router-dom";
import { useStore } from "@/store";

const navItems = [
  {
    id: 1,
    href: "#",
    label: "Mas vendidos",
  },
  {
    id: 2,
    href: "#",
    label: "Nuevos",
  },
  {
    id: 3,
    href: "#",
    label: "Ofertas",
  },
];

export default function HeaderNavs() {
  const cart = useStore((state) => state.cart);

  return (
    <div className="flex-1 flex justify-between text-lg">
      <HeaderNav>
        {navItems.map((navItem) => (
          <HeaderNavItem key={navItem.id} navItem={navItem} />
        ))}
      </HeaderNav>
      <HeaderNav>
        <Link className="h-full flex items-end relative" to="/cart">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.75 1.75H4.25L4.75 4.25M6.75 14.25H19.25L24.25 4.25H4.75M6.75 14.25L4.75 4.25M6.75 14.25L3.88388 17.1161C3.09643 17.9036 3.65414 19.25 4.76777 19.25H19.25M19.25 19.25C17.8693 19.25 16.75 20.3693 16.75 21.75C16.75 23.1307 17.8693 24.25 19.25 24.25C20.6307 24.25 21.75 23.1307 21.75 21.75C21.75 20.3693 20.6307 19.25 19.25 19.25ZM9.25 21.75C9.25 23.1307 8.13071 24.25 6.75 24.25C5.36929 24.25 4.25 23.1307 4.25 21.75C4.25 20.3693 5.36929 19.25 6.75 19.25C8.13071 19.25 9.25 20.3693 9.25 21.75Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Button className="absolute flex justify-center items-center top-1 left-4 rounded-full p-0 w-5 h-5 text-xs">
            {cart.length}
          </Button>
        </Link>
        <Link to="/account/orders">
          <Button className="rounded-none py-4 px-8">MI CUENTA</Button>
        </Link>
      </HeaderNav>
    </div>
  );
}
