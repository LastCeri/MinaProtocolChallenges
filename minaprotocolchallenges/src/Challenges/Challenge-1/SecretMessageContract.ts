import { SmartContract, method, PublicKey, UInt64, DeployArgs, Permissions, state, State } from 'o1js';

class SecretMessageContract extends SmartContract {
    @state(PublicKey) eligibleAddresses = State<PublicKey[]>();
    @state(UInt64) messageCount = State<UInt64>();
  
    constructor(address: PublicKey) {
        super(address);
      }
    

    @method async addEligibleAddress(address: PublicKey) {
        const addresses = (await this.eligibleAddresses.get()) || [];
        addresses.push(address);
        await this.eligibleAddresses.set(addresses);
      }

  @method async depositSecretMessage(sender: PublicKey, message: UInt64, flags: UInt64) {
    const addresses = await this.eligibleAddresses.get();
    if (!addresses.includes(sender)) {
      throw new Error('Address is not eligible');
    }

    const flagValues = {
        flag1: UInt64.from(1),
        flag2: UInt64.from(2),
        flag3: UInt64.from(4),
        flag4: UInt64.from(8),
        flag5: UInt64.from(16),
        flag6: UInt64.from(32),
      };

    if (flags.equals(flagValues.flag1)) {
        if (!flags.equals(flagValues.flag1)) {
        throw new Error('When flag 1 is set, no other flags should be set');
        }
    } else if (flags.equals(flagValues.flag2)) {
        if (!flags.equals(flagValues.flag2.add(flagValues.flag3))) {
        throw new Error('When flag 2 is set, flag 3 must also be set');
        }
    } else if (flags.equals(flagValues.flag4)) {
        if (flags.gte(flagValues.flag5) || flags.gte(flagValues.flag6)) {
        throw new Error('When flag 4 is set, flags 5 and 6 must not be set');
        }
    }

    const count = await this.messageCount.get();
    await this.messageCount.set(count.add(UInt64.one));
  }
}

export default SecretMessageContract;
