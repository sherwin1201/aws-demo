const mysql = require("mysql2/promise");

const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

exports.handler = async (event) => {
	const method = event.requestContext?.http?.method || event.httpMethod; // covers both Function URL and API Gateway

	// Handle CORS preflight (OPTIONS)
	if (method === "OPTIONS") {
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
			body: "",
		};
	}

	try {
		const body = JSON.parse(event.body);
		const { name, email } = body;

		const conn = await mysql.createConnection(dbConfig);
		await conn.execute("INSERT INTO students (name, email) VALUES (?, ?)", [
			name,
			email,
		]);
		await conn.end();

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: "Student registered!" }),
		};
	} catch (err) {
		console.error("Error:", err);
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: "Error saving student" }),
		};
	}
};
