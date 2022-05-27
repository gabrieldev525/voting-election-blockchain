const Ballot = artifacts.require("./Ballot.sol");

contract("Ballot", accounts => {
  // it("...should store the value 89.", async () => {
  //   const simpleStorageInstance = await SimpleStorage.deployed();

  //   // Set value of 89
  //   await simpleStorageInstance.set(89, { from: accounts[0] });

  //   // Get stored value
  //   const storedData = await simpleStorageInstance.get.call();

  //   assert.equal(storedData, 89, "The value 89 was not stored.");
  // });

  ballot = null

  beforeEach(async () => {
    this.ballot = await Ballot.deployed();
  })

  it("candidates was registered", async () => {
    const candidates = await this.ballot.getCandidates();

    assert.equal(candidates?.length, 3);
    assert.deepEqual(candidates.map(c => c['name']), ["Candidato 1", "Candidato 2", "Candidato 3"])
  })

  it("voter cannot vote twice", async () => {
    this.ballot.vote(1)
    expect(this.ballot.vote(2)).throw('Already voted.')
  })

  it("voter has voted with successfully", async () => {
    const toVoteIndex = 1
    this.ballot.vote(toVoteIndex)
    const candidates = await this.ballot.getCandidates()

    assert.equal(candidates[toVoteIndex]['vote'], 1)
  })

  it("when candidates have same votes count", async () => {

  })

  it("when a candidate wins", async () => {
    const toVoteIndex = 1
    this.ballot.vote(toVoteIndex)
    const candidates = await this.ballot.getCandidates()

    assert.equal(candidates[toVoteIndex]['vote'], 1)
    const winner = this.ballot.winnerName()

    assert.equal(winner, 'Candidato 2')
  })
});
