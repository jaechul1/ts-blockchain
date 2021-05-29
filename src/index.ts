import * as CryptoJS from "crypto-js";

class Block {
  static calculateHash(
    index: number,
    prevHash: string,
    timestamp: number,
    data: string
  ): string {
    return CryptoJS.SHA256(index + prevHash + timestamp + data).toString();
  }

  static validateStructure = (block: Block): boolean =>
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.prevHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string";

  public index: number;
  public hash: string;
  public prevHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    prevHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(1, "a2131cd9128740", "", "first", 123456);

let blockchain: Block[] = [genesisBlock];

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const prevBlock: Block = getLatestBlock();
  const newIndex: number = prevBlock.index + 1;
  const newTimestamp: number = getNewTimestamp();
  const newHash: string = Block.calculateHash(
    newIndex,
    prevBlock.hash,
    newTimestamp,
    data
  );
  const newBlock = new Block(
    newIndex,
    newHash,
    prevBlock.hash,
    data,
    newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

const getHash = (block: Block): string =>
  Block.calculateHash(block.index, block.prevHash, block.timestamp, block.data);

const isBlockValid = (candBlock: Block, prevBlock: Block): boolean =>
  Block.validateStructure(candBlock) &&
  prevBlock.index + 1 === candBlock.index &&
  prevBlock.hash === candBlock.prevHash &&
  getHash(candBlock) === candBlock.hash;

const addBlock = (candBlock: Block): void => {
  if (isBlockValid(candBlock, getLatestBlock())) {
    blockchain.push(candBlock);
  }
};

createNewBlock("second");
createNewBlock("third");
createNewBlock("fourth");
createNewBlock("fifth");
console.log(blockchain);
