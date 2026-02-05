import * as THREE from 'three'
import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, 6)

        // Initial Mobile Check
        if (this.sizes.width / this.sizes.height < 1) {
            this.instance.position.z = 9
        }

        this.scene.add(this.instance)
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()

        // Adjust FOV or Position for mobile
        if (this.instance.aspect < 1) {
            this.instance.position.z = 9 // Move back on mobile portait
        } else {
            this.instance.position.z = 6
        }
    }

    update() {
        // Update logic if needed (e.g. lookAt)
    }
}
