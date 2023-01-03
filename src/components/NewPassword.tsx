import React, {useState, useRef} from 'react';
import { connect, Connection, Token } from "@tableland/sdk";
import * as Cookies from 'js-cookie';
import {connectToTableland} from './NewUser'

function NewPassword() {
	const inputRefName = useRef<HTMLInputElement>(null);
	const inputRefValue = useRef<HTMLInputElement>(null);
	const [pwName, setPwName] = useState('')
	const [pwValue, setPwValue] = useState('')
	const [pwList, setPwList] = useState([])

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
		const cookie = Cookies.get('tableland')
		if (cookie !== undefined) {
			const token: Token = {token: cookie}
			console.log('attempting connect')
			const tableland = await connect({network: "testnet", chain: "polygon-mumbai", token: token})
			console.log(tableland)
			const tables = await tableland.list()
			const table = tables[0].name
			const controller = tables[0].controller
			const signerAddr = await tableland.getController(table)
			console.log("Signer add from add pw:", controller)
			console.log("tables:", tables, table)
			console.log(await tableland.read(`SELECT * FROM ${table}`))
			if (inputRefName.current && inputRefValue.current) {
				const pwString = inputRefName.current.value + inputRefValue.current.value
				console.log(pwString)
				const insertRes = await tableland.write(
					`UPDATE ${table} SET hash = '${pwString}' WHERE id = '${signerAddr}'`
				)
				console.log("response from insert:", insertRes)
			}
		}
	}

	return (
		<div>
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
		</div>
	)
}

export default NewPassword

