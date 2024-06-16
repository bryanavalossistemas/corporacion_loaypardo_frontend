import { cn } from "@/lib/utils";

export default function ImageUpload({ src, onSelectFile, className }) {
  return (
    <div className={cn("flex flex-col gap-y-5", className)}>
      <img
        className="flex-1 object-contain"
        src={src ? src : "/placeholder.jpg"}
        alt="imagen"
      />
      <div className="flex justify-center">
        <label
          className="text-base font-medium py-2 px-6 bg-lime-500 cursor-pointer"
          htmlFor="image"
        >
          Agregar Imagen
        </label>
        <input
          className="hidden"
          type="file"
          id="image"
          onChange={onSelectFile}
        />
      </div>
    </div>
  );
}
