const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    allTodos: [TodoTask]
  }
  type Mutation {
    addTodoTask(title: String): TodoTask
  }
  type TodoTask {
    id: String
    title: String
  }
`;

const resolvers = {
  Query: {
    allTodos: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({
          secret: process.env.FAUNA_DB_KEY,
        });
        let result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("Todos"))),
            q.Lambda((x) => q.Get(x))
          )
        );
        console.log(result);
        return result;
      } catch (err) {
        return err.toString();
      }
    },
  },
  Mutation: {
    addTodoTask: async (e, { title }) => {
      console.log("Title====>", title);
      try {
        var client = new faunadb.Client({
          secret: "fnAEAhbGAUACDAdipu1OA5aWhGV8s7XMwClnNj0Q",
        });
        const result = await client.query(
          q.Create(q.Collection("Todos"), {
            data: { title: title },
          })
        );
        console.log(result.data);
      } catch (error) {
        console.log("error===>", error.message);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
