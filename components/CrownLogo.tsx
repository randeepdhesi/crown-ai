import Image from "next/image";

export default function CrownLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/crown-logo.svg"
      alt="Crown Building Supplies"
      width={size}
      height={Math.round(size * (195 / 256))}
      className={className}
    />
  );
}
