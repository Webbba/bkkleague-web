import type { IconProps } from './types';

export default function Break({ width, height }: IconProps): JSX.Element {
  return (
    <svg
      width={width || 112}
      height={height || 101}
      viewBox="0 0 112 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#break-a)"
        stroke="#DD7000"
        strokeWidth="3"
        d="M34.371 2.668c-3.896-1.542-8.176.974-8.795 5.111L22.309 29.6a3.55 3.55 0 0 1-1.28 2.24L3.938 45.604c-3.25 2.618-3.25 7.597 0 10.215l17.09 13.765a3.55 3.55 0 0 1 1.28 2.24l3.268 21.82c.62 4.137 4.9 6.653 8.795 5.112L54.73 90.7a3.45 3.45 0 0 1 2.542 0l20.358 8.055c3.896 1.541 8.176-.975 8.795-5.112l3.267-21.82a3.55 3.55 0 0 1 1.28-2.24l17.091-13.765c3.251-2.618 3.251-7.597 0-10.215L90.972 31.84a3.55 3.55 0 0 1-1.28-2.24L86.423 7.78c-.62-4.137-4.9-6.653-8.795-5.111L57.27 10.722a3.451 3.451 0 0 1-2.542 0L34.371 2.668Z"
      />
      <g filter="url(#reak-b)">
        <path
          fill="#A95300"
          d="M43 68.696V29.423h15.724c2.89 0 5.3.428 7.23 1.285 1.93.856 3.381 2.045 4.353 3.567.971 1.508 1.457 3.247 1.457 5.216 0 1.534-.307 2.882-.92 4.046a7.945 7.945 0 0 1-2.531 2.838c-1.062.728-2.276 1.246-3.644 1.553v.384a8.795 8.795 0 0 1 4.2 1.265c1.316.78 2.384 1.873 3.202 3.28.818 1.393 1.227 3.055 1.227 4.985 0 2.084-.517 3.944-1.553 5.58-1.023 1.624-2.538 2.909-4.545 3.855-2.007.946-4.48 1.419-7.42 1.419H43Zm8.303-6.788h6.77c2.313 0 4-.442 5.062-1.324 1.061-.895 1.592-2.084 1.592-3.566 0-1.087-.263-2.046-.787-2.877-.524-.83-1.272-1.483-2.243-1.956-.96-.473-2.103-.71-3.433-.71h-6.96v10.432Zm0-16.051h6.156c1.138 0 2.147-.198 3.03-.594.895-.41 1.598-.985 2.109-1.726.524-.742.786-1.63.786-2.666 0-1.419-.505-2.563-1.515-3.432-.997-.87-2.416-1.304-4.257-1.304h-6.309v9.722Z"
        />
      </g>
      <defs>
        <linearGradient
          id="break-a"
          x1="56"
          x2="56"
          y1="3.712"
          y2="97.712"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".2" stopColor="#FFDC00" />
          <stop offset="1" stopColor="#FF8E00" />
        </linearGradient>
        <filter
          id="break-b"
          width="30.298"
          height="41.273"
          x="43"
          y="29.423"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.858824 0 0 0 0 0 0 0 0 1 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_138_94"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_138_94"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
