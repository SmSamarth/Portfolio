document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navigation --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. Scroll Reveal Animation using Intersection Observer --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-fade');
                // Optional: Stop observing once faded in
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-fade');
    hiddenElements.forEach((el) => observer.observe(el));


    /* --- 3. Interactive Milky Way Canvas Background --- */
    const canvas = document.getElementById('milky-way-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        // Resize Canvas
        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Mouse Tracker
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Particle Class
        class Particle {
            constructor(x, y, size, color, velocityX, velocityY) {
                this.x = x;
                this.y = y;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = size;
                this.color = color;
                this.velocityX = velocityX;
                this.velocityY = velocityY;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Galaxy Rotation Effect
                this.x += this.velocityX;
                this.y += this.velocityY;

                // Move slowly towards edges
                if (this.x > width + 10) this.x = -10;
                if (this.x < -10) this.x = width + 10;
                if (this.y > height + 10) this.y = -10;
                if (this.y < -10) this.y = height + 10;

                // Mouse Interaction (Push/Pull Effect)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;

                    if (distance < mouse.radius) {
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                this.draw();
            }
        }

        // Initialize Particles array
        let particlesArray = [];
        function initCanvas() {
            particlesArray = [];
            let numberOfParticles = (width * height) / 8000; // Density
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 0.5;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let velocityX = (Math.random() * 0.4) - 0.2;
                let velocityY = (Math.random() * 0.4) - 0.2;
                
                // Colors: Deep blue, neon cyan, soft violet
                const colors = ['#ffffff', '#00f2fe', '#9d7cff', '#4facfe'];
                let color = colors[Math.floor(Math.random() * colors.length)];
                
                particlesArray.push(new Particle(x, y, size, color, velocityX, velocityY));
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            // Clear trail effect
            ctx.fillStyle = 'rgba(7, 7, 17, 0.4)';
            ctx.fillRect(0, 0, width, height);
            
            // Connect stars close to each other
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                for (let j = i; j < particlesArray.length; j++) {
                    let dx = particlesArray[i].x - particlesArray[j].x;
                    let dy = particlesArray[i].y - particlesArray[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) { // Connection threshold
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 242, 254, ${1 - distance/100})`;
                        ctx.lineWidth = 0.2;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        initCanvas();
        animate();
    }
});
