import type { IconProps } from './types';

export default function Completed({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 60}
      height={height || 60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M38.5 4H8a4 4 0 0 0-4 4v44a4 4 0 0 0 4 4h44a4 4 0 0 0 4-4V33.5"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="m16 31.5 7.172 7.172a4 4 0 0 0 5.656 0L55.5 12"
      />
    </svg>
  );
}
