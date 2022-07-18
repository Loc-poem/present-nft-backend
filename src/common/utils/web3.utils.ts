const Web3 = require('web3');
const aws = require('aws-sdk');

let web3 = new Web3(process.env.BSC_PROVIDER);
aws.CredentialProviderChain.defaultProviders = [
  function sharedIniFileCredentials() {
    return new aws.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE_NAME || 'default',
    });
  },
  function environmentCredentials() {
    return new aws.EnvironmentCredentials('AWS')
  },
  function eC2MetadataCredentials() {
    let credentials = new aws.EC2MetadataCredentials();
    return credentials;
  },
];
aws.config.setPromisesDependency(Promise);

export class Web3Utils {
  public static async decrypt(buffer: string) {
    const kms = new aws.KMS({
      region: process.env.AWS_REGION
    });
    const { Plaintext } = await kms.decrypt({ CiphertextBlob: Buffer.from(buffer, 'base64') }).promise();
    return Plaintext.toString('ascii');
  }

  //    sign data in backend the update for sprint 11. when store create put on-sale.
  public static async signNftSellOrderMaster(dataSignature) {
    try {
      // console.log('data sign, ', dataSignature);
      const decrypt = await this.decrypt(process.env.HASH_KEY)
      const data = web3.utils.soliditySha3(
        { type: 'uint256', value: dataSignature.sellOrderID },
        { type: 'uint256', value: dataSignature.sellOrderSupply },
        { type: 'address', value: dataSignature.creator },
      );
      const signature = web3.eth.accounts.sign(
        data,
        decrypt,
      );
      return signature?.signature || "";
    } catch (ex) {
      console.log(ex);
      return "";
    }

  }
}