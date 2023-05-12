"use strict";
/**
 * Função que será executada quando a página estiver toda carregada, criando a variável global "info" com um objeto Information
 * @memberof window
 * @params {Event} event - objeto que representará o evento
 */
window.onload = function (event) {
    var info = new Information("contentTable");//id do div

    /** obter dados do armazenamento local */


    /** Países predefinidos (adicionar mais) */
    info.addCountry(1, 'Portugal', 'PT');
    info.addCountry(2, 'Spain', 'ES');
    info.addCountry(3, 'United Kingdom', 'UK');
    info.addCountry(4, 'France', 'FR');
    info.addCountry(5, 'Germany', 'DE');
    info.addCountry(6, 'Italy', 'IT');
    info.addCountry(7, 'Brazil', 'BR');
    info.addCountry(8, 'Argentina', 'AR');
    info.addCountry(9, 'Mexico', 'MX');
    info.addCountry(10, 'Canada', 'CA');
    info.addCountry(11, 'United States', 'US');
    info.addCountry(12, 'Australia', 'AU');
    info.addCountry(13, 'China', 'CN');
    info.addCountry(14, 'Japan', 'JP');
    info.addCountry(15, 'South Korea', 'KR');
    info.addCountry(16, 'India', 'IN');
    info.addCountry(17, 'Russia', 'RU');
    info.addCountry(18, 'South Africa', 'ZA');
    info.addCountry(19, 'Egypt', 'EG');
    info.addCountry(20, 'Nigeria', 'NG');
    info.addCountry(21, 'Saudi Arabia', 'SA');
    info.addCountry(22, 'Turkey', 'TR');
    info.addCountry(23, 'Greece', 'GR');
    info.addCountry(24, 'Sweden', 'SE');
    info.addCountry(25, 'Norway', 'NO');
    info.addCountry(26, 'Denmark', 'DK');
    info.addCountry(27, 'Finland', 'FI');
    info.addCountry(28, 'Netherlands', 'NL');
    info.addCountry(29, 'Belgium', 'BE');
    info.addCountry(30, 'Switzerland', 'CH');


    /** adicionar dados teste */
    info.addPlayer(1, 'Cristiano Ronaldo', '1985-02-05', 1, '1.85', 'AV');
    info.addPlayer(2, 'Sergio Ramos', '1986-03-30', 2, '1.84', 'DF');
    info.addPlayer(3, 'Harry Kane', '1993-07-28', 3, '1.88', 'AV');
    info.addPlayer(4, 'Kylian Mbappé', '1998-12-20', 4, '1.78', 'AV');
    info.addPlayer(5, 'Manuel Neuer', '1986-03-27', 5, '1.9', 'GR');

    info.addTeam(1, 'Benfica', 'SLB', 2, "Observações", [
        new Player(1, 'Filipe Macaco', '1995-06-15', 1, 1.80, 'AV'),
        new Player(2, 'Rodrigo Filho', '1998-03-21', 2, 1.75, 'MC'),
        new Player(3, 'Hugo Digas', '1994-10-05', 3, 1.85, 'DF')
    ]);

    info.addTeam(2, 'Sporting', 'SCP', 3, "Observações", []);

    info.addTeam(3, 'Porto', 'FCP', 1, "Observações", [
        new Player(1, 'Guilherme Cruz', '1995-06-15', 1, 1.80, 'AV'),
        new Player(2, 'Diogo Veigas', '1998-03-21', 2, 1.75, 'MC'),
        new Player(3, 'André Carvalho', '1994-10-05', 3, 1.85, 'DF')
    ]);

    info.addTeam(4, 'Sporting de Braga', 'SCB', 3, "Observações", [
        new Player(1, 'João Silva', '1995-06-15', 1, 1.80, 'AV'),
        new Player(2, 'Pedro Santos', '1998-03-21', 2, 1.75, 'MC'),
        new Player(3, 'Ricardo Pereira', '1994-10-05', 3, 1.85, 'DF')
    ]);


    info.addTeam(5, 'Gollaços.pt', 'GLC', 5, "Observações", [
        new Player(1, 'Ola', '1995-06-15', 1, 1.80, 'AV'),
        new Player(2, 'Adeus', '1998-03-21', 2, 1.75, 'MC'),
        new Player(3, 'Ve la', '1994-10-05', 3, 1.85, 'DF'),
        new Player(4, 'Isso', '1994-10-05', 3, 1.85, 'DF')
    ]);

    info.addTeam(6, 'Veigas Eleven', 'VEE', 9, "Great team.", [
        new Player(1, 'John', '1996-07-15', 1, 1.80, 'AV'),
        new Player(2, 'David', '1999-04-21', 2, 1.75, 'MC'),
        new Player(3, 'Michael', '1995-11-05', 3, 1.85, 'DF'),
        new Player(4, 'Robert', '1995-11-05', 3, 1.85, 'GR'),
        new Player(5, 'Paul', '1997-02-03', 1, 1.82, 'AV'),
        new Player(6, 'Mark', '1998-01-01', 2, 1.78, 'MC'),
        new Player(7, 'Luke', '1995-08-08', 3, 1.83, 'DF'),
        new Player(8, 'Jack', '1995-08-08', 3, 1.81, 'DF'),
        new Player(9, 'James', '1996-09-12', 2, 1.79, 'MC'),
        new Player(10, 'George', '1997-06-07', 1, 1.83, 'AV'),
        new Player(11, 'Harry', '1998-11-02', 3, 1.85, 'DF')
    ]);

    info.addCompetition(1, 'Taça de Portugal', '2023', '', []);//ult e bolean true se tiver terminado, so para testar o log
    info.addCompetition(2, 'Taça da liga', '2023', '', []);//ult e bolean false se estiver a decorrer 

    info.addCompetition(3, 'Liga Europa', '2023', info.teams[3], [
        info.teams[2],
        info.teams[3],
        info.teams[4]
    ]); //teste liga criada com o SCB e FCP la dentro

    //teste estado a funcionar
    info.competitions[2].state = true
    
    window.info = info;
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
    
    return content
}

function addEditRemoveIcons(tr, id, headerFormat, isCompetition){
    var tableCell = null

    if(isCompetition){
        const competition = info.competitions.find(c => c.id === id)
        if(competition)
            var competitionState = competition.state
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