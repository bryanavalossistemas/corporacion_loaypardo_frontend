export default function HeaderNavItem({ navItem }) {
  return (
    <a key={navItem.id} href={navItem.href}>
      {navItem.label}
    </a>
  );
}
