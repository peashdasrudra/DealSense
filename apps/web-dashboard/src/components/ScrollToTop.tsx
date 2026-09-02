import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "../config/navigation";

/**
 * ScrollToTop Component
 *
 * Automatically manages scroll positioning across all routes and anchor transitions:
 * 1. On full page route transitions without hash: immediately resets scroll to (0, 0).
 * 2. On anchor transitions (e.g. /#pricing-matrix or #faq): waits for render and smoothly scrolls with header offset.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const cleanId = hash.replace("#", "");
      // Allow slight delay for page component mount / animation
      const timer = setTimeout(() => {
        const scrolled = scrollToSection(cleanId, 74);
        if (!scrolled) {
          // Retry once if DOM elements are lazy-mounted
          setTimeout(() => {
            scrollToSection(cleanId, 74);
          }, 120);
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Immediate scroll to top on clean route change
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    }
  }, [pathname, hash]);

  return null;
};
