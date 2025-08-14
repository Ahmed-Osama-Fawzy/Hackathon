import {getRoleFromToken} from './RoleExtraction';

const Dashboard = () => {
  const userRole = getRoleFromToken()
  
  return (
    <div className="container text-center mt-5">
      <h1 className='main-header'>Dashboard {userRole}</h1>
    </div>
  );
  
};

export default Dashboard;