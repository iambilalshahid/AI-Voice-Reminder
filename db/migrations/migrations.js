// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';

const m0000 = `CREATE TABLE IF NOT EXISTS \`todos\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`title\` text NOT NULL,
	\`day\` text NOT NULL,
	\`time\` text,
	\`has_alarm\` integer DEFAULT false,
	\`completed\` integer DEFAULT false,
	\`created_at\` integer NOT NULL
);`;

export default {
  journal,
  migrations: {
    m0000,
  },
};