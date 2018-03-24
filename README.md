# IP Poker

Systematically sends `GET` request to every IP address, looking for `200` response.

## Set up

This is a Node.js application. Go [download Node.js](https://nodejs.org/en/download/)!

Make sure you have both `node` and `npm` (which comes with `node`):
```
 node -v
 npm -v
 ```

Install all necessary dependencies:
```
npm install
```

## Use

Configure where the IP Poker should start inside of `backend/config.js`. 

For example ...

```
module.exports.startIP = {
    byteOne:    136,
    byteTwo:    57,
    byteThree:  36,
    byteFour:   148
}
```

... starts at `136.57.36.148` and moves onto `136.57.36.149`, then `136.57.36.150`, etc.

Legitimate values of a byte range from `0`- `255`. Once a byte reaches `255`, it rolls back to `0`( `1.0.0.255` rolls to `1.0.1.0`).

Once a start IP is set, start the node server to start the scan:
```
npm start
``` 

## Results

Results are saved in `results/ip_results.txt`. 

**`ip_results.txt` FILE IS WIPED EVERY TIME THE SCAN IS STARTED**, so back up results.  


_Known bug: IP addresses [1.1.78.198 - 1.1.78.201] throw an uncaught error, killing the scan_