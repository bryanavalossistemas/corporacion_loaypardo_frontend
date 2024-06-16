export default function HeadingBar({ text }) {
  return (
    <div className="flex items-center border-slate-300 h-[52px] px-[22px] text-2xl font-bold bg-slate-300">
      {text}
    </div>
  );
}
