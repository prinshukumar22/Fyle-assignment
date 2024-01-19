const fetchRepositories = async (topic, page, perPage = 10) => {
  const clientId = "https://github.com/Vaibhav7720";
  const clientSecret = "your-client-secret";
  const auth = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(
    `https://api.github.com/search/repositories?q=topic:${topic}&per_page=${perPage}&page=${page}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  const data = await response.json();
  return data.items;
};

const displayRepositories = (repositories) => {
  const container = document.getElementById("repositories-container");
  container.innerHTML = "";
  repositories.forEach((repository) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h2>${repository.name}</h2>
        <p>${repository.description}</p>
        <a href="${repository.html_url}">View on GitHub</a>
      `;
    container.appendChild(card);
  });
};

const handleTopicChange = async (event) => {
  const topic = event.target.value;
  const page = 1;
  const repositories = await fetchRepositories(topic, page);
  displayRepositories(repositories);
};

const handlePageChange = async (event) => {
  const page = event.target.value;
  const topic = document.getElementById("topic-input").value;
  const repositories = await fetchRepositories(topic, page);
  displayRepositories(repositories);
};

const handleSearch = async (event) => {
  const searchTerm = event.target.value;
  const page = 1;
  const repositories = await fetchRepositories(searchTerm, page);
  displayRepositories(repositories);
};

const init = async () => {
  const topic = document.getElementById("topic-input").value;
  const page = 1;
  const repositories = await fetchRepositories(topic, page);
  displayRepositories(repositories);
};

const search = document.querySelector("#search-button");
search.addEventListener("click", init);
