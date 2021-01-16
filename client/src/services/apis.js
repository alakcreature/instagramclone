const envoirnment = process.env.NODE_ENV;
const apis = {

    BASE_LOCAL_URL : envoirnment === "development" ? "http://localhost:5000" : "",
    BASE_SERVER_URL : envoirnment === "development"? "http://localhost:5000": "",

    LOGIN : "/signin",
    REGISTER : "/api/signup",
    FORGOT_PASSWORD : "/api/forgot-password",
    RESET_PASSWORD : "/api/reset-password",
    ALLPOSTS: "/allpost",
    MYPOST: "/mypost",
    LIKEPOST: "/like",
    UNLIKEPOST: "/unlike",
    ADDCOMMENT: "/comments",
    DELETECOMMENT: "/deletecomment",
    DELETEPOST: "/delete",
    OTHERUSERPROFILE: "/user",
    FOLLOWUSER: "/follow",
    UNFOLLOWUSER: "/unfollow",
    SUBPOST: "/getsubpost",
    UPDATEPIC: "/updatepic",
};

export default apis;