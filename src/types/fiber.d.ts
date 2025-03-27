declare module 'fiber' {
  export interface NodeInfoResponse {
    version: string;
    default_funding_lock_script: Script;
  }
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

  export enum ChannelStateName {
    NEGOTIATING_FUNDING = 'NEGOTIATING_FUNDING',
    COLLABORATING_FUNDING_TX = 'COLLABORATING_FUNDING_TX',
    SIGNING_COMMITMENT = 'SIGNING_COMMITMENT',
    AWAITING_TX_SIGNATURES = 'AWAITING_TX_SIGNATURES',
    AWAITING_CHANNEL_READY = 'AWAITING_CHANNEL_READY',
    CHANNEL_READY = 'CHANNEL_READY',
    SHUTTING_DOWN = 'SHUTTING_DOWN',
    CLOSED = 'CLOSED'
  }

  export interface ChannelStateBase {
    state_name: ChannelStateName;
    state_flags: any[];
  }

  export interface NegotiatingFundingState extends ChannelStateBase {
    state_name: ChannelStateName.NEGOTIATING_FUNDING;
    state_flags: NegotiatingFundingFlags;
  }

  export interface CollaboratingFundingTxState extends ChannelStateBase {
    state_name: ChannelStateName.COLLABORATING_FUNDING_TX;
    state_flags: CollaboratingFundingTxFlags;
  }

  export interface SigningCommitmentState extends ChannelStateBase {
    state_name: ChannelStateName.SIGNING_COMMITMENT;
    state_flags: SigningCommitmentFlags;
  }

  export interface AwaitingTxSignaturesState extends ChannelStateBase {
    state_name: ChannelStateName.AWAITING_TX_SIGNATURES;
    state_flags: AwaitingTxSignaturesFlags;
  }

  export interface AwaitingChannelReadyState extends ChannelStateBase {
    state_name: ChannelStateName.AWAITING_CHANNEL_READY;
    state_flags: AwaitingChannelReadyFlags;
  }

  export interface ChannelReadyState extends ChannelStateBase {
    state_name: ChannelStateName.CHANNEL_READY;
    state_flags: never[];
  }

  export interface ShuttingDownState extends ChannelStateBase {
    state_name: ChannelStateName.SHUTTING_DOWN;
    state_flags: ShuttingDownFlags;
  }

  export interface ClosedState extends ChannelStateBase {
    state_name: ChannelStateName.CLOSED;
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
