const zmq = require("zeromq");

const randrange = (start,end) =>{
  return Math.floor(Math.random()*(end-start+1)+start);
}

const app = async () =>{
  const sub = new zmq.Subscriber;
  sub.connect("tcp://127.0.0.1:5557");
  sub.subscribe("");
  sub.receiveTimeout = 100;
  const pub = new zmq.Push;
  pub.connect("tcp://127.0.0.1:5558");

  while(true){
    await sub.receive().then((msg)=>{
      console.log("I: received message ", msg);
    },()=>{
      let rand = randrange(1,100);
      if (rand<10){
        pub.send(rand);
        console.log("I: sending message",rand);
      }
    });
  }
}

app();