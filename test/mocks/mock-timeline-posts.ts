export const mockTimelinePost = {
  _id: '1',
  userId: 'user123',
  content: 'This is a test post',
  media: ['image.jpg'],
  reactions: {
    liked: ['userA', 'userB'],
    beast: ['userC'],
    plays_great: ['userD'],
    amazing_goal: ['userE'],
    stylish: ['userF'],
  },
  comments: [
    { userId: 'userA', content: 'Nice post!', commentDate: new Date() },
  ],
  postDate: new Date(),
};

export const mockTimelinePosts = [mockTimelinePost, mockTimelinePost];
