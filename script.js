// Configuración básica de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Fondo negro
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Tonemapping avanzado
renderer.toneMappingExposure = 1; // Ajusta la exposición
document.getElementById('scene-container').appendChild(renderer.domElement);

// Agregar una luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Intensidad moderada
scene.add(ambientLight);

// Agregar una luz direccional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Agregar una luz puntual
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Cargar el modelo 3D
const loader = new THREE.GLTFLoader();
let model;

// Ruta al archivo GLTF
const modelPath = 'karambit/karambit.gltf';

loader.load(modelPath, function(gltf) {
    model = gltf.scene;

    // Recorrer todos los objetos del modelo y verificar los materiales
    model.traverse(function(child) {
        if (child.isMesh) {
            // Asegurarse de que los materiales sean MeshStandardMaterial o MeshPhysicalMaterial
            if (child.material instanceof THREE.MeshStandardMaterial) {
                console.log('Material PBR cargado:', child.material);

                // Verificar si las texturas se cargaron correctamente
                if (child.material.map) {
                    console.log('Textura baseColor cargada:', child.material.map);
                }
                if (child.material.normalMap) {
                    console.log('Textura normal cargada:', child.material.normalMap);
                }
                if (child.material.metalnessMap || child.material.roughnessMap) {
                    console.log('Textura metallicRoughness cargada:', child.material.metalnessMap || child.material.roughnessMap);
                }
            } else {
                console.warn('Material no compatible:', child.material);
            }
        }
    });

    scene.add(model);
}, undefined, function(error) {
    console.error('Error al cargar el modelo', error);
});

// Posición de la cámara
camera.position.z = 5; // Ajusta este valor según el tamaño de tu modelo

// Agregar OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza el movimiento
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Limita la rotación vertical

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar los controles
    controls.update();

    renderer.render(scene, camera);
}

animate();

// Manejar el redimensionamiento de la ventana
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});