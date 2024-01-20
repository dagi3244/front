import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { useContext } from "react";
import { AuthContext } from "../../App";
import "./forum.css";
import { getQuestions, createQuestionLike, getAllUserImages } from "../../api";
import UserProfile from "../../components/userProfile/UserProfile";
import Notification from "../../components/notification/Notification";
import { RiArrowDropDownLine } from "react-icons/ri";
import UserMenu from "../../components/usermenu/UserMenu";
import Avatar from "react-avatar";
function Forum() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [like, setLike] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentCount, setCommentCount] = useState({});
  const [commentToggle, setCommentToggle] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
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
  }, [token, commentCount, like]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile image data
        await getAllUserImages(token).then((data) => {
          setUser((prevUser) => ({ ...prevUser, imageBlob: data }));
        });
      } catch (error) {
        console.error(`Error fetching user profile image: ${error.message}`);
      }
    };

    fetchUserProfile();
  }, [token, userImage]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleLike = async (id) => {
    try {
      await createQuestionLike(token, id);
      setLike(id);
    } catch (err) {
      console.log(err);
    }
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
          {/* <div
            className="user"
            onMouseEnter={() => setUserMenu(true)}
            onMouseLeave={() => setUserMenu(false)}
          > */}
          {/* <div className="user-profile">
              {/* <UserProfile userid={user?.userid} /> */}
          {/* {user?.imageBlob && user.imageBlob[user?.userid] ? (
                <img
                  src={
                    user?.imageBlob
                      ? `https://evangadi-student-forum-backend.vercel.app/api/all/images/${
                          user.imageBlob[user?.userid]
                        }`
                      : ""
                  }
                  alt="User Profile"
                />
              ) : (
                <Avatar
                  name={user?.username}
                  size="40"
                  round={true}
                  // color={randomColor}
                />
              )}
            </div> 
            <div className="user-name">
              <h3>
                {user?.username}
                <RiArrowDropDownLine />
              </h3>
            </div> */}
          {/* {userMenu && (
              <UserMenu
                refresh={() => {
                  setUserImage(!userImage);
                }}
              />
            )} */}
          {/* </div> */}
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
                        <button onClick={() => handleLike(data.questionid)}>
                          <AiFillLike />
                          {data.like_count > 0 && (
                            <span style={{ margin: "0px 5px" }}>
                              {data.like_count}
                            </span>
                          )}
                        </button>
                        <button onClick={() => handleComment(data.questionid)}>
                          {data.comment_count > 0 && (
                            <span style={{ margin: "0px 5px" }}>
                              {data.comment_count}{" "}
                            </span>
                          )}
                          comment
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
