"use strict";

/** 
* @class Guarda toda informação necessaria na execução do exercicio 
* @constructs Informacao
* @param {string} id - id do elemento HTML que contém a informação.
* 
* @property {string} id - id do elemento HTML que contém a informação.
* @property {Country[]} countries - Array de objetos do tipo country, para guardar todos os countries do nosso sistema
* @property {Player[]} unemployedPlayers - Array de objetos do tipo player, guarda jogadores sem equipa
* @property {Team[]} teams - Array de objetos do tipo player, guarda equipas e os seus jogadores
* @property {Competition[]} competitions - Array de objetos do tipo player, guarda competições com equipas conforme adicionadas
* @property {Array} backHistory - Array de objetos do tipo player, guarda competições com equipas conforme adicionadas 
                                    [nome(opcional), Array, indexPai(opcional), isWinner(opcional, boolean), toAdd(opcional, boolean)]
*/
class Information {
    constructor(id) {
        this.id = id;
        this.countries = [];
        this.unemployedPlayers = [];
        this.teams = [];
        this.competitions = [];
        this.backHistory = [];
    }

    /* SHOW */
    showHome() {
        /** Actualizar a navegação */
        removeActiveClass()
        addActive('homeAnchor')
        updateDynamicAction()
        /** Actualizar as tabs */
        disableTab()
        hideTab('showTab')
        hideTab('formTab')
        /** Actualizar o título */
        updateDynamicView()

        /** Alternar conteudo */
        const div = document.querySelector('#contentTable')

        while (div.hasChildNodes() && typeof div.children[0] === 'object') { //segunda condição para previnir que ocorra um erro
            div.removeChild(div.children[0]);
        }

        /** Esconder o formulário */
        showOneHideOther('', 'contentTable')
        showOneHideOther('', 'forms')
    }

    showCountries() {
        /** Actualizar a navegação */
        removeActiveClass()
        addActive('countriesAnchor')
        this.showData()
        /** Actualizar as tabs */
        showTab('showTab')
        hideTab('formTab')
        disableTab()
        /** Actualizar o título */
        updateDynamicView()

        /** Alternar conteudo */
        updateTableContent(this.countries, 'ID', 'Name', 'Short Name')
    }

    showCompetitions() {
        /** Actualizar a navegação */
        removeActiveClass()
        addActive('competitionsAnchor')
        this.showData()

        /** Actualizar as tabs */
        showTab('showTab')
        showTab('formTab')
        disableTab()

        /** Actualizar o título */
        updateDynamicView()

        /** Alternar conteudo */
        updateTableContent(this.competitions, 'ID', 'Name', 'Edition', 'Winner', 'State', 'View Teams')

        this.resetHistory()//evitar problemas
    }

    showTeams(backHistory) {
        /** Actualizar a navegação */
        removeActiveClass()
        addActive('teamsAnchor')
        this.showData()

        /** Actualizar as tabs */
        showTab('showTab')
        if (this.backHistory.length === 0) {//se nao houver historico, mostrar form
            disableTab()
            showTab('formTab')
        }

        /** Actualizar o título */
        updateDynamicView()

        /* Verificar se há historico */
        if (this.backHistory.length > 0) {
            const lastHistory = backHistory
            /** Alternar conteudo */
            this.findCompetitionTeams(lastHistory[0], lastHistory[1])
        } else {
            /** Alternar conteudo */
            this.findCompetitionTeams(undefined, this.teams)
        }
    }

    showPlayers() {
        /** Actualizar o título */
        removeActiveClass()
        addActive('playersAnchor')
        this.showData()

        /** Actualizar as tabs */
        showTab('showTab')
        if (this.backHistory.length === 0) {//se nao houver historico, mostrar form
            disableTab()

            showTab('formTab')
        }

        /** Actualizar o título */
        updateDynamicView()

        /* Verificar se há historico */
        if (this.backHistory.length > 1) {
            const lastHistory = this.backHistory[this.backHistory.length - 1]
            /** Alternar conteudo */
            this.findTeamPlayers(lastHistory[0], lastHistory[1])
        } else {
            /** Alternar conteudo */
            this.findTeamPlayers(undefined, this.unemployedPlayers)
        }
    }

