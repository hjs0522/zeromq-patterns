const zmq = require('zeromq');

const app = async () =>{
  console.log("Connecting to hello world server...");
  const socket = new zmq.Request;
  socket.connect(process.env.ZMQ_CLIENT_ADDRESS);

  for(let request = 0;request<10;request++){
    console.log(`Sending request ${request}`);
    socket.send("Hello");

    const message = await socket.receive();
    console.log(`Received reply ${request} [ ${message.toString()} ]`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

app();