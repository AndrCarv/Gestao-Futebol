/** Base Country*/
function baseCountry() {
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
}
/**Base Posição */
function basePosicao(){
    info.addPosition('Guarda-Redes' ,'GR');
    info.addPosition('Defesa', 'DF' );
    info.addPosition('Médio Campo', 'MC');
    info.addPosition('Avançado', 'AV');
}

/** Base Player*/
function basePlayer(){
    info.addPlayer(1, 'Cristiano Ronaldo', '1985-02-05', 1, '1.85', 'AV');
    info.addPlayer(2, 'Sergio Ramos', '1986-03-30', 2, '1.84', 'DF');
    info.addPlayer(3, 'Harry Kane', '1993-07-28', 3, '1.88', 'AV');
    info.addPlayer(4, 'Kylian Mbappé', '1998-12-20', 4, '1.78', 'AV');
    info.addPlayer(5, 'Manuel Neuer', '1986-03-27', 5, '1.9', 'GR');
}

/** Base Team*/
function baseTeam(){
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
}

/** Base Competition*/
function baseCompetition(){
    info.addCompetition(1, 'Taça de Portugal', '2023', '', null, []);//ult e bolean true se tiver terminado, so para testar o log
    info.addCompetition(2, 'Taça da liga', '2023', '', null ,[]);//ult e bolean false se estiver a decorrer 

    info.addCompetition(3, 'Liga Europa', '2023', info.teams[3], true,[
        info.teams[2],
        info.teams[3],
        info.teams[4]
    ]); //teste liga criada com o SCB e FCP la dentro
}