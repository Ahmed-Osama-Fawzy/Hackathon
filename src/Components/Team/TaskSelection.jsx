import { useRef, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../RoleExtraction';
import { toast } from 'react-toastify';
import api from '../JWT';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faTrash, faRedo } from "@fortawesome/free-solid-svg-icons";

const TasksSelection = () => {
  const currentRole = getRoleFromToken();
  const [TasksList, setTasksList] = useState([]);
  const [SelectedTasksList, setSelectedTasksList] = useState([]);
  const [allTasksList, setAllTasksList] = useState([]); 
  const [TasksCount, setTasksCount] = useState(0);
  const [SelectedTasksCount, setSelectedTasksCount] = useState(0);
  const hasFetched = useRef(false);
  const [searchValue, setSearchValue] = useState('');

  const fetchTasksList = async () => {
    try {
        const res = await api.get("/GetAllTasks");
        const { Data, Status, Message } = res.data;

        if (Status === "Success") {
        const NewData = Data.filter(item => item.Status === "Open" || item.Status === "ReOpen").map(datum => ({
            Id: datum.Id,
            Category: datum.Category,
            Section: datum.Section,
            Disease: datum.Disease,
            Code: datum.Code,
            Datasets: datum.Datasets
        }));
        setTasksList(NewData);
        setAllTasksList(NewData);
        setTasksCount(NewData.length);
        toast.info(Message || "Data retrieved successfully");
        } else {
        toast.error(Message || "Warning Message");
        }
    } catch (err) {
        toast.error(err.response?.data?.Message || err.message);
    }
    };
  
  const fetchSelectedTasksList = async () => {
    try {
      const res = await api.get("/GetSelectedTasks");
      const { Data, Status, Message } = res.data;

      if (Status === "Success") {
        const NewData = Data.map(datum => ({
            Id: datum.Id,
            Category: datum.Category,
            Section: datum.Section,
            Disease: datum.Disease,
            Code: datum.Code,
            Status: datum.Status,
            Datasets: datum.Datasets
        }));
        setSelectedTasksList(NewData);
        setSelectedTasksCount(NewData.length);
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
      fetchTasksList();
      fetchSelectedTasksList();
      hasFetched.current = true;
    }
  }, []);

  const handleSelectTask = async (id) => {
    try {
      const res = await api.post("/SelectTask", { TaskId: id });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "Selection Done successfully");
        fetchSelectedTasksList();
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  const handleSearchBar = (value, filterby) => {
    setSearchValue(value);
    if (value.trim() !== '') {
        const filtered = allTasksList.filter(item =>
        item.Username.toLowerCase().includes(value.toLowerCase())
        );
        setTasksList(filtered);
        setTasksCount(filtered.length);
    } else {
        setTasksList(allTasksList); // restore from backup
        setTasksCount(allTasksList.length);
    }
  };

  const HandleCancelTask = async (Id) => {
    try {
      const res = await api.post("/CancelTask", { SelectionId: Id });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "Task Canceled successfully");
        fetchSelectedTasksList();
        fetchTasksList();
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  }

  const HandleResumeTask = async (Id) => {
    try {
      const res = await api.post("/ResumeTask", { SelectionId: Id });
      const { Status, Message } = res.data;

      if (Status === "Success") {
        toast.success(Message || "Task Resumed successfully");
        fetchSelectedTasksList();
        fetchTasksList();
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
      <h1 className='main-header'>TasksSelection</h1>
       <div className='m-4 d-flex justify-content-evenly align-items-center'>
            <button type="button" className="btn btn-primary">
                Selected Tasks <span className="badge text-bg-secondary">{SelectedTasksCount}</span>
            </button>
            <button type="button" className="btn btn-primary">
                Remebers Selected Tasks <span className="badge text-bg-secondary">{5-SelectedTasksCount}</span>
            </button>
        </div>
      {SelectedTasksList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Section</th>
                <th>Code</th>
                <th>Disease</th>
                <th>Datasets</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {SelectedTasksList.map(Task => (
                <tr key={Task.Id}>
                  <td>{Task.Category}</td>
                  <td>{Task.Section}</td>
                  <td>{Task.Code}</td>
                  <td>{Task.Disease}</td>
                  <td>{Task.Datasets.map((item, idx) => (
                    <a key={idx} href={item} target="_blank" rel="noreferrer" className='btn btn-sm btn-primary'> Dataset {idx + 1} </a>
                  ))}</td>
                  <td>{Task.Status}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-danger" onClick={() => {HandleCancelTask(Task.Id)}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => {HandleResumeTask(Task.Id)}}>
                      <FontAwesomeIcon icon={faRedo} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No Selected Tasks Found.</p>}
      <hr/>
      <div className='m-4 d-flex justify-content-evenly align-items-center'>
        <button type="button" className="btn btn-primary">
          Tasks <span className="badge text-bg-secondary">{TasksCount}</span>
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

      {TasksList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Section</th>
                <th>Code</th>
                <th>Disease</th>
                <th>Datasets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TasksList.map(Task => (
                <tr key={Task.Id}>
                  <td>{Task.Category}</td>
                  <td>{Task.Section}</td>
                  <td>{Task.Code}</td>
                  <td>{Task.Disease}</td>
                  <td>{Task.Datasets.map((item, idx) => (
                    <a key={idx} href={item} target="_blank" rel="noreferrer" className='btn btn-sm btn-primary'> Dataset {idx + 1} </a>
                  ))}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-danger" onClick={() => handleSelectTask(Task.Id)} >
                      <FontAwesomeIcon icon={faEnvelopeOpenText} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No Tasks Found.</p>}
    </div>
  );
};

export default TasksSelection;
