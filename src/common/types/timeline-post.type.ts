// timeline-post.type.ts
export interface TimelinePostType {
  _id: string;
  userId: number;
  content: string;
  media: string[];
  reactions: {
    liked: number[];
    beast: number[];
    plays_great: number[];
    amazing_goal: number[];
    stylish: number[];
  };
  comments: {
    userId: number;
    content: string;
    commentDate: string;
  }[];
  postDate: string;
  __v?: number;
}
