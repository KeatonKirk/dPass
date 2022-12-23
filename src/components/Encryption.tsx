import LitJsSdk from "@lit-protocol/sdk-browser";

export async function encryptUserData (stringToEncrypt: string, accessControlConditions: object): Promise<object>  {
	console.log('INSIDE ENCRYPT USER')
		const client = await new LitJsSdk.LitNodeClient();
		client.connect();
		(window as any).litNodeClient = client;

		// get stored authsig, probably use cookies
		// authisg = Cookies.get('litAuthSig')

		const { encryptedString ,symmetricKey } = await LitJsSdk.encryptString(stringToEncrypt)
		const encryptedSymmetricKey = await (window as any).LitNodeClient.saveEncryptionKey({
			accessControlConditions,
			symmetricKey,
			//authSig,
			chain: 'goerli'
		})

		return {encString: encryptedString, encKey: encryptedSymmetricKey}
}