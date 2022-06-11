class Interface {
  static CLASS_NAME = 'tournament';
  static #roundsLen = 0;

  static InjectInputTemplate() {
    const { CLASS_NAME } = Interface;

    Tool.createTemplate({
      target: 'main',
      template: `
        <div class="${CLASS_NAME}">
          <div class="${CLASS_NAME}__inputs">
            <form class="${CLASS_NAME}__form">
              <textarea
                type="text"
                class="${CLASS_NAME}__textarea"
                placeholder="Add player"
              ></textarea>
              <input type="button" class="${CLASS_NAME}__add-players" value="add" />
            </form>
          </div>
          <div class="${CLASS_NAME}__bracket"></div>
        </div>
      `
    });
  };

  static InjectRoundTemplate(rounds) {
    Interface.#roundsLen = rounds.length;

    const { CLASS_NAME } = Interface;
    const getConectorHeight = Interface.#conectorHeight();
    const getNextChallengeId = Interface.#nextChallengeId();
    const getChallengeIdTemplate = Interface.#getChallengeIdTemplate();

    Tool.createTemplate({
      target: `.${CLASS_NAME}__bracket`,
      template: `
        ${rounds.template((challenges, roundIndex) => {
          const height = getConectorHeight(roundIndex);

          return `
            <div class="${CLASS_NAME}__round"> 
              ${challenges.template((players, challengeIndex) => `
                <div class="${CLASS_NAME}__challenge">
                  ${Interface.#getTitleTemplate(challengeIndex, roundIndex + 1)}
                  ${Interface.#getConectorTemplate(roundIndex, challengeIndex, height)}
                  ${getChallengeIdTemplate()}

                  ${players.template(({ name, score }, playerIndex) => `
                    <div class="${CLASS_NAME}__player">
                      <span
                        class="${CLASS_NAME}__name"
                        ${getNextChallengeId((roundIndex + 1), (challengeIndex + 1), playerIndex)}
                        data-challenge-id="${roundIndex}-${challengeIndex}"
                      >
                        ${name}
                      </span>
                      <button
                        class="${CLASS_NAME}__increase-score"
                        data-button-id="${roundIndex}-${challengeIndex}-${playerIndex}"
                      >${score}</button>
                    </div>
                  `)}
                </div>
              `)}
            </div>
          `
        })}
      `
    });
  };

  static #getChallengeIdTemplate() {
    let challengeId = 0;
    const { CLASS_NAME } = Interface;
    const classNameSpace = (challengeId > 9) ? 'space' : '';

    return () => (`
      <span class="${CLASS_NAME}__number ${classNameSpace}">
        ${++challengeId}
      </span>
    `);
  };

  static #getTitleTemplate(challengeIndex, roundIndex) {
    const { CLASS_NAME } = Interface;
    const roundsLen = Interface.#roundsLen;

    return (challengeIndex === 0) ? `
      <span class="${CLASS_NAME}__title">
        ${
          (roundIndex === (roundsLen - 1)) && 'semi final' ||
          (roundIndex === roundsLen) && 'grand final'||
          `Round ${roundIndex}`
        }
      </span>  
    ` : '';
  };

  static #getConectorTemplate(roundIndex, challengeIndex, height) {
    const { CLASS_NAME } = Interface;
    const roundsLen = Interface.#roundsLen;

    return (
      ((challengeIndex % 2) === 0) &&
      (roundIndex !== (roundsLen - 1)) ? `
        <div class="${CLASS_NAME}__connector" style="height: ${height}px;">
          <div class="${CLASS_NAME}__merge"></div>
        </div>
      ` : ''
    );
  };

  static #conectorHeight() {
    let base = 3;

    return (roundIndex) => {
      const height = (roundIndex === 0) ? 84 : ((84 * base) - 42);

      base = (roundIndex >= 1) ? (base * 2) : base;

      return height;
    };
  };

  static #nextChallengeId () {
    let nextChallegeId = 0;
    const roundsLen = Interface.#roundsLen;

    return (roundIndex, challengeIndex, playerIndex) => {
      if (challengeIndex === 1) {
        nextChallegeId = 0
      } else if ((challengeIndex % 2 === 1) && playerIndex === 0) {
        nextChallegeId++;
      };

      return (roundIndex !== roundsLen)
        ? `data-next-challenge-id="${roundIndex}-${nextChallegeId}"`
        : '';
    };
  };
};
