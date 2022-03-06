import React, { useEffect, useState } from "react";
import { getGitHubData } from "../Action/index";
import Pagination from "../Pagination/Pagination";
import "./Github.css";
const Github = () => {
  /**
   * @States
   */
  // User Profile Data
  const [userdata, setUserData] = useState({});
  // User Repository Data
  const [repoData, setRepoData] = useState([]);
  // Data Loading State
  const [loading, setLoading] = useState(true);
  // Dropdown Filter
  const [select, setSelect] = useState("");
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [repoPerPage] = useState(4);
  /** @function
   * Function For fetching data
   */
  const getUserGithub = async () => {
    let fetchedData = await getGitHubData();
    // Setting Values
    setUserData({
      id: fetchedData.data.data.user.id,
      name: fetchedData.data.data.user.name,
      avatar_url: fetchedData.data.data.user.avatarUrl,
      login: fetchedData.data.data.user.login,
      bio: fetchedData.data.data.user.bio,
      followers: fetchedData.data.data.user.followers.totalCount,
      following: fetchedData.data.data.user.following.totalCount,
      location: fetchedData.data.data.user.location,
    });
    // Setting Values For SetStates(repoData)
    setRepoData(fetchedData.data.data.user.repositories.nodes);
    // Data is Fetched So loading status change to False
    setLoading(false);
  };

  // Function for sorting repos according to selected option
  const HandleSelect = (selectedValue) => {
    setSelect(selectedValue);
    if (selectedValue === "All") {
      getUserGithub();
    } else if (selectedValue === "Stars") {
      let DescendingOrder = repoData.sort((a, b) => {
        return b.stargazerCount - a.stargazerCount;
      });
      setRepoData(DescendingOrder);
    } else if (selectedValue === "CreatedOn") {
      let createdOn = repoData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRepoData(createdOn);
    }
  };

  // React UseEffect hook for Mounting Function
  useEffect(() => {
    getUserGithub();
  }, []);

  //GET Current Posts
  const indexOfLastRepo = currentPage * repoPerPage;
  const indexOfFirstPost = indexOfLastRepo - repoPerPage;
  const currentRepo = repoData.slice(indexOfFirstPost, indexOfLastRepo);
  // Setting page number of repo for pagination
  const paginate = (repoNumber) => {
    setCurrentPage(repoNumber);
  };

  return (
    <div className="Main">
      <div className="Container">
        {/* Checking if Data is Available or Not */}
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <div className="left-side">
              <div className="user-image">
                <img src={userdata.avatar_url} alt="UserProfile"></img>
              </div>
              <div>
                <div className="bigText2">{userdata.name}</div>
                <div className="normalText2">{userdata.login}</div>
              </div>
              <div className="normalText">{userdata.bio}</div>
              <div className="profile-btn">Follow</div>
              <div className="block normalText">
                <img src="/icons/user.png" width="16px" alt="UserIcon"></img>
                <div>
                  <span className="smallText2">
                    {userdata.followers > 999
                      ? (userdata.followers / 1000).toFixed(1) + "K "
                      : userdata.followers}
                  </span>
                  followers
                </div>
                <span className="normalText">.</span>
                <div>
                  <span className="smallText2"> {userdata.following}</span>{" "}
                  following
                </div>
              </div>
              <div>
                <img src="/icons/map.png" width="16px" alt="locationIcon"></img>
                {userdata.location}
              </div>
            </div>

            <div className="right-side">
              <div className="repo-detail">
                <div>
                  <img src="/icons/book.png" width="24px" alt="BookIcon"></img>
                  Repositories{" "}
                  <span className="customCircle">{repoData.length}</span>
                </div>
              </div>
              <div className="filter-with-pagination">
                <div>
                  <select
                    className="form-select bg-dark text-white"
                    aria-label="Default select example"
                    value={select}
                    onChange={(e) => HandleSelect(e.target.value)}
                  >
                    <option value="All" defaultValue>
                      All
                    </option>
                    <option value="Stars">Stars</option>
                    <option value="CreatedOn">Created On</option>
                  </select>
                </div>
                <div>
                  <Pagination
                    repoPerPage={repoPerPage}
                    totalRepo={repoData.length}
                    paginate={paginate}
                  />
                </div>
              </div>
              {select.length > 1
                ? currentRepo?.map((item) => (
                    <div className="Repo-Cards" key={item.id}>
                      <div className="title-with-creation">
                        <div className="bigText" style={{ color: "#47A6FF" }}>
                          {item.name}
                        </div>
                        <div
                          className="smallText"
                          style={{ paddingLeft: "10px" }}
                        >
                          Creation Date{" "}
                          <span className="customCircle">
                            {" "}
                            {new Date(item.createdAt).toLocaleDateString()}{" "}
                          </span>
                        </div>
                      </div>
                      <div className="normalText">{item.description}</div>
                      <div className="repo-info">
                        <div className=" smallText ">
                          {item.languages.nodes.map((item) => (
                            <div key={Math.random()}>
                              {" "}
                              <span className="roundCircle">S</span>
                              {item.name}
                            </div>
                          ))}
                        </div>

                        <div className="smallText customAlign ">
                          <img
                            src="/icons/star.png"
                            width="16px"
                            alt="starIcon"
                          ></img>
                          {item.stargazerCount}
                        </div>
                        <div className="smallText customAlign">
                          <img
                            src="/icons/code.png"
                            width="16px"
                            alt="codeIcon"
                          ></img>
                          {item.forkCount}
                        </div>
                        <div className="smallText customAlign">
                          Ratio{" "}
                          {/* { ((item.forkCount/item.stargazerCount)*100)===NaN? 0 : Math.abs((item.forkCount/item.stargazerCount)*100).toFixed(2)}% */}
                          {item.forkCount === 0 && item.stargazerCount === 0
                            ? 0.0
                            : Math.abs(
                                (item.forkCount / item.stargazerCount) * 100
                              ).toFixed(2)}
                          %
                        </div>
                        <div className="smallText">
                          Updated On {new Date(item.updatedAt).toDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                : currentRepo?.map((item) => (
                    <div className="Repo-Cards" key={item.id}>
                      <div className="title-with-creation">
                        <div className="bigText" style={{ color: "#47A6FF" }}>
                          {item.name}
                        </div>
                        <div
                          className="smallText"
                          style={{ paddingLeft: "10px" }}
                        >
                          Creation Date{" "}
                          <span className="customCircle">
                            {" "}
                            {new Date(item.createdAt).toLocaleDateString()}{" "}
                          </span>
                        </div>
                      </div>
                      <div className="normalText">{item.description}</div>
                      <div className="repo-info">
                        <div className=" smallText ">
                          {item.languages.nodes.map((item) => (
                            <div key={Math.random()}>
                              {" "}
                              <span className="roundCircle">S</span>
                              {item.name}
                            </div>
                          ))}
                        </div>

                        <div className="smallText customAlign ">
                          <img
                            src="/icons/star.png"
                            width="16px"
                            alt="starIcon"
                          ></img>
                          {item.stargazerCount}
                        </div>
                        <div className="smallText customAlign">
                          <img
                            src="/icons/code.png"
                            width="16px"
                            alt="codeIcon"
                          ></img>
                          {item.forkCount}
                        </div>
                        <div className="smallText customAlign">
                          Ratio{" "}
                          {/* {item.forkCount===0 && item.stargazerCount===0 ? 1: 0 }% */}
                          {item.forkCount === 0 && item.stargazerCount === 0
                            ? 0.0
                            : Math.abs(
                                (item.forkCount / item.stargazerCount) * 100
                              ).toFixed(2)}
                          %
                        </div>
                        <div className="smallText">
                          Updated On {new Date(item.updatedAt).toDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Github;
