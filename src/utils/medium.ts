import Parser from 'rss-parser';
import { format } from 'date-fns';

const MEDIUM_RSS_URL = 'https://medium.com/feed/@nitinsgavane';

interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  thumbnail: string;
  description: string;
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  const parser = new Parser();
  
  try {
    const feed = await parser.parseURL(MEDIUM_RSS_URL);
    
    return feed.items.map(item => {
      // Extract the first image from content as thumbnail
      const thumbnail = item.content?.match(/<img[^>]*src="([^"]*)"[^>]*>/)?.[1] || 'src/assets/blog1.jpg';
      
      // Create a clean description by removing HTML tags
      const description = item['content:encoded']
        ? item['content:encoded']
            .replace(/<[^>]*>/g, '')
            .slice(0, 160) + '...'
        : '';

      return {
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate ? format(new Date(item.pubDate), 'MMM dd, yyyy') : '',
        content: item.content || '',
        thumbnail,
        description
      };
    });
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}