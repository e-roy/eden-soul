import { useEffect, useState, useCallback } from "react";
import { useContract, useSigner } from "wagmi";
import { ethers } from "ethers";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const NFT = () => {
  const chainId = Number(NETWORK_ID);
  const [ownerAddress, setOwnerAddress] = useState("");

  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const { data: signerData } = useSigner();

  const allContracts = contracts as any;
  const nftAddress = allContracts[chainId][0].contracts.SoulBoundNFT.address;
  const nftABI = allContracts[chainId][0].contracts.SoulBoundNFT.abi;

  const nftContract = useContract({
    addressOrName: nftAddress,
    contractInterface: nftABI,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    if (signerData) {
      console.log("nftContract", nftContract);
    }
  }, [signerData]);

  const handleGetName = async () => {
    try {
      const name = await nftContract.name();
      setName(name);
      //   console.log(owner);
    } catch (error) {
      setError("txn failed, check contract");
    }
  };

  return (
    <div className="border p-4 w-full">
      <div className="text-center font-bold text-2xl">nft contract</div>

      {/* get owner */}
      <div className="flex m-4">
        <button
          className="p-2 border border-gray-600 rounded-lg hover:bg-gray-200"
          onClick={handleGetName}
        >
          get name
        </button>
        <div className="my-auto pl-4">name: {name}</div>
      </div>

      {/* error message */}
      {error && (
        <div className="font-bold text-xl text-red-700"> error: {error}</div>
      )}
    </div>
  );
};
