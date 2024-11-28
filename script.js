document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const rating = document.getElementById("rating");
    const reviewText = document.getElementById("review");
    const submitBtn = document.getElementById("submit");
    const usernameInput = document.getElementById("username");
    const titleInput = document.getElementById("title");  // New title input
    const reviewsContainer = document.getElementById("reviews");
    let currentRating = 0;

    // Initial empty ratings object
    let ratings = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    let totalRatings = 0;

    const updateRatingBars = () => {
        Object.keys(ratings).forEach(stars => {
            const count = ratings[stars];
            const percentage = totalRatings ? (count / totalRatings) * 100 : 0;
            const ratingBar = document.querySelector(`#rating-bar-${stars} .rating-bar-fill`);
            if (ratingBar) {
                ratingBar.style.width = `${percentage}%`;
                ratingBar.nextElementSibling.textContent = `${stars} Stars - ${count} ratings`;
            }
        });
    };

    const createReviewElement = (username, title, review, rating) => {  // Added title parameter
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");

        // Create star elements for rating using HTML entities
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHtml += '<span class="star">&#9733;</span>';  // Filled star
            } else {
                starsHtml += '<span class="star">&#9734;</span>';  // Empty star
            }
        }

        reviewElement.innerHTML = `
            <div class="review-content">
                <div class="review-header">
                    <h2>${title}</h2>  <!-- Display title as large heading -->
                    <div class="rating-stars">${starsHtml}</div>
                </div>
                <p><strong>${username}</strong></p>
                <p>${review}</p>
                <button class="like-btn">
                    <span class="like-icon">&#9829;</span>
                    <span class="likes">0</span>
                </button>
            </div>
            <div class="comments"></div>
            <textarea class="comment-input" placeholder="Add a comment..."></textarea>
            <button class="comment-submit">Comment</button>
        `;
        return reviewElement;
    };

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            const value = parseInt(star.getAttribute("data-value"));
            rating.innerText = value;
            currentRating = value;

            stars.forEach((s) => s.classList.remove("selected"));
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.add("selected");
                }
            });
        });
    });

    submitBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const title = titleInput.value.trim();  // Get the title input value
        const review = reviewText.value.trim();
        const userRating = currentRating;

        if (!userRating || !review || !username || !title) {
            alert("Please provide a username, title, select a rating, and provide a review before submitting.");
            return;
        }

        if (userRating > 0) {
            // Update ratings object
            ratings[userRating] = (ratings[userRating] || 0) + 1;
            totalRatings++;

            // Update rating bars
            updateRatingBars();

            const reviewElement = createReviewElement(username, title, review, userRating);  // Pass title to function
            reviewsContainer.appendChild(reviewElement);

            const likeBtn = reviewElement.querySelector(".like-btn");
            const likeIcon = reviewElement.querySelector(".like-icon");
            const likes = reviewElement.querySelector(".likes");
            likeBtn.addEventListener("click", () => {
                likeBtn.classList.toggle("liked");
                if (likeBtn.classList.contains("liked")) {
                    likes.textContent = `${parseInt(likes.textContent) + 1}`;
                    likeIcon.style.color = "#ff0000";
                } else {
                    likes.textContent = `${parseInt(likes.textContent) - 1}`;
                    likeIcon.style.color = "#28a745";
                }
            });

            const commentInput = reviewElement.querySelector(".comment-input");
            const commentSubmit = reviewElement.querySelector(".comment-submit");
            const commentsContainer = reviewElement.querySelector(".comments");

            commentSubmit.addEventListener("click", () => {
                const commentText = commentInput.value.trim();
                if (commentText) {
                    const commentElement = document.createElement("div");
                    commentElement.classList.add("comment");
                    const currentDate = new Date().toLocaleDateString();
                    commentElement.innerHTML = `<p><strong>Reply from ${currentDate}:</strong> ${commentText}</p>`;
                    commentsContainer.appendChild(commentElement);
                    commentInput.value = "";
                }
            });

            usernameInput.value = "";
            titleInput.value = "";  // Clear the title input field
            reviewText.value = "";
            rating.innerText = "0";
            currentRating = 0;
            stars.forEach((s) => s.classList.remove("selected"));
        }
    });

    // Initial update of rating bars
    updateRatingBars();
});
