export default function FilterBar({
  onAddCompany,
  searchTerm,
  onSearchTermChange,
  cityFilter,
  onCityFilterChange,
  cityOptions,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between mt-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Select City</span>
          <select
            className="border rounded-lg px-4 py-2 text-sm"
            value={cityFilter}
            onChange={(event) => onCityFilterChange(event.target.value)}
          >
            <option value="All">All Cities</option>
            {cityOptions?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <input
          className="border rounded-lg px-4 py-2 text-sm self-end"
          type="text"
          placeholder="Find company"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />

        <button
          className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md self-end"
          type="button"
          onClick={onAddCompany}
        >
          + Add Company
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort:</span>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="name">Name</option>
          <option value="rating">Average Rating</option>
          <option value="location">Location</option>
          <option value="foundedOn">Founded On</option>
        </select>
      </div>
    </div>
  );
}
 
