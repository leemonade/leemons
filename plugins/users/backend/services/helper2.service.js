"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "helper",
	version: 2,

	dependencies: [],

	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hello: {
			rest: {
				method: "GET",
				path: "/hello",
			},
			async handler(ctx) {
				return "Hello helper";
			},
		},
	},

	/**
	 * Events
	 */
	events: {
		"hello.call": (payload) => {
			console.log("Estamos en helper version 2 payload: ", payload);
		},
	},

	channels: {
		"hello.call": (payload) => {
			console.log(
				"[CHANNEL] Estamos en helper version 2 payload: ",
				payload
			);
		},
	},
};
