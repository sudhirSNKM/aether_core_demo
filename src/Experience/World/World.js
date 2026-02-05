import Experience from '../Experience.js'
import Environment from './Environment.js'
import HeroObject from './HeroObject.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Setup
        this.heroObject = new HeroObject()
        this.environment = new Environment()
    }

    update() {
        if (this.heroObject)
            this.heroObject.update()
    }
}
