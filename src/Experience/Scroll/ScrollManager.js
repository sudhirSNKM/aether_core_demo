import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Experience from '../Experience.js'

export default class ScrollManager {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.world = this.experience.world

        gsap.registerPlugin(ScrollTrigger)

        // Wait for world to be ready
        if (this.world.heroObject) {
            this.setupScrollAnimations()
        }
        else {
            // Fallback or retry? World creates objects synchronously so it should be fine.
        }
    }

    setupScrollAnimations() {
        const hero = this.world.heroObject
        const group = hero.group
        const core = hero.coreMesh
        const shells = [hero.shell1Mesh, hero.shell2Mesh]
        const particles = hero.particles

        // INITIAL STATE
        // Start small and invisible?
        core.scale.set(0, 0, 0)
        shells.forEach(s => s.scale.set(0, 0, 0))
        particles.forEach(p => p.scale.set(0, 0, 0))

        // Intro Animation (independent of scroll, runs on load)
        const introTl = gsap.timeline()
        introTl.to(core.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" })
        introTl.to(shells.map(s => s.scale), { x: 1, y: 1, z: 1, duration: 1, stagger: 0.2 }, "-=1")
        introTl.to(particles.map(p => p.scale), { x: 1, y: 1, z: 1, duration: 0.5, stagger: 0.05 }, "-=0.5")

        // Hide loader
        introTl.to('#calibrating', {
            opacity: 0, duration: 0.5, onComplete: () => {
                document.querySelector('#calibrating').style.display = 'none'
            }
        })


        // SCROLL SECTIONS

        // 1. Reveal -> Exploration (Section 1 -> 2)
        // 1. Reveal -> About (Section 1 -> 2)
        // Gentle rotation for reading
        gsap.to(group.rotation, {
            y: Math.PI * 0.5,
            scrollTrigger: {
                trigger: "#section-reveal",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            }
        })

        // 2. About -> Explore
        // Flip object
        gsap.to(group.rotation, {
            x: Math.PI * 0.2,
            z: Math.PI * 0.2,
            scrollTrigger: {
                trigger: "#section-about",
                start: "bottom bottom",
                end: "bottom top",
                scrub: 1.5
            }
        })

        // 3. Explore -> Products
        // Move object to side to make room for grid
        gsap.to(group.position, {
            x: 2, // Move right
            scrollTrigger: {
                trigger: "#section-explore",
                start: "bottom center",
                end: "bottom top",
                scrub: 1.5
            }
        })

        // Bring back to center for Transform
        gsap.to(group.position, {
            x: 0,
            scrollTrigger: {
                trigger: "#section-products",
                start: "center center",
                end: "bottom top",
                scrub: 1.5
            }
        })

        // 3. Transformation (Section 3)
        // Explode particles!
        // We move particles away from center
        particles.forEach((p, i) => {
            const originalPos = p.userData.originalPos
            const direction = originalPos.clone().normalize()
            const targetPos = direction.multiplyScalar(5) // Explode outwards

            gsap.to(p.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                scrollTrigger: {
                    trigger: "#section-transform",
                    start: "top bottom",
                    end: "center center",
                    scrub: 1
                }
            })

            // Rotate particles wildly
            gsap.to(p.rotation, {
                x: Math.PI * 2,
                y: Math.PI * 2,
                scrollTrigger: {
                    trigger: "#section-transform",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            })
        })

        // Change Core Color
        gsap.to(hero.coreMaterial.color, {
            r: 0, g: 243 / 255, b: 255 / 255, // Turn to Cyan
            scrollTrigger: {
                trigger: "#section-transform",
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        })

        // 4. Meaning (Section 4) -> Finale
        // Reassemble or Morph? 
        // Let's reassemble into a ring maybe? Or just fallback.

        // Let's make the shells expand huge
        gsap.to(shells.map(s => s.scale), {
            x: 5, y: 5, z: 5,
            opacity: 0,
            scrollTrigger: {
                trigger: "#section-meaning",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        })

        // 5. Finale (Section 5)
        // Camera zooms in dramatically into the core?
        gsap.to(this.camera.position, {
            z: 2,
            scrollTrigger: {
                trigger: "#section-finale",
                start: "top bottom",
                end: "center center",
                scrub: 2
            }
        })

        // UI Handling - Fade in/out glass panels
        const panels = document.querySelectorAll('.glass-panel')
        panels.forEach((panel) => {
            gsap.to(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: "top 80%",
                    toggleClass: "active",
                    onEnter: () => panel.parentElement.classList.add('visible'),
                    onLeaveBack: () => panel.parentElement.classList.remove('visible')
                }
            })
        })
    }
}
