"use client";

import React from "react";
import { VedicGaneshaCrest } from "./assets/Ornaments";

export function EmeraldNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="ep-navbar items-center relative justify-between px-8" role="banner">
      {/* Brand / Logo on left */}
      <a
        href="#hero"
        className="ep-nav-logo z-10"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("hero");
        }}
      >
        <span className="tracking-widest">Ahvaanam</span>
      </a>

      {/* Nav Links strictly centered in middle */}
      <nav className="ep-nav-links ep-nav-links-center" aria-label="Template navigation">
        <button onClick={() => scrollTo("family")} className="ep-nav-link">
          Family
        </button>
        <button onClick={() => scrollTo("couple")} className="ep-nav-link">
          The Couple
        </button>
        <button onClick={() => scrollTo("events")} className="ep-nav-link">
          Celebrations
        </button>
        <button onClick={() => scrollTo("film")} className="ep-nav-link">
          Film
        </button>
        <button onClick={() => scrollTo("gallery")} className="ep-nav-link">
          Gallery
        </button>
      </nav>

      {/* Right spacer for symmetrical centering */}
      <div className="w-28 hidden md:block pointer-events-none" aria-hidden="true" />
    </header>
  );
}
export default EmeraldNav;
