import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { useContext } from "react";
import { AuthContext } from "../../App";
import "./forum.css";
import { getQuestions } from "../../api";
import UserProfile from "../../components/userProfile/UserProfile";

function Forum() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState(null);
  const [commentToggle, setCommentToggle] = useState(false);

  const { user, setUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [userImage, setUserImage] = useState(null);
  const options = {
    minute: "numeric",
    hour: "numeric",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  useEffect(() => {
    const fetchData = async () => {
      await getQuestions(token)
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    };
    fetchData();
  }, [token]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleComment = (id) => {
    setComment(id);
    comment === id ? setCommentToggle(!commentToggle) : setCommentToggle(true);
  };
  return (
    <section className="forum">
      <div className="forum-main">
        <div className="forum-header">
          <div className="askq">
            <Link to="askQ">Ask Question</Link>
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search for question"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="forum-body">
          <div className="forum-title"></div>
          {data.length > 0 ? (
            data?.map((data) => {
              return (
                <div key={data.questionid} style={{ width: "100%" }}>
                  {data.title.toLowerCase().includes(search) && (
                    <div className="question">
                      <div className="question-header">
                        <div className="question-title">
                          <h3>{data.title}</h3>
                        </div>
                        <div className="question-user">
                          <div className="user-profile">
                            <UserProfile
                              username={data.username}
                              userid={data.userid}
                            />
                          </div>
                          <div className="user-name">
                            <h3>
                              by <span> {data.username}</span>
                            </h3>
                          </div>
                          <div className="created-at">
                            {new Date(data.createdAt).toLocaleString(
                              "en-US",
                              options
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="question-body">
                        <p>{data.description}</p>
                      </div>
                      <div className="question-reply">
                        <button onClick={() => handleComment(data.questionid)}>
                          Answer
                        </button>
                      </div>{" "}
                      {comment === data.questionid && commentToggle && (
                        <Outlet
                          context={{
                            questionid: data.questionid,
                            options: options,
                            addCommentCount: (commentCount) => {
                              setCommentCount((prev) => ({
                                ...prev,
                                [data.questionid]: commentCount,
                              }));
                            },
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Forum;
