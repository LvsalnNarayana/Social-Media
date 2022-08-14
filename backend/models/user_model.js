import bcryptjs from "bcryptjs";
//________  require mongoose  ________//
import mongoose from "mongoose";

//________  schema  ________//
const schema = mongoose.Schema;

//________  user schema  ________//
const user_schema = new schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      get: (data) => capitalize(data),
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    posts: [
      {
        post_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      },
    ],
    friends: [
      {
        friend_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
//=============================================
//_____________  encrypt password  ___________
//=============================================
user_schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

//=============================================
//_________________  Methods  _________________
//=============================================
user_schema.set("toJSON", {
  getters: true,
  virtuals: true,
  transform: (doc, ret, options) => {
    return transform_data(doc, ret, options);
  },
});
user_schema.set("toObject", {
  getters: true,
  virtuals: true,
  transform: (doc, ret, options) => {
    return transform_data(doc, ret, options);
  },
});

user_schema.statics.GET_USER_BY_ID = (user_id) => {
  const user = User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(user_id),
      },
    },
    // {
    //   $lookup: {
    //     from: "posts",
    //     localField: "posts.post_id",
    //     foreignField: "_id",
    //     pipeline: [
    //       {
    //         $lookup: {
    //           from: "users",
    //           localField: "user",
    //           foreignField: "_id",
    //           pipeline: [
    //             {
    //               $project: {
    //                 _id: 0,
    //                 __v: 0,
    //                 posts: 0,
    //                 friends: 0,
    //                 password: 0,
    //                 createdAt: 0,
    //                 updatedAt: 0,
    //                 dob: 0
    //               }
    //             }
    //           ],
    //           as: "user"
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           __v: 0
    //         }
    //       }
    //     ],
    //     as: "posts",
    //   }
    // },
    {
      $addFields: {
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        password: 0,
        posts: 0,
        friends: 0
      },
    },
  ]);
  return user;
};
user_schema.statics.GET_USER_BY_USERNAME = (username) => {
  const user = User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    // {
    //   $lookup: {
    //     from: "posts",
    //     localField: "posts.post_id",
    //     foreignField: "_id",
    //     pipeline: [
    //       {
    //         $lookup: {
    //           from: "users",
    //           localField: "user",
    //           foreignField: "_id",
    //           pipeline: [
    //             {
    //               $project: {
    //                 _id: 0,
    //                 __v: 0,
    //                 posts: 0,
    //                 friends: 0,
    //                 password: 0,
    //                 createdAt: 0,
    //                 updatedAt: 0,
    //                 dob: 0
    //               }
    //             }
    //           ],
    //           as: "user"
    //         }
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           __v: 0
    //         }
    //       }
    //     ],
    //     as: "posts",
    //   }
    // },
    {
      $addFields: {
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        posts: 0,
        friends: 0
      },
    },
  ]);
  return user;
};
user_schema.statics.SEARCH_BY_USERNAME = (username) => {
  //   const user = User.find({
  //     username: { $regex: `^${username}+`, $options: "i" },
  //   }).select("username");
  const user = User.aggregate([
    {
      $match: {
        username: {
          $regex: `^${username}+`,
          $options: "i",
        },
      },
    },
    {
      $addFields: {
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
      },
    },
    {
      $project: {
        username: 1,
      },
    },
  ]);
  return user;
};
user_schema.statics.GET_PROFILE = (user_id, profile_name, user_stat) => {
  profile_name = profile_name.toLowerCase()
  const profile = User.aggregate([
    {
      $match: {
        username: profile_name,
      },
    },
    {
      $lookup: {
        from: "requests",
        localField: "_id",
        foreignField: "receiver_id",
        as: "requests",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "posts.post_id",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    __v: 0,
                    posts: 0,
                    friends: 0,
                    password: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    dob: 0
                  }
                }
              ],
              as: "user"
            }
          },
          {
            $project: {
              _id: 0,
              __v: 0
            }
          },
          {
            $unwind: '$user'
          },
          {
            $sort: {
              "createdAt": -1
            }
          },
        ],
        as: "posts",
      },
    },
    {
      $addFields: {
        id: "$_id".toString(),
        status: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$requests",
                      as: "request",
                      cond: {
                        $eq: [
                          "$$request.sender_id",
                          mongoose.Types.ObjectId(user_id),
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
            then: "requested",
            else: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$friends",
                          as: "friend",
                          cond: {
                            $eq: [
                              "$$friend.friend_id",
                              mongoose.Types.ObjectId(user_id),
                            ],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: "friend",
                else: null,
              },
            },
          },
        },
      },
    },
    {
      $project: {
        requests: 0,
        _id: 0,
        __v: 0,
        password: 0,
      },
    },
    {
      $addFields: {
        posts: {
          $filter: {
            input: "$posts",
            as: "post",
            cond: {
              $cond: {
                if: {
                  $eq: [user_stat, false]
                },
                then: {
                  $ne: ['$$post.post_type', 'only_me']
                },
                else: '$posts'
              }
            },
          }
        }
      }
    }
  ]);
  return profile;
};
user_schema.statics.GET_FRIENDS = (user_id) => {
  const friends = User.findById(user_id).select("friends");
  return friends;
};
user_schema.statics.GET_ACTIVE_FRIENDS = (user_id_array) => {
  const friends = User.aggregate([
    {
      $match: {
        _id: {
          $in: user_id_array
        }
      }
    },
    {
      $addFields: {
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $project: {
        _id: 0,
        password: 0,
        __v: 0,
        posts: 0,
        friends: 0,
        dob: 0,
        updatedAt: 0,
        createdAt: 0
      }
    }
  ])
  return friends
}

user_schema.statics.GET_POSTS = (user_id) => {
  const posts = User.findById(user_id).select("posts");
  return posts;
};


user_schema.statics.UPDATE_FRIEND = (user_id, friend_id) => {
  const user = User.findByIdAndUpdate(user_id, {
    $push: { friends: { friend_id: friend_id } },
  });
  return user;
};

user_schema.statics.GET_FRIEND_IDS = (user_id) => {
  const friend_ids = User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(user_id)
      }
    },
    {
      $addFields: {
        friend_ids: {
          $map: {
            input: "$friends",
            in: {
              $toObjectId: "$$this.friend_id",
            }
          }
        }
      }
    },
    {
      $project: {
        friend_ids: 1
      }
    }
  ]);
  return friend_ids
}

function capitalize(word) {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
}

function transform_data(doc, data, options) {
  delete data.__v;
  data.id = data._id.toString();
  delete data._id;
  delete data.password;
  if (data["posts"] !== undefined || data["posts"] !== null) {
    data.posts?.forEach((post) => {
      delete post._id;
      post.post_id = post.post_id.toString();
    });
  }
  if (data["friends"] !== undefined || data["friends"] !== null) {
    data.friends?.forEach((friend) => {
      delete friend._id;
      friend.friend_id = friend?.friend_id.toString();
    });
  }
  return data;
}

//create mongoose model
const User = mongoose.model("User", user_schema);
export default User;
