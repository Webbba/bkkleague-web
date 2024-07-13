import type { IconProps } from './types';

export default function Close({ width, height }: IconProps): JSX.Element {
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
        d="m6 6 48 48M54 6 6 54"
      />
    </svg>
  );
}
