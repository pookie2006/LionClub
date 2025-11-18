  async function loadClubs() {
    try {
        const response = await fetch('http://localhost:3000/clubs');
        const clubs = await response.json();

        const gridContainer = document.querySelector('.grid-container');
        gridContainer.innerHTML = ''; // clear existing items

        clubs.forEach(club => {
            const item = document.createElement('div');
            item.classList.add('item');

            // Use profile_picture_url if available, otherwise placeholder
            const img = document.createElement('img');
            img.src = club.profile_picture_url || 'https://via.placeholder.com/150';
            img.alt = club.name;
            img.style.height = '150px';
            img.style.width = '150px';
            img.style.borderRadius = '50%';

            const name = document.createElement('div');
            name.textContent = club.name;

            item.appendChild(img);
            item.appendChild(name);
            gridContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading clubs:', error);
    }
}

loadClubs();