"use strict";

/** 
* @class description of the class 
* @constructs Competition
* @param {int} id - id da competição
* @param {string} name - nome da competicao
* @param {int} edition - ano da ediçao do torneio
* @param {Teams} winner - equipa vencedora
* @param {boolean} estate - estado da competição null(nao começou), false(ainda nao cabou), true(acabou)
* @param {Teams[]} teams - equipas
*/
class Competition {
    constructor(id, name, edition, winner, state = null, teams) {
        this.id = id;
        this.name = name;
        this.edition = edition;

        //so para testes, mais tarde, jogadores nao podem ter vencedor ao criar
        this.winner = winner || ""

        //começa a null pois ainda nao se quer começou
        this.state = state

        this.teams = teams;

    }
}