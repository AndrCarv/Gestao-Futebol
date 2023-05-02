/**
 * @param noFunction
 * Zona em que não existem funções, ou seja, devem apenas ser carregadas quando a página carregar
 * 
 */

const competitionEdition = document.querySelector('#competitionEdition')
competitionEdition.min = getYear(-2)
competitionEdition.max = getYear(+2)
competitionEdition.value = getYear()

const playerBirthDate = document.querySelector('#playerBirthDate')
playerBirthDate.min = getDate(-16)//no minimo 16 anos
playerBirthDate.min = getDate(-50)//no maximo 50 anos

