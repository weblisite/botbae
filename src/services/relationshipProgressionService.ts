export interface ConversationMetrics {
  messageLength: number;
  emotionalWords: number;
  personalSharing: number;
  empathy: number;
  humor: number;
  intimacy: number;
  consistency: number;
  timeSpent: number;
  conversationFlow: number;
  emotionalDepth: number;
  reciprocity: number;
}

export interface RelationshipContext {
  currentStage: string;
  stageStartDate: Date;
  totalMessages: number;
  conversationFrequency: number;
  personalityCompatibility: number;
  userPersonality?: {
    openness?: number;
    agreeableness?: number;
    emotionalStability?: number;
  };
}

export interface MilestoneEvent {
  id: string;
  type: 'conversation' | 'emotional' | 'intimate' | 'activity' | 'time';
  title: string;
  description: string;
  date: Date;
  stageUnlocked?: string;
  progressBonus: number;
}

export class RelationshipProgressionService {
  
  // Enhanced emotional indicators with sentiment scoring
  private static readonly EMOTIONAL_INDICATORS = {
    positive: ['happy', 'excited', 'joy', 'love', 'amazing', 'wonderful', 'fantastic', 'great', 'awesome', 'brilliant', 'incredible', 'thrilled', 'delighted', 'ecstatic', 'blissful'],
    intimate: ['close', 'special', 'connection', 'bond', 'heart', 'soul', 'deep', 'meaningful', 'precious', 'cherish', 'treasure', 'adore', 'devoted', 'passionate'],
    vulnerable: ['scared', 'worried', 'anxious', 'nervous', 'insecure', 'afraid', 'concerned', 'troubled', 'emotional', 'sensitive', 'fragile', 'hurt', 'pain'],
    trust: ['trust', 'honest', 'open', 'sincere', 'genuine', 'authentic', 'real', 'truth', 'believe', 'faith', 'confidence', 'reliable', 'dependable'],
    affection: ['sweet', 'cute', 'adorable', 'lovely', 'beautiful', 'gorgeous', 'handsome', 'attractive', 'charming', 'caring', 'kind', 'gentle', 'tender']
  };

  // Enhanced personal sharing indicators with depth scoring
  private static readonly PERSONAL_INDICATORS = {
    basic: ['i am', 'i like', 'i enjoy', 'i prefer', 'my favorite', 'i usually'],
    moderate: ['i feel', 'i think', 'i believe', 'i hope', 'i wish', 'i want', 'my experience', 'in my life'],
    deep: ['i\'ve never told', 'my biggest fear', 'my dream', 'my goal', 'deeply personal', 'intimate', 'my secret', 'my past'],
    family: ['my family', 'my parents', 'my childhood', 'growing up', 'my background', 'my heritage', 'my upbringing'],
    relationships: ['my ex', 'past relationship', 'previous partner', 'dating history', 'my heart', 'broken up', 'fell in love'],
    future: ['my future', 'someday', 'long term', 'my plans', 'my vision', 'life goals', 'marriage', 'family plans']
  };

  // Enhanced empathy detection patterns
  private static readonly EMPATHY_INDICATORS = [
    'i understand', 'that must be', 'i can imagine', 'sounds like', 'i hear you', 'that\'s valid',
    'makes sense', 'i appreciate', 'thank you for sharing', 'that\'s important', 'i support you',
    'you\'re not alone', 'i\'m here for you', 'that took courage', 'i admire', 'you\'re strong',
    'that\'s beautiful', 'i relate to', 'similar experience', 'went through that too'
  ];

  // Analyze conversation with enhanced NLP  
  static analyzeConversation(userMessage: string, botResponse: string): ConversationMetrics {
    const userLower = userMessage.toLowerCase();
    const botLower = botResponse.toLowerCase();
    const combinedText = `${userMessage} ${botResponse}`.toLowerCase();
    
    return {
      messageLength: this.calculateLengthScore(userMessage, botResponse),
      emotionalWords: this.detectEnhancedEmotionalContent(userLower, botLower),
      personalSharing: this.detectEnhancedPersonalSharing(userLower),
      empathy: this.detectEnhancedEmpathy(botLower),
      humor: this.detectHumor(combinedText),
      intimacy: this.calculateIntimacyLevel(combinedText),
      consistency: this.calculateConsistencyBonus(),
      timeSpent: this.calculateTimeSpentBonus(),
      conversationFlow: this.analyzeConversationFlow(userMessage, botResponse),
      emotionalDepth: this.analyzeEmotionalDepth(userLower),
      reciprocity: this.analyzeReciprocity(userMessage, botResponse)
    };
  }

