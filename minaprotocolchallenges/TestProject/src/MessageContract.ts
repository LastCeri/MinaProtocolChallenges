import {
    AccountUpdate,
    Bool,
    DeployArgs,
    Field,
    MerkleMap,
    MerkleMapWitness,
    PublicKey,
    Permissions,
    Poseidon,
    Provable,
    SmartContract,
    State,
    UInt32,
    method,
    state,
  } from 'o1js';
  
  export class MessageContract extends SmartContract {
    @state(PublicKey) adminUser = State<PublicKey>();
    @state(UInt32) totalAddresses = State<UInt32>();
    @state(UInt32) totalMessages = State<UInt32>();
    @state(Field) rootAddressMap = State<Field>();
    @state(Field) rootMessageMap = State<Field>();
  
    events = {
      NewMessage: UInt32,
    };
  
    deploy(deployArgs?: DeployArgs) {
      super.deploy(deployArgs);
      this.account.permissions.set({
        ...Permissions.allImpossible(),
        access: Permissions.proof(),
        editState: Permissions.proof(),
      });
    }
  
    init() {
      super.init();
      AccountUpdate.createSigned(this.sender);
  
      const emptyMap = new MerkleMap();
  
      this.adminUser.set(this.sender);
      this.totalAddresses.set(UInt32.zero);
      this.totalMessages.set(UInt32.zero);
      this.rootAddressMap.set(emptyMap.getRoot());
      this.rootMessageMap.set(emptyMap.getRoot());
    }
  
    @method addAddress(addressSnapshot: MerkleMapWitness, userPublicKey: PublicKey) {
      AccountUpdate.createSigned(this.sender);
  
      const superUser = this.adminUser.getAndRequireEquals();
      const totalAddresses = this.totalAddresses.getAndRequireEquals();
      const currentRootAddressMap = this.rootAddressMap.getAndRequireEquals();
  
      const userHash = Poseidon.hash(userPublicKey.toFields());
  
      const [computedRootAddressMap, computedUserHash] = addressSnapshot.computeRootAndKey(Bool(false).toField());
      userHash.assertEquals(computedUserHash);
  
      currentRootAddressMap.assertEquals(computedRootAddressMap);
      superUser.assertEquals(this.sender);
      totalAddresses.assertLessThanOrEqual(UInt32.from(100));
  
      const [updatedRootAddressMap] = addressSnapshot.computeRootAndKey(Bool(true).toField());
  
      this.rootAddressMap.set(updatedRootAddressMap);
      this.totalAddresses.set(totalAddresses.add(1));
    }
  
    @method submitMessage(addressSnapshot: MerkleMapWitness, messageSnapshot: MerkleMapWitness, userMessage: Field) {
      AccountUpdate.createSigned(this.sender);
  
      const totalMessages = this.totalMessages.getAndRequireEquals();
      const currentRootAddressMap = this.rootAddressMap.getAndRequireEquals();
      const currentRootMessageMap = this.rootMessageMap.getAndRequireEquals();
  
      const senderHash = Poseidon.hash(this.sender.toFields());
  
      const [computedRootAddressMap, computedUserHash] = addressSnapshot.computeRootAndKey(Bool(true).toField());
      senderHash.assertEquals(computedUserHash);
      currentRootAddressMap.assertEquals(computedRootAddressMap);
  
      const [computedRootMessageMap, computedSenderHash] = messageSnapshot.computeRootAndKey(Bool(false).toField());
      computedSenderHash.assertEquals(senderHash);
      computedRootMessageMap.assertEquals(currentRootMessageMap);
  
      const messageBits = userMessage.toBits();
      const flags = messageBits.slice(249, 255);
      flags.forEach((flag, index) => {
        if (index === 1) {
          Provable.if(flag, flags[index + 1], Bool(true)).assertTrue();
        } else {
          Provable.if(flag, Bool(false), Bool(false)).assertFalse();
        }
      });
  
      this.emitEvent('NewMessage', totalMessages);
  
      const [updatedRootMessageMap] = messageSnapshot.computeRootAndKey(userMessage);
  
      this.rootMessageMap.set(updatedRootMessageMap);
      this.totalMessages.set(totalMessages.add(1));
    }
  
    @method validateMessage(messageSnapshot: MerkleMapWitness, depositorPublicKey: PublicKey, userMessage: Field): Bool {
      const currentRootMessageMap = this.rootMessageMap.getAndRequireEquals();
  
      const depositorHash = Poseidon.hash(depositorPublicKey.toFields());
  
      const [computedRootMessageMap, computedDepositorHash] = messageSnapshot.computeRootAndKey(userMessage);
  
      return currentRootMessageMap.equals(computedRootMessageMap).and(depositorHash.equals(computedDepositorHash));
    }
  }
  