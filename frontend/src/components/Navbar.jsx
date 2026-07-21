import { Search, Bell, Menu } from "lucide-react";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header
      className={`fixed top-0 right-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs transition-all duration-300 ease-in-out left-0
      ${isSidebarOpen ? "lg:left-72" : "lg:left-20"}`}
    >
      {/* Left Area: Hamburger Menu & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger - Only visible on small screens since desktop has sidebar button */}
        <button
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500">Admin</p>
        </div>
      </div>

      {/* Center Area: Search Bar */}
      <div className="hidden max-w-md flex-1 px-4 sm:block">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-10 text-sm outline-hidden transition-all focus:border-[#1E3A8A] focus:bg-white"
          />
        </div>
      </div>

      {/* Right Area: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden text-sm font-medium text-slate-600 md:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>

        {/* Notification Button */}
        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
            <span className="font-semibold text-sm">AD</span>
          </div>
          <div className="hidden text-left xl:block">
            <h4 className="text-sm font-semibold text-slate-900">Admin</h4>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;