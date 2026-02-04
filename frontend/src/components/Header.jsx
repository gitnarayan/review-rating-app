export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white">
            <span className="text-sm">★</span>
          </div>
          <h1 className="text-lg  tracking-tight text-gray-900">
            Review<span className="text-indigo-600">&</span>
            <span className="font-bold text-gray-900">RATE</span>
          </h1>
        </div>

        <div className="relative ml-auto w-full max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-200 px-3 py-2 pr-10 text-sm text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.5" y2="16.5" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-700">
          <button className="hover:text-gray-900">SignUp</button>
          <button className="hover:text-gray-900">Login</button>
        </div>
      </div>
    </header>
  );
}
