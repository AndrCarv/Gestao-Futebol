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
* @property {Array} backHistory - Array de objetos do tipo player, guarda competições com equipas conforme adicionadas [nome(opcional), Array, indexPai(opcional)]
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
            /* const lastHistory = this.backHistory[this.backHistory.length - 1] */
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

        /** Alternar conteudo */
        updateTableContent(calculateAge(players), 'ID', 'Name', 'Age', 'Country', 'Heigth', 'Position')
    }

    findCompetitionTeams(CompetitonName, teams) {
        /** Actualizar o título */
        updateDynamicView(CompetitonName)

        /** Alternar conteudo */
        updateTableContent(teams, 'ID', 'Name', 'Acronym', 'Country', 'Description', 'View Players')
    }

    /* Mostrar arrays dentro de arrays */
    seeDetails(id, isWinner) {
        switch (navLinkName()) {
            case 'Teams':
                let indexTeam
                let teamArray
                if (this.backHistory.length === 0) {//estamos nas equipas
                    teamArray = this.teams
                    indexTeam = teamArray.findIndex(team => team.id === id)
                }
                else {//estamos na competicao de uma equipa
                    var lastHistory = this.backHistory.slice(-1)[0]//ultima posicao do historico altera-lo
                    const compArray = lastHistory[1] //array
                    const compIndex = lastHistory[2] //index do pai
                    teamArray = compArray[compIndex].teams//equipas da liga

                    indexTeam = teamArray.findIndex(team => team.id === id)
                }

                if (indexTeam > -1) {
                    if (teamArray[indexTeam].players.length === 0) {
                        /* console.error("Registos não encontrados") */
                        return
                    }

                    //verifica se é equipa dentro ou fora de competição
                    if (lastHistory && lastHistory[2] > -1) {
                        //guarda o anterior/presente
                        this.backHistory.push([this.competitions[lastHistory[2]].name, this.competitions[lastHistory[2]].teams])
                        //mostra o asseguir
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
                }
                break;
            case 'Competitions':
                const indexComp = this.competitions.findIndex(competition => competition.id === id)
                if (indexComp > -1) {
                    if (this.competitions[indexComp].teams.length === 0) {
                        /* console.error("Registos não encontrados") */
                        break
                    }

                    //guarda o anterior/presente
                    this.backHistory.push([undefined, this.competitions, indexComp])
                    //mostra o asseguir

                    if (!isWinner) {/* Caso seja para mostrar o vencedor de um torneio */
                        this.findCompetitionTeams(this.competitions[indexComp].name, this.competitions[indexComp].teams)
                    } else {/* o backHistory recebe o nome de apresentação e o array */
                        this.findCompetitionTeams(this.competitions[indexComp].winner.name, [this.competitions[indexComp].winner])
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

        //edit something
        if (view) {
            document.querySelector('#dynamicView').textContent = view
        }

        //* Select countries working */
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
        const backHistory = this.backHistory.pop()
        switch (navLinkName()) {
            case 'Teams':
                this.showCompetitions()
                break;
            case 'Players':
                this.showTeams(backHistory)//aqui é necessário
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

    addCompetition(id, name, date, teams, winner, state) {
        const competition = new Competition(id, name, date, teams, winner, state)
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
        const id = info.unemployedPlayers.length + 1;

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
        console.log(info.unemployedPlayers);
        this.showPlayers()
    }

    addNewTeam() {
        const name = document.getElementById("teamName").value.trim();
        const acronym = document.getElementById("teamAcronym").value.trim();

        //buscar os dados ao dropbox dos paises
        const idCountry = parseInt(document.querySelector('#teamCountry').value);
        const description = document.getElementById("teamObservations").value.trim();
        const id = info.teams.length + 1;
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
        console.log(info.teams);
        this.showTeams()
    }

    addNewCompetition() {
        const id = info.competitions.length + 1;
        //trim para remover espaço branco a frente e no fim, no caso for inserido espaços
        const name = document.getElementById("competitionName").value.trim();
        const date = document.getElementById("competitionEdition").value.trim();
        const teams = [];
        const winner = "";
        const state = false;//ainda nao acabou

        //validar o nome e date
        if (!validateCompetition(name, date)) {
            return;
        }
        /* Limpar form */
        document.querySelector('#competitionForm form').reset()

        /* Criar objeto */
        const c = new Competition(id, name, date, winner, state, teams)
        this.competitions.push(c);
        console.log(info.competitions)
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
                    info.showForm('Editing');

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

                        const newCompetition = new Competition(comp.id, nomeTemp, editionTemp, comp.winner, comp.state, comp.teams);

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
                        info.showCompetitions();
                    };
                    compEditButton.addEventListener('click', editCompetition);
                }
                break;

            case 'Teams':

                var index = this.teams.findIndex(team => team.id === id)
                if (index > -1) {
                    const team = this.teams[index];
                    info.showForm('Editing');

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
                        info.showTeams();
                    };
                    teamEditButton.addEventListener('click', editTeam);
                }
                break;
            case 'Players':

                var index = this.unemployedPlayers.findIndex(player => player.id === id)
                if (index > -1) {
                    const player = this.unemployedPlayers[index];
                    info.showForm('Editing');

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
                        info.showPlayers();
                    };
                    playerEditButton.addEventListener('click', editPlayer);
                }
                break;
        }
    }

}

