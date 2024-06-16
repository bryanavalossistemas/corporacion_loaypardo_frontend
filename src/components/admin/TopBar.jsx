export default function TopBar({ text }) {
  return (
    <div className="flex bg-lime-500 px-6 py-3">
      <h2 className="font-bold">{text}</h2>
    </div>
  );
}
