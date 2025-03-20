export const mockTimelinePost = {
    _id: '1',
    userId: 'user123',
    content: 'This is a test post',
    media: ['image.jpg'],
    likes: ['userA', 'userB'],
    comments: [
      { userId: 'userA', content: 'Nice post!' },
      { userId: 'userB', content: 'Great content!' },
    ],
    createdAt: new Date(),
  };

export const mockTimelinePosts = [mockTimelinePost];
  