/**
 * Retorna o nome do link atual
 */
function navLinkName() {
    var navBarLinkContent = null
    const links = document.querySelectorAll('#anchorList a')
    links.forEach(link => {
        const element = document.querySelector('#' + link.id)
        if (element.classList.contains('active')) {
            navBarLinkContent = element.textContent
        }
    })

    return navBarLinkContent
}


/**
 * Deixa um link nav "selecionado"
 */
function addActive(id) {
    document.querySelector('#' + id).classList.add('active')
}

/**
 * Remove a classe de ativação de um link que o tenha
 */
function removeActiveClass() {
    const links = document.querySelectorAll('#anchorList a')
    links.forEach(link => {
        const element = document.querySelector('#' + link.id).classList
        if (element.contains('active'))
            element.remove('active')
    })
}

/**
 * Show and hide tabs
 */

function showTab(tabId) {
    document.querySelector('#' + tabId).style.visibility = 'visible'
}

function hideTab(tabId) {
    document.querySelector('#' + tabId).style.visibility = 'hidden'
}

function disableTab() {
    document.querySelector('#backTab').style.visibility = 'hidden'
}

/**
 * Ativar e desativar tab para voltar atrás
 */

function activateTab() {
    var tab = document.querySelector('#backTab')
    tab.style.visibility = 'visible'
}

/**
 *  Entre tab de mostrar e criar registos
 */
function alternateTabs(index) {
    const tabs = document.querySelectorAll('.show-form')
    tabs.forEach((tab, thisIndex) => {
        if (index === thisIndex)
            tab.classList.add('active')
        else
            tab.classList.remove('active')
    })
}

/* Mostra e esconde tabela ou formulario */
function showOneHideOther(show, hide) {
    if (show)
        document.querySelector("#" + show).style.display = "block"

    if (hide)
        document.querySelector("#" + hide).style.display = "none"
}

/**
 * Altera o conteúdo da vista dinâmica
 * Caso a mensagem não possua valor, o valor será correspondente à página atual
 */
function updateDynamicView(message) {
    if (!message) {
        const links = document.querySelectorAll('#anchorList a')
        links.forEach(link => {
            const element = document.querySelector('#' + link.id).classList
            if (element.contains('active'))
                message = link.textContent
        })
    }

    document.querySelector('#dynamicView').textContent = message
}

/**
 * Altera o tipo de conteúdo da vista dinâmica
 */
function updateDynamicAction(action) {
    if (!action)
        action = 'Viewing'

    document.querySelector('#dynamicAction').textContent = action
}

/**
 * Verifica o numero de colunas uma pagina pode ter 
 * e retorna um objeto com esse numero de chaves
 */

