// Less writing for debugging
let lg = console.log;

const modal = document.getElementById('modal');
modal.addEventListener('click', (e) => {
    // To make sure only the modal and not the content inside has been clicked, we check if content is in the event path
    // And if it is, set a flag to stop the hash from changing
    let flag = false;

    e.path.map(el => {
        if(el.id === 'content') flag = true;
    });
    
    if(!flag) window.location.hash = '';
});

const content = document.getElementById('content');
const pages = document.getElementById('pages');

const apiUrl = 'https://wp.palone.blog/?rest_route=';

// Render links once DOM is loaded
window.addEventListener('load', () => {
    renderLinks();
    if (window.location.hash) renderContent(); // remderContent on pageload if a hash is set
});

// Show content in modal when the location hash changes
window.addEventListener('hashchange', () => {
    renderContent();
});

// Functions down here
function renderLinks() {
    // Get pages
    fetch(`${apiUrl}/wp/v2/pages&_fields=title,id,slug`)
        .then(res => res.json())
        .then(data => {
            data.map(page => {
                let el = `
                    <a href="#${page.slug}-${page.id}">${page.title.rendered}</a>
                `;

                pages.innerHTML = el + pages.innerHTML;
            });
        });

    // Get posts
    fetch(`${apiUrl}/wp/v2/posts&_fields=title,id,slug,excerpt,date&per_page=100`)
        .then(res => res.json())
        .then(data => {
            data.map(post => {
                let dateString = post.date.split('T')[0];
                let date = new Date(dateString);
                let dateText = date.toDateString();

                let el = `
                    <div class="post">
                        <h2>
                            <a href="#post-${post.slug}-${post.id}">${post.title.rendered}</a>
                        </h2>
                        <span class="date">
                            Published: ${dateText}
                        </span>
                        <span>
                            ${post.excerpt.rendered}
                        </span>
                        <a href="#post-${post.slug}-${post.id}">Read More</a>
                    </div>
                `;
                posts.innerHTML += el;
            });
        });
}

function renderContent() {
    // If there is no location hash, close modal and retirn early
    if (!window.location.hash) {
        modal.classList.remove('show');
        content.innerHTML = '';
        return;
    }

    modal.classList.add('show');

    let type = 'pages'; // Assume page by default
    if (window.location.hash.match(/^#post/)) type = 'posts'; // Change to post if needed

    let id = window.location.hash.match(/[0-9]+$/)[0];

    fetch(`${apiUrl}/wp/v2/${type}/${id}&_fields=content, title`)
        .then(res => res.json())
        .then(data => {
            content.innerHTML = `
                <a href="#" class="back">×</a>
                <h1>${data.title.rendered}</h1>
                ${data.content.rendered}
            `;
        });
}
