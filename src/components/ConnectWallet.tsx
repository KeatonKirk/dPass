import React from 'react'
import { connect, Connection } from "@tableland/sdk";
import * as Cookies from 'js-cookie';


function ConnectWallet() {

	const connectToTableland = async () => {
		const tableland: Connection = await connect({network: "testnet", chain:"polygon-mumbai"})

		await tableland.siwe();
		console.log("tableland:", tableland)
		const tables = await tableland.list()
		console.log("tables:", tables)
		//console.log("controller:", tables[0].controller)
		//console.log("table:", await tables[0].name)
		//console.log("tableland controller:", await tableland.getController(tables[0].name))
		if (tableland.token){
			console.log('type of token:', typeof tableland.token['token'])
			Cookies.set('tableland', tableland.token['token'], {expires: 1})
		}
		if (tables.length !== 0) {
			const table = tables[0].name
			console.log(await tableland.read(`SELECT * FROM ${table}`))
		}
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
		if (name) {
			console.log('table created')
			const tables = await tableland.list()
			console.log("tables:", tables, tables[0])
			const controller = tables[0].controller
			const tx = await tableland.setController(controller, name)
			console.log('tx:', tx)
			const insertResp = await tableland.write(
				`INSERT INTO ${name} (id) VALUES ('${controller}')`
			)
			console.log(insertResp)
		}
		return name
	}
	return (
		<div>
			<button onClick={connectToTableland}>connect to tableland</button>
		</div>
	)
}

export default ConnectWallet