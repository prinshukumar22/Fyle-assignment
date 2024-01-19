
const form = document.querySelector(".myForm");
const input = document.querySelector(".input");
const input2 = document.querySelector(".input2");
const profile = document.querySelector(".profile");
const repo_div = document.querySelector(".repo_lists");
const page_list = document.querySelector(".pagination");
let user;
let page;

const displayLoader = () => {
  const section = document.querySelector(".profile");
  section.innerHTML = "";
  section.innerHTML = `<div class="loader">
  <li class="ball"></li>
  <li class="ball"></li>
  <li class="ball"></li>
</div>`;
};

const showAll = (repos, user_data) => {
  //repos.reverse();
  //console.log(repos);

  const avatar = user_data.avatar_url;
  const username = user_data.name;
  const bio = user_data.bio;
  const location = user_data.location;
  const github_link = user_data.html_url;
  const twitter_link = ` https://twitter.com/${user_data.twitter_username}`;

  profile.innerHTML = `<div class="image col-lg-4 row-xs row-sm">
  <img src=${avatar} alt=${username} />
</div>
<div class="personal_info col-lg-8 row-xs row-sm">
  <h2 class="personal_info-username">${username}</h2>
  <h5 class="personal_info-bio">${bio}</h5>
  <h5 class="personal_info-location">${location}</h5>
  <a href=${avatar}>Github: ${github_link}</a>
  <a href=${avatar}>Twitter: ${twitter_link}</a>
</div>`;

  repos.forEach((repo) => {
    const card = document.createElement("div");
    card.classList.add("card", "col-lg-5", "row-xs", "row-sm");
    card.innerHTML = `<div class="card-body">
    <h5 class="card-title">${repo.name}</h5>
    <p class="card-text">
      ${repo.description === null ? repo.name : repo.description}
    </p>
    <p class="btn btn-primary"><a href=${repo.html_url}>Go to Repo</a></p>
  </div>`;
    const topic_div = document.createElement("div");
    topic_div.classList.add("row-gap-3");
    const topics = repo.topics;
    topics.forEach((topic) => {
      let p = document.createElement("p");
      p.classList.add("btn", "btn-info", "me-3");
      p.innerHTML = `${topic}`;
      topic_div.appendChild(p);
    });
    card.appendChild(topic_div);
    repo_div.appendChild(card);
  });
};

const getRepos = async (username, per_page = 10, page = 1) => {
  try {
    displayLoader();
    user = username;
    let response = await fetch(
      `https://api.github.com/users/${username}/repos?type=public&per_page=${per_page}&page=${page}`
    );
    const repos = await response.json();
    // const repos = await octokit.request(`GET /users/${username}/repos`, {
    //   username,
    //   headers: {
    //     "X-GitHub-Api-Version": "2022-11-28",
    //     accept: "application/vnd.github+json",
    //   },
    //   per_page,
    //   page
    // });
    console.log(repos);
    response = await fetch(`https://api.github.com/users/${username}`);
    const user_detail = await response.json();
    // const user_detail = await octokit.request(`GET /users/${username}`, {
    //   username,
    //   headers: {
    //     "X-GitHub-Api-Version": "2022-11-28",
    //   },
    // });
    console.log(user_detail);
    return [repos, user_detail];
  } catch (err) {
    console.log("Error fetching repo", err);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  input.value = "";
  input.focus();
  input2.value = "10";
});

//console.log(searchRepo);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let repos;
  let user_data;
  if (input.value.trim() === "") return;

  profile.innerHTML = "";
  repo_div.innerHTML = "";

  page = parseInt(input2.value);

  getRepos(input.value, !page ? 10 : page).then((res) => {
    repos = res[0];
    user_data = res[1];
    showAll(repos, user_data);
  });
});

page_list.addEventListener("click", (e) => {
  const val = parseInt(e.target.textContent);
  profile.innerHTML = "";
  repo_div.innerHTML = "";
  getRepos(user, !page ? 10 : page, val).then((res) => {
    showAll(res[0], res[1]);
  });
});
