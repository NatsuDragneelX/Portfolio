// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.getElementById('playGameBtn').addEventListener('click', () => {
    document.getElementById('gameSection').style.display = 'block'; // Show the game section
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' }); // Scroll to the game section
});

// Intersection Observer for sections
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

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

// Contact form submission handler
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    showMessage('Message sent! Thank you for contacting me.'); // Replaced alert
});

// Resume modal control
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

// Make the header shrink on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Setup game canvas and context
const canvas = document.getElementById('gameCanvas');
canvas.width = 1000; // Increased the play area size
canvas.height = 500;
const ctx = canvas.getContext('2d');

// Physics parameters
const gravity = 0.5;
const friction = 0.98;
let level = 1;
let enemySpeed = 2;
let isChallengeMode = true;
let powerUpActive = false; // Power-up state

// Skill and enemy objects
const skills = [
    { name: 'C++', x: 50, y: 300, width: 50, height: 50, velocityX: 0, velocityY: 0, isThrown: false, color: '#00bcd4' },
    { name: 'JavaScript', x: 150, y: 300, width: 50, height: 50, velocityX: 0, velocityY: 0, isThrown: false, color: '#00bcd4' },
    { name: 'Python', x: 250, y: 300, width: 50, height: 50, velocityX: 0, velocityY: 0, isThrown: false, color: '#00bcd4' }
];
const enemy = { x: 600, y: 150, width: 80, height: 150, health: 100, maxHealth: 100, color: '#ff4081', attackCooldown: 0 };
const powerUp = { x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), width: 30, height: 30, active: false };

// Function to draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw skills
    skills.forEach(skill => {
        ctx.fillStyle = skill.color;
        ctx.fillRect(skill.x, skill.y, skill.width, skill.height);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(skill.name, skill.x + 5, skill.y + 30);
    });

    // Draw enemy
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillStyle = '#fff';
    ctx.fillText('Enemy', enemy.x + 10, enemy.y + 20);

    // Draw enemy health bar
    drawHealthBar(enemy.x, enemy.y - 20, enemy.health, enemy.maxHealth);

    // Draw power-up
    if (powerUp.active) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        ctx.fillStyle = '#000';
        ctx.fillText('P', powerUp.x + 10, powerUp.y + 20);
    }
}

// Function to start sandbox mode
function startSandboxMode() {
    isChallengeMode = false;
    enemy.health = 100; // Reset enemy health
    enemySpeed = 0; // Stop enemy movement in sandbox mode
    resetSkills();
    showMessage('Sandbox Mode! No restrictions, just have fun!');
}

// Function to start challenge mode
function startChallengeMode() {
    isChallengeMode = true;
    level = 1; // Start from level 1
    enemy.health = 100; // Reset enemy health
    enemy.maxHealth = enemy.health;
    enemySpeed = 1; // Set initial enemy speed
    resetSkills();
    showMessage('Challenge Mode! Defeat the enemy and move up the levels!');
}

// Add event listeners to the buttons for game modes
document.getElementById('sandboxModeBtn').addEventListener('click', startSandboxMode);
document.getElementById('challengeModeBtn').addEventListener('click', startChallengeMode);


// Draw the health bar
function drawHealthBar(x, y, health, maxHealth) {
    const barWidth = 80;
    const barHeight = 10;
    const healthRatio = health / maxHealth;
    
    // Draw background bar (gray)
    ctx.fillStyle = '#555';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw health bar (green)
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);
}

// Update physics for skills
function updateSkills() {
    skills.forEach(skill => {
        if (skill.isThrown) {
            // Apply gravity
            skill.velocityY += gravity;

            // Apply velocity to position
            skill.x += skill.velocityX;
            skill.y += skill.velocityY;

            // Apply friction
            skill.velocityX *= friction;
            skill.velocityY *= friction;

            // Collision with ground (bottom of canvas)
            if (skill.y + skill.height > canvas.height || skill.x + skill.width > canvas.width || skill.x < 0 || skill.y < 0) {
                respawnSkill(skill); // Respawn skill if out of bounds
            }

            // Check collision with power-up
            if (powerUp.active && checkCollision(skill, powerUp)) {
                powerUpActive = true; // Activate power-up
                powerUp.active = false; // Remove power-up
                skill.color = '#ffcc00'; // Change skill color to indicate power-up
                setTimeout(() => {
                    powerUpActive = false;
                    skill.color = '#00bcd4'; // Reset color after power-up ends
                }, 5000); // Power-up lasts for 5 seconds
            }

            // Check collision with enemy in challenge mode
            if (isChallengeMode && checkCollision(skill, enemy)) {
                dealDamage(skill);
            }
        }
    });
}

