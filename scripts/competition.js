"use strict";

/** 
* @class description of the class 
* @constructs Competition
* @param {int} id - id da competição
* @param {string} name - nome da competicao
* @param {int} edition - ano da ediçao do torneio
* @param {Teams} winner - equipa vencedora
* @param {boolean} estate - estado da competição T-terminado F- em competiçao
* @param {Teams[]} teams - equipas
*/
class Competition {
    constructor(id, name, edition, winner, state, teams) {
        this.id = id;
        this.name = name;
        this.edition = edition;

        if(state === winner)//deixa de ser necessário atribuir um valor ao criar uma competição
            this.winner = ''
        else
            this.winner = winner;

        if(state === undefined)//deixa de ser necessário atribuir um valor ao criar uma competição
            this.state = false
        else
            this.state = state;

        this.teams = teams;

    }
}