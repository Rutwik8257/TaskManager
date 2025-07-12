import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './Routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';
import CreateTask from './pages/Admin/CreateTask';
import Dashboard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import ManageUsers from './pages/Admin/ManageUsers';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MyTasks from './pages/User/MyTasks';
import UserDashboard from './pages/User/UserDashboard';
import ViewTaskDetails from './pages/User/ViewTaskDetails';


const App = () => {
  return (
    <UserProvider>
    <div>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />  
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
{/* Admin Routes */}
<Route element={<PrivateRoute allowedRoles={['admin']} />}>
  <Route path="/admin/dashboard" element={<Dashboard />} />
  <Route path="/admin/tasks" element={<ManageTasks />} />
  <Route path="/admin/Create-task" element={<CreateTask />} />
  <Route path="/admin/users" element={<ManageUsers />} />
</Route>

{/* User Routes */}
<Route element={<PrivateRoute allowedRoles={['user']} />}>
  <Route path="/user/dashboard" element={<UserDashboard />} />
  <Route path="/user/my-tasks" element={<MyTasks />} />
  <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
</Route>

          <Route path="/" element={<Root />} />
          </Routes>
          </Router>
    </div>

    <Toaster
    toastOptions={{
      className: "",
      style: {
        fontSize: "13px",
    },
  }}
  />

    </UserProvider>
  );
};

export default App
const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Outlet />;
  if (!user) return <Navigate to="/login" />;
  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
};

