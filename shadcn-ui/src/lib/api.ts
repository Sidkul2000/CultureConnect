const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token || null;
  }
  return null;
};

// Helper to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - clear localStorage and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('currentUser');
      window.location.href = '/auth';
      throw new Error('Session expired. Please login again.');
    }

    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Authentication
export const authAPI = {
  signup: async (data: any) => {
    return fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json());
  },

  login: async (email: string, password: string) => {
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());
  },
};

// Users
export const userAPI = {
  getMe: () => fetchWithAuth('/users/me'),

  updateMe: (data: any) =>
    fetchWithAuth('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getUser: (userId: string) => fetchWithAuth(`/users/${userId}`),

  getProfile: (userId: string) => fetchWithAuth(`/users/profile/${userId}`),

  updateStatus: (isOnline: boolean) =>
    fetchWithAuth('/users/status', {
      method: 'POST',
      body: JSON.stringify({ isOnline }),
    }),
};

// Matches
export const matchAPI = {
  discover: () => fetchWithAuth('/matches/discover'),

  swipe: (toUserId: string, action: 'LIKE' | 'PASS' | 'SUPER_LIKE') =>
    fetchWithAuth('/matches/swipe', {
      method: 'POST',
      body: JSON.stringify({ toUserId, action }),
    }),

  getMatches: () => fetchWithAuth('/matches'),

  unmatch: (matchId: string) =>
    fetchWithAuth(`/matches/${matchId}`, {
      method: 'DELETE',
    }),
};

// Messages
export const messageAPI = {
  getConversations: () => fetchWithAuth('/messages/conversations'),

  getMessages: (conversationId: string) =>
    fetchWithAuth(`/messages/conversations/${conversationId}`),

  sendMessage: (conversationId: string, content: string) =>
    fetchWithAuth(`/messages/conversations/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  markAsRead: (conversationId: string) =>
    fetchWithAuth(`/messages/conversations/${conversationId}/read`, {
      method: 'POST',
    }),
};

// Posts
export const postAPI = {
  getFeed: (page = 1, limit = 20) =>
    fetchWithAuth(`/posts/feed?page=${page}&limit=${limit}`),

  createPost: (data: any) =>
    fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deletePost: (postId: string) =>
    fetchWithAuth(`/posts/${postId}`, {
      method: 'DELETE',
    }),

  likePost: (postId: string) =>
    fetchWithAuth(`/posts/${postId}/like`, {
      method: 'POST',
    }),

  commentOnPost: (postId: string, content: string) =>
    fetchWithAuth(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  getComments: (postId: string) => fetchWithAuth(`/posts/${postId}/comments`),

  rsvpEvent: (postId: string, status: string) =>
    fetchWithAuth(`/posts/${postId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
};

// Stories
export const storyAPI = {
  getStories: () => fetchWithAuth('/stories'),

  createStory: (image: string, caption?: string) =>
    fetchWithAuth('/stories', {
      method: 'POST',
      body: JSON.stringify({ image, caption }),
    }),

  deleteStory: (storyId: string) =>
    fetchWithAuth(`/stories/${storyId}`, {
      method: 'DELETE',
    }),
};

// Upload
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/upload/images`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};
