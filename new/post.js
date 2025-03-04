document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts');
    const sortBySelect = document.getElementById('sort-by');
    const profileBtn = document.getElementById('profile-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const themeToggle = document.getElementById('theme-toggle');

    let allProducts = [];
    let currentPage = 1;
    const productsPerPage = 10;

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    loadProducts();

    sortBySelect.addEventListener('change', function() {
        sortProducts(this.value);
    });

    profileBtn.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });

    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(getProductsForPage(currentPage));
        }
    });

    nextBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(allProducts.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(getProductsForPage(currentPage));
        }
    });

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });


    async function loadProducts() {
        try {
            const response = await fetch('https://dummyjson.com/products');
            const data = await response.json();
            allProducts = data.products.map(product => ({
                ...product,
                rating: Math.floor(Math.random() * 100) + 1,
                dislikes: Math.floor(Math.random() * 50)
            }));
            displayProducts(getProductsForPage(currentPage));
        } catch (error) {
            console.error('Error fetching products:', error);
            postsContainer.innerHTML = '<p>Failed to load products.</p>';
        }
    }

    function displayProducts(products) {
        postsContainer.innerHTML = '';

        products.forEach(product => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Tags:</strong> ${product.tags ? product.tags.join(', ') : 'N/A'}</p>
                <p><strong>Likes:</strong> <span class="like-count">${product.rating}</span></p>
                <p><strong>Dislikes:</strong> <span class="dislike-count">${product.dislikes}</span></p>
                <button class="likeBtn" data-product-id="${product.id}" style="color: white; font-weight: bold;">Like</button>
                <button class="dislikeBtn" data-product-id="${product.id}" style="color: white; font-weight: bold;">Dislike</button>
                <div class="comment-section">
                    <h4>Comments:</h4>
                    <div class="comments"></div>
                    <textarea class="comment-input" placeholder="Add a comment"></textarea>
                    <button class="comment-btn">Post Comment</button>
                </div>
            `;

            postsContainer.appendChild(postDiv);

            const likeBtn = postDiv.querySelector('.likeBtn');
            const dislikeBtn = postDiv.querySelector('.dislikeBtn');
            const likeCountSpan = postDiv.querySelector('.like-count');
            const dislikeCountSpan = postDiv.querySelector('.dislike-count');
            const commentInput = postDiv.querySelector('.comment-input');
            const commentBtn = postDiv.querySelector('.comment-btn');
            const commentsDiv = postDiv.querySelector('.comments');

            likeBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = parseInt(this.dataset.productId);
                const product = allProducts.find(p => p.id === productId);

                if (likeBtn.style.color === 'green') {
                    likeBtn.style.color = 'white';
                    product.rating--;
                } else {
                    likeBtn.style.color = 'green';
                    dislikeBtn.style.color = 'white';
                    product.rating++;
                    if (product.dislikes > 0) {
                        product.dislikes--;
                    }
                }

                likeCountSpan.textContent = product.rating;
                dislikeCountSpan.textContent = product.dislikes;
                sortProducts(sortBySelect.value);
            });

            dislikeBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                const productId = parseInt(this.dataset.productId);
                const product = allProducts.find(p => p.id === productId);

                if (dislikeBtn.style.color === 'red') {
                    dislikeBtn.style.color = 'white';
                    product.dislikes--;
                } else {
                    dislikeBtn.style.color = 'red';
                    likeBtn.style.color = 'white';
                    product.dislikes++;
                    if (product.rating > 0) {
                        product.rating--;
                    }
                }

                likeCountSpan.textContent = product.rating;
                dislikeCountSpan.textContent = product.dislikes;
                sortProducts(sortBySelect.value);
            });

            commentBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                const commentText = commentInput.value.trim();
                if (commentText !== '') {
                    const commentElement = document.createElement('p');
                    commentElement.textContent = commentText;
                    commentsDiv.appendChild(commentElement);
                    commentInput.value = '';
                }
            });
        });
    }

    function sortProducts(sortBy) {
        let sortedProducts = [...allProducts];

        switch (sortBy) {
            case 'likes':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'tags':
                sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                break;
        }
        allProducts = sortedProducts;
        currentPage = 1;
        displayProducts(getProductsForPage(currentPage));
    }

    function getProductsForPage(page) {
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return allProducts.slice(startIndex, endIndex);
    }
});
