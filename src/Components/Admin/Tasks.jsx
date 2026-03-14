import { useRef, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../RoleExtraction';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import api from '../JWT';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faFolderPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import * as bootstrap from 'bootstrap';
import * as XLSX from "xlsx";

const Tasks = () => {
  const CurrentRole = getRoleFromToken();
  const [TasksList, UpdateTasksList] = useState([]);
  const [TasksCount, UpdateTasksCount] = useState(0);
  const [TaskInfo, UpdateTaskInfo] = useState({ Category: "", Section: "", Code: "", Disease: "", Datasets: ["", "", ""] });
  const [TaskId, UpdateTaskId] = useState(null);
  const [ExcelFile, setExcelFile] = useState(null);
  const hasFetched = useRef(false);
  const [Loading, setLoading] = useState(false);

  const fetchTasksList = async () => {
    try {
      setLoading(true);
      const res = await api.get("/GetAllTasks");
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
        UpdateTasksList(NewData || []);
        UpdateTasksCount(Data.length || 0);
        toast.info(Message || "Data retrieved successfully");
      } else {
        toast.error(Message || "Warning Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchTasksList();
      hasFetched.current = true;
    }
  }, []);

  const HandlePopUp = (Action, Id, Category, Section, Code, Disease, Dataset) => {
    if (Action === "Insert") {
      document.getElementById("TaskModalLabel").innerHTML = "Insert New Task";
      document.getElementById("TaskModalButton").innerHTML = "Insert";
      UpdateTaskInfo({ Category: "", Section: "", Disease: "", Code: "", Datasets: ["", "", ""] });
      UpdateTaskId(null);
    
    } else if (Action === "Modify") {
      document.getElementById("TaskModalLabel").innerHTML = "Modify Existing Task";
      document.getElementById("TaskModalButton").innerHTML = "Modify";
      UpdateTaskInfo({ Category, Section, Disease, Code, Datasets: Dataset });
      UpdateTaskId(Id);
    
    } else if (Action === "InsertFile") { // ⚡ Excel popup
      document.getElementById("ExcelModalLabel").innerHTML = "Upload Excel File";
      document.getElementById("ExcelModalButton").innerHTML = "Upload";
      setExcelFile(null);
    }
  };

  const ChangeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith("Dataset")) {
      const index = parseInt(name.replace("Dataset", "")) - 1;
      UpdateTaskInfo(prev => {
        const newDatasets = [...prev.Datasets];
        newDatasets[index] = value;
        return { ...prev, Datasets: newDatasets };
      });
    } else if (name === "Sheet") {
      setExcelFile(files[0]);
    } else {
      UpdateTaskInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const HandleRemove = async (Id) => {
    setLoading(true);
    if (!Id) return toast.error("No Id Selected");
    try {
      const res = await api.post("/DeleteTask", { Id });
      const { Status, Message } = res.data;
      if (Status === "Success") {
        fetchTasksList();
        toast.success(Message || "Deleted successfully");
      } else {
        toast[Status === "Warning" ? "warn" : "error"](Message || "Error Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
    setLoading(false);
  };

  const HandleSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    const Insert = TaskId === null;
    try {
      const res = await api.post(Insert ? "/InsertTask" : "/ModifyTask", Insert ? TaskInfo : { Id: TaskId, ...TaskInfo });
      const { Status, Message } = res.data;
      if (Status === "Success") {
        fetchTasksList();
        toast.success(Message || (Insert ? "Task inserted" : "Task modified"));
        bootstrap.Modal.getOrCreateInstance(document.getElementById("taskModal")).hide();
        document.body.classList.remove('modal-open');
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      } else {
        toast[Status === "Warning" ? "warn" : "error"](Message || "Error Message");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
    setLoading(false);
  };

  const HandleSubmitExcel = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!ExcelFile) return toast.error("Please select a file");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);

        console.log(sheetData)

        // Loop through rows and insert
        for (let row of sheetData) {
          const newTask = {
            Category: row.Category || "",
            Section: row.Section || "",
            Code: row.Code || "",
            Disease: row.Disease || "",
            Datasets: [row.Dataset1 || "", row.Dataset2 || "", row.Dataset3 || ""]
          };
          await api.post("/InsertTask", newTask);
        }

        fetchTasksList();
        toast.success("Excel imported successfully");
        bootstrap.Modal.getOrCreateInstance(document.getElementById("excelModal")).hide();
      } catch (err) {
        toast.error(err.message || "Error parsing Excel");
      }
    };
    setLoading(false);
    reader.readAsBinaryString(ExcelFile);
  };

  if (CurrentRole !== "Admin") {
    toast.error("This account cannot access this page");
    return <Navigate to='/' replace />;
  }

  return (
    <div className="container text-center mt-5">
      {Loading && <Loader text="Fetching tasks..." />}
      <h1 className='main-header'>Tasks management</h1>
      <div className='m-4 d-flex justify-content-evenly align-items-center'>
        <button type="button" className="btn btn-primary">
          Tasks <span className="badge text-bg-secondary">{TasksCount}</span>
        </button>
        <span>
          <button className='btn btn-primary me-2' onClick={() => HandlePopUp("Insert")} data-bs-toggle="modal" data-bs-target="#taskModal">
            <FontAwesomeIcon icon={faFolderPlus} />
          </button>
          <button className='btn btn-primary' onClick={() => HandlePopUp("InsertFile")} data-bs-toggle="modal" data-bs-target="#excelModal">
            <FontAwesomeIcon icon={faFileImport} /> {/* ⚡ new button */}
          </button>
        </span>
      </div>

      {/* Tasks Table */}
      {TasksList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th><th>Category</th><th>Section</th><th>Code</th><th>Disease</th><th>Datasets</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {TasksList.map(acc => (
                <tr key={acc.Id}>
                  <td>{acc.Id}</td>
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
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => HandlePopUp("Modify", acc.Id, acc.Category, acc.Section, acc.Code, acc.Disease, acc.Datasets)} data-bs-toggle="modal" data-bs-target="#taskModal">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => HandleRemove(acc.Id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No Tasks found.</p>}

      {/* Task Modal */}
      <div className="modal fade" id="taskModal" tabIndex="-1">
        <div className="modal-dialog">
          <form onSubmit={HandleSubmitTask} className='modal-content'>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="TaskModalLabel"> </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                  <label htmlFor="Category" className="form-label">Category</label>
                  <input
                      type="text" 
                      className="form-control" 
                      id="Category" 
                      name='Category'
                      value={TaskInfo.Category}
                      onChange={ChangeHandler}  
                      required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="Section" className="form-label">Section</label>
                  <input
                      type="text" 
                      className="form-control" 
                      id="Section" 
                      name='Section'
                      value={TaskInfo.Section}
                      onChange={ChangeHandler}  
                      required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="Code" className="form-label">Code</label>
                  <input
                      type="text" 
                      className="form-control" 
                      id="Code" 
                      name='Code'
                      value={TaskInfo.Code}
                      onChange={ChangeHandler}  
                      required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="Disease" className="form-label">Disease</label>
                  <input
                      type="text" 
                      className="form-control" 
                      id="Disease" 
                      name='Disease'
                      value={TaskInfo.Disease}
                      onChange={ChangeHandler}  
                      required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="Dataset1" className="form-label">Dataset 1  (Required)</label>
                  <input
                      type="url" 
                      className="form-control" 
                      id="Dataset1" 
                      name='Dataset1'
                      value={TaskInfo.Datasets[0]|| ""}
                      onChange={ChangeHandler}  
                      required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="Dataset2" className="form-label">Dataset 2 (Optional)</label>
                  <input
                      type="url" 
                      className="form-control" 
                      id="Dataset2" 
                      name='Dataset2'
                      value={TaskInfo.Datasets[1]|| ""}
                      onChange={ChangeHandler}/>
              </div>
              <div className="mb-3">
                  <label htmlFor="Dataset3" className="form-label">Dataset 3 (Optional)</label>
                  <input
                      type="url" 
                      className="form-control" 
                      id="Dataset3" 
                      name='Dataset3'
                      value={TaskInfo.Datasets[2] || ""}
                      onChange={ChangeHandler}/>
              </div>
              <button type="submit" className="btn btn-primary" id="TaskModalButton"></button>
              </div>
          </form>
        </div>
      </div>

      <div className="modal fade" id="excelModal" tabIndex="-1">
        <div className="modal-dialog">
          <form onSubmit={HandleSubmitExcel} className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="ExcelModalLabel"> </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <label htmlFor="Sheet" className="form-label">Upload Excel File</label>
              <input type="file" className="form-control" id="Sheet" name="Sheet" onChange={ChangeHandler} required />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" id="ExcelModalButton"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
