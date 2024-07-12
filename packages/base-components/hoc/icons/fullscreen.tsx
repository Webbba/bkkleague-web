import type { IconProps } from './types';

export default function FullScreen({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 60}
      height={height || 60}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M35 25 56 4m0 0H38m18 0v18M25 35 4 56m0 0h18M4 56V38"
      />
    </svg>
  );
}
