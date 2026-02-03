import { useEffect, useState } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import CompanyCard from "../components/CompanyCard";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    city: "",
    foundedOn: "",
    // description: "",
  });

  useEffect(() => {
    let isMounted = true;


    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/companies`);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const payload = await response.json();
        if (isMounted) {
          setCompanies(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load companies");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCompanies();
    return () => {
      isMounted = false;
    };
  }, []);

  const cityOptions = Array.from(
    new Set(
      companies
        .map((company) => company?.city)
        .filter((city) => typeof city === "string" && city.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const filteredCompanies = companies.filter((company) => {
    const nameValue = company?.name || "";
    const nameMatch = nameValue
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const cityMatch =
      cityFilter === "All" ||
      (company?.city || "").toLowerCase() === cityFilter.toLowerCase();

    return nameMatch && cityMatch;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "rating") {
      const ratingA = Number(a?.averageRating) || 0;
      const ratingB = Number(b?.averageRating) || 0;
      return ratingB - ratingA;
    }
    if (sortBy === "location") {
      const locA = (a?.location || a?.city || "").toLowerCase();
      const locB = (b?.location || b?.city || "").toLowerCase();
      return locA.localeCompare(locB);
    }
    if (sortBy === "foundedOn") {
      const dateA = a?.foundedOn ? new Date(a.foundedOn).getTime() : 0;
      const dateB = b?.foundedOn ? new Date(b.foundedOn).getTime() : 0;
      return dateB - dateA;
    }
    const nameA = (a?.name || "").toLowerCase();
    const nameB = (b?.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    try {
      setSubmitting(true);
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formPayload.append(key, value);
        }
      });
      if (logoFile) {
        formPayload.append("logo", logoFile);
      }

      const response = await fetch(`${API_BASE}/api/companies`, {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const result = await response.json();
      if (result?.data) {
        setCompanies((prev) => [result.data, ...prev]);
        setFormSuccess("Company created successfully.");
        setIsModalOpen(false);
        setLogoFile(null);
        setFormData({
          name: "",
          location: "",
          city: "",
          foundedOn: "",
        //   description: "",
        });
      }
    } catch (err) {
      setFormError(err.message || "Failed to create company.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6">
        <FilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          cityFilter={cityFilter}
          onCityFilterChange={setCityFilter}
          cityOptions={cityOptions}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddCompany={() => {
            setFormError("");
            setFormSuccess("");
            setIsModalOpen(true);
          }}
        />
        {/* <h2 className="mt-6 text-lg font-semibold">Companies</h2> */}
        {formSuccess && (
          <p className="mt-3 text-sm text-green-600">{formSuccess}</p>
        )}
        {loading && <p className="mt-6 text-gray-500">Loading...</p>}
        {error && (
          <p className="mt-6 text-red-600">Error loading companies: {error}</p>
        )}
        {!loading && !error && sortedCompanies.length === 0 && (
          <p className="mt-6 text-gray-500">No companies found.</p>
        )}
        {sortedCompanies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 opacity-90" />
            <div className="absolute -left-4 top-6 h-12 w-12 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 opacity-90" />
            <div className="relative px-6 pb-6 pt-7">
              <button
                className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700"
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-center text-lg font-semibold text-gray-900">
                Add Company
              </h2>
              <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm text-gray-600">
                  Company name
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="name"
                    placeholder="Enter..."
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-gray-600">
                  Location
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="location"
                    placeholder="Select Location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </label>
                <label className="grid gap-2 text-sm text-gray-600">
                  Founded on
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="foundedOn"
                    type="date"
                    value={formData.foundedOn}
                    onChange={handleChange}
                  />
                </label>
                <label className="grid gap-2 text-sm text-gray-600">
                  City
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </label>
                <label className="grid gap-2 text-sm text-gray-600">
                  Logo Image
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-gray-700"
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setLogoFile(event.target.files?.[0] || null)
                    }
                  />
                </label>
                {/* <label className="grid gap-2 text-sm text-gray-600">
                  Description
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="description"
                    placeholder="Short description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </label> */}
                {formError && (
                  <p className="text-sm text-red-600">{formError}</p>
                )}
                <button
                  className="mx-auto mt-1 w-32 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
