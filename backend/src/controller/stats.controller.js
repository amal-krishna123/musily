import { Song } from "../model/song.model.js";
import { Album } from "../model/album.model.js";
import { User } from "../model/user.model.js";

export const getStats =  async (req, res, next) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, totalArtists] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: 'albums',
            pipeline: []
          }
        },
        { 
          $group: {
            _id: "$artist",
          }
        },
        {
          $count: "count"
        }
      ])

    ]);
    res.status(200).json({ totalSongs, totalAlbums, totalUsers, totalArtists: totalArtists[0]?.count || 0 });

  } catch (error) {
    next(error);
  }
};