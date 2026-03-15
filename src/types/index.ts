export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    tech_stack: string[];
    architecture_overview: string;
    image_url: string | null;
    live_url: string | null;
    github_url: string | null;
    created_at: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    source_url?: string | null;
    tags: string[];
    created_at: string;
}

export type InsertProject = Omit<Project, 'id' | 'slug' | 'created_at'>;
export type UpdateProject = Partial<InsertProject> & { id: string };

export type InsertBlog = Omit<BlogPost, 'id' | 'slug' | 'created_at'>;
export type UpdateBlog = Partial<InsertBlog> & { id: string };