function getEmptyObject() {
    var emptyObject = {}
    var objectLength = 0
    switch (navLinkName()) {
        case 'Competitions':
            objectLength = Object.keys(new Competition()).length
            break;
        case 'Teams':
            objectLength = Object.keys(new Team()).length
            break;
        case 'Players':
            objectLength = Object.keys(new Player()).length
            break;
    }

    //object keys, chaves enumeraveis de um objeto
    for (let i = 0; i < objectLength; i++) {
        emptyObject[i] = ""
    }

    return emptyObject
}


/**
 * Serve para preencher uma tabel com os dados de um objeto
 * O array recebe os cabeçalhos 
 */
function updateTableContent(array, ...args) {
    if (!array) {
        console.error('O array deve ser enviado por parâmetro')
        return
    }
    var tableHeaders = [...args]

    const table = document.createElement('table')
    table.classList.add('table')
    table.classList.add('table-striped')
    table.classList.add('table-hover')
    table.classList.add('table-bordered')
    /* table.classList.add('table-sm') */

    const thead = document.createElement('thead')
    thead.classList.add('table-success')
    thead.appendChild(tableLine(tableHeaders, true))
    table.appendChild(thead)

    const tbody = document.createElement('tbody')
    for (const item of array) {
        tbody.appendChild(tableLine(item))
    }

    /* Verificar se o array não tem registos */
    if (array.length === 0) {
        console.error("Registos não encontrados")
        //apresentar uma linha vazia
        const emptyObject = getEmptyObject()
        tbody.appendChild(tableLine(emptyObject))
    }

    table.appendChild(tbody)
    const divInfo = document.querySelector('#contentTable')
    divInfo.replaceChildren(table)
}

/**
 * Calcular a idade dos jogadores e devolver os jogadores com a idade em vez da data
 */
function calculateAge(players) {
    const agedPlayers = players.map(player => {
        const currentDate = new Date();
        const birthDate = new Date(player.birthDate);

        const diffInMs = currentDate.getTime() - birthDate.getTime()

        const diffInDays = diffInMs / (1000 * 60 * 60 * 24); //Segundo * Minuto * Hora * Dia 

        const age = Math.floor(diffInDays / 365.25) //Dias para ano e converter para número inteiro

        return {
            id: player.id, name: player.name,
            birthDate: age, idCountry: player.idCountry,
            height: player.height, position: player.position
        }
    })
    return agedPlayers
}

/** 
 * Esconde todos os formulários excepto um
 */
function hideFormsExceptOne(id) {
    const forms = document.querySelectorAll('#forms .form')

    forms.forEach(form => {
        if (form.id === id) {
            form.style.display = 'block'
        } else {
            form.style.display = 'none'
        }
    })
}

/** 
 * Retorna dois anos antes ou dois anos depois do ano atual
 */
function getYear(sum) {
    return new Date().getFullYear() + (sum || 0)
}

function getDate(sum) {
    const date = new Date(getYear(sum || 0)).toLocaleDateString() //calcula um numero de anos antes do atual
    return date.split('/').reverse().join('-') //troca a ordem e adiciona hifen
}

/**
 * Verificações de inputs
 */
/* Verifica se um input só tem letras */
function onlyLetters(input) {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/; //permite letras, espaços e acentos apenas
    if (!regex.test(input))
        return false

    return true;
}

/* Verifica se o comprimento de uma string está dentro de um intervalo */
function inInterval(string, min, max) {
    if (string.length >= min && string.length <= max)
        return true

    return false
}

/* Verificar que data é mais antiga */
function firstIsOlder(date1, date2) {
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    if (d1.getTime() <= d2.getTime())
        return true
    return false
}

/* Esconder todos os erros */
function hideErrors() {
    const errors = document.querySelectorAll('.invalid-feedback')
    errors.forEach(error => {
        error.style.display = 'none'
        error.textContent = ''
    })
}

