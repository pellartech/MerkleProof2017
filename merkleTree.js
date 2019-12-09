const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const jsonld = require('jsonld');
const fs = require('fs')

module.exports = {
  async signCertificates(certArray){ 
      let canonizedCertArr = []
      for (let cert of certArray) {
        let canonizeCert = await canonizeData(cert)
        canonizedCertArr.push(canonizeCert)
      }

      const leaves = canonizedCertArr.map(x => SHA256(x))
      const tree = new MerkleTree(leaves, SHA256)

      let i = 0

      for (let leaf of leaves) {
        const proofs = tree.getProof(leaf)
        let finalProof ={}

        for (let proof of proofs) {
          finalProof ={}
          var key = proof.position
          var val = proof.data.toString('hex')
          finalProof[key] = val;
        }
        const root = tree.getRoot().toString('hex')

        signature = {
          "type": ['MerkleProof2017', 'Extension'],
          "merkleRoot": root,
          "targetHash": leaf.toString(),
          "proof": [finalProof]
        }
        
        if (Object.keys(finalProof).length === 0) {
          signature.proof = []
        }

        certArray[i].signature = signature
        i++
      }

      return certArray
  },
  // Load unsigned certificate from path and canonizethe data
  async loadUnsignedCertificate(pathToUnsignedCertificate) {
    try {
        const cert = fs.readFileSync(pathToUnsignedCertificate, 'utf8')
        return JSON.parse(cert)
    } catch(err) {
        console.log('Error: loadUnsignedCertificate->> ', err)
        return err
    }
  }
}

// Canonize a data set with a particular algorithm
async function canonizeData(dataset){
    try {
         return await jsonld.normalize(dataset, {algorithm: 'URDNA2015', format: 'application/n-quads'});
    } catch(err) {
        console.log('Error: canonizeData->> ', err)
        return err
    }
}
