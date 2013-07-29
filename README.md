# CEPs

> API de acesso ao Diretório Nacional de Endereços - DNE

## API

Todas as requisições são feitas no endereço:

    //infinite-woodland-2660.herokuapp.com

Tanto `http` quanto `https` funcionam.

Todas as rotas aceitam a querystring `callback`, para chamadas [JSONP](http://en.wikipedia.org/wiki/JSONP).

### Lista em ordem alfabética com as siglas dos estados brasileiros

    GET / HTTP/1.1
    Host: infinite-woodland-2660.herokuapp.com

    [
      {
        "UFE_SG": "AC"
      },
      {
        "UFE_SG": "AL"
      },
      {
        "UFE_SG": "AM"
      }
      ...
    ]

### Lista em ordem alfabética com as cidades de um estado

    GET /SP HTTP/1.1
    Host: infinite-woodland-2660.herokuapp.com

    [
      {
        "LOC_NO": "Adamantina"
      },
      {
        "LOC_NO": "Adolfo"
      },
      {
        "LOC_NO": "Agisse"
      }
      ...
    ]

### Logradouro por CEP

    GET /01420000 HTTP/1.1
    Host: infinite-woodland-2660.herokuapp.com

    [
      {
        "CEP": "01420000",
        "BAI_NO": "Jardim Paulista",
        "LOC_NO": "São Paulo",
        "UFE_SG": "SP",
        "TLO_TX": "Alameda",
        "LOG_NO": "Jaú"
      }
    ]