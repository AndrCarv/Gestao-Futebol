"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = function (event) {
    var info = new Information("contentTable");//id do div
   

    /** obter dados do armazenamento local */
    window.info = info;
    baseCountry()
    basePosicao()

    if (typeof (Storage) !== undefined) {
        /* Unemployed players */
        let item = localStorage.getItem('unemployedPlayers')
        if(item){
            const storedUnemployedPlayers = JSON.parse(item)
        
            if(storedUnemployedPlayers){
                storedUnemployedPlayers.unemployedPlayers.forEach(p => info.unemployedPlayers.push(new Player(p.id, p.name, p.birthDate, p.idCountry, p.height, p.position)))
            }
        }else{
            basePlayer()
        }
        
        /* Teams */
        item = localStorage.getItem('teams')
        if(item){
            const storedTeams = JSON.parse(item)
        
            if(storedTeams){
                storedTeams.teams.forEach(t => info.teams.push(new Team(t.id, t.name, t.acronym, t.idCountry, t.description, t.players)))
            }
        }else{
            baseTeam()
        }
        

        /* Competitions */
        item = localStorage.getItem('competitions')
        if(item){
            const storedCompetitions = JSON.parse(item)
            if(storedCompetitions){
                /* info.competitions = storedCompetitions.competitions */
                storedCompetitions.competitions.forEach(c => info.competitions.push(new Competition(c.id, c.name, c.edition, c.winner, c.state, c.teams)))
            }
        }else{
            baseCompetition()
        }
        
    }
};

/**
* Função que recebe um qualquer objeto e retorna dinamicamente uma linha de tabela HTML com informação relativa ao estado das suas propriedades
* @param {Object} object - objecto do qual vamos transformar o conteudo dos seus atributos em linhas
* @param {boolean} headerFormat - controla de o formato é cabeçalho ou linha normal
*/
function tableLine(object, headerFormat) {
    var tr = document.createElement("tr");
    var tableCell = null;
    var id = null
    var hasChild = null
    
    for (var property in object) {
        const content = object[property] //desta maneira podemos escolher o texto do cabeçalho da tabela
        if ((object[property] instanceof Function))
            continue;
        if (headerFormat) {
            tableCell = document.createElement("th");
            tableCell.scope = "col" //bootstrap
            tableCell.textContent = content[0].toUpperCase() + content.slice(1);
        } else {
            if(id === null)//verifica o id da linha
                id = content
                
            tableCell = document.createElement("td");
            tableCell.scope = "row" //bootstrap
            if(Array.isArray(content)){//se for um array, ou seja, equipas ou jogadores
                const detailAnchor = document.createElement('a')
                detailAnchor.href = `javascript: info.seeDetails(${id})`//precisamos de possibilitar a vista detalhada
                detailAnchor.innerHTML = '<i class="fa-solid fa-eye seeDetails"></i>'
                tableCell.appendChild(detailAnchor)
                hasChild = true
            }else if (typeof content === "object" && property === 'winner') {//se é o vencedor de um jogo
                const detailAnchor = document.createElement('a')
                                                                //id da equipa-Se é vencedor
                detailAnchor.href = `javascript: info.seeDetails(${id}, true)`//precisamos de possibilitar a vista detalhada
                detailAnchor.innerHTML = content.name//nome da equipa
                detailAnchor.classList.add('seeDetails')
                detailAnchor.classList.add('winnerDetails')

                tableCell.appendChild(detailAnchor)
            }else{
                tableCell.textContent = tableRowConditions(property, content)
            }
        }
        tr.appendChild(tableCell);
    }

    //Remover editar adicionar filhos
    tr = addEditRemoveIcons(tr, id, headerFormat, object instanceof Competition)
    
    return tr;
};

/**
 * Recebe o país para guardar o seu ID e vai returnar o estado competição de acordo com o state da competição
 */
function tableRowConditions(property, content){
    if(property === 'state'){//se for o estado de um campeonato
        if(content === null)
            return 'Waiting'
        else if(content === false)
            return 'Running'
        else
            return 'Finished'
    }

    if(property === 'idCountry'){
        const index = info.countries.findIndex(country => country.id === content)
        if(index > -1)
            content = info.countries[index].name
        else
            console.error('Pais não encontrado')
    }

    if(property === 'position'){
        const index = info.positions.findIndex(position => position.acronym === content)
        if(index > -1)
            content = info.positions[index].name
        else
            console.error('Posição não encontrada')
    }
    return content
}
/**
 * Criação dos botões de add, edit e remove, e as suas
 */
