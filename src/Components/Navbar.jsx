import { getRoleFromToken } from './RoleExtraction';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const CurrentRole = getRoleFromToken();

  const navItems = [
    { title: "Tasks", roles: ["Admin"], url: "/Tasks", icon: "bi-list-check" },         // Task list icon
    { title: "Invite", roles: ["Team"], url: "/Invite", icon: "bi-person-plus" },       // Invite person icon
    { title: "TasksSelection", roles: ["Team"], url: "/TasksSelection", icon: "bi-ui-checks-grid" } // Task selection icon
  ];

  return (
    <div className="imaginary-navbar">
      {/* Navigation Items */}
      <ul className="nav-list">
        {/* Brand / Logo */}
        <li className="nav-item">
          <Link
            to="/Dashboard"
            replace
            className="nav-link"
            title="Dashboard"
          >
            <i className={`bi bi-speedometer2`}></i>
          </Link>
        </li>
        {navItems
          .filter(item => item.roles.includes(CurrentRole))
          .map(({ title, url, icon }, idx) => (
            <li key={idx} className="nav-item">
              <Link
                to={url}
                replace
                className="nav-link"
                title={title}
              >
                <i className={`bi ${icon}`}></i>
              </Link>
            </li>
          ))}
      </ul>
      <Link
        to="/"
        replace
        className="nav-link"
        title="LogOut"
      >
        <FontAwesomeIcon className='bi' icon={faRightFromBracket} />
      </Link>
    </div>
  );
};

export default Navbar;