    findTeamPlayers(teamName, players) {
        /** Actualizar o título */
        updateDynamicView(teamName)
        updateDynamicAction()

        /** Alternar conteudo */
        updateTableContent(calculateAge(players), 'ID', 'Name', 'Age', 'Country', 'Heigth', 'Position')
    }

    findCompetitionTeams(CompetitonName, teams) {
        /** Actualizar o título */
        updateDynamicView(CompetitonName)

        if (this.backHistory[0] && this.backHistory[0][4] === true)
            var action = "Adding Teams"

        updateDynamicAction(action)

        /** Alternar conteudo */
        updateTableContent(teams, 'ID', 'Name', 'Acronym', 'Country', 'Description', 'View Players')
    }

    /* Mostrar arrays dentro de arrays */
    seeDetails(id, isWinner) {
        switch (navLinkName()) {
            case 'Teams':
                let indexTeam
                let teamArray
                var lastHistory = this.backHistory.slice(-1)[0]//ultima posicao do historico altera-lo
                //estamos nas equipas
                //OU estamos numa equipa vencedora
                //OU estamos nas equipas que podem ser adicionadas a uma competição
                if (this.backHistory.length === 0 || this.backHistory.slice(-1)[0][3] === true || this.backHistory.slice(-1)[0][4] === true) {
                    teamArray = this.teams
                }
                else {//estamos na competicao de uma equipa
                    const compArray = lastHistory[1] //array
                    const compIndex = lastHistory[2] //index do pai
                    teamArray = compArray[compIndex].teams//equipas da liga
                }

                indexTeam = teamArray.findIndex(team => team.id === id)

                if (indexTeam > -1) {
                    if (teamArray[indexTeam].players.length === 0) {
                        showToast()
                        return
                    }

                    //verifica se é equipa dentro ou fora de competição
                    if (lastHistory && lastHistory[2] > -1) {
                        //verificar se é equipa vencedora
                        if (lastHistory[3] && lastHistory[3] === true)
                            this.backHistory.push([this.competitions[lastHistory[2]].name + ' "Winner"', [this.competitions[lastHistory[2]].winner]])
                        else if (lastHistory[4] && lastHistory[4] === true) {
                            //verificar se as equipas vêm do menu de adicionar
                            this.backHistory.push([lastHistory[0], getToAddTeams(this.teams, this.competitions[lastHistory[2]])])
                        }
                        else//é equipa participante apenas
                            this.backHistory.push([this.competitions[lastHistory[2]].name, this.competitions[lastHistory[2]].teams])

                    } else {
                        //então é porque está na lista de equipas, não numa comeptição
                        this.backHistory.push([undefined, this.teams])
                    }

                    this.findTeamPlayers(teamArray[indexTeam].name, teamArray[indexTeam].players)
                    removeActiveClass()
                    addActive('playersAnchor')
                    activateTab()
                    showTab('showTab')
                    hideTab('formTab')
                } else
                    console.error('Equipa nao encontrada?')

                break;
            case 'Competitions':
                const indexComp = this.competitions.findIndex(competition => competition.id === id)
                if (indexComp > -1) {
                    if (this.competitions[indexComp].teams.length === 0) {
                        /* console.error("Registos não encontrados") */
                        showToast()
                        break
                    }

                    if (!isWinner) {/* Caso não seja para mostrar o vencedor de um torneio */
                        //adiciona ao historico
                        this.backHistory.push([undefined, this.competitions, indexComp])
                        //mostra as equipas da competicao
                        this.findCompetitionTeams(this.competitions[indexComp].name, this.competitions[indexComp].teams)
                    } else {
                        /* o backHistory recebe o nome de apresentação e o array */
                        this.backHistory.push([undefined, this.competitions, indexComp, isWinner])
                        //mostra a equipa vencedora
                        this.findCompetitionTeams(this.competitions[indexComp].name + ' "Winner"', [this.competitions[indexComp].winner])
                    }
                }
                removeActiveClass()
                addActive('teamsAnchor')
                activateTab()
                showTab('showTab')
                hideTab('formTab')
                break;
        }
    }