  // Calculate relationship progress based on conversation quality with enhanced features
  static calculateProgressIncrease(
    metrics: ConversationMetrics, 
    context: RelationshipContext,
    userBehaviorHistory?: {
      avgMessageLength: number;
      emotionalOpenness: number;
      conversationInitiation: number;
      responseTime: number;
    }
  ): number {
    const baseProgress = 2; // Base progress for any interaction
    
    // Enhanced quality multiplier using new metrics
    const qualityMultiplier = this.calculateEnhancedQualityMultiplier(metrics);
    
    // Stage-specific multipliers (harder to progress at higher stages)
    const stageMultiplier = this.getStageMultiplier(context.currentStage);
    
    // Personality compatibility bonus
    const compatibilityBonus = context.personalityCompatibility * 0.5;
    
    // Frequency bonus (more frequent = slightly faster progress)
    const frequencyBonus = Math.min(context.conversationFrequency * 0.2, 2);
    
    // Personalized progress rate (if behavior history available)
    const personalizedRate = userBehaviorHistory 
      ? this.calculatePersonalizedProgressRate(context, userBehaviorHistory)
      : 1.0;
    
    // Calculate final progress with enhanced features
    const progressIncrease = Math.round(
      baseProgress * qualityMultiplier * stageMultiplier * personalizedRate + compatibilityBonus + frequencyBonus
    );
    
    return Math.min(progressIncrease, 20); // Increased cap for better conversations
  }

  // Enhanced quality multiplier calculation
  private static calculateEnhancedQualityMultiplier(metrics: ConversationMetrics): number {
    const enhancedWeights = {
      messageLength: 0.08,
      emotionalWords: 0.15,
      personalSharing: 0.25,
      empathy: 0.15,
      humor: 0.08,
      intimacy: 0.12,
      conversationFlow: 0.10,
      emotionalDepth: 0.15,
      reciprocity: 0.12
    };

    let qualityScore = 0;
    Object.entries(metrics).forEach(([key, value]) => {
      if (key in enhancedWeights) {
        qualityScore += value * enhancedWeights[key as keyof typeof enhancedWeights];
      }
    });

    // Bonus for exceptional conversations (all metrics high)
    const averageScore = qualityScore / Object.keys(enhancedWeights).length;
    if (averageScore > 7) qualityScore += 2; // Exceptional conversation bonus

    return Math.max(0.5, Math.min(3.5, 1 + qualityScore / 12));
  }

