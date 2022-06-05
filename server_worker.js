const {parentPort, workerData} = require('worker_threads')
const zmq = require("zeromq")
class ServerWorker{
    constructor(_id){
        this.id = _id
    }
    async run(){
        const dealerSocket = new zmq.Dealer
        await dealerSocket.connect("inproc://backend")
        console.log(`Worker# ${this.id} started`)
        for await (const [ident, msg] of dealerSocket) {
            console.log(`Worker# ${this.id} received ${msg.toString()} from ${ident.toString()}`);
            await dealerSocket.send([ident.toString(), msg.toString()])
        }
    }
}

const app = function(){
    worker = new ServerWorker(workerData)
    worker.run()
    console.log(`${workerData} maked!`);
}

app()