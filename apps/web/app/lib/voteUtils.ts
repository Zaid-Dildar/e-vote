// utils/voteUtils.ts

interface VoteData {
  election: string;
  candidate: string;
}

export const getElectionResults = (electionId: string, votes: VoteData[]) => {
  const votesInElection = votes.filter((vote) => vote.election === electionId);
  const voteCount: Record<string, number> = {};

  // Count votes per candidate
  votesInElection.forEach((vote) => {
    voteCount[vote.candidate] = (voteCount[vote.candidate] || 0) + 1;
  });

  // Find the candidate with the highest votes, provide an initial value
  const winnerId = Object.keys(voteCount).reduce(
    (max, candidateId) =>
      (voteCount[candidateId] ?? 0) > (voteCount[max ?? ""] || 0)
        ? candidateId
        : max,
    Object.keys(voteCount)[0] || null // Default to null if there are no votes
  );

  return { winnerId, voteCount };
};
