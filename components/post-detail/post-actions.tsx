"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useRedditAuth } from "@/lib/auth/reddit-auth";
import { voteOnPost } from "@/lib/api/reddit-api";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: string;
  score: number;
  initialVote?: 1 | 0 | -1;
}

export function PostActions({ postId, score, initialVote = 0 }: PostActionsProps) {
  const { isAuthenticated, accessToken } = useRedditAuth();
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [voteScore, setVoteScore] = useState<number>(0);

  // Update local score when prop changes
  useEffect(() => {
    setVoteScore(score);
  }, [score]);

  const handleVote = async (direction: 1 | -1) => {
    if (!isAuthenticated || !accessToken) {
      window.alert('Please login to vote');
      return;
    }

    try {
      const newVote = currentVote === direction ? 0 : direction;
      const scoreDiff = newVote - currentVote;
      
      await voteOnPost(postId, newVote, accessToken);
      
      setCurrentVote(newVote);
      setVoteScore(prevScore => prevScore + scoreDiff);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={currentVote === 1 ? "default" : "ghost"} 
        size="icon"
        onClick={() => handleVote(1)}
      >
        <ArrowUpIcon className={cn(
          "h-5 w-5",
          currentVote === 1 && "text-[#FE4500]"
        )} />
      </Button>
      <span className="font-medium">{voteScore}</span>
      <Button 
        variant={currentVote === -1 ? "default" : "ghost"} 
        size="icon"
        onClick={() => handleVote(-1)}
      >
        <ArrowDownIcon className={cn(
          "h-5 w-5",
          currentVote === -1 && "text-[#FE4500]"
        )} />
      </Button>
    </div>
  );
}