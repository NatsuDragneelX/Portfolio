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

// Modal handling for resume
const modal = document.getElementById("resume-modal");
const resumeBtn = document.getElementById("resume-preview-btn");
const closeBtn = document.querySelector(".close-btn");
resumeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = "block";
});
closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
});
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
