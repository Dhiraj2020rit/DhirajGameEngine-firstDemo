// GameScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { handleModelEvents } from './model_handling';

export default class GameScene {
    constructor({ canvas }) {
        this.canvas = canvas;
        this.init();
        this.render();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
        this.camera.position.set(0, 5, 50);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.resize();
        this.setUpEvents();
        this.setUpControls();
        this.setUpLights();
        this.setUpGUI();
        this.setUp();
        this.loadedModels = []; // Array to store loaded models and their controls
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.update();

        requestAnimationFrame(() => { this.render(); });
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setUpEvents() {
        window.addEventListener('resize', () => { this.resize(); });
    }

    setUpControls() {
        this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setUpLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xffffff, 10);
        this.scene.add(this.pointLight);

        this.pointLightTransformControl = new TransformControls(this.camera, this.renderer.domElement);
        this.pointLightTransformControl.addEventListener('dragging-changed', () => {
            this.orbitControl.enabled = !this.orbitControl.enabled;
        });
        this.pointLightTransformControl.attach(this.pointLight);
        this.scene.add(this.pointLightTransformControl);
    }

    setUpGUI() {
        this.gui = new dat.GUI();
        let ambientFolder = this.gui.addFolder('Ambient Light');
        ambientFolder.add(this.ambientLight, 'intensity', 0, 10);

        let pointFolder = this.gui.addFolder('Point Light');
        pointFolder.add(this.pointLight, 'intensity', 10, 1000);
        pointFolder.add(this.pointLightTransformControl, 'visible').onChange((e) => {
            this.pointLightTransformControl.enabled = e;
        });

        // Add a file input control for loading 3D models
        let fileFolder = this.gui.addFolder('Load 3D Models');
        const loadModelControl = {
            loadModel: () => {
                this.loadModel();
            },
        };
        fileFolder.add(loadModelControl, 'loadModel').name('Load Model');
    }

    loadModel() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.gltf, .glb'; // Specify the accepted file types
        input.multiple = true; // Allow multiple file selection
        input.addEventListener('change', (event) => {
            const files = event.target.files;

            if (files && files.length > 0) {
                // Validate file types
                const validFiles = Array.from(files).filter(file => this.isSupportedFileType(file.name));

                if (validFiles.length > 0) {
                    validFiles.forEach((file, index) => {
                        const loader = new GLTFLoader();
                        loader.load(URL.createObjectURL(file), (gltf) => {
                            const model = gltf.scene;
                            this.scene.add(model);

                            // Optionally, adjust the position, scale, or other properties
                            model.position.set(0, 0, 0);
                            model.scale.set(1, 1, 1);

                            // Call the model handling function to add event listeners and controls
                            const transformControl = handleModelEvents(this, model, index, file.name);

                            // Store the loaded model and its controls
                            this.loadedModels.push({
                                model,
                                transformControl
                            });

                            console.log('Successfully loaded 3D model:', file.name);
                        }, undefined, (error) => {
                            console.error('Error loading 3D model:', error);
                        });
                    });
                } else {
                    console.error('Invalid file types. Please provide supported 3D model files.');
                }
            } else {
                console.log('User canceled model loading.');
            }
        });

        // Simulate a click event on the input element to trigger the file selection dialog
        input.click();
    }

    isSupportedFileType(fileName) {
        // Define the supported 3D model file types
        const supportedFileTypes = ['.gltf', '.glb'];

        // Check if the file name ends with a supported extension
        return supportedFileTypes.some((extension) => fileName.toLowerCase().endsWith(extension));
    }

    update() {
        // Update logic if needed
    }
}
