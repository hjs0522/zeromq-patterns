const zmq = require("zeromq");

const randrange = (start,end) =>{
  return Math.floor(Math.random()*(end-start+1)+start);
}

const app = async () =>{
  print("Publishing updates at weather server...");
  const socket = new zmq.Publisher;
  await socket.bind("tcp://127.0.0.1:5556");
  while(true){
    const zipcode = randrange(1,100000);
    const temperature = randrange(-80,135);
    const relhumidity = randrange(10,60);

    await socket.send([zipcode,temperature,relhumidity]);
  }
}

app();