// Respawn a skill to its original position
function respawnSkill(skill) {
    skill.x = 50;
    skill.y = 300;
    skill.velocityX = 0;
    skill.velocityY = 0;
    skill.isThrown = false;
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width &&
           obj1.y + obj1.height > obj2.y && obj1.y < obj2.y + obj2.height;
}

// Deal damage to enemy
function dealDamage(skill) {
    let damage = 20;
    if (powerUpActive) {
        damage = 40; // Double damage if power-up is active
    }
    enemy.health -= damage;
    
    // Flash effect on hit
    enemy.color = '#ff0000';
    setTimeout(() => {
        enemy.color = '#ff4081'; // Reset the color after hit
    }, 100);
    
    if (enemy.health <= 0) {
        nextLevel(); // Move to the next level
    }
    skill.isThrown = false; // Stop the skill after a hit
}

// Enemy random movement and attacks
function updateEnemy() {
    if (isChallengeMode) {
        enemy.y += enemySpeed;
    
        // Make the enemy bounce off the top and bottom edges of the canvas
        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
            enemySpeed *= -1; // Reverse direction
        }

        // Enemy attack: move toward the nearest skill
        if (enemy.attackCooldown <= 0) {
            let closestSkill = skills.reduce((closest, skill) => {
                let dist = Math.hypot(skill.x - enemy.x, skill.y - enemy.y);
                return dist < closest.dist ? { skill, dist } : closest;
            }, { skill: null, dist: Infinity });

            if (closestSkill.skill) {
                // Move towards the skill
                let dx = closestSkill.skill.x - enemy.x;
                let dy = closestSkill.skill.y - enemy.y;
                let dist = Math.hypot(dx, dy);
                enemy.x += (dx / dist) * 3; // Move towards the skill
                enemy.y += (dy / dist) * 3;
            }

            enemy.attackCooldown = 100; // Cooldown before next move
        } else {
            enemy.attackCooldown--;
        }
    }
}

// Power-up spawning logic
function spawnPowerUp() {
    if (!powerUp.active && Math.random() < 0.01) { // Random chance to spawn power-up
        powerUp.x = Math.random() * (canvas.width - powerUp.width);
        powerUp.y = Math.random() * (canvas.height - powerUp.height);
        powerUp.active = true;
    }
}

// Move to the next level
function nextLevel() {
    level++;
    
    // Show a message for level completion
    showMessage(`Level ${level - 1} Complete!`);
    
    // Freeze the game for 2 seconds before moving to the next level
    setTimeout(() => {
        // Increase difficulty and reset the enemy for the next level
        enemy.health = 100 + level * 20; // Increase enemy health with each level
        enemy.maxHealth = enemy.health;  // Update max health
        enemySpeed += 0.5; // Increase enemy speed slightly with each level
        
        // Reset the enemy position (so it doesn't remain in the same place)
        enemy.x = Math.random() * (canvas.width - enemy.width);
        enemy.y = Math.random() * (canvas.height - enemy.height);
        
        resetSkills(); // Reset skills for the next round
        showMessage(`Level ${level}! The enemy is getting stronger and faster!`);
    }, 2000); // 2-second pause between levels
}

// Function to display messages within the game
function showMessage(message) {
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.innerHTML = message;
    gameMessage.style.display = 'block';

    // Hide the message after 3 seconds
    setTimeout(() => {
        gameMessage.style.display = 'none';
    }, 3000);
}

// Reset the skills to their original positions
function resetSkills() {
    skills.forEach((skill, index) => {
        skill.x = 50 + index * 100;
        skill.y = 300;
        skill.velocityX = 0;
        skill.velocityY = 0;
        skill.isThrown = false;
    });
    enemy.health = enemy.maxHealth; // Reset enemy health
}

// Handle skill dragging and throwing
let selectedSkill = null;
let mouseStartX = 0;
let mouseStartY = 0;

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    skills.forEach(skill => {
        if (mouseX > skill.x && mouseX < skill.x + skill.width &&
            mouseY > skill.y && mouseY < skill.y + skill.height) {
            selectedSkill = skill;
            mouseStartX = mouseX;
            mouseStartY = mouseY;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedSkill && !selectedSkill.isThrown) {
        selectedSkill.x = e.offsetX - selectedSkill.width / 2;
        selectedSkill.y = e.offsetY - selectedSkill.height / 2;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (selectedSkill && !selectedSkill.isThrown) {
        // Calculate throwing velocity based on mouse movement
        const mouseEndX = e.offsetX;
        const mouseEndY = e.offsetY;
        selectedSkill.velocityX = (mouseEndX - mouseStartX) / 5;
        selectedSkill.velocityY = (mouseEndY - mouseStartY) / 5;
        selectedSkill.isThrown = true; // Set thrown to true
        selectedSkill = null; // Deselect skill
    }
});

// Start the game loop
function gameLoop() {
    draw();
    updateSkills();
    updateEnemy();
    spawnPowerUp();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();