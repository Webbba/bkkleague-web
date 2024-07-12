import type { IconProps } from './types';

export default function Missed({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 56}
      height={height || 56}
      viewBox="0 0 56 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M3 17.141 17 3h22l14 14.141V38.86L39 53H17L3 38.859V17.14Z"
      />
      <circle cx="28" cy="38" r="3" fill="gray" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        d="M28 30.5v-15"
      />
    </svg>
  );
}
