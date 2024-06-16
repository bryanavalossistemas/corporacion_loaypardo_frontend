import Logo from "./Logo";
import HeaderNavs from "./HeaderNavs";

export default function Header() {
  return (
    <header className="h-16 bg-lime-500 flex items-center gap-x-8 px-10 border-orange-500">
      <Logo />
      <HeaderNavs />
    </header>
  );
}
