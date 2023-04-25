import { Prisma } from "./db.js";
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
(async () => {
    try {
        const typeDefs = gql `
            type Post {
                id: String
                title: String
                username: String
            }

            type Query {
                getAllPosts: [Post]
            }

            type Mutation {
                createPost(title: String, username: String): Post
            }
        `;
        const resolvers = {
            Mutation: {
                createPost: async (_parent, args) => {
                    const post = await Prisma.post.create({
                        data: {
                            title: args.title,
                            username: args.username
                        }
                    });
                    return post;
                }
            },
            Query: {
                getAllPosts: async () => {
                    return await Prisma.post.findMany();
                }
            }
        };
        const server = new ApolloServer({
            typeDefs,
            resolvers
        });
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 }
        });
        console.log(`Server is ready at ${url}`);
    }
    catch (error) {
        console.log(error);
    }
})();
