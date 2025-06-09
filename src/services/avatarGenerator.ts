interface AvatarConfig {
  name: string;
  gender: string;
  ethnicity: string;
  style: string;
  bodyType: string;
  bodyShape: string;
  hairType: string;
  hairColor: string;
  profession: string;
  accessories: {
    earrings: boolean;
    glasses: boolean;
    necklace: boolean;
    bracelet: boolean;
  };
}

interface GeneratedAvatar {
  imageUrl: string;
  prompt: string;
}

// Create realistic portrait prompt from user customizations
export function generateAvatarPrompt(config: AvatarConfig): string {
  const {
    gender,
    ethnicity,
    style,
    bodyShape,
    hairType,
    hairColor,
    profession,
    accessories
  } = config;

  // Build base description
  let prompt = `Professional portrait photograph of a ${ethnicity.toLowerCase()} ${gender.toLowerCase()}`;
  
  // Add physical features
  prompt += ` with ${hairColor.toLowerCase()} ${hairType.toLowerCase()} hair`;
  prompt += `, ${bodyShape.toLowerCase()} build`;
  
  // Add style and profession context
  prompt += `, working as a ${profession.toLowerCase()}`;
  prompt += `, ${style.toLowerCase()} style`;
  
  // Add accessories
  const accessoryList = [];
  if (accessories.glasses) accessoryList.push('wearing stylish glasses');
  if (accessories.earrings) accessoryList.push('wearing elegant earrings');
  if (accessories.necklace) accessoryList.push('wearing a fashionable necklace');
  if (accessories.bracelet) accessoryList.push('wearing a stylish bracelet');
  
  if (accessoryList.length > 0) {
    prompt += `, ${accessoryList.join(', ')}`;
  }
  
  // Add photography specifications for realistic results
  prompt += '. High-quality portrait photography, professional lighting, warm and friendly expression, looking directly at camera, upper body shot, soft natural lighting, 4K resolution, photorealistic';
  
  return prompt;
}

// Generate avatar using OpenAI DALL-E API
export async function generateAvatar(config: AvatarConfig): Promise<GeneratedAvatar> {
  const prompt = generateAvatarPrompt(config);
  
  try {
    // For development/demo - return a placeholder image
    if (import.meta.env.DEV || !import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('Generated prompt:', prompt);
      
      // Return a placeholder service (we can replace this with actual AI generation)
      const placeholderImages = [
        'https://images.unsplash.com/photo-1494790108755-2616b90ad60c?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face'
      ];
      
      // Select image based on config for consistency
      const imageIndex = (config.name.length + config.gender.length + config.ethnicity.length) % placeholderImages.length;
      
      return {
        imageUrl: placeholderImages[imageIndex],
        prompt
      };
    }
    
    // Production: Use OpenAI DALL-E API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        response_format: 'url'
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('Invalid response from OpenAI API');
    }

    return {
      imageUrl: data.data[0].url,
      prompt
    };
    
  } catch (error) {
    console.error('Error generating avatar:', error);
    
    // Fallback to a default avatar
    return {
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b90ad60c?w=400&h=400&fit=crop&crop=face',
      prompt: `Fallback avatar for ${config.name}`
    };
  }
}

// Alternative: Generate avatar using other AI services
export async function generateAvatarAlternative(config: AvatarConfig): Promise<GeneratedAvatar> {
  // This could integrate with other services like:
  // - Replicate.com
  // - Stability AI
  // - Midjourney API (when available)
  // - Local Stable Diffusion
  
  const prompt = generateAvatarPrompt(config);
  
  // For now, return the same placeholder logic
  return generateAvatar(config);
}

// Utility function to validate avatar URL
export function isValidAvatarUrl(url: string): boolean {
  try {
    new URL(url);
    return url.includes('unsplash.com') || 
           url.includes('openai.com') || 
           url.includes('replicate.delivery') ||
           url.includes('stability.ai');
  } catch {
    return false;
  }
}

// Pre-defined avatar options for quick selection (if user doesn't want to generate)
export const PRESET_AVATARS = {
  female: [
    { name: 'Professional', url: 'https://images.unsplash.com/photo-1494790108755-2616b90ad60c?w=400&h=400&fit=crop&crop=face' },
    { name: 'Artistic', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face' },
    { name: 'Casual', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face' }
  ],
  male: [
    { name: 'Professional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
    { name: 'Artistic', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face' },
    { name: 'Casual', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' }
  ]
}; 