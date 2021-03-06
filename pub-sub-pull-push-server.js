const zmq = require("zeromq");

const app = async () =>{
  const pub = new zmq.Publisher;
  await pub.bind("tcp://127.0.0.1:5557");
  const collector = new zmq.Pull;
  await collector.bind("tcp://127.0.0.1:5558");

  while(true){
    const message = (await collector.receive()).toString()
    console.log(`I: publishing update ${message}`);
    pub.send(message);
  }
}

app();