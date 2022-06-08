class Main {
  state = {
    finishedRounds: [],
    rounds: [],
    event: {
      ADD_PLAYER: 'add-players',
      INCREASE_SCORE: 'increase-score',
      MOVE_PLAYER: 'name',
    },
    message: {
      nextPhase: (name) =>
        `¿Estás seguro que quieres mover a ${name} al siguiente ronda?`,
      playerNotAvailable: 'Esté jugador ya no puede pasar a la siguiente ronda.',
      phaseNotAvailable: 'No hay jugador disponible para la siguiente ronda.'
    },
  };

  constructor() {
    Interface.InjectInputTemplate();
    this.handlerOnClick();
  };

  debugger(buttonType) {
    const { event: { ADD_PLAYER, INCREASE_SCORE, MOVE_PLAYER }, rounds } = this.state

    if ([ADD_PLAYER, INCREASE_SCORE, MOVE_PLAYER].includes(buttonType)) {
      console.log(rounds);
    };
  };

  hideElement(className) {
    Tool.selector(className).classList.add('hide');
  };

  handlerOnClick() {
    window.addEventListener('click', ({ target }) => {
      const { className, innerText: name, dataset: { nextChallengeId, challengeId } } = target;
      const { message, finishedRounds, event: { ADD_PLAYER, INCREASE_SCORE, MOVE_PLAYER } } = this.state;
      const buttonType = className && className.split('__')[1];

      switch(buttonType) {
        case ADD_PLAYER:
          this.addPlayer();
        break;

        case INCREASE_SCORE:
          this.increaseScore(target);
        break;

        case MOVE_PLAYER:
          if (name === '??') {
            alert(message.phaseNotAvailable);

          } else if (finishedRounds.includes(challengeId)) {
            alert(message.playerNotAvailable);

          } else if (confirm(message.nextPhase(name))) {
            // Add a player name to the next challenge.
            this.updateChallenge({ name, id: nextChallengeId });
            this.state.finishedRounds.push(challengeId);
          };
        break;
      };

      this.debugger(buttonType);
    });
  };

  addPlayer() {
    const textarea = Tool.selector('textarea').value;
    const value = textarea.replace(/(\n|\s\s+)/g, ' ').trim();
    const names = value.split(' ').map((name) => ({ name, points: 0 }));

    if (this.canAddPlayers(names.length)) {
      this.state.rounds = Bracket.createRounds(names);
      this.hideElement('inputs');
      Interface.InjectRoundTemplate(this.state.rounds);
    } else {
      alert(`Debes agregar una cantidad de jugadores que pueda soportar el diagrama.\n\nAquí algunas cantidadas disponible que puedes probar:\n\n 2, 4, 8, 16, 32, 64, 128 ect.`);
    }
  };

  canAddPlayers(size) {
    for (let index = 2; index <= size; index *= 2)
      if (size === index) return true;

    return false;
  };

  increaseScore(target) {
    const [roundId, playersId, id] = target.dataset.buttonId.split('-');

    this.state.rounds[roundId][playersId][id].points += 1;
    target.innerText = this.state.rounds[roundId][playersId][id].points;
  };


  updateChallenge({ id, name }) {
    const nextChallengeId = id.split('-');
    const className = Interface.CLASS_NAME;
    const [roundId, challengeId] = nextChallengeId;
    const idx = Bracket.nextChallengeId(this.state.rounds, nextChallengeId);

    this.state.rounds[roundId][challengeId][idx] = { name, points: 0 };

    Tool.selectorAll('rounds')[roundId]
      .querySelectorAll(`.${className}__challenge`)[challengeId]
      .querySelectorAll(`.${className}__name`)[idx]
      .innerText = name;
  };
};

new Main();
