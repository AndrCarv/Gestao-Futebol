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
* @property {Array} backHistory - Array de objetos do tipo player, guarda competições com equipas conforme adicionadas [nome, Array]
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
    
    showCountries(){
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

    showCompetitions(){
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
    }

    showTeams(){
        /** Actualizar a navegação */
        removeActiveClass()
        addActive('teamsAnchor')
        this.showData()

        /** Actualizar as tabs */
        showTab('showTab')
        if(this.backHistory.length === 0){//se houver historico, deve-se manter as tabs
            disableTab()
            showTab('formTab')
        }

        /** Actualizar o título */
        updateDynamicView()

        /* console.log(this.backHistory) */
        /* Verificar se há historico */
        if(this.backHistory.length > 0){
            const pop = this.backHistory.pop()
            /** Alternar conteudo */
            this.findCompetitionTeams(pop[0], pop[1])
        }else{
            /** Alternar conteudo */
            this.findCompetitionTeams(undefined, this.teams)
        }  
    }

    showPlayers(){
        /** Actualizar o título */
        removeActiveClass()
        addActive('playersAnchor')
        this.showData()

        /** Actualizar as tabs */
        showTab('showTab')
        if(this.backHistory.length === 0){//se houver historico, deve-se manter as tabs
            disableTab()
            showTab('formTab')
        }

        /** Actualizar o título */
        updateDynamicView()

        /* console.log(this.backHistory) */
        /* Verificar se há historico */
        if(this.backHistory.length > 0){
            const pop = this.backHistory.pop()
            /** Alternar conteudo */
            this.findTeamPlayers(pop[0], pop[1])
        }else{
            /** Alternar conteudo */
            this.findTeamPlayers(undefined, this.unemployedPlayers)
        }  
    }

    findTeamPlayers(teamName, players){
        /** Actualizar o título */
        updateDynamicView(teamName)

        /** Alternar conteudo */
        updateTableContent(calculateAge(players), 'ID', 'Name', 'Age', 'Country', 'Heigth', 'Position')
    }

    findCompetitionTeams(CompetitonName, teams){
        /** Actualizar o título */
        updateDynamicView(CompetitonName)

        /** Alternar conteudo */
        updateTableContent(teams, 'ID', 'Name', 'Acronym', 'Country', 'Description', 'View Players')
    }

    /* Show Nested Arrays */
    seeDetails(id, isWinner){
        const links = document.querySelectorAll('#anchorList a')
        links.forEach(link => {
            const element = document.querySelector('#' + link.id)
            if(element.classList.contains('active')){
                switch(element.textContent){
                    case 'Teams':
                        const indexPlayer = this.teams.findIndex(team => team.id === id)
                            if(indexPlayer > -1){
                                if(this.teams[indexPlayer].players.length === 0){
                                    /* console.error("Registos não encontrados") */
                                    break
                                }
                                /* this.backHistory.push([this.teams[indexPlayer].name, this.teams[indexPlayer].players]) */
                                this.findTeamPlayers(this.teams[indexPlayer].name, this.teams[indexPlayer].players)
                                removeActiveClass()
                                addActive('playersAnchor')
                                activateTab()
                                showTab('showTab')
                                hideTab('formTab')
                            }
                        break;
                    case 'Competitions':
                        const indexTeam = this.competitions.findIndex(competition => competition.id === id)
                        if(indexTeam > -1){
                            if(this.competitions[indexTeam].teams.length === 0){
                                /* console.error("Registos não encontrados") */
                                break
                            }

                            if(!isWinner){/* Caso seja para mostrar o vencedor de um torneio */
                                this.backHistory.push([this.competitions[indexTeam].name, this.competitions[indexTeam].teams])
                                this.findCompetitionTeams(this.competitions[indexTeam].name, this.competitions[indexTeam].teams)
                            }else{/* o backHistory recebe o nome de apresentação e o array */
                                this.backHistory.push([this.competitions[indexTeam].winner.name, this.competitions.winner])
                                this.findCompetitionTeams(this.competitions[indexTeam].winner.name, [this.competitions[indexTeam].winner])
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
        })
    }

    /**
     * Apagar o historico, afinal de contas o utilizador navegou para uma nova aba
     */

    resetHistory(){
        this.backHistory = []
    }
    
    /* Mostra a tabela*/
    showData(){
        alternateTabs(0)
        showOneHideOther('contentTable', 'forms')
        updateDynamicAction()
    }

    /* Mostra o form*/
    showForm(){
        alternateTabs(1)
        showOneHideOther('forms', 'contentTable')
        updateDynamicAction('Creating')

        //* Select countries working */
        const firstCountryConversion = document.querySelectorAll('.contriesSelect option')/* encontrar quantas opções têm os selects dos paises  */

        if(firstCountryConversion.length === 2){/* assim não repete, pois devem apenas existir duas vezes uma mensagem "escolha um pais" */
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
        const links = document.querySelectorAll('#anchorList a')
        links.forEach(link => {
            const element = document.querySelector('#' + link.id)
            if(element.classList.contains('active')){
                switch(element.textContent){
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
        })
        
    }

    selectPreviousTab(){
        const links = document.querySelectorAll('#anchorList a')
        links.forEach(link => {
            const element = document.querySelector('#' + link.id)
            if(element.classList.contains('active')){
                switch(element.textContent){
                    case 'Teams':
                        this.showCompetitions()
                        break;
                    case 'Players':
                        this.showTeams()
                        break;
                }
            }
        })
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

    addPlayer(id, name, birthDate, idCountry, height, position){
        const player = new Player(id, name, birthDate, idCountry, height, position)
        this.unemployedPlayers.push(player);
    }

    addTeam(id, name, sigla, players, idCountry, description){
        const team = new Team(id, name, sigla, players, idCountry, description)
        this.teams.push(team)
    }
    
    addCompetition(id, name, date, teams, winner, state){
        const competition = new Competition(id, name, date, teams, winner, state) 
        this.competitions.push(competition)
    }

    /**
     * Adicionar registos através dos forms
     */

    addNewPlayer(){
        hideErrors()
        //const id = generateId(); experiencia para criar o id
        const name = document.getElementById("playerName").value.trim();
        const birthDate = document.getElementById("playerBirthDate").value.trim();
        
        //buscar os dados ao dropbox dos paises
        const idCountry = parseInt(document.querySelector('#playerCountry').value);
        const height = document.getElementById("playerHeight").value.trim();
        
        //buscar os dados ao dropbox da posicao
        const position = document.querySelector('#playerPosition').value

        //o novo id criado sera sempre um acima, se houver 5. o prox tem o id 6
        const id = info.unemployedPlayers.length + 1 ;
        
        //validar os dados
        if (!name || !birthDate || !idCountry || !height || !position) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if(!onlyLetters(name)){
            console.error('Nome com caracteres estranhos?!')
            showError('playerName', "O nome só deve possuir letras")
            return
        }

        if(!inInterval(name, 3, 20)){
            console.error('Com um nome desse tamanho deves ser monarca!')
            return
        }

        if(height < 1.5 || height > 2.4){
            console.error('Tás grande pá!')
            return
        }
        
        const minMaxDate = document.getElementById("playerBirthDate")
        if(!firstIsOlder(minMaxDate.min, birthDate) || !firstIsOlder(birthDate, minMaxDate.max)){
            console.error('O jogador tem uma idade duvidosa não?')
            return
        }

        /* Limpar form */
        document.querySelector('#playerForm form').reset()

        /* Criar objeto */
        const p = new Player(id, name, birthDate, idCountry, height, position, [])
        this.unemployedPlayers.push(p)
        console.log(info.unemployedPlayers);
        this.showPlayers()
    }

    addNewTeam(){
        const name = document.getElementById("teamName").value.trim();
        const acronym = document.getElementById("teamAcronym").value.trim();

        //buscar os dados ao dropbox dos paises
        const idCountry = parseInt(document.querySelector('#teamCountry').value);
        const description = document.getElementById("teamObservations").value.trim();
        const id = info.teams.length + 1 ;
        const players = [];

        //validar os dados
        if (!name || !acronym || !idCountry) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if(!onlyLetters(name)){
            console.error('Nome com caracteres estranhos?!')
            return
        }

        if(!inInterval(name, 3, 20)){
            console.error('Com um nome desse tamanho deves ser monarca!')
            return
        }

        if(!onlyLetters(acronym)){
            console.error('Acronimo so pode ter letras')
            return
        }

        if(!inInterval(acronym, 3, 4)){
            console.error('Acronimo muito grande!')
            return
        }

        if(!inInterval(description, 0, 30)){
            console.error('Com um nome desse tamanho deves ser monarca!')
            return
        }

        /* Limpar form */
        document.querySelector('#teamForm form').reset()

        /* Criar objeto */
        const t = new Team(id, name, acronym, idCountry, description, players)
        this.teams.push(t)
        console.log(info.teams);
        this.showTeams()
    }

    addNewCompetition(){
        const id = info.competitions.length + 1;
        //trim para remover espaço branco a frente e no fim, no caso for inserido espaços
        const name = document.getElementById("competitionName").value.trim();
        const date = document.getElementById("competitionEdition").value.trim();
        const teams = [];
        const winner = "";
        const state = false;//ainda nao acabou
        
        //validar o nome e date
        if (!name || !date) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if(!onlyLetters(name)){
            console.error('Nome com caracteres estranhos?!')
            return
        }

        if(!inInterval(name, 3, 20)){
            console.error('Com um nome desse tamanho deves ser monarca!')
            return
        }

        const dateLimits = document.getElementById("competitionEdition")
        if(date < dateLimits.min || date > dateLimits.max){
            console.error('Por favor introduza uma ano entre ' + dateLimits.min + ' e ' + dateLimits.max)
            return
        }

        /* Limpar form */
        document.querySelector('#competitionForm form').reset()

        /* Criar objeto */
        const c = new Competition(id, name, date, winner, state, teams)
        this.competitions.push(c);
        console.log(info.competitions)
        this.showCompetitions()
    }
}
/**
 * Deixa um link nav "selecionado"
 */
function addActive(id){
    document.querySelector('#' + id).classList.add('active')
}

/**
 * Remove a classe de ativação de um link que o tenha
 */
function removeActiveClass(){
    const links = document.querySelectorAll('#anchorList a')
    links.forEach(link => {
        const element = document.querySelector('#' + link.id).classList
        if(element.contains('active'))
            element.remove('active')
    })
}

/**
 * Show and hide tabs
 */

function showTab(tabId){
    document.querySelector('#' + tabId).style.visibility = 'visible'
} 

function hideTab(tabId){
    document.querySelector('#' + tabId).style.visibility = 'hidden'
} 

function disableTab(){
    document.querySelector('#backTab').style.visibility = 'hidden'
} 

/**
 * Ativar e desativar tab para voltar atrás
 */

function activateTab(){
    var tab = document.querySelector('#backTab')
    tab.style.visibility = 'visible'
} 

/**
 *  Entre tab de mostrar e criar registos
 */
function alternateTabs(index){
    const tabs = document.querySelectorAll('.show-form')
    tabs.forEach((tab, thisIndex) =>{
        if(index === thisIndex)
            tab.classList.add('active')
        else
            tab.classList.remove('active')
    })
}

/* Mostra e esconde tabela ou formulario */
function showOneHideOther(show, hide){
    if(show)
        document.querySelector("#" + show).style.display = "block"

    if(hide)
        document.querySelector("#" + hide).style.display = "none"
}

/**
 * Altera o conteúdo da vista dinâmica
 * Caso a mensagem não possua valor, o valor será correspondente à página atual
 */
function updateDynamicView(message){
    if(!message){
        const links = document.querySelectorAll('#anchorList a')
        links.forEach(link => {
            const element = document.querySelector('#' + link.id).classList
            if(element.contains('active'))
                message = link.textContent
        })
    }

    document.querySelector('#dynamicView').textContent = message
}

/**
 * Altera o tipo de conteúdo da vista dinâmica
 */
function updateDynamicAction(action){
    if(!action)
        action = 'Viewing'

    document.querySelector('#dynamicAction').textContent = action
}


/**
 * Serve para preencher uma tabel com os dados de um objeto
 * O array recebe os cabeçalhos 
 */
function updateTableContent(array, ...args){
    if(!array){
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
    thead.appendChild(tableLine(tableHeaders), 'th')
    table.appendChild(thead)

    const tbody = document.createElement('tbody')
    for(const item of array){
        tbody.appendChild(tableLine(item))
    }

    /* Verificar se o array não tem registos */
    if(array.length === 0){
        console.error("Registos não encontrados")
        return
    }

    table.appendChild(tbody)
    const divInfo = document.querySelector('#contentTable')
    divInfo.replaceChildren(table)
}

/**
 * Calcular a idade dos jogadores e devolver os jogadores com a idade em vez da data
 */
function calculateAge(players){
    const agedPlayers = players.map(player => {
        const currentDate = new Date();
        const birthDate = new Date(player.birthDate);

        const diffInMs = currentDate.getTime() - birthDate.getTime()

        const diffInDays = diffInMs / (1000 * 60 * 60 * 24); //Segundo * Minuto * Hora * Dia 

        const age = Math.floor(diffInDays / 365.25) //Dias para ano e converter para número inteiro

        return {id: player.id, name: player.name, 
            birthDate: age, idCountry: player.idCountry,
        height: player.height, position: player.position}
    })
    return agedPlayers
}

/** 
 * Esconde todos os formulários excepto um
 */
function hideFormsExceptOne(id){
    const forms = document.querySelectorAll('#forms .form')

    forms.forEach(form => {
        if(form.id === id){
            form.style.display = 'block'
        }else{
            form.style.display = 'none'
        }
    })
}

/** 
 * Retorna dois anos antes ou dois anos depois do ano atual
 */
function getYear(sum){
    return new Date().getFullYear() + (sum || 0)
}

function getDate(sum){
    const date = new Date(getYear(sum || 0)).toLocaleDateString() //calcula um numero de anos antes do atual
    return date.split('/').reverse().join('-') //troca a ordem e adiciona hifen
}

/**
 * Verificações de inputs
 */
/* Verifica se um input só tem letras */
function onlyLetters(input){
    for(let i = 0; i < input.length; i++){
        if(!(input[i] >= 'a' && input[i] <= 'z') && !(input[i] >= 'A' && input[i] <= 'Z')){
            return false;
        }
    }
    return true;
}

/* Verifica se o comprimento de uma string está dentro de um intervalo */
function inInterval(string, min, max){
    if(string.length >= min && string.length <= max)
        return true

    return false
}

/* Verificar que data é mais antiga */
function firstIsOlder(date1, date2){
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    if(d1.getTime() <= d2.getTime())
        return true
    return false
}

/* Esconder todos os erros */
function hideErrors(){
    const errors = document.querySelectorAll('.invalid-feedback')
    errors.forEach(error =>{
        error.style.display = 'none'
        error.textContent = ''
    })
}

/* Atribuir um erro a um input específico */
function showError(id, message){
    const error = document.querySelector('#'+id).nextElementSibling
    error.style.display = 'block'
    error.textContent = message
}