/* Atribuir um erro a um input específico */
function showError(id, message) {
    const error = document.querySelector('#' + id).nextElementSibling
    error.style.display = 'block'
    error.textContent = message
}

/* Mostrar modal com titulo e mensagem*/

function showModal(title, message) {
    const myModal = document.querySelector('#modal')
    document.querySelector('#modalTitle').textContent = title || "Confirmation"
    document.querySelector('#modalMessage').textContent = message || "Are you sure you want to save the changes made?"

    const modal = new bootstrap.Modal(myModal)//bootstrap
    modal.show()
}

/**
 *Funcao do botao 
 */

function toggleFormButtons(currentAction) {
    switch (currentAction) {
        case 'Editing':
            document.getElementById('compAdd').style.display = 'none'
            document.getElementById('teamAdd').style.display = 'none'
            document.getElementById('playerAdd').style.display = 'none'

            document.getElementById('compEdit').style.display = 'inline-block';
            document.getElementById('teamEdit').style.display = 'inline-block';
            document.getElementById('playerEdit').style.display = 'inline-block';
            break;
        case 'Creating':
        default:
            document.getElementById('compAdd').style.display = ''
            document.getElementById('teamAdd').style.display = 'inline-block'
            document.getElementById('playerAdd').style.display = 'inline-block'

            document.getElementById('compEdit').style.display = 'none';
            document.getElementById('teamEdit').style.display = 'none';
            document.getElementById('playerEdit').style.display = 'none';
            break;
    }
}

/**
 * Verificações dos dados
 */


function validateCompetition(name, date) {
    if (!name || !date) {
        showError('generalError', "Por favor, preencha todos os campos obrigatórios.");
        return false;
    }

    if (!onlyLetters(name)) {
        showError('competitionName', "O nome deve levar só letras")
        return false;
    }

    if (!inInterval(name, 3, 20)) {
        showError('competitionName', "Introduza entre 3 a 20 caracteres")
        return false;
    }

    const dateLimits = document.getElementById("competitionEdition");
    if (date < dateLimits.min || date > dateLimits.max) {
        showError('competitionEdition', "Só possivel criar uma edição com 2 anos de diferença do ano currente")
        return false;
    }

    return true;
}

function validateTeam(name, acronym, idCountry, description) {
    if (!name || !acronym || !idCountry) {
        showError('teamObservations', "Por favor, preencha todos os campos obrigatórios.");
        return false;
    }

    if (!onlyLetters(name)) {
        showError('teamName', "O nome só deve possuir letras")
        return false;
    }

    if (!inInterval(name, 3, 20)) {
        showError('teamName', "Introduza entre 3 a 20 caracteres")
        return false;
    }

    if (!onlyLetters(acronym)) {
        showError('teamAcronym', "O acronimo leva só letras")
        return false;
    }

    if (!inInterval(acronym, 3, 4)) {
        showError('teamAcronym', "Introduza entre 3 a 4 caracteres")
        return false;
    }

    if (!inInterval(description, 0, 30)) {
        showError('teamObservations', "Introduza no máximo 30 caracteres")
        return false;
    }
    return true;
}

function validatePlayer(name, birthDate, idCountry, height, position) {
    if (!name || !birthDate || !idCountry || !height || !position) {
        showError('playerCountry', "Por favor, preencha todos os campos obrigatórios.");
        return false;
    }

    if (!onlyLetters(name)) {
        showError('playerName', "O nome só deve possuir letras")
        return false;
    }

    if (!inInterval(name, 3, 20)) {
        showError('playerName', "Introduza entre 3 a 20 caracteres")
        return false;
    }

    if (height < 1.5 || height > 2.4) {
        showError('playerHeight', "Introduza um valor entre 1.50 a 2.40")
        return false;
    }

    const minMaxDate = document.getElementById("playerBirthDate")
    if (!firstIsOlder(minMaxDate.min, birthDate) || !firstIsOlder(birthDate, minMaxDate.max)) {
        showError('playerBirthDate', "Introduza uma data entre 1980 e 2007")
        return false;
    }
    return true;
}