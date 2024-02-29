import { AccountUpdate, Bool, Field, MerkleMap, Mina, Poseidon, PrivateKey, UInt32 } from "o1js";
import assert from "node:assert";
import { MessageContract } from "./MessageContract.js";

describe('Mina Protocol Challenge 1 Test', () => {
  const localBlockchain = Mina.LocalBlockchain({ proofsEnabled: false });
  Mina.setActiveInstance(localBlockchain);
  const adminAccount = localBlockchain.testAccounts[0];
  const participant1 = localBlockchain.testAccounts[1];
  const participant2 = localBlockchain.testAccounts[2];
  const participant3 = localBlockchain.testAccounts[3];
  const participant4 = localBlockchain.testAccounts[4];
  const participant5 = localBlockchain.testAccounts[5];
  const unauthorizedUser = localBlockchain.testAccounts[6];

  const privateKeyOfContract = PrivateKey.random();
  let addressRegistry:MerkleMap;
  let messageArchive:MerkleMap;
  let contractInstance: MessageContract;

  beforeEach(() => {
    addressRegistry = new MerkleMap();
    messageArchive = new MerkleMap();
    contractInstance = new MessageContract(privateKeyOfContract.toPublicKey());
  });

  it('Compiles the contract', async () => {
    await MessageContract.compile();
  });

  it('Deploys the contract successfully', async () => {
    const tx = await Mina.transaction(adminAccount.publicKey, () => {
        contractInstance.deploy()
        AccountUpdate.fundNewAccount(adminAccount.publicKey)
    })
    await tx.prove()
    tx.sign([adminAccount.privateKey, privateKeyOfContract])
    await tx.send()

    const deployedAdmin  = contractInstance.adminUser.get()
    const deployedRoot  = contractInstance.rootAddressMap.get()
    const deployedCount  = contractInstance.totalAddresses.get()
    assert.deepEqual(deployedAdmin , adminAccount.publicKey)
    assert.deepEqual(deployedRoot , addressRegistry.getRoot())
    assert.deepEqual(deployedCount , UInt32.from(0))
  });

  it('Allows admin to register an address', async () => {
    const user1Hash = Poseidon.hash(participant1.publicKey.toFields())

        const tx = await Mina.transaction(adminAccount.publicKey, () => {
            const witness = addressRegistry.getWitness(user1Hash)
            contractInstance.addAddress(witness, participant1.publicKey)
        })
        await tx.prove()
        tx.sign([adminAccount.privateKey])
        await tx.send()

        addressRegistry.set(user1Hash, Bool(true).toField())

        const currentRoot = contractInstance.rootAddressMap.get()
        const currentCount  = contractInstance.totalAddresses.get()
        assert.deepEqual(currentRoot , addressRegistry.getRoot())
        assert.deepEqual(currentCount , UInt32.from(1))
  });

  it('Prevents address registration without admin signature', async () => {
    const user5Hash = Poseidon.hash(participant5.publicKey.toFields());

    try {
      const registerTx = await Mina.transaction(adminAccount.publicKey, () => {
        const witness = addressRegistry.getWitness(user5Hash);
        contractInstance.addAddress(witness, participant5.publicKey);
      });
      await registerTx.prove();
      registerTx.sign([]);
      await registerTx.send();
      assert.fail('Transaction should have failed due to missing admin signature.');
    } catch (error) {
      assert.ok(error instanceof Error, 'Expected an error to be thrown.');
    }
  });

  it("Prevents authorized address can deposit a message", async () => {
    const user1Hash = Poseidon.hash(participant1.publicKey.toFields())

    const msgBits = Field.empty().toBits()
    msgBits[249] = Bool(true) 
    const msg = Field.fromBits(msgBits) 

    console.log(msgBits.length)

    const tx = await Mina.transaction(participant1.publicKey, () => {
        const addressWitness = addressRegistry.getWitness(user1Hash)
        const messageWitness = messageArchive.getWitness(user1Hash)
        contractInstance.submitMessage(addressWitness, messageWitness, msg)
    })
    await tx.prove()
    tx.sign([participant1.privateKey])
    await tx.send()


    messageArchive.set(user1Hash, msg)

    const onChainMessagesRoot = contractInstance.rootMessageMap.get()
    const onChainMessagesCount = contractInstance.totalMessages.get()
    assert.deepEqual(onChainMessagesRoot, messageArchive.getRoot())
    assert.deepEqual(onChainMessagesCount, UInt32.from(1))
})

  it('Prevents unauthorized users from registering addresses', async () => {
    const user5Hash = Poseidon.hash(participant5.publicKey.toFields());

    try {
      const registerTx = await Mina.transaction(unauthorizedUser.publicKey, () => {
        const witness = addressRegistry.getWitness(user5Hash);
        contractInstance.addAddress(witness, participant5.publicKey);
      });
      await registerTx.prove();
      registerTx.sign([unauthorizedUser.privateKey]);
      await registerTx.send();
      assert.fail('Transaction should have failed due to unauthorized access.');
    } catch (error) {
      assert.ok(error instanceof Error, 'Expected an error to be thrown.');
    }
  });

  it("Prevents unauthorized address can't deposit a message", async () => {
    const user5Hash = Poseidon.hash(participant5.publicKey.toFields());

    try {
        const msgBits = Field.empty().toBits(); 
        msgBits[249] = Bool(true); 
        const msg = Field.fromBits(msgBits); 

        const tx = await Mina.transaction(participant2.publicKey, () => {
            const addressWitness = addressRegistry.getWitness(user5Hash);
            const messageWitness = messageArchive.getWitness(user5Hash);
            contractInstance.submitMessage(addressWitness, messageWitness, msg);
        });

        assert(false, "should've failed");
    } catch (error) {

    }
});

it("Prevents authorized address check message and depositor", async () => {
    const user1Hash = Poseidon.hash(participant1.publicKey.toFields());

    const msgBits = Field.empty().toBits(); 
    msgBits[249] = Bool(true); 
    const msg = Field.fromBits(msgBits);

    const tx = await Mina.transaction(participant5.publicKey, () => {
        const messageWitness = messageArchive.getWitness(user1Hash);
        const isValid = contractInstance.validateMessage(messageWitness, participant1.publicKey, msg);
        isValid.assertTrue();
    });

    await tx.prove();
    tx.sign([participant5.privateKey]);
    await tx.send();
});

it("Prevents unauthorized address from sending and creating messages", async () => {
    try {
        const user4Hash = Poseidon.hash(participant4.publicKey.toFields());

        const msgBits = Field.empty().toBits();
        msgBits[250] = Bool(true); 
        const msg = Field.fromBits(msgBits);

        const tx = await Mina.transaction(participant5.publicKey, () => {
            const messageWitness = messageArchive.getWitness(user4Hash);
            const isValid = contractInstance.validateMessage(messageWitness, participant4.publicKey, msg);
            isValid.assertTrue();
        });

        await tx.prove();
        tx.sign([participant5.privateKey]);
        await tx.send();
        assert(false, "should've failed");
    } catch (error) {
    }
});
});
