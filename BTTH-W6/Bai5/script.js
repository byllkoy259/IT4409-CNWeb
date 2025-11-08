document.addEventListener('DOMContentLoaded', function() {

    const STORAGE_KEY = 'tieubao_products';
    const productGrid = document.querySelector('#product-list .product-grid');
    const searchInput = document.getElementById('searchInput');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelAddBtn = document.getElementById('cancelBtn');
    const errorMsg = document.getElementById('errorMsg');
    
    let allProducts = [];

    const initialProducts = [
        {
            name: "Cà phê Đen đá",
            desc: "Hương vị đậm đà, nguyên chất từ hạt cà phê Robusta.",
            price: 25000,
            image: "https://thuytinhocean.com/wp-content/uploads/2024/08/hinh-anh-ly-cafe-den-da-16.jpg",
            alt: "Cà phê Đen đá"
        },
        {
            name: "Cà phê Sữa đá",
            desc: "Sự kết hợp hoàn hảo giữa vị đắng cà phê và vị ngọt của sữa đặc.",
            price: 30000,
            image: "https://f5cafe.com/wp-content/uploads/2020/06/ca_phe_sua_da.jpg",
            alt: "Cà phê Sữa đá"
        },
        {
            name: "Bạc xỉu",
            desc: "Nhiều sữa ít cà phê, phù hợp cho người mới bắt đầu.",
            price: 35000,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg1rq8JGE54uMTjLsJnN2dthAsDK7YtV7tKg&s",
            alt: "Bạc xỉu"
        }
    ];
    /**
     * @param {Array} products Mảng sản phẩm cần hiển thị
     */
    function renderProductList(products) {
        productGrid.innerHTML = ''; 
        
        products.forEach(product => {
            const newProduct = document.createElement('article');
            newProduct.className = 'product-item'; 

            const priceString = product.price.toLocaleString('vi-VN') + ' VNĐ';

            newProduct.innerHTML = `
                <img src="${product.image}" alt="${product.alt || product.name}">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p>${product.desc}</p>
                    <p class="price">Giá: ${priceString}</p>
                </div>
            `;
            productGrid.appendChild(newProduct);
        });
    }
    function saveProducts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
    }

    function loadProducts() {
        const storedProducts = localStorage.getItem(STORAGE_KEY);
        
        if (storedProducts) {
            allProducts = JSON.parse(storedProducts);
        } else {
            allProducts = initialProducts;
            saveProducts();
        }
        
        renderProductList(allProducts);
    }

    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        
        renderProductList(filteredProducts);
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

        const newProductData = {
            name: name,
            desc: desc,
            price: priceValue,
            image: (imageUrl !== '') ? imageUrl : `https://via.placeholder.com/400x300.png?text=${name.replace(' ', '+')}`,
            alt: name
        };

        allProducts.push(newProductData);
        
        saveProducts();
        
        renderProductList(allProducts);

        addProductForm.reset(); 
        addProductForm.classList.add('hidden');
    });

    loadProducts();

});