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
    info.addPlayer(2, 'Sergio Ramos', '1986-03-30', 2, '1.84', 'DC');
    info.addPlayer(3, 'Harry Kane', '1993-07-28', 3, '1.88', 'AV');
    info.addPlayer(4, 'Kylian Mbappé', '1998-12-20', 4, '1.78', 'AV');
    info.addPlayer(5, 'Manuel Neuer', '1986-03-27', 5, '1.9', 'GK');

    info.addTeam(1, 'Benfica', 'SLB', 2, "Observações", []);
    info.addTeam(2, 'Sporting', 'SCP', 3, "Observações", []);
    info.addTeam(3, 'Porto', 'FCP', 1, "Observações", []);

    info.addTeam(4, 'Sporting de Braga', 'SCB', 3, "Observações", [
        new Player(1, 'João Silva', '1995-06-15', 1, 1.80, 'AV'),
        new Player(2, 'Pedro Santos', '1998-03-21', 2, 1.75, 'MD'),
        new Player(3, 'Ricardo Pereira', '1994-10-05', 3, 1.85, 'DE')
    ]);

    /* Fazer para dar para ver jogadores dentro */
    /* meter olho centro */


    info.addCompetition(1, 'Taça de Portugal', '2023', '',  true, []);//ult e bolean true se tiver terminado, so para testar o log
    info.addCompetition(2, 'Taça da liga', '2023', '', false, []);//ult e bolean false se estiver a decorrer 

    info.addCompetition(3, 'Liga Europa', '2023', info.teams[3], false, [
        info.teams[2],
        info.teams[3]
    ]); //teste liga criada com o SCB e FCP la dentro

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
    
    for (var property in object) {
        const content = object[property] //desta maneira podemos escolher o texto do cabeçalho da tabela
        if ((object[property] instanceof Function))
            continue;
        if (headerFormat) {
            
            tableCell = document.createElement("th");
            tableCell.scope = "col"
            tableCell.textContent = content[0].toUpperCase() + content.slice(1);
        } else {
            if(id === null)//verifica o id da linha
                id = content

            tableCell = document.createElement("td");
            tableCell.scope = "row"
            if(Array.isArray(content)){//se for um array, ou seja, equipas ou jogadores
                const detailAnchor = document.createElement('a')
                detailAnchor.href = `javascript: info.seeDetails(${id})`//precisamos de possibilitar a vista detalhada
                detailAnchor.innerHTML = '<i class="fa-solid fa-eye seeDetails"></i>'
                tableCell.appendChild(detailAnchor)

            }else if (typeof content === "object" && property === 'winner') {//se é o vencedor de um jogo
                const detailAnchor = document.createElement('a')
                                                                //id da equipa   id do torneio
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
    return tr;
};

function tableRowConditions(property, content){
    if(property === 'state'){//se for o estado de um campeonato
        if(content)
            return 'A decorrer'
        else
        return 'Terminado'
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