import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex flex-1 overflow-hidden">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5 overflow-y-auto h-[calc(100vh-64px)] pb-6 pr-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};


export default DashboardLayout;
