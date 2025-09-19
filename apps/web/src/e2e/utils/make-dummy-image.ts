import fs from 'node:fs/promises'
import { deflateSync } from 'node:zlib'

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const writeChunk = (type: string, data: Buffer): Buffer => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)

  const typeBuf = Buffer.from(type, 'ascii')

  const crcBuf = Buffer.alloc(4)
  const crc = crc32(Buffer.concat([typeBuf, data]))
  crcBuf.writeUInt32BE(crc >>> 0, 0)

  return Buffer.concat([len, typeBuf, data, crcBuf])
}

const crc32 = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xed_b8_83_20 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }

  return (buf: Buffer): number => {
    let c = 0xff_ff_ff_ff
    for (const element of buf) {
      c = (table[(c ^ element) & 0xff]! ^ (c >>> 8)) >>> 0
    }
    return (c ^ 0xff_ff_ff_ff) >>> 0
  }
})()

export const makeDummyImage = async (width: number, height: number, outputPath: string): Promise<void> => {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr.writeUInt8(8, 8)
  ihdr.writeUInt8(2, 9)
  ihdr.writeUInt8(0, 10)
  ihdr.writeUInt8(0, 11)
  ihdr.writeUInt8(0, 12)

  const rowBytes = 1 + width * 3
  const raw = Buffer.alloc(rowBytes * height)
  for (let y = 0; y < height; y++) {
    raw[y * rowBytes] = 0
  }

  const compressed = deflateSync(raw)

  const pngParts: Buffer[] = []
  pngParts.push(PNG_SIG, writeChunk('IHDR', ihdr), writeChunk('IDAT', compressed), writeChunk('IEND', Buffer.alloc(0)))

  const out = Buffer.concat(pngParts)

  await fs.writeFile(outputPath, out)
}
