import { Link } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

export default function CompanyCard({ company }) {
  const initials = company?.name?.trim()?.[0]?.toUpperCase() || "?";
  const locationText = [company?.location, company?.city]
    .filter(Boolean)
    .join(", ");
  const ratingValue = Number(company?.averageRating) || 0;
  const reviewCount = Number(company?.reviewCount) || 0;

  const renderStars = (value) => {
    const stars = [];
    const rounded = Math.round(value);
    for (let i = 1; i <= 5; i += 1) {
      stars.push(
        <span
          key={i}
          className={i <= rounded ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return <span className="flex items-center gap-1">{stars}</span>;
  };
  const foundedDate = company?.foundedOn
    ? (() => {
        const date = new Date(company.foundedOn);
        if (Number.isNaN(date.getTime())) {
          return "";
        }
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      })()
    : "";

  const logoSrc =
    company?.logo && company.logo.startsWith("/uploads")
      ? `${API_BASE}${company.logo}`
      : company?.logo;

  return (
    <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center mt-6 relative">
      <div className="flex gap-5">
        {logoSrc ? (
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={logoSrc}
            alt={company?.name || "Company logo"}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-900 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg">
            {company?.name || "Untitled Company"}
          </h3>
          {locationText && (
            <p className="text-sm text-gray-500">{locationText}</p>
          )}

          <div className="flex items-center gap-2 mt-1">
            {renderStars(ratingValue)}
            <span className="text-sm text-gray-500">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">
              {reviewCount} Reviews
            </span>
          </div>
        </div>
      </div>

      {foundedDate && (
        <p className="text-xs text-gray-400 absolute top-3 right-4">
          Founded on {foundedDate}
        </p>
      )}

      <div className="text-right">
        <Link
          className="mt-2 inline-block bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
          to={`/companies/${company?._id}`}
        >
          Detail Review
        </Link>
      </div>
    </div>
  );
}
