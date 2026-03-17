

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");




CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);



CREATE TABLE IF NOT EXISTS balance (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current NUMERIC(12, 2) NOT NULL DEFAULT 0,
    income NUMERIC(12, 2) NOT NULL DEFAULT 0,
    expenses NUMERIC(12, 2) NOT NULL DEFAULT 0,
    primary key (user_id)
);



CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    avatar TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    
    amount NUMERIC(12, 2) NOT NULL,
    recurring BOOLEAN NOT NULL DEFAULT FALSE
);



CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    maximum NUMERIC(12, 2) NOT NULL,
    theme TEXT NOT NULL
);



CREATE TABLE IF NOT EXISTS pots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    theme TEXT NOT NULL
);

