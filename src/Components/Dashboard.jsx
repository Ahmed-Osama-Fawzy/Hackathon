import React, {useState, useRef, useEffect} from 'react';
import {getRoleFromToken} from './RoleExtraction';
import api from './JWT';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck , faTimes } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const userRole = getRoleFromToken();
  const [InvitationsList, UpdateInvitationsList] = useState([]);
  const [InvitationsCount, UpdateInvitationsCount] = useState(0);
  const [TasksList, UpdateTasksList] = useState([]);
  const [TasksCount, UpdateTasksCount] = useState(0);
  const hasFetched = useRef(false);

  const fetchInvitationsList = async () => {
    try {
      const res = await api.get("/GetPersonInvitations");
      const { Data, Status, Message } = res.data;

      if (Status === "Success") {
        const NewData = Data.map(datum => ({
          Id: datum.Id,
          Username: datum.Username,
          Status: datum.Status
        }));
        UpdateInvitationsList(NewData || []);
        UpdateInvitationsCount(Data.length || 0);
        toast.info(Message || "Data retrieved successfully");
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  const fetchTasksList = async () => {
    try {
      const res = await api.get("/GetPersonTasks");
      const { Data, Status, Message } = res.data;

      if (Status === "Success") {
       const NewData = Data.map(datum => ({
          Team: datum.TeamUsername,
          Id: datum.TaskId,
          Category: datum.Category,
          Section: datum.Section,
          Disease: datum.Disease,
          Code: datum.Code,
          Datasets: datum.Datasets
        }));

        UpdateTasksList(NewData || []);
        UpdateTasksCount(Data.length || 0);
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
      if(userRole === "Person"){
        fetchInvitationsList();
        fetchTasksList();
      }
      hasFetched.current = true;
    }
  }, [userRole]);

  const HandleInvitaion = async (Type, Id) => {
    try {
      const res = await api.post(Type === "Accept" ? "/AcceptInvitation" : "/RejectInvitation", {InvitationId:Id});
      const { Status, Message } = res.data;
      if (Status === "Success") {
        fetchInvitationsList();
        fetchTasksList();
        toast.success(Message || (Type === "Accept" ? "Task Acceppted Successfully" : "Task Rejected Successfully"));
      } else {
        toast[Status === "Warning" ? "warn" : "error"](Message || "Error Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  }

  return (
    <div className="container text-center mt-5">
      <h1 className='main-header'> Your Dashboard</h1>
      <div>
          {
          userRole === "Person" ? 
            <div className='m-4'>
              <div>
                <div className='m-4 d-flex justify-content-evenly align-items-center'>
                  <button type="button" className="btn btn-primary">
                    Tasks <span className="badge text-bg-secondary">{InvitationsCount}</span>
                  </button>
                </div>
                {InvitationsList.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Team</th><th>Inviation Status</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {InvitationsList.map(acc => (
                          <tr key={acc.Id}>
                            <td>{acc.Username}</td>
                            <td>{acc.Status}</td>
                            <td className="d-flex justify-content-center gap-2">
                              <button className="btn btn-sm btn-primary" onClick={() => HandleInvitaion("Accept", acc.Id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => HandleInvitaion("Reject", acc.Id)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p>No Invitations Found.</p>}
              </div>
              <div>
                <div className='m-4 d-flex justify-content-evenly align-items-center'>
                  <button type="button" className="btn btn-primary">
                    Tasks <span className="badge text-bg-secondary">{TasksCount}</span>
                  </button>
                </div>
                {TasksList.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Team</th><th>Category</th><th>Section</th><th>Code</th><th>Disease</th><th>Datasets</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TasksList.map(acc => (
                          <tr key={acc.Id}>
                            <td>{acc.Team}</td>
                            <td>{acc.Category}</td>
                            <td>{acc.Section}</td>
                            <td>{acc.Code}</td>
                            <td>{acc.Disease}</td>
                            <td>
                              {acc.Datasets.map((item, idx) => (
                                <a key={idx} href={item} target="_blank" rel="noreferrer" className='btn btn-sm btn-primary'> Dataset {idx + 1} </a>
                              ))}
                            </td>
                            <td>{acc.Status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p>No Tasks Found.</p>}
              </div>
            </div>
          : userRole === "Admin" ? 
            <div>
              <h1> Admin </h1>
            </div>
          : 
            <div>
              <h1> Team </h1>
            </div>
          }
      </div>
    </div>
  );
  
};

export default Dashboard;