"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CommentVotesProps {
  score: number;
}

export function CommentVotes({ score }: CommentVotesProps) {
  const [currentVote, setCurrentVote] = useState<1 | 0 | -1>(0);
  const [voteScore, setVoteScore] = useState<number>(0);

  // Update local score when prop changes
  useEffect(() => {
    setVoteScore(score);
  }, [score]);

  const handleVote = (direction: 1 | -1) => {
    const newVote = currentVote === direction ? 0 : direction;
    const scoreDiff = newVote - currentVote;
    
    setCurrentVote(newVote);
    setVoteScore(prevScore => prevScore + scoreDiff);
  };

  return (
    <div className="flex items-center gap-0">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 p-0"
        onClick={() => handleVote(1)}
      >
        <ArrowUpIcon className={cn(
          "h-3 w-3",
          currentVote === 1 && "text-[#FE4500]"
        )} />
      </Button>
      <span className="text-sm font-medium min-w-[2rem] text-center">
        {voteScore}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 p-0"
        onClick={() => handleVote(-1)}
      >
        <ArrowDownIcon className={cn(
          "h-3 w-3",
          currentVote === -1 && "text-[#FE4500]"
        )} />
      </Button>
    </div>
  );
}