var express, app, pg, db;

express = require('express');
pg = require('pg').native;

db = new pg.Client(process.env.DATABASE_URL);
db.connect();

app = express();
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.logger());

// Allow CORS
app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', 'GET');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  // intercept OPTIONS method
  ('OPTIONS' == request.method) && response.send(200) || next();
});

app.get('/:CEP', function(request, response) {
  var q;

  q = 'SELECT LG."CEP", LB."BAI_NO", LC."LOC_NO", LG."UFE_SG", LG."TLO_TX", LG."LOG_NO" FROM "LOG_LOGRADOURO" LG LEFT JOIN "LOG_LOCALIDADE" LC ON LC."LOC_NU" = LG."LOC_NU" LEFT JOIN "LOG_BAIRRO" LB ON LG."BAI_NU_INI" = LB."BAI_NU" WHERE LG."CEP" = $1 LIMIT 1;';

  db.query(q, [request.params.CEP], function(err, result) {
    response.jsonp(err ? [] : result.rows);
  });
});

app.listen(process.env.PORT);
