import { PostVoteAttributesInterface } from "./PostVote";
/* eslint-disable class-methods-use-this */
import { Model, DataTypes } from "sequelize";
import db from "../../db/db";
import PostVote from "./PostVote";
import Comment from "./Comment";
import View from "./View";

export interface PostAttributesInterface {
  title: string;
  body: string;
  authorId: number;
  authorName: string;
  createdByTest?: boolean;
  votes?: PostVoteAttributesInterface[];

  // Optional values, not required to add when creating a post
  edited?: boolean;

  // below are automatically generated by the db
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Post extends Model<PostAttributesInterface> {
  constructor(init?: Partial<Post>) {
    super();
    Object.assign(this, init);
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdByTest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "Posts",
    freezeTableName: true, // no alter
    sequelize: db,
  }
);

Post.hasMany(PostVote, {
  foreignKey: "postId",
  as: "votes",
  onDelete: "CASCADE",
});

Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
  onDelete: "CASCADE",
});

Post.hasMany(View, {
  foreignKey: "postId",
  as: "views",
  onDelete: "CASCADE",
});

PostVote.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });
View.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

export default Post;
