import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQAStore } from '../../src/state/useQAStore';
import { Question } from '../../src/types/qa';

export default function CommunityScreen() {
  const {
    questions,
    nickname,
    hydrated,
    hydrate,
    addQuestion,
    setNickname,
  } = useQAStore();

  const [showAskForm, setShowAskForm] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    body: '',
    tags: '',
  });

  useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrated, hydrate]);

  useEffect(() => {
    setNewNickname(nickname);
  }, [nickname]);

  const handleAskQuestion = () => {
    if (!questionForm.title.trim() || !questionForm.body.trim()) {
      Alert.alert('Error', 'Please fill in both title and body');
      return;
    }

    const tags = questionForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    addQuestion({
      title: questionForm.title.trim(),
      body: questionForm.body.trim(),
      tags,
      author: nickname,
    });

    setQuestionForm({ title: '', body: '', tags: '' });
    setShowAskForm(false);
    Alert.alert('Success', 'Question posted successfully!');
  };

  const handleSaveNickname = () => {
    if (newNickname.trim()) {
      setNickname(newNickname.trim());
      setEditingNickname(false);
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

  const QuestionCard = ({ question }: { question: Question }) => (
    <TouchableOpacity style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.voteSection}>
          <TouchableOpacity style={styles.voteButton}>
            <Ionicons name="chevron-up" size={20} color="#4f7f8c" />
          </TouchableOpacity>
          <Text style={styles.voteCount}>{question.votes}</Text>
          <TouchableOpacity style={styles.voteButton}>
            <Ionicons name="chevron-down" size={20} color="#6b7680" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.questionContent}>
          <Text style={styles.questionTitle}>{question.title}</Text>
          <Text style={styles.questionBody} numberOfLines={2}>
            {question.body}
          </Text>
          
          <View style={styles.questionMeta}>
            <View style={styles.tagsContainer}>
              {question.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.questionFooter}>
              <Text style={styles.authorText}>by {question.author}</Text>
              <Text style={styles.dateText}>{formatDate(question.createdAt)}</Text>
              <Text style={styles.answerCount}>
                {question.answers.length} answer{question.answers.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!hydrated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Community Q&A</Text>
          <Text style={styles.subtitle}>Ask questions, share knowledge</Text>
        </View>

        {/* Nickname Section */}
        <View style={styles.nicknameSection}>
          {editingNickname ? (
            <View style={styles.nicknameEdit}>
              <TextInput
                style={styles.nicknameInput}
                value={newNickname}
                onChangeText={setNewNickname}
                placeholder="Enter your nickname"
                placeholderTextColor="#6b7680"
                autoFocus
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveNickname}>
                <Ionicons name="checkmark" size={20} color="#34C759" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setEditingNickname(false);
                  setNewNickname(nickname);
                }}
              >
                <Ionicons name="close" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.nicknameChip}
              onPress={() => setEditingNickname(true)}
            >
              <Ionicons name="person" size={16} color="#4f7f8c" />
              <Text style={styles.nicknameText}>You are: {nickname}</Text>
              <Ionicons name="pencil" size={14} color="#6b7680" />
            </TouchableOpacity>
          )}
        </View>

        {/* Ask Question Button */}
        <TouchableOpacity 
          style={styles.askButton}
          onPress={() => setShowAskForm(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.askButtonText}>Ask a Question</Text>
        </TouchableOpacity>

        {/* Questions List */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>
            Questions ({questions.length})
          </Text>
          
          {questions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="help-circle" size={48} color="#6b7680" />
              <Text style={styles.emptyTitle}>No questions yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to ask a question!
              </Text>
            </View>
          ) : (
            questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Ask Question Modal */}
      <Modal visible={showAskForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ask a Question</Text>
            <TouchableOpacity onPress={() => setShowAskForm(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Question Title</Text>
            <TextInput
              style={styles.input}
              value={questionForm.title}
              onChangeText={(text) => setQuestionForm({ ...questionForm, title: text })}
              placeholder="What's your question?"
              placeholderTextColor="#6b7680"
            />
            
            <Text style={styles.inputLabel}>Question Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={questionForm.body}
              onChangeText={(text) => setQuestionForm({ ...questionForm, body: text })}
              placeholder="Provide more details about your question..."
              placeholderTextColor="#6b7680"
              multiline
              numberOfLines={6}
            />
            
            <Text style={styles.inputLabel}>Tags (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={questionForm.tags}
              onChangeText={(text) => setQuestionForm({ ...questionForm, tags: text })}
              placeholder="finance, budgeting, savings"
              placeholderTextColor="#6b7680"
            />
            
            <TouchableOpacity style={styles.submitButton} onPress={handleAskQuestion}>
              <Text style={styles.submitButtonText}>Post Question</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7680',
  },
  nicknameSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nicknameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111315',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
  },
  nicknameText: {
    color: '#4f7f8c',
    fontSize: 14,
    fontWeight: '500',
  },
  nicknameEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111315',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  nicknameInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  saveButton: {
    padding: 4,
  },
  cancelButton: {
    padding: 4,
  },
  askButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  askButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  questionsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: '#111315',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
  },
  questionContent: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  questionBody: {
    fontSize: 14,
    color: '#a5c6d5',
    lineHeight: 20,
    marginBottom: 12,
  },
  questionMeta: {
    gap: 8,
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
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    color: '#6b7680',
    fontSize: 12,
  },
  answerCount: {
    color: '#a5c6d5',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#111315',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4f7f8c',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

