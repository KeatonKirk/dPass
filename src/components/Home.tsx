import React, {useState, useRef} from 'react';
import { connect, Connection, Token } from "@tableland/sdk";
import * as Cookies from 'js-cookie';
import {connectToTableland} from './NewUser'
import NewPassword from './NewPassword'
//import LitJsSdk from "@lit-protocol/sdk-browser";
//import { encryptUserData } from './Encryption'

function Home() {

	return (
		<>
			<div className="App-text">Home</div>
			<button onClick={connectToTableland}>Sign In</button>
			<NewPassword />
		</>
		
	)
}

export default Home