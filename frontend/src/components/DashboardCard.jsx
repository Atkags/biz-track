import "../styles/dashboard.css";

function DashboardCard({ title, value, subtitle, icon }) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <span>{title}</span>
        {icon}
      </div>

      <h2>{value}</h2>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default DashboardCard;