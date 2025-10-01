import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useQAStore } from '../../src/state/useQAStore';
import { Question, Answer } from '../../src/types/qa';

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams();
  const {
    questions,
    nickname,
    hydrated,
    hydrate,
    addAnswer,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
  } = useQAStore();

  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrated, hydrate]);

  useEffect(() => {
    if (hydrated && id) {
      const foundQuestion = questions.find(q => q.id === id);
      setQuestion(foundQuestion || null);
    }
  }, [hydrated, questions, id]);

  const handleAddAnswer = () => {
    if (!newAnswer.trim() || !question) {
      Alert.alert('Error', 'Please enter an answer');
      return;
    }

    addAnswer({
      questionId: question.id,
      body: newAnswer.trim(),
      author: nickname,
    });

    setNewAnswer('');
    setShowAnswerForm(false);
    Alert.alert('Success', 'Answer posted successfully!');
  };

  const handleVoteQuestion = (value: 1 | -1) => {
    if (question) {
      voteQuestion(question.id, nickname, value);
    }
  };

  const handleVoteAnswer = (answerId: string, value: 1 | -1) => {
    voteAnswer(answerId, nickname, value);
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (question) {
      acceptAnswer(question.id, answerId);
      Alert.alert('Success', 'Answer accepted!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRelatedQuestions = (currentQuestion: Question) => {
    if (!currentQuestion.tags.length) return [];
    
    return questions
      .filter(q => q.id !== currentQuestion.id)
      .map(q => ({
        ...q,
        tagOverlap: q.tags.filter(tag => currentQuestion.tags.includes(tag)).length
      }))
      .filter(q => q.tagOverlap > 0)
      .sort((a, b) => b.tagOverlap - a.tagOverlap)
      .slice(0, 3);
  };

  if (!hydrated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorTitle}>Question not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const relatedQuestions = getRelatedQuestions(question);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#4f7f8c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Question</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.voteSection}>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={() => handleVoteQuestion(1)}
              >
                <Ionicons name="chevron-up" size={24} color="#4f7f8c" />
              </TouchableOpacity>
              <Text style={styles.voteCount}>{question.votes}</Text>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={() => handleVoteQuestion(-1)}
              >
                <Ionicons name="chevron-down" size={24} color="#6b7680" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle}>{question.title}</Text>
              <Text style={styles.questionBody}>{question.body}</Text>
              
              <View style={styles.questionMeta}>
                <View style={styles.tagsContainer}>
                  {question.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.questionFooter}>
                  <Text style={styles.authorText}>Asked by {question.author}</Text>
                  <Text style={styles.dateText}>{formatDate(question.createdAt)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Answers Section */}
        <View style={styles.answersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Answers ({question.answers.length})
            </Text>
            <TouchableOpacity 
              style={styles.addAnswerButton}
              onPress={() => setShowAnswerForm(true)}
            >
              <Ionicons name="add" size={20} color="#4f7f8c" />
              <Text style={styles.addAnswerButtonText}>Add Answer</Text>
            </TouchableOpacity>
          </View>

          {question.answers.length === 0 ? (
            <View style={styles.emptyAnswers}>
              <Ionicons name="chatbubbles" size={48} color="#6b7680" />
              <Text style={styles.emptyTitle}>No answers yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to answer this question!
              </Text>
            </View>
          ) : (
            question.answers
              .sort((a, b) => {
                // Accepted answer first, then by votes
                if (a.isAccepted && !b.isAccepted) return -1;
                if (!a.isAccepted && b.isAccepted) return 1;
                return b.votes - a.votes;
              })
              .map((answer) => (
                <View key={answer.id} style={[
                  styles.answerCard,
                  answer.isAccepted && styles.acceptedAnswer
                ]}>
                  <View style={styles.answerHeader}>
                    <View style={styles.voteSection}>
                      <TouchableOpacity 
                        style={styles.voteButton}
                        onPress={() => handleVoteAnswer(answer.id, 1)}
                      >
                        <Ionicons name="chevron-up" size={20} color="#4f7f8c" />
                      </TouchableOpacity>
                      <Text style={styles.voteCount}>{answer.votes}</Text>
                      <TouchableOpacity 
                        style={styles.voteButton}
                        onPress={() => handleVoteAnswer(answer.id, -1)}
                      >
                        <Ionicons name="chevron-down" size={20} color="#6b7680" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.answerContent}>
                      {answer.isAccepted && (
                        <View style={styles.acceptedBadge}>
                          <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                          <Text style={styles.acceptedText}>Accepted Answer</Text>
                        </View>
                      )}
                      <Text style={styles.answerBody}>{answer.body}</Text>
                      
                      <View style={styles.answerFooter}>
                        <Text style={styles.authorText}>Answered by {answer.author}</Text>
                        <Text style={styles.dateText}>{formatDate(answer.createdAt)}</Text>
                        {!answer.isAccepted && question.author === nickname && (
                          <TouchableOpacity 
                            style={styles.acceptButton}
                            onPress={() => handleAcceptAnswer(answer.id)}
                          >
                            <Text style={styles.acceptButtonText}>Accept</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))
          )}
        </View>

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Related Questions</Text>
            {relatedQuestions.map((related) => (
              <TouchableOpacity 
                key={related.id} 
                style={styles.relatedCard}
                onPress={() => router.push(`/community/${related.id}`)}
              >
                <Text style={styles.relatedTitle}>{related.title}</Text>
                <Text style={styles.relatedMeta}>
                  {related.answers.length} answers • {related.votes} votes
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Answer Modal */}
      {showAnswerForm && (
        <View style={styles.overlay}>
          <View style={styles.answerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Answer</Text>
              <TouchableOpacity onPress={() => setShowAnswerForm(false)}>
                <Ionicons name="close" size={24} color="#6b7680" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.answerInput}
              value={newAnswer}
              onChangeText={setNewAnswer}
              placeholder="Write your answer here..."
              placeholderTextColor="#6b7680"
              multiline
              numberOfLines={8}
              autoFocus
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowAnswerForm(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitModalButton}
                onPress={handleAddAnswer}
              >
                <Text style={styles.submitModalButtonText}>Post Answer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    color: '#6b7680',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeholder: {
    width: 24,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: '#4f7f8c',
    fontSize: 16,
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: '#111315',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  voteSection: {
    alignItems: 'center',
    minWidth: 40,
  },
  voteButton: {
    padding: 4,
  },
  voteCount: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  questionContent: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  questionBody: {
    fontSize: 16,
    color: '#a5c6d5',
    lineHeight: 24,
    marginBottom: 16,
  },
  questionMeta: {
    gap: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#4f7f8c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  questionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorText: {
    color: '#4f7f8c',
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    color: '#6b7680',
    fontSize: 14,
  },
  answersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  addAnswerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111315',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addAnswerButtonText: {
    color: '#4f7f8c',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyAnswers: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7680',
    textAlign: 'center',
  },
  answerCard: {
    backgroundColor: '#111315',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  acceptedAnswer: {
    borderWidth: 2,
    borderColor: '#34C759',
  },
  answerHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  answerContent: {
    flex: 1,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
    gap: 4,
  },
  acceptedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  answerBody: {
    fontSize: 16,
    color: '#a5c6d5',
    lineHeight: 24,
    marginBottom: 12,
  },
  answerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  relatedSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  relatedCard: {
    backgroundColor: '#111315',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  relatedMeta: {
    fontSize: 12,
    color: '#6b7680',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  answerModal: {
    backgroundColor: '#111315',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  answerInput: {
    backgroundColor: '#15181a',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2b2f33',
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
  },
  cancelModalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelModalButtonText: {
    color: '#6b7680',
    fontSize: 16,
    fontWeight: '500',
  },
  submitModalButton: {
    backgroundColor: '#4f7f8c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

