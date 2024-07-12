import type { IconProps } from './types';

export default function Upcoming({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 58}
      height={height || 65}
      viewBox="0 0 58 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M3 27.5V58a4 4 0 0 0 4 4h44a4 4 0 0 0 4-4V27.5m-52 0V14a4 4 0 0 1 4-4h10.5M3 27.5h52m0 0V14a4 4 0 0 0-4-4H17.5m0 0V3m0 7v7m0-14v14m23-14v14"
      />
    </svg>
  );
}
