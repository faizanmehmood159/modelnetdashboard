import React, { useState } from "react";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Rating: ${rating}, Review: ${reviewText}`);
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded-md bg-white p-8 shadow-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
      <h2 className="mb-4 text-2xl font-semibold">Leave a Review</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-600"
          >
            Rating
          </label>
          <div className="flex items-center">
            {[...Array(10)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRatingChange(index + 1)}
                className={`focus:shadow-outline mx-1 flex h-8 w-8 items-center justify-center rounded-full text-sm focus:outline-none sm:h-8 sm:w-8 ${
                  index + 1 <= rating ? "bg-yellow-500" : "bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="reviewText"
            className="block text-sm font-medium text-gray-600"
          >
            Review
          </label>
          <textarea
            id="reviewText"
            name="reviewText"
            rows="4"
            value={reviewText}
            onChange={handleReviewTextChange}
            className="mt-1 w-full rounded-md border p-2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="focus:shadow-outline-blue rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
