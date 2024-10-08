import type { IconProps } from './types';

export default function Star({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 112}
      height={height || 101}
      viewBox="0 0 112 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="#B9B9B9"
        strokeWidth="3"
        d="M34.371 2.668c-3.896-1.542-8.176.974-8.795 5.111L22.309 29.6a3.55 3.55 0 0 1-1.28 2.24L3.938 45.604c-3.25 2.618-3.25 7.597 0 10.215l17.09 13.765a3.55 3.55 0 0 1 1.28 2.24l3.268 21.82c.62 4.137 4.9 6.653 8.795 5.112L54.73 90.7a3.45 3.45 0 0 1 2.542 0l20.358 8.055c3.896 1.541 8.176-.975 8.795-5.112l3.267-21.82a3.55 3.55 0 0 1 1.28-2.24l17.091-13.765c3.251-2.618 3.251-7.597 0-10.215L90.972 31.84a3.55 3.55 0 0 1-1.28-2.24L86.423 7.78c-.62-4.137-4.9-6.653-8.795-5.111L57.27 10.722a3.451 3.451 0 0 1-2.542 0L34.371 2.668Z"
      />
    </svg>
  );
}
