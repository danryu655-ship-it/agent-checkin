import { expect } from "chai";
import { network } from "hardhat";

describe("AgentCheckin", function () {
  let agentCheckin;
  let mockRegistry;
  let owner, holder, nonHolder;
  let ethers;

  before(async function () {
    const connection = await network.create();
    ethers = connection.ethers;
  });

  beforeEach(async function () {
    [owner, holder, nonHolder] = await ethers.getSigners();

    mockRegistry = await ethers.deployContract("MockRegistry");
    
    agentCheckin = await ethers.deployContract("AgentCheckin", [await mockRegistry.getAddress()]);
  });

  it("Should allow check-in and mint badge only once", async function () {
    await mockRegistry.setBalance(holder.address, 1);
    
    await expect(agentCheckin.connect(holder).checkIn()).to.emit(agentCheckin, "BadgeMinted");
    expect(await agentCheckin.balanceOf(holder.address)).to.equal(1);
    
    // Check in again next day
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);
    
    await expect(agentCheckin.connect(holder).checkIn()).to.not.emit(agentCheckin, "BadgeMinted");
    expect(await agentCheckin.balanceOf(holder.address)).to.equal(1);
  });

  it("Should calculate streaks and tiers correctly", async function () {
    await mockRegistry.setBalance(holder.address, 1);
    
    for (let i = 0; i < 30; i++) {
        await agentCheckin.connect(holder).checkIn();
        
        const streak = await agentCheckin.streakOf(holder.address);
        const tier = await agentCheckin.tierOf(holder.address);
        
        if (i < 6) {
            expect(streak).to.equal(i + 1);
            expect(tier).to.equal(1);
        } else if (i < 29) {
            expect(streak).to.equal(i + 1);
            expect(tier).to.equal(2);
        } else {
            expect(streak).to.equal(30);
            expect(tier).to.equal(3);
        }
        
        await ethers.provider.send("evm_increaseTime", [86400]);
        await ethers.provider.send("evm_mine", []);
    }
  });

  it("Should track totalCheckins and badgeOf", async function () {
    await mockRegistry.setBalance(holder.address, 1);
    await agentCheckin.connect(holder).checkIn();
    
    expect(await agentCheckin.totalCheckins()).to.equal(1);
    expect(await agentCheckin.badgeOf(holder.address)).to.equal(0); // Token ID 0
  });

  it("Should respect pause", async function () {
    await mockRegistry.setBalance(holder.address, 1);
    
    await agentCheckin.connect(owner).pause();
    await expect(agentCheckin.connect(holder).checkIn()).to.be.revertedWithCustomError(agentCheckin, "EnforcedPause");
    
    await agentCheckin.connect(owner).unpause();
    await expect(agentCheckin.connect(holder).checkIn()).to.emit(agentCheckin, "CheckedIn");
  });

  it("Should only allow owner to pause and setRegistry", async function () {
    await expect(agentCheckin.connect(holder).pause()).to.be.revertedWithCustomError(agentCheckin, "OwnableUnauthorizedAccount");
    await expect(agentCheckin.connect(holder).setRegistry(holder.address)).to.be.revertedWithCustomError(agentCheckin, "OwnableUnauthorizedAccount");
  });

  it("Should return correct tokenURI with Agent Name", async function () {
    await mockRegistry.setBalance(holder.address, 1);
    await mockRegistry.setName(holder.address, "AgentSmith");
    await agentCheckin.connect(holder).checkIn();
    
    const uri = await agentCheckin.tokenURI(0);
    expect(uri).to.contain("data:application/json;base64,");
    
    // Check decoded json
    const json = Buffer.from(uri.split(",")[1], 'base64').toString();
    expect(json).to.contain("AgentSmith");
    expect(json).to.contain("Streak");
    expect(json).to.contain("Tier");
  });
  it("Should reject check-in for non-holder", async function () {
    await expect(agentCheckin.connect(nonHolder).checkIn()).to.be.revertedWith("Must hold Agent ID");
  });

  it("Should reject a second check-in on the same day", async function () {
    await mockRegistry.setBalance(holder.address, 1);
    await agentCheckin.connect(holder).checkIn();
    await expect(agentCheckin.connect(holder).checkIn()).to.be.revertedWith("Already checked in today");
  });

});
