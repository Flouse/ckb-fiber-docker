export interface PeerInfo {
  peerId: string;
}

export const parsePeerAddr = (addr: string): PeerInfo => {
  const [, , ip, , port, , peerId] = addr.split('/')
  return { peerId }
}