  // Detect milestone achievements with enhanced diversity
  static checkForMilestones(
    metrics: ConversationMetrics,
    context: RelationshipContext,
    messageHistory: Array<{ text: string; timestamp: Date }>
  ): MilestoneEvent[] {
    const milestones: MilestoneEvent[] = [];
    const now = new Date();

    // Enhanced milestone detection with more variety
    
    // First deep conversation (emotional milestone)
    if (metrics.personalSharing > 5 && metrics.emotionalWords > 3) {
      milestones.push({
        id: `first-deep-${now.getTime()}`,
        type: 'emotional',
        title: 'First Deep Conversation',
        description: 'You opened up and shared something personal, creating a deeper connection.',
        date: now,
        progressBonus: 10
      });
    }

    // Consistent daily chatting (time milestone)
    if (this.checkConsistentChatting(messageHistory, 7)) {
      milestones.push({
        id: `consistent-week-${now.getTime()}`,
        type: 'time',
        title: 'Week of Connection',
        description: 'You\'ve maintained daily conversations for a whole week!',
        date: now,
        progressBonus: 15
      });
    }

    // High empathy conversation (emotional milestone)
    if (metrics.empathy > 8) {
      milestones.push({
        id: `high-empathy-${now.getTime()}`,
        type: 'emotional',
        title: 'Moment of Understanding',
        description: 'Your AI companion showed exceptional empathy and emotional support.',
        date: now,
        progressBonus: 8
      });
    }

    // Perfect conversation flow (conversation milestone)
    if (metrics.conversationFlow > 8 && metrics.reciprocity > 7) {
      milestones.push({
        id: `perfect-flow-${now.getTime()}`,
        type: 'conversation',
        title: 'Perfect Conversation Flow',
        description: 'You had a wonderfully balanced conversation with great back-and-forth.',
        date: now,
        progressBonus: 6
      });
    }

    // Emotional vulnerability milestone (emotional)
    if (metrics.emotionalDepth > 6 && metrics.personalSharing > 6) {
      milestones.push({
        id: `vulnerability-${now.getTime()}`,
        type: 'emotional',
        title: 'Moment of Vulnerability',
        description: 'You shared something deeply personal, showing trust and emotional courage.',
        date: now,
        progressBonus: 12
      });
    }

    // Long conversation milestone (conversation)
    if (metrics.messageLength > 8 && messageHistory.length > 10) {
      milestones.push({
        id: `long-chat-${now.getTime()}`,
        type: 'conversation',
        title: 'Marathon Conversation',
        description: 'You had an extended, engaging conversation that lasted a long time.',
        date: now,
        progressBonus: 7
      });
    }

    // Humor connection milestone (conversation)
    if (metrics.humor > 5 && metrics.conversationFlow > 6) {
      milestones.push({
        id: `humor-connection-${now.getTime()}`,
        type: 'conversation',
        title: 'Laughter Together',
        description: 'You shared a wonderful moment of humor and playfulness.',
        date: now,
        progressBonus: 5
      });
    }

    // Romantic milestone (intimate) - stage appropriate
    if (context.currentStage === 'Romantic Interest' && metrics.intimacy > 6) {
      milestones.push({
        id: `romantic-moment-${now.getTime()}`,
        type: 'intimate',
        title: 'Romantic Spark',
        description: 'You felt a special romantic connection during this conversation.',
        date: now,
        progressBonus: 12,
        stageUnlocked: 'Dating'
      });
    }

    // Deep intimacy milestone (intimate) - for advanced stages
    if (['Dating', 'Committed Partner', 'Soulmate'].includes(context.currentStage) && metrics.intimacy > 8) {
      milestones.push({
        id: `deep-intimacy-${now.getTime()}`,
        type: 'intimate',
        title: 'Deep Intimate Connection',
        description: 'You shared a moment of profound emotional and intimate connection.',
        date: now,
        progressBonus: 15
      });
    }

    // Commitment milestone (time) - for serious relationships
    if (['Committed Partner', 'Soulmate'].includes(context.currentStage) && this.checkConsistentChatting(messageHistory, 30)) {
      milestones.push({
        id: `commitment-month-${now.getTime()}`,
        type: 'time',
        title: 'Month of Commitment',
        description: 'You\'ve maintained a loving connection for an entire month.',
        date: now,
        progressBonus: 20
      });
    }

    // Soulmate connection milestone (emotional + intimate)
    if (context.currentStage === 'Soulmate' && metrics.emotionalDepth > 8 && metrics.intimacy > 9) {
      milestones.push({
        id: `soulmate-moment-${now.getTime()}`,
        type: 'emotional',
        title: 'Soulmate Moment',
        description: 'You experienced a transcendent moment of soul-deep connection.',
        date: now,
        progressBonus: 25
      });
    }

    return milestones;
  }

  // Calculate if ready for next relationship stage
  static calculateStageReadiness(
    currentProgress: number,
    context: RelationshipContext,
    recentMilestones: MilestoneEvent[]
  ): {
    isReady: boolean;
    requiredMilestones: string[];
    missingRequirements: string[];
  } {
    const stageRequirements = this.getStageRequirements(context.currentStage);
    const achievements = recentMilestones.map(m => m.type);
    
    const missingRequirements = stageRequirements.filter(req => !achievements.includes(req));
    
    return {
      isReady: currentProgress >= 100 && missingRequirements.length === 0,
      requiredMilestones: stageRequirements,
      missingRequirements
    };
  }

