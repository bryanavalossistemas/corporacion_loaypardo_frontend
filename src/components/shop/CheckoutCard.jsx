export default function CheckoutCard({ heading, children, className }) {
  return (
    <div
      className={`bg-white flex-1  pl-[16px] pr-[33px] pb-[46px] pt-[26px] ${className}`}
    >
      <h2 className="text-2xl font-bold mb-[31px]">{heading}</h2>
      {children}
    </div>
  );
}
