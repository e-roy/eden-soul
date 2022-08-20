import { useEffect, useState, useCallback } from "react";
import { useContract, useSigner } from "wagmi";
import { ethers } from "ethers";

import contracts from "@/contracts/hardhat_contracts.json";
import { NETWORK_ID } from "@/config";

export const Factory = () => {
  const chainId = Number(NETWORK_ID);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [transferOwnerAddress, setTransferOwnerAddress] = useState("");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [organization, setOrganization] = useState("");
  const [defaultRole, setDefaultRole] = useState("");
  const [transferable, setTransferable] = useState(false);
  const [mintable, setMintable] = useState(false);
  const [mintPrice, setMintPrice] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");

  const [error, setError] = useState("");

  const { data: signerData } = useSigner();

  const allContracts = contracts as any;
  const factroyAddress =
    allContracts[chainId][0].contracts.SoulBoundNFTFactory.address;
  const factoryABI = allContracts[chainId][0].contracts.SoulBoundNFTFactory.abi;

  const factoryContract = useContract({
    addressOrName: factroyAddress,
    contractInterface: factoryABI,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    if (signerData) {
      console.log("factoryContract", factoryContract);
    }
  }, [signerData]);

  const handleOwner = async () => {
    try {
      const owner = await factoryContract.owner();
      setOwnerAddress(owner);
      //   console.log(owner);
    } catch (error) {
      setError("txn failed, check contract");
    }
  };

  const handleTransferOwner = async () => {
    try {
      const tx = await factoryContract.transferOwnership(transferOwnerAddress);
      tx.wait(1)
        .then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (error) {
      setError("txn failed, check contract");
    }
  };

  const handleNewBeaconProxy = async () => {
    try {
      const tx = await factoryContract.newBeaconProxy(
        name,
        symbol,
        organization,
        defaultRole,
        transferable,
        mintable,
        ethers.utils.parseEther(mintPrice),
        tokenOwner
      );
      tx.wait(1)
        .then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (error) {
      setError("txn failed, check contract");
    }
  };

  return (
    <div className="border p-4 w-full">
      <div className="text-center font-bold text-2xl">factory contract</div>

      {/* get owner */}
      <div className="flex m-4">
        <button
          className="p-2 border border-gray-600 rounded-lg hover:bg-gray-200"
          onClick={handleOwner}
        >
          get owner
        </button>
        <div className="my-auto pl-4">owner address: {ownerAddress}</div>
      </div>

      {/* transfer owner */}
      <div className="flex m-4">
        <button
          className="p-2 border border-gray-600 rounded-lg hover:bg-gray-200"
          onClick={handleTransferOwner}
        >
          transfer owner
        </button>
        <input
          className="my-auto p-2 ml-4 border border-gray-600 rounded-lg"
          type="text"
          placeholder="transfer owner address"
          value={transferOwnerAddress}
          onChange={(e) => setTransferOwnerAddress(e.target.value)}
        />
      </div>

      {/* new beacon proxy */}
      <div className="m-4 border p-4">
        <div className="my-2 font-semibold">new beacon proxy</div>
        <div className="my-2">
          <input
            className="my-auto p-2  border border-gray-600 rounded-lg"
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="my-2">
          <input
            className="my-auto p-2  border border-gray-600 rounded-lg"
            type="text"
            placeholder="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div className="my-2">
          <input
            className="my-auto p-2  border border-gray-600 rounded-lg"
            type="text"
            placeholder="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        <div className="my-2">
          <input
            className="my-auto p-2  border border-gray-600 rounded-lg"
            type="text"
            placeholder="defaultRole"
            value={defaultRole}
            onChange={(e) => setDefaultRole(e.target.value)}
          />
        </div>

        <div className="my-2 flex">
          <input
            type="checkbox"
            checked={transferable}
            onChange={() => setTransferable(!transferable)}
          />
          <span className="pl-2">transferable </span>
        </div>

        <div className="my-2 flex">
          <input
            type="checkbox"
            checked={mintable}
            onChange={() => setMintable(!mintable)}
          />
          <span className="pl-2">mintable</span>
        </div>

        <div className="my-2">
          <input
            className="my-auto p-2  border border-gray-600 rounded-lg"
            type="text"
            placeholder="mintPrice"
            value={mintPrice}
            onChange={(e) => setMintPrice(e.target.value)}
          />
        </div>

        <div className="my-2">
          <input
            className="my-auto p-2  border border-gray-600 rounded-lg"
            type="text"
            placeholder="tokenOwner"
            value={tokenOwner}
            onChange={(e) => setTokenOwner(e.target.value)}
          />
        </div>

        <button
          className="p-2 border border-gray-600 rounded-lg hover:bg-gray-200"
          onClick={handleNewBeaconProxy}
        >
          create new beacon proxy
        </button>
      </div>

      {/* error message */}
      {error && (
        <div className="font-bold text-xl text-red-700"> error: {error}</div>
      )}
    </div>
  );
};