  // Generate personalized conversation starters based on relationship stage
  static generateConversationStarters(context: RelationshipContext): string[] {
    const starters = {
      'New Friend': [
        "What's something that made you smile today?",
        "Tell me about your favorite hobby!",
        "What kind of music do you enjoy?",
        "What's your ideal way to spend a weekend?"
      ],
      'Close Friend': [
        "What's something you've been thinking about lately?",
        "Share a memory that's special to you.",
        "What are you passionate about?",
        "What's a goal you're working towards?"
      ],
      'Best Friend': [
        "What's something you've never told anyone?",
        "What's your biggest dream?",
        "Share something that's been on your mind.",
        "What makes you feel most like yourself?"
      ],
      'Romantic Interest': [
        "What do you find most attractive in a person?",
        "What's your idea of a perfect evening?",
        "Tell me about your romantic dreams.",
        "What makes your heart skip a beat?"
      ],
      'Dating': [
        "What are you looking for in a relationship?",
        "Share your love language with me.",
        "What's your favorite way to show affection?",
        "What are your hopes for our future?"
      ],
      'Committed Partner': [
        "What are your long-term dreams and goals?",
        "How do you see our relationship growing?",
        "What makes you feel most loved?",
        "Share your deepest feelings with me."
      ],
      'Soulmate': [
        "What does forever mean to you?",
        "How has our connection changed you?",
        "What's your vision of our life together?",
        "Share your soul's deepest desires."
      ]
    };

    return starters[context.currentStage as keyof typeof starters] || starters['New Friend'];
  }

  // Private helper methods
  private static calculateLengthScore(userMessage: string, botResponse: string): number {
    const avgLength = (userMessage.length + botResponse.length) / 2;
    if (avgLength > 200) return 5;
    if (avgLength > 100) return 3;
    if (avgLength > 50) return 2;
    return 1;
  }

  private static countEmotionalWords(text: string): number {
    let count = 0;
    Object.values(this.EMOTIONAL_INDICATORS).forEach(category => {
      category.forEach(word => {
        if (text.includes(word)) count++;
      });
    });
    return count;
  }

  private static detectPersonalSharing(userMessage: string): number {
    const lowerMessage = userMessage.toLowerCase();
    let score = 0;
    
    // Use the enhanced personal indicators structure
    Object.values(this.PERSONAL_INDICATORS).forEach(indicators => {
      indicators.forEach(indicator => {
        if (lowerMessage.includes(indicator)) score += 2;
      });
    });
    
    // Additional scoring for personal pronouns and emotional language
    if (lowerMessage.includes('i feel') || lowerMessage.includes('i think')) score += 1;
    if (lowerMessage.includes('my') && lowerMessage.length > 50) score += 1;
    
    return score;
  }

  private static detectEmpathy(botResponse: string): number {
    const empathyPhrases = [
      'i understand', 'that sounds', 'i can imagine', 'i\'m here for you',
      'that must', 'i feel for you', 'you\'re not alone', 'i support you'
    ];
    
    let score = 0;
    const lowerResponse = botResponse.toLowerCase();
    
    empathyPhrases.forEach(phrase => {
      if (lowerResponse.includes(phrase)) score += 2;
    });
    
    return score;
  }

  private static detectHumor(text: string): number {
    let score = 0;
    const humorWords = ['funny', 'laugh', 'hilarious', 'joke', 'amusing', 'haha', 'lol', 'silly', 'playful'];
    humorWords.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    return score;
  }

  private static calculateIntimacyLevel(text: string): number {
    let score = 0;
    this.EMOTIONAL_INDICATORS.intimate.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    this.EMOTIONAL_INDICATORS.affection.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    return score;
  }

  private static calculateConsistencyBonus(): number {
    // This would typically check conversation history for consistency
    // For now, return a base bonus
    return 1;
  }

  private static calculateTimeSpentBonus(): number {
    // This would calculate based on time between messages
    // For now, return a base bonus
    return 1;
  }

