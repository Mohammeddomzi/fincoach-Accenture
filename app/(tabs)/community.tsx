import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export default function CommunityScreen() {
  const [isJoining, setIsJoining] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    tags: '',
  });
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);

  const handleJoinCommunity = async () => {
    setIsJoining(true);
    try {
      // Simulate joining community
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Welcome to the FinCoach community!');
    } catch (error) {
      Alert.alert('Error', 'Failed to join community');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    const newPostData = {
      id: Date.now().toString(),
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      author: 'Anonymous',
      category: newPost.category,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setCommunityPosts([...communityPosts, newPostData]);

    setNewPost({
      title: '',
      content: '',
      category: 'general',
      tags: '',
    });
    setShowCreatePost(false);
    Alert.alert('Success', 'Post created successfully!');
  };

  const handleViewDiscussions = () => {
    Alert.alert('Discussions', 'Discussion feature coming soon!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'investment': return 'trending-up';
      case 'savings': return 'wallet';
      case 'tips': return 'bulb';
      case 'success-story': return 'trophy';
      default: return 'chatbubble';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'investment': return '#34C759';
      case 'savings': return '#4f7f8c';
      case 'tips': return '#FF9500';
      case 'success-story': return '#FF3B30';
      default: return '#6b7680';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredPosts = selectedCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.category === selectedCategory);

  const likePost = (postId: string) => {
    setCommunityPosts(communityPosts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const communityFeatures = [
    {
      icon: 'chatbubbles-outline' as const,
      title: 'Financial Discussions',
      description: 'Share tips and get advice from the community',
      onPress: handleViewDiscussions,
    },
    {
      icon: 'trending-up-outline' as const,
      title: 'Success Stories',
      description: 'Read inspiring financial journeys',
      onPress: () => Alert.alert('Success Stories', 'Feature coming soon!'),
    },
    {
      icon: 'people-outline' as const,
      title: 'Mentorship',
      description: 'Connect with financial mentors',
      onPress: () => Alert.alert('Mentorship', 'Feature coming soon!'),
    },
    {
      icon: 'trophy-outline' as const,
      title: 'Challenges',
      description: 'Join community financial challenges',
      onPress: () => Alert.alert('Challenges', 'Feature coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Hub</Text>
          <Button
            title="Create Post"
            onPress={() => setShowCreatePost(true)}
            icon="create"
            size="small"
          />
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'All', icon: 'grid' },
              { key: 'investment', label: 'Investment', icon: 'trending-up' },
              { key: 'savings', label: 'Savings', icon: 'wallet' },
              { key: 'tips', label: 'Tips', icon: 'bulb' },
              { key: 'success-story', label: 'Success', icon: 'trophy' },
              { key: 'general', label: 'General', icon: 'chatbubble' },
            ].map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategory === category.key ? '#ffffff' : '#6b7680'} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key && styles.categoryButtonTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Posts */}
        {filteredPosts.length === 0 ? (
          <Card style={styles.emptyCard} padding="large">
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={60} color="#6b7680" />
              <Text style={styles.emptyTitle}>No Posts Yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to share your financial insights and tips!
              </Text>
              <Button
                title="Create First Post"
                onPress={() => setShowCreatePost(true)}
                icon="create"
                size="large"
                style={styles.createFirstButton}
              />
            </View>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} style={styles.postCard} padding="large">
              <View style={styles.postHeader}>
                <View style={styles.postAuthor}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
                    <Ionicons name={getCategoryIcon(post.category) as any} size={12} color="#ffffff" />
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                  </View>
                </View>
                <Text style={[styles.categoryLabel, { color: getCategoryColor(post.category) }]}>
                  {post.category.replace('-', ' ').toUpperCase()}
                </Text>
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>

              {post.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {post.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.postActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => likePost(post.id)}
                >
                  <Ionicons name="heart-outline" size={18} color="#6b7680" />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={18} color="#6b7680" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-outline" size={18} color="#6b7680" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}


        {/* Privacy Badge */}
        <View style={styles.privacyBadge}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.privacyText}>
            🔐 Your privacy is protected - share only what you're comfortable with
          </Text>
        </View>
      </ScrollView>

      {/* Create Post Modal */}
      <Modal visible={showCreatePost} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Input
              label="Post Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
              placeholder="Enter a catchy title..."
            />

            <View style={styles.categorySelector}>
              <Text style={styles.categorySelectorLabel}>Category</Text>
              <View style={styles.categoryOptions}>
                {[
                  { key: 'general', label: 'General', icon: 'chatbubble' },
                  { key: 'investment', label: 'Investment', icon: 'trending-up' },
                  { key: 'savings', label: 'Savings', icon: 'wallet' },
                  { key: 'tips', label: 'Tips', icon: 'bulb' },
                  { key: 'success-story', label: 'Success Story', icon: 'trophy' },
                ].map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryOption,
                      newPost.category === category.key && styles.categoryOptionActive
                    ]}
                    onPress={() => setNewPost({ ...newPost, category: category.key as any })}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={16} 
                      color={newPost.category === category.key ? '#ffffff' : '#6b7680'} 
                    />
                    <Text style={[
                      styles.categoryOptionText,
                      newPost.category === category.key && styles.categoryOptionTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input
              label="Content"
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              placeholder="Share your thoughts, tips, or experiences..."
              multiline
              numberOfLines={6}
            />

            <Input
              label="Tags (optional)"
              value={newPost.tags}
              onChangeText={(text) => setNewPost({ ...newPost, tags: text })}
              placeholder="investment, savings, tips (comma separated)"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowCreatePost(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Create Post"
                onPress={handleCreatePost}
                style={styles.createButton}
              />
            </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(107, 118, 128, 0.1)',
    borderRadius: 20,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#4f7f8c',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6b7680',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  emptyCard: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7680',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createFirstButton: {
    minWidth: 200,
  },
  postCard: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  postDate: {
    fontSize: 12,
    color: '#6b7680',
    marginTop: 2,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#a5c6d5',
    lineHeight: 24,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(79, 127, 140, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#4f7f8c',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7680',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  categorySelector: {
    marginVertical: 20,
  },
  categorySelectorLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 12,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(107, 118, 128, 0.1)',
    borderRadius: 16,
    gap: 6,
  },
  categoryOptionActive: {
    backgroundColor: '#4f7f8c',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#6b7680',
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  privacyText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    flex: 1,
  },
});