let sceneId = 0;
let activeScene = 1;
// let scenes = [{}];

// Initialize the scene
init('bruh.png');
init('bruh2.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');
init('bruh3.png');

function init(imageName) {
    sceneId++;

    // Define variables
    let camera, scene, renderer, controls;

    const ID = JSON.parse(JSON.stringify(sceneId));

    window.addEventListener('keypress', (event) => {
        activeScene = event.key;

        if (event.key == `${ID}`) {
            const containers = document.querySelectorAll('.panorama-container');
            containers.forEach(el => {
                if (!el.classList.contains(`panorama-container-${ID}`)) {
                    el.classList.add('hide');
                    el.classList.remove('show');
                }
            })

           document.querySelector(`.panorama-container-${ID}`).classList.remove('hide'); 
           document.querySelector(`.panorama-container-${ID}`).classList.add('show'); 
        //    const obj = scenes[ID];
        //    obj.renderer.render(obj.scene, obj.camera)
        } 
    })

    if (activeScene != ID) {
        return
    } else {
        if (camera == false && scene == false && render == false && controls == false) {
            init(imageName);
        }
    };

    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 0.1);

    scene = new THREE.Scene();

    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageName);

    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('resize', onWindowResize);
    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.createElement('div');
    container.classList.add('panorama-container');
    container.classList.add(`panorama-container-${ID}`);
    container.appendChild(renderer.domElement);
    
    document.body.appendChild(container);

    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.rotateSpeed = -0.25;

    document.querySelector(`.panorama-container-${ID}`).classList.add('hide'); 

    // function render() {
    //     renderer.render( scene, camera );
    // }

    // scenes.push({
    //     renderer,
    //     camera,
    //     scene
    // });

    // controls.addEventListener('change', () => {
    //     if (activeScene == ID) {
    //         render()
    //     }
    // });

    window.addEventListener('load', () => {
        if (activeScene == ID) {
            console.log('animation loop', ID);

            controls.update();
            renderer.render(scene, camera);

            const containers = document.querySelectorAll('.panorama-container');
            containers.forEach(el => {
                if (!el.classList.contains(`panorama-container-${ID}`)) {
                    el.classList.add('hide');
                    el.classList.remove('show');
                }
            })

           document.querySelector(`.panorama-container-${ID}`).classList.remove('hide'); 
           document.querySelector(`.panorama-container-${ID}`).classList.add('show'); 
        }
    })

    renderer.setAnimationLoop(() => {
        if (activeScene == ID) {
            console.log('animation loop', ID);

            controls.update();
            renderer.render(scene, camera);
        }
    });

    function onWindowResize() {
        // render()

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

