class Bracket {
  static getNextChallengeId(challenge) {
    let index = -1;

    challenge.some(({ name }, playerIndex) => {
      const isNotPlayer = (name === '??');

      index = isNotPlayer ? playerIndex : -1;

      return isNotPlayer;
    });

    return index;
  };

  static createRounds(players, isRandom = true) {
    const data = { name: '??', score: 0 };
    const els = isRandom ? [...players].sortRandom() : [...players];
    const rounds = [];
    let roundLen = players.length;
    let index = 0;

    while(((roundLen % 2) === 0)) {
      roundLen = (roundLen / 2);
      rounds.push(
        Tool.range(roundLen).map(() =>
          (index === 0)
            ? els.splice(0, 2)
            : [{...data }, {...data }]
      ));

      index++;
    };

    return rounds;
  };
}
