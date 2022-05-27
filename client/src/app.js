import React, { useEffect, useState } from "react";
import Ballot from './contracts/Ballot.json'
import getWeb3 from "./getWeb3";

import CandidateList from "./pages/candidate-list";

const App = () => {
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [contract, setContract] = useState(null)
  const [candidateNames, setCandidatesNames] = useState([])

  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Ballot.networks[networkId];

        const instance = new web3.eth.Contract(
          Ballot.abi,
          deployedNetwork && deployedNetwork.address,
        );

        console.log(instance)

        setWeb3(web3)
        setAccounts(accounts)
        setContract(instance)
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    })()
  }, [])

  // const runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };


  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <CandidateList
      contract={contract}
      accounts={accounts}
      web3={web3} />
  )
}

export default App;
