import React from 'react';
import ConnectWallet from './ConnectWallet'
import NewPassword from './NewPassword'
//import LitJsSdk from "@lit-protocol/sdk-browser";
//import { encryptUserData } from './Encryption'

function Home() {


	return (
		<>
			<div className="App-text">Home</div>
			<ConnectWallet />
			<NewPassword />
		</>
		
	)
}

export default Home