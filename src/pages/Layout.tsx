import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="Header">
      <Header />
      <Outlet /> {/* Child routes will render here */}
    </div>
  );
}

export default Layout;
