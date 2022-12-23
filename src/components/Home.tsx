import React, {useState, useRef} from 'react';
import { connect, Connection, Token } from "@tableland/sdk";
import * as Cookies from 'js-cookie';
import LitJsSdk from "@lit-protocol/sdk-browser";
import { encryptUserData } from './Encryption'

function Home() {
	const inputRefName = useRef<HTMLInputElement>(null);
	const inputRefValue = useRef<HTMLInputElement>(null);
	const [pwName, setPwName] = useState('')
	const [pwValue, setPwValue] = useState('')


	// optional logic if tableland.list() comes up empty, call the newUser function
	const signIn = async () => {
		const client = await new LitJsSdk.LitNodeClient();
		client.connect();
		(window as any).litNodeClient = client;
		const tableland: Connection = await connect({network: "testnet", chain:"ethereum-goerli", rpcRelay: true})
		await tableland.siwe();
		await LitJsSdk.checkAndSignAuthMessage({chain: "goerli",});
		if (tableland.token && window.localStorage.getItem("lit-auth-signature")){
			console.log('type of token:', typeof tableland.token['token'])
			Cookies.set('tableland', tableland.token['token'], {expires: 1})
			Cookies.set('litAuthSig', (window as any).localStorage.getItem("lit-auth-signature"))
			window.localStorage.removeItem('lit-auth-signature')
		}
		const tables = await tableland.list()
		console.log(tables[0].name)
		if (tables.length === 0) {
			const newTable = await newUser(tableland)
			console.log(newTable)
		}
	}

	const newUser = async (tableland: Connection) => {
		console.log('in new table create')
		const { name } = await tableland.create(
			`id text PRIMARY KEY UNIQUE, hash text, encstr text` // schema
		)
		return name
	}

	const handleNewName = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setPwName(e.target.value);
		console.log(pwName)
		console.log(inputRefName.current)
	}

	const handleNewValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setPwValue(e.target.value);
		console.log(pwValue)
		console.log(inputRefValue.current)
	}


	const addNewPw = async () => {
		console.log('got to add new pw')
		const token = {token: Cookies.get('tableland')}
		console.log('token from add newpw:', typeof token['token'])
		if (Cookies.get('tableland')) {
			const token = {token: Cookies.get('tableland')}
			console.log('attempting connect')
			const tableland = await connect({network: "testnet", chain: "ethereum-goerli", token: token})
			console.log(tableland)
			const tables = await tableland.list()
			const table = tables[1].name
			const signerAddr = await tableland.getController(table)
			console.log("Signer add from add pw:", signerAddr)
			console.log("tables:", tables, table)
			console.log(await tableland.read(`SELECT * FROM ${table}`))
			if (inputRefName.current && inputRefValue.current) {
				//const passwordObj: PasswordObject = {name: inputRefName.current.value, password: inputRefValue.current.value}
				const pwString = inputRefName.current.value + inputRefValue.current.value
				console.log(pwString)
				const insertRes = await tableland.write(
					`UPDATE ${table} SET hash = '${pwString}' WHERE id = '${signerAddr}'`
				)
				console.log("response from insert:", insertRes)
			}
		}
		//use encryptUserData here
		// accessControlConditions = [{
		// 	chain: "goerli",
		// 	method: "balanceOf",
		// 	parameters: [
		// 		':userAddress',
		// 		tokenId gets pushed here
		// 	],
		// 	contractAddress: contractAddress,
		// 	returnValueTest: {
		// 		value: '0',
		// 		comparator: '>'
		// 	},
		// 	standardContractType: 'ERC721'
		// }]
		// const hashToStore = await encryptUserData(pwString, accessControlConditions)

		// update tableland row with new hashToStore and encKey, and nftInfo( aka accessControlConditions)
		// const insertRes = await tableland.write(
		// 	`UPDATE ${table} SET hash = '${hashToStore['encString']}' encstr = ${hashToStore['encKey']} WHERE id = '${signerAddr}'`
		// )
	}

	

	return (
		<>
			<div className="App-text">Home</div>
			<button onClick={signIn}>Sign In</button>
			<form>
				<label>username or site</label>
				<input
					ref={inputRefName}
					type="text"
					id="name"
					value={pwName}
					onChange={handleNewName}
				/>
				<label>password</label>
				<input
					ref={inputRefValue}
					type="text"
					id="name"
					value={pwValue}
					onChange={handleNewValue}
				/>
    </form>
		<button onClick={addNewPw}>Add new PW</button>
		</>
		
	)
}

export default Home