import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const GITHUB_USERNAME = "Shiva272001";
const LINKEDIN_URL = "https://www.linkedin.com/in/shiva-singh2001";
const EMAIL = "sh.shivasingh43@gmail.com";
const PHONE = "+91 89686 73908";

const skills = [
  ["AI & Generative AI", "Generative AI", "Gemini API", "LangChain", "LLM Agents", "AI APIs"],
  ["Development", "Python", "JavaScript", "React.js", "FastAPI", "HTML5", "CSS3"],
  ["Computer Vision & ML", "OpenCV", "MediaPipe", "YOLOv8", "Deep Learning", "Random Forest"],
  ["Robotics & Hardware", "Arduino", "RC Car", "Sensors", "Motor Control", "L298N / BTS7960", "PCA9685"],
  ["Databases & Cloud", "Google Cloud", "PostgreSQL", "SQLite", "MySQL", "Git", "GitHub", "Vercel", "Render"]
];

// Curated baseline data for all 10 GitHub repositories
const curatedRepoData = {
  "Face-and-age-detection": {
    displayName: "OmniVision AI — Face, Age & Emotion Recognition",
    category: "Computer Vision",
    description: "OmniVision AI is a real-time computer vision web application integrating multi-model deep learning pipelines into a unified dashboard. Performs simultaneous facial recognition, demographic profiling (age & gender estimation), emotion recognition, and multi-class object detection (YOLOv8) from live webcam feeds and uploaded images.",
    stack: ["Python", "YOLOv8", "Deep Learning", "OpenCV", "Computer Vision"],
    homepage: "https://face-and-age-detection.onrender.com/",
    featured: true
  },
  "ai-lms-project": {
    displayName: "AI LMS — Intelligent Learning Management System",
    category: "AI & Generative AI",
    description: "An AI-powered Learning Management System built with React and FastAPI. Features AI lesson and quiz generation, interactive chatbot, intelligent evaluation, tailored learning roadmaps, analytics and personalized study plans.",
    stack: ["React", "FastAPI", "Generative AI", "LLM Agents", "JavaScript"],
    homepage: "https://ai-lms-project-nine.vercel.app/",
    featured: true
  },
  "Sign-language-deaf": {
    displayName: "Sign Language Recognition & Text-to-Speech",
    category: "Computer Vision",
    description: "AI-powered Sign Language Recognition system using computer vision and machine learning to detect hand gestures and convert sign language into text and audible speech in real time for assistive communication.",
    stack: ["Python", "MediaPipe", "Random Forest", "OpenCV", "Text-to-Speech"],
    featured: true
  },
  "multi-agent": {
    displayName: "Autonomous Multi-Agent AI System",
    category: "AI & Generative AI",
    description: "Collaborative multi-agent framework orchestrating specialized LLM agents for complex problem-solving, goal decomposition, automated tool execution, and dynamic task delegation.",
    stack: ["Python", "LangChain", "LLM Agents", "Generative AI", "Agentic AI"],
    featured: true
  },
  "arduino-rc-car": {
    displayName: "Arduino RC Car & Embedded Robotics Systems",
    category: "Robotics & Hardware",
    description: "Hands-on Arduino robotics builds, wireless RC cars, PWM motor drivers (L298N, BTS7960, PCA9685), ultrasonic sensors, obstacle avoidance systems, and comprehensive circuit documentation.",
    stack: ["Arduino", "C++", "Motor Drivers", "Sensors", "Embedded Systems", "Robotics"],
    featured: true
  },
  "face-object-detection": {
    displayName: "Interactive Face & Object Detection Platform",
    category: "Computer Vision",
    description: "Real-time client-side face and multi-object detection platform featuring webcam streaming, responsive bounding box tracking, and interactive browser visualization.",
    stack: ["JavaScript", "TensorFlow.js", "Webcam API", "HTML5 Canvas", "Computer Vision"]
  },
  "green-cloth-project": {
    displayName: "Invisibility Cloak — Color Masking CV",
    category: "Computer Vision",
    description: "Computer vision invisibility cloak effect created with Python and OpenCV using HSV color segmentation, morphological smoothing, and live background frame subtraction.",
    stack: ["Python", "OpenCV", "NumPy", "Image Processing"]
  },
  "Gold-prediction": {
    displayName: "Gold Price Forecasting & Market Analytics",
    category: "Machine Learning",
    description: "Machine learning predictive analytics model analyzing historical financial datasets to forecast gold prices using regression algorithms and exploratory data analysis.",
    stack: ["Python", "Jupyter Notebook", "Scikit-Learn", "Pandas", "Matplotlib"]
  },
  "Age-detection": {
    displayName: "Facial Age & Demographic Classifier",
    category: "Computer Vision",
    description: "Deep learning computer vision model for facial demographic classification and age bracket estimation from static images and video feeds.",
    stack: ["Python", "Jupyter Notebook", "Deep Learning", "CNN", "OpenCV"]
  },
  "gcloud": {
    displayName: "Google Cloud Platform AI & Cloud Automation",
    category: "Cloud & Tools",
    description: "Automation scripts, GCP utilities, and deployment workflows for hosting AI models, containerized apps, and data-driven pipelines on Google Cloud.",
    stack: ["Python", "Google Cloud", "GCP SDK", "Cloud Deployment", "DevOps"]
  }
};

