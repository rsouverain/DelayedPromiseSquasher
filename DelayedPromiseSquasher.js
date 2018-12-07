/**
 * Will resolve your last pushed callback after a small delay without new push
 * Using this, you can push a spam of consuming task.
 * Only the last one to be pushed will be executed after a small delay with no more push are made.
 */
class DelayedPromiseSquasher {
    constructor (delayMs = 450) {
        this._delayMs = delayMs
        this._isEnabled = true
        this._lastCallableRandId = null
        this._sequence = 0
    }

    get isEnabled () {
        return this._isEnabled
    }
    set isEnabled (v) {
        this._isEnabled = v
    }

    /**
     * Add a callback function to be called after a delay has elapsed.
     * After the delay elapsed and if another callback has been pushed in between, callable will not be called.
     * After the delay elapsed and if no other callback has been pushed in between, callable will be called.
     * @param {function} callable
     * @param {boolean} force
     * @returns {Promise<null|*>}
     */
    push (callable, force = false) {
        if (!force && !this.isEnabled) {
            sayServiceDisabled(this)
            return Promise.reject()
        }
        if (typeof callable === 'function') {
            const now = new Date()
            const _seq = this._sequence + 0.01
            this._sequence = _seq
            let wrappedPromise = new Promise((resolve, reject) => {
                resolve({callable, date: now, sequence: _seq})
            })
            return wrappedPromise
                .then(delayPromise(this._delayMs))
                .then((delayed) => {
                    // console.warn('DELAYED ', delayed)
                    if (!force && !this.isEnabled) {
                        sayServiceDisabled(this)
                    } else if (force || (this.isEnabled && delayed.sequence === this._sequence)) {
                        this._sequence = null
                        return delayed.callable()
                    }
                    return Promise.resolve(null)
                })
        } else {
            console.error('callable must be a function')
        }
        return Promise.reject()
    }
}

const delayPromise = function (duration) {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(...args)
            }, duration)
        })
    }
}

const sayServiceDisabled = function (context) {
    console.error('Service is disabled (DelayedPromiseSquasher) ', context)
}

module.exports = DelayedPromiseSquasher
