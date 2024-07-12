import type { IconProps } from './types';

export default function ArrowLeft({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 60}
      height={height || 60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="#171818"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M56 30H4m0 0L31.262 3M4 30l27.262 27"
      />
    </svg>
  );
}
