import Image from "next/image";


export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white animate-fade-in">
  <Image src="/novitic-logo.png" alt="Novitic Logo" width={120} height={120} priority />
      <span className="mt-6 text-zinc-500 text-lg font-semibold animate-pulse">Cargando Novitic...</span>
    </div>
  );
}
