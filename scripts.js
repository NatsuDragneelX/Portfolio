// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('nav ul');
hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

// Contact form submission handler
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault(); 
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
});

function toggleMoreContent(contentId, button) {
    const content = document.getElementById(contentId);
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        button.innerText = "Read Less";
    } else {
        content.style.display = "none";
        button.innerText = "Read More";
    }
}