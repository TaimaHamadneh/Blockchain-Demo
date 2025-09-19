class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index + this.previousHash + this.timestamp + this.data
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(
      0,
      new Date().toISOString(),
      "Welcome to Blockchain Demo 2.0!",
      "0"
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const prevBlock = this.getLatestBlock();
    const newBlock = new Block(
      prevBlock.index + 1,
      new Date().toISOString(),
      data,
      prevBlock.hash
    );
    this.chain.push(newBlock);
  }
}

const demoChain = new Blockchain();

function renderChain() {
  const container = document.getElementById("chain");
  container.innerHTML = "";

  demoChain.chain.forEach((block, i) => {
    const div = document.createElement("div");
    div.className = "block";
    const date = new Date(block.timestamp);
    const formattedTime = date.toUTCString();

    div.innerHTML = `
      <div class="input-group">
        <div class="label">DATA</div>
        <input type="text" value="${block.data}" data-index="${i}">
        </div>
        <div class="input-group without-border">
        <div class="label">PREVIOUS HASH</div>
        <div class="prevHash">${block.previousHash}</div>
        </div>
        <div class="input-group without-border">
        <div class="label">HASH</div>
        <div class="hash" id="hash-${i}">${block.hash}</div>
        </div>
        <div class="input-group without-border">
        
        ${
          i === 0
            ? `<div class="genesis">GENESIS BLOCK</div>`
            : `<div class="genesis">BLOCK #${block.index}</div>`
        }
        <div class="time" >on ${formattedTime}</div>
        </div>
      `;
    container.appendChild(div);
  });

  document.querySelectorAll("input[data-index]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const index = e.target.getAttribute("data-index");
      demoChain.chain[index].data = e.target.value;
      demoChain.chain[index].hash = demoChain.chain[index].calculateHash();

      document.getElementById(`hash-${index}`).textContent =
        demoChain.chain[index].hash;
    });
  });
}
function startTour() {
  introJs()
    .setOptions({
      nextLabel: "Next",
      prevLabel: "Previous",
      skipLabel: "X",
      doneLabel: "Done",
      exitOnOverlayClick: false,
      showProgress: true,
    })
    .start();
}

document.getElementById("addBtn").addEventListener("click", () => {
  const data = document.getElementById("dataInput").value || "No Data";
  demoChain.addBlock(data);
  renderChain();
  document.getElementById("dataInput").value = "";
});

renderChain();
