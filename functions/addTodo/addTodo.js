const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;
var dotenv = require("dotenv");
dotenv.config();
const typeDefs = gql`
  type Query {
    allTodos: [TodoTask]
  }
  type Mutation {
    addTodoTask(title: String): TodoTask
    deleteTodoTask(id: ID): TodoTask
    updateTodoTask(id: ID, title: String): TodoTask
  }
  type TodoTask {
    id: ID
    title: String!
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
        console.log(result.data);
        return result.data.map((item) => {
          return {
            title: item.data.title,
            id: item.ref.id,
          };
        });
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
          secret: process.env.FAUNA_DB_KEY,
        });
        const result = await client.query(
          q.Create(q.Collection("Todos"), {
            data: { title: title },
          })
        );

        console.log("result.data.title====>", result);
        return result.data;
      } catch (error) {
        console.log("error===>", error.message);
      }
    },
    deleteTodoTask: async (e, { id }) => {
      console.log("Item Tobe Deleted ===>", id);
      try {
        var client = new faunadb.Client({
          secret: process.env.FAUNA_DB_KEY,
        });
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("Todos"), id))
        );
        console.log("DELETE ME====>", result);
        return result.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    updateTodoTask: async (_, { id, title }) => {
      console.log("Item Tobe Updated ===>", title, id);
      try {
        var client = new faunadb.Client({
          secret: process.env.FAUNA_DB_KEY,
        });
        const result = await client.query(
          q.Update(q.Ref(q.Collection("Todos"), id), {
            data: { title: title },
          })
        );
        return result.data;
      } catch (error) {
        console.log("error", error);
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
