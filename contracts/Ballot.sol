pragma solidity >=0.5.16 <0.9.0;
pragma experimental ABIEncoderV2;

/**
 * @title Ballot
 */
contract Ballot {

    struct Voter {
        bool voted;  // if true, that person already voted
        uint vote;   // index of the voted candidate
    }

    struct Candidate {
        string name;
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Candidate[] public candidates;

    Candidate[] public winners;

    bool public finished;

    /**
     * @dev Create a new ballot to choose one of 'candidatesNames'.
     * @param candidatesNames names of candidates
     */
    constructor(string[] memory candidatesNames) public {
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

    function getCandidates() public view
            returns (Candidate[] memory _candidates) {
        _candidates = candidates;
    }

    /**
     * @dev Give your vote to candidate 'candidates[candidate].name'.
     * @param candidate index of candidate in the candidates array
     */
    function vote(uint candidate) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        require(!finished, "Already finished.");
        sender.voted = true;
        sender.vote = candidate;

        // If 'candidate' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        candidates[candidate].voteCount++;
    }

    function finishVoting() public {
        finished = true;
    }

    function isFinished() public view returns (bool finished_) {
        finished_ = finished;
    }

    /**
     * @dev Computes the winning candidate taking all previous votes into account.
     */
    function winningProposal() public
            returns (bool _draw, Candidate[] memory winners_)
    {
        uint winningVoteCount = 0;

        for (uint p = 0; p < candidates.length; p++) {
            if (candidates[p].voteCount > winningVoteCount) {  //TODO: Check if has candidates with same vote count
                delete winners;

                winningVoteCount = candidates[p].voteCount;
                _draw = false;

                winners.push(candidates[p]);
            }

            else if(candidates[p].voteCount > 0 && candidates[p].voteCount == winningVoteCount) {
                _draw = true;
                winners.push(candidates[p]);
            }
        }

        winners_ = winners;
    }

    /**
     * @dev Calls winningProposal() function to get the index of the winner contained in the candidates array and then
     */
    function winnerName() public
            returns (bool draw_, Candidate[] memory winners_)
    {
        (bool draw, Candidate[] memory candidatesWinners) = winningProposal();
            draw_ = draw;
            winners_ = candidatesWinners;

    }
}
