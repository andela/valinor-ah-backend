export const articleWithValidData = {
  title: 'My story at the beach',
  slug: 'My-story-at-the-beach-2324232323',
  description: 'This is my story at the beach',
  body: 'Once upon a time in Mexico.. there was ...',
  userId: 1,
  readTime: 3600,
  categoryId: 2
};

export const articleWithInValidData = {
  title: 'My story at the beach',
  description: 'This is my story at the beach',
  body: 'Once upon a time in Mexico.. there was ...',
};

export const articleInputValid = {
  title: 'How to write you name',
  description: 'This article talks about how to write your name',
  body: 'let\'s talk about names, what is your name?',
  tags: ['football', 'naming', 'conventions'],
  categoryId: 1,
};


export const articleInputNoTitle = {
  description: 'This article talks about how to write your name',
  body: 'let\'s talk about names, what is your name?',
};

export const articleInputInvalidTags = {
  title: 'How to write you name',
  description: 'This article talks about how to write your name',
  body: 'let\'s talk about names, what is your name?',
  tags: [123, 'naming', 'conventions']
};
