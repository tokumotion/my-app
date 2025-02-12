import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { summarizeReadme } from '@/app/utils/chain';
import { DB_TABLES } from '@/lib/schema';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 401 }
      );
    }

    // Query using standardized schema reference
    const { data, error } = await supabase
      .from(DB_TABLES.API_KEYS.fullPath)
      .select('key')
      .eq('key', apiKey)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error validating API key' },
        { status: 500 }
      );
    }

    if (!data) {
      // API key not found
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const { githubUrl } = await request.json();
    console.log('1. Received GitHub URL:', githubUrl);

    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    console.log('2. Parsed owner/repo:', { owner, repo });

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      );
    }

    // Fetch README content from GitHub API
    const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    console.log('3. Fetching README from:', readmeUrl);

    // Just use the regular fetch
    const response = await fetch(readmeUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'GitHub-Readme-Fetcher'
      }
    });

    console.log('4. GitHub API Response status:', response.status);

    if (!response.ok) {
      console.error('GitHub API Error:', await response.text());
      return NextResponse.json(
        { error: 'Error fetching README from GitHub' },
        { status: response.status }
      );
    }

    const readmeContent = await response.text();
    console.log('5. README Content length:', readmeContent.length);
    console.log('6. First 100 chars of README:', readmeContent.substring(0, 100));
    
    console.log('7. Calling summarizeReadme function');
    const result = await summarizeReadme(readmeContent, process.env.OPENAI_API_KEY!);
    console.log('8. Summary result:', result);
    
    if (!result) {
      console.error('9. No summary result received');
      return NextResponse.json({ error: 'No summary result' }, { status: 500 });
    }

    console.log('10. Returning successful response');
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('11. Error in GitHub summarizer:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
} 

