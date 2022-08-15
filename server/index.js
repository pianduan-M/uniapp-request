import http from 'http'

const app = http.createServer(function (req, res, next) {
  setTimeout(function () {
    res.statusCode = 200
    res.header(`Access-Control-Allow-Origin`, "*");
    res.send(JSON.stringify({ code: 0, data: { xx: 1 } }))
  }, 2000)
})

app.listen(3022, function () {
  console.log('port : 3022');
})