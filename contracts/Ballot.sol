pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Ballot
 */
contract Ballot {

    struct Voter {
        bool voted;  // if true, that person already voted
        uint vote;   // index of the voted candidate
    }

    struct Candidate {
        // If you can limit the length to a certain number of bytes,
        // always use one of bytes1 to bytes32 because they are much cheaper
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Candidate[] public candidates;

    /**
     * @dev Create a new ballot to choose one of 'candidatesNames'.
     * @param candidatesNames names of candidates
     */
    constructor(bytes32[] memory candidatesNames) {
        chairperson = msg.sender;

        for (uint i = 0; i < candidatesNames.length; i++) {
            // 'Candidate({...})' creates a temporary
            // Candidate object and 'candidates.push(...)'
            // appends it to the end of 'candidates'.
            candidates.push(Candidate({
                name: candidatesNames[i],
                voteCount: 0
            }));
        }
    }

    /**
     * @dev Give your vote to candidate 'candidates[candidate].name'.
     * @param candidate index of candidate in the candidates array
     */
    function vote(uint candidate) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = candidate;

        // If 'candidate' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        candidates[candidate].voteCount++;
    }

    /**
     * @dev Computes the winning candidate taking all previous votes into account.
     * @return winningProposal_ index of winning candidate in the candidates array
     */
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < candidates.length; p++) {
            if (candidates[p].voteCount > winningVoteCount) {  //TODO: Check if has candidates with same vote count
                winningVoteCount = candidates[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /**
     * @dev Calls winningProposal() function to get the index of the winner contained in the candidates array and then
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = candidates[winningProposal()].name;
    }
}
