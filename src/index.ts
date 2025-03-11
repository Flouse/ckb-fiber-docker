// figlet the project name
console.log(
  require("figlet").textSync(require("../package.json").name)
);


import { FiberRPC } from "./rpc/client";
const rpc = new FiberRPC("http://localhost:58227");

// call get node info
const nodeInfo = await rpc.getNodeInfo();
console.log("Node Info:", nodeInfo);
