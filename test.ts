import { findSongId, getPlaylistContent } from "."

// findSongId({
//   artist: "세븐틴",
//   channelIds: {},
//   name: "SWEETEST THING",
// }).then(console.log)

getPlaylistContent(
  "https://music.bugs.co.kr/nextbugs/share/myalbum/172530"
).then(console.log)
