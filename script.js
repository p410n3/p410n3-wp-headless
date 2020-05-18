// Less writing for debugging
let lg = console.log;

const modal = document.getElementById('modal');
const pages = document.getElementById('pages');

const apiUrl = 'https://wp.palone.blog/?rest_route=';

// Render links once DOM is loaded
window.addEventListener('load', () => {
    renderLinks();
    if(window.location.hash) renderContent(); // remderContent on pageload if a hash is set
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

                pages.innerHTML += el;
            });
        });

    // Get posts
    fetch(`${apiUrl}/wp/v2/posts&_fields=title,id,slug,excerpt`)
        .then(res => res.json())
        .then(data => {
            data.map(post => {
                let el = `
                    <div class="post">
                        <h2>
                            <a href="#post-${post.slug}-${post.id}">${post.title.rendered}</a>
                        </h2>
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
    if(!window.location.hash) {
        modal.classList.remove('show');
        return;
    }

    let type = 'pages'; // Assume page by default
    if(window.location.hash.match(/^#post/)) type = 'posts'; // Change to post if needed

    let id = window.location.hash.match(/[0-9]+$/)[0];

    fetch(`${apiUrl}/wp/v2/${type}/${id}&_fields=content, title`)
        .then(res => res.json())
        .then(data => {
            modal.innerHTML = `
                <a href="#" class="back">back</a>
                <h1>${data.title.rendered}</h1>
                ${data.content.rendered}
            `;
            modal.classList.add('show');
        });
}
