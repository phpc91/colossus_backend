const axios = require('axios')
const express = require('express')

const baseUrl = 'https://www.balldontlie.io/api/v1'

/**
 * Function designed to search a player using Ball Don't Lie API
 * 
 * @param {import('axios').AxiosRequestConfig} req 
 * @param {import('axios').AxiosResponse} res 
 * @returns {import('axios').AxiosResponse} player data
 */
async function searchPlayer(req, res) {
  try {
    if (!req.body || !req.body.playerName) {
      return res.status(400).send('Missing param')
    }

    const response = await axios.get(`${baseUrl}/players?search=${req.body.playerName}`)
    // o tipo de uma "response" é muito muito grande. evite dar console.log nele inteiro
    // o resultado vem dentro da chave "data"
  
    // coincidentemente, a API da Ball Don't Lie retorna outra chave data pros resultados, q é um array
    if (!response.data.data.length) {
      return res.status(400).send('No players found');
    }
    const lebron = response.data.data
    return res.status(200).send(JSON.stringify(lebron, null, 2))
  } catch (error) {
    console.error(error);
    // faço isso pra pegar se quem deu erro foi a chamada do axios
    // por exemplo, se a API da Ball Don't Lie estiver fora do ar,
    // vamos querer retornar uma msg tratada
    // outra abordagem é sempre retornar uma msg genérica quando algo der errado no back
    if (error.response) {
      return res.status(error.response.status).send(error.message)
    }
    return res.status(500).send(error.message)
  }
}

const app = express()

// workaround pra sempre já ter os cabeçalho treta
app.use(express.json())
app.use((_request, response, next) => {
  response.append('Access-Control-Allow-Origin', ['*'])
  response.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.append('Access-Control-Allow-Headers', 'Content-Type')
  response.append('Content-Type', 'application/json')
  response.append('Cache-Control', 'no-store, max-age=0');
  response.append('Content-Security-Policy', "frame-ancestors 'none'");
  response.append('Pragma', 'no-cache');
  response.append('Referrer-Policy', 'no-referrer');
  response.append(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  response.append('X-Content-Type-Options', 'nosniff');
  response.append('X-Frame-Options', 'DENY');

  next();
});

app.post('/player/search', async (request, response) => {
  console.log('fetching player...')
  // eu acabei passando pra frente a _response_ pra poder responder por dentro da função
  // _getLeBron_, mas vc poderia fazer a função _getLeBron_ só retornar os dados da API
  // e aqui dentro da definição da função que lida com GET em '/lebron' decidir se manda resposta,
  // com qual status e etc
  await searchPlayer(request, response)
  console.log('player delivered!')
})

app.get('/teste', async (request, response) => {
  console.log('nova rota')

  const apiResponse = await axios.get(`${baseUrl}/season_averages?season=2018&player_ids[]=237`)
  return response.status(200).send(JSON.stringify(apiResponse, null, 2))
})

app.listen('9999', () => {
  console.log('server started!')
})
