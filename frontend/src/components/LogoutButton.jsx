// Drop this component anywhere in your existing navbar/header
// Just pass onLogout as a prop from App.jsx

export default function LogoutButton({ onLogout, userEmail }) {
  return (
    <div className="flex items-center gap-3">
      {userEmail && (
        <span className="text-sm text-base-content/60 hidden sm:block">
          {userEmail}
        </span>
      )}
      <button
        onClick={onLogout}
        className="btn btn-ghost btn-sm"
      >
        Logout
      </button>
    </div>
  );
}