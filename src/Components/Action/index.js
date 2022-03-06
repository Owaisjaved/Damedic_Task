import axios from 'axios'
const {REACT_APP_GITHUB_ACCESS_TOKEN} = process.env
//Github GraphQL Query
export const getGitHubData = async () =>{
    let fetchedData = await axios.post(
        "https://api.github.com/graphql",
        {
          // Query to Get Required Values
          //Chaning login name to other username to get that username data
          query: `{
                   user(login: "torvalds") {
                     id  
                     name
                     login
                     avatarUrl
                     location
                     login
                     bio
                     followers {
                       totalCount
                     }
                     following {
                       totalCount
                     }
                     repositories(first: 50) {
                       nodes {
                         id
                         name
                         description
                         stargazerCount
                         forkCount
                         createdAt
                         languages(last: 1) {
                           nodes {
                             name
                           }
                         }
                         updatedAt
                       }
                       pageInfo {
                         hasNextPage
                       }
                     }
                   }
                 }`,
        },
        {
          headers: { Authorization: `Bearer ${REACT_APP_GITHUB_ACCESS_TOKEN}` },
        }
      );
    return fetchedData;
}