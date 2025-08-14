import { useRef, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../RoleExtraction';
import { toast } from 'react-toastify';
import api from '../JWT';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faTrash } from "@fortawesome/free-solid-svg-icons";

const Persons = () => {
  const currentRole = getRoleFromToken();
  const [personsList, setPersonsList] = useState([]);
  const [MembersList, setMembersList] = useState([]);
  const [allPersonsList, setAllPersonsList] = useState([]); 
  const [personsCount, setPersonsCount] = useState(0);
  const [MembersCount, setMembersCount] = useState(0);
  const hasFetched = useRef(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchPersonsList = async () => {
    try {
        const res = await api.get("/GetAllPersons");
        const { Data, Status, Message } = res.data;

        if (Status === "Success") {
        const newData = Data.map(datum => ({
            Id: datum.Id,
            Username: datum.Username,
            Email: datum.Email
        }));
        setPersonsList(newData);
        setAllPersonsList(newData); // keep a copy for searching
        setPersonsCount(newData.length);
        toast.info(Message || "Data retrieved successfully");
        } else {
        toast.error(Message || "Warning Message");
        }
    } catch (err) {
        toast.error(err.response?.data?.Message || err.message);
    }
    };
   
  const fetchMembersList = async () => {
    try {
      const res = await api.get("/GetTeamMembers");
      const { Data, Status, Message } = res.data;

      if (Status === "Success") {
        const newData = Data.map(datum => ({
          Id: datum.Id,
          Username: datum.Username,
          Email: datum.Email,
          Status: datum.Status
        }));
        setMembersList(newData);
        setMembersCount(newData.length);
        toast.info(Message || "Data retrieved successfully");
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchPersonsList();
      fetchMembersList();
      hasFetched.current = true;
    }
  }, []);

  const handleInvite = async (id) => {
    try {
      const res = await api.post("/InvitePerson", { PersonId: id });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "Invitation sent successfully");
        fetchMembersList();
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  const handleSearchBar = (value) => {
    setSearchValue(value);
    if (value.trim() !== '') {
        const filtered = allPersonsList.filter(item =>
        item.Username.toLowerCase().includes(value.toLowerCase())
        );
        setPersonsList(filtered);
        setPersonsCount(filtered.length);
    } else {
        setPersonsList(allPersonsList); // restore from backup
        setPersonsCount(allPersonsList.length);
    }
  };

  const HandleInviteRemove = async (Id) => {
    try {
      const res = await api.post("/RemoveInvitation", { InvitationId: Id });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "Invitation Removed successfully");
        fetchMembersList();
        fetchPersonsList();
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  }

  if (currentRole !== "Team") {
    toast.error("This account cannot access this page");
    return <Navigate to='/' replace />;
  }

  return (
    <div className="container text-center mt-5">
      <h1 className='main-header'>Team Invetations</h1>
       <div className='m-4 d-flex justify-content-evenly align-items-center'>
            <button type="button" className="btn btn-primary">
                Members <span className="badge text-bg-secondary">{MembersCount}</span>
            </button>
            <button type="button" className="btn btn-primary">
                Remebers Members <span className="badge text-bg-secondary">{6-MembersCount}</span>
            </button>
        </div>
      {MembersList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MembersList.map(person => (
                <tr key={person.Id}>
                  <td>{person.Username}</td>
                  <td>{person.Email}</td>
                  <td>{person.Status}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-danger" onClick={() => {HandleInviteRemove(person.Id)}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No Members found.</p>}
      <hr/>
      <div className='m-4 d-flex justify-content-evenly align-items-center'>
        <button type="button" className="btn btn-primary">
          Persons <span className="badge text-bg-secondary">{personsCount}</span>
        </button>
        <span>
          <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              value={searchValue}
              onChange={(e) => handleSearchBar(e.target.value)}
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
        </span>
      </div>

      {/* Persons Table */}
      {personsList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {personsList.map(person => (
                <tr key={person.Id}>
                  <td>{person.Username}</td>
                  <td>{person.Email}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleInvite(person.Id)}
                    >
                      <FontAwesomeIcon icon={faEnvelopeOpenText} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No persons found.</p>}
    </div>
  );
};

export default Persons;
