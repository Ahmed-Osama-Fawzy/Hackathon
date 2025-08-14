import './Styles/App.css';
import ProtectedRouter from './Components/ProtectedRouter';
import Dashboard from './Components/Dashboard';

import Tasks from './Components/Admin/Tasks';

import Invite from './Components/Team/Invite';
import TasksSelection from './Components/Team/TaskSelection';

import Main from './Components/Flow/Main';
import Register from './Components/Flow/Register';
import Home from './Components/Flow/Home';


import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, } from 'react-router-dom';

function MainRouter() {
  return <Outlet />;
}

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainRouter />}>
        <Route index element={<Home />} />
        <Route path='Login' element={<Main />} />
        <Route path='Register' element={<Register />} />
        <Route
          path="Dashboard"
          element={
            <ProtectedRouter allowedRoles={['Admin', 'Person', 'Team']}>
              <Dashboard />
            </ProtectedRouter>
          }
        />
        <Route
          path="Tasks"
          element={
            <ProtectedRouter allowedRoles={['Admin']}>
              <Tasks />
            </ProtectedRouter>
          }
        />
        <Route
          path="Invite"
          element={
            <ProtectedRouter allowedRoles={['Team']}>
              <Invite />
            </ProtectedRouter>
          }
        />
        <Route
          path="TasksSelection"
          element={
            <ProtectedRouter allowedRoles={['Team']}>
              <TasksSelection />
            </ProtectedRouter>
          }
        />
      </Route>
    )
  );

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
