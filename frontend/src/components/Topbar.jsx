import '../styles/topbar.css';

function Topbar() {


    const role = localStorage.getItem("role");

    return (
        <header className="topbar">
            <h3>{role}</h3>
        </header>
    );
}

export default Topbar;