function addEditRemoveIcons(tr, id, headerFormat, isCompetition){
    var tableCell = null
    var competitionState = null

    if(isCompetition){
        const competition = info.competitions.find(c => c.id === id)
        if(competition){
            competitionState = competition.state
        }
    }

    if (info.backHistory.at(-1) && info.backHistory.at(-1)[4] === true) {//se estamos a adicionar filhos
        if(!headerFormat){
            tableCell = document.createElement("td");
            const editAnchor = document.createElement('a')
            editAnchor.href = `javascript: info.addOneChild(${id})`//Alterar consoante necessário
            editAnchor.innerHTML = '<i class="fa-solid fa-circle-plus seeDetails"></i>'
            tableCell.appendChild(editAnchor)
            tr.appendChild(tableCell)
        }else{
            tableCell = document.createElement("th");
            tableCell.textContent = 'Add'
            tr.appendChild(tableCell)
        }
    }else{ 
        // se nao estiver a adicionar filhos
        if(!headerFormat){//celula
            switch(navLinkName()){
                case 'Competitions':
                case 'Teams':
                    if(info.backHistory.length === 0){//nao se pode adicionar nada a filhos
                        /* Adicionar */
                        tableCell = document.createElement("td");
                        const addAnchor = document.createElement('a')
                        if(competitionState !== null)//se a competicao ja tiver comecado
                            addAnchor.href = `javascript: showToast(undefined, 'Competition has already started')`
                        else
                            addAnchor.href = `javascript: info.addChilds(${id})`//recebe o id do pai ao qual serão adicionados filhos
                        
                            addAnchor.innerHTML = '<i class="fa-solid fa-circle-plus seeDetails"></i>'
                        tableCell.appendChild(addAnchor)
                        tr.appendChild(tableCell)
                    }
                    break;
            }
            switch(navLinkName()){//Countries nao alteram
                case 'Competitions':
                case 'Teams':
                case 'Players':
                    if(info.backHistory.length <= 1){//nao se podem eliminar jogadores dentro de equipas dentro de competicoes
                        if(info.backHistory.length === 0){//so se pode editar o principal
                            /* Editar */
                            tableCell = document.createElement("td");
                            const editAnchor = document.createElement('a')
                            if(competitionState !== null)
                                editAnchor.href = `javascript: showToast(undefined, 'Competition has already started')`
                            else
                                editAnchor.href = `javascript: info.editRow(${id})`//Alterar consoante necessário
                            
                            editAnchor.innerHTML = '<i class="fa-solid fa-pencil seeDetails"></i>'
                            tableCell.appendChild(editAnchor)
                            tr.appendChild(tableCell)
                        }
                        
                        /* Remover */
                        //se for vencedor de uma competicao, nao se deve apagar
                        
                            tableCell = document.createElement("td");
                            const deleteAnchor = document.createElement('a')
                            deleteAnchor.href = `javascript: info.removeRow(${id})`//Alterar consoante necessário
                            deleteAnchor.innerHTML = '<i class="fa-solid fa-trash-can seeDetails"></i>'
                            tableCell.appendChild(deleteAnchor)
                            tr.appendChild(tableCell)
                        
                        
                    }
                    break;
            }
        }else{//cabecalho
            var tab = navLinkName()
            if(info.backHistory.length === 0){//nao se pode adicionar nada a filhos
                switch(tab){ //has child nao funciona pois nao existem arrays nos cabecalhos, se tiver duvidas verificar (Array.isArray(content))
                    case 'Competitions':
                        tableCell = document.createElement("th");
                        tableCell.textContent = 'Add Teams'
                        tr.appendChild(tableCell)
                        break;
                    case 'Teams':
                        tableCell = document.createElement("th");
                        tableCell.textContent = 'Add Players'
                        tr.appendChild(tableCell)
                        break;
                } 
            }
            switch(tab){//Countries nao alteram
                case 'Competitions':
                case 'Teams':
                case 'Players':
                    if(info.backHistory.length <= 1){
                        if(info.backHistory.length === 0){
                            //Edit
                            tableCell = document.createElement("th");
                            tableCell.textContent = 'Edit'
                            tr.appendChild(tableCell)
                        }
                        
                        //Remove
                        tableCell = document.createElement("th");
                        tableCell.textContent = 'Remove'
                        tr.appendChild(tableCell)
                        
                    }
                    break;
            }
        }
    }
    
    return tr
}