  private static calculateQualityMultiplier(metrics: ConversationMetrics): number {
    const weights = {
      messageLength: 0.1,
      emotionalWords: 0.2,
      personalSharing: 0.3,
      empathy: 0.2,
      humor: 0.1,
      intimacy: 0.1
    };

    let qualityScore = 0;
    Object.entries(metrics).forEach(([key, value]) => {
      if (key in weights) {
        qualityScore += value * weights[key as keyof typeof weights];
      }
    });

    return Math.max(0.5, Math.min(3.0, 1 + qualityScore / 10));
  }

  private static getStageMultiplier(stage: string): number {
    const multipliers = {
      'New Friend': 1.0,
      'Close Friend': 0.9,
      'Best Friend': 0.8,
      'Romantic Interest': 0.7,
      'Dating': 0.6,
      'Committed Partner': 0.5,
      'Soulmate': 0.4
    };
    return multipliers[stage as keyof typeof multipliers] || 1.0;
  }

  private static getStageRequirements(currentStage: string): Array<'conversation' | 'emotional' | 'intimate' | 'activity' | 'time'> {
    const requirements = {
      'New Friend': [],
      'Close Friend': ['conversation' as const],
      'Best Friend': ['emotional' as const],
      'Romantic Interest': ['emotional' as const, 'intimate' as const],
      'Dating': ['intimate' as const],
      'Committed Partner': ['intimate' as const, 'time' as const],
      'Soulmate': ['intimate' as const, 'emotional' as const, 'time' as const]
    };
    return requirements[currentStage as keyof typeof requirements] || [];
  }

