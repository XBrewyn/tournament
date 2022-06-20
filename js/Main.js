class Tournament {
  static #state = {
    finishedRounds: {
      winners: [],
      losers: [],
    },
    winners: [],
    losers: [],
    event: {
      ADD_SCORE: 'increase-score',
      ADD_PLAYER: 'panel-button',
      MOVE_PLAYER: 'name',
    },
    message: {
      nextPhase: (name) =>
        `¿Estás seguro que quieres mover a ${name} al siguiente ronda?`,
      playerNotAvailable: 'Esté jugador ya no puede pasar a la siguiente ronda.',
      phaseNotAvailable: 'No hay jugador disponible para la siguiente ronda.'
    },
  };

  static addPanel() {
  }

  static build(settings) {
    Interface.injectPanelTemplate();
    Tournament.#state = { ...Tournament.#state, settings };
    Tournament.#handlerOnClick();
  };

  static #notifyState(buttonType) {
    const { event: { ADD_PLAYER, ADD_SCORE, MOVE_PLAYER }} = Tournament.#state

    if ([ADD_PLAYER, ADD_SCORE, MOVE_PLAYER].includes(buttonType)) {
      console.log(Tournament.#state);
    };
  };

  static #handlerOnClick() {
    window.onclick = ({ target }) => {
      const { className, innerText: playerName, dataset: { nextChallengeId, challengeId,  losersId, title } } = target;
      const { message, finishedRounds, event: { MOVE_PLAYER, ADD_SCORE, ADD_PLAYER } } = Tournament.#state;

      switch(Tournament.#eventType(className)) {
        case ADD_PLAYER:
          Tournament.#addPlayer();
          target.desibled = true;
          break;

        case ADD_SCORE:
          Tournament.#increaseScore({ title, target });
          Tournament.#notifyState();
        break;

        case MOVE_PLAYER:
          if (playerName === '??') {
            alert(message.phaseNotAvailable);

          } else if (finishedRounds[title].includes(challengeId)) {
            alert(message.playerNotAvailable);

          } else if (confirm(message.nextPhase(playerName))) {
            // Add a player name to the next challenge.
            Tournament.#updateChallenge({
              icon: target.previousElementSibling.src,
              playerName,
              nextChallengeId,
              challengeId,
              losersId,
              title
            });
            Tournament.#state.finishedRounds[title].push(challengeId);
            Tournament.#notifyState();
          };
        break;
      };
    };
  };

  static #eventType(className) {
    return className && className.split('__')[1];
  };

  static #addPlayer() {
    const random = Tool.selector('panel-checkbox').checked;
    const players = Tool.selector('panel-input').value.replace(/\n/g, ' ').split(' ');
    const winners = players.map((name) => {
      const splitName = name.split('-');
      const icon =  name.includes('-') ? splitName[1] : '';
      const namePlayer = name.includes('-') ? splitName[0] : name;
 
      return { name: namePlayer, score: 0, icon  };
    });

    const losers = Tool.range(Math.floor(winners.length / 2)).map(() => ({ name: '??', score: 0 }));

    if (Tournament.canAddPlayers(winners.length)) {
      this.#createBrackers({ title: 'winners', data: winners, random });
      this.#createBrackers({ title: 'losers', data: losers });
    } else {
      alert(`size of players available: 2, 4, 8, 16, 32, 64, 128....`);
    };
  };

  static #createBrackers({ title, data, random = false }) {
    const state = Tournament.#state;

    state[title] = Bracket.createRounds(data, random);
    Interface.injectRoundTemplate({
      title,
      rounds: state[title],
      template: 'modern'
    });
    Interface.resizeBracket();
  };

  static canAddPlayers(size) {
    for (let index = 2; index <= size; index *= 2)
      if (size === index) return true;

    return false;
  };

  static #increaseScore({ title, target }) {
    const [roundId, challengeId, playerId] = target.dataset.buttonId.split('-');
    const player = Tournament.#state[title][roundId][challengeId][playerId];
    const value =  (Number(target.innerText) + 1);

    player.score = value;
    target.innerText =  player.score;
  };

  static #updateChallenge({ icon, playerName, nextChallengeId, challengeId, losersId, title }) {
    const className = Interface.CLASS_NAME;
    const [roundId, nexChallengeId] = nextChallengeId.split('-');
    const challenge = Tournament.#state[title][roundId][nexChallengeId];
    const playerId = Bracket.getNextChallengeId(challenge);
    const losers =  [...Tool.selector(`bracket--losers`).querySelectorAll(`.${className}__name`)];
    const challengeLoserId = challengeId.split('-')[1];
    const nextChallengeEl = (
      Tool.selector(`bracket--${title}`)
        .querySelectorAll('.tournament__round')[roundId]
        .querySelectorAll(`.${className}__challenge`)[nexChallengeId]
    );

    // Update score and player name.
    challenge[playerId] = { name: playerName, score: 0, icon };

    // Update next challenge.
    nextChallengeEl.querySelectorAll(`.${className}__name`)[playerId].innerText = playerName;
    nextChallengeEl.querySelectorAll(`.${className}__icon`)[playerId].src = icon;

    // Move player to losers brackers.
    if (title === 'winners') {
      losers.some((loser, index) => {
        if ((loser.innerText === '??') && (roundId === '1')) {
          const playerLoser = Tournament.#state.winners[0][challengeLoserId];
          const id = (losersId === '0') ? 1 : 0;

          loser.innerText = playerLoser[id].name;

          Tool.selector(`bracket--losers`)
            .querySelectorAll(`.${className}__icon`)[index]
            .src =`./assets/icons/${playerLoser[id].icon}HeadSSBU.png`;

          return true;
        };

        return false;
      });   
    }
  };
};
