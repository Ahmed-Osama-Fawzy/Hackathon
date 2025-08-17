import { Link } from "react-router-dom";
import '../../Styles/Home.css';
import Footer from "./Footer";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    localStorage.clear()
  }, [])
  
  return (
    <main className="home">
      {/* Hero */}
      <section className="hero container text-center text-md-start">
        <div className="hero-badge">Radiology AI Hackathon</div>
        <h1 className="hero-title">
          Diagnose. Innovate. <span>Collaborate.</span>
        </h1>
        <p className="hero-sub">
          Real-world radiology challenges, solved by AI teams. Submit cases, form squads,
          benchmark models, and push patient care forward.
        </p>

        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start hero-cta">
          <Link to="/Tasks" className="btn btn-primary btn-lg">
            <i className="bi bi-journal-medical me-2" /> Explore Challenges
          </Link>
          <Link to="/Invite" className="btn btn-outline-dark btn-lg">
            <i className="bi bi-people-fill me-2" /> Build Your Team
          </Link>
          <Link to="/Register" className="btn btn-success btn-lg">
            <i className="bi bi-person-plus-fill me-2" /> Register
          </Link>
          <Link to="/Login" className="btn btn-warning btn-lg">
            <i className="bi bi-box-arrow-in-right me-2" /> Login
          </Link>
        </div>

        <div className="hero-stats mt-4">
          <div className="stat">
            <i className="bi bi-collection" />
            <div>
              <strong>120+</strong>
              <span>Open Cases</span>
            </div>
          </div>
          <div className="stat">
            <i className="bi bi-cpu" />
            <div>
              <strong>40+</strong>
              <span>Model Submissions</span>
            </div>
          </div>
          <div className="stat">
            <i className="bi bi-clipboard2-data" />
            <div>
              <strong>10</strong>
              <span>Modalities</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container steps text-center mb-5">
        <h2 className="section-title">How It Works</h2>
        <div className="row g-4">
          {[
            { title: "Create Team", text: "Set up a new team space for collaboration and management." },
            { title: "Create Accounts for Individuals", text: "Register accounts for each team member to participate." },
            { title: "Team Collecting - Invitations Sending", text: "Gather your members and send them secure invitations." },
            { title: "Confirm Invitations", text: "Members accept invites to officially join the team." },
            { title: "Select Project/s", text: "Choose your target project(s) from the available challenges." },
            { title: "Start Working", text: "Begin collaborating, building, and submitting your AI solutions." }
          ].map((step, i) => (
            <div className="col-12 col-md-6 col-xl-4" key={i}>
              <div className="card step h-100 p-3">
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <div
                    className="step-icon fs-3 fw-bold bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="ms-3 mb-0">{step.title}</h3>
                </div>
                <p className="mt-2">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured challenge */}
      <section className="container featured">
        <div className="card featured-card shadow-lg">
          <div className="row align-items-center g-0">
            <div className="col-12 col-md-8 p-4">
              <h3 className="mb-2"><i className="bi bi-stars me-2" /> Featured Challenge</h3>
              <p className="mb-3">
                Early detection of pulmonary nodules on low-dose CT. Multi-center dataset with
                verified annotations and ROC-AUC leaderboard.
              </p>
              <Link to="/TasksSelection" className="btn btn-primary">
                <i className="bi bi-rocket-takeoff-fill me-2" /> Join Now
              </Link>
            </div>
            <div className="col-12 col-md-4 p-4 bg-light">
              <ul className="mini-metrics">
                <li><i className="bi bi-files" /> 8k Studies</li>
                <li><i className="bi bi-bullseye" /> AUC Target: 0.92</li>
                <li><i className="bi bi-trophy" /> Live Leaderboard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container categories text-center">
        <h2 className="section-title">Modalities & Categories</h2>
        <div className="row g-4">
          {[
            { icon: "bi-bandaid-fill", title: "X-ray", text: "Fractures, pneumonia, cardiomegaly" },
            { icon: "bi-layers-fill", title: "CT", text: "Lung nodules, hemorrhage, segmentation" },
            { icon: "bi-magnet-fill", title: "MRI", text: "MS lesions, brain tumors, cartilage" },
            { icon: "bi-droplet-fill", title: "Ultrasound", text: "Thyroid, liver, fetal biometry" }
          ].map((c, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={i}>
              <div className="card cat h-100 shadow-sm">
                <i className={`bi ${c.icon}`}></i>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container testimonials my-5 text-center">
        <h2 className="section-title">What Participants Say</h2>
        <div className="row g-4">
          {[
            { name: "Dr. Sarah Ali", text: "This hackathon allowed me to connect with AI experts and tackle real radiology challenges in ways I never imagined." },
            { name: "Ahmed Farouk", text: "Working with diverse teams improved my ML skills and opened doors to future collaborations." }
          ].map((t, i) => (
            <div className="col-12 col-md-6" key={i}>
              <div className="card p-4 shadow-sm h-100">
                <p className="mb-3">"{t.text}"</p>
                <strong className="text-primary">{t.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-section text-center py-5 bg-primary text-white">
        <h2 className="mb-3">Ready to Transform Radiology with AI?</h2>
        <p className="mb-4">Join teams, select projects, and start making an impact today.</p>
        <Link to="/Register" className="btn btn-light btn-lg">
          <i className="bi bi-arrow-right-circle me-2" /> Get Started
        </Link>
      </section>

      {/* Footer */}
      <Footer/>
    </main>
  );
};

export default Home;
