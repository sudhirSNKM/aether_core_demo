import * as THREE from 'three'
import Experience from '../Experience.js'

export default class HeroObject {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.group = new THREE.Group()
        this.meshGroup = new THREE.Group()
        this.group.add(this.meshGroup)
        this.scene.add(this.group)

        this.sizes = this.experience.sizes
        this.cursor = { x: 0, y: 0 }

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5
        })

        window.addEventListener('touchmove', (event) => {
            const touch = event.touches[0]
            this.cursor.x = touch.clientX / this.sizes.width - 0.5
            this.cursor.y = touch.clientY / this.sizes.height - 0.5
        }, { passive: true })

        this.setMaterial()
        this.setGeometry()
    }

    setMaterial() {
        // Core Material - Dark shiny metal
        this.coreMaterial = new THREE.MeshStandardMaterial({
            color: '#111111',
            metalness: 0.9,
            roughness: 0.2,
        })

        // Outer Shell - Glassy/Ghostly
        this.shellMaterial = new THREE.MeshPhysicalMaterial({
            color: '#00f3ff',
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            transparent: true,
            opacity: 0.5,
            wireframe: false
        })

        // Particles
        this.particleMaterial = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            wireframe: true
        })
    }

    setGeometry() {
        // 1. Central Core
        this.coreGeometry = new THREE.IcosahedronGeometry(1, 0)
        this.coreMesh = new THREE.Mesh(this.coreGeometry, this.coreMaterial)
        this.coreMesh.castShadow = true
        this.coreMesh.receiveShadow = true
        this.meshGroup.add(this.coreMesh)

        // 2. Outer Shells (Rings)
        this.shell1Geometry = new THREE.TorusGeometry(1.5, 0.02, 16, 100)
        this.shell1Mesh = new THREE.Mesh(this.shell1Geometry, this.shellMaterial)
        this.meshGroup.add(this.shell1Mesh)

        this.shell2Geometry = new THREE.TorusGeometry(1.8, 0.02, 16, 100)
        this.shell2Mesh = new THREE.Mesh(this.shell2Geometry, this.shellMaterial)
        this.shell2Mesh.rotation.x = Math.PI * 0.5
        this.meshGroup.add(this.shell2Mesh)

        // 3. Floating Bits (for explosion effect)
        this.particles = []
        const particleCount = 20
        const particleGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)

        for (let i = 0; i < particleCount; i++) {
            const mesh = new THREE.Mesh(particleGeometry, this.coreMaterial)

            // Random position on sphere surface
            const radius = 1.2
            const phi = Math.acos(-1 + (2 * i) / particleCount)
            const theta = Math.sqrt(particleCount * Math.PI) * phi

            mesh.position.setFromSphericalCoords(radius, phi, theta)

            // Store original pos for morphing
            mesh.userData.originalPos = mesh.position.clone()
            // Random rotation
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)

            this.particles.push(mesh)
            this.meshGroup.add(mesh)
        }
    }

    update() {
        const parallaxX = this.cursor.x * 0.5
        const parallaxY = - this.cursor.y * 0.5

        // Smooth dampening
        this.meshGroup.rotation.x += (parallaxY - this.meshGroup.rotation.x) * 0.1
        this.meshGroup.rotation.y += (parallaxX - this.meshGroup.rotation.y) * 0.1

        // Idle Animation
        const t = this.time.elapsed * 0.001

        // Constant slow rotation

        // Constant slow rotation
        this.coreMesh.rotation.y = t * 0.2
        this.coreMesh.rotation.z = t * 0.05

        this.shell1Mesh.rotation.y = t * 0.1
        this.shell1Mesh.rotation.x = Math.sin(t * 0.5) * 0.2

        this.shell2Mesh.rotation.x = (Math.PI * 0.5) + Math.cos(t * 0.3) * 0.2
        this.shell2Mesh.rotation.y = t * 0.15

        // Particles 'breathe'
        for (const particle of this.particles) {
            particle.rotation.x += 0.01
            particle.rotation.y += 0.01
        }
    }
}
