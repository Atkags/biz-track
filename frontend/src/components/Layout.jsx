import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout.css";

function Layout({ children}) {

  return (
    <div className="layout">
      <div className="sidebar">
          <Sidebar />
      </div>
      <div className="content">
        <Topbar />
        <main className="main-content">
          {children}
        </main>
      </div>

    </div>
  )
}

export default Layout;