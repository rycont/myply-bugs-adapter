import axios from "axios"
import FormData from "form-data"
import { Adaptor, Playlist, Song } from "myply-common"

const endpoints = {
  search: () => "https://m.bugs.co.kr/api/getSearchList",
  getPlaylistContent: () => "https://m.bugs.co.kr/api/getShareAlbumList",
}

const createFormData = <T extends Record<string, string | number>>(data: T) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return [
    formData,
    {
      headers: formData.getHeaders(),
    },
  ]
}

export const findSongId = async (song: Song): Promise<string> => {
  const payload = createFormData({
    type: "track",
    query: `${song.artist} ${song.name}`,
    page: 1,
    size: 1,
    _ci: "",
    _at: "",
  })

  const res = await axios.post(endpoints.search(), ...payload)

  return res.data.list[0].track_id
}

export const getPlaylistContent = async (uri: string): Promise<Playlist> => {
  const payload = createFormData({
    track_share_log_id: uri.split("/").slice(-1)[0],
    size: 25,
    _ci: "",
    _at: "",
  })
  const { data: rawPlaylist } = await axios.post(
    endpoints.getPlaylistContent(),
    ...payload
  )

  return {
    name: rawPlaylist.info.title,
    preGenerated: {
      bugs: uri,
    },
    tracks: rawPlaylist.list.map(
      (track: { track_title: string; artists: { artist_nm: string }[] }) => ({
        name: track.track_title,
        artist: track.artists[0].artist_nm,
      })
    ),
  }
}

export const generateURL = async (playlist: Playlist): Promise<string> => {
  return Promise.resolve(
    `bugs3://app/tracks/lists?title=${encodeURIComponent(
      playlist.name
    )}&miniplay=Y&track_ids=${playlist.tracks
      .map((e) => e.channelIds.bugs)
      .join("|")}`
  )
}

export const BugsAdapter: Adaptor = {
  findSongId,
  generateURL,
  getPlaylistContent,
  determinator: ["bugs"],
  display: {
    color: "#FF3B28",
    logo: `<svg width="378" height="147" viewBox="0 0 378 147" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_426_227)">
    <path d="M61.0156 118.641L73.2708 117.599C73.2708 117.599 82.9219 117.078 82.9219 104.693C82.9219 92.3073 76.5312 81.0937 65.8385 81.0937H54.1094L61.0156 118.641ZM50.7188 1.30729C88.3959 0.786452 97 30.25 97 49.9375C97 69.625 81.6146 72.375 81.6146 72.375C95.8281 74.6094 107.167 87.2239 107.167 112.516C107.167 137.807 82.6615 139.37 82.6615 139.37L41.4635 142.24L18.9063 44.1979C18.9063 36.7656 23.8594 30.7708 33.6406 30.7708C43.4167 30.7708 45.3698 39.6354 45.3698 39.6354L49.8073 59.8437H62.7135C64.1458 59.8437 75.4896 57.1042 71.5781 40.1562C67.6667 23.2083 54.5 22.9479 54.5 22.9479H23.2083C12.7812 22.9479 7.6927 13.9531 7.6927 13.9531L0 0L50.7188 1.30729Z" fill="white"/>
    <path d="M110.688 33.5104H137.286L142.891 120.99C142.891 120.99 143.281 130.766 151.365 130.766C159.448 130.766 159.578 122.161 159.578 120.859C159.578 119.557 157.495 39.7657 157.495 39.7657C157.495 39.7657 158.927 29.3334 169.88 29.3334C180.833 29.3334 181.615 40.0261 181.615 40.0261L182.917 142.24C182.917 142.24 174.703 143.021 172.094 143.021C169.49 143.021 162.318 141.719 160.234 135.198C160.234 135.198 156.323 146.672 139.896 146.672C123.469 146.672 119.557 130.505 119.557 130.505L110.688 33.5104Z" fill="white"/>
    <path d="M217.99 36.7657C217.464 40.5469 215.51 64.2761 215.51 68.448C215.51 72.6198 216.682 80.7032 223.984 80.7032C231.287 80.7032 232.589 73.6615 233.5 68.8386C234.417 64.0156 235.849 52.8021 236.5 37.8073C237.151 22.8177 228.417 23.0781 228.417 23.0781C220.203 23.0781 218.51 32.9844 217.99 36.7657ZM219.422 6.13024C219.422 6.13024 234.156 4.56253 239.76 20.0781C239.76 20.0781 243.151 10.1719 254.62 10.1719H262.448L252.016 103.125C252.016 103.125 251.365 127.901 220.594 127.901C220.594 127.901 195.693 129.594 194.391 108.734C194.391 108.734 194.26 97.3906 203.906 97.3906C203.906 97.3906 213.297 96.4792 213.297 107.172C213.297 107.172 213.948 116.036 220.854 116.036C227.766 116.036 231.417 111.865 232.984 85.6563C232.984 85.6563 227.766 95.1719 212.901 95.1719C198.042 95.1719 190.74 85.9167 192.563 58.1459C194.391 30.3802 193.87 7.30208 219.422 6.13024" fill="white"/>
    <path d="M262.448 93.7396H282.13C282.13 93.7396 277.177 109.255 286.172 109.255C295.167 109.255 296.214 96.349 296.214 96.349C296.214 96.349 297.125 88.5261 286.828 82.9167C276.526 77.3125 268.573 67.6667 269.354 55.6719C270.135 43.6771 275.875 16.5573 304.688 16.5573C304.688 16.5573 326.458 15.125 326.458 36.375C326.458 57.625 315.901 58.2813 313.292 58.2813C313.292 58.2813 305.078 58.146 305.078 50.4584C305.078 42.7657 308.339 35.5938 301.167 35.5938C293.995 35.5938 290.995 45.6302 290.995 48.7604C290.995 51.8906 291.255 55.8021 297.646 60.8854C304.031 65.9688 315.766 72.099 315.766 88.0052C315.766 103.911 303.646 125.292 280.828 125.292C258.01 125.292 260.099 109.385 262.448 93.7396" fill="white"/>
    <path d="M325.849 103.781C325.849 109.349 330.365 113.865 335.932 113.865C341.5 113.865 346.016 109.349 346.016 103.781C346.016 98.2135 341.5 93.6979 335.932 93.6979C330.365 93.6979 325.849 98.2135 325.849 103.781Z" fill="white"/>
    <path d="M350.448 11.0833H377.953L349.276 82.401C349.276 82.401 346.927 88.526 340.667 88.526C340.667 88.526 332.583 88.7864 334.281 79.0104L350.448 11.0833Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_426_227">
    <rect width="377.953" height="146.672" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    `,
    name: "벅스",
  },
}
