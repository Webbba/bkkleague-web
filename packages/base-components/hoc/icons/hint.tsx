import type { IconProps } from './types';

export default function Hint({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" fill="#0099DE" rx="12" />
      <path
        stroke="#fff"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 9h3.5v10m0 0h-3m3 0h3"
      />
      <circle cx="12" cy="4.5" r="1.5" fill="#fff" />
    </svg>
  );
}
