// vote is going to have post id, comment id, or reply id, and the user who voted
// if they upvoted a comment, the post id and reply id will be null. This way we only flag the thing they voted

import { Model, DataTypes } from "sequelize";
import db from "../../db/db";
import CommentVote, { CommentVoteAttributesInterface } from "./CommentVote";
import Post from "./Post";

export interface CommentAttributesInterface {
  userId: number;
  userName: string;
  postId: number;
  createdByTest?: boolean;
  edited?: boolean;
  deleted?: boolean;
  replyCommentId?: number | null;
  replyUserName?: string | null;
  replyUserId?: string | null;
  comment: string;
  commentVotes?: CommentVoteAttributesInterface[];

  // below are automatically generated by the db
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Comment extends Model<CommentAttributesInterface> {
  constructor(init?: Partial<Comment>) {
    super();
    Object.assign(this, init);
  }
}

Comment.init(
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    replyCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    replyUserName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    replyUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
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
    tableName: "Comments",
    // freezeTableName: true, // no alter
    sequelize: db,
  }
);

Comment.hasMany(CommentVote, { foreignKey: "commentId", as: "commentVotes" });
CommentVote.belongsTo(Comment, { foreignKey: "commentId" });

export default Comment;
