/**
 * @param noFunction
 * Zona em que não existem funções, ou seja, devem apenas ser carregadas quando a página carregar
 * 
 */

const competitionEdition = document.querySelector('#competitionEdition')
competitionEdition.min = returnEditionAge('start')
competitionEdition.max = returnEditionAge()
competitionEdition.value = returnEditionAge('now')
