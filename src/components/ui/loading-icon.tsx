import { cn } from "@/lib/utils";

interface LoadingIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function LoadingIcon({ className, size = 24, ...props }: LoadingIconProps) {
  return (
    <div className={cn("loading", className)} {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          id="back"
          points="12 20 24 32 36 20"
        ></polyline>
        <polyline
          id="front"
          points="12 20 24 32 36 20"
        ></polyline>
      </svg>
    </div>
  );
}