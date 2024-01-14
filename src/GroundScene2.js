import GameScene from "./GameScene";
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const cubeTextures = [
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
    'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg'
]

export default class GroundScene2 extends GameScene{
    setUp(){
        // const groundGeometry = new THREE.PlaneGeometry(100, 100);
        // const groundMaterial = new THREE.MeshStandardMaterial({
        //     side: THREE.DoubleSide
        // });
        // const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        // ground.rotateX(Math.PI*0.5);
        // this.scene.add(ground);

        // this.gltfLoader = new GLTFLoader();
        // this.gltfLoader.load("sas blue.glb", (obj) => {
        //     this.scene.add(obj.scene);
        //     console.log(obj.scene);
        // })

        // Setting up the environment
        const environment = new THREE.CubeTextureLoader().load(cubeTextures);
        this.scene.background = environment;

        // Animation 3D charecter

        this.clock = new THREE.Clock();
        this.mixer = null;
        // this.scene.background = new THREE.Color(1,1,1);
        this.pointLight.position.set(0, 0, 50);
        this.glbLoader = new GLTFLoader();
        this.glbLoader.load("houses.glb", (model)=>{
            this.scene.add(model.scene);
        })

        // Event listener for switching between translate/rotate/scale modes
        window.addEventListener('keydown', (event) => {
            switch (event.key.toLowerCase()) {
                case 't':
                    this.transformControl.setMode('translate');
                    break;
                case 'r':
                    this.transformControl.setMode('rotate');
                    break;
                case 's':
                    this.transformControl.setMode('scale');
                    break;
            }
        });
        
        // Adding Ground Textures

        let groundTexture = new THREE.TextureLoader().load("grass.jpg");
        let size = 500;
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({
            map: groundTexture
        }));
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        // this.glbLoader.load("sas blue.glb", (model) => {
        //     let obj = model.scene;
        //     console.log(model);
        //     this.mixer = new THREE.AnimationMixer(model.scene);
        //     this.clips = model.animations;
        //     this.scene.add(obj);

        //     const clip = THREE.AnimationClip.findByName(this.clips, 'maximo.com');
        //     const action = this.mixer.clipAction(clip);
        //     action.play();
        // })
    }
    update(){
        if(this.mixer){
            let d = this.clock.getDelta();
            this.mixer.update(d);
        }
    }
}