let clubsData = []; // store all clubs for filtering

async function loadClubs() {
    try {
        const response = await fetch('https://lionclub.onrender.com/clubs');
        const clubs = await response.json();
        clubs.sort((a, b) => a.name.localeCompare(b.name));
        clubsData = clubs; // save for search
        populateCategoryDropdown(clubsData);
        renderClubs(clubsData);
    } catch (error) {
        console.error('Error loading clubs:', error);
    }
}

function renderClubs(clubs) {
    const gridContainer = document.getElementById('club-container');
    gridContainer.innerHTML = '';

    clubs.forEach(club => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.justifyContent = 'space-between';
        item.style.height = '260px';

        // Top section: image + name
        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.alignItems = 'center';
        flexContainer.style.gap = '10px';

        const img = document.createElement('img');
        img.src = club.profile_picture_url || 'https://via.placeholder.com/50';
        img.alt = club.name;
        img.classList.add('profile-pic');

        const name = document.createElement('div');
        name.textContent = club.name;
        name.style.cursor = 'pointer';
        name.style.fontWeight = 'bold';
        name.addEventListener('click', () => openModal(club));

        flexContainer.appendChild(img);
        flexContainer.appendChild(name);
        item.appendChild(flexContainer);

        // Middle section: description
        if (club.description) {
            const hr = document.createElement('hr');
            hr.classList.add('item-separator');
            item.appendChild(hr);

            const description = document.createElement('div');
            description.textContent = club.description;
            description.classList.add('description');
            description.style.flexGrow = '1';
            description.style.overflow = 'hidden';

            item.appendChild(description);
        } else {
            const spacer = document.createElement('div');
            spacer.style.flexGrow = '1';
            item.appendChild(spacer);
        }

        // Bottom section: buttons
        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');
        btnGroup.style.display = 'flex';
        btnGroup.style.flexDirection = 'column';
        btnGroup.style.gap = '4px';
        btnGroup.style.marginTop = '8px';

        if (club.linktree_url) {
            const linktreeBtn = document.createElement('a');
            linktreeBtn.href = club.linktree_url;
            linktreeBtn.target = '_blank';
            linktreeBtn.textContent = "Linktree";
            linktreeBtn.classList.add('linktree-btn');
            btnGroup.appendChild(linktreeBtn);
        }

        const eventsBtn = document.createElement('a');
        eventsBtn.textContent = "Events/Instagram";
        eventsBtn.classList.add('events-btn');
        eventsBtn.addEventListener('click', () => openModal(club));
        btnGroup.appendChild(eventsBtn);

        item.appendChild(btnGroup);
        gridContainer.appendChild(item);
    });
}

function populateCategoryDropdown(clubs) {
    const categorySelect = document.getElementById('category-filter');

    // Get unique categories
    const categories = [...new Set(clubs.map(club => club.category).filter(Boolean))].sort();

    // Add them to the dropdown
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// ----- Search Bar Logic -----
// ----- Search + Category Filter Logic -----
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-filter');

function filterClubs() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value;

    const filteredClubs = clubsData.filter(club => {
    const matchesName = club.name.toLowerCase().includes(query);
    const matchesDescription = club.description && club.description.toLowerCase().includes(query);
    const matchesCategory = !selectedCategory || club.category === selectedCategory;
    return (matchesName || matchesDescription) && matchesCategory;
});

// Sort alphabetically
filteredClubs.sort((a, b) => a.name.localeCompare(b.name));

renderClubs(filteredClubs);
}

// Hook into input, dropdown, and form submit
searchInput.addEventListener('input', filterClubs);
categorySelect.addEventListener('change', filterClubs);
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterClubs();
});


// ----- Modal Logic -----
const modal = document.createElement('div');
modal.id = 'club-modal';
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
modal.style.display = 'none';
modal.style.justifyContent = 'center';
modal.style.alignItems = 'center';
modal.style.zIndex = '1000';
document.body.appendChild(modal);

const modalContent = document.createElement('div');
modalContent.style.backgroundColor = 'white';
modalContent.style.padding = '20px';
modalContent.style.borderRadius = '10px';
modalContent.style.maxWidth = '800px';
modalContent.style.width = '90%';
modalContent.style.maxHeight = '80%';
modalContent.style.overflowY = 'auto';
modal.appendChild(modalContent);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalContent.innerHTML = '';
    }
});

function openModal(club) {
    modal.style.display = 'flex';
    modalContent.innerHTML = '';

    const headerStrip = document.createElement('div');
    headerStrip.classList.add('header-strip');

    const title = document.createElement('h2');
    title.textContent = club.name || "Club Name";

    const recentEvents = document.createElement('h4');
    recentEvents.textContent = "Most Recent Post/Event";
    recentEvents.classList.add("recent-events");
    recentEvents.style.textAlign = 'center';
    recentEvents.style.width = '100%';
    
    headerStrip.appendChild(title);
    modalContent.appendChild(headerStrip);
    modalContent.appendChild(recentEvents);

    // --- Embed Instagram using iframe ---
    if (club.instagram) {
        const container = document.createElement('div');
        container.classList.add('instagram-container');
        container.style.display = 'flex';
        container.style.justifyContent = 'center'; 
        container.style.margin = '20px 0';

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.instagram.com/${club.instagram}/embed`;
        iframe.width = "800";
        iframe.height = "680";
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.allowTransparency = true;
        iframe.style.maxWidth = "100%";
        iframe.style.borderRadius = "10px";

        container.appendChild(iframe);
        modalContent.appendChild(container);
    }
}

loadClubs();

