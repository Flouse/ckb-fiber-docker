declare module 'fiber' {
  // export interface IFiberApplication {
  //   listen(port: number): void;
  //   use(middleware: IMiddleware): void;
  //   get(path: string, handler: IRouteHandler): void;
  //   post(path: string, handler: IRouteHandler): void;
  //   put(path: string, handler: IRouteHandler): void;
  //   delete(path: string, handler: IRouteHandler): void;
  // }

  export interface IContext {
    params: { [key: string]: string };
    query: { [key: string]: string };
    body: any;
    headers: { [key: string]: string };
    status(code: number): IContext;
    json(data: any): void;
    send(data: string): void;
  }

  export interface MultiAddr {
    id: string;
    protocol: string;
    address: string;
    port?: number;
  }

  export interface GraphNode {
    addresses: Array<string> // TODO: Array<MultiAddr>;
    node_id: string
    timestamp: string
    chain_hash: string
    auto_accept_min_ckb_funding_amount: string
    udt_cfg_info: Array<UdtCfgInfo>
  }

  export interface Script {
    code_hash: string
    hash_type: CKBComponents.ScriptHashType
    args: string
  }
}
