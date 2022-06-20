class Interface {
  static CLASS_NAME = 'tournament';
  static #roundsLen = 0;

  static injectPanelTemplate () {
    const { CLASS_NAME } = Interface;
    const options = ['clasic', 'modern'];

    /**
      <select class="${CLASS_NAME}__panel">
        ${options.template((option) => `
          <option value="${option}">${option}</option>
        `)}
      </select>
     */

    Tool.createTemplate({
      target: `.${CLASS_NAME}`,
      template: `
        <div class="${CLASS_NAME}__panel">
          <form class="${CLASS_NAME}__panel-form">
            <textarea placeholder="players" class="${CLASS_NAME}__panel-input"></textarea>
            <input type="button" class="${CLASS_NAME}__panel-button" value="add" />
            <div class="${CLASS_NAME}__panel-random">
              <label class="${CLASS_NAME}__panel-label">random</label>
              <input type="checkbox" class="${CLASS_NAME}__panel-checkbox"/>
            </div>
       
          </form>
        </div>`
    });
  }

  static injectRoundTemplate({ title, rounds, template }) {
    Interface.#roundsLen = rounds.length;

    const { CLASS_NAME } = Interface;
    const getConectorHeight = Interface.#conectorHeight();
    const getNextChallengeId = Interface.#nextChallengeId(title);
    const getChallengeIdTemplate = Interface.#getChallengeIdTemplate();

    Tool.createTemplate({
      target: `.${CLASS_NAME}`,
      template: `
        <div class="tournament__bracket--${title} tournament__template--${template}">
          ${rounds.template((challenges, roundIndex) => {
            const height = getConectorHeight(roundIndex);

            return `
              <div class="${CLASS_NAME}__round"> 
                ${challenges.template((players, challengeIndex) => `
                  <div class="${CLASS_NAME}__challenge">
                    ${Interface.#getTitleTemplate(title, challengeIndex, roundIndex + 1)}
                    ${Interface.#getConectorTemplate(roundIndex, challengeIndex, height)}
                    ${getChallengeIdTemplate()}

                    ${players.template(({ name, score, icon }, playerIndex) => `
                      <div class="${CLASS_NAME}__player">
                        <img
                          class="${CLASS_NAME}__icon"
                          src="./assets/icons/${icon}HeadSSBU.png"
                        />
                        <span
                          class="${CLASS_NAME}__name"
                          data-losers-id="${playerIndex}"
                          ${getNextChallengeId((roundIndex + 1), (challengeIndex + 1), playerIndex)}
                          data-challenge-id="${roundIndex}-${challengeIndex}"
                        >
                          ${name}
                        </span>
                        <button
                          class="${CLASS_NAME}__increase-score"
                          data-button-id="${roundIndex}-${challengeIndex}-${playerIndex}"
                          data-title="${title}"
                        >${score}</button>
                      </div>
                    `)}
                  </div>
                `)}
              </div>`
          })}
        </div>`
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

  static #getTitleTemplate(title, challengeIndex, roundIndex) {
    const { CLASS_NAME } = Interface;
    const roundsLen = Interface.#roundsLen;

    return (challengeIndex === 0) ? `
      <span class="${CLASS_NAME}__title">
        ${
          (roundIndex === (roundsLen - 1)) && `${title} semi final` ||
          (roundIndex === roundsLen) && `${title} grand final`||
          `${title} Round ${roundIndex}`
        }
      </span>  
    ` : '';
  };

  static resizeBracket() {
    const els = document.querySelectorAll(`.${Interface.CLASS_NAME}__bracket`);
    const roundsLen = Interface.#roundsLen;
    const calcWidth = (roundsLen * 300) + 100;

    if (calcWidth > screen.width) { 
      els.forEach((el) =>  el.style.width = `${(roundsLen * 300) + 100}px`);
    };
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

  static #nextChallengeId (title) {
    let nextChallegeId = 0;
    const roundsLen = Interface.#roundsLen;

    return (roundIndex, challengeIndex, playerIndex) => {
      if (challengeIndex === 1) {
        nextChallegeId = 0
      } else if ((challengeIndex % 2 === 1) && playerIndex === 0) {
        nextChallegeId++;
      };

      return (roundIndex !== roundsLen)
        ? `data-title="${title}" data-next-challenge-id="${roundIndex}-${nextChallegeId}"`
        : '';
    };
  };
};
