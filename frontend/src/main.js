async function loadPage() {
//Getting Post content
  let responsePosts = await fetch("https://jsonplaceholder.typicode.com/posts");
  let posts = await responsePosts.json();
// Getting User names
  let responseUsers = await fetch("https://jsonplaceholder.typicode.com/users");
  let users = await responseUsers.json();
// Gettinf Photos
 let responsePhotos = await fetch ("https://jsonplaceholder.typicode.com/photos");
 let photos = await responsePhotos.json();
// Getting Comments
 let responseComments = await fetch ("https://jsonplaceholder.typicode.com/comments");
 let comments = await responseComments.json();
//Add Avatar
const mappedPosts = posts.map((p) => {
  const avatars = photos.find((u) => u.id === p.userId); // userId в постах 
//Add Comments
  const commentsInPost = comments.find((u) => u.id === p.userId);

// Changing ID
  const createdBy = users.find((u) => u.id === p.userId);
  return {
    ...p, 
    commentsInPost,
    avatars,
    userId: createdBy ? createdBy.username : "Unknown user",
  }
});
console.log(mappedPosts)

  //Creating Post
  for (let post of mappedPosts) {
    const container = document.getElementsByClassName("outer")[0];
    const resultedPost = createPost(post);
    const postWrapper = document.createElement("div");
    postWrapper.classList.add("inner");
    postWrapper.innerHTML = resultedPost;
    container.appendChild(postWrapper);
  }
  // Accordion

let acc = document.getElementsByClassName("accordion");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    let panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
} 

}
loadPage();

//creating HTML elements

function createPost(post) {
  return `
    <h1>${post.title}</h1>
    <p>${post.body}<span>${post.userId}<img class="Avatar" src=${post.avatars.thumbnailUrl}></span></p>
    <button class="accordion">Comments</button>
      <div class="panel">
        <p>${post.commentsInPost.body}<span>${post.commentsInPost.name}<img class="Avatar" src=${post.avatars.thumbnailUrl}></span></p></p>
        
      </div>
  `;
}


// posts.map(p => { return {...p, userName: users.find(u => u.id === p.userId)?.name}} || "Unknown") })}
// function changeID(posts, users) {
//   // for (const found of items) {
//   //   found.find(element => element.userId)
//   // }
//   for (let i of posts) {
//     if (i.userId === users.id) {
//       i.userId = users.username;
//       posts.userId = i.userId;
//     } else {
//       i.userId = "Unkown";
//       posts.userId = i.userId;
//     }
//     return posts;
//   }
// }
// changeID("posts", "users");

// OLD STUFF
// //Getting Post content
// fetch("https://jsonplaceholder.typicode.com/posts")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     const posts = data;
//     console.log(posts);
//     // Getting User names
//     fetch("https://jsonplaceholder.typicode.com/users")
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         const users = data;
//         console.log(users);
//         // Changing ID
//         const mappedPosts = posts.map((p) => {
//           const createdBy = users.find((u) => u.id === p.userId);

//           return {
//             ...p,
//             userId: createdBy ? createdBy.username : "Unknown user",
//           };
//         });

//         console.log(mappedPosts);

//         //Creating Post
//         for (let post of mappedPosts) {
//           const container = document.getElementsByClassName("outer")[0];
//           const resultedPost = createPost(post);
//           const postWrapper = document.createElement("div");
//           postWrapper.classList.add("inner");
//           postWrapper.innerHTML = resultedPost;
//           container.appendChild(postWrapper);
//         }
//       });
//   });

// Changing ID
//   const mappedPosts = postsWithAvatars.map((p) => {
//     const createdBy = users.find((u) => u.id === p.userId);

//     return {
//       ...p,
//       userId: createdBy ? createdBy.username : "Unknown user",
//     };
//   });
