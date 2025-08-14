import { getRoleFromToken } from './RoleExtraction';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const CurrentRole = getRoleFromToken();

  const navItems = [
    { title: "Dashboard", roles: ["Admin", "User", "FounderUser"], url: "/Dashboard", icon: "bi-speedometer2" },
    { title: "Tasks", roles: ["Admin"], url: "/Tasks", icon: "bi-journal-bookmark" },
  ];

  const mainStyle = {
    width: "4.5rem",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%"
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 bg-body-tertiary" style={mainStyle}>
      {/* Brand / Logo */}
      <span className="d-block p-3 link-body-emphasis text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="right" title="Icon-only">
        <i className="bi bi-0-circle"></i>
        <span className="visually-hidden">Icon-only</span>
      </span>

      {/* Navigation List */}
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        {navItems
          .filter(item => item.roles.includes(CurrentRole))
          .map(({ title, url, icon }, idx) => (
            <li key={idx} className="nav-item">
              <Link
                to={url}
                replace
                className="nav-link active py-3 border-bottom rounded-0"
                aria-current="page"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={title}
              >
                <i className={`bi ${icon}`}></i>
              </Link>
            </li>
          ))}
      </ul>

      {/* Profile Dropdown */}
      {/* <div className="dropdown border-top mt-auto">
        <span
          className="d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src="https://github.com/mdo.png" alt="Profile" width="24" height="24" className="rounded-circle" />
        </span>
        <ul className="dropdown-menu text-small shadow">
          <li><Link className="dropdown-item" replace to="/Profile">Profile</Link></li>
          <li><hr className="dropdown-divider" /></li>
          <li><Link className="dropdown-item" to="/">Sign out</Link></li>
        </ul>
      </div> */}
    </div>
  );
};

export default Navbar;
