class ParticleSystem {
    constructor() {
        this.container = document.getElementById('background-animation');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.particles = [];

        this.init();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);


        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.6
        });


        const whiteMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.4
        });

        for (let i = 0; i < 150; i++) {
            const particleMaterial = i % 2 === 0 ? material : whiteMaterial;
            const particle = new THREE.Mesh(geometry, particleMaterial);

            particle.position.set(
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20
            );

            particle.velocity = new THREE.Vector3(
                Math.random() * 0.02 - 0.01,
                Math.random() * 0.02 - 0.01,
                Math.random() * 0.02 - 0.01
            );


            particle.pulseSpeed = Math.random() * 0.02 + 0.01;
            particle.pulsePhase = Math.random() * Math.PI * 2;

            this.particles.push(particle);
            this.scene.add(particle);
        }

        this.camera.position.z = 30;


        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;


        this.particles.forEach(particle => {

            particle.position.add(particle.velocity);


            particle.material.opacity = 0.3 + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.2;


            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(particle.position[axis]) > 20) {
                    particle.velocity[axis] *= -1;
                }
            });
        });


        this.scene.rotation.y += 0.0005;
        this.scene.rotation.x += 0.0002;

        this.renderer.render(this.scene, this.camera);
    }
}


new ParticleSystem();