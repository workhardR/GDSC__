document.addEventListener('DOMContentLoaded', function() {
    const likedProductsDiv = document.getElementById('liked-products');
    const dislikedProductsDiv = document.getElementById('disliked-products');

    // Retrieve liked and disliked products from localStorage
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
    const dislikedProducts = JSON.parse(localStorage.getItem('dislikedProducts')) || [];

    // Display liked products
    if (likedProducts.length > 0) {
        likedProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.textContent = product.title;
            likedProductsDiv.appendChild(productElement);
        });
    } else {
        likedProductsDiv.textContent = 'No liked products yet.';
    }

    // Display disliked products
    if (dislikedProducts.length > 0) {
        dislikedProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.textContent = product.title;
            dislikedProductsDiv.appendChild(productElement);
        });
    } else {
        dislikedProductsDiv.textContent = 'No disliked products yet.';
    }
});

