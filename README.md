# Install
```
npm install merkleproof2017
```

# Getting Started
```javascript
  //Import module
  const merkleproof2017 = require('merkleproof2017')

  // Load unsigned certificates from disk
  let cert1 = await merkleproof2017.loadUnsignedCertificate('/UnsignedCerts/UnsignedCert1.json')
  let cert2 = await merkleproof2017.loadUnsignedCertificate('/UnsignedCerts/UnsignedCert2.json')

  // Put certs into array
  let certArray = [cert1, cert2]

  // Sign certificates
  let signedCerts = await merkleproof2017.signCertificates(certArray)

  // Print array of signed sertificates
  console.log(JSON.stringify(signedCerts, null, 2))
```