import React, { Component, useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  Button,
  Text,
  Spacer,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import DarkModeSwitch from "./DarkModeSwitch.js";

export default function Nav() {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    connect();
    if(window.ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      connect();
      console.log("changed!");
    });
    ethereum.on("chainChanged", () => {
      connect();
    });
    ethereum.on("connect", () => {
      console.log("connected");
    });
    ethereum.on("disconnect", () => {
      console.log("disconnected");
      setWeb3(null)
      setAccount(null)
      setChainId(null)
      setProvider(null)
    });
  }

  }, []);

  const connect = async() => {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "26e178ea568e492983f2431ad6a31e74" // required
        }
      }
    };

    const web3Modal = new Web3Modal({
      providerOptions
    });

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);

    let accounts = await web3.eth.getAccounts();
    let account = accounts[0];

    let chainId = await web3.eth.getChainId();

    setWeb3(web3);
    setAccount(account);
    setChainId(chainId);
    setProvider(provider);

  }

  const send = async(e) => {

    e.preventDefault();
    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    var { recipient, amount } = array;

    await web3.eth.sendTransaction({from: account, to: array['to'], value: array['amount']});
  }

  return (
    <Flex padding={5} width="100vw">
      <Box
        as="h1"
        letterSpacing="wide"
        fontWeight="extrabold"
        fontSize="4xl"
        bgGradient="linear(to-br, kali.900, kali.600)"
        bgClip="text"
        textShadow="2.4px 0.4px kali.900"
        ml={2}
      >
        <Link href="/">KaliDAO</Link>
      </Box>

      <Spacer />

      <VStack>
        <Button
          bgGradient="linear(to-br, kali.600, kali.700)"
          size="md"
          variant="ghost"
          color="white"
          mr={2}
          border={0}
          onClick={connect}
        >
          {account == null ? "Connect Wallet" : account}
        </Button>

      </VStack>
      <DarkModeSwitch />
    </Flex>
  );
}
