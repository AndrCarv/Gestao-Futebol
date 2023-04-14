"use strict";

/** 
* @class description of the class 
* @constructs Team
* @param {int} id - id da equipa
* @param {string} name - nome da equipa
* @param {String} sigla - sigla da equipa
* @param {int} idCountry - id do país
* @param {string} description - descrição da equipa
* @param {Players[]} players - array de players
*/
class Team {
    constructor(id, name, sigla, idCountry, description, players) {
        this.id = id;
        this.name = name;
        this.sigla = sigla;
        this.idCountry = idCountry;
        this.description = description;
        this.players = players;

    }
}