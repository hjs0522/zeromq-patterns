const zmq = require('zeromq');

const app = async ()=> {
  const socket = new zmq.Reply;

  await socket.bind(process.env.ZMQ_SERVER_ADDRESS);

  while(true){
    const [message] = await socket.receive();
    console.log(`Received request: ${message.toString()}`);
    socket.send("World");
  }
}

app();