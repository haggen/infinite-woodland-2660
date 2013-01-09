var express, app, pg;

express = require('express');
pg = require('pg');

app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  var q;

  q = 'SELECT LG."CEP", LB."BAI_NO", LC."LOC_NO", LG."UFE_SG", LG."TLO_TX", LG."LOG_NO" FROM "LOG_LOGRADOURO" LG LEFT JOIN "LOG_LOCALIDADE" LC ON LC."LOC_NU" = LG."LOC_NU" LEFT JOIN "LOG_BAIRRO" LB ON LG."BAI_NU_INI" = LB."BAI_NU" WHERE LG."CEP" = $1 LIMIT 1;';

  pg.connect(process.env.DATABASE_URL, function(error, db) {
    if(error) {
      response.json(error);
    } else {
      db.query(q, [request.query.CEP], function(error, result) {
        response.json(error || result.rows);
        db.end();
      });
    }
  });
});

app.listen(process.env.PORT);
