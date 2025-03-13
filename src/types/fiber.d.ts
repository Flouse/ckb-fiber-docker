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

  export interface Channel {
    channel_id: string;
    peer_id: string;
    is_public: boolean;
    channel_outpoint?: CKBComponents.OutPoint; // TODO
    funding_udt_type_script?: Script;
    state: ChannelState;
    local_balance: string;
    remote_balance: string;
    offered_tlc_balance: string;
    received_tlc_balance: string;
    latest_commitment_transaction_hash?: string;
    created_at: string;
    enabled: boolean;
    tlc_expiry_delta: string;
  }

  export interface ChannelStateBase {
    state_name: string;
    state_flags: any[];
  }

  export interface NegotiatingFundingState extends ChannelStateBase {
    state_name: 'NEGOTIATING_FUNDING';
    state_flags: NegotiatingFundingFlags;
  }

  export interface CollaboratingFundingTxState extends ChannelStateBase {
    state_name: 'COLLABORATING_FUNDING_TX';
    state_flags: CollaboratingFundingTxFlags;
  }

  export interface SigningCommitmentState extends ChannelStateBase {
    state_name: 'SIGNING_COMMITMENT';
    state_flags: SigningCommitmentFlags;
  }

  export interface AwaitingTxSignaturesState extends ChannelStateBase {
    state_name: 'AWAITING_TX_SIGNATURES';
    state_flags: AwaitingTxSignaturesFlags;
  }

  export interface AwaitingChannelReadyState extends ChannelStateBase {
    state_name: 'AWAITING_CHANNEL_READY';
    state_flags: AwaitingChannelReadyFlags;
  }

  export interface ChannelReadyState extends ChannelStateBase {
    state_name: 'CHANNEL_READY';
    state_flags: never[];
  }

  export interface ShuttingDownState extends ChannelStateBase {
    state_name: 'SHUTTING_DOWN';
    state_flags: ShuttingDownFlags;
  }

  export interface ClosedState extends ChannelStateBase {
    state_name: 'CLOSED';
    state_flags: CloseFlags;
  }

  export type ChannelState =
    | NegotiatingFundingState
    | CollaboratingFundingTxState
    | SigningCommitmentState
    | AwaitingTxSignaturesState
    | AwaitingChannelReadyState
    | ChannelReadyState
    | ShuttingDownState
    | ClosedState;
}
