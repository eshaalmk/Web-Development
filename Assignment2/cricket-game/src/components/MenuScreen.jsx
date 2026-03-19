import { useState } from "react";
import { BATTING_STYLES } from "../utils/constants";
import "../styles/MenuScreen.css";

/**
 * MenuScreen
 * Starting screen: pick batting style then begin.
 */
export default function MenuScreen({ onStart }) {
  const [style, setStyle] = useState("aggressive");
  const current = BATTING_STYLES[style];

  return (
    <div className="menu-screen">
      {/* Ambient blobs */}
      <div className="menu-blob menu-blob-1" />
      <div className="menu-blob menu-blob-2" />
      <div className="menu-blob menu-blob-3" />

      <div className="menu-card">
        {/* Header */}
        <div className="menu-header">
          <div className="menu-icon">🏏</div>
          <h1 className="menu-title">CRICKET BLAST</h1>
          <p className="menu-subtitle">2 OVERS · 3 WICKETS · PROBABILITY BATTING</p>
        </div>

        {/* Style selector */}
        <div className="menu-section">
          <p className="menu-section-label">CHOOSE BATTING STYLE</p>
          <div className="menu-style-grid">
            {Object.entries(BATTING_STYLES).map(([key, s]) => (
              <button
                key={key}
                className={`menu-style-btn ${style === key ? "menu-style-btn-active" : ""}`}
                style={{ "--accent": s.accent }}
                onClick={() => setStyle(key)}
              >
                <span className="menu-style-icon">{s.icon}</span>
                <span className="menu-style-name">{s.label.toUpperCase()}</span>
                <span className="menu-style-desc">{s.desc}</span>
                <span className="menu-style-stats">
                  {key === "aggressive" ? "W: 40% · 6: 15%" : "W: 15% · 1: 25%"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Power bar preview */}
        <div className="menu-section">
          <p className="menu-section-label">POWER BAR PREVIEW</p>
          <div className="menu-bar-preview">
            {current.probs.map((p, i) => (
              <div
                key={i}
                className="menu-bar-seg"
                style={{
                  width:       `${p.prob * 100}%`,
                  background:  p.color,
                  borderRight: i < current.probs.length - 1 ? "1px solid rgba(0,0,0,0.4)" : "none",
                }}
                title={`${p.label}: ${(p.prob * 100).toFixed(0)}%`}
              >
                {p.prob >= 0.09 ? `${(p.prob * 100).toFixed(0)}%` : ""}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="menu-legend">
            {current.probs.map((p, i) => (
              <div key={i} className="menu-legend-item">
                <div className="menu-legend-dot" style={{ background: p.color }} />
                <span>{p.label} {(p.prob * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to play */}
        <div className="menu-howto">
          <p>🎯 Watch the slider sweep across the power bar</p>
          <p>🏏 Click <strong>PLAY SHOT</strong> or press <strong>SPACE</strong> to bat</p>
          <p>📊 Outcome depends on where the slider lands</p>
        </div>

        {/* Start button */}
        <button
          className="menu-start-btn"
          onClick={() => onStart(style)}
        >
          🏏 START BATTING
        </button>
      </div>
    </div>
  );
}
