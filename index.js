var express, app, pg, db, cache, maxage, fetch;

express = require('express');
latency = require('express-latency');
cache   = require('./cache');
pg      = require('pg').native;

db = new pg.Client(process.env.DATABASE_URL);

db && db.connect();

maxage = parseInt(process.env.CACHE, 10);

app = express();
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.logger());

// Allow CORS
app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', 'GET');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  // intercept OPTIONS method
  ('OPTIONS' === request.method) && response.send(200) || next();
});

// Browser caching
app.use(function(request, response, next) {
  response.set('Cache-Control', 'public, maxage=' + maxage + ', must-revalidate') && next();
});

// Try fetching from cache, fallback to database
fetch = function(key, sql, params, next) {
  fetch.cache(key, function(data) {
    // data = false; // Force skip cache

    if(data) {
      next(data)
    } else {
      fetch.database(sql, params, function(data) {
        cache.push(key, JSON.stringify(data));
        next(data);
      });
    }
  });
};

// Fetch from database
fetch.database = function(sql, params, next) {
  db.query(sql, params, function(err, query) {
    err && console.log(err);
    next(err ? [] : query.rows);
  });
};

// Fetch from cache
fetch.cache = function(key, next) {
  var data = cache.fetch(key);
  next(data ? JSON.parse(data) : null);
};

app.get('/', function(request, response) {
  var key, sql, params;

  key = 'BR';
  sql = 'SELECT DISTINCT "UFE_SG" FROM "LOG_LOCALIDADE" ORDER BY "UFE_SG" ASC';
  params = [];

  fetch(key, sql, params, function(data) {
    response.jsonp(data);
  });
});

app.get(/^\/([A-Z]{2})$/, function(request, response) {
  var key, sql, params;

  key = request.params[0];
  sql = 'SELECT "LOC_NO" FROM "LOG_LOCALIDADE" WHERE "UFE_SG" = $1 ORDER BY "LOC_NO" ASC';
  params = [request.params[0]];

  fetch(key, sql, params, function(data) {
    response.jsonp(data);
  });
});

app.get(/^\/([0-9]{8})$/, function(request, response) {
  var key, sql, params;

  key = request.params[0];
  sql = 'SELECT LG."CEP", LB."BAI_NO", LC."LOC_NO", LG."UFE_SG", LG."TLO_TX", LG."LOG_NO" FROM "LOG_LOGRADOURO" LG LEFT JOIN "LOG_LOCALIDADE" LC ON LC."LOC_NU" = LG."LOC_NU" LEFT JOIN "LOG_BAIRRO" LB ON LG."BAI_NU_INI" = LB."BAI_NU" WHERE LG."CEP" = $1 LIMIT 1';
  params = [request.params[0]];

  fetch(key, sql, params, function(data) {
    response.jsonp(data);
  });
});

latency.measure(app, {print: true});

app.listen(process.env.PORT);
