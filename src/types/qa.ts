export interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
  acceptedAnswerId?: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  body: string;
  author: string;
  votes: number;
  createdAt: string;
  isAccepted: boolean;
}

export interface Vote {
  id: string;
  itemId: string; // question or answer ID
  type: 'question' | 'answer';
  value: 1 | -1; // upvote or downvote
  voter: string;
}

export interface QAState {
  questions: Question[];
  votes: Vote[];
  nickname: string;
  hydrated: boolean;
}

export interface QAActions {
  hydrate: () => void;
  addQuestion: (question: Omit<Question, 'id' | 'votes' | 'createdAt' | 'updatedAt' | 'answers'>) => void;
  addAnswer: (answer: Omit<Answer, 'id' | 'votes' | 'createdAt' | 'isAccepted'>) => void;
  voteQuestion: (questionId: string, voter: string, value: 1 | -1) => void;
  voteAnswer: (answerId: string, voter: string, value: 1 | -1) => void;
  acceptAnswer: (questionId: string, answerId: string) => void;
  setNickname: (nickname: string) => void;
}

export interface QAPersistedState {
  questions: Question[];
  votes: Vote[];
  nickname: string;
}
