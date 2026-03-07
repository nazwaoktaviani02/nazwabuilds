import { useState, useEffect } from "react";

const NAV_ITEMS = ["Home", "About", "Projects"];

const KADA_PROJECT = {
  title: "KADA App",
  description: "A full-stack note-taking app with user auth, premium upgrade system, and Midtrans payment integration. Built to learn real-world API integration, JWT auth, and MongoDB.",
  tech: ["React", "Node.js", "Express", "MongoDB", "Midtrans"],
  github: "https://github.com/nazwaoktaviani02",
  live: "https://nazwabuilds-kadaapp-frontend.vercel.app/",
  emoji: "📝",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c10;
    --bg2: #0e1318;
    --surface: #131920;
    --border: rgba(255,255,255,0.07);
    --accent: #4af0c4;
    --accent2: #7b6fff;
    --text: #e8edf2;
    --muted: #6b7a8a;
    --card-hover: #171f28;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .portfolio-root {
    min-height: 100vh;
    position: relative;
  }

  /* Background aurora effect */
  .aurora {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .aurora::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(74,240,196,0.06) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: drift1 12s ease-in-out infinite alternate;
  }
  .aurora::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(123,111,255,0.07) 0%, transparent 70%);
    bottom: 0; right: -100px;
    animation: drift2 15s ease-in-out infinite alternate;
  }
  @keyframes drift1 { to { transform: translate(80px, 60px); } }
  @keyframes drift2 { to { transform: translate(-60px, -80px); } }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  .nav-pill {
    display: flex;
    gap: 4px;
    background: rgba(14,19,24,0.85);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 6px;
  }
  .nav-btn {
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    padding: 8px 22px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.02em;
  }
  .nav-btn:hover { color: var(--text); }
  .nav-btn.active {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }

  /* PAGES */
  .page {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 24px 60px;
    animation: fadeUp 0.5s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* HOME */
  .home-content {
    max-width: 680px;
    width: 100%;
  }
  .home-tag {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid rgba(74,240,196,0.2);
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
  }
  .home-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 8vw, 88px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }
  .home-name .accent { color: var(--accent); }
  .home-nickname {
    font-family: 'Syne', sans-serif;
    font-size: clamp(18px, 3vw, 26px);
    font-weight: 400;
    color: var(--muted);
    margin-bottom: 32px;
    letter-spacing: -0.01em;
  }
  .home-bio {
    font-size: 17px;
    line-height: 1.75;
    color: rgba(232,237,242,0.7);
    max-width: 520px;
    margin-bottom: 44px;
  }
  .home-cta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }
  .btn-primary {
    background: var(--accent);
    color: #080c10;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 13px 28px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(74,240,196,0.25); }
  .btn-ghost {
    background: none;
    color: var(--text);
    border: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    padding: 13px 28px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.2); background: var(--surface); }

  /* ABOUT */
  .about-content {
    max-width: 680px;
    width: 100%;
  }
  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
  }
  .about-bio {
    font-size: 18px;
    line-height: 1.8;
    color: rgba(232,237,242,0.75);
    margin-bottom: 48px;
  }
  .about-bio strong { color: var(--text); font-weight: 400; }
  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .skill-chip {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 13px;
    padding: 7px 16px;
    border-radius: 100px;
    transition: all 0.2s;
  }
  .skill-chip:hover { border-color: rgba(74,240,196,0.3); color: var(--accent); }

  /* PROJECTS */
  .projects-content {
    max-width: 760px;
    width: 100%;
  }
  .projects-header {
    margin-bottom: 48px;
  }
  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .project-card:hover {
    border-color: rgba(74,240,196,0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.4);
    background: var(--card-hover);
  }
  .card-preview {
    background: linear-gradient(135deg, #0e1f1a 0%, #0e1018 50%, #150e1f 100%);
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 72px;
    position: relative;
    overflow: hidden;
  }
  .card-preview::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(74,240,196,0.02) 2px,
      rgba(74,240,196,0.02) 4px
    );
  }
  .card-body {
    padding: 28px 32px 32px;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 12px;
  }
  .card-desc {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(232,237,242,0.65);
    margin-bottom: 20px;
  }
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
  }
  .tech-tag {
    background: rgba(74,240,196,0.07);
    border: 1px solid rgba(74,240,196,0.15);
    color: var(--accent);
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.03em;
  }
  .card-actions {
    display: flex;
    gap: 12px;
  }
  .btn-card-primary {
    background: var(--accent);
    color: #080c10;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 22px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-card-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(74,240,196,0.2); }
  .btn-card-ghost {
    background: none;
    color: var(--muted);
    border: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 10px 22px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-card-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

  /* FOOTER */
  .footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 32px;
    color: var(--muted);
    font-size: 13px;
    border-top: 1px solid var(--border);
  }
  .footer a { color: var(--accent); text-decoration: none; }
`;

export default function Portfolio() {
  const [active, setActive] = useState("Home");

  useEffect(() => {
    // Inject styles
    const el = document.createElement("style");
    el.textContent = styles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  return (
    <div className="portfolio-root">
      <div className="aurora" />

      {/* NAV */}
      <nav>
        <div className="nav-pill">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={`nav-btn ${active === item ? "active" : ""}`}
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* PAGES */}
      {active === "Home" && (
        <section className="page" key="home">
          <div className="home-content">
            <span className="home-tag">Available for work ✦</span>
            <h1 className="home-name">
              Nazwa<br />
              <span className="accent">Oktaviani</span>
            </h1>
            <p className="home-nickname">— they call me Naz</p>
            <p className="home-bio">
              Fresh graduate in digital business. I love learning languages — both programming ones and foreign ones. Currently building things and figuring out how the web works, one project at a time.
            </p>
            <div className="home-cta">
              <button className="btn-primary" onClick={() => setActive("Projects")}>
                See my work →
              </button>
              <button className="btn-ghost" onClick={() => setActive("About")}>
                About me
              </button>
            </div>
          </div>
        </section>
      )}

      {active === "About" && (
        <section className="page" key="about">
          <div className="about-content">
            <p className="section-label">Who I am</p>
            <h2 className="section-title">Just a girl who<br />builds things.</h2>
            <p className="about-bio">
              Hi! I'm <strong>Nazwa</strong>, a fresh graduate from digital business who fell in love with coding.
              I enjoy picking up new programming languages the same way I enjoy learning foreign ones —
              curiosity first, structure later. Right now I'm deep into full-stack development,
              exploring everything from backend APIs to payment integrations.
            </p>
            <div className="skills-grid">
              {["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "Midtrans", "Git"].map(s => (
                <span key={s} className="skill-chip">{s}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {active === "Projects" && (
        <section className="page" key="projects">
          <div className="projects-content">
            <div className="projects-header">
              <p className="section-label">What I've built</p>
              <h2 className="section-title">Projects</h2>
            </div>

            <div className="project-card">
              <div className="card-preview">
                <span style={{ position: "relative", zIndex: 1 }}>{KADA_PROJECT.emoji}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{KADA_PROJECT.title}</h3>
                <p className="card-desc">{KADA_PROJECT.description}</p>
                <div className="tech-stack">
                  {KADA_PROJECT.tech.map(t => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
                <div className="card-actions">
                  <a
                    className="btn-card-primary"
                    href={KADA_PROJECT.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ↗ See It Live
                  </a>
                  <a
                    className="btn-card-ghost"
                    href={KADA_PROJECT.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="footer">
        Built by <a href="https://github.com/nazwaoktaviani02" target="_blank" rel="noreferrer">Nazwa Oktaviani</a> · 2026
      </footer>
    </div>
  );
}