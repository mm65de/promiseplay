// This small script can be used to test the behavior of 
// the promises in JavaScript.

// Helper methods used by logging:
const start = Date.now();
function ms() {
    const current = Date.now();
    return ((current - start)/1000).toFixed(3).padStart(7);
}
function consoleLog(msg) {
    console.log(ms() + "  " + msg);
}

// If msecs is 0 or less, then just return the token.
// Otherwise build and return a promise that returns token 
// after msecs milliseconds. 
// The argument of parameter succeed controls if the first
// or the second callback (that was passed to the method 
// passed to the constructor of the new promise) 
// is called after the wait time.
function promiseBuilder(token, msecs, succeed) {
    return msecs <= 0 ? token : new Promise (
        async (resolve, reject) => {
            consoleLog("> promise " + token);
            await new Promise(r => setTimeout(r, msecs));
            consoleLog("< promise " + token);
            if (succeed) {
                resolve(token);
            } else {
                reject(token);
            }
        }
    );
}

// Build a callback function, that returns pToken, if 
// msecs is 0 or less or returns a promise built from the 
// arguments pToken, msecs and succeed.
function callbackBuilder(cbToken, pToken, msecs, succeed) {
    return (v) => {
        consoleLog("callback " + cbToken + " got " + v);
        return promiseBuilder(pToken, msecs, succeed);
    }
}

const pB = promiseBuilder;
const cB = callbackBuilder;

const c1 = cB("c1", "p1", 3000, false);
const c2 = cB("c2", "p2", 4000, true);
const c3 = cB("c3", "p3", 5000, false);
const c4 = cB("c4", "p4", 6000, true);
const c5 = cB("c5", "f5", 0);
const c6 = cB("c6", "f6", 0);

pB("p", 2000, true).then(c1, c2).then(c3, c4).then(c5, c6);
consoleLog("ready");