    /**
     * Apagar o historico, afinal de contas o utilizador navegou para uma nova aba
     */

    resetHistory() {
        this.backHistory = []
    }

    /* Mostra a tabela*/
    showData() {
        alternateTabs(0)
        showOneHideOther('contentTable', 'forms')
        updateDynamicAction()
    }

    /* Mostra o form*/
    showForm(action, view) {
        hideErrors(); //vai esconder os erros das validaçoes
        alternateTabs(1)
        showOneHideOther('forms', 'contentTable')
        const currentAction = action || 'Creating'
        updateDynamicAction(currentAction)
        toggleFormButtons(currentAction)

        //Caso seja recebido por parâmetro
        if (view) {
            document.querySelector('#dynamicView').textContent = view
        }

        //* Select countries */
        const firstCountryConversion = document.querySelectorAll('.contriesSelect option')/* encontrar quantas opções têm os selects dos paises  */

        if (firstCountryConversion.length === 2) {/* assim não repete, pois devem apenas existir duas vezes uma mensagem "escolha um pais" */
            const selects = document.querySelectorAll('.contriesSelect');

            selects.forEach((select) => {
                this.countries.forEach((country) => {
                    const option = document.createElement('option');
                    option.value = country.id;
                    option.textContent = country.name;
                    select.appendChild(option);
                })
            })
        }

        /* Associar o form a mostrar */
        switch (navLinkName()) {
            case 'Competitions':
                hideFormsExceptOne('competitionForm')
                break;
            case 'Teams':
                hideFormsExceptOne('teamForm')
                break;
            case 'Players':
                hideFormsExceptOne('playerForm')
                break;
        }

    }

    selectPreviousTab() {
        const lastHistory = this.backHistory.pop()
        switch (navLinkName()) {
            case 'Teams':
                this.showCompetitions()
                break;
            case 'Players':
                this.showTeams(lastHistory)//aqui é necessário
                break;
        }
        if (this.backHistory.length === 0) {
            disableTab()
            showTab('formTab')
        }
    }

    /**
     * Criar objetos de cada classe
     */

    addCountry(id, name, shortName) {
        /** Obter dados e criar país */
        const country = new Country(id, name, shortName)
        this.countries.push(country)
    }
    /* Fazer um add para todas as outras páginas */

    addPlayer(id, name, birthDate, idCountry, height, position) {
        const player = new Player(id, name, birthDate, idCountry, height, position)
        this.unemployedPlayers.push(player);
    }

    addTeam(id, name, acronym, players, idCountry, description) {
        const team = new Team(id, name, acronym, players, idCountry, description)
        this.teams.push(team)
    }

    addCompetition(id, name, date, teams, winner) {
        const competition = new Competition(id, name, date, teams, winner)
        this.competitions.push(competition)
    }

    /**
     * Adicionar registos através dos forms
     */

    addNewPlayer() {
        //const id = generateId(); experiencia para criar o id
        const name = document.getElementById("playerName").value.trim();
        const birthDate = document.getElementById("playerBirthDate").value.trim();

        //buscar os dados ao dropbox dos paises
        const idCountry = parseInt(document.querySelector('#playerCountry').value);
        const height = document.getElementById("playerHeight").value.trim();

        //buscar os dados ao dropbox da posicao
        const position = document.querySelector('#playerPosition').value

        //o novo id criado sera sempre um acima, se houver 5. o prox tem o id 6
        const id = (this.unemployedPlayers.length + 1) || 1; //caso seja o primeiro registo, começa a 1

        //validar os dados

        if (!validatePlayer(name, birthDate, idCountry, height, position)) {
            return;
        }

        const minMaxDate = document.getElementById("playerBirthDate")
        if (!firstIsOlder(minMaxDate.min, birthDate) || !firstIsOlder(birthDate, minMaxDate.max)) {
            showError('playerBirthDate', "Introduza uma data entre 1980 e 2007")
            return
        }

        /* Criar objeto */
        const p = new Player(id, name, birthDate, idCountry, height, position, [])

        /* Limpar form */
        document.querySelector('#playerForm form').reset()

        this.unemployedPlayers.push(p)
        console.log(this.unemployedPlayers);
        this.showPlayers()
    }

