const Koa = require("koa");
const fs = require('fs-extra');
const path = require("path");
const serve = require('koa-static');
const server = new Koa();

const buildPath = path.resolve(__dirname, '..', '..', 'build');

server.use(serve(buildPath));

server.use(async (ctx) => {
  ctx.type = "html";
  ctx.body = await fs.readFile(path.resolve(buildPath, 'index.html'))
});


server.listen(8080, () => {
  console.log("Listening on http://localhost:%d", 8080);
});