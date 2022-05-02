const zmq = require('zeromq');

const app = async ()=> {
  const socket = new zmq.Reply;

  await socket.bind("tcp://127.0.0.1:5555");

  while(true){
    const [message] = await socket.receive();
    console.log(`Received request: ${message.toString()}`);
    socket.send("World");
  }
}

app();