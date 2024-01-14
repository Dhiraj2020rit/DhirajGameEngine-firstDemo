import GameScene from "./GameScene";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
const cubeTextures = [
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg'
]

export default class GroundScene extends GameScene {
    constructor({ canvas }) {
        super({ canvas }); // Call the constructor of the parent class
    }

    setUp() {

        // Setting up the environment
        const environment = new THREE.CubeTextureLoader().load(cubeTextures);
        this.scene.background = environment;

        // Animation 3D charecter

        this.clock = new THREE.Clock();
        this.mixer = null;
        this.glbLoader = new GLTFLoader();
        
        // Initialize controls
        this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
        this.transformControl = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControl.addEventListener('dragging-changed', (event) => {
            this.orbitControl.enabled = !event.value;
        });

        

        // Event listener for switching between translate/rotate/scale modes
        window.addEventListener('keydown', (event) => {
            switch (event.key.toLowerCase()) {
                case 't':
                    this.setTransformMode('translate');
                    break;
                case 'r':
                    this.setTransformMode('rotate');
                    break;
                case 's':
                    this.setTransformMode('scale');
                    break;
            }
        });

        // Add loaded model to transform control
        // Inside the loadModel callback
        // this.glbLoader.load("houses.glb", (model) => {
        //     this.loadedModel = model.scene;

        //     if (this.loadedModel instanceof THREE.Object3D) {
        //         this.transformControl.attach(this.loadedModel);
        //         this.scene.add(this.loadedModel);
        //     } else {
        //         console.error('The loaded model is not an instance of THREE.Object3D.');
        //     }
        // });

        // Add controls to the scene
        this.scene.add(this.orbitControl);
        this.scene.add(this.transformControl);
    }

    setTransformMode(mode) {
        // Check if transformControl is defined before calling setMode
        if (this.transformControl) {
            this.transformControl.setMode(mode);
        }
    }
    update() {

    }
}