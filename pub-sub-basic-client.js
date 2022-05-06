const zmq = require("zeromq");

const getZipFilter = (argv) =>{
  return argv.length >2 ? argv[2] : "10001"; 
}

const app = async ()=>{
  const socket = zmq.Subscriber;

  console.log("Collecting updates from weather server...");
  await socket.connect("tcp://127.0.0.1:5556");

  // pub 가 뿌리는 정보 중 내가 원하는 정보만 받음
  const zip_filter = getZipFilter(process.argv);
  socket.subscribe(zip_filter);

  let total_temp = 0;
  let cnt = 0;
  for await (const [zipcode,temperature,relhumidity] of socket){
    if (cnt ===20)
      break;
    total_temp += temperature;
    console.log(`Receive temperature for zipcode ${zip_filter} was ${temperature} F`);
    cnt+=1
  }
  console.log(`Average temperature for zipcode ${zip_filter} was ${totla_temp / (cnt)}`)
}

app();