const initialFallbackRepos = Object.entries(curatedRepoData).map(([name, meta]) => ({
  name,
  displayName: meta.displayName,
  category: meta.category,
  description: meta.description,
  url: `https://github.com/${GITHUB_USERNAME}/${name}`,
  homepage: meta.homepage || null,
  stars: 0,
  forks: 0,
  language: meta.stack[0] === "React" ? "JavaScript" : meta.stack[0],
  stack: meta.stack,
  updated_at: new Date().toISOString()
}));

const languageColors = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  "Jupyter Notebook": "#DA5B0B",
  Arduino: "#00979C",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#563d7c",
  TypeScript: "#3178c6"
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

function App() {
  const [repos, setRepos] = useState(initialFallbackRepos);
  const [profile, setProfile] = useState({
    login: GITHUB_USERNAME,
    avatar_url: "/avatar.jpg",
    public_repos: initialFallbackRepos.length
  });
  const [isLive, setIsLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchGitHubData = async () => {
    setIsSyncing(true);
    try {
      const [reposRes, userRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setProfile(prev => ({
          ...prev,
          login: userData.login,
          avatar_url: userData.avatar_url || prev.avatar_url,
          public_repos: userData.public_repos || prev.public_repos
        }));
      }

      if (reposRes.ok) {
        const liveRepos = await reposRes.json();
        if (Array.isArray(liveRepos) && liveRepos.length > 0) {
          const merged = liveRepos.map(live => {
            const curated = curatedRepoData[live.name] || {};
            const cleanName = curated.displayName || live.name.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            const desc = curated.description || live.description || "Open source project by Shiva Singh on GitHub.";
            const category = curated.category || (live.language === "Python" ? "AI & Generative AI" : "Development");
            const stack = curated.stack || [
              live.language,
              ...(live.topics || [])
            ].filter(Boolean);

            return {
              name: live.name,
              displayName: cleanName,
              category,
              description: desc,
              url: live.html_url,
              homepage: live.homepage || curated.homepage || null,
              stars: live.stargazers_count,
              forks: live.forks_count,
              language: live.language || (curated.stack ? curated.stack[0] : "Code"),
              stack: stack.length > 0 ? stack : ["Software"],
              updated_at: live.updated_at
            };
          });

          setRepos(merged);
          setIsLive(true);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }
      }
    } catch (err) {
      console.warn("GitHub live sync fallback activated:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  const categories = ["All", "AI & Generative AI", "Computer Vision", "Robotics & Hardware", "Machine Learning", "Cloud & Tools"];

  const filteredProjects = useMemo(() => {
    return repos.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.language && item.language.toLowerCase().includes(q)) ||
        (item.stack && item.stack.some(s => s.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [repos, selectedCategory, searchQuery]);

  return (
    <>
      <header className="nav">
        <a className="brand" href="#home">
          <span className="brand-mark">S</span> SHIVA SINGH
        </a>
        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="nav-social" title="LinkedIn Profile">
            LinkedIn <Arrow />
          </a>
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="nav-social" title="GitHub Profile">
            GitHub <Arrow />
          </a>
          <a href="#contact" className="nav-contact">Let's talk <Arrow /></a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero section" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse"></span> AI DEVELOPER · AI TRAINER · BUILDER
            </div>
            <h1>Building useful<br /><span>AI experiences.</span></h1>
            <p className="hero-intro">
              Hi, I'm Shiva Singh — an AI and Generative AI Developer and Trainer focused on building practical AI applications, computer vision systems, and robotics hardware projects.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                Explore my work ({repos.length} Repos) <Arrow />
              </a>
              <a className="button secondary" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                Connect on LinkedIn <Arrow />
              </a>
              <a className="button secondary" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
                GitHub @{GITHUB_USERNAME} <Arrow />
              </a>
            </div>
            <div className="hero-links">
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
                GitHub (@{GITHUB_USERNAME}) <Arrow />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                LinkedIn (/in/shiva-singh2001) <Arrow />
              </a>
              <span>Ludhiana, Punjab, India</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Shiva Singh technology avatar">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="core">
              <img
                src={profile.avatar_url || "/avatar.jpg"}
                alt="Shiva Singh"
                className="core-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = "https://avatars.githubusercontent.com/u/270882891?v=4";
                }}
              />
              <div className="core-badge">SHIVA SINGH</div>
            </div>
            <div className="float-card card-python"><b>Py</b><span>Python & OpenCV</span></div>
            <div className="float-card card-gen"><b>✳</b><span>Generative AI</span></div>
            <div className="float-card card-robot"><b>⌘</b><span>Robotics & Arduino</span></div>
            <div className="art-caption">GitHub @{GITHUB_USERNAME}<span>✦</span></div>
          </div>
        </section>

        {/* TICKER */}
        <section className="ticker" aria-label="Areas of focus">
          <div>
            GENERATIVE AI <i>✳</i> COMPUTER VISION <i>✳</i> MACHINE LEARNING <i>✳</i> ROBOTICS & ARDUINO <i>✳</i> FULL-STACK APPS <i>✳</i> AI EDUCATION <i>✳</i>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section about" id="about">
          <div className="section-label">01 / ABOUT</div>
          <div className="about-content">
            <h2>Curious by nature.<br /><span>Practical by design.</span></h2>
            <div>
              <p className="large-copy">
                I enjoy turning ideas into useful technology — from Generative AI applications and computer vision systems to hands-on robotics hardware.
              </p>
              <p>
                My work combines applied software engineering with practical teaching. At <strong>TerraMind EdTech</strong>, I train students through project-based AI learning and guide electronics and robotics builds. With <strong>Sure Trust</strong>, I work on developing, testing, and deploying cutting-edge Generative AI applications.
              </p>
              <div className="stats">
                <div><strong>MCA</strong><small>Chandigarh University</small></div>
                <div><strong>{repos.length}+</strong><small>Public Git Projects</small></div>
                <div><strong>AI + CV</strong><small>Software & Robotics</small></div>
                <div><strong>Live</strong><small>Active on GitHub</small></div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="section skills-section" id="skills">
          <div className="section-label">02 / TOOLKIT</div>
          <div className="section-heading">
            <h2>Skills & technologies</h2>
            <p>Tools I use to build, train models, and bring projects to life.</p>
          </div>
          <div className="skills-grid">
            {skills.map(([title, ...items]) => (
              <article className="skill-card" key={title}>
                <div className="skill-top">
                  <span className="skill-dot"></span>
                  <h3>{title}</h3>
                </div>
                <div className="tags">
                  {items.map(item => <span key={item}>{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="section experience" id="experience">
          <div className="section-label">03 / EXPERIENCE</div>
          <div className="section-heading">
            <h2>Where I contribute</h2>
            <p>Building, teaching, and learning through real-world projects.</p>
          </div>
          <div className="timeline">
            <article className="timeline-item">
              <div className="timeline-date">2026 — PRESENT</div>
              <div className="timeline-main">
                <h3>AI Developer & AI Trainer</h3>
                <div className="company">TerraMind EdTech</div>
                <ul>
                  <li>Train students in Artificial Intelligence and Generative AI through practical, project-based curricula.</li>
                  <li>Design and guide hands-on robotics projects involving Arduino, sensors, motor control, and RC car systems.</li>
                  <li>Support AI-focused educational content and facilitate real-world engineering activities.</li>
                </ul>
              </div>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">2026 — PRESENT</div>
              <div className="timeline-main">
                <h3>Generative AI Developer Intern</h3>
                <div className="company">Sure Trust</div>
                <ul>
                  <li>Develop Generative AI applications using Python, LangChain, and modern LLM APIs.</li>
                  <li>Build, test, and deploy AI projects while focusing on reliable integration and real-world problem solving.</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* PROJECTS WITH GITHUB DYNAMIC SYNC */}
        <section className="section projects" id="projects">
          <div className="section-label">04 / SELECTED WORK & GITHUB PROJECTS</div>
          <div className="section-heading">
            <h2>Projects in action</h2>
            <p>All projects stay synchronized with my active GitHub repositories.</p>
          </div>

          {/* GitHub Live Sync Bar */}
          <div className="github-sync-bar">
            <div className="sync-status-group">
              <div className="sync-badge">
                <span className="pulse"></span>
                <span>
                  {isLive ? "Live synced with GitHub" : "Synchronized with GitHub"}{" "}
                  <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
                    @{GITHUB_USERNAME}
                  </a>
                </span>
              </div>
              <span className="sync-meta">
                {repos.length} Public Repositories {lastSyncTime && `· Last updated ${lastSyncTime}`}
              </span>
            </div>

            <button
              className={`sync-btn ${isSyncing ? "spinning" : ""}`}
              onClick={fetchGitHubData}
              title="Click to fetch the latest projects and updates directly from GitHub"
              disabled={isSyncing}
            >
              <span className="spin-icon">↻</span>
              {isSyncing ? "Syncing..." : "Sync Latest GitHub Updates"}
            </button>
          </div>

          {/* Project Filtering and Search */}
          <div className="project-controls">
            <div className="category-pills">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="project-search">
              <input
                type="text"
                placeholder="Search repos (e.g. YOLO, Arduino, LMS, Agent)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Project List */}
          <div className="project-list">
            {filteredProjects.length === 0 ? (
              <div className="no-projects">
                No repositories found matching your filter or search criteria.
              </div>
            ) : (
              filteredProjects.map((project, idx) => {
                const formattedNum = String(idx + 1).padStart(2, "0");
                const langColor = languageColors[project.language] || "#a6f36b";

                return (
                  <article className="project-card" key={project.name}>
                    <div className="project-number">{formattedNum}</div>

                    <div className="project-body">
                      <div className="project-type">{project.category}</div>
                      <h3>
                        {project.displayName}
                        <span className="repo-badge">{project.name}</span>
                      </h3>
                      <p>{project.description}</p>

                      <div className="project-meta-row">
                        {project.language && (
                          <span className="lang-indicator">
                            <span className="lang-dot" style={{ backgroundColor: langColor }}></span>
                            {project.language}
                          </span>
                        )}
                        {project.stars > 0 && (
                          <span className="repo-stat">★ {project.stars}</span>
                        )}
                        {project.forks > 0 && (
                          <span className="repo-stat">⑂ {project.forks}</span>
                        )}
                        {project.updated_at && (
                          <span className="updated-time">
                            Updated {formatDate(project.updated_at)}
                          </span>
                        )}
                      </div>

                      <div className="tags">
                        {project.stack.map(tag => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="project-links-col">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="card-link repo"
                      >
                        GitHub Code <Arrow />
                      </a>
                      {project.homepage && (
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="card-link live"
                        >
                          Live Demo <Arrow />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* EDUCATION */}
        <section className="section education">
          <div className="section-label">05 / EDUCATION</div>
          <div className="education-grid">
            <div>
              <h2>Learning is<br /><span>always in progress.</span></h2>
              <p>Academic foundations in computer applications, complemented by continuous project builds and self-driven research.</p>
            </div>
            <div className="education-items">
              <article>
                <span>2023 — 2025</span>
                <h3>Master of Computer Applications (MCA)</h3>
                <p>Chandigarh University <b>· CGPA 7.75</b></p>
              </article>
              <article>
                <span>2020 — 2023</span>
                <h3>Bachelor of Computer Applications (BCA)</h3>
                <p>PCTE Group of Institutes <b>· CGPA 8.10</b></p>
              </article>
            </div>
          </div>
          <div className="certifications">
            <span>CERTIFICATIONS</span>
            <p>
              Python for Data Science · Big Data Foundations – Level 1 · Certified Cyber Security Analyst – Tata Group · Google Fundamentals of Digital Marketing
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact section" id="contact">
          <div className="section-label">06 / CONTACT</div>
          <div className="contact-content">
            <p className="eyebrow">HAVE A PROJECT OR OPPORTUNITY?</p>
            <h2>Let's build<br /><span>something meaningful.</span></h2>
            <a className="button primary" href={`mailto:${EMAIL}`}>
              Email me directly <Arrow />
            </a>
          </div>

          <div className="contact-cards-grid">
            <a href={`mailto:${EMAIL}`} className="contact-card">
              <span className="contact-card-label">EMAIL</span>
              <span className="contact-card-value">{EMAIL} <Arrow /></span>
              <p className="contact-card-desc">Send me an inquiry or project proposal</p>
            </a>

            <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="contact-card">
              <span className="contact-card-label">PHONE</span>
              <span className="contact-card-value">{PHONE} <Arrow /></span>
              <p className="contact-card-desc">Direct call or WhatsApp</p>
            </a>

            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="contact-card">
              <span className="contact-card-label">LINKEDIN</span>
              <span className="contact-card-value">in/shiva-singh2001 <Arrow /></span>
              <p className="contact-card-desc">Connect with me on LinkedIn</p>
            </a>

            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" className="contact-card">
              <span className="contact-card-label">GITHUB</span>
              <span className="contact-card-value">github.com/{GITHUB_USERNAME} <Arrow /></span>
              <p className="contact-card-desc">Explore all public repositories and code</p>
            </a>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">
          <span className="brand-mark">S</span> SHIVA SINGH
        </a>
        <div className="footer-social-links">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span>·</span>
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <span>Designed &amp; built with curiosity.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
