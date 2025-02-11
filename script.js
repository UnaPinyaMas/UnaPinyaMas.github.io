// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x232633); // Fondo negro para contrastar
document.getElementById('scene-container').appendChild(renderer.domElement);

// Luz para iluminar la escena
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Luz ambiental
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Luz direccional
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Cargar el modelo 3D
const loader = new THREE.GLTFLoader();
loader.load(
    'assets/knifes/csgo_karambit_autotronic/scene.gltf', // Ruta al archivo .gltf o .glb
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);

        // Ajustar la cámara para que el modelo sea visible
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        camera.position.copy(center);
        camera.position.x += size.x * 1; // Ajusta la posición de la cámara
        camera.position.y += size.y * 1;
        camera.position.z += size.z * 1;
        camera.lookAt(center);
    },
    undefined, // No hay función de progreso
    function (error) {
        console.error('Error al cargar el modelo:', error);
    }
);

// Agregar OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza los movimientos
controls.dampingFactor = 0.05; // Ajusta la suavidad
controls.screenSpacePanning = false;
controls.minDistance = 1; // Zoom mínimo
controls.maxDistance = 100; // Zoom máximo
controls.maxPolarAngle = Math.PI / 1; // Limita la rotación vertical

// Animación
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualiza los controles en cada frame
    renderer.render(scene, camera);
}
animate();

// Ajustar el tamaño del renderizador cuando la ventana cambie de tamaño
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});