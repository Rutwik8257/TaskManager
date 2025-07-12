import UI_img from "../../assets/auth-img.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left Side */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      {/* Right Side Image Panel */}
      <div
        className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8"
        style={{ backgroundImage: "url('/bg-img.jpg')" }}
      >
        <img src={UI_img} className="w-64 lg:w-[90%]" alt="Auth" />
      </div>
    </div>
  );
};

export default AuthLayout;
