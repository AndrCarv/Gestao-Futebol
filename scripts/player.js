"use strict";

/** 
* @class Estrutura com capacidade de armazenar o estado de um jogador 
* @constructs Player
* @param {int} id - id do jogador
* @param {string} name - nome do jogador
* @param {Date} birthDate - data de nascimento do jogador
* @param {int} idCountry - id do pais do jogador
* @param {double} height - altura do jogador
* @param {String} position - posição em que o o jogador joga
*/
class Player {
    constructor(id, name, birthDate, idCountry, height, position) {
        this.id = id
        this.name = name
        this.birthDate = birthDate
        this.idCountry = idCountry
        this.height = height
        this.position = position
    }
}