document.addEventListener('DOMContentLoaded', function() {

    const searchInput = document.getElementById('searchInput');
    const productGrid = document.querySelector('#product-list .product-grid');
    
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelAddBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('errorMsg');

    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const productItems = productGrid.querySelectorAll('.product-item'); 

        productItems.forEach(function(item) {
            const productName = item.querySelector('.product-name').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                item.style.display = 'flex'; 
            } else {
                item.style.display = 'none';
            }
        });
    });

    addProductBtn.addEventListener('click', function() {
        addProductForm.classList.toggle('hidden');
        errorMsg.textContent = '';
    });

    cancelAddBtn.addEventListener('click', function() {
        addProductForm.classList.add('hidden');
        addProductForm.reset();
        errorMsg.textContent = '';
    });

    addProductForm.addEventListener('submit', function(event) {
        
        event.preventDefault(); 

        const name = document.getElementById('newName').value.trim();
        const price = document.getElementById('newPrice').value.trim();
        const desc = document.getElementById('newDesc').value.trim();
        const imageUrl = document.getElementById('newImage').value.trim();

        const priceValue = parseFloat(price); 
        if (name === '' || isNaN(priceValue) || priceValue <= 0) {
            errorMsg.textContent = 'Vui lòng nhập tên và giá hợp lệ (giá phải lớn hơn 0).';
            return;
        }

        errorMsg.textContent = '';

        const newProduct = document.createElement('article');
        newProduct.className = 'product-item'; 

        const placeholderImg = `https://via.placeholder.com/400x300.png?text=${name.replace(' ', '+')}`;
        const finalImageUrl = (imageUrl !== '') ? imageUrl : placeholderImg;

        newProduct.innerHTML = `
            <img src="${finalImageUrl}" alt="${name}">
            <div class="product-info">
                <h3 class="product-name">${name}</h3>
                <p>${desc}</p>
                <p class="price">Giá: ${priceValue.toLocaleString('vi-VN')} VNĐ</p>
            </div>
        `;

        productGrid.appendChild(newProduct);

        addProductForm.reset(); 
        addProductForm.classList.add('hidden');
    });

});