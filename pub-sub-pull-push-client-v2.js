const zmq = require("zeromq");

const randrange = (start,end) =>{
  return Math.floor(Math.random()*(end-start+1)+start);
}

const app = async () =>{
  const sub = new zmq.Subscriber;
  sub.subscribe("");
  sub.connect("tcp://127.0.0.1:5557");
  sub.receiveTimeout=100;
  const pub = new zmq.Push;
  pub.connect("tcp://127.0.0.1:5558");

  const clientID = process.argv[2];
  while(true){
    await sub.receive().then((msg)=>{
      console.log(`${clientID}: receive status => ${msg}`);
    },()=>{
      let rand = randrange(1,100);
      if(rand<10){
        msg = `(${clientID}:ON)`;
        pub.send(msg);
        console.log(`${clientID}: send status - activated`);
      }
      else if(rand > 90){
        msg = `(${clientID}:OFF)`;
        pub.send(msg);
        console.log(`${clientID}: send status - deactivated`);
      }
    });
  }
}

app();