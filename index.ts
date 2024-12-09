import { TronWeb } from "tronweb";
require("dotenv").config();

// Configuration
const PRIVATE_KEY = process.env.TRON_PRIVATE_KEY;
const TO_ADDRESS = process.env.DESTINATION_ADDRESS;
const HTTP_PROVIDER =
  "https://smart-soft-cherry.tron-mainnet.quiknode.pro/0edd5a77f696c6a6551ae5e953bcb7e420e76942";

if (!PRIVATE_KEY || !TO_ADDRESS) {
  throw new Error(
    "Environment variables TRON_PRIVATE_KEY or DESTINATION_ADDRESS are missing!"
  );
}

const tronWeb = new TronWeb({
  fullHost: HTTP_PROVIDER,
  privateKey: PRIVATE_KEY,
});

async function transferAllBalance() {
  try {
    // Get the sender's address from the private key
    const fromAddress = tronWeb.address.fromPrivateKey(PRIVATE_KEY);

    // Sending all balance minus a small fee to avoid "out of energy" errors
    const amountToSend = 100_000; // Leave 1 TRX for fees

    if (amountToSend <= 0) return;

    // Build and send the transaction
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      TO_ADDRESS,
      amountToSend,
      fromAddress as string
    );

    const signedTransaction = await tronWeb.trx.sign(transaction);
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);

    if (broadcast.result) {
      console.log("Transfer successful:", broadcast.transaction.txID);
    }
  } catch (error) {}
}

// Run transfer attempt every 1 second
setInterval(transferAllBalance, 100);
