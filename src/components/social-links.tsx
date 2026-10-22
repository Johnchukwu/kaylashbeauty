type SocialLinksProps = { className?: string };

export function SocialLinks({ className = "socials" }: SocialLinksProps) {
  return (
    <div className={className} aria-label="Social media">
      <a
        href="https://www.instagram.com/kaylashbeautyplace/"
        target="_blank"
        rel="noreferrer"
        aria-label="Kaylash Beauty Place on Instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      </a>
      <a
        href="https://www.tiktok.com/@kaylashbeautyplace"
        target="_blank"
        rel="noreferrer"
        aria-label="Kaylash Beauty Place on TikTok"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 4v10.2a4.1 4.1 0 1 1-3-3.95"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 4c.8 2.5 2.4 3.8 5 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </a>
    </div>
  );
}