    addNewTeam() {
        const name = document.getElementById("teamName").value.trim();
        const acronym = document.getElementById("teamAcronym").value.trim();

        //buscar os dados ao dropbox dos paises
        const idCountry = parseInt(document.querySelector('#teamCountry').value);
        const description = document.getElementById("teamObservations").value.trim();
        const id = (this.teams.length + 1) || 1;
        const players = [];

        //validar os dados

        if (!validateTeam(name, acronym, idCountry, description)) {
            return;
        }

        /* Limpar form */
        document.querySelector('#teamForm form').reset()

        /* Criar objeto */
        const t = new Team(id, name, acronym, idCountry, description, players)
        this.teams.push(t)
        console.log(this.teams);
        this.showTeams()
    }

    addNewCompetition() {
        const id = (this.competitions.length + 1) || 1;
        //trim para remover espaço branco a frente e no fim, no caso for inserido espaços
        const name = document.getElementById("competitionName").value.trim();
        const date = document.getElementById("competitionEdition").value.trim();
        const teams = [];
        const winner = "";

        //validar o nome e date
        if (!validateCompetition(name, date)) {
            return;
        }
        /* Limpar form */
        document.querySelector('#competitionForm form').reset()

        /* Criar objeto */
        const c = new Competition(id, name, date, winner, teams)
        this.competitions.push(c);
        console.log(this.competitions)
        this.showCompetitions()
    }

    /**
     * Eliminar registos
     */
    removeRow(id) {
        /* A tab está certa? */
        //verificar o valor, se aceitou ou nao
        switch (navLinkName()) {
            case 'Competitions'://nao ha competicoes de dentro
                var index = this.competitions.findIndex(team => team.id === id)
                if (index > -1) {
                    showModal("Delete?", "Are you sure you want to delete the competition '" + this.competitions[index].name + "' ?")
                    //await function
                    this.competitions.splice(index, 1)
                    this.showCompetitions()
                }
                break;
            case 'Teams':
                if (this.backHistory.length === 0) {//estamos a mexer nas equipas de fora?
                    var index = this.teams.findIndex(team => team.id === id)
                    if (index > -1) {
                        showModal("Delete?", "Are you sure you want to delete the team '" + this.teams[index].name + "' ?")
                        this.teams.splice(index, 1)
                        this.showTeams()
                    }
                } else {//com historico
                    const name = document.querySelector('#dynamicView').textContent
                    //(-1) - ultima pos do array | [1] array do historico
                    const lastHistory = this.backHistory.slice(-1)[0][1]
                    const parentIndex = lastHistory.findIndex(item => item.name === name)

                    var array = lastHistory[parentIndex].teams
                    var index = array.findIndex(item => item.id === id)
                    if (index > -1) {
                        showModal("Delete?", "Are you sure you want to delete the team '" + array[index].name + "' from '" + name + "' ?")
                        array.splice(index, 1)

                        //Mostrar equipas dentro da competição
                        this.findCompetitionTeams(name, array)
                    }

                }
                break;
            case 'Players':
                if (this.backHistory.length === 0) {//estamos a mexer nos jogadores de fora?
                    var index = this.unemployedPlayers.findIndex(team => team.id === id)
                    if (index > -1) {
                        showModal("Delete?", "Are you sure you want to delete the player '" + this.unemployedPlayers[index].name + "' ?")
                        this.unemployedPlayers.splice(index, 1)
                        this.showPlayers()
                    }
                } else {//com historico
                    const name = document.querySelector('#dynamicView').textContent
                    //(-1) - ultima pos do array | [1] array do historico
                    const lastHistory = this.backHistory.slice(-1)[0][1]
                    const parentIndex = lastHistory.findIndex(item => item.name === name)

                    var array = lastHistory[parentIndex].players
                    var index = array.findIndex(item => item.id === id)
                    if (index > -1) {
                        showModal("Fire?", "Are you sure you want to fire the player '" + array[index].name + "' from '" + name + "' ?")

                        //jogador despedido muda de sitio, nao eliminado
                        let player = array.splice(index, 1)[0]
                        //o id passa a ser a seguir ao id do ultimo jogador
                        player.id = (this.unemployedPlayers.slice(-1)[0].id + 1)
                        this.unemployedPlayers.push(player)
                        //Mostrar equipas dentro da competição

                        this.findCompetitionTeams(name, array)
                    }

                }
                break;
        }
    }

