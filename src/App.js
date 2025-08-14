import './Styles/App.css';
import ProtectedRouter from './Components/ProtectedRouter';
import Main from './Components/Main';
import Dashboard from './Components/Dashboard';
import Tasks from './Components/Tasks';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, } from 'react-router-dom';

function MainRouter() {
  return <Outlet />;
}

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainRouter />}>
        <Route index element={<Main />} />
        <Route
          path="Dashboard"
          element={
            <ProtectedRouter allowedRoles={['Admin', 'User', 'FounderUser']}>
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
      </Route>
    )
  );

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
