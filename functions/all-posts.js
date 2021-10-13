const connection = require("serverless-mysql")({
  config: {
      host: "lmc8ixkebgaq22lo.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
      database: "yj4gfzv5wypf9871",
      user: "ub4b7vh6mgd73b2b",
      password: "l7w4d31in0msovsc",
  },
});

exports.handler = async function (event) {
  try {
      await connection.connect();
      const posts = await getAllPosts(connection);
      await connection.end();
      return {
          statusCode: 200,
          body: JSON.stringify({
              posts: posts,
          }),
      };
  } catch (e) {
      console.log(`No post found= ${e}`);
  } finally {
      if (connection) {
          await connection.end();
      }
  }

  //console.log(posts);
};

async function getAllPosts(connection) {
  return new Promise((resolve, reject) => {
      connection.query(
          {
              sql:
                  "SELECT posts.title, posts.slug, posts.plaintext, posts.custom_excerpt FROM yj4gfzv5wypf9871.posts LEFT JOIN yj4gfzv5wypf9871.posts_tags ON posts.id = posts_tags.post_id LEFT JOIN yj4gfzv5wypf9871.tags ON posts_tags.tag_id = tags.id WHERE tags.id = '60be26b596d4a3001c4737d2'",
              timeout: 10000,
          },
          function (error, results, fields) {
              if (error) reject(error);
              resolve(results);
          }
      );
  });
}