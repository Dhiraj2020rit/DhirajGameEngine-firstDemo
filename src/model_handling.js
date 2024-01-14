// model_handling.js
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import dat from 'dat.gui';

export function handleModelEvents(scene, model, modelIndex, fileName) {
    const transformControl = new TransformControls(scene.camera, scene.renderer.domElement);
    transformControl.attach(model);
    scene.scene.add(transformControl);

    // Set up GUI for model-specific controls
    const gui = new dat.GUI();
    const modelFolder = gui.addFolder(fileName); // Use model file name as the GUI name

    // Example: Adjust model scale
    const scaleControl = modelFolder.add(model.scale, 'x', 0.1, 2).name('Scale X');
    scaleControl.onChange(() => {
        // Do something when scale changes
    });

    // Example: Adjust model brightness if material exists and has emissiveIntensity property
    if (model.material && model.material.emissiveIntensity !== undefined) {
        const brightnessControl = modelFolder.add(model.material, 'emissiveIntensity', 0, 2).name('Brightness');
        brightnessControl.onChange(() => {
            // Do something when brightness changes
        });
    } else {
        console.error(`${fileName} does not have a material with emissiveIntensity property.`);
    }

    // Example: Adjust model position
    const positionFolder = modelFolder.addFolder('Position');
    positionFolder.add(model.position, 'x', -50, 50).name('X').onChange(() => {
        // Do something when X position changes
    });
    positionFolder.add(model.position, 'y', -50, 50).name('Y').onChange(() => {
        // Do something when Y position changes
    });
    positionFolder.add(model.position, 'z', -50, 50).name('Z').onChange(() => {
        // Do something when Z position changes
    });

    // Example: Adjust model rotation
    const rotationFolder = modelFolder.addFolder('Rotation');
    rotationFolder.add(model.rotation, 'x', 0, Math.PI * 2).name('X').onChange(() => {
        // Do something when X rotation changes
    });
    rotationFolder.add(model.rotation, 'y', 0, Math.PI * 2).name('Y').onChange(() => {
        // Do something when Y rotation changes
    });
    rotationFolder.add(model.rotation, 'z', 0, Math.PI * 2).name('Z').onChange(() => {
        // Do something when Z rotation changes
    });

    // Event listeners for moving, rotating, etc.
    transformControl.addEventListener('dragging-changed', (event) => {
        scene.orbitControl.enabled = !event.value;
    });

    // Add other event listeners as needed

    return transformControl; // Return the transform control for external manipulation if necessary
}
