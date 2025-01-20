import { Sequelize } from "sequelize";
import env from "dotenv";

env.config();

const db = new Sequelize(process.env.DB_URL, {
	dialect: "postgres",
	logging: false,
	define: {
		timestamps: false,
		freezeTableName: true,
	},
	dialectOptions: {
		useUTC: false,
		dateStrings: true,
		timezone: "Europe/Bucharest",
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});

export default db;
