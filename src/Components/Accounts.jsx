import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRoleFromToken } from "./RoleExtraction";
import api from "./JWT";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faBan, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

const Accounts = () => {
  const CurrentRole = getRoleFromToken();
  const [AccountsList, setAccountsList] = useState([]);
  const [AccountsCounts, setAccountsCounts] = useState([]);
  const hasFetched = useRef(null);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/GetAllUsers");
      const Data = res.data.Data
      const Counts = res.data.Counts
      const Status = res.data.Status
      const Message = res.data.Message
      
      if(Status === "Success"){
        const NewData = []
        Data.forEach(datum => {
          let status = datum.Status
          const Obj = {
            Id: datum.Id,
            Username: datum.Username,
            Role: datum.Role,
            Status: status,
            Color: status === "Activated" ? "table-primary" : status === "Blocked" ? "table-danger" : "table-warning"
          }
          NewData.push(Obj)
        })
        setAccountsList(NewData);
        setAccountsCounts(Counts);
        toast.info(Message || "Accounts retrieved successfully");
      
      }else if (Status === "Warning"){
        toast.warn(Message || "Warning Message")
      
      }else{
        toast.error(Message || "Warning Message")
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  useEffect(() => {
  if (!hasFetched.current) {
    fetchAccounts();
    hasFetched.current = true;
  }
}, []);

  const HandleActivate = async (Id) => {
    try {
      const res = await api.post("/ActiveAccount", { AccountId: Id });
      const data = res.data;

      if (data.Status === "Success") {
        fetchAccounts();
        toast.info(data.Message || "Account Updated successfully");
      } else {
        toast.warn(data.Message || "Something unexpected happened");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  const HandleBlock = async (Id) => {
    try {
      const res = await api.post("/BlockAccount", { AccountId: Id });
      const data = res.data;

      if (data.Status === "Success") {
        fetchAccounts();
        toast.info(data.Message || "Account Blocked successfully");
      } else {
        toast.warn(data.Message || "Something unexpected happened");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || err.message);
    }
  };

  if (CurrentRole !== "Owner") {
    toast.error("This account does not have access to this page");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container  text-center  mt-5">
      <h1 className="main-header">account activation</h1>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        {AccountsCounts.map((item, index) => (
          <div className="col" key={index}> 
            <div className="d-flex align-items-center justify-content-around p-3 small-card">
              <FontAwesomeIcon icon={faLayerGroup} size="1x"/>
              <h5> {item.Title} </h5>
              <p className="mb-auto fs-4 mt-auto"> {item.Count} </p>
            </div> 
          </div>
        ))}
      </div>
      {AccountsList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {AccountsList.map((acc) => (
                <tr className={acc.Color} key={acc.Id}>
                  <th>{acc.Id}</th>
                  <td>{acc.Username}</td>
                  <td>{acc.Role}</td>
                  <td>{acc.Status}</td>
                  <td className="d-flex justify-content-center flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => HandleActivate(acc.Id)}
                      title="Activate"
                    >
                      <FontAwesomeIcon icon={faShieldHalved} />
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => HandleBlock(acc.Id)}
                      title="Block"
                    >
                      <FontAwesomeIcon icon={faBan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );
};

export default Accounts;
