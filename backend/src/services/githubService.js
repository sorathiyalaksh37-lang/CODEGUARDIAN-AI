import axios from "axios";

// GET DEFAULT BRANCH
const getDefaultBranch = async (owner, repo) => {

  try {

    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    return repoResponse.data.default_branch;

  } catch (error) {

    console.log("Branch Error:", error.message);

    return "main";

  }

};

// GET REPOSITORY FILES
const getRepoFiles = async (owner, repo) => {

  try {

    // GET DEFAULT BRANCH
    const branch = await getDefaultBranch(owner, repo);

    console.log("DEFAULT BRANCH:", branch);

    // FETCH TREE
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    console.log("FILES FETCHED:", response.data.tree?.length);

    return response.data.tree || [];

  } catch (error) {

    console.log(
      "GitHub Fetch Error:",
      error.response?.data || error.message
    );

    return [];

  }

};

// GET FILE CONTENT
export const getFileContent = async (
  owner,
  repo,
  filePath
) => {

  try {

    const branch = await getDefaultBranch(owner, repo);

    const response = await axios.get(
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
    );

    if (typeof response.data === "string") {
      return response.data;
    }

    return JSON.stringify(response.data);

  } catch (error) {

    console.log(
      "Content Fetch Error:",
      error.message
    );

    return "";

  }

};

export default getRepoFiles;