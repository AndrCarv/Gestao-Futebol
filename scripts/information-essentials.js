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
 * Mostrar a tab
 */
function showTab(tabId) {
    document.querySelector('#' + tabId).style.visibility = 'visible'
}
/**
 * Esconder a tab 
 * */
function hideTab(tabId) {
    document.querySelector('#' + tabId).style.visibility = 'hidden'
}
/**
 * Desativar a tab
 */
function disableTab() {
    document.querySelector('#backTab').style.visibility = 'hidden'
}

/**
 * Ativar a tab para voltar atrás
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
 * Serve para preencher uma tabela com os dados de um objeto
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


//Verificações de inputs

/** 
 * Verifica se um input só tem letras 
 */
function onlyLetters(input) {
    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/; //permite letras, espaços e acentos apenas
    if (!regex.test(input))
        return false

    return true;
}

/** 
 * Verifica se o comprimento de uma string está dentro de um intervalo 
 */
function inInterval(string, min, max) {
    if (string.length >= min && string.length <= max)
        return true

    return false
}

/**  
 *Verificar que data é mais antiga 
 */
function firstIsOlder(date1, date2) {
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    if (d1.getTime() <= d2.getTime())
        return true
    return false
}

/**
 *Esconder todos os erros 
 */
function hideErrors() {
    const errors = document.querySelectorAll('.invalid-feedback')
    errors.forEach(error => {
        error.style.display = 'none'
        error.textContent = ''
    })
}

/** 
 *Atribuir um erro a um input específico 
 */
function showError(id, message) {
    const error = document.querySelector('#' + id).nextElementSibling
    error.style.display = 'block'
    error.textContent = message
}

/**
 *Mostrar modal com titulo e mensagem
 */
function showModal(title, message) {
    const myModal = document.querySelector('#modal')
    document.querySelector('#modalTitle').textContent = title || "Confirmation"
    document.querySelector('#modalMessage').textContent = message || "Are you sure you want to save the changes made?"

    const modal = new bootstrap.Modal(myModal)//bootstrap
    modal.show()
}

/** 
 *Mostrar toast com titulo e mensagem
 */
function showToast(title, message) {
    const myToast = document.querySelector('#toast')
    document.querySelector('#toast-title').textContent = title || "Warning"
    document.querySelector('#toast-message').textContent = message || "The current service is not available"

    //bootstrap
    const toast = new bootstrap.Toast(myToast, {
        autohide: true,
        delay: 6000
    })
    toast.show()
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

/*Verificações dos dados*/

/**
 * Verificação dos dados da competição
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

/**
 * Verificação dos dados da equipa
 */
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

/**
 * Verificação dos dados do jogador
 */
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

/**
 * Função responsável por determinar que equipas podem ser adicionadas a dada competição
*/
function getToAddTeams(teams, parent){
    let teamsToShow = []

    //Equipas com menos de 11 jogadores retiradas
    teams.forEach(t => {
        if (t.players.length >= 11) { //caso a equipa tenha menos de 11 jogadores
            teamsToShow.push(t);
        }
    });

    //Equipas repetidas retiradas
    for (const team of teamsToShow) {//equipas disponiveis
        let teamToDelete = false;

        for (const compTeam of parent.teams) {//equipas da competicao
            if (team.name === compTeam.name) {//caso a equipa ja esteja na competicao
                teamToDelete = true;
                break;
            }
        }

        if (teamToDelete) {
            //como se deu break, temos o id correto
            const index = teamsToShow.findIndex(t => t.id === team.id);//encontrar
            if (index > -1) {
                teamsToShow.splice(index, 1);//remover
            }
        }
    }
    return teamsToShow
}


                