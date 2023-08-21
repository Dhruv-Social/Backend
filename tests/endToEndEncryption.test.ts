// Importing crypto and fs module
import crypto from "crypto";

// Generating key files using generateKeyPairSync() method
function generateKeyFiles() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 530,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "",
    },
  });
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

// Calling Generate keys method

const { publicKey, privateKey } = generateKeyFiles();

// Encrypting the pased string
function encryptString(plaintext: string) {
  // Encrypting data using publicEncrypt() method and a public key
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(plaintext));

  return encrypted.toString("hex");
}

// Decrypting the passed string with private Key
function decryptString(ciphertext: string) {
  // Decrypting data using privateDecrypt() method
  // and the corresponding private key
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: "",
    },
    Buffer.from(ciphertext, "hex")
  );
  return decrypted.toString("utf8");
}

// Following data will be encrypted and decrypted
const plainText = "Hello there!";

// Calling the below method to encrypt string
const encrypted = encryptString(plainText);

// Printing the plain text
console.log("Plaintext:", plainText);
console.log();

// Printing the encrypted text
console.log("Encrypted Text: ", encrypted);
console.log();

// Printing the decrypted text
console.log("Decrypted Text: ", decryptString(encrypted));

console.log(privateKey)
console.log(publicKey)