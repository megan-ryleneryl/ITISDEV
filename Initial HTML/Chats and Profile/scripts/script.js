document.addEventListener('DOMContentLoaded', () => {
    // Chat-related elements and functionalities
    const chatListContainer = document.getElementById('chatListContainer');
    const chatList = document.getElementById('chatList');
    const noChatsMessage = document.getElementById('noChatsMessage');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');

    const chats = [
        { id: 1, driverName: 'John Doe', bookingDate: '2024-06-01', profilePic: 'images/john-doe.jpeg' },
        { id: 2, driverName: 'Jane Smith', bookingDate: '2024-06-15', profilePic: 'images/jane-smith.jpeg'},
        { id: 3, driverName: 'Laurel Dy', bookingDate: '2024-06-24', profilePic: 'images/laurel-dy.jpeg'}
        // Add more chats as needed
    ];

    const chatMessages = [
        { text: "Hello, I'm the driver.", sender: 'driver' },
        { text: "Hi, I'm the rider.", sender: 'rider' }
        // Add more messages as needed
    ];

    if (chatListContainer) {
        renderChatList();
    }

    if (messages) {
        renderMessages();
        loadDriverInfo();
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message, 'rider');
                messageInput.value = '';
            }
        });
    }

    function renderChatList() {
        const source = document.getElementById('chat-list-template').innerHTML;
        if (!source) {
            console.error('Chat list template not found');
            return;
        }
        const template = Handlebars.compile(source);
        const filteredChats = chats.filter(chat => isWithinTwoWeeks(chat.bookingDate));
        if (filteredChats.length === 0) {
            noChatsMessage.style.display = 'block';
            chatList.style.display = 'none';
        } else {
            noChatsMessage.style.display = 'none';
            chatList.style.display = 'block';
            const context = { chats: filteredChats };
            const html = template(context);
            chatList.innerHTML = html;
        }
    }

    function renderMessages() {
        chatMessages.forEach(msg => {
            sendMessage(msg.text, msg.sender);
        });
    }

    function sendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${sender === 'rider' ? 'Rider: ' : 'Driver: '}${message}`;
        messageElement.classList.add('message', sender);
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
    }

    function isWithinTwoWeeks(date) {
        const bookingDate = new Date(date);
        const today = new Date();
        const timeDifference = today - bookingDate;
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference <= 14;
    }

    function loadDriverInfo() {
        const chatId = getChatIdFromUrl(); // Get chat ID from URL
        const chat = chats.find(c => c.id == chatId); // Use '==' to allow type coercion
        if (chat) {
            document.getElementById('driverProfilePic').src = chat.profilePic;
            document.getElementById('driverName').textContent = chat.driverName;
            document.getElementById('bookingDate').textContent = `Booking Date: ${chat.bookingDate}`;
        }
    }

    function getChatIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('chatId');
    }

    // Call loadDriverInfo when the page loads
    loadDriverInfo();

    // Account-related elements and functionalities
    if (document.querySelector('#profile')) {
        loadProfile();
    }

    const editProfileButton = document.querySelector('#editProfileButton');
    if (editProfileButton) {
        editProfileButton.addEventListener('click', () => {
            window.location.href = '/edit-profile.html';
        });
    }

    const editProfileForm = document.querySelector('#editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', saveProfileChanges);
    }

    if (document.querySelector('#deleteProfileButton')) {
        document.querySelector('#deleteProfileButton').addEventListener('click', showDeleteConfirmation);
    }

    if (document.querySelector('#confirmDeleteButton')) {
        document.querySelector('#confirmDeleteButton').addEventListener('click', deleteProfile);
    }

    if (document.querySelector('#cancelDeleteButton')) {
        document.querySelector('#cancelDeleteButton').addEventListener('click', hideDeleteConfirmation);
    }

    if (document.querySelector('#logoutButton')) {
        document.querySelector('#logoutButton').addEventListener('click', logout);
    }

    function loadProfile() {
        const profileData = getProfileData();
        document.getElementById('profilePic').src = profileData.profilePic;
        document.getElementById('userName').textContent = profileData.userName;
        document.getElementById('userDescription').textContent = profileData.userDescription;
        document.getElementById('accountType').textContent = `Account Type: ${profileData.accountType}`;
        document.getElementById('enrollmentStatus').textContent = `Enrollment Status: ${profileData.enrollmentStatus}`;
        document.getElementById('reviews').textContent = `Reviews: ${profileData.reviews}`;
        document.getElementById('balance').textContent = `Balance: ${profileData.balance}`;

        if (profileData.accountType === 'Driver') {
            document.getElementById('withdrawButton').style.display = 'block';
        }
    }

    function getProfileData() {
        // Mock data for now, replace with actual data retrieval
        return {
            profilePic: 'images/john-doe.jpeg',
            userName: 'John Doe',
            userDescription: 'Rider at University Carpooling',
            accountType: 'Rider',
            enrollmentStatus: 'Enrolled',
            reviews: '5 stars',
            balance: '1000 PHP'
        };
    }

    function saveProfileChanges(event) {
        event.preventDefault();
        // Handle saving profile changes
        alert('Profile changes saved!');
        window.location.href = '/account.html';
    }

    function showDeleteConfirmation() {
        document.getElementById('deleteConfirmationPopup').style.display = 'block';
    }

    function hideDeleteConfirmation() {
        document.getElementById('deleteConfirmationPopup').style.display = 'none';
    }

    function saveProfileChanges(event) {
        event.preventDefault();
        const profileData = {
            profilePic: document.getElementById('profilePicInput').value,
            userName: document.getElementById('userNameInput').value,
            userDescription: document.getElementById('userDescriptionInput').value,
            // Add other fields as necessary
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
        window.location.href = '/account.html';
    }

    function loadProfileFromLocalStorage() {
        const storedData = localStorage.getItem('profileData');
        return storedData ? JSON.parse(storedData) : getProfileData();
    }

    function deleteProfile() {
        // Handle profile deletion
        alert('Profile deleted!');
        window.location.href = '/index.html';
    }

    function logout() {
        // Handle logout
        alert('Logged out!');
        window.location.href = '/index.html';
    }
});
