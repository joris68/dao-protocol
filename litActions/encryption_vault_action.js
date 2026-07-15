
/**
 * 
 * These are two "Applevel" secrets:
 * We need our own vault for "saving" the encrytion / decryption key
 * We need a another vault for saving the API key to pinata
 * 
 * This action needs to run once per "vault" with the secret and the corresponding pkpID
 * 
 * The ciphertext will then be hardcoded along with the pkpID in the encryption as well as decryption action
 * 
 * 
 */

async function main({ pkpId, secret }) {
  const ciphertext = await Lit.Actions.Encrypt({ pkpId, message: secret });
  return { ciphertext };
}