import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px}] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify mb-7 pt-5">
        <div className="relative"></div>
        <img
  src={user?.profileImageUrl || 'https://placehold.co/100x100'}
  alt="Profile"
  className="w-20 h-20 mx-auto rounded-full object-cover border"
/>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">Admin</div>
        )}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">{user?.name || "Unknown User"}</h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {/* Menu Items */}
      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] rounded-lg 
            ${
              activeMenu === item.label
                ? "text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border-r-4 border-blue-500 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            } 
            py-3 px-4 mb-2 transition-all`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
