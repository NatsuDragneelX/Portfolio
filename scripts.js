document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const sections = document.querySelectorAll('.section');
const options = { threshold: 0.1 };

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    alert('Message sent! Thank you for contacting me.');
});


// Resume Modal Control
const modal = document.getElementById("resume-modal");
const resumeBtn = document.getElementById("resume-preview-btn");
const closeBtn = document.querySelector(".close-btn");

// Open modal when the button is clicked
resumeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = "block";
});

// Close modal when the close button is clicked
closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

