# JavaScript Promises Playground
The sample script **`promises.js`** can be used as a starting point to experiment with the promises provided by JavaScript.
Just execute `node promises.js` and watch the results.

Reliable information about promises can be found in the [mdn web docs](https://developer.mozilla.org/). Usefull are especially these three chapters:
1. [How to use promises](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
2. [How to implement a promise-based API](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Implementing_a_promise-based_API)
3. [Promise Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

A short introduction with examples can be found at the great site of the [W3Schools](https://www.w3schools.com/about/default.asp):
1. [JavaScript Promises](https://www.w3schools.com/js/js_promise.asp)

## Helper Functions
The script `promises.js` first declares some helper functions. 
The functions `ms()` and `consoleLog()` are for logging purposes only.

 More interesting are the functions `promiseBuilder(token, msecs, succeed)` and the `callbackBuilder(cbToken, pToken, msecs, succeed)`.

 ### promiseBuilder(token, msecs, succeed)

This function provides an easy way to construct a sample promise.
That sample promise only waits `msecs` milliseconds before it returns `token`.
If `msecs` is `0` or smaller only `token` is returned instead of a newly created promise. In both cases the promiseBuilder returns immediately. The wait time is only applied by the promise, i. e. before the promise returns the token.

Together with the promise the `promiseBuilder` internally creates a function that is passed to the constructor of the promise. This function expects two callbacks. If `succeed` is `true`, then the first callback is called, otherwise the second callback is called. Before calling one of the two callbacks, the internal function sleeps `msecs` milliseconds.

On the promise returned by the `promiseBuilder` function you can call the method `then(callback)`. This method expects a callback function. To create that you can use the `callbackBuilder` function described by the next chapter.

 ### callbackBuilder(cbToken, pToken, msecs, succeed)

This function creates the callback that you can pass to the method `then` of the promise.
The first parameter `cbToken` is only used for logging and shows when the callback is actually called.
The following three arguments are used to construct a promise that is returned by the callback.
If `msecs` is `0` or smaller, then no promise is constructed. Instead of the promise the callback function returns the `token` directly in that case.

### Short Aliases `pB` and `cB`
The constants `pB` and `cB` are just short aliases for the longer names `promiseBuilder` and `callbackBuilder`.

## Example Explained

Consider the following code snippet:

    const c1 = cB("c1", "p1", 3000, false);
    const c2 = cB("c2", "p2", 4000, true);
    const c3 = cB("c3", "p3", 5000, false);
    const c4 = cB("c4", "p4", 6000, true);
    const c5 = cB("c5", "f5", 0);
    const c6 = cB("c6", "f6", 0);
    
    pB("p", 2000, true).then(c1, c2).then(c3, c4).then(c5, c6);
    consoleLog("ready");

If you execute this snippet e. g. by executing this line from a command shell

    node promisetest.js

then you probably get a result similar to the following:

      0.000  > promise p
      0.004  ready
      2.007  < promise p
      2.007  callback c1 got p
      2.007  > promise p1
      5.014  < promise p1
      5.015  callback c4 got p1
      5.015  > promise p4
     11.017  < promise p4
     11.017  callback c5 got p4

So let's see what happens step by step:

1. First the callbacks `c1` to `c6` are constructed but not executed so far. Therefore there is still no logging by them.

2. The `promiseBuilder` function is called via the alias `pB`. The `msecs` is greater than `0`, so a new promise instance is created and an internal function is created. 

3. The internal function is called and two function proxies `resolve` and `reject` are passed in.

4. The internal function is executed until the `await` statement. This leads to the first logging at `0.000`.

5. At this point the constructor of the Promise returns and also the call to the `promiseBuilder` returns to its caller.

6. The chain of the `then` calls are executed, but the passed callbacks are not called so far (hence no logging).

7. The last line of the script is reached, therefore at `0.004` you see the logging `ready`.

8. About two seconds later the `await` statement comes to an end because the Promise it is waiting for gets resolved.

9. At `2.007` you get the logging `< promise p`.

10. Because `succeed` is `true` the callback `resolve` is called and not `reject`. The token `p` is passed to this call of `resolve()`.

11. This call to `resolve()` triggers the call of the callback `c1`, that was registered for that case about two seconds before.

12. At `2.007` you get the logging `callback c1 got p` that indicates that the registered callback `c1` is really called now, and you also see, that the value `p` is passed in, that was passed to the function `resolve()` before.

13. Now the promise `p1` is constructed inside of the callback `c1`. It is constructed with a wait time of 3 seconds and should then call the method `reject` (because `succeed` is `false`).

14. Because of the construction of the promise `p1` you get the logging `> promise p1` at `2.007`.

15. The next three seconds does not happen anything. That's the wait time of promise `p1`.

16. After that wait time the `await` statement comes to an end, the logging at `5.014` takes place and then, because the argument of parameter `succeed` was `false`, the *second* callback of the promise `p1` is called. This is callback `c4`, hence the logging at `5.015`.

17. Inside of the callback `c4` the promise `p4` is constructed with a wait time of 6 seconds and `succeed = true`.

18. After this wait time the `await` statement of promise `p4` comes to an end, it logs at `11.017` two lines, the latter indicating that the callback `c5` is called.

19. The callback `c5` does not create a further promise but returns the passed token `p4` directly. Then the program ends.
