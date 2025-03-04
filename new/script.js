document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginPage = document.querySelector('.login-page');
    const postPage = document.querySelector('.post-page');
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

    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginPage.style.display = 'none';
        postPage.style.display = 'block';
        loadProducts();
    } else {
        loginPage.style.display = 'block';
        postPage.style.display = 'none';
    }

    loginBtn.addEventListener('click', function() {
        if (usernameInput.value && passwordInput.value) {
            localStorage.setItem('isLoggedIn', 'true');
            loginPage.style.display = 'none';
            postPage.style.display = 'block';
            loadProducts();
        } else {
            alert('Please enter username and password.');
        }
    });

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

    // Theme toggle functionality
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
            allProducts = data.products;
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
            <p><strong>Dislikes:</strong> <span class="dislike-count">${getDislikeCount(product.id)}</span></p>
            <button class="likeBtn ${isLiked(product.id) ? 'liked' : ''}" data-product-id="${product.id}">Like</button>
            <button class="dislikeBtn ${isDisliked(product.id) ? 'disliked' : ''}" data-product-id="${product.id}">Dislike</button>
            <div class="comment-section">
                <h4>Comments:</h4>
                <div class="comments"></div>
                <textarea class="comment-input" placeholder="Add a comment"></textarea>
                <button class="comment-btn">Post Comment</button>
            </div>
        `;

        postDiv.addEventListener('click', function() {
            window.location.href = `post.html?id=${product.id}`;
        });

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

            let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
            let dislikedProducts = JSON.parse(localStorage.getItem('dislikedProducts')) || [];

            if (!this.classList.contains('liked')) {
                this.classList.add('liked');
                this.classList.remove('disliked');
                dislikeBtn.classList.remove('disliked');

                likedProducts.push(product);
                dislikedProducts = dislikedProducts.filter(p => p.id !== productId);
            } else {
                this.classList.remove('liked');
                likedProducts = likedProducts.filter(p => p.id !== productId);
            }

            localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
            localStorage.setItem('dislikedProducts', JSON.stringify(dislikedProducts));
            updateLikeDislikeCounts(productId, likeCountSpan, dislikeCountSpan);
            dislikeCountSpan.textContent = getDislikeCount(productId);
        });

        dislikeBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            const productId = parseInt(this.dataset.productId);
            const product = allProducts.find(p => p.id === productId);

            let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
            let dislikedProducts = JSON.parse(localStorage.getItem('dislikedProducts')) || [];

            if (!this.classList.contains('disliked')) {
                this.classList.add('disliked');
                this.classList.remove('liked');
                likeBtn.classList.remove('liked');

                dislikedProducts.push(product);
                likedProducts = likedProducts.filter(p => p.id !== productId);
            } else {
                this.classList.remove('disliked');
                dislikedProducts = dislikedProducts.filter(p => p.id !== productId);
            }

            localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
            localStorage.setItem('dislikedProducts', JSON.stringify(dislikedProducts));
            updateLikeDislikeCounts(productId, likeCountSpan, dislikeCountSpan);
            dislikeCountSpan.textContent = getDislikeCount(productId);
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
            case 'popularity':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'date':
                sortedProducts.sort((a, b) => b.id - a.id);
                break;
            case 'tags':
                sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                break;
        }
       currentPage = 1; 
        displayProducts(getProductsForPage(currentPage));
    }

     function isLiked(productId) {
        let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
        return likedProducts.some(product => product.id === productId);
    }

    function isDisliked(productId) {
        let dislikedProducts = JSON.parse(localStorage.getItem('dislikedProducts')) || [];
        return dislikedProducts.some(product => product.id === productId);
    }

   function getDislikeCount(productId) {
        let dislikedProducts = JSON.parse(localStorage.getItem('dislikedProducts')) || [];
        return dislikedProducts.filter(product => product.id === productId).length;
    }

    function getProductsForPage(page) {
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return allProducts.slice(startIndex, endIndex);
    }
});
