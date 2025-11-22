const API_URL = 'https://jsonplaceholder.typicode.com/users';
let users = [];
let filteredUsers = [];
let currentPage = 1;
const itemsPerPage = 5;

// Lấy dữ liệu
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Lỗi kết nối mạng');
        
        users = await response.json();
        filteredUsers = [...users];
        renderTable();
    } catch (error) {
        showError('Không thể tải dữ liệu: ' + error.message);
    }
}

// Hiển thị dữ liệu & phân trang
function renderTable() {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    paginatedUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button class="btn-edit" onclick="editUser(${user.id})">Sửa</button>
                <button class="btn-delete" onclick="deleteUser(${user.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updatePaginationControl();
}

function updatePaginationControl() {
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    pageInfo.innerText = `Trang ${currentPage} / ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(step) {
    currentPage += step;
    renderTable();
}

// Tìm kiếm
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
    currentPage = 1;
    renderTable();
}

// Thêm & Sửa (Create / Update)
async function saveUser() {
    const id = document.getElementById('user-id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!name || !email || !phone) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const userData = { name, email, phone };

    try {
        if (id) {
            // Update (PUT)
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(userData),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
            
            const index = users.findIndex(u => u.id == id);
            if (index !== -1) {
                users[index] = { ...users[index], ...userData };
            }
        } else {
            // Create (POST)
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });
            const newUser = await response.json();
            
            newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.unshift(newUser);
        }

        document.getElementById('search-input').value = '';
        filteredUsers = [...users];
        closeModal();
        renderTable();

    } catch (error) {
        showError('Lỗi khi lưu dữ liệu: ' + error.message);
    }
}

// Chuẩn bị dữ liệu để sửa
function editUser(id) {
    const user = users.find(u => u.id == id);
    if (user) {
        document.getElementById('user-id').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        document.getElementById('modal-title').innerText = "Cập Nhật Người Dùng";
        openModal();
    }
}

// Xóa
async function deleteUser(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        users = users.filter(user => user.id !== id);
        filteredUsers = filteredUsers.filter(user => user.id !== id);
        
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

        renderTable();
    } catch (error) {
        showError('Lỗi khi xóa: ' + error.message);
    }
}

// Các hàm hỗ trợ (Modal, Error)
function openModal() {
    document.getElementById('user-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('user-modal').style.display = 'none';
    document.getElementById('user-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('modal-title').innerText = "Thêm Người Dùng";
}

function showError(msg) {
    const errDiv = document.getElementById('error-msg');
    errDiv.innerText = msg;
    errDiv.style.display = 'block';
    setTimeout(() => errDiv.style.display = 'none', 3000);
}

fetchUsers();