document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-product');
    const brandFilter = document.getElementById('brand-filter');
    const sortSelect = document.getElementById('sort-products');

    // Các phần tử cho bộ lọc giá mới
    const minPriceSlider = document.getElementById('min-price-slider');
    const maxPriceSlider = document.getElementById('max-price-slider');
    const minPriceDisplay = document.getElementById('min-price-display');
    const maxPriceDisplay = document.getElementById('max-price-display');
    const sliderTrack = document.querySelector('.range-slider .slider-track');

    // Lấy tất cả sản phẩm ban đầu và chuẩn bị dữ liệu
    const allProducts = Array.from(productGrid.children).map(productElement => {
        return {
            element: productElement,
            name: productElement.dataset.name.toLowerCase(),
            brand: productElement.dataset.brand,
            price: parseInt(productElement.dataset.price)
        };
    });

    // Hàm định dạng số tiền VND
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    // Cập nhật hiển thị giá và vị trí track của slider
    function updatePriceDisplayAndTrack() {
        let minVal = parseInt(minPriceSlider.value);
        let maxVal = parseInt(maxPriceSlider.value);

        // Đảm bảo min không lớn hơn max
        if (minVal > maxVal) {
            minPriceSlider.value = maxVal;
            minVal = maxVal;
        }

        minPriceDisplay.value = formatCurrency(minVal);
        maxPriceDisplay.value = formatCurrency(maxVal);

        // Cập nhật vị trí và chiều rộng của thanh track
        const minPercent = (minVal - minPriceSlider.min) / (minPriceSlider.max - minPriceSlider.min) * 100;
        const maxPercent = (maxVal - maxPriceSlider.min) / (maxPriceSlider.max - maxPriceSlider.min) * 100;

        sliderTrack.style.left = minPercent + '%';
        sliderTrack.style.width = (maxPercent - minPercent) + '%';
    }


    // Lắng nghe sự kiện thay đổi của các bộ lọc và sắp xếp
    searchInput.addEventListener('input', filterAndSortProducts);
    brandFilter.addEventListener('change', filterAndSortProducts);
    sortSelect.addEventListener('change', filterAndSortProducts);

    // Lắng nghe sự kiện kéo của slider giá
    minPriceSlider.addEventListener('input', function() {
        updatePriceDisplayAndTrack();
        filterAndSortProducts();
    });
    maxPriceSlider.addEventListener('input', function() {
        updatePriceDisplayAndTrack();
        filterAndSortProducts();
    });

    function filterAndSortProducts() {
        let currentProducts = [...allProducts]; // Tạo bản sao để lọc

        // 1. Lọc theo tên sản phẩm (kết quả chính xác)
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            currentProducts = currentProducts.filter(product => {
                // Sử dụng includes() để tìm kiếm một phần của tên sản phẩm
                return product.name.includes(searchTerm);
            });
        }

        // 2. Lọc theo hãng sản phẩm
        const selectedBrand = brandFilter.value;
        if (selectedBrand) {
            currentProducts = currentProducts.filter(product => {
                return product.brand === selectedBrand;
            });
        }

        // 3. Lọc theo khoảng giá
        const minPrice = parseInt(minPriceSlider.value);
        let maxPrice = parseInt(maxPriceSlider.value);

        // Đảm bảo maxPrice không nhỏ hơn minPrice khi lọc
        if (minPrice > maxPrice) {
            maxPrice = minPrice;
        }

        currentProducts = currentProducts.filter(product => {
            return product.price >= minPrice && product.price <= maxPrice;
        });

        // 4. Sắp xếp sản phẩm
        const sortBy = sortSelect.value;
        currentProducts.sort((a, b) => {
            if (sortBy === 'name-asc') {
                return a.name.localeCompare(b.name, 'vi'); // Sắp xếp theo tên A-Z
            } else if (sortBy === 'name-desc') {
                return b.name.localeCompare(a.name, 'vi'); // Sắp xếp theo tên Z-A
            } else if (sortBy === 'price-asc') {
                return a.price - b.price; // Sắp xếp theo giá thấp đến cao
            } else if (sortBy === 'price-desc') {
                return b.price - a.price; // Sắp xếp theo giá cao đến thấp
            }
            return 0; // Mặc định hoặc không thay đổi thứ tự
        });

        // Cập nhật hiển thị sản phẩm trên DOM
        productGrid.innerHTML = ''; // Xóa tất cả sản phẩm hiện tại
        if (currentProducts.length === 0) {
            productGrid.innerHTML = '<p class="no-results">Không tìm thấy sản phẩm nào phù hợp.</p>';
        } else {
            currentProducts.forEach(product => {
                productGrid.appendChild(product.element); // Thêm lại các sản phẩm đã lọc và sắp xếp
            });
        }
    }

    // Khởi tạo ban đầu khi tải trang
    updatePriceDisplayAndTrack(); // Đảm bảo hiển thị giá và track đúng
    filterAndSortProducts(); // Áp dụng bộ lọc và sắp xếp ban đầu
});
