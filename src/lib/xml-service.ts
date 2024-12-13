export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  isPrivate: boolean;
  learningStatus: 'not_started' | 'in_progress' | 'completed';
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

class XMLService {
  private createXMLDocument(): Document {
    return new DOMParser().parseFromString('<root></root>', 'application/xml');
  }

  private postToXML(post: Post): string {
    return `
      <post>
        <id>${post.id}</id>
        <title>${post.title}</title>
        <description>${post.description}</description>
        <category>${post.category}</category>
        <content>${post.content}</content>
        <isPrivate>${post.isPrivate}</isPrivate>
        <learningStatus>${post.learningStatus}</learningStatus>
        <authorId>${post.authorId}</authorId>
        <createdAt>${post.createdAt}</createdAt>
        <updatedAt>${post.updatedAt}</updatedAt>
      </post>
    `;
  }

  private xmlToPost(xml: string): Post {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    
    return {
      id: doc.querySelector('id')?.textContent || '',
      title: doc.querySelector('title')?.textContent || '',
      description: doc.querySelector('description')?.textContent || '',
      category: doc.querySelector('category')?.textContent || '',
      content: doc.querySelector('content')?.textContent || '',
      isPrivate: doc.querySelector('isPrivate')?.textContent === 'true',
      learningStatus: (doc.querySelector('learningStatus')?.textContent || 'not_started') as Post['learningStatus'],
      authorId: doc.querySelector('authorId')?.textContent || '',
      createdAt: doc.querySelector('createdAt')?.textContent || '',
      updatedAt: doc.querySelector('updatedAt')?.textContent || '',
    };
  }

  public createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newPost;
  }
}

export const xmlService = new XMLService();