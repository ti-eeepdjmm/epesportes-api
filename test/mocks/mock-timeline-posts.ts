export const createMockTimelinePost = () => ({
  _id: '507f1f77bcf86cd799439011',
  userId: 'user123',
  content: 'Test post',
  reactions: {
    liked: [],
    beast: [],
    plays_great: [],
    amazing_goal: [],
    stylish: [],
  },
  comments: [],
  save: jest.fn().mockResolvedValue(this),
});

export const mockTimelinePost = {
  _id: '507f1f77bcf86cd799439011',
  userId: 'user123',
  content: 'Post de teste',
  reactions: {
    liked: [],
    beast: [],
    plays_great: [],
    amazing_goal: [],
    stylish: [],
  },
  comments: [],
  save: jest.fn().mockResolvedValue(this),
};

export const createMockTimelinePosts = () => [
  { ...mockTimelinePost },
  {
    ...mockTimelinePost,
    _id: '507f1f77bcf86cd799439012',
    userId: 'user456',
    content: 'Outro post',
  },
];
