import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000";

const renderStars = (value) => {
  const stars = [];
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  for (let i = 1; i <= 5; i += 1) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }
  return <span className="flex items-center gap-1">{stars}</span>;
};

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    reviewText: "",
    rating: 5,
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [companyRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE}/api/companies/${id}`),
          fetch(`${API_BASE}/api/reviews/${id}`),
        ]);

        if (!companyRes.ok) {
          throw new Error(`Company request failed: ${companyRes.status}`);
        }
        if (!reviewsRes.ok) {
          throw new Error(`Reviews request failed: ${reviewsRes.status}`);
        }

        const companyPayload = await companyRes.json();
        const reviewsPayload = await reviewsRes.json();

        if (isMounted) {
          setCompany(companyPayload?.data || null);
          setReviews(
            Array.isArray(reviewsPayload?.data) ? reviewsPayload.data : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load company details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
      (sum, review) => sum + (Number(review.rating) || 0),
      0
    );
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

const foundedDate = company?.foundedOn
  ? new Date(company.foundedOn).toLocaleDateString("en-GB")
  : "";
  const logoSrc =
    company?.logo && company.logo.startsWith("/uploads")
      ? `${API_BASE}${company.logo}`
      : company?.logo;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          companyId: id,
          rating: Number(formData.rating),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const payload = await response.json();
      if (payload?.data) {
        setReviews((prev) => [payload.data, ...prev]);
        setIsModalOpen(false);
        setFormData({
          fullName: "",
          subject: "",
          reviewText: "",
          rating: 5,
        });
      }
    } catch (err) {
      setFormError(err.message || "Failed to add review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                className="text-sm text-gray-500 hover:text-gray-700"
                to="/"
              >
                ← Back
              </Link>
            </div>
          </div>

          {loading && <p className="mt-6 text-gray-500">Loading...</p>}
          {error && <p className="mt-6 text-red-600">{error}</p>}
          {!loading && !error && company && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {logoSrc ? (
                  <img
                    className="h-20 w-20 rounded-xl object-cover"
                    src={logoSrc}
                    alt={company?.name || "Company logo"}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-900 text-3xl font-bold text-white">
                    {company?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {company?.name || "Company"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {company?.location || ""}{" "}
                    {company?.city ? `, ${company.city}` : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      {averageRating || 0}
                    </span>
                    {renderStars(Math.round(averageRating))}
                    <span>{reviews.length} Reviews</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {foundedDate && (
                  <p className="text-sm text-gray-400">Founded on {foundedDate}</p>
                )}
                <button
                  className="mt-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Review
                </button>
              </div>
            </div>
          )}
        </div>

        {!loading && !error && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span>Result Found: {reviews.length}</span>
            </div>
            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
            <div className="space-y-6">
              {reviews.map((review) => {
                const reviewDate = review?.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("en-GB")
                  : "";
                return (
                  <div key={review._id} className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review?.fullName || "Anonymous"}
                          </p>
                          {reviewDate && (
                            <p className="text-xs text-gray-400">
                              {reviewDate}
                            </p>
                          )}
                        </div>
                        {renderStars(review?.rating)}
                      </div>
                      {review?.subject && (
                        <p className="mt-2 text-sm font-semibold text-gray-700">
                          {review.subject}
                        </p>
                      )}
                      {review?.reviewText && (
                        <p className="mt-2 text-sm text-gray-600">
                          {review.reviewText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 opacity-90" />
            <div className="absolute -left-4 top-6 h-12 w-12 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 opacity-90" />
            <div className="relative px-6 pb-8 pt-7">
              <button
                className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700"
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-center text-lg font-semibold text-gray-900">
                Add Review
              </h2>
              <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm text-gray-600">
                  Full Name
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="fullName"
                    placeholder="Enter"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-gray-600">
                  Subject
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="subject"
                    placeholder="Enter"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm text-gray-600">
                  Enter your Review
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
                    name="reviewText"
                    placeholder="Description"
                    value={formData.reviewText}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </label>
                <div className="grid gap-2 text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Rating</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl leading-none"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, rating: star }))
                          }
                          aria-pressed={formData.rating >= star}
                        >
                          <span
                            className={
                              formData.rating >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Satisfied</span>
                  </div>
                </div>
                {formError && (
                  <p className="text-sm text-red-600">{formError}</p>
                )}
                <button
                  className="mx-auto mt-2 w-28 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md"
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
