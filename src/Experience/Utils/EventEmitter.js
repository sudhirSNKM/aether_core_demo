export default class EventEmitter {
    constructor() {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(_names, callback) {
        // Errors
        if (typeof _names === 'undefined' || _names === '') {
            console.warn('wrong names')
            return false
        }

        if (typeof callback === 'undefined') {
            console.warn('wrong callback')
            return false
        }

        // Resolve names
        const names = _names.split(' ')

        // Each name
        names.forEach((_name) => {
            // Resolve name
            if (typeof this.callbacks[_name] === 'undefined')
                this.callbacks[_name] = {}

            // Each callback
            if (typeof this.callbacks[_name].namespace === 'undefined')
                this.callbacks[_name].namespace = {}

            if (typeof this.callbacks[_name].namespace.base === 'undefined')
                this.callbacks[_name].namespace.base = []

            this.callbacks[_name].namespace.base.push(callback)
        })

        return this
    }

    trigger(_name, _args) {
        // Errors
        if (typeof _name === 'undefined' || _name === '') {
            console.warn('wrong name')
            return false
        }

        let finalName = _name.replace(/[^a-zA-Z0-9]/g, '')

        // Default args
        if (!(_args instanceof Array)) {
            _args = []
        }

        // Resolve names
        if (typeof this.callbacks[finalName] !== 'undefined') {
            if (typeof this.callbacks[finalName].namespace.base !== 'undefined') {
                this.callbacks[finalName].namespace.base.forEach(function (callback) {
                    callback.apply(this, _args)
                })
            }
        }
    }
}