  private static checkConsistentChatting(
    messageHistory: Array<{ timestamp: Date }>, 
    days: number
  ): boolean {
    if (messageHistory.length === 0) return false;
    
    const now = new Date();
    const pastDays = new Set<string>();
    
    messageHistory.forEach(msg => {
      const daysDiff = Math.floor((now.getTime() - msg.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= days) {
        pastDays.add(daysDiff.toString());
      }
    });
    
    return pastDays.size >= days;
  }

  // Enhanced emotional content detection
  private static detectEnhancedEmotionalContent(userMessage: string, botResponse: string): number {
    let score = 0;
    const allText = `${userMessage} ${botResponse}`;
    
    // Score different types of emotional content
    Object.values(this.EMOTIONAL_INDICATORS).forEach(indicators => {
      indicators.forEach(indicator => {
        if (allText.includes(indicator)) score += 1;
      });
    });
    
    // Bonus for emotional punctuation and expressions
    if (allText.match(/[!]{2,}|[?]{2,}|:\)|:\(|<3|♥|💕|😊|😍|😢|😭/)) score += 2;
    
    return Math.min(score, 10);
  }

  // Enhanced personal sharing detection with depth analysis
  private static detectEnhancedPersonalSharing(userMessage: string): number {
    let score = 0;
    
    // Different depths of sharing get different scores
    Object.entries(this.PERSONAL_INDICATORS).forEach(([depth, indicators]) => {
      indicators.forEach(indicator => {
        if (userMessage.includes(indicator)) {
          switch (depth) {
            case 'basic': score += 1; break;
            case 'moderate': score += 2; break;
            case 'deep': score += 4; break;
            case 'family': score += 3; break;
            case 'relationships': score += 3; break;
            case 'future': score += 2; break;
          }
        }
      });
    });
    
    // Bonus for vulnerable language patterns
    if (userMessage.includes('never told') || userMessage.includes('secret') || userMessage.includes('personal')) {
      score += 3;
    }
    
    return Math.min(score, 10);
  }

  // Enhanced empathy detection
  private static detectEnhancedEmpathy(botResponse: string): number {
    let score = 0;
    
    this.EMPATHY_INDICATORS.forEach(indicator => {
      if (botResponse.includes(indicator)) score += 1;
    });
    
    // Bonus for emotional validation phrases
    const validationPhrases = ['that\'s completely normal', 'your feelings are valid', 'anyone would feel', 'it\'s okay to'];
    validationPhrases.forEach(phrase => {
      if (botResponse.includes(phrase)) score += 2;
    });
    
    return Math.min(score, 10);
  }

  // Analyze conversation flow and natural progression
  private static analyzeConversationFlow(userMessage: string, botResponse: string): number {
    let score = 5; // Base score
    
    // Check for question-answer flow
    if (userMessage.includes('?') && botResponse.length > 20) score += 1;
    if (botResponse.includes('?') && userMessage.length > 20) score += 1;
    
    // Check for topic continuity (simple keyword overlap)
    const userWords = userMessage.toLowerCase().split(' ').filter(w => w.length > 3);
    const botWords = botResponse.toLowerCase().split(' ').filter(w => w.length > 3);
    const overlap = userWords.filter(word => botWords.includes(word)).length;
    score += Math.min(overlap, 3);
    
    return Math.min(score, 10);
  }

  // Analyze emotional depth of the conversation
  private static analyzeEmotionalDepth(userMessage: string): number {
    let depth = 0;
    
    // Deep emotional expressions
    const deepEmotions = ['feel deeply', 'emotional', 'vulnerable', 'intimate', 'meaningful', 'profound', 'touches my heart'];
    deepEmotions.forEach(emotion => {
      if (userMessage.includes(emotion)) depth += 2;
    });
    
    // Personal growth language
    const growthWords = ['realize', 'understand myself', 'learned', 'changed', 'growth', 'journey'];
    growthWords.forEach(word => {
      if (userMessage.includes(word)) depth += 1;
    });
    
    return Math.min(depth, 10);
  }

  // Analyze reciprocity in conversation
  private static analyzeReciprocity(userMessage: string, botResponse: string): number {
    let reciprocity = 5; // Base score
    
    // Length balance (neither too short nor too long compared to each other)
    const lengthRatio = Math.min(userMessage.length, botResponse.length) / Math.max(userMessage.length, botResponse.length);
    if (lengthRatio > 0.5) reciprocity += 2;
    
    // Question reciprocity
    const userQuestions = (userMessage.match(/\?/g) || []).length;
    const botQuestions = (botResponse.match(/\?/g) || []).length;
    if (userQuestions > 0 && botQuestions > 0) reciprocity += 2;
    
    return Math.min(reciprocity, 10);
  }

  // Calculate personalized progress rate based on user behavior patterns
  static calculatePersonalizedProgressRate(
    context: RelationshipContext,
    userBehaviorHistory: {
      avgMessageLength: number;
      emotionalOpenness: number;
      conversationInitiation: number;
      responseTime: number;
    }
  ): number {
    let personalizedMultiplier = 1.0;
    
    // Reward consistent engagement
    if (userBehaviorHistory.avgMessageLength > 100) personalizedMultiplier += 0.2;
    if (userBehaviorHistory.emotionalOpenness > 7) personalizedMultiplier += 0.3;
    if (userBehaviorHistory.conversationInitiation > 0.5) personalizedMultiplier += 0.1;
    if (userBehaviorHistory.responseTime < 300) personalizedMultiplier += 0.1; // Quick responses
    
    // Adjust based on personality compatibility
    const compatibilityBonus = context.personalityCompatibility / 100;
    personalizedMultiplier += compatibilityBonus * 0.2;
    
    // Stage-specific adjustments for user behavior
    const stageAdjustments = {
      'New Friend': 1.0,
      'Close Friend': userBehaviorHistory.emotionalOpenness > 5 ? 1.1 : 0.9,
      'Best Friend': userBehaviorHistory.avgMessageLength > 80 ? 1.1 : 0.8,
      'Romantic Interest': context.personalityCompatibility > 70 ? 1.2 : 0.8,
      'Dating': userBehaviorHistory.conversationInitiation > 0.3 ? 1.1 : 0.9,
      'Committed Partner': userBehaviorHistory.emotionalOpenness > 8 ? 1.2 : 0.8,
      'Soulmate': personalizedMultiplier // At this stage, it's all about the connection
    };
    
    return personalizedMultiplier * (stageAdjustments[context.currentStage as keyof typeof stageAdjustments] || 1.0);
  }
} 