    editRow(id) {
        /* A tab está certa? */
        switch (navLinkName()) {
            case 'Competitions':
                /* Encontrar id */
                var index = this.competitions.findIndex(competition => competition.id === id)
                if (index > -1) {
                    const comp = this.competitions[index];
                    this.showForm('Editing');

                    /* Preencher os campos do form com os valores guardados */

                    document.getElementById('competitionName').value = comp.name;
                    document.getElementById('competitionEdition').value = comp.edition;
                    const compEditButton = document.getElementById('compEdit')

                    //funcao handle da informaçao
                    const editCompetition = (event) => {
                        compEditButton.removeEventListener('click', editCompetition);

                        //criar variaveis para receber nome e edition e usar o construtor ja criado, feito
                        let nomeTemp = document.getElementById('competitionName').value.trim();
                        let editionTemp = document.getElementById('competitionEdition').value.trim();

                        const newCompetition = new Competition(comp.id, nomeTemp, editionTemp, comp.winner, comp.teams);

                        /* Validar a formatação da informação */
                        if (!validateCompetition(newCompetition.name, newCompetition.edition)) {
                            compEditButton.removeEventListener('click', editCompetition);
                            compEditButton.addEventListener('click', editCompetition);
                            return;
                        }

                        showModal("Edit?", "Are you sure you want to edit this competition?")

                        /* Fazer as alterações no array */
                        this.competitions[index] = newCompetition;
                        /* Chamar show competição (neste caso) */
                        document.querySelector('#teamForm form').reset()
                        this.showCompetitions();
                    };
                    compEditButton.addEventListener('click', editCompetition);
                }
                break;

            case 'Teams':

                var index = this.teams.findIndex(team => team.id === id)
                if (index > -1) {
                    const team = this.teams[index];
                    this.showForm('Editing');

                    /* Preencher os campos do form com os valores guardados */
                    document.getElementById('teamName').value = team.name;
                    document.getElementById('teamAcronym').value = team.acronym;
                    document.getElementById('teamCountry').value = team.idCountry;
                    document.getElementById('teamObservations').value = team.description;

                    const teamEditButton = document.getElementById('teamEdit')
                    const editTeam = (event) => {

                        teamEditButton.removeEventListener('click', editTeam)
                        let nomeTemp = document.getElementById('teamName').value.trim()
                        let acronymTemp = document.getElementById('teamAcronym').value.trim()
                        let countryTemp = parseInt(document.getElementById('teamCountry').value)
                        let observationTemp = document.getElementById('teamObservations').value.trim()

                        const newTeam = new Team(team.id, nomeTemp, acronymTemp, countryTemp, observationTemp, team.players)
                        //validar os dados

                        if (!validateTeam(newTeam.name, newTeam.acronym, newTeam.idCountry, newTeam.description)) {
                            teamEditButton.removeEventListener('click', teamEditButton);
                            teamEditButton.addEventListener('click', teamEditButton);
                            return;
                        }

                        showModal("Edit?", "Are you sure you want to edit this team?")

                        this.teams[index] = newTeam
                        this.showTeams();
                    };
                    teamEditButton.addEventListener('click', editTeam);
                }
                break;
            case 'Players':

                var index = this.unemployedPlayers.findIndex(player => player.id === id)
                if (index > -1) {
                    const player = this.unemployedPlayers[index];
                    this.showForm('Editing');

                    /* Preencher os campos do form com os valores guardados */
                    document.getElementById('playerName').value = player.name;
                    document.getElementById('playerBirthDate').value = player.birthDate;
                    document.getElementById('playerHeight').value = player.height;
                    document.getElementById('playerPosition').value = player.position;
                    document.getElementById('playerCountry').value = player.idCountry;

                    const playerEditButton = document.getElementById('playerEdit')
                    const editPlayer = (event) => {

                        playerEditButton.removeEventListener('click', editPlayer)
                        let nomeTemp = document.getElementById('playerName').value.trim()
                        let birthdateTemp = document.getElementById('playerBirthDate').value.trim()
                        let heightTemp = document.getElementById('playerHeight').value.trim()
                        let posTemp = document.querySelector('#playerPosition').value
                        let countryTemp = parseInt(document.getElementById('playerCountry').value)

                        const newPlayer = new Player(player.id, nomeTemp, birthdateTemp, countryTemp, heightTemp, posTemp)
                        console.log(newPlayer)
                        //validar os dados

                        if (!validatePlayer(newPlayer.name, newPlayer.birthDate, newPlayer.idCountry, newPlayer.height, newPlayer.position)) {
                            playerEditButton.removeEventListener('click', playerEditButton);
                            playerEditButton.addEventListener('click', playerEditButton);
                            return;
                        }

                        showModal("Edit?", "Are you sure you want to edit this player?")

                        this.unemployedPlayers[index] = newPlayer
                        this.showPlayers();
                    };
                    playerEditButton.addEventListener('click', editPlayer);
                }
                break;
        }
    }

