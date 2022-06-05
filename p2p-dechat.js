const zmq = require('zeromq');
const {Worker} = require('worker_threads');
const ip = require('ip');

const search_nameserver = async (ip_mask, local_ip_addr, port_nameserver) =>{
  const req = new zmq.Subscriber
  res = ""
  for (let last = 1 ; last < 255; last++){
      let target_ip_addr = `tcp://${ip_mask.toString()}.${last.toString()}:${port_nameserver}`;

      if(target_ip_addr != local_ip_addr || target_ip_addr == local_ip_addr){
          req.connect(target_ip_addr)
      }
      req.receiveTimeout = 200
      req.subscribe("NAMESERVER")
      await req.receive().then((msg)=>{
          res = msg.toString().split(":")[1]
      }, (error) => {
          res = ""
      })
      if (res != ""){
          return res
      }
  }
}

const get_local_ip = ()=>{
  return ip.address()
}

const app = async (argv)=>{
  let ip_addr_p2p_server = ""
  const port_nameserver = 9001
  const port_chat_publisher = 9002
  const port_chat_collector = 9003
  const port_subscribe = 9004

  const user_name = argv[2]
  const ip_addr = get_local_ip()
  const splited_addr = ip_addr.split(".")
  splited_addr.pop()
  const ip_mask = splited_addr.join(".")

  console.log("searching for p2p server .")

  const name_server_ip_addr = await search_nameserver(ip_mask, ip_addr, port_nameserver)
  if(!name_server_ip_addr){
      ip_addr_p2p_server = ip_addr
      console.log("p2p server is not found, and p2p server mode is activated.")
      new Worker("./beacon_worker.js", {workerData : {local_ip_addr:ip_addr, port_nameserver:port_nameserver}})
      console.log("p2p beacon server is activated.")
      new Worker("./user_manage_worker.js", {workerData : {local_ip_addr:ip_addr, port_subscribe:port_subscribe}})
      console.log("p2p subsciber database server is activated.")
      new Worker("./relay_worker.js", {workerData : {local_ip_addr:ip_addr, port_chat_publisher:port_chat_publisher, port_chat_collector:port_chat_collector}})
      console.log("p2p message relay server is activated.")
  }
  else{
      ip_addr_p2p_server = name_server_ip_addr
      console.log("p2p server found at" + ip_addr_p2p_server + ", and p2p client mode is activated.")
  }

  console.log("starting user registration procedure.")

  const p2p_rx = new zmq.Subscriber
  p2p_rx.subscribe("RELAY")
  p2p_rx.receiveTimeout = 100
  await p2p_rx.connect("tcp://"+ip_addr_p2p_server+":"+port_chat_publisher)
  const p2p_tx = new zmq.Push
  await p2p_tx.connect("tcp://"+ip_addr_p2p_server+":"+port_chat_collector)
  
  console.log("starting autonomous message transmit and receive scenario. ")

  while(true){
      await p2p_rx.receive().then((raw_message)=>{
          const message = raw_message.toString().split(":")
          console.log("p2p-recv::<<==", message[1] + ":" + message[2])
      }, (error)=>{

      })
      await new Promise(resolve=>setTimeout(resolve, 3000))
      let randomInt = getRandomInt(1, 100)
      if (randomInt < 10){
          msg = "(" + user_name + "," + ip_addr + ":ON)"
          p2p_tx.send(msg)
          console.log("p2p-send::==>>", msg)
      }
      else if (randomInt > 90){
          msg = "(" + user_name + "," + ip_addr + ":OFF)"
          p2p_tx.send(msg)
          console.log("p2p-send::==>>", msg)
      }
  }

  function getRandomInt(min, max) {
      return parseInt(Math.random() * (max - min) + min)
  }

  const randrange = (start,end) =>{
    return Math.floor(Math.random()*(end-start+1)+start);
  }
}

app(process.argv)