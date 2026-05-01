import login from "./components/login_components/login.js";
import register from "./components/login_components/register.js";

import adminHome from "./components/admin_components/adminHome.js";
import adminAddTrack from "./components/admin_components/adminAddTrack.js";
import adminAddAlbum from "./components/admin_components/adminAddAlbum.js";
import adminMusic from "./components/admin_components/music.js";
import updateAlbum from "./components/admin_components/updateAlbum.js";
import updateTrack from "./components/admin_components/updateTrack.js";
import adminUser from "./components/admin_components/adminUser.js";
import adminSearchResult from "./components/admin_components/result.js";

import trackSinglePage from "./components/trackSinglePage.js";
import albumSinglePage from "./components/albumSinglePage.js";

import userHome from "./components/user_components/userHome.js";
import createPlaylist from "./components/user_components/createPlaylist.js";
import playlistSongs from "./components/user_components/playlistSongs.js";
import albumSongs from "./components/albumSongs.js";
import creatorPage from "./components/user_components/creatorPage.js";
import userResult from "./components/user_components/userResult.js";
var routes = [
  // { path: "/user_login", component: userLogin, name: "userLogin" },
  { path: "/", component: login, name: "login" },
  { path: "/register", component: register, name: "register" },

  // { path: "/user_register", component: userRegister, name: "userRegister" },
  // { path: "/admin_login", component: adminLogin, name: "adminLogin" },

  {
    path: "/admin",
    component: adminHome,
    name: "adminHome",
  },

  //   {
  //     path: "/creator",
  //     component: creatorHome,
  //     name: "creatorHome",
  //   },

  {
    path: "/addtrack",
    component: adminAddTrack,
    name: "adminAddTrack",
  },
  { path: "/addalbum", component: adminAddAlbum, name: "adminAddAlbum" },
  { path: "/admin/music", component: adminMusic, name: "adminMusic" },
  { path: "/admin/users", component: adminUser, name: "adminUser" },
  {
    path: "/admin/search",
    component: adminSearchResult,
    name: "adminSearchResult",
    props: true,
  },
  {
    path: "/updatealbum/:album",
    component: updateAlbum,
    name: "updateAlbum",
    props: true,
  },
  {
    path: "/updatetrack/:track",
    component: updateTrack,
    name: "updateTrack",
    props: true,
  },
  {
    path: "/tracksinglepage/:id",
    component: trackSinglePage,
    name: "trackSinglePage",
    props: true,
  },
  {
    path: "/albumsinglepage/:id",
    component: albumSinglePage,
    name: "albumSinglePage",
    props: true,
  },

  {
    path: "/user",
    component: userHome,
    name: "userHome",
  },
  {
    path: "/user/createplaylist",
    component: createPlaylist,
    name: "createPlaylist",
  },
  {
    path: "/user/playlistSongs/:playlist_id",
    component: playlistSongs,
    name: "playlistSongs",
    props: true,
  },
  {
    path: "/user/albumssongs/:id",
    component: albumSongs,
    name: "albumSongs",
    props: true,
  },
  {
    path: "/user/search",
    component: userResult,
    name: "userResult",
    props: true,
  },
  {
    path: "/creatorpage",
    component: creatorPage,
    name: "creatorPage",
  },
];


export default new VueRouter({
  routes,
 
});