    addChilds(id) {
        switch (navLinkName()) {
            case 'Competitions':
                const maxEquipas = 16
                //encontrar id
                const competition = this.competitions.find(competition => id === competition.id)
                if (competition) {//se econtrou
                    if (competition.teams.length < maxEquipas) {//quantas equipas tem?
                        //chamar funcao que apresenta as equipas

                        const indexParent = this.competitions.findIndex(comp => comp.id === id)
                        if (indexParent > -1)
                            //enviar o array e o index
                            this.childToAdd(competition, indexParent)
                        else
                            console.error('Id não encontrado?')
                    } else {
                        //TALVEZ mudar icone, pois esta cheio
                        showToast()

                    }
                }
                break
            case 'Teams':
                //Aqui
                break
        }
    }

    childToAdd(parent, parentIndex) {
        switch (navLinkName()) {
            case 'Competitions':
                //spread operator divide os elemtnos do array
                let teams = [...this.teams] //chavetas retas volta a meter num array, ou seja, parte a ligação de endereço

                /* Ver equipas que podem ser adicionadas */
                let teamsToShow = getToAddTeams(teams, parent);

                //verifica se existem equipas que podem ser adicionadas
                if (teamsToShow.length == 0) {
                    showToast()
                    return
                }

                this.backHistory.push([parent.name, this.competitions, parentIndex, false, true])

                this.findCompetitionTeams(parent.name, teamsToShow)

                //Fazer alterações cosméticas
                //updateDynamicAction('Adding Teams') -> feito diretamente no findCompetitionTeams
                removeActiveClass()
                addActive('teamsAnchor')
                activateTab()
                showTab('showTab')
                hideTab('formTab')
                break
            case 'Teams':
                //Aqui
                break
        }
    }

    /**
     * Receber um id da equipa a adicionar a uma competição
     */
    addOneChild(id) {
        switch (navLinkName()) {
            case 'Teams':
                const teamIndex = this.teams.findIndex(t => t.id === id)
                if (teamIndex > -1) {
                    //recebe a equipa especifica
                    const teamToAdd = this.teams.slice(teamIndex, teamIndex + 1)[0]
                    //recebe a comp especifica
                    const competition = this.backHistory[0][1][this.backHistory[0][2]]
                    //adiciona
                    competition.teams.push(teamToAdd)
                    showToast("Sucess", `${teamToAdd.name} added to ${competition.name} successfully`)

                    this.selectPreviousTab()
                } else
                    console.error('Não encontrou equipa?')
                break
            case 'Players':
                //Aqui
                break
        }
    }

}
