import {
  EssayQuestionData,
  FillInBlankQuestionData,
  MatchingQuestionData,
  MultipleChoiceQuestionData,
  OrderingQuestionData,
  QuestionData,
  ShortAnswerQuestionData,
  TrueFalseQuestionData,
} from '@edusama/common';

import { QuestionDifficulty, QuestionType } from '../generated/prisma/client';

type Data = {
  id: string;
  name: string;
  description: string;
  branchId: number;
  curriculums: {
    id: string;
    name: string;
    description: string;
    lessons: {
      id: string;
      name: string;
      description: string;
      order: number;
      questions?: {
        id: string;
        type: QuestionType;
        difficulty: QuestionDifficulty;
        questionText: string;
        questionData: QuestionData;
      }[];
    }[];
  }[];
};

export function generateSubjects(branchId: number) {
  return {
    english: {
      id: crypto.randomUUID(),
      name: 'English',
      description: 'English Language Learning',
      branchId,
      curriculums: [
        {
          id: crypto.randomUUID(),
          name: 'Beginner (A1)',
          description: 'Introduction to English for absolute beginners',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Greetings and Introductions',
              description: 'Learn how to greet people and introduce yourself',
              order: 0,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Choose the correct greeting: 'Good _____!'",
                  questionData: {
                    options: ['morning', 'afternoon', 'evening', 'night'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "How do you respond to 'How are you?' when you're fine?",
                  questionData: {
                    options: ["I'm good", "I'm here", "I'm going", "I'm done"],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What is the correct way to introduce yourself?',
                  questionData: {
                    options: [
                      'My name John',
                      'I am John',
                      'John I am',
                      'Am I John',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Choose the polite response to 'Thank you'",
                  questionData: {
                    options: ['Please', "You're welcome", 'Thanks', 'Sorry'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which word means 'hello' in a formal way?",
                  questionData: {
                    options: ['Hi', 'Hey', 'Good day', 'Yo'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "How do you ask someone's name?",
                  questionData: {
                    options: [
                      "What's your name?",
                      'Where are you?',
                      'How old are you?',
                      'What do you do?',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Choose the correct farewell: 'See you _____!'",
                  questionData: {
                    options: ['after', 'soon', 'later', 'tomorrow'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which is a formal greeting?',
                  questionData: {
                    options: ['Hey dude', 'Howdy', 'Good morning, sir', 'Yo'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'How do you say goodbye in the evening?',
                  questionData: {
                    options: [
                      'Good morning',
                      'Good afternoon',
                      'Good evening',
                      'Good night',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What do you say when meeting someone for the first time?',
                  questionData: {
                    options: [
                      'Nice to meet you',
                      'Nice to leave you',
                      'Nice to forget you',
                      'Nice to avoid you',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Hello' is a formal greeting.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Good morning' is used in the afternoon.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'How do you do?' is a common informal greeting.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'Pleased to meet you' is a polite response when introduced to someone.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'See you later' means you will never meet again.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'Thank you' should be responded to with 'Please'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'Excuse me' is used to get someone's attention.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'Goodbye' is only used when leaving for a long time.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'Nice to meet you' is said at the beginning of a conversation.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'How are you?' always requires a detailed answer about your health.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the most common informal greeting in English?',
                  questionData: {
                    correctAnswers: ['hi', 'hello'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    "How do you respond when someone says 'Nice to meet you'?",
                  questionData: {
                    correctAnswers: [
                      'nice to meet you too',
                      'you too',
                      'likewise',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What do you say when you accidentally bump into someone?',
                  questionData: {
                    correctAnswers: ['excuse me', 'sorry', 'pardon me'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    "What is a polite way to say 'hello' in the morning?",
                  questionData: {
                    correctAnswers: ['good morning'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "How do you ask about someone's well-being?",
                  questionData: {
                    correctAnswers: ['how are you'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do you say when leaving someone?',
                  questionData: {
                    correctAnswers: ['goodbye', 'bye', 'see you later'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the response to 'How do you do?'",
                  questionData: {
                    correctAnswers: ['how do you do'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "How do you politely get someone's attention?",
                  questionData: {
                    correctAnswers: ['excuse me'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What do you say when you want to introduce two people?',
                  questionData: {
                    correctAnswers: ['this is'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    "How do you say 'see you soon' in a casual way?",
                  questionData: {
                    correctAnswers: ['see ya', 'see you'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the greetings with their appropriate time of day',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Good morning',
                        'Good afternoon',
                        'Good evening',
                        'Good night',
                      ],
                      rightColumn: [
                        'Late evening',
                        'Early day',
                        'Late day',
                        'Middle day',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the formal greetings with their informal equivalents',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Good day',
                        'Pleased to meet you',
                        'How do you do',
                        'Farewell',
                      ],
                      rightColumn: ['Bye', 'Nice to meet you', 'Hello', 'Hi'],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the responses to the statements',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Thank you',
                        'How are you?',
                        'Nice to meet you',
                        'Goodbye',
                      ],
                      rightColumn: [
                        'See you later',
                        "I'm fine, thanks",
                        'You too',
                        "You're welcome",
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the situations with appropriate greetings',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Meeting a friend',
                        'Meeting your boss',
                        'Leaving work',
                        'Early morning',
                      ],
                      rightColumn: [
                        'Good morning',
                        'Goodbye',
                        'Hi',
                        'Good morning, sir',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the greetings with their meanings',
                  questionData: {
                    pairs: {
                      leftColumn: ['Hello', 'Hi', 'Hey', 'Greetings'],
                      rightColumn: [
                        'Very formal hello',
                        'Casual greeting',
                        'Very casual greeting',
                        'Formal hello',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 0,
                      2: 2,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the questions with appropriate answers',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        "What's your name?",
                        'Where are you from?',
                        'How old are you?',
                        'What do you do?',
                      ],
                      rightColumn: [
                        'I work at a bank',
                        "I'm 25 years old",
                        'My name is John',
                        "I'm from Canada",
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the polite expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Please',
                        'Thank you',
                        'Sorry',
                        "You're welcome",
                      ],
                      rightColumn: [
                        'Response to thanks',
                        'Request for something',
                        'Apology',
                        'Expression of gratitude',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the farewell expressions with their formality level',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Bye',
                        'See you later',
                        'Farewell',
                        'Take care',
                      ],
                      rightColumn: [
                        'Very formal',
                        'Casual',
                        'Semi-formal',
                        'Very casual',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 0,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the introduction phrases',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'This is my',
                        'Let me introduce',
                        'Have you met',
                        'I would like you to meet',
                      ],
                      rightColumn: [
                        'friend John',
                        'my brother',
                        'my sister',
                        'my colleague',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the attention getters with situations',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Excuse me',
                        'Pardon me',
                        'Sorry',
                        'Can I ask you something?',
                      ],
                      rightColumn: [
                        'To get attention',
                        'To apologize for interrupting',
                        'To ask a question',
                        'To say sorry for mistake',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Good morning! How are you today?',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'My name is John. What is your name?',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'It was nice to meet you. See you later!',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Thank you very much for your help.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Excuse me, do you have the time?',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I am very sorry for being late.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Nice to meet you. I am Maria.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Have a nice day! Goodbye.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'See you later! Take care.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I would like to introduce my friend Anna.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to make a proper introduction',
                  questionData: {
                    options: ['is', 'My', 'John', 'name'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    "Arrange the words to ask about someone's well-being",
                  questionData: {
                    options: ['are', 'How', 'you', '?'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a polite response',
                  questionData: {
                    options: ['welcome', "You're", 'very', 'much'],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a formal greeting',
                  questionData: {
                    options: ['morning', 'Good', 'you', 'to'],
                    correctAnswers: [1, 0, 3, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to say goodbye',
                  questionData: {
                    options: ['you', 'See', 'later', '!'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for getting attention',
                  questionData: {
                    options: ['me', 'Excuse', 'please', '?'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to express thanks',
                  questionData: {
                    options: ['you', 'Thank', 'very', 'much'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a proper farewell',
                  questionData: {
                    options: ['a', 'Have', 'day', 'nice'],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to introduce someone',
                  questionData: {
                    options: ['is', 'This', 'my', 'friend'],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a polite request',
                  questionData: {
                    options: ['help', 'Could', 'you', 'me'],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) introducing yourself to a new classmate.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe a typical greeting in your culture and compare it to English greetings.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the importance of polite greetings in social situations.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how you would greet different people (friends, teachers, strangers) in English.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a dialogue between two people meeting for the first time.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Explain why saying "please" and "thank you" is important in English culture.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a memorable first meeting you had with someone.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the differences between formal and informal greetings in English.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write instructions on how to introduce yourself politely in a professional setting.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Discuss how greetings can affect first impressions in social and professional situations.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Numbers and Colors',
              description: 'Basic numbers 1-100 and common colors',
              order: 1,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What number comes after 'twenty'?",
                  questionData: {
                    options: ['twenty-one', 'twenty-two', 'thirty', 'nineteen'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "How do you write '15' in words?",
                  questionData: {
                    options: ['fifty', 'fifteen', 'fifth', 'fifthteen'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which color is typically associated with grass?',
                  questionData: {
                    options: ['red', 'blue', 'green', 'yellow'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What is '50' in ordinal form?",
                  questionData: {
                    options: ['fiftieth', 'fiftyth', 'fifth', 'fiftith'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which color is the sky usually during the day?',
                  questionData: {
                    options: ['black', 'blue', 'green', 'red'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'How many sides does a square have?',
                  questionData: {
                    options: ['3', '4', '5', '6'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What color is an orange fruit?',
                  questionData: {
                    options: ['green', 'blue', 'orange', 'purple'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What is '100' divided by '10'?",
                  questionData: {
                    options: ['5', '10', '15', '20'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which color means 'stop' in traffic lights?",
                  questionData: {
                    options: ['green', 'yellow', 'red', 'blue'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "How do you say '30' in English?",
                  questionData: {
                    options: ['thirty', 'thirtyth', 'thirteeth', 'thirtith'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Red' is a primary color.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Eleven' comes after 'ten'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Green' is the color of the sun.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Twenty' is '20' in numbers.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Blue' and 'green' are complementary colors.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Fifty' is '50' in numerals.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Purple' is made by mixing red and blue.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'One hundred' is written as '100'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Yellow' is the color of grass.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Orange' is a secondary color.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What color is the sky on a clear day?',
                  questionData: {
                    correctAnswers: ['blue'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "How do you say '12' in English?",
                  questionData: {
                    correctAnswers: ['twelve'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What color is an apple?',
                  questionData: {
                    correctAnswers: ['red', 'green'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What number is 'forty'?",
                  questionData: {
                    correctAnswers: ['40'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What color is the sun?',
                  questionData: {
                    correctAnswers: ['yellow'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "How do you write '25' in words?",
                  questionData: {
                    correctAnswers: ['twenty-five'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What color is a banana?',
                  questionData: {
                    correctAnswers: ['yellow'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is '90' in English?",
                  questionData: {
                    correctAnswers: ['ninety'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What color is the ocean?',
                  questionData: {
                    correctAnswers: ['blue'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "How do you say '100'?",
                  questionData: {
                    correctAnswers: ['one hundred'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the numbers with their written forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['15', '30', '45', '60'],
                      rightColumn: ['sixty', 'thirty', 'fifteen', 'forty-five'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the colors with common objects',
                  questionData: {
                    pairs: {
                      leftColumn: ['Red', 'Blue', 'Green', 'Yellow'],
                      rightColumn: ['Apple', 'Sky', 'Grass', 'Sun'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the ordinal numbers',
                  questionData: {
                    pairs: {
                      leftColumn: ['1st', '2nd', '3rd', '4th'],
                      rightColumn: ['first', 'second', 'third', 'fourth'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the numbers with their values',
                  questionData: {
                    pairs: {
                      leftColumn: ['Ten', 'Twenty', 'Thirty', 'Forty'],
                      rightColumn: ['40', '10', '20', '30'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the colors with their meanings',
                  questionData: {
                    pairs: {
                      leftColumn: ['Red', 'Green', 'Yellow', 'Blue'],
                      rightColumn: ['Go', 'Stop', 'Caution', 'Sadness'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the cardinal numbers',
                  questionData: {
                    pairs: {
                      leftColumn: ['5', '10', '15', '20'],
                      rightColumn: ['five', 'twenty', 'ten', 'fifteen'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 2,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the colors with fruits',
                  questionData: {
                    pairs: {
                      leftColumn: ['Orange', 'Banana', 'Apple', 'Grape'],
                      rightColumn: ['Purple', 'Red', 'Yellow', 'Orange'],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the numbers in words',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Seventy',
                        'Eighty',
                        'Ninety',
                        'One hundred',
                      ],
                      rightColumn: ['100', '70', '80', '90'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the basic colors',
                  questionData: {
                    pairs: {
                      leftColumn: ['Black', 'White', 'Gray', 'Brown'],
                      rightColumn: ['Snow', 'Night', 'Dirt', 'Clouds'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the mathematical terms',
                  questionData: {
                    pairs: {
                      leftColumn: ['Plus', 'Minus', 'Times', 'Equals'],
                      rightColumn: ['+', '-', '=', '×'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The color of the sky is blue.',
                  questionData: {
                    correctAnswers: [6],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: '5 + 5 = 10',
                  questionData: {
                    correctAnswers: [0, 1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The number after nineteen is twenty.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Green is the color of grass.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Thirty minus ten equals twenty.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The sun is yellow in color.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Twenty-four comes before twenty-five.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'A stop sign is red in color.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The first number is one.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Green is between yellow and blue.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the numbers from smallest to largest',
                  questionData: {
                    options: ['15', '5', '10', '20'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the colors in rainbow order',
                  questionData: {
                    options: ['yellow', 'red', 'blue', 'green'],
                    correctAnswers: [1, 3, 0, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the numbers in ascending order',
                  questionData: {
                    options: ['thirty', 'ten', 'twenty', 'forty'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to make a number phrase',
                  questionData: {
                    options: ['five', 'and', 'twenty', 'twenty-'],
                    correctAnswers: [3, 0, 1, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words in alphabetical order',
                  questionData: {
                    options: ['zebra', 'apple', 'banana', 'cat'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the numbers correctly',
                  questionData: {
                    options: ['hundred', 'one', 'and', 'fifty'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the ordinal numbers',
                  questionData: {
                    options: ['first', 'third', 'second', 'fourth'],
                    correctAnswers: [0, 2, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the numbers in words',
                  questionData: {
                    options: ['thirty', 'twenty', 'ten', 'forty'],
                    correctAnswers: [2, 1, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the colors alphabetically',
                  questionData: {
                    options: ['green', 'blue', 'yellow', 'red'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the numbers from 1 to 4',
                  questionData: {
                    options: ['two', 'one', 'three', 'four'],
                    correctAnswers: [1, 0, 2, 3],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your favorite color and why you like it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how colors affect your mood and emotions.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the importance of numbers in daily life.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Explain how you would teach numbers 1-20 to a young child.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe a colorful scene from nature using as many colors as possible.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how numbers are used in sports and games.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Explain the difference between cardinal and ordinal numbers with examples.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your dream house and include colors in your description.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how colors are used in traffic signs and safety.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Explain why learning numbers is important for young children.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Family and Friends',
              description:
                'Vocabulary for family members and describing people',
              order: 2,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Who is your father's brother?",
                  questionData: {
                    options: ['Uncle', 'Cousin', 'Nephew', 'Grandfather'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What do we call your mother's sister?",
                  questionData: {
                    options: ['Aunt', 'Cousin', 'Niece', 'Grandmother'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who are the children of your aunt and uncle?',
                  questionData: {
                    options: [
                      'Nieces and nephews',
                      'Sisters and brothers',
                      'Cousins',
                      'Grandchildren',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What is the word for your father's father?",
                  questionData: {
                    options: ['Grandfather', 'Uncle', 'Father', 'Brother'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Who is your brother's daughter?",
                  questionData: {
                    options: ['Niece', 'Sister', 'Aunt', 'Cousin'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do you call a close companion?',
                  questionData: {
                    options: ['Friend', 'Relative', 'Neighbor', 'Colleague'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who is married to your mother or father?',
                  questionData: {
                    options: ['Step-parent', 'Guardian', 'Parent', 'Sibling'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What is the term for people you work with?',
                  questionData: {
                    options: [
                      'Colleagues',
                      'Friends',
                      'Neighbors',
                      'Classmates',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who lives next door to you?',
                  questionData: {
                    options: ['Neighbor', 'Relative', 'Friend', 'Colleague'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What do you call someone who shares your parents?',
                  questionData: {
                    options: ['Sibling', 'Cousin', 'Friend', 'Neighbor'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Your mother's brother is your uncle.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Your sister's son is your nephew.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Grandparents are your parents' children.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'A best friend is someone you know well and like a lot.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Cousins are the children of your siblings.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Your father's sister is your aunt.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Neighbors are people who live far from you.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Classmates are people you study with.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Siblings are your brothers and sisters.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Grandchildren are your parents' parents.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What do you call your father's mother?",
                  questionData: {
                    correctAnswers: ['grandmother'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'Who is your closest family member?',
                  questionData: {
                    correctAnswers: ['mother', 'father', 'sibling'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is another word for 'buddy'?",
                  questionData: {
                    correctAnswers: ['friend'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'Who do you share your home with?',
                  questionData: {
                    correctAnswers: ['family'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do you call someone who lives nearby?',
                  questionData: {
                    correctAnswers: ['neighbor'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "Who are your parents' brothers and sisters?",
                  questionData: {
                    correctAnswers: ['aunts', 'uncles'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is a person you go to school with called?',
                  questionData: {
                    correctAnswers: ['classmate'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'Who is related to you through marriage?',
                  questionData: {
                    correctAnswers: ['in-law'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do you call a very close friend?',
                  questionData: {
                    correctAnswers: ['best friend'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'Who takes care of you when your parents are away?',
                  questionData: {
                    correctAnswers: ['guardian', 'babysitter'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the family members',
                  questionData: {
                    pairs: {
                      leftColumn: ['Mother', 'Father', 'Sister', 'Brother'],
                      rightColumn: [
                        'Male parent',
                        'Female child',
                        'Male child',
                        'Female parent',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 0,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the extended family',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Grandmother',
                        'Grandfather',
                        'Aunt',
                        'Uncle',
                      ],
                      rightColumn: [
                        "Father's sister",
                        "Mother's mother",
                        "Mother's father",
                        "Father's brother",
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the relationship terms',
                  questionData: {
                    pairs: {
                      leftColumn: ['Niece', 'Nephew', 'Cousin', 'Sibling'],
                      rightColumn: [
                        'Brother or sister',
                        'Child of aunt/uncle',
                        'Daughter of brother/sister',
                        'Son of brother/sister',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the friendship terms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Friend',
                        'Best friend',
                        'Classmate',
                        'Neighbor',
                      ],
                      rightColumn: [
                        'Lives nearby',
                        'Studies together',
                        'Very close companion',
                        'General companion',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the age-related terms',
                  questionData: {
                    pairs: {
                      leftColumn: ['Child', 'Teenager', 'Adult', 'Elderly'],
                      rightColumn: [
                        '65+',
                        '13-19 years',
                        '18+ years',
                        '0-12 years',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the family relationships',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Parents',
                        'Children',
                        'Grandparents',
                        'Grandchildren',
                      ],
                      rightColumn: [
                        'Your children',
                        "Your parents' parents",
                        'Your mother and father',
                        "Your children's children",
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 1,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the social connections',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Colleague',
                        'Acquaintance',
                        'Stranger',
                        'Companion',
                      ],
                      rightColumn: [
                        'Unknown person',
                        'Work together',
                        'Know slightly',
                        'Travel together',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the marital relationships',
                  questionData: {
                    pairs: {
                      leftColumn: ['Husband', 'Wife', 'Spouse', 'Partner'],
                      rightColumn: [
                        'Male marriage partner',
                        'Female marriage partner',
                        'Marriage partner (gender neutral)',
                        'Romantic companion (not necessarily married)',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the friendship levels',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Acquaintance',
                        'Friend',
                        'Close friend',
                        'Best friend',
                      ],
                      rightColumn: [
                        'Know very well',
                        'Know slightly',
                        'Know well',
                        'Know extremely well',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the family titles',
                  questionData: {
                    pairs: {
                      leftColumn: ['Mom', 'Dad', 'Gran', 'Grandad'],
                      rightColumn: [
                        'Grandfather',
                        'Mother',
                        'Grandmother',
                        'Father',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: "My aunt is my mother's sister.",
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Sarah is my best friend.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Tom lives next door. He is my neighbor.',
                  questionData: {
                    correctAnswers: [7],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: "My brother's daughter is my niece.",
                  questionData: {
                    correctAnswers: [5],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'John and I go to the same school. He is my classmate.',
                  questionData: {
                    correctAnswers: [11],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: "My father's father is my grandfather.",
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Lisa and Mike are married. They have two children.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Emma is my cousin. We grew up together.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'The person who takes care of you is your guardian.',
                  questionData: {
                    correctAnswers: [8],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'My parents are my mother and father.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the family hierarchy from closest to most distant',
                  questionData: {
                    options: ['cousins', 'parents', 'grandparents', 'siblings'],
                    correctAnswers: [1, 3, 2, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the friendship levels from casual to closest',
                  questionData: {
                    options: [
                      'best friend',
                      'acquaintance',
                      'close friend',
                      'friend',
                    ],
                    correctAnswers: [1, 3, 2, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the age groups from youngest to oldest',
                  questionData: {
                    options: ['child', 'elderly', 'adult', 'teenager'],
                    correctAnswers: [0, 3, 2, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to describe family size',
                  questionData: {
                    options: ['large', 'family', 'small', 'extended'],
                    correctAnswers: [2, 0, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the relationship terms',
                  questionData: {
                    options: ['distant', 'close', 'immediate', 'extended'],
                    correctAnswers: [2, 1, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the family members by generation',
                  questionData: {
                    options: [
                      'grandchildren',
                      'parents',
                      'children',
                      'grandparents',
                    ],
                    correctAnswers: [3, 1, 2, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the social connections',
                  questionData: {
                    options: [
                      'stranger',
                      'friend',
                      'acquaintance',
                      'best friend',
                    ],
                    correctAnswers: [0, 2, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to make a sentence about family',
                  questionData: {
                    options: ['together', 'family', 'happy', 'my'],
                    correctAnswers: [3, 1, 2, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the relationship words',
                  questionData: {
                    options: ['brother', 'sister', 'cousin', 'uncle'],
                    correctAnswers: [0, 1, 3, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the friendship terms',
                  questionData: {
                    options: ['pal', 'buddy', 'mate', 'chum'],
                    correctAnswers: [1, 0, 3, 2],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your family members.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your best friend and explain why they are special to you.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the importance of family in your life.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe a memorable experience you had with your friends.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how friendships change as you grow older.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the differences between family relationships and friendships.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a family tradition that is important to you.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how you would help a new student make friends at school.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the qualities that make a good friend.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your neighborhood and the people who live there.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Days, Months, and Seasons',
              description: 'Time expressions and calendar vocabulary',
              order: 3,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'How many days are in a week?',
                  questionData: {
                    options: ['5', '6', '7', '8'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which is the first month of the year?',
                  questionData: {
                    options: ['February', 'January', 'March', 'December'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What day comes after Monday?',
                  questionData: {
                    options: ['Sunday', 'Tuesday', 'Wednesday', 'Thursday'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which season comes after summer?',
                  questionData: {
                    options: ['Spring', 'Winter', 'Fall', 'Autumn'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'How many months are in a year?',
                  questionData: {
                    options: ['10', '11', '12', '13'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which day is the weekend?',
                  questionData: {
                    options: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What month has 28 days usually?',
                  questionData: {
                    options: ['January', 'March', 'February', 'April'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which season is the hottest?',
                  questionData: {
                    options: ['Winter', 'Spring', 'Summer', 'Fall'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What is the third day of the week?',
                  questionData: {
                    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which month comes after October?',
                  questionData: {
                    options: ['September', 'November', 'December', 'August'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Monday is the first day of the week.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'There are 30 days in February.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Summer is a cold season.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'December is the last month of the year.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Saturday and Sunday are workdays.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Spring comes before summer.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'There are 31 days in March.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Winter is the warmest season.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'July is a summer month.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Thursday comes before Friday.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What day comes after Tuesday?',
                  questionData: {
                    correctAnswers: ['wednesday'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'How many seasons are there?',
                  questionData: {
                    correctAnswers: ['4', 'four'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What is the sixth month of the year?',
                  questionData: {
                    correctAnswers: ['june'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What day is between Monday and Wednesday?',
                  questionData: {
                    correctAnswers: ['tuesday'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'Which season has the most holidays?',
                  questionData: {
                    correctAnswers: ['summer', 'winter'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What month comes before May?',
                  questionData: {
                    correctAnswers: ['april'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'How many days are in a leap year February?',
                  questionData: {
                    correctAnswers: ['29'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What is the coldest season?',
                  questionData: {
                    correctAnswers: ['winter'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What day is the first day of the work week?',
                  questionData: {
                    correctAnswers: ['monday'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'How many months have 31 days?',
                  questionData: {
                    correctAnswers: ['7', 'seven'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the days of the week',
                  questionData: {
                    pairs: {
                      leftColumn: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
                      rightColumn: ['2nd day', '1st day', '7th day', '3rd day'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 0,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the months with their numbers',
                  questionData: {
                    pairs: {
                      leftColumn: ['January', 'March', 'May', 'July'],
                      rightColumn: ['1', '3', '5', '7'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the seasons with their characteristics',
                  questionData: {
                    pairs: {
                      leftColumn: ['Spring', 'Summer', 'Fall', 'Winter'],
                      rightColumn: [
                        'Cold and snow',
                        'Hot and sunny',
                        'Cool and colorful',
                        'Warm and blooming',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the months with seasons',
                  questionData: {
                    pairs: {
                      leftColumn: ['December', 'March', 'June', 'September'],
                      rightColumn: ['Spring', 'Winter', 'Summer', 'Fall'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the days with their positions',
                  questionData: {
                    pairs: {
                      leftColumn: ['Tuesday', 'Thursday', 'Saturday', 'Monday'],
                      rightColumn: ['4th day', '2nd day', '6th day', '1st day'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 3,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the months with days',
                  questionData: {
                    pairs: {
                      leftColumn: ['February', 'April', 'June', 'September'],
                      rightColumn: ['30 days', '31 days', '28 days', '30 days'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 1,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the time expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Today',
                        'Yesterday',
                        'Tomorrow',
                        'Last week',
                      ],
                      rightColumn: ['Past', 'Future', 'Present', 'Past'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the ordinal numbers',
                  questionData: {
                    pairs: {
                      leftColumn: ['First', 'Second', 'Third', 'Fourth'],
                      rightColumn: ['4th', '1st', '2nd', '3rd'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the calendar terms',
                  questionData: {
                    pairs: {
                      leftColumn: ['Week', 'Month', 'Year', 'Day'],
                      rightColumn: [
                        '24 hours',
                        '7 days',
                        '12 months',
                        '30 days',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the time periods',
                  questionData: {
                    pairs: {
                      leftColumn: ['Morning', 'Afternoon', 'Evening', 'Night'],
                      rightColumn: ['12-6 PM', '6-12 AM', '6-12 PM', '12-6 AM'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 1,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Today is Monday.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Monday is the day before Tuesday.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'There are twelve months in a year.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Summer comes after spring.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The weekend has two days.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Sunday is the last day of the week.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Winter is the coldest season.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'January has 31 days.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The month after August is September.',
                  questionData: {
                    correctAnswers: [5],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Tuesday is between Monday and Wednesday.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the days of the week in order',
                  questionData: {
                    options: ['Wednesday', 'Monday', 'Tuesday', 'Thursday'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the months in calendar order',
                  questionData: {
                    options: ['March', 'January', 'February', 'April'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the seasons in order',
                  questionData: {
                    options: ['winter', 'spring', 'summer', 'fall'],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the days from Monday to Friday',
                  questionData: {
                    options: ['Wednesday', 'Monday', 'Friday', 'Tuesday'],
                    correctAnswers: [1, 3, 0, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the months of summer',
                  questionData: {
                    options: ['August', 'June', 'July', 'May'],
                    correctAnswers: [1, 2, 0, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the time of day',
                  questionData: {
                    options: ['night', 'morning', 'afternoon', 'evening'],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the work week days',
                  questionData: {
                    options: ['Thursday', 'Monday', 'Wednesday', 'Tuesday'],
                    correctAnswers: [1, 3, 2, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the winter months',
                  questionData: {
                    options: ['February', 'December', 'January', 'March'],
                    correctAnswers: [2, 0, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the weekend days',
                  questionData: {
                    options: ['Sunday', 'Saturday'],
                    correctAnswers: [1, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the months alphabetically',
                  questionData: {
                    options: ['July', 'June', 'January', 'May'],
                    correctAnswers: [2, 1, 3, 0],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your favorite season and why you like it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how the weather changes during different seasons.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about your daily routine on weekdays versus weekends.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the activities you do in each season.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how months are organized in a calendar year.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the differences between weekdays and weekends.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about holidays and special days in different months.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how you plan your schedule around days of the week.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the importance of calendars in daily life.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how seasons affect plants and nature around you.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Daily Routines',
              description: 'Present simple tense and daily activities',
              order: 4,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct form of the verb: 'She _____ to school every day.'",
                  questionData: {
                    options: ['go', 'goes', 'going', 'went'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: "Which sentence uses 'their' correctly?",
                  questionData: {
                    options: [
                      'Their going to the store.',
                      'The book is over their.',
                      'They left their bags at home.',
                      'Their are many options.',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A sentence must have a subject and a verb.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the past tense of 'eat'?",
                  questionData: {
                    correctAnswers: ['ate'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to make a sentence',
                  questionData: {
                    options: ['the', 'cat', 'is', 'sleeping', '.'],
                    correctAnswers: [1, 2, 3, 0, 4],
                  } satisfies OrderingQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Food and Drinks',
              description: 'Common food items and ordering at a restaurant',
              order: 5,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Choose the correct preposition: 'She is good ___ mathematics.'",
                  questionData: {
                    options: ['in', 'at', 'on', 'with'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'A gerund is a verb form that functions as a noun.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "Write the comparative form of 'good'.",
                  questionData: {
                    correctAnswers: ['better'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the contractions with their full forms',
                  questionData: {
                    pairs: {
                      leftColumn: ["don't", "won't", "can't", "shouldn't"],
                      rightColumn: [
                        'cannot',
                        'do not',
                        'will not',
                        'should not',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'She is afraid of spiders.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Shopping and Money',
              description: 'Numbers, prices, and shopping expressions',
              order: 6,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which word is spelled correctly?',
                  questionData: {
                    options: ['Occured', 'Occurred', 'Ocurred', 'Occuried'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "The word 'irregardless' is considered standard English.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: "What does the acronym 'ASAP' stand for?",
                  questionData: {
                    correctAnswers: ['as soon as possible'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the homophones',
                  questionData: {
                    pairs: {
                      leftColumn: ['their', 'two', 'write', 'know'],
                      rightColumn: ['no', 'there', 'to', 'right'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I am a student.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Places in Town',
              description: 'Locations and giving directions',
              order: 7,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText: "What is the meaning of 'ubiquitous'?",
                  questionData: {
                    options: [
                      'Very rare',
                      'Present everywhere',
                      'Extremely expensive',
                      'Difficult to understand',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'The Oxford comma is required in formal English writing.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: "Provide a synonym for 'ubiquitous'.",
                  questionData: {
                    correctAnswers: [
                      'omnipresent',
                      'everywhere',
                      'pervasive',
                      'universal',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the countries with their capitals',
                  questionData: {
                    pairs: {
                      leftColumn: ['France', 'Japan', 'Italy', 'Egypt'],
                      rightColumn: ['Cairo', 'Paris', 'Tokyo', 'Rome'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to form a correct question',
                  questionData: {
                    options: ['you', 'do', 'like', 'coffee', '?'],
                    correctAnswers: [1, 0, 2, 3, 4],
                  } satisfies OrderingQuestionData,
                },
              ],
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Elementary (A2)',
          description: 'Building on basic English skills',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Hobbies and Free Time',
              description: 'Talking about interests and leisure activities',
              order: 0,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do you like to do in your free time?',
                  questionData: {
                    options: [
                      'Reading books',
                      'Working overtime',
                      'Doing homework',
                      'Cleaning the house',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which hobby involves creating art with colors?',
                  questionData: {
                    options: ['Cooking', 'Painting', 'Swimming', 'Running'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What activity do people do at the gym?',
                  questionData: {
                    options: ['Reading', 'Exercising', 'Sleeping', 'Eating'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which is a team sport?',
                  questionData: {
                    options: ['Tennis', 'Basketball', 'Swimming', 'Running'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do you need for playing chess?',
                  questionData: {
                    options: [
                      'A ball',
                      'A board and pieces',
                      'A racket',
                      'A bicycle',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which activity is good for your health?',
                  questionData: {
                    options: [
                      'Watching TV all day',
                      'Jogging in the park',
                      'Eating junk food',
                      'Staying indoors',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do you do when you go to the cinema?',
                  questionData: {
                    options: [
                      'Watch movies',
                      'Buy groceries',
                      'Visit friends',
                      'Work on computer',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which hobby involves taking photographs?',
                  questionData: {
                    options: ['Photography', 'Gardening', 'Cooking', 'Dancing'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do you need for playing music?',
                  questionData: {
                    options: ['A computer', 'An instrument', 'A book', 'A car'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which activity helps you relax?',
                  questionData: {
                    options: [
                      'Working late',
                      'Meditating',
                      'Fighting with friends',
                      'Skipping meals',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Reading is a good hobby for learning new things.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Swimming is an indoor activity.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Playing video games requires physical activity.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Gardening involves growing plants.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Cooking is a creative hobby.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Watching TV is always educational.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Dancing improves coordination.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Playing sports builds teamwork skills.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Listening to music is a passive activity.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Traveling is a hobby that costs nothing.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What is your favorite hobby?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'How often do you play sports?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What instrument would you like to learn?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do you do to relax after a long day?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the most popular sport in your country?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'How do you spend your weekends?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What hobby would you recommend to a friend?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do you enjoy doing with friends?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What creative activity do you like?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'How important is free time for you?',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the hobbies with their locations',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Swimming',
                        'Reading',
                        'Gardening',
                        'Dancing',
                      ],
                      rightColumn: [
                        'Library',
                        'Pool',
                        'Garden',
                        'Dance studio',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the sports with equipment needed',
                  questionData: {
                    pairs: {
                      leftColumn: ['Tennis', 'Basketball', 'Soccer', 'Golf'],
                      rightColumn: [
                        'Ball and hoop',
                        'Ball and net',
                        'Club and ball',
                        'Ball and field',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the activities with benefits',
                  questionData: {
                    pairs: {
                      leftColumn: ['Exercise', 'Reading', 'Music', 'Art'],
                      rightColumn: [
                        'Knowledge',
                        'Fitness',
                        'Creativity',
                        'Relaxation',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the hobbies with time required',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Quick game',
                        'Long project',
                        'Daily practice',
                        'Weekend activity',
                      ],
                      rightColumn: [
                        'Chess game',
                        'Building model',
                        'Piano practice',
                        'Hiking',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the creative hobbies',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Drawing',
                        'Writing',
                        'Photography',
                        'Cooking',
                      ],
                      rightColumn: ['Stories', 'Pictures', 'Recipes', 'Images'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the outdoor activities',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Camping',
                        'Fishing',
                        'Cycling',
                        'Picnicking',
                      ],
                      rightColumn: [
                        'Tent',
                        'Bicycle',
                        'Food basket',
                        'Fishing rod',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 3,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the indoor hobbies',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Knitting',
                        'Puzzle solving',
                        'Board games',
                        'Movie watching',
                      ],
                      rightColumn: [
                        'Yarn and needles',
                        'Pieces to connect',
                        'Friends to play',
                        'Screen and popcorn',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the musical instruments',
                  questionData: {
                    pairs: {
                      leftColumn: ['Piano', 'Guitar', 'Violin', 'Drums'],
                      rightColumn: [
                        'Strings and bow',
                        'Keys and pedals',
                        'Strings and frets',
                        'Sticks and skins',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the art forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Painting',
                        'Sculpting',
                        'Drawing',
                        'Pottery',
                      ],
                      rightColumn: [
                        'Clay modeling',
                        'Color on canvas',
                        'Pencil on paper',
                        'Clay shaping',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the skill-building activities',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Language learning',
                        'Cooking',
                        'Dancing',
                        'Yoga',
                      ],
                      rightColumn: [
                        'Body flexibility',
                        'New vocabulary',
                        'Kitchen skills',
                        'Rhythm and movement',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I like to read books in my free time.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'My favorite hobby is taking pictures.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I go shopping with my friends on weekends.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Learning to play the piano is my goal.',
                  questionData: {
                    correctAnswers: [5],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I enjoy gardening in the garden.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Watching movies is relaxing.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I like to play sports after school.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'My hobby is collecting stamps.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I spend my evenings listening to music.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Playing chess is intellectually stimulating.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the steps to start a new hobby',
                  questionData: {
                    options: [
                      'Choose hobby',
                      'Get equipment',
                      'Learn basics',
                      'Practice regularly',
                    ],
                    correctAnswers: [0, 1, 2, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the weekend activities in order of preference',
                  questionData: {
                    options: [
                      'Watch movies',
                      'Visit friends',
                      'Go shopping',
                      'Read books',
                    ],
                    correctAnswers: [3, 0, 1, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the musical instruments by size',
                  questionData: {
                    options: ['violin', 'piano', 'guitar', 'flute'],
                    correctAnswers: [3, 0, 2, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the art supplies needed for painting',
                  questionData: {
                    options: ['canvas', 'brushes', 'paints', 'easel'],
                    correctAnswers: [3, 0, 2, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the steps for planning a hiking trip',
                  questionData: {
                    options: [
                      'Pack supplies',
                      'Choose trail',
                      'Check weather',
                      'Invite friends',
                    ],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the cooking steps',
                  questionData: {
                    options: [
                      'Serve food',
                      'Prepare ingredients',
                      'Cook dish',
                      'Set table',
                    ],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the photography process',
                  questionData: {
                    options: [
                      'Take photo',
                      'Edit image',
                      'Choose subject',
                      'Print picture',
                    ],
                    correctAnswers: [2, 0, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the game night activities',
                  questionData: {
                    options: [
                      'Play games',
                      'Eat snacks',
                      'Choose game',
                      'Clean up',
                    ],
                    correctAnswers: [2, 0, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the relaxation techniques',
                  questionData: {
                    options: [
                      'Deep breathing',
                      'Listen to music',
                      'Take a walk',
                      'Read a book',
                    ],
                    correctAnswers: [0, 1, 3, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the fitness activities',
                  questionData: {
                    options: [
                      'Cool down',
                      'Warm up',
                      'Main exercise',
                      'Stretch',
                    ],
                    correctAnswers: [1, 2, 3, 0],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (75-100 words) describing your favorite hobby and why you enjoy it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how hobbies help people relax and reduce stress.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a hobby you would like to try and explain why.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how joining a club or group can enhance your hobbies.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the benefits of having multiple hobbies versus focusing on one.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how hobbies can become careers or professions.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the role of hobbies in building friendships and social connections.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how technology has changed the way people pursue hobbies.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about balancing work, study, and hobbies in daily life.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the most unusual or interesting hobby you have heard of.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Past Simple Tense',
              description: 'Regular and irregular verbs in the past',
              order: 1,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which sentence is grammatically correct?',
                  questionData: {
                    options: [
                      'If I would have known, I would have come.',
                      'If I had known, I would have come.',
                      'If I would know, I would come.',
                      'If I have known, I would come.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText: "The past tense of 'go' is 'goed'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: "What is the past participle of 'break'?",
                  questionData: {
                    correctAnswers: ['broken'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the verb forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['go', 'eat', 'run', 'see'],
                      rightColumn: ['saw', 'went', 'ate', 'ran'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'I have never been/went to Paris before.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Travel and Transportation',
              description: 'Modes of transport and travel vocabulary',
              order: 2,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Identify the sentence with correct parallel structure:',
                  questionData: {
                    options: [
                      'She likes reading, to write, and drawing.',
                      'She likes reading, writing, and to draw.',
                      'She likes reading, writing, and drawing.',
                      'She likes to read, writing, and drawing.',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    "According to Shakespeare's 'Hamlet', the main character decides to immediately avenge his father's death.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'Write a sentence using the idiom "break the ice".',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the tenses with example sentences',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Present Simple',
                        'Past Simple',
                        'Future Simple',
                        'Present Perfect',
                      ],
                      rightColumn: [
                        'I have finished my homework',
                        'I eat breakfast every day',
                        'I ate breakfast yesterday',
                        'I will eat breakfast tomorrow',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words to form a question in reported speech',
                  questionData: {
                    options: ['asked', 'she', 'where', 'I', 'lived', '.'],
                    correctAnswers: [1, 0, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Weather and Seasons',
              description: 'Describing weather conditions and climate',
              order: 3,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText: 'Which sentence uses a dangling modifier?',
                  questionData: {
                    options: [
                      'Walking down the street, the trees were beautiful.',
                      'The trees were beautiful as I walked down the street.',
                      'While walking down the street, I saw beautiful trees.',
                      'I saw beautiful trees while walking down the street.',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    "In the phrase 'the girl who I saw', 'who' should be 'whom'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText: 'Explain what a metaphor is in one sentence.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a paragraph (75-100 words) describing your favorite food.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Health and Body',
              description: 'Parts of the body and common illnesses',
              order: 4,
              questions: [
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which sentence is in passive voice?',
                  questionData: {
                    options: [
                      'The chef cooked the meal.',
                      'The meal was cooked by the chef.',
                      'The chef is cooking the meal.',
                      'The chef will cook the meal.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Double negatives are acceptable in standard English.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: 'What is the superlative form of "far"?',
                  questionData: {
                    correctAnswers: ['farthest', 'furthest'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write an expository essay (200-250 words) explaining how to prepare for a job interview.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Making Comparisons',
              description: 'Comparative and superlative adjectives',
              order: 5,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which is the comparative form of 'big'?",
                  questionData: {
                    options: ['bigest', 'bigger', 'more big', 'bigly'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which is the superlative form of 'small'?",
                  questionData: {
                    options: ['smallest', 'smallier', 'more small', 'smally'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct comparative: 'My house is _____ than yours.'",
                  questionData: {
                    options: ['big', 'bigger', 'biggest', 'more bigger'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which word means 'the most beautiful'?",
                  questionData: {
                    options: [
                      'beauty',
                      'beautifuler',
                      'beautifullest',
                      'most beautiful',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct superlative: 'This is _____ book I've ever read.'",
                  questionData: {
                    options: ['good', 'better', 'the best', 'goodest'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Which is correct: 'She is _____ than her sister.'",
                  questionData: {
                    options: ['tall', 'taller', 'tallest', 'more tall'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What is the comparative of 'bad'?",
                  questionData: {
                    options: ['badly', 'worse', 'badder', 'more bad'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which is the superlative form of 'far'?",
                  questionData: {
                    options: ['farther', 'farest', 'more far', 'farthest'],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct comparative: 'This exercise is _____ than that one.'",
                  questionData: {
                    options: ['easy', 'easier', 'easiest', 'more easy'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which word means 'less difficult'?",
                  questionData: {
                    options: ['hard', 'harder', 'easiest', 'easier'],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "The comparative form of 'good' is 'gooder'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We use 'than' after comparative adjectives.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "The superlative form of 'happy' is 'happiest'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We use 'the' before superlative adjectives.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "The comparative of 'bad' is 'badder'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "Adjectives with two syllables usually add 'more' for comparatives.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "The superlative form of 'little' is 'littler'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "Irregular comparatives include 'better' and 'worse'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "We can use 'more' with all adjectives to form comparatives.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "Short adjectives usually add '-er' for comparatives.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the comparative form of 'tall'?",
                  questionData: {
                    correctAnswers: ['taller'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the superlative form of 'fast'?",
                  questionData: {
                    correctAnswers: ['fastest'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the comparative of 'interesting'?",
                  questionData: {
                    correctAnswers: ['more interesting'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the superlative of 'beautiful'?",
                  questionData: {
                    correctAnswers: ['most beautiful'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the comparative form of 'bad'?",
                  questionData: {
                    correctAnswers: ['worse'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the superlative form of 'good'?",
                  questionData: {
                    correctAnswers: ['best'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the comparative of 'expensive'?",
                  questionData: {
                    correctAnswers: ['more expensive'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the superlative of 'comfortable'?",
                  questionData: {
                    correctAnswers: ['most comfortable'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the comparative form of 'little'?",
                  questionData: {
                    correctAnswers: ['less'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the superlative form of 'much'?",
                  questionData: {
                    correctAnswers: ['most'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the adjectives with their comparative forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['tall', 'short', 'big', 'small'],
                      rightColumn: ['smaller', 'bigger', 'taller', 'shorter'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the adjectives with their superlative forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['good', 'bad', 'far', 'little'],
                      rightColumn: ['least', 'best', 'worst', 'farthest'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the long adjectives with their comparatives',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'beautiful',
                        'difficult',
                        'interesting',
                        'expensive',
                      ],
                      rightColumn: [
                        'more difficult',
                        'more expensive',
                        'more beautiful',
                        'more interesting',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the adjectives with their opposites',
                  questionData: {
                    pairs: {
                      leftColumn: ['bigger', 'better', 'more', 'less'],
                      rightColumn: ['worse', 'smaller', 'fewer', 'less'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the comparative structures',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'as...as',
                        'not as...as',
                        'more...than',
                        'less...than',
                      ],
                      rightColumn: [
                        'inferiority',
                        'equality',
                        'superiority',
                        'inferiority',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the irregular forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'good/well',
                        'bad/badly',
                        'much/many',
                        'little',
                      ],
                      rightColumn: ['worse', 'better', 'less', 'more'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the adjectives with correct usage',
                  questionData: {
                    pairs: {
                      leftColumn: ['older', 'elder', 'oldest', 'eldest'],
                      rightColumn: [
                        'family members',
                        'general age',
                        'general age',
                        'family members',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the comparative expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'comparative + than',
                        'the + superlative',
                        'as + adj + as',
                        'less + adj + than',
                      ],
                      rightColumn: [
                        'equality',
                        'inferiority',
                        'superiority',
                        'inferiority',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 2,
                      2: 0,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the adjectives with their types',
                  questionData: {
                    pairs: {
                      leftColumn: ['big', 'beautiful', 'good', 'bad'],
                      rightColumn: [
                        'long adjective',
                        'short adjective',
                        'irregular',
                        'irregular',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the comparative forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['tall', 'happy', 'intelligent', 'creative'],
                      rightColumn: [
                        'more intelligent',
                        'taller',
                        'happier',
                        'more creative',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'My brother is taller than my sister.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'This book is more interesting than that one.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'She is the best student in the class.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Your house is bigger than mine.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'He runs faster than his friends.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'This is the most difficult test I have ever taken.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'My car is older than yours.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'She sings more beautifully than anyone else.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'This dress is less expensive than that one.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'He is the tallest boy in the school.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to make a comparative sentence',
                  questionData: {
                    options: ['than', 'is', 'house', 'my', 'bigger', 'your'],
                    correctAnswers: [3, 4, 1, 2, 5, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to make a superlative sentence',
                  questionData: {
                    options: [
                      'in',
                      'the',
                      'is',
                      'class',
                      'best',
                      'student',
                      'she',
                    ],
                    correctAnswers: [6, 4, 5, 2, 1, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a comparative question',
                  questionData: {
                    options: ['you', 'is', 'who', 'taller', 'than', '?'],
                    correctAnswers: [2, 3, 1, 4, 0, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for an equality comparison',
                  questionData: {
                    options: ['as', 'as', 'he', 'is', 'tall', 'I', 'am'],
                    correctAnswers: [5, 6, 4, 2, 3, 0, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to compare ages',
                  questionData: {
                    options: ['older', 'is', 'my', 'brother', 'me', 'than'],
                    correctAnswers: [2, 3, 1, 0, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for a superlative with article',
                  questionData: {
                    options: ['is', 'the', 'most', 'beautiful', 'she', 'girl'],
                    correctAnswers: [4, 1, 2, 3, 5, 0],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to compare two items',
                  questionData: {
                    options: [
                      'better',
                      'is',
                      'this',
                      'book',
                      'that',
                      'one',
                      'than',
                    ],
                    correctAnswers: [2, 3, 1, 0, 5, 4, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a negative comparison',
                  questionData: {
                    options: ['as', 'as', 'not', 'he', 'is', 'tall', 'I', 'am'],
                    correctAnswers: [3, 7, 6, 4, 2, 1, 0, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to make a comparative with adverb',
                  questionData: {
                    options: [
                      'more',
                      'she',
                      'carefully',
                      'works',
                      'than',
                      'he',
                    ],
                    correctAnswers: [1, 3, 0, 2, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a multiple comparison',
                  questionData: {
                    options: [
                      'is',
                      'the',
                      'most',
                      'intelligent',
                      'person',
                      'she',
                      'room',
                      'in',
                      'the',
                    ],
                    correctAnswers: [5, 1, 2, 3, 4, 6, 7, 8, 0],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) comparing two of your friends and explain why you like them.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your city and compare it to another city you know, mentioning at least three differences.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about two different hobbies you enjoy and compare their benefits for your personal development.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Compare your current lifestyle with how you lived 5 years ago, focusing on positive and negative changes.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe two different educational systems and compare their effectiveness in helping students learn.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about traditional vs modern teaching methods and compare their advantages and disadvantages.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Compare living in a big city versus living in a small town, mentioning at least four aspects.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe two different cultures you are familiar with and compare their customs and traditions.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the advantages and disadvantages of online learning compared to traditional classroom learning.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Compare two different career paths you are considering and explain which one appeals to you more and why.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Future Plans',
              description: 'Going to and will for future expressions',
              order: 6,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which sentence uses 'going to' correctly?",
                  questionData: {
                    options: [
                      'I go to the store.',
                      'I going to the store.',
                      'I am going to the store.',
                      'I go to store.',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct future form: 'She _____ visit her grandmother tomorrow.'",
                  questionData: {
                    options: ['going to', 'will', 'is going to', 'shall'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which is a spontaneous decision?',
                  questionData: {
                    options: [
                      'I am going to buy a car.',
                      'I will buy a car.',
                      'I am buying a car.',
                      'I buy a car.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct form: 'They _____ travel to Japan next year.'",
                  questionData: {
                    options: [
                      'will',
                      'are going to',
                      'going to',
                      'is going to',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which sentence shows a planned future action?',
                  questionData: {
                    options: [
                      'I will call you later.',
                      'I am going to call you later.',
                      'I call you later.',
                      'I calling you later.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct future form: 'It _____ rain tomorrow.'",
                  questionData: {
                    options: ['will', 'is going to', 'going to', 'shall'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which is correct for a promise?',
                  questionData: {
                    options: [
                      'I going to help you.',
                      'I will help you.',
                      'I help you.',
                      'I am help you.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct form: 'We _____ have a party next weekend.'",
                  questionData: {
                    options: [
                      'will',
                      'are going to',
                      'going to',
                      'is going to',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "Which sentence uses 'will' for a prediction?",
                  questionData: {
                    options: [
                      'I am going to be a doctor.',
                      'I will be a doctor.',
                      'I be a doctor.',
                      'I going to be a doctor.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct future form: 'She _____ study medicine at university.'",
                  questionData: {
                    options: ['will', 'is going to', 'going to', 'shall'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We use 'going to' for planned future actions.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We use 'will' for spontaneous decisions.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "'I am going to' is the correct form of 'going to'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We can use 'will' for all future situations.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Predictions about the weather use 'going to'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "Promises are usually made with 'going to'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We use 'will' for intentions and plans.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "The negative form of 'will' is 'will not'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "We can contract 'I will' to 'I'll'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "'Going to' is more formal than 'will'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the full form of 'I'm going to'?",
                  questionData: {
                    correctAnswers: ['I am going to'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the negative form of 'will'?",
                  questionData: {
                    correctAnswers: ['will not', "won't"],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    "What is the question form of 'She is going to study'?",
                  questionData: {
                    correctAnswers: ['Is she going to study?'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the past form of 'will'?",
                  questionData: {
                    correctAnswers: ['would'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is another way to say 'I will help you'?",
                  questionData: {
                    correctAnswers: ['I am going to help you'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the contraction of 'we will'?",
                  questionData: {
                    correctAnswers: ["we'll"],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the full form of 'she'll'?",
                  questionData: {
                    correctAnswers: ['she will'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do we use for planned future actions?',
                  questionData: {
                    correctAnswers: ['going to', 'be going to'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do we use for predictions?',
                  questionData: {
                    correctAnswers: ['will', 'going to'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    "What is the question form of 'They will come'?",
                  questionData: {
                    correctAnswers: ['Will they come?'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the future forms with their uses',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'will',
                        'going to',
                        'present continuous',
                        'present simple',
                      ],
                      rightColumn: [
                        'scheduled events',
                        'intentions',
                        'spontaneous decisions',
                        'timetabled events',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the contractions with their full forms',
                  questionData: {
                    pairs: {
                      leftColumn: ["I'll", "You'll", "He'll", "We'll"],
                      rightColumn: ['We will', 'I will', 'He will', 'You will'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the sentences with the correct future form',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'I think it _____ rain.',
                        'I _____ buy a new car.',
                        'The train _____ arrive at 3 PM.',
                        'I promise I _____ help you.',
                      ],
                      rightColumn: [
                        'is going to',
                        'will',
                        'is going to',
                        'will',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 0,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the time expressions with future forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['next week', 'tomorrow', 'tonight', 'soon'],
                      rightColumn: [
                        'both possible',
                        'both possible',
                        'going to',
                        'will',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 0,
                      2: 1,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the subjects with correct future forms',
                  questionData: {
                    pairs: {
                      leftColumn: ['I', 'You', 'He/She/It', 'We/They'],
                      rightColumn: [
                        'will/are going to',
                        'will/are going to',
                        'will/is going to',
                        'will/are going to',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 0,
                      2: 0,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the negative forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'will not',
                        "won't",
                        'is not going to',
                        "isn't going to",
                      ],
                      rightColumn: [
                        'formal negative',
                        'contraction',
                        'negative of be going to',
                        'contraction of be going to',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the question forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Will you...?',
                        'Are you going to...?',
                        'What will...?',
                        'When is...?',
                      ],
                      rightColumn: [
                        'asking about plans',
                        'asking about predictions',
                        'asking about willingness',
                        'asking about scheduled time',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 1,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the future expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'be about to',
                        'be going to',
                        'will',
                        'shall',
                      ],
                      rightColumn: [
                        'immediate future',
                        'intentions',
                        'predictions',
                        'formal offers',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the modal futures',
                  questionData: {
                    pairs: {
                      leftColumn: ['may', 'might', 'could', 'should'],
                      rightColumn: [
                        'possibility',
                        'weak possibility',
                        'ability',
                        'advice',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the time words with future forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'next year',
                        'this evening',
                        'in two hours',
                        'at 5 PM',
                      ],
                      rightColumn: [
                        'both possible',
                        'both possible',
                        'be going to',
                        'present simple',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 0,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'I am going to visit my grandparents next weekend.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'She will call you as soon as she arrives.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'We are going to have a meeting tomorrow morning.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'He will help you with your homework.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'They are going to travel to Europe next summer.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I think it will rain this afternoon.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'She is going to become a teacher when she grows up.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'We will finish the project by Friday.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'He is going to learn how to play the guitar.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I promise I will never forget your birthday.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to make a future sentence',
                  questionData: {
                    options: ['going', 'I', 'to', 'am', 'store', 'the', 'to'],
                    correctAnswers: [1, 3, 0, 2, 5, 4, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a spontaneous decision',
                  questionData: {
                    options: ['help', 'I', 'will', 'you', '.'],
                    correctAnswers: [1, 2, 0, 3, 4],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a planned action',
                  questionData: {
                    options: [
                      'going',
                      'visit',
                      'to',
                      'am',
                      'I',
                      'my',
                      'friend',
                      'tomorrow',
                    ],
                    correctAnswers: [4, 3, 0, 2, 5, 6, 1, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a prediction',
                  questionData: {
                    options: ['will', 'rain', 'it', 'tomorrow', 'I', 'think'],
                    correctAnswers: [4, 5, 3, 0, 2, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a promise',
                  questionData: {
                    options: ['call', 'I', 'you', 'will', 'later', '.'],
                    correctAnswers: [1, 3, 2, 0, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a future question',
                  questionData: {
                    options: [
                      'going',
                      'you',
                      'to',
                      'are',
                      'come',
                      'party',
                      'to',
                      'the',
                      '?',
                    ],
                    correctAnswers: [1, 3, 0, 2, 4, 6, 5, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a negative future',
                  questionData: {
                    options: [
                      'going',
                      'not',
                      'to',
                      'I',
                      'am',
                      'late',
                      'be',
                      '.',
                    ],
                    correctAnswers: [3, 4, 1, 0, 2, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for a future with time expression',
                  questionData: {
                    options: ['will', 'we', 'next', 'travel', 'year', 'summer'],
                    correctAnswers: [1, 0, 3, 5, 4, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a conditional future',
                  questionData: {
                    options: [
                      'will',
                      'if',
                      'you',
                      'help',
                      'I',
                      'need',
                      'me',
                      '?',
                    ],
                    correctAnswers: [2, 5, 6, 0, 4, 3, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a future arrangement',
                  questionData: {
                    options: [
                      'is',
                      'meeting',
                      'the',
                      'at',
                      '3',
                      'PM',
                      'tomorrow',
                    ],
                    correctAnswers: [2, 1, 3, 0, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) about your plans for the next weekend.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe what you think your life will be like in 10 years from now.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about your future career plans and explain why you chose that profession.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe a place you plan to visit in the future and explain why you want to go there.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how you think technology will change our lives in the next 20 years.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your plans for learning a new skill or hobby in the coming months.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about what you will do if you win a large sum of money.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how you think education will change in the future.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about your plans for the next holiday and where you would like to travel.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe what you think the world will be like when your children or grandchildren are adults.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Jobs and Careers',
              description: 'Professions and workplace vocabulary',
              order: 7,
              questions: [
                // MULTIPLE_CHOICE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which profession helps sick people?',
                  questionData: {
                    options: ['Teacher', 'Doctor', 'Engineer', 'Chef'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who works in a school and teaches students?',
                  questionData: {
                    options: [
                      'Doctor',
                      'Teacher',
                      'Police officer',
                      'Firefighter',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which job involves cooking food?',
                  questionData: {
                    options: ['Chef', 'Doctor', 'Teacher', 'Police officer'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who drives a bus for a living?',
                  questionData: {
                    options: [
                      'Bus driver',
                      'Taxi driver',
                      'Truck driver',
                      'Pilot',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which profession designs buildings?',
                  questionData: {
                    options: ['Architect', 'Engineer', 'Doctor', 'Teacher'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who works in a police station?',
                  questionData: {
                    options: [
                      'Police officer',
                      'Firefighter',
                      'Doctor',
                      'Teacher',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which job involves flying airplanes?',
                  questionData: {
                    options: ['Pilot', 'Driver', 'Sailor', 'Engineer'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who works in a hospital?',
                  questionData: {
                    options: ['Nurse', 'Teacher', 'Chef', 'Police officer'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which profession works with money?',
                  questionData: {
                    options: ['Banker', 'Doctor', 'Teacher', 'Chef'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Who writes for newspapers?',
                  questionData: {
                    options: [
                      'Journalist',
                      'Teacher',
                      'Doctor',
                      'Police officer',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A doctor works in a school.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A teacher helps students learn.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A chef works in a restaurant.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A pilot flies airplanes.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A police officer works in a fire station.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A nurse helps sick people in a hospital.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'An engineer designs machines and buildings.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A journalist writes books.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A banker works with money.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A firefighter puts out fires.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a doctor do?',
                  questionData: {
                    correctAnswers: [
                      'helps sick people',
                      'treats patients',
                      'works in hospital',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a teacher do?',
                  questionData: {
                    correctAnswers: ['teaches students', 'works in school'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a chef do?',
                  questionData: {
                    correctAnswers: ['cooks food', 'works in restaurant'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a police officer do?',
                  questionData: {
                    correctAnswers: [
                      'protects people',
                      'enforces laws',
                      'works in police station',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does an engineer do?',
                  questionData: {
                    correctAnswers: [
                      'designs buildings',
                      'builds things',
                      'solves problems',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a nurse do?',
                  questionData: {
                    correctAnswers: [
                      'helps doctors',
                      'cares for patients',
                      'works in hospital',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a pilot do?',
                  questionData: {
                    correctAnswers: ['flies airplanes', 'transports people'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a firefighter do?',
                  questionData: {
                    correctAnswers: [
                      'puts out fires',
                      'saves people',
                      'works in fire station',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a journalist do?',
                  questionData: {
                    correctAnswers: [
                      'writes news',
                      'reports events',
                      'works for newspaper',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does a banker do?',
                  questionData: {
                    correctAnswers: [
                      'works with money',
                      'helps with finances',
                      'works in bank',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the professions with their workplaces',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Doctor',
                        'Teacher',
                        'Chef',
                        'Police officer',
                      ],
                      rightColumn: [
                        'Restaurant',
                        'School',
                        'Hospital',
                        'Police station',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the professions with what they do',
                  questionData: {
                    pairs: {
                      leftColumn: ['Doctor', 'Teacher', 'Engineer', 'Nurse'],
                      rightColumn: [
                        'Designs buildings',
                        'Teaches students',
                        'Helps patients',
                        'Treats sick people',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 0,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the emergency services',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Police officer',
                        'Firefighter',
                        'Doctor',
                        'Nurse',
                      ],
                      rightColumn: [
                        'Hospital',
                        'Police station',
                        'Fire station',
                        'Hospital',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the transportation jobs',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Bus driver',
                        'Taxi driver',
                        'Pilot',
                        'Sailor',
                      ],
                      rightColumn: ['Ship', 'Airplane', 'Bus', 'Taxi'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the creative professions',
                  questionData: {
                    pairs: {
                      leftColumn: ['Artist', 'Musician', 'Writer', 'Actor'],
                      rightColumn: [
                        'Plays music',
                        'Acts in films',
                        'Paints pictures',
                        'Writes books',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the office jobs',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Secretary',
                        'Manager',
                        'Accountant',
                        'Lawyer',
                      ],
                      rightColumn: [
                        'Manages money',
                        'Works in court',
                        'Manages office',
                        'Helps with appointments',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 0,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the service professions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Waiter',
                        'Hairdresser',
                        'Mechanic',
                        'Electrician',
                      ],
                      rightColumn: [
                        'Cuts hair',
                        'Serves food',
                        'Fixes cars',
                        'Fixes electrical problems',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the education professions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Teacher',
                        'Professor',
                        'Principal',
                        'Librarian',
                      ],
                      rightColumn: [
                        'Works in library',
                        'Teaches in school',
                        'Manages school',
                        'Teaches at university',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the skilled trades',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Carpenter',
                        'Plumber',
                        'Electrician',
                        'Painter',
                      ],
                      rightColumn: [
                        'Works with wood',
                        'Paints buildings',
                        'Fixes pipes',
                        'Fixes electrical systems',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 2,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the helping professions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Social worker',
                        'Psychologist',
                        'Counselor',
                        'Therapist',
                      ],
                      rightColumn: [
                        'Provides therapy',
                        'Helps with mental health',
                        'Helps with personal problems',
                        'Helps families and communities',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'A doctor works in a hospital.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'A teacher helps students learn new things.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A chef prepares delicious meals in a restaurant.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A police officer protects people and enforces laws.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'An engineer designs and builds complex structures.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A nurse assists doctors and cares for patients.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A pilot flies passengers to different destinations.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A firefighter responds to emergencies and saves lives.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A journalist investigates and reports news stories.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'A banker manages financial transactions and accounts.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to describe a doctor',
                  questionData: {
                    options: ['helps', 'doctor', 'sick', 'a', 'people', '.'],
                    correctAnswers: [3, 1, 0, 2, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a teacher sentence',
                  questionData: {
                    options: ['school', 'works', 'teacher', 'a', 'in', '.'],
                    correctAnswers: [3, 1, 4, 0, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a chef description',
                  questionData: {
                    options: [
                      'restaurant',
                      'cooks',
                      'chef',
                      'a',
                      'in',
                      'food',
                      '.',
                    ],
                    correctAnswers: [3, 2, 5, 1, 4, 0, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a police officer',
                  questionData: {
                    options: [
                      'protects',
                      'officer',
                      'police',
                      'a',
                      'people',
                      '.',
                    ],
                    correctAnswers: [3, 2, 0, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for an engineer',
                  questionData: {
                    options: ['buildings', 'engineer', 'an', 'designs', '.'],
                    correctAnswers: [2, 1, 3, 0, 4],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a nurse',
                  questionData: {
                    options: ['hospital', 'works', 'nurse', 'a', 'in', '.'],
                    correctAnswers: [3, 1, 4, 0, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a pilot',
                  questionData: {
                    options: ['pilot', 'a', 'flies', 'airplanes', '.'],
                    correctAnswers: [1, 0, 2, 3, 4],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a firefighter',
                  questionData: {
                    options: ['fires', 'puts', 'firefighter', 'a', 'out', '.'],
                    correctAnswers: [3, 1, 4, 0, 2],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a journalist',
                  questionData: {
                    options: [
                      'stories',
                      'journalist',
                      'a',
                      'writes',
                      'news',
                      '.',
                    ],
                    correctAnswers: [2, 1, 3, 4, 0, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a banker',
                  questionData: {
                    options: ['money', 'banker', 'a', 'with', 'works', '.'],
                    correctAnswers: [2, 1, 4, 3, 0, 5],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10)
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your dream job and why you would like to do it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe a job you think is important in society and explain why it matters.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the skills and qualities needed for your chosen profession.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how technology is changing jobs and workplaces in modern times.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the advantages and disadvantages of working from home versus working in an office.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe a typical workday in your ideal job and what activities you would do.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how education and training help people get better jobs and careers.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the differences between traditional jobs and modern gig economy work.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about the importance of work-life balance in modern careers.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how you would prepare for a job interview for your dream position.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Intermediate (B1)',
          description: 'Developing conversational fluency',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Present Perfect Tense',
              description: 'Experiences and recent actions',
              order: 0,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which sentence uses Present Perfect correctly?',
                  questionData: {
                    options: [
                      'I have ate breakfast.',
                      'I have eaten breakfast.',
                      'I has eaten breakfast.',
                      'I eating breakfast.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct Present Perfect form: 'She _____ her homework.'",
                  questionData: {
                    options: [
                      'finish',
                      'has finished',
                      'finishing',
                      'finished',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Which is the correct negative: 'They _____ to Paris.'",
                  questionData: {
                    options: [
                      'have never been',
                      'has never been',
                      'never went',
                      'have never went',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Complete: 'I _____ my keys. I can't find them.'",
                  questionData: {
                    options: ['lost', 'have lost', 'has lost', 'losed'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which sentence shows an experience up to now?',
                  questionData: {
                    options: [
                      'I visit my grandmother every Sunday.',
                      'I have visited my grandmother three times this month.',
                      'I am visiting my grandmother now.',
                      'I will visit my grandmother tomorrow.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Choose the correct form: 'We _____ each other for 10 years.'",
                  questionData: {
                    options: ['know', 'have known', 'are knowing', 'will know'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which is correct for a recent action with present result?',
                  questionData: {
                    options: [
                      'I eat lunch. I am full now.',
                      'I have eaten lunch. I am full now.',
                      'I ate lunch. I was full then.',
                      'I will eat lunch. I will be full.',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Complete with Present Perfect: 'She _____ the answer yet.'",
                  questionData: {
                    options: [
                      'not find',
                      'has not found',
                      'not finding',
                      'did not find',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which sentence uses Present Perfect Continuous correctly?',
                  questionData: {
                    options: [
                      'I have been studying English since 2010.',
                      'I study English since 2010.',
                      'I am studying English since 2010.',
                      'I studied English since 2010.',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    "Choose the most appropriate tense for news: 'Scientists _____ a new vaccine.'",
                  questionData: {
                    options: [
                      'develop',
                      'have developed',
                      'are developing',
                      'will develop',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "Present Perfect uses 'have/has' + past participle.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Present Perfect is used for actions that finished in the past.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'We use Present Perfect for experiences up to now.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: "The contraction of 'have not' is 'haven't'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Present Perfect can be used with specific time expressions like 'yesterday'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Present Perfect Continuous emphasizes duration of activity.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'We use Present Perfect for actions that started in the past and continue now.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Present Perfect is the same as Simple Past in meaning.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Present Perfect Continuous can replace Present Perfect Simple in all contexts.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Present Perfect connects past actions to the present moment.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the Present Perfect form of 'go'?",
                  questionData: {
                    correctAnswers: ['have gone', 'has gone'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What is the negative form of 'I have seen'?",
                  questionData: {
                    correctAnswers: ['I have not seen', "I haven't seen"],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "Complete: 'She _____ already _____ lunch.'",
                  questionData: {
                    correctAnswers: ['has eaten', 'has already eaten'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    "What is the question form of 'He has finished'?",
                  questionData: {
                    correctAnswers: ['Has he finished?'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Complete with Present Perfect: 'How many times _____ you _____ to London?'",
                  questionData: {
                    correctAnswers: ['have been', 'have you been'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "What tense is used for: 'I have lived here for 5 years.'",
                  questionData: {
                    correctAnswers: ['Present Perfect'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: "Complete: 'They _____ just _____ the movie.'",
                  questionData: {
                    correctAnswers: ['have seen', 'have just seen'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "What is the Present Perfect Continuous of 'work'?",
                  questionData: {
                    correctAnswers: ['have been working', 'has been working'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    "Complete with correct tense: 'By the time I arrive, she _____ already _____.'",
                  questionData: {
                    correctAnswers: [
                      'will have left',
                      'will have already left',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What structure shows duration from past to present?',
                  questionData: {
                    correctAnswers: ['Present Perfect Continuous'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the verbs with their past participles',
                  questionData: {
                    pairs: {
                      leftColumn: ['go', 'eat', 'see', 'do'],
                      rightColumn: ['done', 'seen', 'gone', 'eaten'],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the subjects with correct auxiliary verbs',
                  questionData: {
                    pairs: {
                      leftColumn: ['I/You/We/They', 'He/She/It'],
                      rightColumn: ['has', 'have'],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the time expressions with Present Perfect',
                  questionData: {
                    pairs: {
                      leftColumn: ['already', 'yet', 'ever', 'never'],
                      rightColumn: [
                        'Experience',
                        'Negative question',
                        'Positive statement',
                        'Negative statement',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the irregular verbs',
                  questionData: {
                    pairs: {
                      leftColumn: ['be', 'have', 'do', 'say'],
                      rightColumn: ['been', 'had', 'said', 'done'],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 3,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the sentences with their meanings',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'I have visited Paris three times.',
                        'I have been waiting for an hour.',
                        'I have finished my homework.',
                        'She has never eaten sushi.',
                      ],
                      rightColumn: [
                        'Recent completed action',
                        'Experience',
                        'Duration from past to present',
                        'Negative experience',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the Present Perfect forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'have/has + past participle',
                        'have/has + been + -ing',
                        'have/has + just/already',
                        'have/has + never/ever',
                      ],
                      rightColumn: [
                        'Duration',
                        'Recent actions',
                        'Simple experiences',
                        'Continuous experiences',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the question types',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Have you ever...?',
                        'How long have you...?',
                        'How many times have you...?',
                        'Have you...yet?',
                      ],
                      rightColumn: [
                        'Duration',
                        'Frequency',
                        'Experience',
                        'Recent completion',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 1,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the Present Perfect Continuous forms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'have/has been working',
                        'have/has been studying',
                        'have/has been living',
                        'have/has been waiting',
                      ],
                      rightColumn: [
                        'Temporary situation',
                        'Duration of activity',
                        'Repeated action',
                        'Continuous state',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 1,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the advanced Present Perfect uses',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'result of past action',
                        'life experience',
                        'repeated action',
                        'uncompleted action',
                      ],
                      rightColumn: [
                        'Present Perfect Simple',
                        'Present Perfect Continuous',
                        'Present Perfect Simple',
                        'Present Perfect Continuous',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 0,
                      2: 0,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the complex time expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'since 2010',
                        'for three years',
                        'recently',
                        'lately',
                      ],
                      rightColumn: [
                        'Present Perfect Continuous',
                        'Present Perfect',
                        'Present Perfect',
                        'Present Perfect Continuous',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I have finished my homework.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'She has never been to Asia.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'We have already eaten dinner.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'He has just arrived from work.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'How long have you known each other?',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'I have been studying English since 2015.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'They have visited five countries this year.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'She has been working here for three years.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'By next year, I will have lived in this city for a decade.',
                  questionData: {
                    correctAnswers: [4],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'I have been trying to solve this problem since morning.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to make a Present Perfect sentence',
                  questionData: {
                    options: ['finished', 'I', 'have', 'homework', 'my', '.'],
                    correctAnswers: [1, 2, 0, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for a Present Perfect question',
                  questionData: {
                    options: ['you', 'ever', 'have', 'Paris', 'visited', '?'],
                    correctAnswers: [2, 0, 1, 4, 3, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for a negative Present Perfect',
                  questionData: {
                    options: ['not', 'I', 'have', 'seen', 'movie', 'the', '.'],
                    correctAnswers: [1, 2, 0, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for Present Perfect with adverb',
                  questionData: {
                    options: ['already', 'she', 'has', 'eaten', 'lunch', '.'],
                    correctAnswers: [1, 2, 0, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words for Present Perfect Continuous',
                  questionData: {
                    options: [
                      'been',
                      'I',
                      'have',
                      'studying',
                      'English',
                      'for',
                      'hours',
                      'two',
                      '.',
                    ],
                    correctAnswers: [1, 2, 3, 0, 4, 5, 7, 6, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words for a complex Present Perfect sentence',
                  questionData: {
                    options: [
                      'never',
                      'I',
                      'have',
                      'such',
                      'seen',
                      'amazing',
                      'thing',
                      'an',
                      'before',
                      '.',
                    ],
                    correctAnswers: [1, 2, 0, 4, 7, 5, 6, 8, 9],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words for Present Perfect with time expression',
                  questionData: {
                    options: [
                      'since',
                      'been',
                      'have',
                      'I',
                      'here',
                      'living',
                      '2010',
                      '.',
                    ],
                    correctAnswers: [3, 2, 5, 0, 6, 1, 4, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words for a Present Perfect question with duration',
                  questionData: {
                    options: [
                      'long',
                      'how',
                      'you',
                      'have',
                      'working',
                      'here',
                      'been',
                      '?',
                    ],
                    correctAnswers: [2, 3, 1, 0, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for Present Perfect in passive voice',
                  questionData: {
                    options: [
                      'been',
                      'has',
                      'the',
                      'house',
                      'built',
                      'already',
                      '?',
                    ],
                    correctAnswers: [3, 1, 5, 0, 4, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for Present Perfect Continuous question',
                  questionData: {
                    options: [
                      'you',
                      'been',
                      'what',
                      'have',
                      'doing',
                      'all',
                      'morning',
                      '?',
                    ],
                    correctAnswers: [3, 0, 4, 1, 2, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your experiences with learning English.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe three things you have done recently and explain why they were important to you.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a place you have visited and describe what you learned from the experience.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your daily routine using Present Perfect tense for activities you have completed.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Compare your life now with how it was 5 years ago, focusing on changes and developments.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about a skill you have been developing and explain the progress you have made.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe a challenging situation you have faced and explain how you overcame it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about cultural differences you have experienced while traveling or living abroad.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze how Present Perfect tense contributes to expressing life experiences and personal development.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss the differences between Present Perfect Simple and Present Perfect Continuous in terms of meaning and usage.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Education and Learning',
              description: 'School subjects and studying vocabulary',
              order: 1,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which subject teaches about numbers and shapes?',
                  questionData: {
                    options: ['History', 'Mathematics', 'Geography', 'Art'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What do we call a person who teaches in a university?',
                  questionData: {
                    options: ['Student', 'Teacher', 'Professor', 'Principal'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which subject studies living organisms?',
                  questionData: {
                    options: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What is the head of a school called?',
                  questionData: {
                    options: ['Teacher', 'Student', 'Principal', 'Librarian'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which learning method involves group discussion and interaction?',
                  questionData: {
                    options: ['Lecture', 'Seminar', 'Tutorial', 'Workshop'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for learning by doing practical activities?',
                  questionData: {
                    options: [
                      'Theoretical learning',
                      'Experiential learning',
                      'Passive learning',
                      'Memorization',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which assessment method evaluates student work over time?',
                  questionData: {
                    options: ['Quiz', 'Exam', 'Portfolio', 'Oral presentation'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the study of language and literature called?',
                  questionData: {
                    options: [
                      'Linguistics',
                      'Philology',
                      'Literature',
                      'Grammar',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which educational philosophy emphasizes student-centered learning?',
                  questionData: {
                    options: [
                      'Behaviorism',
                      'Constructivism',
                      'Positivism',
                      'Essentialism',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'What is the term for the ability to think critically and solve problems?',
                  questionData: {
                    options: [
                      'Intelligence',
                      'Cognition',
                      'Critical thinking',
                      'Metacognition',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Mathematics is the study of numbers and calculations.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'A library is a place where students borrow books.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Geography studies plants and animals.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'A professor teaches at a university level.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Blended learning combines face-to-face and online instruction.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Formative assessment occurs at the end of a course.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Active recall is a more effective study technique than passive reading.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText: 'Syllabus and curriculum mean the same thing.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    "Metacognition refers to thinking about one's own thinking processes.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Andragogy is the method of teaching children, while pedagogy is for adults.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What subject teaches about past events?',
                  questionData: {
                    correctAnswers: ['History'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the place called where students study?',
                  questionData: {
                    correctAnswers: ['School', 'University', 'College'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What do we call a person who studies at a school?',
                  questionData: {
                    correctAnswers: ['Student'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What subject deals with computers and technology?',
                  questionData: {
                    correctAnswers: [
                      'Computer Science',
                      'Information Technology',
                      'IT',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for learning that happens outside formal education?',
                  questionData: {
                    correctAnswers: ['Informal learning', 'Lifelong learning'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What study technique involves teaching material to someone else?',
                  questionData: {
                    correctAnswers: ['Feynman technique', 'Teaching method'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the evaluation of student performance called?',
                  questionData: {
                    correctAnswers: ['Assessment', 'Evaluation'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for knowledge and skills acquired through experience?',
                  questionData: {
                    correctAnswers: ['Competence', 'Competency'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What educational approach focuses on developing critical thinking over rote memorization?',
                  questionData: {
                    correctAnswers: [
                      'Inquiry-based learning',
                      'Problem-based learning',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What psychological principle explains how we retain information better when we space out our study sessions?',
                  questionData: {
                    correctAnswers: [
                      'Spaced repetition',
                      'Distributed practice',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the subjects with their descriptions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Mathematics',
                        'Biology',
                        'History',
                        'Geography',
                      ],
                      rightColumn: [
                        'Study of living organisms',
                        'Study of numbers',
                        'Study of past events',
                        'Study of places and environment',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the educational roles',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Principal',
                        'Teacher',
                        'Librarian',
                        'Counselor',
                      ],
                      rightColumn: [
                        'Manages school',
                        'Teaches students',
                        'Manages books',
                        'Provides guidance',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the study techniques',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Flashcards',
                        'Mind mapping',
                        'Active recall',
                        'Pomodoro',
                      ],
                      rightColumn: [
                        'Time management',
                        'Visual organization',
                        'Memory testing',
                        'Spaced repetition',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the academic degrees',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Bachelor',
                        'Master',
                        'Doctorate',
                        'Associate',
                      ],
                      rightColumn: [
                        'Graduate degree',
                        'Undergraduate degree',
                        'Highest academic degree',
                        'Two-year degree',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the learning theories',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Behaviorism',
                        'Constructivism',
                        'Cognitivism',
                        'Humanism',
                      ],
                      rightColumn: [
                        'Student-centered learning',
                        'Focus on mental processes',
                        'Stimulus-response learning',
                        'Personal growth focus',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 1,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the assessment types',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Formative',
                        'Summative',
                        'Diagnostic',
                        'Authentic',
                      ],
                      rightColumn: [
                        'End-of-course evaluation',
                        'Real-world application',
                        'During learning process',
                        'Before instruction begins',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the educational technologies',
                  questionData: {
                    pairs: {
                      leftColumn: ['LMS', 'MOOC', 'VR', 'AI'],
                      rightColumn: [
                        'Virtual Reality',
                        'Learning Management System',
                        'Massive Open Online Course',
                        'Artificial Intelligence',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the research methods',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Qualitative',
                        'Quantitative',
                        'Mixed methods',
                        'Action research',
                      ],
                      rightColumn: [
                        'Numbers and statistics',
                        'Words and meanings',
                        'Both approaches',
                        'Practitioner research',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the pedagogical approaches',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Montessori',
                        'Waldorf',
                        'Reggio Emilia',
                        'High Scope',
                      ],
                      rightColumn: [
                        'Child-led learning',
                        'Holistic development',
                        'Active participatory learning',
                        'Play-based curriculum',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the cognitive learning strategies',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Elaboration',
                        'Organization',
                        'Rehearsal',
                        'Metacognition',
                      ],
                      rightColumn: [
                        'Planning and monitoring',
                        'Repetition',
                        'Connecting new information',
                        'Categorizing information',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Physics is the study of matter and energy.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'A student attends classes at a university.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Chemistry deals with substances and their reactions.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'The principal is responsible for school administration.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Lifelong learning continues throughout a person's life.",
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Critical thinking involves analyzing and evaluating information.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Distance learning uses technology to deliver education remotely.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Problem-solving requires identifying issues and finding solutions.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Constructivism posits that learners construct knowledge through experience.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Andragogy is the art and science of helping adults learn.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to describe a school',
                  questionData: {
                    options: [
                      'school',
                      'a',
                      'is',
                      'place',
                      'students',
                      'learn',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a teacher description',
                  questionData: {
                    options: [
                      'teacher',
                      'a',
                      'helps',
                      'students',
                      'learn',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for a library sentence',
                  questionData: {
                    options: [
                      'library',
                      'a',
                      'is',
                      'place',
                      'books',
                      'borrow',
                      'students',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 6, 5, 4, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for a university description',
                  questionData: {
                    options: [
                      'university',
                      'a',
                      'is',
                      'institution',
                      'higher',
                      'education',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 4, 3, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words for a complex education concept',
                  questionData: {
                    options: [
                      'education',
                      'formal',
                      'includes',
                      'schools',
                      'universities',
                      'and',
                      'colleges',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 6, 4, 5, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for a learning process',
                  questionData: {
                    options: [
                      'learning',
                      'active',
                      'involves',
                      'engagement',
                      'and',
                      'participation',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 4, 3, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for a study technique',
                  questionData: {
                    options: [
                      'technique',
                      'study',
                      'effective',
                      'includes',
                      'review',
                      'and',
                      'practice',
                      '.',
                    ],
                    correctAnswers: [1, 2, 0, 3, 6, 5, 4, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for an assessment method',
                  questionData: {
                    options: [
                      'assessment',
                      'formative',
                      'provides',
                      'feedback',
                      'during',
                      'learning',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for a pedagogical approach',
                  questionData: {
                    options: [
                      'approach',
                      'student-centered',
                      'focuses',
                      'on',
                      'learner',
                      'needs',
                      'and',
                      'interests',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 6, 5, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for a cognitive learning strategy',
                  questionData: {
                    options: [
                      'strategy',
                      'cognitive',
                      'enhances',
                      'memory',
                      'through',
                      'elaboration',
                      'and',
                      'organization',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 3, 5, 7, 6, 8],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your favorite school subject and why you enjoy it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your daily study routine and explain which study techniques work best for you.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a teacher who influenced you and explain how they helped your learning.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the differences between learning in primary school versus high school.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the advantages and disadvantages of online learning compared to traditional classroom education.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about how technology has changed education and whether these changes are positive or negative.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe the role of critical thinking in modern education and why it is important.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Write about the importance of lifelong learning in today's rapidly changing world.",
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze different learning theories and discuss which approach you believe is most effective for adult learners.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss the challenges facing modern education systems and propose innovative solutions for the future.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Technology and Innovation',
              description: 'Modern technology and digital communication',
              order: 2,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which device do we use to browse the internet?',
                  questionData: {
                    options: ['Television', 'Computer', 'Radio', 'Telephone'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "What does 'www' stand for in a website address?",
                  questionData: {
                    options: [
                      'World Wide Web',
                      'World Web Wide',
                      'Wide World Web',
                      'Web World Wide',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which social media platform is known for short messages?',
                  questionData: {
                    options: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What device do we use to take photographs digitally?',
                  questionData: {
                    options: [
                      'Camera',
                      'Digital camera',
                      'Smartphone',
                      'All of the above',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which technology allows us to connect devices wirelessly?',
                  questionData: {
                    options: ['Bluetooth', 'Wi-Fi', 'NFC', 'All of the above'],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for malicious software that can harm computers?',
                  questionData: {
                    options: [
                      'Virus',
                      'Malware',
                      'Spyware',
                      'All of the above',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which company developed the Android operating system?',
                  questionData: {
                    options: ['Apple', 'Microsoft', 'Google', 'Samsung'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: "What does 'AI' stand for in technology?",
                  questionData: {
                    options: [
                      'Advanced Intelligence',
                      'Artificial Intelligence',
                      'Automated Interface',
                      'Active Integration',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which programming paradigm is based on objects and classes?',
                  questionData: {
                    options: [
                      'Functional programming',
                      'Object-oriented programming',
                      'Procedural programming',
                      'Logic programming',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'What is the primary purpose of blockchain technology?',
                  questionData: {
                    options: [
                      'Social networking',
                      'Decentralized ledger',
                      'Video streaming',
                      'Email communication',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Smartphones can connect to the internet.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Email is faster than traditional mail.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Virtual reality creates completely artificial environments.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Cloud computing stores data on local devices.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Machine learning algorithms can improve without being explicitly programmed.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Cryptocurrency transactions are completely anonymous.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    '5G technology provides faster internet speeds than 4G.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Open-source software can be modified by anyone.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Quantum computing uses quantum bits that can exist in multiple states simultaneously.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Edge computing processes data closer to where it is generated.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What device do we use to send emails?',
                  questionData: {
                    correctAnswers: ['Computer', 'Smartphone', 'Tablet'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What is the most popular search engine?',
                  questionData: {
                    correctAnswers: ['Google'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What technology allows us to video call?',
                  questionData: {
                    correctAnswers: [
                      'Video conferencing',
                      'VoIP',
                      'Internet calling',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What is the term for unwanted emails?',
                  questionData: {
                    correctAnswers: ['Spam'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the process of converting data into a code to prevent unauthorized access?',
                  questionData: {
                    correctAnswers: ['Encryption'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What technology allows devices to communicate without wires?',
                  questionData: {
                    correctAnswers: [
                      'Wireless technology',
                      'Bluetooth',
                      'Wi-Fi',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for a global network of computers?',
                  questionData: {
                    correctAnswers: ['Internet'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the name for software that tracks user behavior online?',
                  questionData: {
                    correctAnswers: ['Tracking software', 'Analytics'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What paradigm shift in computing involves processing data in smaller, distributed chunks?',
                  questionData: {
                    correctAnswers: ['Edge computing', 'Distributed computing'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What technology uses algorithms that can learn and improve from experience?',
                  questionData: {
                    correctAnswers: [
                      'Machine learning',
                      'Artificial intelligence',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the devices with their functions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Smartphone',
                        'Laptop',
                        'Tablet',
                        'Smartwatch',
                      ],
                      rightColumn: [
                        'Portable computer',
                        'Mobile phone with computer features',
                        'Touchscreen computer',
                        'Wearable device',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the social media platforms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Facebook',
                        'Twitter',
                        'Instagram',
                        'LinkedIn',
                      ],
                      rightColumn: [
                        'Professional networking',
                        'Photo sharing',
                        'Microblogging',
                        'Social networking',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the internet terms',
                  questionData: {
                    pairs: {
                      leftColumn: ['Browser', 'Website', 'Email', 'Download'],
                      rightColumn: [
                        'Electronic mail',
                        'Software for viewing web pages',
                        'Collection of web pages',
                        'Transfer data from internet',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the storage types',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Hard drive',
                        'Cloud storage',
                        'USB drive',
                        'CD',
                      ],
                      rightColumn: [
                        'Optical disc',
                        'Portable storage device',
                        'Internal computer storage',
                        'Online storage service',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the programming concepts',
                  questionData: {
                    pairs: {
                      leftColumn: ['Algorithm', 'Variable', 'Function', 'Loop'],
                      rightColumn: [
                        'Repeating code block',
                        'Named storage location',
                        'Step-by-step procedure',
                        'Reusable code block',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the cybersecurity terms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Firewall',
                        'Antivirus',
                        'Encryption',
                        'VPN',
                      ],
                      rightColumn: [
                        'Secure remote access',
                        'Data protection',
                        'Malware protection',
                        'Network security',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the emerging technologies',
                  questionData: {
                    pairs: {
                      leftColumn: ['Blockchain', 'IoT', 'VR', 'AR'],
                      rightColumn: [
                        'Internet of Things',
                        'Augmented Reality',
                        'Virtual Reality',
                        'Distributed ledger technology',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 0,
                      2: 2,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the data concepts',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Big Data',
                        'Data Mining',
                        'Machine Learning',
                        'Deep Learning',
                      ],
                      rightColumn: [
                        'Subset of AI',
                        'Pattern discovery',
                        'Large datasets',
                        'AI subset using neural networks',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the advanced computing concepts',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Quantum computing',
                        'Edge computing',
                        'Fog computing',
                        'Grid computing',
                      ],
                      rightColumn: [
                        'Distributed processing',
                        'Near data source processing',
                        'Quantum bit processing',
                        'Intermediate computing layer',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the software development methodologies',
                  questionData: {
                    pairs: {
                      leftColumn: ['Agile', 'Waterfall', 'DevOps', 'Scrum'],
                      rightColumn: [
                        'Linear development approach',
                        'Iterative development',
                        'Development and operations integration',
                        'Agile framework',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'I use my smartphone to check emails.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'The internet connects computers worldwide.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Social media helps people stay connected.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'A tablet is a portable computing device.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Cloud computing stores data on remote servers.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Artificial intelligence can learn from experience.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Virtual reality creates immersive digital environments.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Cybersecurity protects systems from digital threats.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Blockchain technology ensures secure, decentralized transactions.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Quantum computing leverages quantum mechanics for computation.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to describe a computer',
                  questionData: {
                    options: [
                      'computer',
                      'a',
                      'is',
                      'electronic',
                      'device',
                      'processes',
                      'data',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 4, 3, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for an internet sentence',
                  questionData: {
                    options: [
                      'internet',
                      'the',
                      'connects',
                      'computers',
                      'worldwide',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for email communication',
                  questionData: {
                    options: [
                      'email',
                      'is',
                      'electronic',
                      'form',
                      'of',
                      'mail',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for social media',
                  questionData: {
                    options: [
                      'social',
                      'media',
                      'platforms',
                      'connect',
                      'people',
                      'online',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for artificial intelligence',
                  questionData: {
                    options: [
                      'intelligence',
                      'artificial',
                      'simulates',
                      'human',
                      'intelligence',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for cloud computing',
                  questionData: {
                    options: [
                      'computing',
                      'cloud',
                      'delivers',
                      'services',
                      'over',
                      'the',
                      'internet',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for cybersecurity',
                  questionData: {
                    options: [
                      'cybersecurity',
                      'protects',
                      'computer',
                      'systems',
                      'from',
                      'threats',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for virtual reality',
                  questionData: {
                    options: [
                      'reality',
                      'virtual',
                      'creates',
                      'immersive',
                      'digital',
                      'experiences',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 3, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for blockchain technology',
                  questionData: {
                    options: [
                      'blockchain',
                      'is',
                      'distributed',
                      'ledger',
                      'technology',
                      'for',
                      'secure',
                      'transactions',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for quantum computing',
                  questionData: {
                    options: [
                      'computing',
                      'quantum',
                      'uses',
                      'quantum',
                      'mechanics',
                      'for',
                      'computation',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing how you use technology in your daily life.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your favorite social media platform and explain why you prefer it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about how the internet has changed the way people communicate.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the differences between a smartphone and a traditional mobile phone.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the advantages and disadvantages of social media in modern society.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about how artificial intelligence might change the future of work.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe the impact of smartphones on social interactions and relationships.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Write about the importance of digital literacy in today's world.",
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze the ethical implications of emerging technologies like AI and biotechnology.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss how blockchain technology could revolutionize various industries and society as a whole.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Environmental Issues',
              description: 'Nature, pollution, and sustainability',
              order: 3,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What is the main cause of air pollution?',
                  questionData: {
                    options: [
                      'Burning fossil fuels',
                      'Planting trees',
                      'Using renewable energy',
                      'Recycling waste',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which gas is primarily responsible for global warming?',
                  questionData: {
                    options: [
                      'Oxygen',
                      'Nitrogen',
                      'Carbon dioxide',
                      'Hydrogen',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: "What does 'sustainability' mean?",
                  questionData: {
                    options: [
                      'Using resources without thinking about the future',
                      'Meeting current needs without harming future generations',
                      'Consuming as much as possible',
                      'Ignoring environmental concerns',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which activity contributes to deforestation?',
                  questionData: {
                    options: [
                      'Planting trees',
                      'Cutting down trees for wood',
                      'Protecting forests',
                      'Creating national parks',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "What is the term for the gradual increase in Earth's temperature?",
                  questionData: {
                    options: [
                      'Global cooling',
                      'Climate change',
                      'Weather fluctuation',
                      'Temperature stabilization',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which of these is a renewable energy source?',
                  questionData: {
                    options: [
                      'Coal',
                      'Natural gas',
                      'Solar power',
                      'Nuclear power',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: "What does 'biodiversity' refer to?",
                  questionData: {
                    options: [
                      'The variety of life in an ecosystem',
                      'The process of species extinction',
                      'The study of rocks and minerals',
                      'The measurement of air quality',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which human activity produces the most greenhouse gases?',
                  questionData: {
                    options: [
                      'Agriculture',
                      'Transportation',
                      'Industrial production',
                      'Electricity generation',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    "What is the 'Paris Agreement' primarily aimed at addressing?",
                  questionData: {
                    options: [
                      'Nuclear proliferation',
                      'International trade',
                      'Climate change',
                      'Ocean pollution',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which concept describes the ability of an ecosystem to recover from disturbances?',
                  questionData: {
                    options: [
                      'Resilience',
                      'Adaptation',
                      'Mitigation',
                      'Restoration',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Recycling helps reduce waste in landfills.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Burning fossil fuels contributes to air pollution.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Solar energy is a renewable source of power.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Deforestation increases biodiversity.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'The ozone layer protects Earth from harmful UV radiation.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText: 'Electric vehicles produce zero emissions.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Sustainable development meets present needs without compromising future generations.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Organic farming uses synthetic pesticides and fertilizers.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    "The 'tragedy of the commons' explains why shared resources are often overused.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Carbon capture and storage technology can remove CO2 from the atmosphere.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the term for cutting down trees in large areas?',
                  questionData: {
                    correctAnswers: ['Deforestation'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What gas do plants absorb from the air?',
                  questionData: {
                    correctAnswers: ['Carbon dioxide', 'CO2'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the process of reusing materials called?',
                  questionData: {
                    correctAnswers: ['Recycling'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What do we call energy sources that never run out?',
                  questionData: {
                    correctAnswers: ['Renewable energy'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for the variety of plant and animal species in an ecosystem?',
                  questionData: {
                    correctAnswers: ['Biodiversity'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the name for the protective layer around Earth that absorbs UV radiation?',
                  questionData: {
                    correctAnswers: ['Ozone layer'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "What do we call the gradual warming of Earth's climate?",
                  questionData: {
                    correctAnswers: ['Global warming', 'Climate change'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for managing forests to meet human needs while preserving them?',
                  questionData: {
                    correctAnswers: ['Sustainable forestry'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What concept describes the maximum population size an environment can sustain?',
                  questionData: {
                    correctAnswers: ['Carrying capacity'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What is the name for the international agreement to combat climate change?',
                  questionData: {
                    correctAnswers: ['Paris Agreement', 'Kyoto Protocol'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the environmental problems with their causes',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Air pollution',
                        'Water pollution',
                        'Soil erosion',
                        'Global warming',
                      ],
                      rightColumn: [
                        'Industrial emissions',
                        'Chemical runoff',
                        'Tree removal',
                        'Greenhouse gases',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the renewable energy sources',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Solar',
                        'Wind',
                        'Hydroelectric',
                        'Geothermal',
                      ],
                      rightColumn: [
                        'Underground heat',
                        'Moving water',
                        'Sunlight',
                        'Moving air',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the conservation methods',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Recycling',
                        'Reforestation',
                        'Protected areas',
                        'Sustainable farming',
                      ],
                      rightColumn: [
                        'National parks',
                        'Planting trees',
                        'Resource reuse',
                        'Eco-friendly agriculture',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the environmental organizations',
                  questionData: {
                    pairs: {
                      leftColumn: ['Greenpeace', 'WWF', 'UNEP', 'EPA'],
                      rightColumn: [
                        'US Environmental Protection Agency',
                        'United Nations Environment Programme',
                        'World Wildlife Fund',
                        'Environmental activism',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the climate change effects',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Rising sea levels',
                        'Extreme weather',
                        'Species migration',
                        'Ocean acidification',
                      ],
                      rightColumn: [
                        'Coral reef destruction',
                        'Habitat changes',
                        'Coastal flooding',
                        'More frequent storms',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the sustainability principles',
                  questionData: {
                    pairs: {
                      leftColumn: ['Reduce', 'Reuse', 'Recycle', 'Renew'],
                      rightColumn: [
                        'Use renewable resources',
                        'Process materials for new use',
                        'Minimize waste',
                        'Use items multiple times',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the pollution types',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Air pollution',
                        'Water pollution',
                        'Land pollution',
                        'Noise pollution',
                      ],
                      rightColumn: [
                        'Contaminated soil',
                        'Harmful sound levels',
                        'Polluted water',
                        'Polluted air',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 0,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the environmental concepts',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Ecosystem',
                        'Food chain',
                        'Carbon footprint',
                        'Ecological footprint',
                      ],
                      rightColumn: [
                        'Environmental impact measure',
                        'Interconnected organisms',
                        'Energy flow network',
                        'Human impact on resources',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the advanced environmental concepts',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Anthropocene',
                        'Holocene',
                        'Permaculture',
                        'Biomimicry',
                      ],
                      rightColumn: [
                        'Current geological epoch',
                        'Sustainable design',
                        'Nature-inspired innovation',
                        'Previous geological epoch',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 3,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the environmental assessment methods',
                  questionData: {
                    pairs: {
                      leftColumn: ['EIA', 'LCA', 'SEA', 'CBA'],
                      rightColumn: [
                        'Cost-benefit analysis',
                        'Life cycle assessment',
                        'Strategic environmental assessment',
                        'Environmental impact assessment',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Trees help reduce carbon dioxide in the atmosphere.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Plastic pollution harms marine life in oceans.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Renewable energy comes from natural sources.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Climate change affects weather patterns globally.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Sustainable development balances economic growth with environmental protection.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Biodiversity loss threatens ecosystem stability and human well-being.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Carbon emissions from human activities contribute to global warming.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Environmental conservation protects natural habitats and wildlife.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Anthropogenic climate change results from human-induced alterations to natural systems.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    "Ecological resilience determines an ecosystem's capacity to withstand disturbances.",
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to describe pollution',
                  questionData: {
                    options: [
                      'pollution',
                      'is',
                      'contamination',
                      'of',
                      'environment',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for environmental protection',
                  questionData: {
                    options: [
                      'protection',
                      'environmental',
                      'involves',
                      'conserving',
                      'natural',
                      'resources',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for climate change',
                  questionData: {
                    options: [
                      'change',
                      'climate',
                      'refers',
                      'to',
                      'long-term',
                      'weather',
                      'patterns',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 5, 4, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for sustainable development',
                  questionData: {
                    options: [
                      'development',
                      'sustainable',
                      'meets',
                      'needs',
                      'without',
                      'compromising',
                      'future',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Arrange the words for biodiversity conservation',
                  questionData: {
                    options: [
                      'conservation',
                      'biodiversity',
                      'protects',
                      'species',
                      'and',
                      'ecosystems',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for renewable energy',
                  questionData: {
                    options: [
                      'energy',
                      'renewable',
                      'comes',
                      'from',
                      'natural',
                      'sources',
                      'that',
                      'replenish',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 5, 4, 6, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for environmental impact',
                  questionData: {
                    options: [
                      'impact',
                      'environmental',
                      'measures',
                      'human',
                      'effect',
                      'on',
                      'nature',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 3, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for global warming',
                  questionData: {
                    options: [
                      'warming',
                      'global',
                      'increase',
                      'in',
                      "Earth's",
                      'temperature',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 5, 4, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for ecological sustainability',
                  questionData: {
                    options: [
                      'sustainability',
                      'ecological',
                      'ensures',
                      'balance',
                      'between',
                      'human',
                      'needs',
                      'and',
                      'environmental',
                      'limits',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 3, 5, 6, 7, 8, 9, 10],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for environmental policy',
                  questionData: {
                    options: [
                      'policy',
                      'environmental',
                      'guides',
                      'government',
                      'actions',
                      'to',
                      'protect',
                      'natural',
                      'resources',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 3, 5, 6, 7, 8, 9],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing the importance of recycling in your community.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe three ways you can reduce energy consumption in your daily life.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about why trees are important for the environment.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how transportation choices affect air pollution.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the causes and effects of climate change and what individuals can do to help.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the role of governments in environmental protection and conservation.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe the impact of plastic pollution on marine ecosystems.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the benefits of renewable energy sources compared to fossil fuels.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze the concept of sustainable development and its challenges in implementation.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss the ethical considerations of environmental policies and their impact on different populations.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Conditional Sentences',
              description: 'First and second conditional structures',
              order: 4,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which conditional is used for real future possibilities?',
                  questionData: {
                    options: [
                      'Zero conditional',
                      'First conditional',
                      'Second conditional',
                      'Third conditional',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Choose the correct first conditional: 'If it _____, I will stay home.'",
                  questionData: {
                    options: ['rains', 'rained', 'will rain', 'has rained'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which conditional talks about hypothetical situations?',
                  questionData: {
                    options: [
                      'First conditional',
                      'Second conditional',
                      'Third conditional',
                      'Mixed conditional',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    "Complete: 'If I _____ rich, I would buy a big house.'",
                  questionData: {
                    options: ['am', 'was', 'were', 'will be'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which structure is correct for third conditional?',
                  questionData: {
                    options: [
                      'If + present + will + infinitive',
                      'If + past simple + would + infinitive',
                      'If + past perfect + would have + past participle',
                      'If + present perfect + will have + past participle',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'What is the zero conditional structure?',
                  questionData: {
                    options: [
                      'If + present + present',
                      'If + past + would',
                      'If + present + will',
                      'If + past perfect + would have',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which sentence is a mixed conditional?',
                  questionData: {
                    options: [
                      'If I study, I will pass.',
                      'If I had studied, I would pass.',
                      'If I had studied, I would have passed.',
                      'If I studied, I would have passed.',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Choose the correct second conditional: 'If I _____ you, I would apologize.'",
                  questionData: {
                    options: ['am', 'was', 'were', 'will be'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which conditional type expresses regret about past actions?',
                  questionData: {
                    options: [
                      'First conditional',
                      'Second conditional',
                      'Third conditional',
                      'Mixed conditional',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'What is the structure of a conditional sentence?',
                  questionData: {
                    options: [
                      'Main clause + if clause',
                      'If clause + main clause',
                      'Either order is possible',
                      'Only main clause',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'First conditional is used for real future situations.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "Second conditional uses 'would' in the main clause.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Third conditional talks about past possibilities.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Zero conditional uses past tense in both clauses.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Mixed conditionals combine different time references.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Unless can replace 'if not' in conditional sentences.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Conditional sentences always need the word 'if'.",
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText: "Inverted conditionals can omit 'if'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Hypothetical conditionals can express varying degrees of probability.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    "Conditional clauses can use modal verbs like 'could' or 'might'.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What tense is used in the if-clause of first conditional?',
                  questionData: {
                    correctAnswers: ['Present simple'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What modal verb is used in second conditional?',
                  questionData: {
                    correctAnswers: ['Would'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What is the structure of third conditional?',
                  questionData: {
                    correctAnswers: [
                      'If + past perfect + would have + past participle',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What does zero conditional express?',
                  questionData: {
                    correctAnswers: ['General truths', 'Facts'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Complete: 'If I had known, I _____ differently.'",
                  questionData: {
                    correctAnswers: ['would have acted'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "What is another word for 'if' in conditionals?",
                  questionData: {
                    correctAnswers: ['Unless', 'Provided that'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "What type of conditional uses 'could' or 'might'?",
                  questionData: {
                    correctAnswers: [
                      'Second conditional',
                      'Hypothetical conditional',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    "Complete: '_____ I rich, I would travel the world.'",
                  questionData: {
                    correctAnswers: ['If I were'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What is the term for conditionals that mix time references?',
                  questionData: {
                    correctAnswers: [
                      'Mixed conditionals',
                      'Hybrid conditionals',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    "What grammatical structure allows conditionals without 'if'?",
                  questionData: {
                    correctAnswers: ['Inversion', 'Subject-verb inversion'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the conditional types with their uses',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'First conditional',
                        'Second conditional',
                        'Third conditional',
                        'Zero conditional',
                      ],
                      rightColumn: [
                        'Hypothetical situations',
                        'General truths',
                        'Past regrets',
                        'Future possibilities',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 0,
                      2: 2,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the conditional structures',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'If + present + will',
                        'If + past + would',
                        'If + past perfect + would have',
                        'If + present + present',
                      ],
                      rightColumn: [
                        'Third conditional',
                        'First conditional',
                        'Zero conditional',
                        'Second conditional',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 0,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the time references',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Real future',
                        'Hypothetical present/future',
                        'Hypothetical past',
                        'General truth',
                      ],
                      rightColumn: [
                        'Zero conditional',
                        'First conditional',
                        'Third conditional',
                        'Second conditional',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the modal verbs with conditionals',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Will',
                        'Would',
                        'Would have',
                        'Present simple',
                      ],
                      rightColumn: [
                        'Zero conditional',
                        'First conditional',
                        'Second conditional',
                        'Third conditional',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 2,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the conditional alternatives',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Unless',
                        'Provided that',
                        'As long as',
                        'In case',
                      ],
                      rightColumn: [
                        'If not',
                        'On condition that',
                        'Only if',
                        'In the event that',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the mixed conditional types',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Past condition + present result',
                        'Present condition + past result',
                        'Future condition + present result',
                        'Present condition + future result',
                      ],
                      rightColumn: [
                        'Second + third',
                        'Third + second',
                        'First + second',
                        'First + third',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the inverted conditionals',
                  questionData: {
                    pairs: {
                      leftColumn: ['Were I', 'Had I', 'Should I', 'Could I'],
                      rightColumn: [
                        'Present possibility',
                        'Past possibility',
                        'Future possibility',
                        'Ability',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the conditional meanings',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'If I were you',
                        'If I had known',
                        'If it rains',
                        'If water boils',
                      ],
                      rightColumn: [
                        'Advice',
                        'Regret',
                        'Possibility',
                        'Scientific fact',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the advanced conditional structures',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'But for',
                        'Were it not for',
                        'Only if',
                        'Even if',
                      ],
                      rightColumn: [
                        'Hypothetical situation',
                        'Exception',
                        'Necessity',
                        'Concession',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the conditional nuances',
                  questionData: {
                    pairs: {
                      leftColumn: ['If only', 'What if', 'Suppose', 'Imagine'],
                      rightColumn: [
                        'Wish',
                        'Hypothesis',
                        'Speculation',
                        'Imagination',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 2,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'If it rains, I will stay at home.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'If I were rich, I would buy a yacht.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'If I had studied, I would have passed the exam.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'If water reaches 100°C, it boils.',
                  questionData: {
                    correctAnswers: [2],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'If I had known about the meeting, I would have attended.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'If she were here, she would help us with the project.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'If you heat ice, it melts.',
                  questionData: {
                    correctAnswers: [3],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'If I had saved money, I could have bought a car.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'If I had been born in a different country, my life would have been completely different.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'If she had taken the job offer, she might have been living in New York now.',
                  questionData: {
                    correctAnswers: [1],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for first conditional',
                  questionData: {
                    options: [
                      'rains',
                      'if',
                      'it',
                      'will',
                      'I',
                      'home',
                      'stay',
                      '.',
                    ],
                    correctAnswers: [2, 1, 0, 4, 3, 6, 5, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for second conditional',
                  questionData: {
                    options: [
                      'rich',
                      'if',
                      'I',
                      'were',
                      'would',
                      'buy',
                      'house',
                      'a',
                      '.',
                    ],
                    correctAnswers: [2, 1, 3, 0, 4, 5, 7, 6, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for third conditional',
                  questionData: {
                    options: [
                      'studied',
                      'if',
                      'I',
                      'had',
                      'would',
                      'have',
                      'passed',
                      'exam',
                      'the',
                      '.',
                    ],
                    correctAnswers: [2, 1, 3, 0, 4, 5, 6, 8, 7, 9],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for zero conditional',
                  questionData: {
                    options: [
                      'boils',
                      'if',
                      'water',
                      'reaches',
                      '100°C',
                      'it',
                      '.',
                    ],
                    correctAnswers: [2, 1, 3, 4, 5, 0, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for mixed conditional',
                  questionData: {
                    options: [
                      'known',
                      'had',
                      'I',
                      'if',
                      'would',
                      'be',
                      'here',
                      'now',
                      'I',
                      '.',
                    ],
                    correctAnswers: [2, 1, 3, 0, 4, 8, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for inverted conditional',
                  questionData: {
                    options: [
                      'I',
                      'were',
                      'you',
                      'if',
                      'would',
                      'do',
                      'same',
                      'the',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 4, 5, 7, 6, 3],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for conditional with modal',
                  questionData: {
                    options: [
                      'help',
                      'could',
                      'you',
                      'if',
                      'I',
                      'needed',
                      'would',
                      '.',
                    ],
                    correctAnswers: [3, 1, 0, 4, 2, 6, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for complex conditional',
                  questionData: {
                    options: [
                      'unless',
                      'help',
                      'you',
                      'need',
                      'if',
                      'you',
                      'ask',
                      'me',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 6, 5, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for hypothetical situation',
                  questionData: {
                    options: [
                      'only',
                      'if',
                      'had',
                      'known',
                      'I',
                      'would',
                      'have',
                      'acted',
                      'differently',
                      '.',
                    ],
                    correctAnswers: [0, 1, 3, 2, 4, 5, 6, 7, 8, 9],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for speculative conditional',
                  questionData: {
                    options: [
                      'suppose',
                      'win',
                      'lottery',
                      'the',
                      'I',
                      'would',
                      'travel',
                      'world',
                      'the',
                      '.',
                    ],
                    correctAnswers: [0, 3, 2, 4, 1, 5, 6, 8, 7, 9],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) about what you would do if you won the lottery.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe what you will do if the weather is nice this weekend.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a decision you would make differently if you could go back in time.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how your life would be different if you lived in another country.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the importance of conditional thinking in decision making and problem solving.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about how different conditional structures express varying degrees of probability.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe the role of conditionals in expressing regrets and hypothetical situations.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about how conditionals help us imagine alternative realities and possibilities.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze the differences between real and hypothetical conditionals and their psychological impact.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss how conditional structures reflect cultural attitudes toward fate, possibility, and control.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Entertainment and Media',
              description: 'Movies, music, and popular culture',
              order: 5,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which type of movie is based on real events?',
                  questionData: {
                    options: [
                      'Comedy',
                      'Animation',
                      'Documentary',
                      'Science fiction',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do we call a person who acts in movies?',
                  questionData: {
                    options: ['Director', 'Producer', 'Actor', 'Screenwriter'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which music genre originated in Jamaica?',
                  questionData: {
                    options: ['Jazz', 'Reggae', 'Classical', 'Country'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What is the term for a TV series with continuing episodes?',
                  questionData: {
                    options: ['Movie', 'Documentary', 'Sitcom', 'Series'],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which film genre typically involves supernatural elements?',
                  questionData: {
                    options: ['Horror', 'Romance', 'Western', 'Drama'],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: "What does 'box office' refer to in cinema?",
                  questionData: {
                    options: [
                      'The place where tickets are sold',
                      'The total money earned by a film',
                      'The location where films are made',
                      'The area where actors wait',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which music streaming platform was founded by Daniel Ek?',
                  questionData: {
                    options: [
                      'Apple Music',
                      'Spotify',
                      'Tidal',
                      'YouTube Music',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for a movie that combines animation and live action?',
                  questionData: {
                    options: [
                      'Hybrid film',
                      'Mixed media',
                      'Live animation',
                      'Animation hybrid',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which film technique uses a series of still images to create motion?',
                  questionData: {
                    options: [
                      'Stop motion',
                      'Time-lapse',
                      'Slow motion',
                      'Fast motion',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText: 'What is the name for the Academy Awards?',
                  questionData: {
                    options: [
                      'Golden Globes',
                      'Oscars',
                      'Emmys',
                      'Grammy Awards',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Hollywood is located in California.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Netflix is a streaming service for movies and TV shows.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Jazz music originated in New Orleans.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Animation films use only computer-generated images.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Bollywood produces more films annually than Hollywood.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'The Grammy Awards recognize achievements in music.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Special effects in films are always created digitally.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Pop music is characterized by complex musical structures.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    "The term 'blockbuster' originated from films that were financial successes.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Film noir is characterized by high-key lighting and happy endings.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do we call a person who directs movies?',
                  questionData: {
                    correctAnswers: ['Director'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the most popular music streaming service?',
                  questionData: {
                    correctAnswers: ['Spotify'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What genre of music originated in the African American communities?',
                  questionData: {
                    correctAnswers: ['Blues', 'Jazz'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do we call a short, funny TV show?',
                  questionData: {
                    correctAnswers: ['Sitcom'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for the music that plays during the opening credits?',
                  questionData: {
                    correctAnswers: ['Opening theme', 'Theme song'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What do we call a film that is part of a series?',
                  questionData: {
                    correctAnswers: ['Sequel', 'Franchise film'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the name for a musician who plays multiple instruments?',
                  questionData: {
                    correctAnswers: ['Multi-instrumentalist'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What do we call the person who writes the dialogue for films?',
                  questionData: {
                    correctAnswers: ['Screenwriter'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What is the term for a film production technique using practical effects?',
                  questionData: {
                    correctAnswers: ['In-camera effects', 'Practical effects'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What do we call the process of selecting and arranging music for a film?',
                  questionData: {
                    correctAnswers: ['Music supervision', 'Film scoring'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the film genres with their descriptions',
                  questionData: {
                    pairs: {
                      leftColumn: ['Comedy', 'Horror', 'Action', 'Romance'],
                      rightColumn: [
                        'Love stories',
                        'Scary movies',
                        'Funny films',
                        'Exciting adventures',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the music genres with their origins',
                  questionData: {
                    pairs: {
                      leftColumn: ['Jazz', 'Reggae', 'Classical', 'Hip hop'],
                      rightColumn: [
                        'Orchestral music',
                        'Jamaican music',
                        'African American music',
                        'Urban music from 1970s',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the entertainment roles',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Actor',
                        'Director',
                        'Producer',
                        'Screenwriter',
                      ],
                      rightColumn: [
                        'Manages production',
                        'Performs in films',
                        'Writes scripts',
                        'Oversees filming',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 0,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the TV formats',
                  questionData: {
                    pairs: {
                      leftColumn: ['News', 'Sitcom', 'Drama', 'Reality show'],
                      rightColumn: [
                        'Scripted fiction',
                        'Unscripted real events',
                        'Situation comedy',
                        'Current events reporting',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 0,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the film techniques',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'CGI',
                        'Stop motion',
                        'Green screen',
                        'Motion capture',
                      ],
                      rightColumn: [
                        'Actor movement recording',
                        'Computer generated imagery',
                        'Background replacement',
                        'Frame-by-frame animation',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the music production terms',
                  questionData: {
                    pairs: {
                      leftColumn: ['Studio', 'Mixing', 'Mastering', 'Sampling'],
                      rightColumn: [
                        'Final audio polishing',
                        'Recording space',
                        'Using existing sounds',
                        'Balancing audio levels',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 0,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the entertainment industry terms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Casting',
                        'Location scouting',
                        'Post-production',
                        'Distribution',
                      ],
                      rightColumn: [
                        'Releasing the film',
                        'Editing and effects',
                        'Finding filming locations',
                        'Selecting actors',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the streaming platforms',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Netflix',
                        'Disney+',
                        'Hulu',
                        'Amazon Prime',
                      ],
                      rightColumn: [
                        'Amazon-owned',
                        'Disney content',
                        'General streaming',
                        'Fox content',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the advanced film concepts',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Auteur theory',
                        'Mise en scène',
                        'Montage',
                        'Diegesis',
                      ],
                      rightColumn: [
                        'Film world elements',
                        'Director as author',
                        'Editing technique',
                        'Visual composition',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the music theory concepts',
                  questionData: {
                    pairs: {
                      leftColumn: ['Harmony', 'Rhythm', 'Melody', 'Timbre'],
                      rightColumn: [
                        'Sound quality',
                        'Note sequence',
                        'Beat pattern',
                        'Chord relationships',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Movies are shown in cinemas and theaters.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Music can evoke different emotions in listeners.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Television shows entertain millions of viewers.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Popular culture influences fashion and trends.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Streaming services have revolutionized media consumption.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Digital effects enhance visual storytelling in films.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Cultural globalization spreads entertainment worldwide.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Social media platforms influence public opinion.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Virtual reality technology immerses users in artificial environments.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Algorithmic recommendation systems personalize content delivery.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words to describe a movie',
                  questionData: {
                    options: [
                      'movie',
                      'a',
                      'is',
                      'story',
                      'told',
                      'through',
                      'moving',
                      'images',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for music appreciation',
                  questionData: {
                    options: [
                      'music',
                      'can',
                      'evoke',
                      'emotions',
                      'and',
                      'memories',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words for television entertainment',
                  questionData: {
                    options: [
                      'television',
                      'provides',
                      'entertainment',
                      'and',
                      'information',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for cultural influence',
                  questionData: {
                    options: [
                      'culture',
                      'popular',
                      'shapes',
                      'social',
                      'norms',
                      'and',
                      'values',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for film production',
                  questionData: {
                    options: [
                      'production',
                      'film',
                      'involves',
                      'scripting',
                      'filming',
                      'and',
                      'editing',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for music composition',
                  questionData: {
                    options: [
                      'composition',
                      'music',
                      'requires',
                      'creativity',
                      'and',
                      'technical',
                      'skill',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for media influence',
                  questionData: {
                    options: [
                      'media',
                      'can',
                      'influence',
                      'public',
                      'opinion',
                      'and',
                      'behavior',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for entertainment industry',
                  questionData: {
                    options: [
                      'industry',
                      'entertainment',
                      'employs',
                      'millions',
                      'worldwide',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for technological disruption',
                  questionData: {
                    options: [
                      'disruption',
                      'technological',
                      'transforms',
                      'traditional',
                      'media',
                      'consumption',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 3, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for cultural globalization',
                  questionData: {
                    options: [
                      'globalization',
                      'cultural',
                      'spreads',
                      'entertainment',
                      'across',
                      'borders',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing your favorite movie and why you like it.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your favorite type of music and explain what makes it appealing to you.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about a TV show that influenced popular culture.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how social media has changed celebrity culture.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the impact of streaming services on traditional television.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about how music reflects cultural identity and social issues.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe the role of special effects in modern filmmaking.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the influence of Hollywood on global cinema.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze how digital technology has transformed the music industry and artist-fan relationships.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss the ethical implications of artificial intelligence in content creation and media.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Expressing Opinions',
              description: 'Agreement, disagreement, and debate',
              order: 6,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which phrase shows strong agreement?',
                  questionData: {
                    options: [
                      'I disagree completely',
                      "I couldn't agree more",
                      "I'm not sure about that",
                      "That's debatable",
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What do we use to express a personal opinion?',
                  questionData: {
                    options: [
                      'In my view',
                      'According to the news',
                      'The research shows',
                      'Everyone knows',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'Which phrase shows polite disagreement?',
                  questionData: {
                    options: [
                      "You're absolutely wrong",
                      'I see your point, but',
                      "That's completely ridiculous",
                      'I refuse to accept that',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText: 'What modal verb expresses possibility?',
                  questionData: {
                    options: ['Must', 'Should', 'Might', 'Will'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which phrase is used for giving advice?',
                  questionData: {
                    options: [
                      'In my opinion',
                      'I suggest that',
                      'I think so',
                      'It seems to me',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What structure is used for hypothetical opinions?',
                  questionData: {
                    options: [
                      'I think + present',
                      'I would say + past',
                      'In my view + future',
                      'According to me + conditional',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'Which modal expresses obligation in opinions?',
                  questionData: {
                    options: ['Can', 'May', 'Should', 'Might'],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText: 'What phrase introduces a counter-argument?',
                  questionData: {
                    options: [
                      'I agree with you',
                      'On the other hand',
                      'In my experience',
                      'As I see it',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which advanced structure shows concession in debate?',
                  questionData: {
                    options: [
                      'Although I agree',
                      'While I understand',
                      'Even though I think',
                      'Despite the fact that',
                    ],
                    correctAnswers: [3],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'What rhetorical device uses questions to make a point?',
                  questionData: {
                    options: [
                      'Metaphor',
                      'Rhetorical question',
                      'Analogy',
                      'Personification',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "We use 'I think' to express personal opinions.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    "Modal verbs like 'should' express strong obligation.",
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Rhetorical questions expect answers.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Concession phrases show partial agreement.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Inverted conditionals can be used in formal debate.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Epistemic modality expresses possibility and certainty.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Deontic modality concerns permission and obligation.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText: 'Hedging language makes opinions less direct.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Pragmatic markers influence conversational flow in debates.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Discourse markers structure argumentative coherence.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: "What phrase means 'I completely agree'?",
                  questionData: {
                    correctAnswers: [
                      "I couldn't agree more",
                      'I totally agree',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What do we use to express uncertainty?',
                  questionData: {
                    correctAnswers: ['Maybe', 'Perhaps', "I'm not sure"],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What phrase shows partial agreement?',
                  questionData: {
                    correctAnswers: ['I see your point', 'You have a point'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText: 'What modal expresses strong possibility?',
                  questionData: {
                    correctAnswers: ['Must'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: 'What phrase introduces a contrasting view?',
                  questionData: {
                    correctAnswers: ['On the other hand', 'However'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What do we call language that makes opinions less direct?',
                  questionData: {
                    correctAnswers: ['Hedging', 'Tentative language'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: 'What modal expresses past possibility?',
                  questionData: {
                    correctAnswers: ['Could have', 'Might have'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText: "What phrase means 'from my perspective'?",
                  questionData: {
                    correctAnswers: ['In my view', 'From my point of view'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What is the term for words that connect ideas in arguments?',
                  questionData: {
                    correctAnswers: ['Discourse markers', 'Linking words'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What rhetorical strategy uses three-part structure?',
                  questionData: {
                    correctAnswers: ['Rule of three', 'Tricolon'],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the opinion phrases with their meanings',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'In my opinion',
                        'I believe',
                        'I think',
                        'From my perspective',
                      ],
                      rightColumn: [
                        'Personal view',
                        'Personal belief',
                        'Personal thought',
                        'Personal viewpoint',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the agreement expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'I agree',
                        'Exactly',
                        "You're right",
                        "That's true",
                      ],
                      rightColumn: [
                        'Strong agreement',
                        'Mild agreement',
                        'Confirmation',
                        'Partial agreement',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the modal verbs with their functions',
                  questionData: {
                    pairs: {
                      leftColumn: ['Can', 'Should', 'Must', 'Might'],
                      rightColumn: [
                        'Possibility',
                        'Obligation',
                        'Ability',
                        'Advice',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 3,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the disagreement phrases',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'I disagree',
                        "I don't think so",
                        "That's not right",
                        'I beg to differ',
                      ],
                      rightColumn: [
                        'Polite disagreement',
                        'Strong disagreement',
                        'Mild disagreement',
                        'Formal disagreement',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 2,
                      2: 1,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the hedging expressions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Sort of',
                        'Kind of',
                        'Somewhat',
                        'To some extent',
                      ],
                      rightColumn: [
                        'Partial agreement',
                        'Tentative opinion',
                        'Qualified statement',
                        'Limited agreement',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 1,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the argumentative markers',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Firstly',
                        'Moreover',
                        'However',
                        'Therefore',
                      ],
                      rightColumn: [
                        'Conclusion',
                        'Contrast',
                        'Addition',
                        'Sequence',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 2,
                      2: 1,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the concession phrases',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Although',
                        'Even though',
                        'Despite',
                        'While',
                      ],
                      rightColumn: [
                        'Contrast',
                        'Concession',
                        'Contrast',
                        'Concession',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 1,
                      2: 0,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the epistemic modals',
                  questionData: {
                    pairs: {
                      leftColumn: ['Must', 'Should', 'Could', 'May'],
                      rightColumn: [
                        'Possibility',
                        'Necessity',
                        'Weak possibility',
                        'Strong probability',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the rhetorical devices',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Alliteration',
                        'Anaphora',
                        'Antithesis',
                        'Chiasmus',
                      ],
                      rightColumn: [
                        'Repetition of sounds',
                        'Parallel structure',
                        'Contrasting ideas',
                        'Reversed parallel structure',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the argumentative fallacies',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Ad hominem',
                        'Straw man',
                        'False dilemma',
                        'Appeal to authority',
                      ],
                      rightColumn: [
                        'Attacking the person',
                        'Misrepresenting argument',
                        'Limited options',
                        'Expert opinion',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'I think social media is beneficial for communication.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'In my view, education should be free for everyone.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'People should recycle to protect the environment.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText: 'Technology has changed the way we live.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Governments must address climate change immediately.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Citizens should participate in democratic processes.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText: 'Companies might consider remote work options.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Students could benefit from more practical experience.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Policymakers ought to prioritize sustainable development.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Researchers should investigate alternative energy sources.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for expressing agreement',
                  questionData: {
                    options: ['I', 'completely', 'agree', 'with', 'you', '.'],
                    correctAnswers: [0, 1, 2, 3, 4, 5],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for giving an opinion',
                  questionData: {
                    options: [
                      'my',
                      'in',
                      'view',
                      'education',
                      'is',
                      'important',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 4, 5, 3, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for polite disagreement',
                  questionData: {
                    options: [
                      'point',
                      'your',
                      'I',
                      'see',
                      'but',
                      'disagree',
                      '.',
                    ],
                    correctAnswers: [3, 1, 0, 4, 5, 2, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for making a suggestion',
                  questionData: {
                    options: [
                      'suggest',
                      'I',
                      'that',
                      'we',
                      'consider',
                      'alternatives',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for hypothetical opinion',
                  questionData: {
                    options: [
                      'were',
                      'I',
                      'you',
                      'if',
                      'would',
                      'do',
                      'differently',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for concession',
                  questionData: {
                    options: [
                      'although',
                      'I',
                      'understand',
                      'your',
                      'point',
                      'disagree',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for probability expression',
                  questionData: {
                    options: [
                      'might',
                      'it',
                      'be',
                      'possible',
                      'that',
                      'we',
                      'consider',
                      '.',
                    ],
                    correctAnswers: [3, 0, 2, 4, 5, 6, 1],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for recommendation',
                  questionData: {
                    options: [
                      'recommend',
                      'I',
                      'that',
                      'students',
                      'study',
                      'abroad',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for complex argumentative structure',
                  questionData: {
                    options: [
                      'whereas',
                      'some',
                      'argue',
                      'that',
                      'technology',
                      'improves',
                      'life',
                      'others',
                      'contend',
                      'it',
                      'isolates',
                      'people',
                      '.',
                    ],
                    correctAnswers: [1, 2, 3, 4, 5, 6, 0, 7, 8, 9, 10, 11, 12],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for epistemic modality',
                  questionData: {
                    options: [
                      'must',
                      'it',
                      'be',
                      'that',
                      'the',
                      'evidence',
                      'supports',
                      'conclusion',
                      'this',
                      '.',
                    ],
                    correctAnswers: [4, 0, 2, 3, 5, 6, 7, 8, 9],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) expressing your opinion about social media.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your views on online learning versus traditional education.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about whether you think homework is beneficial for students.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe your opinion about the importance of recycling.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the advantages and disadvantages of remote work.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the role of government in environmental protection.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe how social media influences public opinion.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the importance of critical thinking in modern society.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze the impact of artificial intelligence on employment and society.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss the ethical implications of genetic engineering and biotechnology.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
            {
              id: crypto.randomUUID(),
              name: 'Social Issues',
              description: 'Community, society, and current events',
              order: 7,
              questions: [
                // MULTIPLE_CHOICE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What is the term for unfair treatment based on race or gender?',
                  questionData: {
                    options: [
                      'Equality',
                      'Discrimination',
                      'Tolerance',
                      'Integration',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which issue affects people who cannot afford basic needs?',
                  questionData: {
                    options: [
                      'Homelessness',
                      'Climate change',
                      'Education',
                      'Healthcare',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'What do we call the gap between rich and poor?',
                  questionData: {
                    options: [
                      'Social mobility',
                      'Income inequality',
                      'Economic growth',
                      'Wealth distribution',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'EASY',
                  questionText:
                    'Which organization works on global health issues?',
                  questionData: {
                    options: ['UNESCO', 'WHO', 'UNICEF', 'Red Cross'],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for the movement of people from rural to urban areas?',
                  questionData: {
                    options: [
                      'Migration',
                      'Urbanization',
                      'Gentrification',
                      'Suburbanization',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which concept refers to fair treatment for all people regardless of background?',
                  questionData: {
                    options: [
                      'Social justice',
                      'Economic equality',
                      'Political freedom',
                      'Cultural diversity',
                    ],
                    correctAnswers: [0],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the main cause of food insecurity worldwide?',
                  questionData: {
                    options: [
                      'Climate change',
                      'Population growth',
                      'Poverty and inequality',
                      'War and conflict',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Which social issue involves the abuse of human rights?',
                  questionData: {
                    options: [
                      'Gender equality',
                      'Human trafficking',
                      'Digital divide',
                      'Mental health',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'What sociological theory explains social change through conflict between classes?',
                  questionData: {
                    options: [
                      'Functionalism',
                      'Symbolic interactionism',
                      'Conflict theory',
                      'Social constructionism',
                    ],
                    correctAnswers: [2],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MULTIPLE_CHOICE',
                  difficulty: 'HARD',
                  questionText:
                    'Which concept describes the interconnectedness of global social issues?',
                  questionData: {
                    options: [
                      'Globalization',
                      'Interdependence',
                      'Cultural relativism',
                      'Social stratification',
                    ],
                    correctAnswers: [1],
                    multipleChoiceType: 'SINGLE_ANSWER',
                  } satisfies MultipleChoiceQuestionData,
                },

                // TRUE_FALSE questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Poverty is a social issue that affects millions worldwide.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Gender equality means equal rights for all genders.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText:
                    'Racism is a form of discrimination based on race.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'EASY',
                  questionText: 'Social media has no impact on social issues.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Sustainable development addresses environmental, social, and economic issues.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Cultural diversity strengthens communities and promotes understanding.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Mental health issues are considered social problems in modern society.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Social mobility refers to movement between social classes.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Intersectionality examines how multiple forms of discrimination interact.',
                  questionData: {
                    correctAnswers: ['true'],
                  } satisfies TrueFalseQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'TRUE_FALSE',
                  difficulty: 'HARD',
                  questionText:
                    'Structural inequality refers to individual prejudices rather than systemic issues.',
                  questionData: {
                    correctAnswers: ['false'],
                  } satisfies TrueFalseQuestionData,
                },

                // SHORT_ANSWER questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What do we call the lack of access to basic needs like food and shelter?',
                  questionData: {
                    correctAnswers: ['Poverty'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the term for treating people unfairly because of their race?',
                  questionData: {
                    correctAnswers: ['Racism'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What do we call equal rights and opportunities for all people?',
                  questionData: {
                    correctAnswers: ['Equality'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'EASY',
                  questionText:
                    'What is the name for people who are forced to leave their homes?',
                  questionData: {
                    correctAnswers: ['Refugees', 'Displaced persons'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for the fair distribution of resources in society?',
                  questionData: {
                    correctAnswers: ['Social justice'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What do we call the process of people moving to cities?',
                  questionData: {
                    correctAnswers: ['Urbanization'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What is the term for different cultures living together harmoniously?',
                  questionData: {
                    correctAnswers: ['Multiculturalism'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'MEDIUM',
                  questionText:
                    'What do we call the illegal trade of people for exploitation?',
                  questionData: {
                    correctAnswers: ['Human trafficking'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What sociological concept explains how society maintains order through shared values?',
                  questionData: {
                    correctAnswers: ['Social cohesion', 'Functionalism'],
                  } satisfies ShortAnswerQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'SHORT_ANSWER',
                  difficulty: 'HARD',
                  questionText:
                    'What is the term for the systematic disadvantage of certain groups in society?',
                  questionData: {
                    correctAnswers: [
                      'Structural inequality',
                      'Systemic discrimination',
                    ],
                  } satisfies ShortAnswerQuestionData,
                },

                // MATCHING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText:
                    'Match the social issues with their descriptions',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Poverty',
                        'Racism',
                        'Gender inequality',
                        'Homelessness',
                      ],
                      rightColumn: [
                        'Unfair treatment based on race',
                        'Lack of equal rights for genders',
                        'Lack of housing',
                        'Inability to meet basic needs',
                      ],
                    },
                    correctAnswers: {
                      0: 3,
                      1: 0,
                      2: 1,
                      3: 2,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the social movements',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Civil rights',
                        "Women's rights",
                        'Environmental',
                        'LGBTQ+ rights',
                      ],
                      rightColumn: [
                        'Gender equality',
                        'Sexual orientation equality',
                        'Racial equality',
                        'Environmental protection',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the international organizations',
                  questionData: {
                    pairs: {
                      leftColumn: ['UNICEF', 'WHO', 'UNESCO', 'UNHCR'],
                      rightColumn: [
                        'Health',
                        'Refugees',
                        'Children',
                        'Education and culture',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 0,
                      2: 3,
                      3: 1,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'EASY',
                  questionText: 'Match the social problems',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Drug abuse',
                        'Domestic violence',
                        'Child labor',
                        'Elder abuse',
                      ],
                      rightColumn: [
                        'Harm to elderly',
                        'Substance addiction',
                        'Exploitation of children',
                        'Violence in homes',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the sociological concepts',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Social stratification',
                        'Social mobility',
                        'Cultural assimilation',
                        'Social capital',
                      ],
                      rightColumn: [
                        'Movement between classes',
                        'Division into classes',
                        'Adopting majority culture',
                        'Social networks and relationships',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 0,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the global issues',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Climate change',
                        'Migration',
                        'Pandemics',
                        'Food security',
                      ],
                      rightColumn: [
                        'Disease outbreaks',
                        'Population movement',
                        'Environmental changes',
                        'Access to food',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 0,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the human rights issues',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Child labor',
                        'Human trafficking',
                        'Forced marriage',
                        'Genital mutilation',
                      ],
                      rightColumn: [
                        'Exploitation of children',
                        'Illegal trade of people',
                        'Non-consensual marriage',
                        'Harmful traditional practice',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'MEDIUM',
                  questionText: 'Match the social welfare systems',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Universal healthcare',
                        'Social security',
                        'Unemployment benefits',
                        'Food stamps',
                      ],
                      rightColumn: [
                        'Government food assistance',
                        'Retirement and disability',
                        'Medical care for all',
                        'Financial aid for jobless',
                      ],
                    },
                    correctAnswers: {
                      0: 2,
                      1: 1,
                      2: 3,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the advanced sociological theories',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Functionalism',
                        'Conflict theory',
                        'Symbolic interactionism',
                        'Feminist theory',
                      ],
                      rightColumn: [
                        'Society as interconnected parts',
                        'Power struggles between groups',
                        'Meaning through social interaction',
                        'Gender-based power structures',
                      ],
                    },
                    correctAnswers: {
                      0: 0,
                      1: 1,
                      2: 2,
                      3: 3,
                    },
                  } satisfies MatchingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'MATCHING',
                  difficulty: 'HARD',
                  questionText: 'Match the social research methods',
                  questionData: {
                    pairs: {
                      leftColumn: [
                        'Ethnography',
                        'Survey research',
                        'Content analysis',
                        'Case study',
                      ],
                      rightColumn: [
                        'In-depth study of single case',
                        'Cultural observation',
                        'Media content examination',
                        'Questionnaire-based research',
                      ],
                    },
                    correctAnswers: {
                      0: 1,
                      1: 3,
                      2: 2,
                      3: 0,
                    },
                  } satisfies MatchingQuestionData,
                },

                // FILL_IN_BLANK questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Discrimination based on gender is called sexism.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Social justice promotes fairness and equality in society.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Poverty affects access to education and healthcare.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'EASY',
                  questionText:
                    'Cultural diversity enriches communities and promotes understanding.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Income inequality creates divisions between social classes.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Human rights protect fundamental freedoms and dignity.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Social mobility allows people to improve their economic status.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Community development strengthens local neighborhoods and services.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Structural inequality perpetuates disadvantages across generations.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'FILL_IN_BLANK',
                  difficulty: 'HARD',
                  questionText:
                    'Intersectionality examines overlapping forms of discrimination and privilege.',
                  questionData: {
                    correctAnswers: [0],
                  } satisfies FillInBlankQuestionData,
                },

                // ORDERING questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText:
                    'Arrange the words to describe social inequality',
                  questionData: {
                    options: [
                      'inequality',
                      'social',
                      'creates',
                      'unfair',
                      'differences',
                      'in',
                      'society',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for community building',
                  questionData: {
                    options: [
                      'community',
                      'building',
                      'strengthens',
                      'social',
                      'bonds',
                      'and',
                      'support',
                      '.',
                    ],
                    correctAnswers: [0, 1, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for cultural diversity',
                  questionData: {
                    options: [
                      'diversity',
                      'cultural',
                      'enriches',
                      'societies',
                      'with',
                      'different',
                      'perspectives',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'EASY',
                  questionText: 'Arrange the words for social justice',
                  questionData: {
                    options: [
                      'justice',
                      'social',
                      'promotes',
                      'fairness',
                      'and',
                      'equality',
                      'for',
                      'all',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for poverty reduction',
                  questionData: {
                    options: [
                      'reduction',
                      'poverty',
                      'requires',
                      'education',
                      'economic',
                      'opportunities',
                      'and',
                      'social',
                      'support',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for gender equality',
                  questionData: {
                    options: [
                      'equality',
                      'gender',
                      'ensures',
                      'equal',
                      'rights',
                      'and',
                      'opportunities',
                      'for',
                      'all',
                      'genders',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for human rights',
                  questionData: {
                    options: [
                      'rights',
                      'human',
                      'protect',
                      'fundamental',
                      'freedoms',
                      'and',
                      'dignity',
                      'of',
                      'all',
                      'people',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'MEDIUM',
                  questionText: 'Arrange the words for social change',
                  questionData: {
                    options: [
                      'change',
                      'social',
                      'occurs',
                      'through',
                      'collective',
                      'action',
                      'and',
                      'policy',
                      'reform',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText: 'Arrange the words for structural inequality',
                  questionData: {
                    options: [
                      'inequality',
                      'structural',
                      'refers',
                      'to',
                      'systemic',
                      'disadvantages',
                      'that',
                      'persist',
                      'across',
                      'generations',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                  } satisfies OrderingQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ORDERING',
                  difficulty: 'HARD',
                  questionText:
                    'Arrange the words for intersectional discrimination',
                  questionData: {
                    options: [
                      'discrimination',
                      'intersectional',
                      'examines',
                      'how',
                      'multiple',
                      'forms',
                      'of',
                      'oppression',
                      'intersect',
                      'and',
                      'compound',
                      '.',
                    ],
                    correctAnswers: [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  } satisfies OrderingQuestionData,
                },

                // ESSAY questions (10) - 4 EASY, 4 MEDIUM, 2 HARD
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write a short paragraph (50-75 words) describing a social issue in your community.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe the importance of cultural diversity in modern society.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Write about why education is important for social mobility.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'EASY',
                  questionText:
                    'Describe how social media influences social issues and public opinion.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Discuss the causes and effects of income inequality in society.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the role of government in addressing social problems.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Describe the impact of globalization on local communities and cultures.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'MEDIUM',
                  questionText:
                    'Write about the importance of mental health awareness in society.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Analyze how social class affects access to opportunities and life outcomes.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
                {
                  id: crypto.randomUUID(),
                  type: 'ESSAY',
                  difficulty: 'HARD',
                  questionText:
                    'Discuss the challenges of achieving social justice in diverse, multicultural societies.',
                  questionData: {
                    correctAnswers: [],
                  } satisfies EssayQuestionData,
                },
              ],
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Upper-Intermediate (B2)',
          description: 'Advanced grammar and complex communication',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Passive Voice',
              description: 'Active and passive constructions in all tenses',
              order: 0,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Business English Basics',
              description: 'Professional communication and workplace skills',
              order: 1,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Reported Speech',
              description: 'Direct and indirect speech patterns',
              order: 2,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Advanced Modal Verbs',
              description: 'Necessity, probability, and deduction',
              order: 3,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Cultural Awareness',
              description: 'Customs, traditions, and cultural differences',
              order: 4,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Academic Writing',
              description: 'Essays, reports, and formal writing',
              order: 5,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Idiomatic Expressions',
              description: 'Common idioms and phrasal verbs',
              order: 6,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Persuasion and Argument',
              description: 'Presenting and defending arguments',
              order: 7,
              questions: [],
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Advanced (C1)',
          description: 'Near-native proficiency and nuanced communication',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Advanced Grammar Structures',
              description: 'Inversion, ellipsis, and complex sentences',
              order: 0,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Literature and Analysis',
              description: 'Reading and analyzing literary texts',
              order: 1,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Professional Presentations',
              description: 'Public speaking and presentation skills',
              order: 2,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Negotiation and Diplomacy',
              description: 'Subtle language and tactful communication',
              order: 3,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Global Issues and Debate',
              description: 'Complex topics and critical thinking',
              order: 4,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Academic Research Skills',
              description: 'Research methodology and academic discourse',
              order: 5,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Nuances and Register',
              description: 'Formal vs informal language and tone',
              order: 6,
              questions: [],
            },
            {
              id: crypto.randomUUID(),
              name: 'Advanced Vocabulary',
              description: 'Colloquialisms, slang, and advanced expressions',
              order: 7,
              questions: [],
            },
          ],
        },
      ],
    } satisfies Data,
    japan: {
      id: crypto.randomUUID(),
      name: 'Japonca',
      description: 'Japonca Dil Eğitimi',
      branchId,
      curriculums: [
        {
          id: crypto.randomUUID(),
          name: 'JLPT N5 (Başlangıç)',
          description: 'Japonca öğrenmeye giriş seviyesi',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Hiragana ve Katakana',
              description: 'Japon alfabesinin temelleri ve okuma yazma',
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              name: 'Selamlaşma ve Tanışma',
              description: 'Temel selamlaşma ifadeleri ve kendini tanıtma',
              order: 1,
            },
            {
              id: crypto.randomUUID(),
              name: 'Sayılar ve Zaman',
              description: 'Sayılar, saatler, günler ve tarihler',
              order: 2,
            },
            {
              id: crypto.randomUUID(),
              name: 'Aile ve İnsanlar',
              description: 'Aile üyeleri ve insan tanımlamaları',
              order: 3,
            },
            {
              id: crypto.randomUUID(),
              name: 'Temel Fiiller ve Günlük Aktiviteler',
              description: 'Basit fiiller ve günlük rutinler',
              order: 4,
            },
            {
              id: crypto.randomUUID(),
              name: 'Yemek ve İçecekler',
              description:
                'Yiyecek içecek kelimeleri ve restoranda sipariş verme',
              order: 5,
            },
            {
              id: crypto.randomUUID(),
              name: 'Alışveriş ve Fiyatlar',
              description: 'Alışveriş ifadeleri ve para kullanımı',
              order: 6,
            },
            {
              id: crypto.randomUUID(),
              name: 'Yerler ve Yön Tarifi',
              description: 'Şehirdeki yerler ve yol tarifi verme',
              order: 7,
            },
            {
              id: crypto.randomUUID(),
              name: 'Temel Kanji (80 Karakter)',
              description: 'N5 seviyesi için gerekli temel Kanji karakterleri',
              order: 8,
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'JLPT N4 (Temel)',
          description: 'Temel Japonca becerilerinin geliştirilmesi',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Geçmiş Zaman ve Hikaye Anlatımı',
              description: 'Geçmiş zaman fiiller ve deneyimleri anlatma',
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              name: 'Hobiler ve Boş Zaman',
              description: 'İlgi alanları ve boş zaman aktiviteleri',
              order: 1,
            },
            {
              id: crypto.randomUUID(),
              name: 'Ulaşım ve Seyahat',
              description: 'Ulaşım araçları ve seyahat ifadeleri',
              order: 2,
            },
            {
              id: crypto.randomUUID(),
              name: 'Hava Durumu ve Mevsimler',
              description: 'Hava durumu tanımlaması ve mevsimler',
              order: 3,
            },
            {
              id: crypto.randomUUID(),
              name: 'Sağlık ve Vücut',
              description: 'Vücut bölümleri ve hastalık ifadeleri',
              order: 4,
            },
            {
              id: crypto.randomUUID(),
              name: 'Karşılaştırma ve Tercihler',
              description: 'Karşılaştırma yapma ve tercih belirtme',
              order: 5,
            },
            {
              id: crypto.randomUUID(),
              name: 'Gelecek Planları ve Niyetler',
              description: 'Gelecek zaman ve plan ifadeleri',
              order: 6,
            },
            {
              id: crypto.randomUUID(),
              name: 'Meslekler ve İş Hayatı',
              description: 'Meslek tanımlamaları ve iş yeri kelimeleri',
              order: 7,
            },
            {
              id: crypto.randomUUID(),
              name: 'N4 Kanji (170 Karakter)',
              description: 'N4 seviyesi için ek Kanji karakterleri',
              order: 8,
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'JLPT N3 (Orta Seviye)',
          description: 'Günlük konuşma akıcılığının geliştirilmesi',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'Keigo - Saygı Dili Temelleri',
              description: 'Temel nezaket dili ve saygı ifadeleri',
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              name: 'Eğitim ve Öğrenme',
              description: 'Okul konuları ve öğrenim kelimeleri',
              order: 1,
            },
            {
              id: crypto.randomUUID(),
              name: 'Teknoloji ve İletişim',
              description: 'Modern teknoloji ve dijital iletişim',
              order: 2,
            },
            {
              id: crypto.randomUUID(),
              name: 'Çevre ve Doğa',
              description: 'Doğa, kirlilik ve sürdürülebilirlik',
              order: 3,
            },
            {
              id: crypto.randomUUID(),
              name: 'Şart Cümleleri',
              description: 'Koşullu cümle yapıları',
              order: 4,
            },
            {
              id: crypto.randomUUID(),
              name: 'Eğlence ve Medya',
              description: 'Film, müzik ve popüler kültür',
              order: 5,
            },
            {
              id: crypto.randomUUID(),
              name: 'Görüş Bildirme ve Tartışma',
              description: 'Fikir beyan etme ve tartışma ifadeleri',
              order: 6,
            },
            {
              id: crypto.randomUUID(),
              name: 'Sosyal Konular',
              description: 'Toplum, sosyal olaylar ve güncel haberler',
              order: 7,
            },
            {
              id: crypto.randomUUID(),
              name: 'N3 Kanji (370 Karakter)',
              description: 'N3 seviyesi için ek Kanji karakterleri',
              order: 8,
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'JLPT N2 (Orta-İleri Seviye)',
          description: 'İleri düzey gramer ve karmaşık iletişim',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'İleri Düzey Keigo',
              description: 'Profesyonel nezaket dili ve resmi ifadeler',
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              name: 'İş Japoncası Temelleri',
              description: 'Profesyonel iletişim ve iş yeri becerileri',
              order: 1,
            },
            {
              id: crypto.randomUUID(),
              name: 'Dolaylı Anlatım',
              description: 'Aktarma cümleleri ve alıntı yapıları',
              order: 2,
            },
            {
              id: crypto.randomUUID(),
              name: 'İleri Düzey Yardımcı Fiiller',
              description: 'Zorunluluk, olasılık ve çıkarım ifadeleri',
              order: 3,
            },
            {
              id: crypto.randomUUID(),
              name: 'Kültürel Farkındalık',
              description: 'Japon gelenekleri ve kültürel farklılıklar',
              order: 4,
            },
            {
              id: crypto.randomUUID(),
              name: 'Akademik Yazım',
              description: 'Deneme, rapor ve resmi yazışma',
              order: 5,
            },
            {
              id: crypto.randomUUID(),
              name: 'Deyimler ve İkilemeler',
              description: 'Yaygın Japon deyimleri ve ikilemeler',
              order: 6,
            },
            {
              id: crypto.randomUUID(),
              name: 'İkna ve Tartışma',
              description: 'Argüman sunma ve savunma becerileri',
              order: 7,
            },
            {
              id: crypto.randomUUID(),
              name: 'N2 Kanji (640 Karakter)',
              description: 'N2 seviyesi için ek Kanji karakterleri',
              order: 8,
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'JLPT N1 (İleri Seviye)',
          description: 'Ana dil seviyesine yakın yeterlilik',
          lessons: [
            {
              id: crypto.randomUUID(),
              name: 'İleri Düzey Gramer Yapıları',
              description: 'Karmaşık cümle yapıları ve nüanslar',
              order: 0,
            },
            {
              id: crypto.randomUUID(),
              name: 'Edebiyat ve Metin Analizi',
              description: 'Edebi metinleri okuma ve analiz etme',
              order: 1,
            },
            {
              id: crypto.randomUUID(),
              name: 'Profesyonel Sunumlar',
              description: 'Topluluk önünde konuşma ve sunum becerileri',
              order: 2,
            },
            {
              id: crypto.randomUUID(),
              name: 'Müzakere ve Diplomasi',
              description: 'İnce dil kullanımı ve diplomatik iletişim',
              order: 3,
            },
            {
              id: crypto.randomUUID(),
              name: 'Küresel Konular ve Münazara',
              description: 'Karmaşık konular ve eleştirel düşünme',
              order: 4,
            },
            {
              id: crypto.randomUUID(),
              name: 'Akademik Araştırma Becerileri',
              description: 'Araştırma metodolojisi ve akademik söylem',
              order: 5,
            },
            {
              id: crypto.randomUUID(),
              name: 'Üslup ve Register',
              description: 'Resmi ve gayri resmi dil kullanımı',
              order: 6,
            },
            {
              id: crypto.randomUUID(),
              name: 'Klasik Japonca ve Kanbun',
              description: 'Klasik Japon metinleri ve Çince etkili yazılar',
              order: 7,
            },
            {
              id: crypto.randomUUID(),
              name: 'N1 Kanji (1000+ Karakter)',
              description: 'N1 seviyesi için ek Kanji karakterleri',
              order: 8,
            },
          ],
        },
      ],
    } as Data,
  };
}
