import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QAState, QAActions, Question, Answer, Vote, QAPersistedState } from '../types/qa';
import { SimpleStorage } from '../lib/simpleStorage';

const storage = new SimpleStorage();

const initialState: QAState = {
  questions: [],
  votes: [],
  nickname: 'Anonymous User',
  hydrated: false,
};

export const useQAStore = create<QAState & QAActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      hydrate: async () => {
        try {
          const stored = await storage.getItem('qa-store');
          if (stored) {
            const parsed = JSON.parse(stored);
            set({ ...parsed, hydrated: true });
          } else {
            set({ hydrated: true });
          }
        } catch (error) {
          console.error('Failed to hydrate QA store:', error);
          set({ hydrated: true });
        }
      },

      addQuestion: (questionData) => {
        const { questions, nickname } = get();
        const newQuestion: Question = {
          id: Date.now().toString(),
          title: questionData.title,
          body: questionData.body,
          tags: questionData.tags,
          author: nickname,
          votes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          answers: [],
        };

        set({
          questions: [newQuestion, ...questions],
        });
      },

      addAnswer: (answerData) => {
        const { questions, nickname } = get();
        const newAnswer: Answer = {
          id: Date.now().toString(),
          questionId: answerData.questionId,
          body: answerData.body,
          author: nickname,
          votes: 0,
          createdAt: new Date().toISOString(),
          isAccepted: false,
        };

        const updatedQuestions = questions.map((q) =>
          q.id === answerData.questionId
            ? { ...q, answers: [...q.answers, newAnswer], updatedAt: new Date().toISOString() }
            : q
        );

        set({ questions: updatedQuestions });
      },

      voteQuestion: (questionId, voter, value) => {
        const { questions, votes } = get();
        
        // Check if user already voted on this question
        const existingVote = votes.find(
          (v) => v.itemId === questionId && v.type === 'question' && v.voter === voter
        );

        let updatedVotes = [...votes];
        let voteChange = 0;

        if (existingVote) {
          if (existingVote.value === value) {
            // Same vote - remove it
            updatedVotes = votes.filter((v) => v.id !== existingVote.id);
            voteChange = -value;
          } else {
            // Different vote - update it
            updatedVotes = votes.map((v) =>
              v.id === existingVote.id ? { ...v, value } : v
            );
            voteChange = value - existingVote.value;
          }
        } else {
          // New vote
          const newVote: Vote = {
            id: Date.now().toString(),
            itemId: questionId,
            type: 'question',
            value,
            voter,
          };
          updatedVotes.push(newVote);
          voteChange = value;
        }

        const updatedQuestions = questions.map((q) =>
          q.id === questionId ? { ...q, votes: q.votes + voteChange } : q
        );

        set({ questions: updatedQuestions, votes: updatedVotes });
      },

      voteAnswer: (answerId, voter, value) => {
        const { questions, votes } = get();
        
        // Check if user already voted on this answer
        const existingVote = votes.find(
          (v) => v.itemId === answerId && v.type === 'answer' && v.voter === voter
        );

        let updatedVotes = [...votes];
        let voteChange = 0;

        if (existingVote) {
          if (existingVote.value === value) {
            // Same vote - remove it
            updatedVotes = votes.filter((v) => v.id !== existingVote.id);
            voteChange = -value;
          } else {
            // Different vote - update it
            updatedVotes = votes.map((v) =>
              v.id === existingVote.id ? { ...v, value } : v
            );
            voteChange = value - existingVote.value;
          }
        } else {
          // New vote
          const newVote: Vote = {
            id: Date.now().toString(),
            itemId: answerId,
            type: 'answer',
            value,
            voter,
          };
          updatedVotes.push(newVote);
          voteChange = value;
        }

        const updatedQuestions = questions.map((q) => ({
          ...q,
          answers: q.answers.map((a) =>
            a.id === answerId ? { ...a, votes: a.votes + voteChange } : a
          ),
        }));

        set({ questions: updatedQuestions, votes: updatedVotes });
      },

      acceptAnswer: (questionId, answerId) => {
        const { questions } = get();
        
        const updatedQuestions = questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                acceptedAnswerId: answerId,
                answers: q.answers.map((a) => ({
                  ...a,
                  isAccepted: a.id === answerId,
                })),
              }
            : q
        );

        set({ questions: updatedQuestions });
      },

      setNickname: (nickname) => {
        set({ nickname });
      },
    }),
    {
      name: 'qa-store',
      storage: {
        getItem: async (name) => {
          const item = await storage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name, value) => {
          await storage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await storage.removeItem(name);
        },
      },
      partialize: (state) => ({
        questions: state.questions,
        votes: state.votes,
        nickname: state.nickname,
      }) as any,
    }
  )
);
