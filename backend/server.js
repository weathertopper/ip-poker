'use strict';

const express = require('express');
const body_parser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const file_man = require('./file-man');
const config = require('./config');
const internet_available = require('internet-available')

// Constants
const PORT = 3001;
const HOST = '127.0.0.1';

// App
const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

const ip_lookup_start = (one, two, three, four) => {
    const ip_as_arr = [one, two, three, four];
    for (let byte in ip_as_arr){
        if ( byte < 0 || byte >= 256){
            console.error("INVALID START IP, KILLING APP", ip_as_arr)
            process.exit(0);
        }
    }
    ip_lookup(ip_as_arr)
}


//  Doing this recursively to avoid heap memory death (and bc I'm Captain Recursion)

const ip_lookup = (ip_as_arr) => {

    if (!ip_as_arr){
        return  //  quit if no ip address
    }

    const timeout = 1000;
    const retry = 5000;
    const google_addr = 'http://www.google.com'

    axios.get(google_addr, {timeout: retry})
        .then( (resp) => {
            // console.log("Internet available");
            const one = ip_as_arr[0]
            const two = ip_as_arr[1]
            const three = ip_as_arr[2]
            const four = ip_as_arr[3]
            /**
             * Reserved:
             * 10.0.0.0 - 10.255.255.255
             * 172.16.0.0 - 172.31.255.255
             * 192.168.0.0 - 192.168.255.255
            */

            if (one == 10){
                //    skip, reserved
                const next_ip = get_next_ip(one, two, three, four)
                ip_lookup(next_ip);
            }
            if (one == 172 && two >= 16 && two <= 31){
                //    skip, reserved
                const next_ip = get_next_ip(one, two, three, four)
                ip_lookup(next_ip);
            }
            if (one == 192 && two == 168){
                //    skip, reserved
                const next_ip = get_next_ip(one, two, three, four)
                ip_lookup(next_ip);
            }
            const url = "http://" + one + "." + two + "." + three + "." + four;
            axios.get(url, {timeout: timeout})
                .then( (resp) => {
                    const message =  url;
                    console.log("YES: " + url)
                    file_man.writeFile(file_name, message)
                    const next_ip = get_next_ip(one, two, three, four)
                    ip_lookup(next_ip);
                })
                .catch( (err) => {
                    console.log("NO  : " + url)
                    const next_ip = get_next_ip(one, two, three, four)
                    ip_lookup(next_ip);
                })
        })
        .catch((err) => {
            setTimeout( () => {
                ip_lookup(ip_as_arr)
            }, retry)
        });
}

//  lazy easy way to do this checking

const get_next_ip = (one, two, three, four) => {
    four += 1;
    if (four == 256){
        four = 0;
        three += 1;
        if (three == 256){
            three = 0;
            two += 1;
            if (two == 256) {
                two = 0;
                one += 1
                if (one == 256) {
                    return false;
                }
            }
        }
    }
    return [one, two, three, four];
}

const file_name = "../results/ip_results.txt";
file_man.clearFile(file_name);

const startIP = config.startIP;

ip_lookup_start(    startIP.byteOne,
                    startIP.byteTwo,
                    startIP.byteThree,
                    startIP.byteFour);