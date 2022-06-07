const zmq = require('zeromq');

class ClientTask{
  constructor(_id){
    this.id = _id;
  }

  async run(){
    const dealerSocket = new zmq.Dealer;
    const ident = this.id;
    dealerSocket.routingId = String(ident);
    dealerSocket.connect("tcp://127.0.0.1:5570");
    dealerSocket.receiveTimeout = 500;
    console.log(`Client ${ident} started`);

    let cnt = 0;
    while(true){
      cnt +=1;
      console.log(`REQ # ${cnt} send ...`);
      dealerSocket.send(`request # ${cnt.toString()}`);
      await new Promise(resolve=> setTimeout(resolve,1000))
      const success = msg =>{
        console.log(`${ident} received: ${msg.toString()}`)
      }
      const fail = msg =>{

      }
      dealerSocket.receive().then(success,fail)
    }
  }
}

const app = () =>{
  const client = new ClientTask(process.argv[2]);
  client.run();
}

app();