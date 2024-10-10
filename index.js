const allScenesArray = [];
let activeSceneId = 0;
let sceneCounter = 0;

class Scene {
    constructor(options) {
        this.imagePath = options.path;

        this.bindContexts();

        this.id = this.getId();

        this.camera;
        this.scene;
        this.renderer;
        this.controls;

        this.isConstructed = false;
        this.isDispoced = false;

        allScenesArray.push(this);

        if (this.id != activeSceneId) { // do not render and initiate webgl context and dom if scene isn't active 
            return false;
        }

        this.init();
        this.appendToHTML();
        this.setRenderLoop();

        this.isConstructed = true;
    }

    bindContexts() {
        this.getId = this.getId.bind(this);
        this.reconstruct = this.reconstruct.bind(this);
        this.init = this.init.bind(this);
        this.appendToHTML = this.appendToHTML.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.render = this.render.bind(this);
        this.setRenderLoop = this.setRenderLoop.bind(this);
        this.initRenderer = this.initRenderer.bind(this);
        this.initControls = this.initControls.bind(this);
        this.clearContext = this.clearContext.bind(this);
        this.setResizeListener = this.setResizeListener.bind(this);
        this.clearResizeListener = this.clearResizeListener.bind(this);
        this.unload = this.unload.bind(this);
    }

    getId() {
        const id = JSON.parse(JSON.stringify(sceneCounter));

        sceneCounter += 1;

        return id;
    }

    init() {
        this.camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 0, 0.1);

        this.scene = new THREE.Scene();

        const loader = new THREE.TextureLoader();
        const texture = loader.load(this.imagePath);

        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = THREE.RepeatWrapping;

        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        this.setResizeListener();
        this.initRenderer();
        this.initControls();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.rotateSpeed = -0.25;
    }

    reconstruct() {
        if (this.isConstructed == false) {
            this.isConstructed = true;

            this.init();
            this.appendToHTML();
            this.setRenderLoop();
        };

        if (this.isDispoced == true) {
            this.isDispoced = false;

            // this.setResizeListener();
            // this.initRenderer();
            // this.initControls();

            this.init();
            this.appendToHTML();

            // this.renderer.forceContextRestore();
            // this.renderer.setSize(window.innerWidth, window.innerHeight);

            this.setRenderLoop();
        }
    }

    onWindowResize() {
        if (activeSceneId == this.id) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    setResizeListener() {
        window.addEventListener('resize', this.onWindowResize);
    }

    clearResizeListener() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    appendToHTML() {
        const container = document.createElement('div');
        container.classList.add('panorama-container');
        container.classList.add(`panorama-container-${this.id}`);
        container.appendChild(this.renderer.domElement);
        
        const counter = document.createElement('div');
        counter.classList.add('panorama-container__count');
        counter.innerHTML = `<b>${this.id}</b>`;

        container.appendChild(counter);

        document.body.appendChild(container);
    }

    setRenderLoop() {
        this.renderer.setAnimationLoop(() => {
            if (activeSceneId == this.id && this.isConstructed) {
                console.log('Scene Render Loop ->', this.id);
    
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
            }
        });
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    clearContext() {
        console.log('ClearContext ->', this.id);

        this.renderer.dispose();
        this.renderer.forceContextLoss();

        this.isDispoced = true;
    }

    unload() {
        console.log('Unload Scene ->', this.id);

        this.clearContext();
        this.clearResizeListener();
    }
}

// Reconstruct active scene on window loading if it's not constructed
window.addEventListener('load', () => {
    allScenesArray[activeSceneId].reconstruct();

    updateScenesVisibility(); // update visibility of scenes
})


// set event listener how input to change between scenes
document.getElementsByTagName('input')[0].addEventListener('keypress', event => {
    if (event.code == 'Enter') {
        setActiveScene(event.target.value);
    }
})

// Change classes for scenes to get active canvas visible
function updateScenesVisibility() {
    const containers = document.querySelectorAll('.panorama-container');
    containers.forEach(el => {
        if (!el.classList.contains(`panorama-container-${activeSceneId}`)) {
            el.classList.add('hide');
            el.classList.remove('show');
        }
    });

    const container = document.querySelector(`.panorama-container-${activeSceneId}`) 

    if (container) {
        if (container.classList.contains('hide')) {
            container.classList.remove('hide');
        }

        container.classList.add('show');

        setTimeout(() => {
            allScenesArray[activeSceneId].onWindowResize();
        }, 0)
    }
}


function setActiveScene(num) {
    allScenesArray[activeSceneId].unload();

    activeSceneId = num;

    setTimeout(() => {
        console.log(allScenesArray[activeSceneId]);
        allScenesArray[activeSceneId].reconstruct();
        allScenesArray[activeSceneId].onWindowResize();

        updateScenesVisibility();
    }, 0); 
}



// Test how app handles a bunch of rendered (but not active) scenes
let huh = 15;
let a = 0;
let b = huh;
function stressTest() {
    for (let i = a; i <= b; i++) {
        activeSceneId = i;

        allScenesArray[i].reconstruct();
    
        setTimeout(() => {
            if (i != activeSceneId) {
                allScenesArray[i].unload();
            }
        }, 100);

        updateScenesVisibility();
    }


    a += huh;
    b += huh;
}