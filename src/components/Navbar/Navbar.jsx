import { useTheme } from "../../context/ThemeContext";
import profileImg from "../../assets/profile.png";
import "./Navbar.css";

const LogoIcon = () => (
  <svg width="28" height="26" viewBox="0 0 28 26" fill="none" aria-hidden="true">
    <path
      d="M19.5 0C24.1 2.27 27 7.02 27 12.5c0 7.73-6.27 14-14 14S-1 20.23-1 12.5C-1 7.02 1.9 2.27 6.5 0L14 11 19.5 0z"
      fill="white"
    />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.7 3.7l1.4 1.4M14.9 14.9l1.4 1.4M3.7 16.3l1.4-1.4M14.9 5.1l1.4-1.4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M16.5 11.2A7.5 7.5 0 017.8 2.5a7.5 7.5 0 108.7 8.7z"
      fill="currentColor"
    />
  </svg>
);

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navbar" aria-label="Application navigation">
      {}
      <div className="navbar__logo" aria-label="Invoice App">
        <LogoIcon />
      </div>

      {}
      <div className="navbar__controls">
        <button
          className="navbar__theme-btn"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="navbar__divider" aria-hidden="true" />

        <div className="navbar__avatar-wrap">
          <img
            src={profileImg}
            alt="User profile"
            className="navbar__avatar"
          />
        </div>
      </div>
    </nav>
  );
}
