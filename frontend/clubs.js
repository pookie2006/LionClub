async function loadClubs() {
    try {
        const response = await fetch('http://localhost:3000/clubs');
        const clubs = await response.json();

        const gridContainer = document.getElementById('club-container');
        gridContainer.innerHTML = '';

        clubs.forEach(club => {

            // ---- CARD CONTAINER ----
            const item = document.createElement('div');
            item.classList.add('item');
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.justifyContent = 'space-between';
            item.style.height = '260px'; // fixed height so buttons stay stable


            // ---- TOP SECTION: IMAGE + NAME ----
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


            // ---- MIDDLE SECTION: DESCRIPTION (flex-grow) ----
            if (club.description) {
                const hr = document.createElement('hr');
                hr.classList.add('item-separator');
                item.appendChild(hr);

                const description = document.createElement('div');
                description.textContent = club.description;
                description.classList.add('description');
                description.style.flexGrow = '1';   // takes remaining space
                description.style.overflow = 'hidden';

                item.appendChild(description);
            } else {
                // even if no description, create spacer so card spacing stays consistent
                const spacer = document.createElement('div');
                spacer.style.flexGrow = '1';
                item.appendChild(spacer);
            }


            // ---- BOTTOM SECTION: BUTTON GROUP ----
            const btnGroup = document.createElement('div');
            btnGroup.classList.add('btn-group');
            btnGroup.style.display = 'flex';
            btnGroup.style.justifyContent = 'flex-end';
            btnGroup.style.gap = '4px';
            btnGroup.style.marginTop = '8px';


            // Linktree button
            if (club.linktree_url) {
                const linktreeBtn = document.createElement('a');
                linktreeBtn.href = club.linktree_url;
                linktreeBtn.target = '_blank';
                linktreeBtn.textContent = "Linktree";
                linktreeBtn.classList.add('linktree-btn');
                btnGroup.appendChild(linktreeBtn);
            }

            // Events button
            const eventsBtn = document.createElement('a');
            eventsBtn.textContent = "Events/Instagram";
            eventsBtn.classList.add('events-btn');
            eventsBtn.addEventListener('click', () => openModal(club));
            btnGroup.appendChild(eventsBtn);

            item.appendChild(btnGroup);


            // ---- ADD CARD TO GRID ----
            gridContainer.appendChild(item);
        });

    } catch (error) {
        console.error('Error loading clubs:', error);
    }
}

loadClubs();


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

// POPUP Modal content box
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

    // Create header strip container
    const headerStrip = document.createElement('div');
    headerStrip.classList.add('header-strip');
    const title = document.createElement('h2');
    title.textContent = club.name || "Club Name";

    // Create heading for Recent Events
    const recentEvents = document.createElement('h4');
    recentEvents.textContent = "Most Recent Post/Event";
    recentEvents.classList.add("recent-events");
   
    headerStrip.appendChild(title);
    modalContent.appendChild(headerStrip);
    modalContent.appendChild(recentEvents);

    // Instagram embed
    if (club.latest_post_url) {
        const container = document.createElement('div');
        container.style.maxWidth = '700px';
        container.style.width = '90%';
        container.style.margin = '20px 0';   // left aligned
        container.style.display = 'block';   // ensure left alignment

        const blockquote = document.createElement('blockquote');
        blockquote.classList.add('instagram-media');
        blockquote.setAttribute('data-instgrm-permalink', club.latest_post_url);
        blockquote.setAttribute('data-instgrm-version', '14');
        blockquote.style.width = '80%';
        blockquote.style.margin = '0'; 
        blockquote.marginTop = '0';      // remove auto centering

        container.appendChild(blockquote);
        modalContent.appendChild(container);

        // Load Instagram embed script
        if (!document.getElementById('instagram-embed-script')) {
            const script = document.createElement('script');
            script.async = true;
            script.id = 'instagram-embed-script';
            script.src = "//www.instagram.com/embed.js";
            document.body.appendChild(script);
        } else {
            if (window.instgrm) window.instgrm.Embeds.process();
        }
    }
}


    
    

