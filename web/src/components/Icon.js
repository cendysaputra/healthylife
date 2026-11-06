// Path ikon
const IKON = {
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 1.5h-15z" />
      <path d="M10 21h4" />
    </>
  ),
  'chevron-down': <path d="M7 10l5 5 5-5" />,
  'arrow-right': <path d="M4 12h15M14 7l5 5-5 5" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />,
  play: <path d="M9 6.5v11l9-5.5z" fill="currentColor" />
};

// Ikon SVG
function Icon({ name, className = '' }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {IKON[name]}
    </svg>
  );
}

export default Icon;
