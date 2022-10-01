// const readline = require("readline").createInterface({
//     input:process.stdin,
//     output:process.stdout
// })

// readline.question("Enter num1?", a =>{
//     // console.log(`hello ${name}`)
//     readline.question("Enter number 2?",b=>{
//         console.log(parseInt(a)+parseInt(b))
//         readline.close()
//     })
// })
import chalk from 'chalk';

const error = chalk.bold.red;
const info = chalk.bold.green;
// const name = 'Sindre';
// console.log(chalk.green('Hello %s'), name);

import readline from "readline"

function readData(question){
    const inputStream = readline.createInterface({
        input:process.stdin,
        output:process.stdout
    })
    return new Promise((resolve, reject)=>{
        inputStream.question(question, val => {
            inputStream.close()
            const numVal = Number(val)
            if(isNaN(numVal)){
                reject(`Non number given ${val}`)
            }
            resolve(numVal)
        })
    })    
}

async function addInLoop(){
    let total = 0
    for(let i=0;i<5;i++){
        try {
            total += await readData(`Enter num ${i+1}\n`)            
        } catch (e) {
            console.log(error(e))
        }
    }
    // console.log(total)
    console.log(info(total))
}

addInLoop()
// console.log("Outside")