import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Shield, Target, TrendingUp, Users, Award, Gift, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'lending' | 'borrowing' | 'social' | 'security' | 'milestone';
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const AchievementSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-supply',
      title: 'First Supply',
      description: 'Supply your first asset to the protocol',
      icon: TrendingUp,
      category: 'lending',
      progress: 1,
      maxProgress: 1,
      completed: true,
      reward: '50 XP',
      rarity: 'common'
    },
    {
      id: 'liquidity-provider',
      title: 'Liquidity Provider',
      description: 'Supply $1000+ in assets',
      icon: Target,
      category: 'lending',
      progress: 1500,
      maxProgress: 1000,
      completed: true,
      reward: '100 XP + 0.1% APY Boost',
      rarity: 'rare'
    },
    {
      id: 'degen-borrower',
      title: 'Degen Borrower',
      description: 'Borrow against your collateral',
      icon: Zap,
      category: 'borrowing',
      progress: 1,
      maxProgress: 1,
      completed: true,
      reward: '75 XP',
      rarity: 'common'
    },
    {
      id: 'safety-first',
      title: 'Safety First',
      description: 'Maintain health factor above 2.0 for 7 days',
      icon: Shield,
      category: 'security',
      progress: 5,
      maxProgress: 7,
      completed: false,
      reward: '200 XP + Safety Badge',
      rarity: 'epic'
    },
    {
      id: 'whale-status',
      title: 'Whale Status',
      description: 'Supply $10,000+ in assets',
      icon: Crown,
      category: 'milestone',
      progress: 1500,
      maxProgress: 10000,
      completed: false,
      reward: '500 XP + VIP Status',
      rarity: 'legendary'
    },
    {
      id: 'community-builder',
      title: 'Community Builder',
      description: 'Refer 5 friends to the platform',
      icon: Users,
      category: 'social',
      progress: 2,
      maxProgress: 5,
      completed: false,
      reward: '300 XP + Referral Bonus',
      rarity: 'rare'
    }
  ]);

  const [showAchievements, setShowAchievements] = useState(false);
  const [totalXP, setTotalXP] = useState(225);
  const [level, setLevel] = useState(3);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'rare': return 'border-blue-200';
      case 'epic': return 'border-purple-200';
      case 'legendary': return 'border-yellow-200';
      default: return 'border-gray-200';
    }
  };

  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalAchievements = achievements.length;

  return (
    <>
      {/* Achievement Button */}
      <button
        onClick={() => setShowAchievements(!showAchievements)}
        className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
      >
        <Trophy className="h-5 w-5" />
        {completedAchievements > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
            {completedAchievements}
          </span>
        )}
      </button>

      {/* Achievement Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                  <p className="text-gray-600 mt-1">Track your progress and earn rewards</p>
                </div>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress Summary */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <Trophy className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="text-xl font-bold text-gray-900">{level}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <Star className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total XP</p>
                      <p className="text-xl font-bold text-gray-900">{totalXP}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Achievements</p>
                      <p className="text-xl font-bold text-gray-900">{completedAchievements}/{totalAchievements}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercentage = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`border rounded-lg p-4 transition-all duration-200 ${
                        achievement.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      } ${getRarityBorder(achievement.rarity)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${achievement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Icon className={`h-5 w-5 ${achievement.completed ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">{achievement.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  achievement.completed ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Reward */}
                          <div className="mt-2 flex items-center">
                            <Gift className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-xs text-gray-600">{achievement.reward}</span>
                          </div>
                          
                          {/* Completion Status */}
                          {achievement.completed && (
                            <div className="mt-2 flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs text-green-600 font-medium">Completed!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default AchievementSystem; 