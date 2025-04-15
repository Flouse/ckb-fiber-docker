import { multiaddr } from '@multiformats/multiaddr'

export const parsePeerId = (addr: string): string => {
  const ma = multiaddr(addr)
  const peerId = ma.getPeerId()
  if (!peerId) {
    throw new Error('The multiaddr is missing peerId.')
  }
  return peerId
}
