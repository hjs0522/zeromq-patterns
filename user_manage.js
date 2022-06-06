const {parentPort, workerData} = require('worker_threads');
const zmq = require("zeromq");

class ServerWorker{
    constructor(){
    }
    async run(){
        this.user_manager_nameserver(workerData.local_ip_addr, workerData.port_subscribe);
    }
    async user_manager_nameserver(local_ip_addr, port_subscribe){
        const user_db = [];
        const reply = new zmq.Reply;
        await reply.bind(`tcp://${local_ip_addr}:${port_subscribe}`);
        console.log(`local p2p db server activated at tcp://${local_ip_addr}:${port_subscribe}`);
        while(true){
            const req = await reply.receive().toString().split(":");
            user_db.push(req);
            console.log(`user registration ${req[1]} from ${req[0]}.`);
            reply.send("ok");
        }
    }
}


const app = function(){
    worker = new ServerWorker()
    worker.run()
}

app();