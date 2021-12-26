import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import fetch from "node-fetch";

const typeDefs = gql`
  type Query {
    lessons: [Lesson]
    search(str: String!): [BasicPokemon]
    getPokemon(str: String!): Pokemon
  }

  type Lesson {
    title: String!
  }

  type BasicPokemon {
    name: String!
  }

  type Pokemon {
    name: String!
    image: String!
  }
`;

const lessons = async (parent, args) => {
  const req = await fetch("https://www.c0d3.com/api/lessons");
  const lessons = await req.json();

  return lessons;
};

const search = async (parent, args) => {
  {
    const req = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1118");
    const pokemons = await req.json();

    const filteredPokemons = pokemons.results.filter((pokemon) =>
      pokemon.name.includes(args.str)
    );

    return filteredPokemons;
  }
};

const getPokemon = async (parent, args) => {
  try {
    const req = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.str}/`);
    const {
      name,
      sprites: { front_default },
    } = await req.json();

    return { name, image: front_default };
  } catch (e) {
    // Encountered an unhandled error in the playground
    throw new Error("Pokemon not found!");
  }
};

const resolvers = {
  Query: {
    lessons,
    search,
    getPokemon,
  },
};

const cors = {
  origin: "*",
  optionSuccessStatus: 200,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server.listen(process.env.PORT || 8123);

