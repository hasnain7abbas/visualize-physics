import { Component } from "solid-js";

export const CatLogo: Component<{ size?: number; class?: string }> = (props) => {
  const s = () => props.size ?? 40;

  return (
    <svg
      width={s()}
      height={s()}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={props.class ?? ""}
    >
      {/* Cat ears */}
      <path
        d="M20 45 L12 12 L38 32 Z"
        fill="var(--accent)"
        opacity="0.9"
      />
      <path
        d="M80 45 L88 12 L62 32 Z"
        fill="var(--accent)"
        opacity="0.9"
      />
      {/* Inner ears */}
      <path
        d="M22 40 L17 18 L35 33 Z"
        fill="#ec4899"
        opacity="0.5"
      />
      <path
        d="M78 40 L83 18 L65 33 Z"
        fill="#ec4899"
        opacity="0.5"
      />
      {/* Head */}
      <circle cx="50" cy="52" r="30" fill="var(--accent)" />
      {/* Face area */}
      <ellipse cx="50" cy="56" rx="22" ry="18" fill="var(--bg-card)" opacity="0.15" />
      {/* Eyes */}
      <g style={{ animation: "catBlink 4s infinite" }}>
        <ellipse cx="38" cy="48" rx="5" ry="5.5" fill="var(--bg-primary)" />
        <ellipse cx="62" cy="48" rx="5" ry="5.5" fill="var(--bg-primary)" />
        {/* Pupils */}
        <ellipse cx="39" cy="48" rx="2.5" ry="3.5" fill="#1a1d23" />
        <ellipse cx="63" cy="48" rx="2.5" ry="3.5" fill="#1a1d23" />
        {/* Eye shine */}
        <circle cx="40.5" cy="46.5" r="1" fill="white" />
        <circle cx="64.5" cy="46.5" r="1" fill="white" />
      </g>
      {/* Nose */}
      <path d="M48 56 L50 59 L52 56 Z" fill="#ec4899" opacity="0.8" />
      {/* Mouth */}
      <path
        d="M50 59 Q44 64 40 62"
        stroke="var(--bg-primary)"
        stroke-width="1.2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M50 59 Q56 64 60 62"
        stroke="var(--bg-primary)"
        stroke-width="1.2"
        fill="none"
        opacity="0.5"
      />
      {/* Whiskers */}
      <g opacity="0.4" stroke="var(--bg-primary)" stroke-width="1">
        <line x1="10" y1="52" x2="32" y2="55" />
        <line x1="8" y1="58" x2="31" y2="58" />
        <line x1="10" y1="64" x2="32" y2="61" />
        <line x1="90" y1="52" x2="68" y2="55" />
        <line x1="92" y1="58" x2="69" y2="58" />
        <line x1="90" y1="64" x2="68" y2="61" />
      </g>
      {/* Atom orbit around cat - physics flair */}
      <ellipse
        cx="50"
        cy="50"
        rx="46"
        ry="16"
        transform="rotate(-30 50 50)"
        stroke="var(--accent)"
        stroke-width="1.2"
        fill="none"
        opacity="0.3"
        stroke-dasharray="4 3"
      />
      <circle cx="78" cy="28" r="3" fill="#06b6d4" opacity="0.8" />
    </svg>
  );
};
