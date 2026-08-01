import { cn } from "@/lib/utils";

/**
 * Brandbook mark: magnifying glass with an eye inside the lens.
 * Rendered with platinum strokes and an aqua iris for the abyssal canvas.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="20.5"
        y1="42.5"
        x2="10.5"
        y2="53.5"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="27" r="18" stroke="currentColor" strokeWidth="3" />
      <path
        d="M18 24c4.5-4.8 9.2-6.8 12-6.8s7.5 2 12 6.8"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path
        d="M19.5 27.5c3.5 3.6 7.2 5.3 10.5 5.3s7-1.7 10.5-5.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="30" cy="26.5" r="6.4" fill="#00b3aa" />
      <circle cx="30" cy="26.5" r="2.6" fill="#012624" />
      <circle cx="27.9" cy="24.4" r="1.25" fill="#eafffd" />
    </svg>
  );
}

export function Logo({
  className,
  showDescriptor = true,
}: {
  className?: string;
  showDescriptor?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 text-platinum", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-medium tracking-[0.06em] whitespace-nowrap">
          ТОЧКА ЗРЕНИЯ
        </span>
        {showDescriptor && (
          <span className="u-label-sm mt-1 text-aqua/70 whitespace-nowrap">
            МЕДЦЕНТР&nbsp;&nbsp;|&nbsp;&nbsp;ОПТИКА
          </span>
        )}
      </div>
    </div>
  );
}
