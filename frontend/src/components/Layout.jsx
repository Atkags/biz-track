import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout.css";
import "../styles/page-styles.css";

function Layout({ children}) {

  return (
    <div className="layout">
      <div className="sidebar-wrapper">
        <div className="sidebar-header">
          <Sidebar />
        </div>
      </div>
      <div className="content">
        <Topbar />
        <main className="main-content">
          <div className="page-shell">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}

export default Layout;