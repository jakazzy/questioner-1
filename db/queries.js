/**
 * Queries used in creating relevant tables
 */

const createQueries = {

  // Users table
  usersTable: `
  CREATE TABLE IF NOT EXISTS
   users(
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_no VARCHAR(15),
    username VARCHAR(100),
    registered_on VARCHAR(100) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false
  )`,

  // Meetups table
  meetupsTable: `
  CREATE TABLE IF NOT EXISTS
   meetups(
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_on VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    happening_on VARCHAR(100) NOT NULL,
    tags VARCHAR[]
  )`,

  // Questions table
  questionsTable: `
  CREATE TABLE IF NOT EXISTS
   questions(
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_on VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users (id),
    meetup_id INT REFERENCES meetups (id),
    title VARCHAR(255) NOT NULL,
    body VARCHAR(255) NOT NULL
  )`,

  // RSVP table
  rsvpTable: `
  CREATE TABLE IF NOT EXISTS
   rsvp(
    id INT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    user_id INT REFERENCES users (id),
    meetup_id INT REFERENCES meetups (id),
    response VARCHAR(255),
    PRIMARY KEY(user_id, meetup_id)
  )`,

  // comments table
  commentsTable: `
  CREATE TABLE IF NOT EXISTS
   comments(
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    comment VARCHAR(255),
    user_id INT REFERENCES users (id),
    question_id INT REFERENCES questions (id)
  )`,

  // votes table
  votesTable: `
  CREATE TABLE IF NOT EXISTS
   votes(
    id INT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    up BOOLEAN,
    down BOOLEAN,
    user_id INT REFERENCES users (id),
    question_id INT REFERENCES questions (id),
    PRIMARY KEY(user_id, question_id)
  )`,
};


/**
 * Queries used in dropping relevant tables
 */

const dropQueries = {

  // Users table
  usersTable: 'DROP TABLE IF EXISTS users CASCADE',

  // Meetups table
  meetupsTable: 'DROP TABLE IF EXISTS meetups CASCADE',

  // Questions table
  questionsTable: 'DROP TABLE IF EXISTS questions CASCADE',

  // RSVP table
  rsvpTable: 'DROP TABLE IF EXISTS rsvp CASCADE',

  // Comments table
  commentsTable: 'DROP TABLE IF EXISTS comments CASCADE',

  // Votes table
  votesTable: 'DROP TABLE IF EXISTS votes CASCADE',
};

/**
 * Queries used in seeding tables
 */

const seedQueries = {

  // Users table
  usersTable: `
    INSERT INTO users(firstname, lastname, email, password, registered_on, is_admin)
      VALUES ('chukwudi', 'ume', 'chukwudi.ume@gmail.com', 'andela', 1547878599932, true),
              ('Ernest', 'Genius', 'e.genius@gmail.com', 'andela', 1547878599932, false),
              ('Chike', 'Bad guy', 'c.guy@gmail.com', 'andela', 1547878599932, false)
  `,

  meetupsTable: `
    INSERT INTO meetups(location, created_on, topic, happening_on)
      VALUES ('Gbagada', 1547878599932, 'NodeJS Gurus', 1547078599932),
              ('The zone', 1547878599932, 'Food Lovers', 1547878599932),
              ('Maryland Mall', 1547878599932, 'Movie Critics', 1547578599932)
  `,

  questionsTable: `
    INSERT INTO questions(created_on, user_id, meetup_id, title, body)
      VALUES (1547878599932, 1, 2, 'What about', 'Okay. this is not so great. Is it?'),
              (1547878599932, 2, 1, 'Transportation', 'Will transport be provided?'),
              (1547878599932, 1, 3, 'Item 7', 'Will item 7 be provided?')
  `,

  rsvpTable: `
    INSERT INTO rsvp(user_id, meetup_id, response)
      VALUES (1, 2, 'yes'),
              (1, 1, 'no'),
              (2, 1, 'maybe')
  `,

  commentsTable: `
    INSERT INTO comments(comment, user_id, question_id)
      VALUES ('Beautiful question', 2, 1),
              ('Very thoughful', 1, 2),
              ('This question is a question', 1, 1)
  `,

  votesTable: `
    INSERT INTO votes(up, down, user_id, question_id)
      VALUES (true, false,1,2),
              (true, false,2,2),
              (false, true, 1,1)
  `,

};

module.exports = {
  createQueries,
  dropQueries,
  seedQueries,
};