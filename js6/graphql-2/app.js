// Moved to apollo-server-express to set express-sessions middleware
import { ApolloServer, gql } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";
import express from "express";
import http from "http";
import fetch from "node-fetch";
import session from "express-session";
import Storage from "./public/storage.js";
const usersStorage = new Storage("./", "users", "json");
const typeDefs = gql`
  type Query {
    lessons: [Lesson]
    search(str: String!): [BasicPokemon]
    getPokemon(str: String!): Pokemon
    login(pokemon: String!): User
    user: User
  }
  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
  }
  type Lesson {
    name: String!
    image: String!
  }
  type User {
    name: String!
    image: String!
    lessons: [Lesson]
  }
`;
const lessons = async () => {
  const req = await fetch("https://www.c0d3.com/api/lessons");
  const lessons = await req.json();
};
const search = async (parent, args) => {
  const req = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1118");
  const pokemons = await req.json();
  const filteredPokemons = pokemons.results.filter((pokemon) =>
    pokemon.name.includes(args.str)
  );
  return filteredPokemons;
};
const getPokemon = async (parent, args) => {
  const req = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.str}/`);
  const {
    name,
    sprites: { front_default },
  } = await req.json();
  return { name, image: front_default };
};
// Part 2
const user = async (parent, args, { session }) => {
  if (!session.user) return null;
  const lessons = await usersStorage.getValue(session.user.name);
  return { ...session.user, lessons: lessons };
};
const login = async (parent, args, { session }) => {
  const pokemon = await getPokemon(null, { str: args.pokemon });
  session.user = pokemon;
  const lessons = await usersStorage.getValue(args.pokemon);
  return { ...session.user, lessons: lessons };
};
const enroll = async (parent, args, { session }) => {
  if (!session.user) return null;

  const userLessonsExist = await usersStorage.has(session.user.name);
  const lessonExists = (await usersStorage.getValue(session.user.name))?.some(
    (userLesson) => userLesson.title === args.title
  );

  if (!userLessonsExist) {
    await usersStorage.add(session.user.name, []);
  }
  if (!lessonExists) {
    await usersStorage.modify(session.user.name, (prevUserLessons) => [
      ...(prevUserLessons || []),
      { title: args.title },
    ]);
  }
  return {
    ...session.user,
    lessons: await usersStorage.getValue(session.user.name),
  };
};
const unenroll = async (parent, args, { session }) => {
  if (!session.user) return null;
  const lessonExists = (await usersStorage.getValue(session.user.name))?.some(
    (userLesson) => userLesson.title === args.title
  );
  if (lessonExists) {
    await usersStorage.modify(session.user.name, (prevUserLessons) => {
      const userLessons = [...prevUserLessons];
      userLessons.splice(
        userLessons.findIndex((userLesson) => userLesson.title === args.title),
        1
      );
      return userLessons;
    });
  }
  return {
    ...session.user,
    lessons: await usersStorage.getValue(session.user.name),
  };
};
const resolvers = {
  Query: {
    lessons,
    search,
    getPokemon,
    user,
    login,
  },
  Mutation: {
    enroll,
    unenroll,
  },
};
const corsConfig = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
const context = ({ req }) => ({ session: req.session });
const app = express();
app.use(
  session({
    secret: "dont read, it's a secret.",
    resave: false,
    saveUninitialized: true,
    // Cookies can't be secure in http e.g., Localhost.
    cookie: { secure: false },
  })
);
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});
await server.start();
server.applyMiddleware({ app, cors: corsConfig });
const port = process.env.PORT || 8123;
httpServer.listen({ port });
