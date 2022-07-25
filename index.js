const axios = require('axios')
const express = require('express')

const baseUrl = 'https://www.balldontlie.io/api/v1'

async function getLeBron(request, response) {
  try {
    const result = await axios.get(`${baseUrl}/players?search=lebron`)
    // o tipo de uma "response" é muito muito grande. evite dar console.log nele inteiro
    // o resultado vem dentro da chave "data"
  
    // coincidentemente, a API da Ball Don't Lie retorna outra chave data pros resultados, q é um array
    const lebron = result.data.data[0]
    return response.status(200).send(JSON.stringify(lebron, null, 2))
  } catch (error) {
    console.error(error);
    // faço isso pra pegar se quem deu erro foi a chamada do axios
    // por exemplo, se a API da Ball Don't Lie estiver fora do ar,
    // vamos querer retornar uma msg tratada
    // outra abordagem é sempre retornar uma msg genérica quando algo der errado no back
    if (error.response) {
      return response.status(error.response.status).send(error.message)
    }
    return response.status(500).send(error.message)
  }
}

const app = express()

// workaround pra sempre já ter os cabeçalho treta
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

app.get('/lebron', async (request, response) => {
  console.log('fetching lebron...')
  // eu acabei passando pra frente a _response_ pra poder responder por dentro da função
  // _getLeBron_, mas vc poderia fazer a função _getLeBron_ só retornar os dados da API
  // e aqui dentro da definição da função que lida com GET em '/lebron' decidir se manda resposta,
  // com qual status e etc
  await getLeBron(request, response)
  console.log('lebron delivered!')
})

app.listen('9999', () => {
  console.log('server started!')
})
