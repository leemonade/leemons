const Koa = require("koa");
const Router = require("koa-router");
const Static = require("koa-static");
const http = require("http");
const nextjs = require("next");

// If no log function is provided, use console.log
if (!global.log) {
  global.log = () => {};
}
const {log,} = global;

class Leemons {
	constructor() {
		log("New leemons");

		// Initialise the reload method (generate a "state" for it)
		this.reload();

		this.app = new Koa();
		this.router = new Router();

		this.initServer();

		this.loaded = false;
		this.started = false;
	}

	// Set KOA as requestHandler
	handleRequest(req, res) {
		if (!this.requestHandler) {
			this.requestHandler = this.app.callback();
		}
		return this.requestHandler(req, res);
	}

	// Initialise the server config with http server
	initServer() {
		// Use http-server for being able to reuse it (for example with webSockets)
		this.server = http.createServer(this.handleRequest.bind(this));

		// TODO: Handle Errors and connections

		// Function for server's clean exit
		this.server.destroy = (cb = () => { }) => {
			this.server.close(cb);
			// TODO: Close all connections
		};
	}

	// Invoke a reload action on master cluster
	reload() {
		// Initialise a state for reloading
		const state = {
			isReloading: false,
		};
		// Overwrite this.reload for being able to use a private state
		this.reload = () => {
			if (!state.isReloading && process.send) {
				// Send message to master process
				process.send("reload");
				state.isReloading = true;
				return true;
			}
			return false;
		};
	}

	// Initialise all the middlewares
	setMiddlewares() {
		this.app.use(async (ctx, next) => {
			log(`New connection to ${ctx.method} ${ctx.path}`);
			await next();
		});
	}

	// Initialise the api endpoints
	setRoutes() {
		this.router.get("/api/reload", (ctx) => {
			if (this.reload()) {
				ctx.body = { msg: "Reloading", };
			} else {
				ctx.body = { msg: "The server was already reloading", };
			}

		});

		this.router.get("/api", (ctx) => {
			ctx.body = "Hello World";
		});
	}

	// Initialise the frontend handler
	async setFrontRoutes() {
		// Next.js public path
		this.app.use(Static("./next/public"));

		// Make nextjs handle with all non /api requests
		this.router.get(/(?!^\/api)^\/.*/, async (ctx) => {
			await this.frontHandler(ctx.req, ctx.res);
			// Stop Koa handling the request
			ctx.respond = false;
		});

		// Expose all routes to koa
		this.app.use(this.router.routes()).use(this.router.allowedMethods());
	}

	// Load all apps
	load() {
		if (this.loaded) {
			return true;
		}

		// Initialise next
		this.front = nextjs({
			dir: process.env.nextDir,
		});
		this.frontHandler = this.front.getRequestHandler();

		// When next is prepared
		return this.front.prepare().then(() => {
			this.setMiddlewares();
			this.setRoutes();
			this.setFrontRoutes();
			this.loaded = true;
		});
	}

	// Start the app
	async start() {
		if (this.started) {
			return;
		}
		await this.load();
		this.server.listen(process.env.PORT, () => {
			log(`Listening on http://localhost:${process.env.PORT}`);

			process.send("running");
			this.started = true;
		});
	}
}
module.exports = () => {
	const leemons = new Leemons();
	return leemons;
};
