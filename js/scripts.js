window.addEventListener('load', function() {
    fetch('docs/credit_cards.md')
        .then(response => response.text())
        .then(text => {
            document.getElementById('md-content').innerHTML = marked(text);
        }).catch(error => {
            console.error('Error fetching Markdown file:', error);
        });
});



// Typing Effect for Title
document.addEventListener('DOMContentLoaded', function () {
    function typeTitle(titleText, elementId) {
        const titleElement = document.getElementById(elementId);
        if (!titleElement) {
            // Element does not exist on this page, so exit the function early
            return;
        }
        let titleIndex = 0;

        function typeCharacter() {
            if (titleIndex < titleText.length) {
                titleElement.textContent += titleText.charAt(titleIndex);
                titleIndex++;
                setTimeout(typeCharacter, 100); // Adjust typing speed as needed
            } else {
                // Typing is complete, you can add any actions you want to take here
            }
        }

        typeCharacter();
    }

    // Only call typeTitle if the 'typedTitle' element exists on the page
    if (document.getElementById('typedTitle')) {
        setTimeout(() => typeTitle("Akshay Podagatlapalli", 'typedTitle'), 500);
    }

    // Only call typeTitle if the 'projectsElementId' element exists on the page
    if (document.getElementById('projectsElementId')) {
        setTimeout(() => typeTitle("Projects", 'projectsElementId'), 500);
    }

    if (document.getElementById('resumeElementId')) {
        setTimeout(() => typeTitle("Resume", 'resumeElementId'), 500);
    }

    if (document.getElementById('playlistsElementId')) {
        setTimeout(() => typeTitle("Playlists", 'playlistsElementId'), 500);
    }

    if (document.getElementById('readingsElementId')) {
        setTimeout(() => typeTitle("Readings", 'readingsElementId'), 500);
    }

    if (document.getElementById('contactElementId')) {
        setTimeout(() => typeTitle("Contact", 'contactElementId'), 500);
    }

});

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleBackground');
    const moonIcon = toggleButton.querySelector('.fa-moon');
    const sunIcon = toggleButton.querySelector('.fa-sun');

    // Function to update the theme
    function updateTheme(isBlackBackground) {
        if (isBlackBackground) {
            document.body.classList.remove('bone-white-background');
            document.body.classList.add('black-background', 'dark-theme');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
            toggleButton.setAttribute('aria-label', 'Switch to light theme');
        } else {
            document.body.classList.add('bone-white-background');
            document.body.classList.remove('black-background', 'dark-theme');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
            toggleButton.setAttribute('aria-label', 'Switch to dark theme');
        }
        // Save the current theme state to localStorage
        localStorage.setItem('theme', isBlackBackground ? 'black' : 'boneWhite');
    }

    // Event listener for the toggle button
    toggleButton.addEventListener('click', function () {
        // Toggle the theme state
        let isBlackBackground = localStorage.getItem('theme') !== 'black';
        updateTheme(isBlackBackground);
        // Save the new theme state to localStorage
        localStorage.setItem('theme', isBlackBackground ? 'black' : 'boneWhite');
    });

    // Apply the theme when the page loads
    let isBlackBackground = localStorage.getItem('theme') !== 'boneWhite';
    updateTheme(isBlackBackground);
});

document.addEventListener('DOMContentLoaded', function () {
    let scene, camera, renderer, cubes = [];
    let mouse = { x: 0, y: 0 };
    let cubeCount = 10; // Number of cubes
    let mouseEffect = []; // To store the effect of the mouse on each cube
    let cubeRotations = []; // To store rotation data for each cube

    function init() {
        // Set up the scene
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // Fully transparent
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer to the threejs-container
        document.body.appendChild(renderer.domElement);
        const container = document.getElementById('threejs-container');
        if (container) {
            container.appendChild(renderer.domElement);
        } else {
            console.error('threejs-container not found');
            return;
        }

        // Add cubes
        for (let i = 0; i < cubeCount; i++) {
            const size = Math.random() * 0.5 + 0.5;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = (Math.random() - 0.5) * 10;
            cube.position.y = (Math.random() - 0.5) * 10;
            cube.position.z = (Math.random() - 0.5) * 10;
            scene.add(cube);
            cubes.push(cube); // Store cube reference for later manipulation

            // Store a random effect for each cube
            mouseEffect.push({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            });
            
            // Store initial rotation and rotation velocity for each cube
            cubeRotations.push({
                x: Math.random() * 0.005 - 0.0025,
                y: Math.random() * 0.005 - 0.0025,
                z: Math.random() * 0.005 - 0.0025,
                velX: Math.random() * 0.01 - 0.005,
                velY: Math.random() * 0.01 - 0.005,
                velZ: Math.random() * 0.01 - 0.005,
            });
        }

        // Camera position
        camera.position.z = 5;

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        // Start the animation loop
        animate();
    }

    function onWindowResize() {
        // Update the size of the renderer and the camera aspect ratio on resize
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);
    
    function animate() {
        requestAnimationFrame(animate);

        // Update cube positions and rotations
        cubes.forEach((cube, index) => {
            let factor = (index + 1) * 0.05;
            let effect = mouseEffect[index];
            let rotation = cubeRotations[index];

            // Position with easing
            cube.position.x += ((mouse.x * effect.x) - cube.position.x) * factor;
            cube.position.y += ((mouse.y * effect.y) - cube.position.y) * factor;

            // Rotation with easing
            cube.rotation.x += (rotation.velX - cube.rotation.x) * factor;
            cube.rotation.y += (rotation.velY - cube.rotation.y) * factor;
            cube.rotation.z += (rotation.velZ - cube.rotation.z) * factor;

            // Update rotation velocities for a continuous rotation effect
            rotation.velX += (rotation.x - cube.rotation.x) * factor;
            rotation.velY += (rotation.y - cube.rotation.y) * factor;
            rotation.velZ += (rotation.z - cube.rotation.z) * factor;
        });

        renderer.render(scene, camera);
    }

    function onDocumentMouseMove(event) {
        // Update the mouse variable
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

        // Corrected rotation handling for each cube
        cubes.forEach(cube => {
            cube.rotation.x = mouse.y * 0.01;
            cube.rotation.y = mouse.x * 0.01;
        });
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    init();
  
});

window.addEventListener('scroll', function() {
    var footer = document.querySelector('.site-footer');
    if (window.scrollY > window.innerHeight) { // Adjust the value as needed
        footer.classList.add('visible');
    } else {
        footer.classList.remove('visible');
    }
});
