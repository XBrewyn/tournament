class Bracket {
  static nextChallengeId(rounds, [phaseId, nextChallengeId]) {
    let index = -1;

    rounds[phaseId][nextChallengeId].some(({ name }, indx) => {
      const isNotPlayer = (name === '??');

      index = isNotPlayer ? indx : -1;

      return isNotPlayer;
    });

    return index;
  };

  static createRounds(players) {
    const data = { name: '??', points: 0 };
    const sortPlayers = Tool.sortRandom([...players]);
    const rounds = [];
    let sizePhase = sortPlayers.length;
    let index = 0;

    while(((sizePhase % 2) === 0)) {
      sizePhase = (sizePhase / 2);

      const phase = Tool.range(sizePhase).map(() =>
        (index === 0)
          ? sortPlayers.splice(0, 2)
          : [{...data }, {...data }]
      );

      rounds.push(phase);
      index++;
    };

    return rounds;
  };
}
